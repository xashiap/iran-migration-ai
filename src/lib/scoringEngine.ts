import { 
  UserProfile, 
  AnalysisResult, 
  CountryRecommendation, 
  RoadmapPhase,
  RoadmapStep,
  MatchedOpportunity
} from '../types/migration';
import { COUNTRIES_DATABASE } from '../data/immigrationRules';
import { GLOBAL_OPPORTUNITIES_DATABASE } from '../data/globalOpportunities';

export function evaluateImmigrationProfile(profile: UserProfile): AnalysisResult {
  // ۱. محاسبه امتیاز آمادگی کلی (Readiness Score: 0 - 100)
  let readiness = 20; // امتیاز پایه

  // سن
  if (profile.personal.age >= 21 && profile.personal.age <= 32) readiness += 15;
  else if (profile.personal.age <= 38) readiness += 10;
  else if (profile.personal.age <= 45) readiness += 5;

  // تحصیلات
  if (profile.education.degree === 'master' || profile.education.degree === 'phd') readiness += 15;
  else if (profile.education.degree === 'bachelor') readiness += 12;
  else if (profile.education.degree === 'associate') readiness += 6;

  // وضعیت آزادسازی مدرک
  if (profile.education.isDegreeReleased) readiness += 5;

  // زبان
  if (profile.languages.englishLevel === 'fluent' || profile.languages.englishLevel === 'advanced') readiness += 15;
  else if (profile.languages.englishLevel === 'intermediate') readiness += 10;
  else if (profile.languages.englishLevel === 'basic') readiness += 4;

  if (profile.languages.germanLevel !== 'none' || profile.languages.frenchLevel !== 'none') readiness += 10;

  // سابقه کار و بیمه
  if (profile.work.yearsExperience >= 3) readiness += 10;
  else if (profile.work.yearsExperience >= 1) readiness += 5;
  if (profile.work.hasOfficialInsurance) readiness += 5;
  if (profile.work.hasInternationalPortfolio) readiness += 5;

  // تمکن مالی
  if (profile.finances.liquidBudgetUSD >= 15000) readiness += 15;
  else if (profile.finances.liquidBudgetUSD >= 8000) readiness += 10;
  else if (profile.finances.liquidBudgetUSD >= 4000) readiness += 5;

  // جریمه خدمت سربازی مشمول
  if (profile.personal.gender === 'male' && profile.personal.militaryStatus === 'conscript') {
    readiness -= 25;
  }

  readiness = Math.max(10, Math.min(readiness, 98));

  // ۲. تعیین نقاط قوت کلیدی
  const keyStrengths: string[] = [];
  if (profile.education.degree === 'master' || profile.education.degree === 'phd') {
    keyStrengths.push(`مدرک تحصیلی سطح بالا (${profile.education.degree === 'phd' ? 'دکترا' : 'کارشناسی ارشد'}) امتیاز ویژه‌ای در تمام سیستم‌های امتیازبندی دارد.`);
  } else if (profile.education.degree === 'bachelor') {
    keyStrengths.push('داشتن مدرک لیسانس، پیش‌نیاز پایه برای انواع ویزاهای کاری تخصصی، کارت شانس و دوره‌های ارشد در خارج است.');
  }

  if (['computer_it', 'engineering', 'medical_health'].includes(profile.education.majorCategory)) {
    keyStrengths.push('رشته و حوزه شغلی شما در رده «مشاغل دارای کمبود نیروی مهارتی (Shortage Occupations)» در اروپا، کانادا و خاورمیانه قرار دارد.');
  }

  if (profile.languages.englishLevel === 'advanced' || profile.languages.englishLevel === 'fluent') {
    keyStrengths.push('تسلط عالی به زبان انگلیسی مسیر ارتباطی، مصاحبه‌ها و اپلای شما را چندین ماه جلو می‌اندازد.');
  }

  if (profile.languages.germanLevel === 'b1' || profile.languages.germanLevel === 'b2' || profile.languages.germanLevel === 'c1_c2') {
    keyStrengths.push('دانش زبان آلمانی در سطح B برگ برنده بی‌نظیری برای دریافت آسان جاب‌آفر، کارت شانس آلمان و تحصیل رایگان است.');
  }

  if (profile.work.hasOfficialInsurance && profile.work.insuranceYears >= 2) {
    keyStrengths.push(`سابقه بیمه رسمی تامین اجتماعی (${profile.work.insuranceYears} سال) قابل استعلام بین‌المللی با بارکد رسمی است و در بررسی ویزای کاری اعتماد آفیسر را جلب می‌کند.`);
  }

  if (profile.personal.age <= 32) {
    keyStrengths.push('سن شما در محدوده طلایی امتیازبندی مهاجرت کاری (اکسپرس اینتری، استرالیا و آلمان) قرار دارد.');
  }

  if (profile.finances.liquidBudgetUSD >= 15000) {
    keyStrengths.push('بودجه نقدی شما قابلیت پوشش حساب مسدود آلمان یا مخارج اولیه ویزای تحصیلی و کاری را فراهم می‌سازد.');
  }

  if (keyStrengths.length === 0) {
    keyStrengths.push('انگیزه بالا و سن مناسب برای شروع فرآیند مهارت‌آموزی و برنامه‌ریزی هدفمند.');
  }

  // ۳. تعیین چالش‌ها و موانع اصلی
  const keyChallenges: string[] = [];
  if (profile.personal.gender === 'male') {
    if (profile.personal.militaryStatus === 'conscript') {
      keyChallenges.push('وضعیت نظام وظیفه (مشمول بدون معافیت): تا زمان تعیین تکلیف سربازی یا اخذ معافیت تحصیلی، خروج قانونی از کشور میسر نیست.');
    } else if (profile.personal.militaryStatus === 'educational_exempt') {
      keyChallenges.push('معافیت تحصیلی دانشجویی: برای خروج نیازمند وثیقه در سامانه سخا یا ثبت پذیرش در سامانه سجاد هستید.');
    }
  }

  if (!profile.education.isDegreeReleased && (profile.education.universityType === 'state_top' || profile.education.universityType === 'state_regular')) {
    keyChallenges.push('آزادسازی مدرک دانشگاه روزانه: دانشنامه و ریزنمرات شما تا زمان لغو تعهد آموزش رایگان و تایید سجاد، قابلیت ترجمه رسمی با مهر دادگستری را ندارد.');
  }

  if (profile.languages.englishExam === 'none' && profile.languages.germanLevel === 'none') {
    keyChallenges.push('عدم داشتن مدرک زبان بین‌المللی رسمی (آیلتس، تافل یا گوته): این مورد اولویت شماره یک شما در ماه‌های پیش‌رو خواهد بود.');
  }

  if (!profile.work.hasOfficialInsurance && profile.work.yearsExperience > 0) {
    keyChallenges.push('عدم سابقه بیمه تامین اجتماعی: برای برخی کشورها (مثل استرالیا یا آلمان) اثبات سابقه کاری بدون بیمه نیازمند ارائه مستندات محکم مالیاتی، قرارداد شرکتی و فیش حقوقی است.');
  }

  if (profile.finances.liquidBudgetUSD < 6000 && !profile.finances.needsScholarshipOrFreeTuition) {
    keyChallenges.push('محدودیت بودجه ارزی: برای کشورهای پرهزینه، نیازمند تمرکز ویژه روی بورسیه‌های استانی (نظیر ایتالیا DSU) یا فاند پژوهشی هستید.');
  }

  if (!profile.personal.hasPassport || profile.personal.passportValidityMonths < 12) {
    keyChallenges.push('وضعیت گذرنامه: گذرنامه شما نیاز به تمدید یا صدور فوری با حداقل ۱ تا ۲ سال اعتبار دارد.');
  }

  // ۴. هشدارهای ویژه شهروندان مقیم ایران
  const iranSpecificAlerts: AnalysisResult['iranSpecificAlerts'] = [];

  if (profile.personal.gender === 'male') {
    if (profile.personal.militaryStatus === 'conscript') {
      iranSpecificAlerts.push({
        title: 'بحران نظام وظیفه - اقدام فوری',
        severity: 'critical',
        content: 'اگر قصد خروج قانونی دارید، در حال حاضر امکان دریافت پاسپورت یا خروج بدون معافیت وجود ندارد. سریع‌ترین راهکارها: ثبت‌نام در مقطع بالاتر (معافیت تحصیلی) یا بررسی معافیت‌های پزشکی/کفالت است.'
      });
    } else if (profile.personal.militaryStatus === 'completed') {
      iranSpecificAlerts.push({
        title: 'کارت پایان خدمت هوشمند',
        severity: 'tip',
        content: 'کارت پایان خدمت قدیمی کاغذی توسط دارالترجمه رسمی پذیرفته نمی‌شود؛ باید حتماً کارت هوشمند ملی نظام وظیفه را به دارالترجمه تحویل دهید.'
      });
    }
  }

  if (!profile.education.isDegreeReleased) {
    iranSpecificAlerts.push({
      title: 'سامانه سجاد و لغو تعهد آموزش رایگان',
      severity: 'warning',
      content: 'مدارک صادره از وزارت علوم باید از طریق سامانه سجاد (portal.saorg.ir) تایید و بارکد صحت ۲۰ رقمی دریافت کنند، در غیر این صورت اداره مترجمان دادگستری آن‌ها را پلمپ نخواهد کرد.'
    });
  }

  iranSpecificAlerts.push({
    title: 'نامه تمکن بانکی ریالی با نرخ ارز رسمی',
    severity: 'tip',
    content: 'بانک‌های ایرانی نامه تمکن را با نرخ ارز سامانه ETS / مرکز مبادله محاسبه می‌کنند، بنابراین مانده ریالی شما باید با توجه به این نرخ در نظر گرفته شود. از واریز پول مشکوک با گردش یک‌شبه خودداری فرمایید.'
  });

  iranSpecificAlerts.push({
    title: 'نوبت‌گیری ویزامتریک و VFS در تهران',
    severity: 'tip',
    content: 'کارگزاری‌های ویزامتریک (آلمان، ایتالیا) و VFS Global تهران در دوره‌های شلوغ ممکن است نوبت‌هایشان پر شود. به محض آماده شدن مدرک زبان و مدارک هویتی، برای تقویم نوبت‌گیری برنامه‌ریزی کنید.'
  });

  // ۵. ارزیابی و رتبه‌بندی کشورها
  const countryEvaluations: CountryRecommendation[] = [];

  for (const country of COUNTRIES_DATABASE) {
    let bestPathway = country.pathways[0];
    let highestPathwayScore = 0;
    let pathwayReason = '';

    for (const p of country.pathways) {
      const match = p.isSuitableFor(profile);
      if (match.score > highestPathwayScore) {
        highestPathwayScore = match.score;
        bestPathway = p;
        pathwayReason = match.reason;
      }
    }

    // ضریب هماهنگی با اولویت‌های شخصی کاربر
    let totalCountryScore = highestPathwayScore;

    // تطبیق بودجه
    if (profile.finances.liquidBudgetUSD < country.minimumBudgetUSD) {
      // اگر کشور ایتالیاست و کاربر مایل به بورسیه است، کسر نشود
      if (country.id === 'italy') {
        totalCountryScore += 5;
      } else {
        totalCountryScore -= 18;
      }
    } else {
      totalCountryScore += 6;
    }

    // اولویت کشورهای انتخابی کاربر
    if (profile.preferences.preferredCountries.includes(country.name)) {
      totalCountryScore += 12;
    }

    // اولویت زبان غیرانگلیسی
    if (!profile.preferences.openToNonEnglishCountries && (country.id === 'germany' || country.id === 'austria')) {
      if (profile.languages.germanLevel === 'none') {
        totalCountryScore -= 15;
      }
    }

    // اولویت هدف اصلی
    if (profile.preferences.primaryGoal === 'quick_pr' && (country.id === 'canada' || country.id === 'germany')) {
      totalCountryScore += 8;
    } else if (profile.preferences.primaryGoal === 'study_low_cost' && (country.id === 'italy' || country.id === 'germany' || country.id === 'austria')) {
      totalCountryScore += 10;
    } else if (profile.preferences.primaryGoal === 'job_immediate' && (country.id === 'uae_oman' || country.id === 'germany')) {
      totalCountryScore += 10;
    }

    totalCountryScore = Math.max(25, Math.min(totalCountryScore, 98));

    countryEvaluations.push({
      countryId: country.id,
      countryName: country.name,
      countryNameEn: country.nameEn,
      flag: country.flag,
      matchScore: Math.round(totalCountryScore),
      recommendedPathway: bestPathway.title,
      pathwayType: bestPathway.type,
      estimatedCostUSD: bestPathway.costUSD,
      estimatedTimeMonths: bestPathway.durationMonths,
      difficultyLevel: totalCountryScore > 80 ? 'آسان' : totalCountryScore > 60 ? 'متوسط' : 'چالش‌برانگیز',
      whyRecommended: pathwayReason || country.summary,
      keyRequirements: bestPathway.requirements,
      pros: country.pros,
      cons: country.cons
    });
  }

  // مرتب‌سازی کشورها بر اساس بیشترین تطابق
  countryEvaluations.sort((a, b) => b.matchScore - a.matchScore);
  const topCountries = countryEvaluations.slice(0, 5);
  const selectedTop = topCountries[0];

  // ۶. تولید رودمپ گام‌به‌گام اختصاصی از فاز صفر تا لندینگ
  const primaryRoadmap = generateDetailedRoadmap(profile, selectedTop);

  // ۷. تخمین هزینه‌های تفکیک شده
  const financialEstimate = calculateFinancialEstimate(profile, selectedTop);

  // ۸. پرسونای کاربر و خلاصه وضعیت
  const profilePersona = `متقاضی ${profile.personal.age} ساله در حوزه ${getMajorTitle(profile.education.majorCategory)} با مدرک ${getDegreeTitle(profile.education.degree)} و سطح زبان ${getEnglishTitle(profile.languages.englishLevel)}`;

  const overallSummary = `با توجه به بررسی موشکافانه سوابق تحصیلی، شغلی، وضعیت خدمت نظام وظیفه، منابع مالی در ایران و نیازهای بازار کار بین‌المللی، کشور «${selectedTop.countryName}» با مسیر «${selectedTop.recommendedPathway}» با نمره تطابق ${selectedTop.matchScore} از ۱۰۰ به عنوان اولویت نخست پیشنهاد می‌شود. برای شما یک نقشه راه گام‌به‌گام از نقطه صفر در داخل ایران (آزادسازی مدرک، ترجمه رسمی و تمکن) تا زمان دریافت ویزا و استقرار در کشور مقصد طراحی گردیده است.`;

  return {
    overallSummary,
    profilePersona,
    readinessScore: readiness,
    keyStrengths,
    keyChallenges,
    iranSpecificAlerts,
    topCountries,
    primaryRoadmap,
    financialEstimate,
    dailyMatches: matchDailyOpportunities(profile, topCountries)
  };
}

function generateDetailedRoadmap(profile: UserProfile, topCountry: CountryRecommendation): AnalysisResult['primaryRoadmap'] {
  const phases: RoadmapPhase[] = [];

  // فاز ۰: کارهای اداری و قانونی درون ایران (Step 0 - داخل کشور)
  const phase0Steps: RoadmapStep[] = [];

  if (profile.personal.gender === 'male') {
    phase0Steps.push({
      id: 'step-military',
      title: 'تعیین تکلیف وضعیت نظام وظیفه و سامانه سخا',
      description: profile.personal.militaryStatus === 'completed'
        ? 'اطمینان از داشتن کارت هوشمند پایان خدمت و عدم مخدوش بودن آن جهت تحویل به دارالترجمه رسمی.'
        : 'ورود به سامانه سخا (sakha.epolice.ir) و ثبت درخواست معافیت تحصیلی یا بررسی وضعیت وثیقه خروج از کشور.',
      category: 'iran_admin',
      isIranSpecific: true,
      tips: 'کارت‌های پایان خدمت قدیمی پیش از سال ۱۳۹۰ نیاز به تعویض با کارت هوشمند دارند.',
      estimatedTime: '۱ تا ۲ هفته'
    });
  }

  phase0Steps.push({
    id: 'step-passport',
    title: 'بررسی یا صدور گذرنامه جدید (پلیس+۱۰)',
    description: 'در صورتی که گذرنامه ندارید یا کمتر از ۱۸ ماه از اعتبار آن باقی مانده، به دفاتر پلیس+۱۰ مراجعه و گذرنامه جدید دریافت کنید.',
    category: 'iran_admin',
    isIranSpecific: true,
    tips: 'همواره اسپل لاتین نام و نام خانوادگی خود را در گذرنامه با مدارک قبلی هماهنگ نگه دارید.',
    estimatedTime: '۱ تا ۲ هفته'
  });

  if (!profile.education.isDegreeReleased && profile.education.degree !== 'highschool') {
    phase0Steps.push({
      id: 'step-sajjad',
      title: 'آزادسازی دانشنامه و ثبت در سامانه سجاد (portal.saorg.ir)',
      description: 'اقدام برای لغو تعهد خدمت آموزش رایگان از طریق تسویه با دانشگاه، سابقه کار بیمه‌ای پس از تحصیل، یا نامه عدم کاریابی اداره کار، و سپس اخذ تاییدیه و بارکد سجاد.',
      category: 'iran_admin',
      isIranSpecific: true,
      tips: 'بدون کد سجاد، دادگستری و وزارت امور خارجه مدارک را تایید و مهر نخواهند کرد.',
      estimatedTime: '۲ تا ۶ هفته'
    });
  }

  phase0Steps.push({
    id: 'step-translation',
    title: 'ترجمه رسمی مدارک هویتی و تحصیلی با مهرهای دادگستری و وزارت امور خارجه',
    description: 'تحویل دانشنامه، ریزنمرات، شناسنامه، کارت ملی و کارت پایان خدمت به دارالترجمه رسمی رسمی زبان مقصد (انگلیسی، آلمانی یا ایتالیایی).',
    category: 'documents',
    isIranSpecific: true,
    tips: 'همیشه ۲ تا ۳ نسخه ترجمه رسمی تهیه کنید تا در مراحل مختلف با کمبود نسخه پلمپ‌شده مواجه نشوید.',
    estimatedTime: '۲ تا ۳ هفته'
  });

  phases.push({
    phaseNumber: 0,
    phaseTitle: 'فاز صفر: پیگیری‌های اداری و اسناد هویتی در ایران',
    duration: '۱ تا ۲ ماه',
    summary: 'تکلیف نظام وظیفه، دریافت پاسپورت، آزادسازی اصل دانشنامه‌ها، تاییدیه سجاد و ترجمه رسمی.',
    steps: phase0Steps
  });

  // فاز ۱: تقویت زبان و آزمون‌های بین‌المللی
  const phase1Steps: RoadmapStep[] = [];
  phase1Steps.push({
    id: 'step-language-prep',
    title: topCountry.countryId === 'germany' || topCountry.countryId === 'austria'
      ? 'فشرده‌سازی یادگیری زبان آلمانی یا ارتقای انگلیسی'
      : 'تمرکز بر تکنیک‌های آزمون زبان (IELTS / TOEFL / PTE)',
    description: topCountry.countryId === 'germany'
      ? 'برای کارت شانس حداقل زبان آلمانی A1/A2 یا انگلیسی B2 و برای کار تخصصی تلاش برای رسیدن به مدرک Goethe B1/B2.'
      : 'ثبت‌نام در دوره‌های آمادگی آزمون آیلتس آکادمیک یا جنرال و آزمون‌های ماک (شبیه‌ساز).',
    category: 'language',
    isIranSpecific: false,
    tips: 'آزمون‌های ماک استاندارد در تهران به شما در سنجش زمان و ارزیابی نقاط ضعف ریدینگ و رایتینگ کمک شایانی می‌کند.',
    estimatedTime: '۲ تا ۵ ماه'
  });

  phase1Steps.push({
    id: 'step-language-exam',
    title: 'ثبت‌نام و شرکت در آزمون رسمی زبان در مراکز معتبر',
    description: 'رزرو سنتر آزمون (سنترهای رسمی آیلتس و تافل در ایران یا آزمون گوته DSIT تهران در خیابان دیباجی).',
    category: 'language',
    isIranSpecific: true,
    tips: 'به دلیل تقاضای بالا، ثبت‌نام در سنتر گوته یا آیلتس تهران نیازمند رصد زمان‌بندی باز شدن سایت است.',
    estimatedTime: '۲ تا ۳ هفته'
  });

  phases.push({
    phaseNumber: 1,
    phaseTitle: 'فاز یک: تسلط بر زبان و مدرک بین‌المللی',
    duration: '۳ تا ۶ ماه',
    summary: 'کسب نمره هدف در آیلتس/تافل یا اخذ مدرک زبان آلمانی/ایتالیایی متناسب با پرونده.',
    steps: phase1Steps
  });

  // فاز ۲: آماده‌سازی مدارک بین‌المللی و رزومه‌سازی استاندارد
  const phase2Steps: RoadmapStep[] = [];
  phase2Steps.push({
    id: 'step-cv-sop',
    title: 'نگارش رزومه بین‌المللی (EuroPass / Canadian Resume) و انگیزه‌نامه (SOP)',
    description: 'تنظیم رزومه تک‌صفحه‌ای یا دو‌صفحه‌ای استاندارد بدون اطلاعات حاشیه‌ای و نگارش انگیزه‌نامه قانع‌کننده که علت انتخاب مقصد و اهداف آینده را تبیین کند.',
    category: 'documents',
    isIranSpecific: false,
    tips: 'از فرمت‌های رایج مثل LaTeX یا تمپلیت‌های دانشگاه هاروارد یا یورپاس استفاده کنید.',
    estimatedTime: '۲ تا ۳ هفته'
  });

  if (topCountry.countryId === 'germany') {
    phase2Steps.push({
      id: 'step-zab-anabin',
      title: 'بررسی در سامانه آنابین (Anabin) و اخذ تاییدیه زاب (ZAB Statement of Comparability)',
      description: 'بررسی وضعیت اعتبار دانشگاه (H+) و رشته در بانک اطلاعاتی آنابین آلمان جهت معادل‌سازی رسمی مدارک تحصیلی.',
      category: 'documents',
      isIranSpecific: false,
      tips: 'اگر دانشگاه شما در آنابین H+ باشد، پرینت صفحه آنابین برای اکثر سفارت‌ها و کارگزاری کفایت می‌کند.',
      estimatedTime: '۲ تا ۴ هفته'
    });
  } else if (topCountry.countryId === 'canada') {
    phase2Steps.push({
      id: 'step-wes',
      title: 'ارزیابی مدارک تحصیلی از طریق WES کانادا (ECA)',
      description: 'ایجاد پروفایل در WES، ارسال ریزنمرات دانشگاهی به صورت مستقیم یا دیجیتال، و دریافت گزارش معادل‌سازی کانادایی.',
      category: 'documents',
      isIranSpecific: false,
      tips: 'دانشگاه آزاد و برخی دانشگاه‌های سراسری امکان ارسال مستقیم و الکترونیکی نمرات به WES را دارند.',
      estimatedTime: '۴ تا ۶ هفته'
    });
  }

  if (profile.work.hasOfficialInsurance) {
    phase2Steps.push({
      id: 'step-insurance-history',
      title: 'دریافت سوابق بیمه با کد اصالت و QR Code از سامانه eservices.tamin.ir',
      description: 'استخراج سوابق پرداخت حق بیمه تامین اجتماعی و ارائه به دارالترجمه جهت مهر دادگستری.',
      category: 'documents',
      isIranSpecific: true,
      tips: 'آفیسرهای ویزا کد QR و اصالت سابقه بیمه تامین اجتماعی ایران را به صورت آنلاین استعلام می‌کنند.',
      estimatedTime: '۱ هفته'
    });
  }

  phases.push({
    phaseNumber: 2,
    phaseTitle: 'فاز دو: پرونده‌سازی تخصصی و معادل‌سازی مدارک',
    duration: '۱ تا ۲ ماه',
    summary: 'معادل‌سازی مدرک تحصیلی، ساخت رزومه استاندارد بین‌المللی، استعلام بیمه و نگارش انگیزه‌نامه.',
    steps: phase2Steps
  });

  // فاز ۳: اپلای، ارسال درخواست و دریافت پذیرش یا جاب‌آفر
  const phase3Steps: RoadmapStep[] = [];
  if (topCountry.pathwayType === 'study') {
    phase3Steps.push({
      id: 'step-study-apply',
      title: 'ارسال اپلیکیشن تحصیلی به دانشگاه‌های مقصد',
      description: 'ثبت درخواست در پورتال‌های دانشگاهی (مانند Uni-Assist برای آلمان، Universitaly برای ایتالیا، یا پورتال مستقیم دانشگاه‌ها).',
      category: 'application',
      isIranSpecific: false,
      tips: 'پرداخت اپلیکیشن فی با استفاده از کارت‌های اعتباری بین‌المللی (مسترکارت/ویزا) از طریق صرافی‌ها یا شرکت‌های پرداخت ارزی ایرانی.',
      estimatedTime: '۲ تا ۳ ماه'
    });
    phase3Steps.push({
      id: 'step-offer-letter',
      title: 'دریافت نامه پذیرش رسمی (Admission Letter / Zulassung)',
      description: 'بررسی شروط پذیرش (مشروط به زبان یا غیرمشروط) و پرداخت دیپازیت در صورت الزام دانشگاه.',
      category: 'application',
      isIranSpecific: false,
      tips: 'پذیرش قطعی را برای اقدامات ویزا بلافاصله آماده داشته باشید.',
      estimatedTime: '۳ تا ۶ هفته'
    });
  } else {
    phase3Steps.push({
      id: 'step-job-apply',
      title: 'جستجوی فرصت‌های شغلی و ارسال درخواست هدفمند',
      description: 'فعالیت در لینکدین (LinkedIn)، پورتال‌های استخدامی کشور مقصد (مانند StepStone و Indeed) و ارسال رزومه سفارشی‌سازی شده.',
      category: 'application',
      isIranSpecific: false,
      tips: 'پروفایل لینکدین خود را کاملاً به انگلیسی تغییر دهید و لوکیشن یا تمایل به جابجایی (Open to Relocate) را فعال نمایید.',
      estimatedTime: '۲ تا ۴ ماه'
    });
  }

  phases.push({
    phaseNumber: 3,
    phaseTitle: 'فاز سه: فرآیند اپلای و دریافت تاییدیه اولیه',
    duration: '۲ تا ۴ ماه',
    summary: 'ارسال مدارک به موسسات، مصاحبه‌های اولیه آنلاین و دریافت تاییدیه معتبر یا نوبت کارت شانس.',
    steps: phase3Steps
  });

  // فاز ۴: تدارک امور مالی، تمکن و حساب بانکی
  const phase4Steps: RoadmapStep[] = [];
  if (topCountry.countryId === 'germany') {
    phase4Steps.push({
      id: 'step-blocked-account',
      title: 'افتتاح حساب مسدود ارزی آلمان (Sperrkonto)',
      description: 'افتتاح حساب آنلاین در موسساتی چون Fintiba یا Expatrio یا Coracle و واریز مبلغ تمکن یک‌ساله (حدود ۱۲ هزار یورو) از طریق صرافی‌های معتبر.',
      category: 'financial',
      isIranSpecific: true,
      tips: 'انتقال حواله صرافی به حساب آلمان حدود ۳ تا ۵ روز کاری زمان می‌برد؛ نامه تایید مسدودی (Blocking Confirmation) فوراً صادر می‌شود.',
      estimatedTime: '۱ تا ۲ هفته'
    });
  } else {
    phase4Steps.push({
      id: 'step-bank-statement',
      title: 'اخذ گواهی تمکن مالی و گردش حساب ۳ تا ۶ ماهه از بانک ایرانی',
      description: 'مراجعه به شعبه ارزی بانک در ایران و صدور نامه رسمی تمکن به زبان انگلیسی با درج معادل ارزی و مهر بین‌الملل بانک.',
      category: 'financial',
      isIranSpecific: true,
      tips: 'تاریخ صدور گواهی تمکن نباید بیش از ۲ الی ۳ هفته با روز تحویل مدارک به سفارت فاصله داشته باشد.',
      estimatedTime: '۳ تا ۵ روز'
    });
  }

  phases.push({
    phaseNumber: 4,
    phaseTitle: 'فاز چهار: تمکن مالی، حساب مسدود و اقدامات ارزی',
    duration: '۳ تا ۴ هفته',
    summary: 'انتقال وجوه لازم، دریافت گواهی تمکن لاتین با نرخ روز و آماده‌سازی تاییدیه‌های مالی.',
    steps: phase4Steps
  });

  // فاز ۵: وقت سفارت، روز مصاحبه و صدور ویزا
  const phase5Steps: RoadmapStep[] = [];
  phase5Steps.push({
    id: 'step-embassy-appointment',
    title: `رزرو نوبت در کارگزاری (${topCountry.countryId === 'germany' || topCountry.countryId === 'italy' ? 'ویزامتریک تهران' : 'VFS Global یا کشور همسایه'})`,
    description: 'ثبت‌نام آنلاین و دریافت وقت مصاحبه / تحویل مدارک به همراه فیش پرداخت هزینه نوبت‌گیری.',
    category: 'embassy',
    isIranSpecific: true,
    tips: 'پوشه مدارک را دقیقاً طبق چک‌لیست سفارت و به ترتیب خواسته شده در دو نسخه اصل و کپی مرتب کنید.',
    estimatedTime: '۱ تا ۴ ماه بسته به ترافیک وقت‌ها'
  });

  phase5Steps.push({
    id: 'step-visa-interview',
    title: 'حضور در روز مصاحبه و تحویل بیومتریک (انگشت‌نگاری)',
    description: 'پاسخ شفاف و بدون استرس به سوالات متداول آفیسر در خصوص اهداف سفر، تامین مالی، انگیزه و بازگشت به کشور.',
    category: 'embassy',
    isIranSpecific: false,
    tips: 'لباس رسمی و آراسته بپوشید و از پاسخ‌های مبهم یا متناقض با فرم اپلیکیشن شدیداً پرهیز کنید.',
    estimatedTime: '۱ روز کاری'
  });

  phase5Steps.push({
    id: 'step-visa-pickup',
    title: 'پیگیری پرونده، تحویل گذرنامه و چسباندن لیبل ویزا',
    description: 'دریافت ایمیل نتیجه از سفارت و مراجعه برای تحویل پاسپورت ویزا شده.',
    category: 'embassy',
    isIranSpecific: false,
    tips: 'تاریخ شروع و پایان ویزا و املای نام و نام خانوادگی روی لیبل ویزا را دقیقاً کنترل فرمایید.',
    estimatedTime: '۴ تا ۱۰ هفته'
  });

  phases.push({
    phaseNumber: 5,
    phaseTitle: 'فاز پنج: وقت سفارت، مصاحبه و اخذ ویزا',
    duration: '۲ تا ۴ ماه',
    summary: 'ارائه پرونده به آفیسر، انگشت‌نگاری و انتظار برای بررسی امنیتی و صدور ویزا.',
    steps: phase5Steps
  });

  // فاز ۶: اقدامات پیش از سفر و فرودگاه مقصد
  phases.push({
    phaseNumber: 6,
    phaseTitle: 'فاز شش: آماده‌سازی پرواز و استقرار در مقصد',
    duration: '۳ تا ۴ هفته',
    summary: 'خرید بلیت، رزرو خوابگاه/هتل اولیه، خرید بیمه مسافرتی و باز کردن حساب بانکی بدو ورود.',
    steps: [
      {
        id: 'step-flight-ticket',
        title: 'خرید بلیت پرواز و پرداخت عوارض خروج از کشور',
        description: 'تهیه بلیت هواپیما و پرداخت عوارض خروج از طریق سامانه سداد یا درگاه اینترنتی بانک ملی.',
        category: 'arrival',
        isIranSpecific: true,
        tips: 'عوارض خروج را حداقل ۲۴ ساعت قبل از پرواز آنلاین پرداخت کنید تا در سامانه فرودگاه امام خمینی ثبت شود.',
        estimatedTime: '۱ هفته'
      },
      {
        id: 'step-accommodation',
        title: 'رزرو اقامتگاه اولیه یا خوابگاه دانشجویی در شهر مقصد',
        description: 'هماهنگی قرارداد اجاره موقت (WG، خوابگاه یا AirBnB) جهت داشتن آدرس معتبر برای ثبت‌نام در شهرداری (Anmeldung).',
        category: 'arrival',
        isIranSpecific: false,
        tips: 'قبل از رسیدن به مقصد، به هیچ عنوان به آگهی‌های مشکوک مسکن پول ودیعه پرداخت نکنید.',
        estimatedTime: '۲ تا ۳ هفته'
      }
    ]
  });

  return {
    targetCountry: topCountry.countryName,
    pathwayTitle: topCountry.recommendedPathway,
    totalPhasesCount: phases.length,
    estimatedTotalDuration: topCountry.estimatedTimeMonths,
    phases
  };
}

function calculateFinancialEstimate(profile: UserProfile, topCountry: CountryRecommendation): AnalysisResult['financialEstimate'] {
  let iranAdminIRR = 'حدود ۳۵ تا ۶۰ میلیون تومان';
  if (profile.education.degree === 'master' || profile.education.degree === 'phd') {
    iranAdminIRR = 'حدود ۴۵ تا ۸۰ میلیون تومان (شامل ترجمه رسمی متعدد و تاییدات)';
  }

  let languageUSD = '300 $';
  if (profile.languages.englishExam === 'none' && profile.languages.germanLevel === 'none') {
    languageUSD = '400 - 650 $ (شامل ثبت‌نام آزمون رسمی و کلاس‌های آمادگی)';
  }

  let credentialUSD = '150 - 300 $';
  if (topCountry.countryId === 'canada') credentialUSD = '280 $ (WES ECA)';
  else if (topCountry.countryId === 'germany') credentialUSD = '220 € (ZAB در صورت لزوم)';

  let applicationFees = '150 - 500 $';
  if (topCountry.pathwayType === 'work') applicationFees = '100 - 250 $';

  let blockedOrProof = '۵,۰۰۰ تا ۱۵,۰۰۰ $';
  if (topCountry.countryId === 'germany') blockedOrProof = '11,904 € (حساب مسدود برای ۱ سال)';
  else if (topCountry.countryId === 'italy') blockedOrProof = '6,000 € (صرفاً در حساب ریالی ایران جهت تمکن)';
  else if (topCountry.countryId === 'canada') blockedOrProof = '20,635 $ CAD (تمکن قانونی)';

  const emergencyBuffer = '1,500 - 3,000 $';
  let totalStartingUSD = '12,000 - 16,000 $';
  if (topCountry.countryId === 'italy') totalStartingUSD = '4,500 - 6,500 $';
  else if (topCountry.countryId === 'uae_oman') totalStartingUSD = '3,000 - 5,000 $';
  else if (topCountry.countryId === 'canada') totalStartingUSD = '18,000 - 25,000 $';

  return {
    iranAdministrativeIRR: iranAdminIRR,
    languageExamsUSD: languageUSD,
    credentialEvaluationUSD: credentialUSD,
    applicationAndFeesUSD: applicationFees,
    blockedAccountOrProofUSD: blockedOrProof,
    emergencyBufferUSD: emergencyBuffer,
    totalStartingBudgetUSD: totalStartingUSD
  };
}

function getMajorTitle(category: string): string {
  switch (category) {
    case 'computer_it': return 'فناوری اطلاعات و مهندسی نرم‌افزار';
    case 'engineering': return 'مهندسی و فنی';
    case 'medical_health': return 'علوم پزشکی و درمان';
    case 'basic_sciences': return 'علوم پایه';
    case 'business_finance': return 'مدیریت و امور مالی';
    case 'humanities_art': return 'علوم انسانی و هنر';
    case 'vocational': return 'مشاغل مهارتی و فنی-حرفه‌ای';
    default: return 'تخصصی';
  }
}

function getDegreeTitle(degree: string): string {
  switch (degree) {
    case 'phd': return 'دکترا / تخصص';
    case 'master': return 'کارشناسی ارشد';
    case 'bachelor': return 'کارشناسی (لیسانس)';
    case 'associate': return 'کاردانی';
    case 'highschool': return 'دیپلم';
    default: return 'دانشگاهی';
  }
}

function getEnglishTitle(level: string): string {
  switch (level) {
    case 'fluent': return 'بومی / بسیار مسلط (Fluent)';
    case 'advanced': return 'پیشرفته (Advanced)';
    case 'intermediate': return 'متوسط (Intermediate)';
    case 'basic': return 'مقدماتی (Basic)';
    default: return 'پایین';
  }
}

/**
 * ماتریس تطبیق هوشمند فرصت‌های روزانه با پروفایل کاربر
 */
export function matchDailyOpportunities(
  profile: UserProfile,
  topCountries: CountryRecommendation[]
): MatchedOpportunity[] {
  const fieldLower = (profile.education.field || '').toLowerCase();
  const jobLower = (profile.work.jobTitle || '').toLowerCase();
  const majorCat = profile.education.majorCategory;
  const userCombinedText = `${fieldLower} ${jobLower}`;

  const scored = GLOBAL_OPPORTUNITIES_DATABASE.map((opp) => {
    let score = 70; // نمره پایه
    const reasons: string[] = [];

    const oppContent = (
      opp.title + ' ' + 
      opp.tags.join(' ') + ' ' + 
      opp.summary + ' ' + 
      opp.typeLabel + ' ' + 
      opp.institutionOrCompany + ' ' +
      opp.iranianCompatibility.keyRequirements.join(' ')
    ).toLowerCase();

    // ۱. تطبیق حوزه کاری و تحصیلی
    const isTechProfile = majorCat === 'computer_it' || 
      /برنامه|کامپیوتر|نرم|وب|طراح|front|back|full|react|node|python|devops|data|ai|it|ui|ux|سئو|دیجیتال|کد|شبکه/i.test(userCombinedText);
    
    const isEngineeringProfile = majorCat === 'engineering' || 
      /عمران|مکانیک|برق|صنایع|معمار|مهندس|civil|engineer|architect|mechanic|electric|industrial|سازه/i.test(userCombinedText);

    const isMedicalProfile = majorCat === 'medical_health' || 
      /پزشک|پرستار|دندان|دارو|درمان|مامایی|nurse|doctor|medical|dentist|pharma|health|بیمار/i.test(userCombinedText);

    const isBusinessFinanceProfile = majorCat === 'business_finance' || 
      /مالی|حسابدار|مدیریت|mba|مارکتینگ|فروش|بازاریابی|finance|accountant|marketing|business|اقتصاد/i.test(userCombinedText);

    const isVocationalProfile = majorCat === 'vocational' || 
      /فنی|حرفه|جوشکار|برقکار|مکانیک|تعمیر|تکنسین|نجار|آشپز|technician|craft|آوسبیلدونگ|trade/i.test(userCombinedText);

    const isAcademicResearch = (profile.education.degree === 'master' || profile.education.degree === 'phd') ||
      majorCat === 'basic_sciences' || majorCat === 'humanities_art';

    if (isTechProfile && /نرم‌افزار|برنامه‌نویسی|swe|devops|computer|ui|ux|fullstack|فناوری|data|داده|react/i.test(oppContent)) {
      score += 18;
      reasons.push('تطابق تخصصی مستقیم با مهارت‌های نرم‌افزاری و فناوری اطلاعات شما');
    } else if (isEngineeringProfile && /مهندسی|عمران|مکانیک|برق|مهندس|engineer|civil|طراحی/i.test(oppContent)) {
      score += 18;
      reasons.push('تقاضای بالا برای رشته‌های مهندسی و فنی در این موقعیت کاری');
    } else if (isMedicalProfile && /nurse|پرستار|پزشک|درمان|healthcare|بهداشت|moh/i.test(oppContent)) {
      score += 20;
      reasons.push('تطبیق فوری با کمبود مبرم کادر درمان و سلامت در کشور مقصد');
    } else if (isBusinessFinanceProfile && /حسابدار|مالی|مارکتینگ|accountant|finance|marketing|مدیریت/i.test(oppContent)) {
      score += 18;
      reasons.push('همخوانی با سوابق مدیریت مالی، حسابداری و مارکتینگ بین‌المللی');
    } else if (isVocationalProfile && /آوسبیلدونگ|تکنسین|technician|ssw|مهارتی|ausbildung|مشاغل/i.test(oppContent)) {
      score += 20;
      reasons.push('پذیرش بر اساس مهارت‌های فنی-عملی بدون الزام به مدارک تئوریک سنگین');
    } else if (isAcademicResearch && (opp.type === 'scholarship' || opp.id === 'us-postdoc-j1-cap-exempt' || opp.id === 'it-polimi-dsu-masters')) {
      score += 16;
      reasons.push('مناسب برای مقاطع تحصیلات تکمیلی و پژوهش‌های آکادمیک');
    }

    // بررسی انطباق مستقیم کلیدواژه‌های کاربر با تگ‌ها و متن فرصت
    const words = userCombinedText.split(/[\s,،-]+/).filter(w => w.length > 2);
    for (const w of words) {
      if (oppContent.includes(w)) {
        score += 6;
        break;
      }
    }

    // ۲. تطابق کشور با پیشنهادات برتر و انتخاب‌های کاربر
    const topCountryNames = topCountries.slice(0, 3).map(c => c.countryName);
    const userPreferred = profile.preferences.preferredCountries || [];

    if (topCountryNames.some(cName => opp.country.includes(cName) || cName.includes(opp.country))) {
      score += 12;
      reasons.push(`قرارگیری کشور ${opp.country} در اولویت‌های پیشنهادی پرونده شما`);
    } else if (userPreferred.some(cName => opp.country.includes(cName) || cName.includes(opp.country))) {
      score += 8;
      reasons.push(`همخوانی با کشور انتخابی مورد علاقه شما (${opp.country})`);
    }

    // ۳. تطابق هدف اصلی (کار سریع، تحصیل کم‌هزینه و...)
    if (profile.preferences.primaryGoal === 'job_immediate' && opp.type === 'job_offer') {
      score += 8;
      reasons.push('دریافت حقوق و درآمد ارزی از ماه نخست ورود بدون معطلی');
    } else if (profile.preferences.primaryGoal === 'study_low_cost' && (opp.type === 'scholarship' || opp.type === 'university_admission')) {
      score += 8;
      reasons.push('تامین شهریه و کمک‌هزینه زندگی دانشجویی جهت حفظ آرامش مالی');
    }

    // ۴. تطابق بودجه
    if (profile.finances.liquidBudgetUSD < 6000) {
      if (opp.type === 'scholarship' || opp.salaryOrFund.includes('بورسیه') || opp.salaryOrFund.includes('رایگان') || opp.region === 'gulf') {
        score += 8;
        reasons.push('امکان اقدام با بودجه اولیه محدود بدون نیاز به تمکن سنگین');
      }
    } else if (profile.finances.liquidBudgetUSD >= 12000) {
      if (opp.type === 'job_seeker_visa' || opp.region === 'americas' || opp.region === 'europe') {
        score += 5;
        reasons.push('کفایت کامل سرمایه برای پروسه ویزا و استقرار اولیه');
      }
    }

    // ۵. وضعیت نظام وظیفه
    if (profile.personal.gender === 'male') {
      if (profile.personal.militaryStatus === 'completed' || profile.personal.militaryStatus === 'medical_exempt' || profile.personal.militaryStatus === 'other_exempt') {
        score += 3;
      } else if (opp.iranianCompatibility.militarySensitive && (profile.personal.militaryStatus === 'conscript' || profile.personal.militaryStatus === 'educational_exempt')) {
        score -= 5;
      }
    }

    // محاسبه نهایی درصد تطابق
    const matchPercentage = Math.min(98, Math.max(82, score));
    const matchReason = reasons.length > 0 
      ? reasons.slice(0, 2).join(' و ') + '.'
      : `تطبیق بالا با پروفایل مهارتی و شانس بالای صدور ویزا در کشور ${opp.country}.`;

    return {
      ...opp,
      matchPercentage,
      matchReason,
    } as MatchedOpportunity;
  });

  // مرتب‌سازی بر اساس درصد تطابق
  scored.sort((a, b) => b.matchPercentage - a.matchPercentage);

  // انتخاب ۳ فرصت طلایی برتر
  return scored.slice(0, 3);
}
