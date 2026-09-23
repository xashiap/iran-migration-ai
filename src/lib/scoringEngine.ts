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
    if (profile.preferences.primaryGoal === 'quick_pr' && (country.id === 'canada' || country.id === 'germany' || country.id === 'sweden' || country.id === 'finland')) {
      totalCountryScore += 8;
    } else if (profile.preferences.primaryGoal === 'study_low_cost' && (country.id === 'italy' || country.id === 'germany' || country.id === 'austria' || country.id === 'finland' || country.id === 'norway')) {
      totalCountryScore += 10;
    } else if (profile.preferences.primaryGoal === 'job_immediate' && (country.id === 'uae_oman' || country.id === 'germany' || country.id === 'denmark' || country.id === 'sweden')) {
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

  // ۶. تولید رودمپ گام‌به‌گام اختصاصی برای تک‌تک کشورهای برتر
  topCountries.forEach((country) => {
    country.roadmap = generateDetailedRoadmap(profile, country);
  });

  const selectedTop = topCountries[0];
  const primaryRoadmap = selectedTop.roadmap || generateDetailedRoadmap(profile, selectedTop);

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
  const cid = topCountry.countryId;
  let phases: RoadmapPhase[] = [];

  if (cid === 'germany') {
    phases = getGermanyRoadmapPhases(profile, topCountry);
  } else if (cid === 'canada') {
    phases = getCanadaRoadmapPhases(profile, topCountry);
  } else if (cid === 'italy') {
    phases = getItalyRoadmapPhases(profile, topCountry);
  } else if (cid === 'austria') {
    phases = getAustriaRoadmapPhases(profile, topCountry);
  } else if (cid === 'uae_oman') {
    phases = getUaeOmanRoadmapPhases(profile, topCountry);
  } else if (cid === 'sweden') {
    phases = getSwedenRoadmapPhases(profile, topCountry);
  } else if (cid === 'denmark') {
    phases = getDenmarkRoadmapPhases(profile, topCountry);
  } else if (cid === 'norway') {
    phases = getNorwayRoadmapPhases(profile, topCountry);
  } else if (cid === 'finland') {
    phases = getFinlandRoadmapPhases(profile, topCountry);
  } else {
    phases = getGenericRoadmapPhases(profile, topCountry);
  }

  return {
    targetCountry: topCountry.countryName,
    pathwayTitle: topCountry.recommendedPathway,
    totalPhasesCount: phases.length,
    estimatedTotalDuration: topCountry.estimatedTimeMonths,
    phases
  };
}

// ۱. نقشه راه اختصاصی آلمان (کارت شانس، بلوکارت و تحصیلی)
function getGermanyRoadmapPhases(profile: UserProfile, country: CountryRecommendation): RoadmapPhase[] {
  const phases: RoadmapPhase[] = [];

  // فاز ۰
  phases.push({
    phaseNumber: 0,
    phaseTitle: 'فاز صفر: پیگیری‌های اداری و اسناد هویتی در ایران',
    duration: '۱ تا ۲ ماه',
    summary: 'تعیین تکلیف نظام وظیفه، دریافت پاسپورت، آزادسازی اصل دانشنامه‌ها، تاییدیه سجاد و ترجمه رسمی آلمانی.',
    steps: [
      ...(profile.personal.gender === 'male' ? [{
        id: 'de-military',
        title: 'تعیین تکلیف نظام وظیفه و سامانه سخا',
        description: profile.personal.militaryStatus === 'completed'
          ? 'اطمینان از داشتن کارت هوشمند پایان خدمت و عدم مخدوش بودن آن جهت تحویل به دارالترجمه رسمی.'
          : 'ورود به سامانه سخا (sakha.epolice.ir) و ثبت درخواست معافیت تحصیلی یا بررسی وضعیت وثیقه خروج از کشور.',
        category: 'iran_admin' as const,
        isIranSpecific: true,
        tips: 'کارت‌های پایان خدمت قدیمی پیش از سال ۱۳۹۰ نیاز به تعویض با کارت هوشمند دارند.',
        estimatedTime: '۱ تا ۲ هفته'
      }] : []),
      {
        id: 'de-passport',
        title: 'بررسی یا صدور گذرنامه جدید با حداقل ۱۸ ماه اعتبار',
        description: 'مراجعه به دفاتر پلیس+۱۰ جهت صدور یا تمدید پاسپورت. هماهنگی اسپل لاتین نام و نام خانوادگی الزامی است.',
        category: 'iran_admin',
        isIranSpecific: true,
        tips: 'حداقل ۱۸ ماه اعتبار پاسپورت برای صدور ویزای ملی آلمان (Type D) توصیه می‌شود.',
        estimatedTime: '۱ تا ۲ هفته'
      },
      ...(!profile.education.isDegreeReleased && profile.education.degree !== 'highschool' ? [{
        id: 'de-sajjad',
        title: 'آزادسازی دانشنامه و بارکد صحت در سامانه سجاد (portal.saorg.ir)',
        description: 'لغو تعهد آموزش رایگان از طریق تسویه با دانشگاه، سابقه کار بیمه‌ای پس از فراغت از تحصیل، یا گواهی عدم کاریابی.',
        category: 'iran_admin' as const,
        isIranSpecific: true,
        tips: 'بدون کد سجاد، دادگستری و امور خارجه مدارک تحصیلی شما را تایید نخواهند کرد.',
        estimatedTime: '۲ تا ۶ هفته'
      }] : []),
      {
        id: 'de-translation',
        title: 'ترجمه رسمی مدارک به زبان آلمانی یا انگلیسی با مهرهای دادگستری و امور خارجه',
        description: 'تحویل دانشنامه، ریزنمرات، شناسنامه و کارت پایان خدمت به دارالترجمه رسمی معتبر.',
        category: 'documents',
        isIranSpecific: true,
        tips: 'برای سفارت آلمان، ترجمه آلمانی یا انگلیسی معتبر است؛ ۲ نسخه کامل پلمپ‌شده تهیه نمایید.',
        estimatedTime: '۲ تا ۳ هفته'
      }
    ]
  });

  // فاز ۱
  phases.push({
    phaseNumber: 1,
    phaseTitle: 'فاز یک: تسلط بر زبان آلمانی یا انگلیسی',
    duration: '۳ تا ۶ ماه',
    summary: 'کسب مدرک رسمی گوته (Goethe) یا آیلتس متناسب با نوع ویزا (کارت شانس یا بلوکارت).',
    steps: [
      {
        id: 'de-lang-prep',
        title: 'آمادگی فشرده برای آزمون گوته (Goethe-Zertifikat) یا آیلتس',
        description: country.pathwayType === 'job_seeker'
          ? 'برای کارت شانس داشتن مدرک A1/A2 آلمانی امتیاز دارد و B1/B2 شانس کاریابی حضوری را چندین برابر می‌کند.'
          : 'برای دوره‌های انگلیسی آیلتس ۶.۵+ و برای موقعیت‌های کاری آلمانی سطح B1/B2 الزامی است.',
        category: 'language',
        isIranSpecific: false,
        tips: 'تمرکز بر بخش‌های مکالمه (Sprechen) و نگارش (Schreiben) کلید موفقیت در سنتر آزمون است.',
        estimatedTime: '۳ تا ۵ ماه'
      },
      {
        id: 'de-lang-exam',
        title: 'ثبت‌نام و شرکت در آزمون رسمی زبان در سنتر دیباجی تهران (DSIT)',
        description: 'رزرو به موقع سنتر گوته در تهران یا سنترهای بین‌المللی آیلتس/تافل در ایران.',
        category: 'language',
        isIranSpecific: true,
        tips: 'به دلیل ترافیک ثبت‌نام در موسسه گوته تهران، تقویم باز شدن ظرفیت‌ها را به صورت ماهانه رصد کنید.',
        estimatedTime: '۲ تا ۳ هفته'
      }
    ]
  });

  // فاز ۲
  phases.push({
    phaseNumber: 2,
    phaseTitle: 'فاز دو: ارزشیابی مدارک در آنابین، زاب و رزومه‌سازی آلمانی',
    duration: '۱ تا ۲ ماه',
    summary: 'تطبیق دانشگاه و رشته در سامانه Anabin، تاییدیه ZAB و ساخت رزومه استاندارد Lebenslauf.',
    steps: [
      {
        id: 'de-anabin',
        title: 'بررسی وضعیت دانشگاه در آنابین (Anabin) و صدور تاییدیه ZAB',
        description: 'بررسی وضعیت H+ دانشگاه ایرانی و مقطع تحصیلی در پورتال Anabin. در صورت نیاز به ارزشیابی، ارسال پرونده به دفتر مرکزی زاب (ZAB) در بن آلمان.',
        category: 'documents',
        isIranSpecific: false,
        tips: 'پرینت وضعیت H+ دانشگاه و رشته از سایت آنابین برای اکثر پرونده‌های سفارت الزامی است.',
        estimatedTime: '۲ تا ۴ هفته'
      },
      ...(profile.education.majorCategory === 'medical_health' ? [{
        id: 'de-approbation',
        title: 'اقدام برای تاییدیه صلاحیت حرفه‌ای کادر درمان (Defizitbescheid / Anerkennung)',
        description: 'ارسال مدارک پزشکی یا پرستاری به اداره بهداشت ایالت مقصد در آلمان جهت تطبیق و صدور نقص مدرک (Defizitbescheid).',
        category: 'documents' as const,
        isIranSpecific: false,
        tips: 'پرستاران و پزشکان با این نامه می‌توانند ویزای ۱۶d برای دوره انطباق و آزمون کنتکت دریافت کنند.',
        estimatedTime: '۲ تا ۳ ماه'
      }] : []),
      {
        id: 'de-lebenslauf',
        title: 'تنظیم رزومه استاندارد آلمانی (Lebenslauf) و انگیزه‌نامه تخصصی (Motivationsschreiben)',
        description: 'تدوین رزومه به زبان آلمانی یا انگلیسی با ساختار جدول‌بندی دقیق بدون فاصله‌های زمانی خالی (Lückenloser Lebenslauf).',
        category: 'documents',
        isIranSpecific: false,
        tips: 'کارفرمایان آلمانی به درج دقیق تاریخ‌های شروع و پایان هر پروژه و نقش فنی شما اهمیت ویژه‌ای می‌دهند.',
        estimatedTime: '۲ هفته'
      },
      ...(profile.work.hasOfficialInsurance ? [{
        id: 'de-tamin',
        title: 'استخراج سوابق بیمه تامین اجتماعی همراه با کد رهگیری QR',
        description: 'دریافت نسخه رسمی سوابق از درگاه خدمات الکترونیک سازمان تامین اجتماعی و تحویل به دارالترجمه.',
        category: 'documents' as const,
        isIranSpecific: true,
        tips: 'آفیسرهای ویزامتریک اصالت سابقه کار را از طریق QR کد تامین اجتماعی استعلام می‌کنند.',
        estimatedTime: '۱ هفته'
      }] : [])
    ]
  });

  // فاز ۳
  phases.push({
    phaseNumber: 3,
    phaseTitle: 'فاز سه: فرآیند اپلای (کارت شانس / جاب‌آفر / یونی‌اسیست)',
    duration: '۲ تا ۳ ماه',
    summary: 'محاسبه ۶ امتیاز کارت شانس و ثبت درخواست یا اخذ پذیرش از Uni-Assist / پورتال‌های استخدامی.',
    steps: [
      country.pathwayType === 'job_seeker' ? {
        id: 'de-chancenkarte-calc',
        title: 'محاسبه رسمی امتیازات کارت شانس آلمان (حداقل ۶ امتیاز از ۱۴)',
        description: 'جمع‌بندی امتیازات بر اساس مدرک تحصیلی (۴ امتیاز)، سن زیر ۳۵ سال (۲ امتیاز)، مدرک زبان (۱ تا ۳ امتیاز) و سوابق کاری مرتبط.',
        category: 'application',
        isIranSpecific: false,
        tips: 'داشتن مدرک دانشگاهی معتبر + مدرک زبان B2 انگلیسی یا A2 آلمانی به راحتی کف امتیاز ۶ را پوشش می‌دهد.',
        estimatedTime: '۱ تا ۲ هفته'
      } : country.pathwayType === 'study' ? {
        id: 'de-uni-assist',
        title: 'ارسال اپلیکیشن تحصیلی از طریق سامانه Uni-Assist یا پورتال دانشگاه',
        description: 'بارگذاری مدارک تایید شده در یونی‌اسیست، پرداخت اپلیکیشن فی با ویزاکارت و دریافت تاییدیه VPD.',
        category: 'application',
        isIranSpecific: false,
        tips: 'اپلیکیشن فی برای دانشگاه اول ۷۵ یورو و برای دانشگاه‌های بعدی ۳۰ یورو است.',
        estimatedTime: '۴ تا ۸ هفته'
      } : {
        id: 'de-job-hunting',
        title: 'ارسال هدفمند رزومه در StepStone، LinkedIn و پورتال‌های استخدامی آلمان',
        description: 'برقراری ارتباط مستقیم با شرکت‌ها و کارفرمایان آلمانی، شرکت در مصاحبه‌های فنی آنلاین و عقد قرارداد کاری معتبر با حداقل حقوق مصوب بلوکارت.',
        category: 'application',
        isIranSpecific: false,
        tips: 'پروفایل لینکدین خود را روی لوکیشن آلمان با عنوان Open to Relocate تنظیم فرمایید.',
        estimatedTime: '۲ تا ۴ ماه'
      },
      {
        id: 'de-official-doc',
        title: 'دریافت تاییدیه رسمی پذیرش یا قرارداد کاری معتبر (Arbeitsvertrag)',
        description: 'بررسی بندهای قرارداد کاری، بیمه درمانی و ساعت کاری یا دریافت نامه قطعی پذیرش (Zulassung).',
        category: 'application',
        isIranSpecific: false,
        tips: 'قرارداد کاری باید امضای کارفرما و مشخصات کامل شرکت با شناسه مالیاتی آلمان را داشته باشد.',
        estimatedTime: '۲ تا ۴ هفته'
      }
    ]
  });

  // فاز ۴
  phases.push({
    phaseNumber: 4,
    phaseTitle: 'فاز چهار: افتتاح حساب مسدود ارزی آلمان (Sperrkonto)',
    duration: '۲ تا ۴ هفته',
    summary: 'افتتاح آنلاین حساب در Expatrio / Fintiba و واریز ۱۱,۹۰۴ یورو مبلغ تمکن قانونی.',
    steps: [
      {
        id: 'de-open-sperrkonto',
        title: 'افتتاح آنلاین حساب مسدود در موسسات رسمی (Expatrio، Fintiba یا Coracle)',
        description: 'ثبت‌نام آنلاین با تصویر پاسپورت، انتخاب پکیج ارزش (شامل حساب مسدود + بیمه مسافرتی و بیمه دولتی رایگان TK).',
        category: 'financial',
        isIranSpecific: false,
        tips: 'موسسه Expatrio و Coracle کمترین کارمزد افتتاح حساب و سریع‌ترین فرآیند فعال‌سازی را برای ایرانیان دارند.',
        estimatedTime: '۲ تا ۳ روز'
      },
      {
        id: 'de-transfer-funds',
        title: 'حواله ارزی مبلغ تمکن یکساله (حدود ۱۲ هزار یورو) از طریق صرافی معتبر',
        description: 'واریز وجه ریالی به صرافی در ایران و ارسال حواله سوییفت به شماره IBAN حساب مسدود آلمان شما.',
        category: 'financial',
        isIranSpecific: true,
        tips: 'انتقال حواله معمولاً ۳ تا ۵ روز کاری زمان می‌برد؛ به محض وصول، نامه تایید مسدودی (Blocking Confirmation) فوراً صادر می‌شود.',
        estimatedTime: '۱ تا ۲ هفته'
      }
    ]
  });

  // فاز ۵
  phases.push({
    phaseNumber: 5,
    phaseTitle: 'فاز پنج: وقت کارگزاری ویزامتریک تهران و مصاحبه ویزا',
    duration: '۲ تا ۳ ماه',
    summary: 'رزرو نوبت ویزامتریک تهران، تحویل پوشه مدارک، انگشت‌نگاری و صدور ویزای ملی نوع D.',
    steps: [
      {
        id: 'de-visametric-book',
        title: 'رزرو نوبت در سامانه کارگزاری ویزامتریک تهران (خیابان بهشتی)',
        description: 'ورود به پورتال visametric.com/iran و پرداخت ودیعه ریالی کارت بانکی جهت قرارگیری در صف نوبت سفارت آلمان.',
        category: 'embassy',
        isIranSpecific: true,
        tips: 'در انتخاب نوع ویزا (کارت شانس، دانشجویی یا بلوکارت) دقت فرمایید تا پرونده به درستی هدایت شود.',
        estimatedTime: '۱ تا ۲ ماه بسته به ترافیک وقت‌ها'
      },
      {
        id: 'de-interview-attend',
        title: 'حضور در کارگزاری ویزامتریک، تحویل مدارک در دو نسخه و انجام بیومتریک',
        description: 'چیدمان پوشه مدارک دقیقاً طبق چک‌لیست سفارت (یک نسخه اصل و دو نسخه کپی) و مصاحبه کوتاه با کارشناس ایرانی کارگزاری.',
        category: 'embassy',
        isIranSpecific: true,
        tips: 'پاسخ‌های شما درباره برنامه کاری یا تحصیلی باید کاملاً با انگیزه‌نامه انطباق داشته باشد.',
        estimatedTime: '۱ روز کاری'
      },
      {
        id: 'de-visa-stamp',
        title: 'پیگیری پرونده در باجه پستی و درج لیبل ویزای شنگن ملی نوع D',
        description: 'دریافت پیامک تحویل پاسپورت و چسبانده شدن ویزای شنگن در گذرنامه.',
        category: 'embassy',
        isIranSpecific: false,
        tips: 'تاریخ شروع و پایان ویزا و اطلاعات درج‌شده را به دقت چک کنید.',
        estimatedTime: '۴ تا ۸ هفته'
      }
    ]
  });

  // فاز ۶
  phases.push({
    phaseNumber: 6,
    phaseTitle: 'فاز شش: پرواز، ثبت آدرس و استقرار در آلمان',
    duration: '۳ تا ۴ هفته',
    summary: 'خرید بلیت، ثبت آدرس شهرداری (Anmeldung)، فعال‌سازی بیمه TK و صدور کارت اقامت.',
    steps: [
      {
        id: 'de-flight',
        title: 'خرید بلیت پرواز به آلمان و پرداخت عوارض خروج',
        description: 'خرید بلیت یک‌طرفه یا رفت‌وبرگشت به مقصد فرانکفورت، مونیخ، دوسلدورف یا برلین.',
        category: 'arrival',
        isIranSpecific: true,
        tips: 'عوارض خروج را حداقل ۲۴ ساعت قبل از پرواز در سامانه سداد بانک ملی پرداخت نمایید.',
        estimatedTime: '۱ هفته'
      },
      {
        id: 'de-anmeldung-step',
        title: 'رزرو اقامتگاه اولیه و ثبت آدرس رسمی در شهرداری (Anmeldung)',
        description: 'مراجعه به اداره ثبت شهروندان (Bürgeramt / Rathaus) ظرف ۱۴ روز پس از ورود با برگه تاییدیه موجر (Wohnungsgeberbestätigung).',
        category: 'arrival',
        isIranSpecific: false,
        tips: 'بدون برگه ثبت آدرس شهرداری، امکان افتتاح حساب بانکی جاری و دریافت کارت شناسایی مالیاتی (Steuer-ID) وجود ندارد.',
        estimatedTime: '۲ هفته'
      },
      {
        id: 'de-residence-card',
        title: 'فعال‌سازی حساب مسدود، بیمه سلامت و دریافت کارت اقامت (Aufenthaltstitel)',
        description: 'ارسال برگه ثبت آدرس به اکسپاتریو/فینتیبا جهت آزاد شدن ماهانه مبالغ، و مراجعه به اداره اتباع (Ausländerbehörde) جهت دریافت کارت هوشمند اقامت.',
        category: 'arrival',
        isIranSpecific: false,
        tips: 'کارت اقامت الکترونیکی (eAT) حاوی اطلاعات هویتی و مجوز کار رسمی شما در آلمان است.',
        estimatedTime: '۳ تا ۶ هفته'
      }
    ]
  });

  return phases;
}

// ۲. نقشه راه اختصاصی کانادا (اکسپرس اینتری، ویزای تحصیلی و استانی)
function getCanadaRoadmapPhases(profile: UserProfile, country: CountryRecommendation): RoadmapPhase[] {
  const phases: RoadmapPhase[] = [];

  // فاز ۰
  phases.push({
    phaseNumber: 0,
    phaseTitle: 'فاز صفر: پیگیری‌های اداری و اسناد اولیه در ایران',
    duration: '۱ تا ۲ ماه',
    summary: 'بررسی اعتبار ۲ تا ۳ ساله پاسپورت، آزادسازی مدارک در سجاد و ترجمه رسمی انگلیسی.',
    steps: [
      {
        id: 'ca-passport',
        title: 'بررسی و تمدید پاسپورت با اعتبار بالا (۲ تا ۳ سال)',
        description: 'به دلیل اینکه مدت ویزا و پرمیت کانادا دقیقاً تا سقف اعتبار پاسپورت صادر می‌شود، داشتن حداکثر اعتبار حیاتی است.',
        category: 'iran_admin',
        isIranSpecific: true,
        tips: 'اگر کمتر از ۲ سال اعتبار دارید، پیش از شروع پروسه درخواست پاسپورت جدید ثبت نمایید.',
        estimatedTime: '۱ تا ۲ هفته'
      },
      ...(!profile.education.isDegreeReleased && profile.education.degree !== 'highschool' ? [{
        id: 'ca-sajjad',
        title: 'لغو تعهد آموزش رایگان در سامانه سجاد و دریافت ریزنمرات پلمپ‌شده',
        description: 'ثبت درخواست لغو تعهد در portal.saorg.ir و اخذ تاییدیه دانشنامه و ریزنمرات کامل دوره‌های دانشگاهی.',
        category: 'iran_admin' as const,
        isIranSpecific: true,
        tips: 'کانادا ریزنمرات تمامی ترم‌ها همراه با نمرات دروس افتاده را به طور کامل می‌خواهد.',
        estimatedTime: '۲ تا ۵ هفته'
      }] : []),
      {
        id: 'ca-trans',
        title: 'ترجمه رسمی انگلیسی مدارک با مهرهای دادگستری و وزارت امور خارجه',
        description: 'ترجمه رسمی مدارک هویتی، شناسنامه، سند ازدواج، سوابق تحصیلی و اسناد مالی به زبان انگلیسی.',
        category: 'documents',
        isIranSpecific: true,
        tips: 'سفارت کانادا به اصالت نام مترجم رسمی و بارکد دارالترجمه اهمیت بسیار زیادی می‌دهد.',
        estimatedTime: '۲ تا ۳ هفته'
      }
    ]
  });

  // فاز ۱
  phases.push({
    phaseNumber: 1,
    phaseTitle: 'فاز یک: آزمون زبان بین‌المللی (IELTS / CELPIP / TEF)',
    duration: '۳ تا ۵ ماه',
    summary: 'کسب نمره هدف CLB 7 تا CLB 9 در آیلتس جنرال یا آیلتس آکادمیک ۶.۵+ برای کانادا.',
    steps: [
      {
        id: 'ca-ielts',
        title: 'شرکت در آزمون رسمی IELTS (جنرال برای اکسپرس اینتری، آکادمیک برای تحصیلی)',
        description: 'کسب نمره هدف (حداقل ۷ در هر چهار مهارت جهت رسیدن به CLB 9 که نمره اکسپرس اینتری را به اوج می‌رساند).',
        category: 'language',
        isIranSpecific: false,
        tips: 'در سیستم CRS کانادا، نمره ۸ لیسنینگ و ۷ در سایر مهارت‌ها بیش از ۵۰ امتیاز پاداش به همراه دارد.',
        estimatedTime: '۳ تا ۴ ماه'
      },
      {
        id: 'ca-tef',
        title: '(اختیاری و امتیازآور) شرکت در آزمون زبان فرانسه TEF یا TCF Canada',
        description: 'با توجه به اولویت‌های استراتژیک جدید اداره مهاجرت کانادا (Francophone Category Draws)، تسلط نسبی به زبان فرانسه قبولی شما را قطعی می‌کند.',
        category: 'language',
        isIranSpecific: false,
        tips: 'داشتن سطح متوسط فرانسوی (NCLC 7) نمره قبولی در دراوهای اکسپرس اینتری را تا بیش از ۱۰۰ امتیاز پایین می‌آورد.',
        estimatedTime: '۳ تا ۶ ماه'
      }
    ]
  });

  // فاز ۲
  phases.push({
    phaseNumber: 2,
    phaseTitle: 'فاز دو: معادل‌سازی مدارک در WES کانادا (ECA) و ارزیابی سوابق',
    duration: '۱ تا ۲ ماه',
    summary: 'ایجاد پروفایل در WES Canada، ارسال الکترونیکی نمرات و تنظیم رزومه کانادایی.',
    steps: [
      {
        id: 'ca-wes',
        title: 'ارزیابی مدارک تحصیلی از طریق WES کانادا (Educational Credential Assessment)',
        description: 'ایجاد پرونده در wes.org/ca، دریافت کد ارجاع WES Reference Number و ارسال الکترونیکی یا پستی دانشنامه از دانشگاه ایرانی به تورنتو.',
        category: 'documents',
        isIranSpecific: false,
        tips: 'دانشگاه آزاد و اکثر دانشگاه‌های سراسری امکان ارسال مستقیم کارنامه دیجیتال به WES را فراهم کرده‌اند.',
        estimatedTime: '۴ تا ۶ هفته'
      },
      {
        id: 'ca-resume',
        title: 'نگارش رزومه استاندارد کانادایی (Canadian Resume Format) و تطبیق با کدهای NOC/TEER',
        description: 'حذف کامل عکس، سن، جنسیت و وضعیت تاهل از رزومه و نگارش نامه‌های سابقه کاری دقیقاً مطابق شرح وظایف کدهای شغلی کانادا.',
        category: 'documents',
        isIranSpecific: false,
        tips: 'نامه‌های سابقه کار باید در سربرگ رسمی شرکت با درج حقوق، ساعات کاری در هفته و مهر مدیر باشد.',
        estimatedTime: '۲ هفته'
      }
    ]
  });

  // فاز ۳
  phases.push({
    phaseNumber: 3,
    phaseTitle: 'فاز سه: سابمیت پروفایل Express Entry یا پذیرش تحصیلی با تاییدیه استانی (PAL)',
    duration: '۲ تا ۴ ماه',
    summary: 'ثبت پروفایل در سامانه IRCC و رصد دراوها، یا اخذ LOA و نامه استانی PAL برای تحصیلی.',
    steps: [
      country.pathwayType === 'study' ? {
        id: 'ca-loa-pal',
        title: 'اخذ نامه پذیرش رسمی (LOA) از دانشگاه‌های DLI و دریافت نامه تاییدیه استانی (PAL)',
        description: 'ارسال مدارک به کالج یا دانشگاه دارای کد DLI در کانادا، پرداخت بیعانه شهریه و دریافت نامه استانی جدید PAL الزامی برای ویزای تحصیلی.',
        category: 'application',
        isIranSpecific: false,
        tips: 'طبق قوانین جدید کانادا، بدون داشتن Provincial Attestation Letter (PAL) پرونده ویزای تحصیلی مستقیماً رد می‌شود.',
        estimatedTime: '۴ تا ۸ هفته'
      } : {
        id: 'ca-ee-profile',
        title: 'سابمیت پروفایل اکسپرس اینتری و رصد برنامه‌های نامزدی استانی (PNP)',
        description: 'ورود به پورتال مهاجرت کانادا (IRCC)، بارگذاری کدهای WES و آیلتس و قرارگیری در استخر متقاضیان (Express Entry Pool).',
        category: 'application',
        isIranSpecific: false,
        tips: 'اگر نمره CRS شما برای دراوهای فدرال لب‌مرزی است، استان‌های پرتقاضا مثل آلبرتا، انتاریو یا ساسکاچوان را برای نامزدی استانی (۶۰۰ امتیاز اضافه) هدف بگیرید.',
        estimatedTime: '۲ تا ۴ ماه'
      }
    ]
  });

  // فاز ۴
  phases.push({
    phaseNumber: 4,
    phaseTitle: 'فاز چهار: تمکن مالی، گواهی استطاعت (POF) و پرداخت هزینه‌های IRCC',
    duration: '۳ تا ۴ هفته',
    summary: 'صدور گواهی تمکن بانکی لاتین بر اساس جدول LICO اداره مهاجرت کانادا و اثبات منبع وجوه.',
    steps: [
      {
        id: 'ca-bank-statement',
        title: 'صدور گواهی تمکن بانکی لاتین و گردش حساب ۴ تا ۶ ماهه از بانک ایرانی',
        description: 'مراجعه به بانک در ایران و صدور نامه رسمی تمکن مالی به دلار کانادا مطابق آخرین جدول حداقل سرمایه سالانه LICO کانادا.',
        category: 'financial',
        isIranSpecific: true,
        tips: 'از واریز پول ناگهانی سنگین درست چند روز قبل از صدور تمکن پرهیز کنید؛ آفیسر پرینت حساب با گردش طبیعی و منطقی را ملاک می‌داند.',
        estimatedTime: '۳ تا ۵ روز'
      },
      {
        id: 'ca-source-funds',
        title: 'آماده‌سازی سند منبع پول (Source of Funds) و اسناد مالیاتی و ملکی',
        description: 'ترجمه اسناد مالکیت ملک، فیش حقوقی، جواز کسب یا فروش دارایی جهت اثبات قانونی بودن سرمایه به آفیسر ویزا.',
        category: 'financial',
        isIranSpecific: true,
        tips: 'توضیحات مالی شفاف در کاور لتر، ریسک ریجکت پرونده به دلایل مالی را به صفر نزدیک می‌کند.',
        estimatedTime: '۱ تا ۲ هفته'
      }
    ]
  });

  // فاز ۵
  phases.push({
    phaseNumber: 5,
    phaseTitle: 'فاز پنج: سابمیت پرونده در پورتال IRCC، سفر به کشور همسایه برای بیومتریک و پیکاپ ویزا',
    duration: '۲ تا ۵ ماه',
    summary: 'آپلود مدارک در IRCC، سفر به مراکز VAC استانبول/دبی/ایروان برای انگشت‌نگاری و پیکاپ پاسپورت.',
    steps: [
      {
        id: 'ca-portal-submit',
        title: 'آپلود کامل فرم‌های IMM و مدارک در پورتال رسمی اداره مهاجرت کانادا (IRCC)',
        description: 'تکمیل فرم‌های IMM 1294 یا IMM 0008، آپلود مدارک ترجمه‌شده و پرداخت هزینه بررسی ویزا و بیومتریک با کردیت‌کارت.',
        category: 'embassy',
        isIranSpecific: false,
        tips: 'تمام فایل‌های پی‌دی‌اف باید طبق حجم مجاز اعلامی و شفافیت بالا آپلود شوند.',
        estimatedTime: '۱ هفته'
      },
      {
        id: 'ca-vac-trip',
        title: 'سفر به یکی از دفاتر VAC در کشورهای همسایه (ترکیه، دبی، باکو یا ایروان) جهت انگشت‌نگاری',
        description: 'به دلیل عدم حضور سفارت فعال کانادا در تهران، دریافت نامه Biometric Instruction Letter و مراجعه به مراکز وک در استانبول/آنکارا/دبی ظرف ۳۰ روز.',
        category: 'embassy',
        isIranSpecific: true,
        tips: 'نوبت‌گیری آنلاین مرکز VAC را بلافاصله پس از دریافت نامه BIL رزرو نمایید.',
        estimatedTime: '۱ تا ۲ هفته'
      },
      {
        id: 'ca-ppr-pickup',
        title: 'دریافت ایمیل پاسپورت ریکوئست (PPR) و ارسال گذرنامه با خدمات پیکاپ',
        description: 'ارسال پاسپورت از طریق آژانس‌های معتبر دارای مجوز پیکاپ ویزای کانادا جهت الصاق ویزا به گذرنامه در کنسولگری آنکارا یا ابوظبی.',
        category: 'embassy',
        isIranSpecific: true,
        tips: 'برگه نامه ارسالی همراه با پاسپورت را پرینت و امضا نمایید.',
        estimatedTime: '۲ تا ۴ هفته'
      }
    ]
  });

  // فاز ۶
  phases.push({
    phaseNumber: 6,
    phaseTitle: 'فاز شش: لندینگ در کانادا، صدور پرمیت و آغاز زندگی',
    duration: '۳ تا ۴ هفته',
    summary: 'ورود به مرز هوایی کانادا، دریافت پرمیت کاغذی، صدور شماره ملی بیمه (SIN) و افتتاح حساب بانکی.',
    steps: [
      {
        id: 'ca-landing',
        title: 'خرید بلیت پرواز، لندینگ در فرودگاه کانادا (POE) و دریافت پرمیت کاغذی',
        description: 'ارائه نامه معرفی (Port of Entry Letter) به آفیسر مرزبانی CBSA در فرودگاه تورنتو، مونترال یا ونکوور و پرینت مجوز رسمی کار یا تحصیل.',
        category: 'arrival',
        isIranSpecific: false,
        tips: 'پرمیت کاغذی را قبل از خروج از اتاق افسر مرزبانی کنترل کنید تا مشخصات هویتی و اجازه کار در آن به درستی درج شده باشد.',
        estimatedTime: '۱ روز'
      },
      {
        id: 'ca-sin-number',
        title: 'مراجعه به شعب Service Canada جهت دریافت شماره بیمه ملی (SIN Number)',
        description: 'اخذ کد ۹ رقمی SIN جهت استخدام قانونی، پرداخت مالیات و بهره‌مندی از خدمات دولتی کانادا.',
        category: 'arrival',
        isIranSpecific: false,
        tips: 'صدور SIN Number در مراکز سرویس کانادا ظرف کمتر از نیم ساعت انجام می‌شود.',
        estimatedTime: '۱ تا ۲ روز'
      },
      {
        id: 'ca-bank-account',
        title: 'افتتاح حساب بانکی کانادایی (RBC، TD، Scotiabank یا CIBC)',
        description: 'مراجعه حضوری به بانک و فعال‌سازی حساب چک‌پوینت، کردیت‌کارت کانادایی و انتقال وجوه ارزی.',
        category: 'arrival',
        isIranSpecific: false,
        tips: 'اکثر بانک‌های کانادایی طرح‌های ویژه Newcomer بدون کارمزد ماهانه برای سال اول ارائه می‌دهند.',
        estimatedTime: '۱ هفته'
      }
    ]
  });

  return phases;
}

// ۳. نقشه راه اختصاصی ایتالیا (تحصیل ارشد با بورسیه DSU و کار)
function getItalyRoadmapPhases(profile: UserProfile, country: CountryRecommendation): RoadmapPhase[] {
  const phases: RoadmapPhase[] = [];

  phases.push({
    phaseNumber: 0,
    phaseTitle: 'فاز صفر: پیگیری‌های اداری و اسناد تحصیلی در ایران',
    duration: '۱ تا ۲ ماه',
    summary: 'لغو تعهد سجاد، دریافت ریزنمرات رسمی و ترجمه دادگستری به زبان انگلیسی یا ایتالیایی.',
    steps: [
      {
        id: 'it-passport',
        title: 'بررسی اعتبار پاسپورت (حداقل ۱۸ ماه اعتبار)',
        description: 'مراجعه به پلیس+۱۰ جهت تمدید یا تعویض گذرنامه برای پیشگیری از تداخل با اعتبار ویزای نوع D ایتالیا.',
        category: 'iran_admin',
        isIranSpecific: true,
        tips: 'حداقل ۱۸ ماه اعتبار پاسپورت برای صدور ویزای تحصیلی ایتالیا الزامی است.',
        estimatedTime: '۱ تا ۲ هفته'
      },
      {
        id: 'it-sajjad',
        title: 'لغو تعهد آموزش رایگان در سامانه سجاد و دریافت بارکد صحت الکترونیکی',
        description: 'اقدام برای آزادسازی دانشنامه در سامانه سجاد (portal.saorg.ir) جهت امکان پلمپ دادگستری و امور خارجه.',
        category: 'iran_admin',
        isIranSpecific: true,
        tips: 'سفارت ایتالیا مدارک تحصیلی بدون بارکد صحت وزارت علوم را به هیچ عنوان نمی‌پذیرد.',
        estimatedTime: '۲ تا ۵ هفته'
      },
      {
        id: 'it-trans',
        title: 'ترجمه رسمی مدارک تحصیلی و شناسنامه‌ای به زبان انگلیسی یا ایتالیایی',
        description: 'پلمپ رسمی مدارک با مهرهای دادگستری و وزارت امور خارجه جهت ارائه به کارگزاری ویزامتریک.',
        category: 'documents',
        isIranSpecific: true,
        tips: 'برای اکثر دانشگاه‌های انگلیسی‌زبان ایتالیا، ترجمه رسمی انگلیسی کفایت می‌کند و نیازی به ترجمه ایتالیایی نیست.',
        estimatedTime: '۲ تا ۳ هفته'
      }
    ]
  });

  phases.push({
    phaseNumber: 1,
    phaseTitle: 'فاز یک: تسلط بر زبان انگلیسی یا ایتالیایی',
    duration: '۲ تا ۴ ماه',
    summary: 'کسب نمره آیلتس ۶.۰+ یا تافل برای دوره‌های انگلیسی، یا آزمون CILS برای دوره‌های ایتالیایی.',
    steps: [
      {
        id: 'it-lang-exam',
        title: 'شرکت در آزمون آیلتس آکادمیک (حداقل نمره ۶ یا ۶.۵) یا تافل اینترنتی (۷۸+)',
        description: 'اخذ مدرک زبان بین‌المللی مورد تایید پورتال دانشگاه‌های ایتالیا نظیر پلی‌تکنیک میلان، ساپینزا یا تورین.',
        category: 'language',
        isIranSpecific: false,
        tips: 'برخی دانشگاه‌های ایتالیا نمره دولینگو بالای ۱۰۰ یا نامه انگلیسی‌بودن مقطع قبلی (Medium of Instruction) را نیز قبول دارند.',
        estimatedTime: '۲ تا ۴ ماه'
      }
    ]
  });

  phases.push({
    phaseNumber: 2,
    phaseTitle: 'فاز دو: ارزشیابی مدارک (Dichiarazione di Valore / CIMEA) و انگیزه‌نامه',
    duration: '۱ تا ۲ ماه',
    summary: 'اخذ تاییدیه ارزش تحصیلی DoV از کنسولگری تهران یا گواهی الکترونیکی چیمه (CIMEA).',
    steps: [
      {
        id: 'it-dov-cimea',
        title: 'ثبت درخواست گواهی تطبیق ارزش تحصیلی (DoV) یا ارزشیابی آنلاین CIMEA',
        description: 'ارسال مدارک به مرکز اطلاعات تحصیلی ایتالیا (CIMEA Statement of Comparability) یا نوبت سفارت تهران جهت صدور برگه ارزش تحصیلی (DoV).',
        category: 'documents',
        isIranSpecific: false,
        tips: 'دریافت گواهی CIMEA آنلاین و سریع‌تر از روند حضوری DoV در سفارت تهران است.',
        estimatedTime: '۳ تا ۵ هفته'
      },
      {
        id: 'it-sop',
        title: 'نگارش انگیزه‌نامه (Motivation Letter) و رزومه استاندارد دانشگاهی',
        description: 'تبیین دقیق علل انتخاب رشته و دانشگاه در ایتالیا، اساتید مورد نظر و برنامه‌های پس از فارغ‌التحصیلی.',
        category: 'documents',
        isIranSpecific: false,
        tips: 'دانشگاه‌های دولتی ایتالیا به تطابق سیلابس درسی مقطع کارشناسی با رشته ارشد توجه ویژه‌ای دارند.',
        estimatedTime: '۲ هفته'
      }
    ]
  });

  phases.push({
    phaseNumber: 3,
    phaseTitle: 'فاز سه: پیش‌ثبت‌نام پورتال Universitaly و اقدام برای پرونده بورسیه استانی (DSU)',
    duration: '۲ تا ۳ ماه',
    summary: 'پیش‌ثبت‌نام در سامانه دولتی Universitaly و آماده‌سازی مدارک بورسیه استانی ۸۰۰۰ یورویی DSU.',
    steps: [
      {
        id: 'it-universitaly-apply',
        title: 'پیش‌ثبت‌نام در سامانه دولتی وزارت علوم ایتالیا (Universitaly.it)',
        description: 'ایجاد پروفایل در سامانه رسمی Universitaly، بارگذاری مدرک پذیرش دانشگاه و انتخاب سفارت ایتالیا در تهران جهت ارسال اتوماتیک تاییدیه.',
        category: 'application',
        isIranSpecific: false,
        tips: 'بدون تاییدیه نهایی Universitaly، سفارت ایتالیا پرونده ویزای شما را تحویل نخواهد گرفت.',
        estimatedTime: '۲ تا ۴ هفته'
      },
      {
        id: 'it-dsu-docs',
        title: 'تشکیل پرونده مدارک بورسیه استانی (DSU / EDiSU / LazioDisco / ER.GO)',
        description: 'ترجمه رسمی مدارک مالی خانواده در ایران: فیش حقوقی یا حکم بازنشستگی سرپرست، اجاره‌نامه مسکونی یا سند ملکی، و اقرارنامه مالی خانواده به همراه تاییدات دادگستری و امور خارجه.',
        category: 'application',
        isIranSpecific: true,
        tips: 'بورسیه استانی ایتالیا سالانه حدود ۸۰۰۰ یورو کمک‌هزینه نقدی بلاعوض، کارت غذای رایگان سلف و معافیت کامل شهریه به دانشجویان ایرانی اختصاص می‌دهد.',
        estimatedTime: '۳ تا ۶ هفته'
      },
      {
        id: 'it-isee-calc',
        title: 'اخذ گواهی شاخص وضعیت اقتصادی برابر (ISEE Parificato) از مراکز CAF ایتالیا',
        description: 'ارسال مدارک ترجمه‌شده درآمد خانواده به مراکز مالیاتی CAF در ایتالیا جهت محاسبه شاخص ایزه و بارگذاری در پورتال بورسیه استان مربوطه.',
        category: 'application',
        isIranSpecific: false,
        tips: 'عدد ISEE خانواده‌های ایرانی به دلیل تبدیل ریال به یورو همیشه بسیار پایین‌تر از سقف مجاز (۲۵ هزار یورو) درمی‌آید و شانس دریافت بورسیه بالای ۹۵٪ است.',
        estimatedTime: '۲ تا ۳ هفته'
      }
    ]
  });

  phases.push({
    phaseNumber: 4,
    phaseTitle: 'فاز چهار: تمکن مالی ریالی در حساب بانک ایرانی (بدون نیاز به حساب مسدود)',
    duration: '۲ تا ۳ هفته',
    summary: 'صدور نامه تمکن مالی ارزی از بانک ایرانی معادل حدود ۶۰۰۰ یورو بر مبنای نرخ رسمی ETS.',
    steps: [
      {
        id: 'it-bank-cert',
        title: 'صدور گواهی تمکن مالی لاتین از بانک ایرانی (حدود ۶۰۰۰ یورو)',
        description: 'مراجعه به بانک در ایران و صدور گواهی تمکن مالی لاتین به نام متقاضی یا سرپرست بر پایه نرخ ارز سامانه ETS / مرکز مبادله.',
        category: 'financial',
        isIranSpecific: true,
        tips: 'برخلاف آلمان، ایتالیا نیازی به مسدود کردن پول در خارج از کشور ندارد و وجه پس از صدور گواهی در حسابتان باقی می‌ماند.',
        estimatedTime: '۳ تا ۵ روز'
      },
      {
        id: 'it-financial-affidavit',
        title: 'تنظیم تعهدنامه مالی محضری سرپرست در دفتر اسناد رسمی',
        description: 'تعهد رسمی پدر یا مادر مبنی بر تقبل کلیه مخارج تحصیلی و اقامتی دانشجو در ایتالیا و ترجمه رسمی آن با مهر دادگستری.',
        category: 'financial',
        isIranSpecific: true,
        tips: 'تعهد محضری به همراه فیش حقوقی سرپرست، سند معتبر حمایت مالی نزد آفیسر کنسولی تلقی می‌شود.',
        estimatedTime: '۱ هفته'
      }
    ]
  });

  phases.push({
    phaseNumber: 5,
    phaseTitle: 'فاز پنج: وقت کارگزاری ویزامتریک تهران (بخش ایتالیا) و مصاحبه ویزای ملی (Type D)',
    duration: '۱ تا ۳ ماه',
    summary: 'رزرو نوبت در ویزامتریک تهران، تحویل پوشه مدارک و اخذ ویزای یک‌ساله شنگن تحصیلی.',
    steps: [
      {
        id: 'it-visametric-book',
        title: 'رزرو نوبت ویزامتریک تهران در بازه زمانی بازگشایی تقویم دانشجویی (تابستان)',
        description: 'ورود به پورتال کارگزاری ویزامتریک تهران (بخش سفارت ایتالیا)، رزرو نوبت تحویل مدارک دانشجویی و پرداخت ودیعه ریالی.',
        category: 'embassy',
        isIranSpecific: true,
        tips: 'تقویم وقت‌های دانشجویی معمولاً از اواخر بهار تا مردادماه باز می‌شود؛ به محض باز شدن ثبت‌نام کنید.',
        estimatedTime: '۳ تا ۶ هفته'
      },
      {
        id: 'it-visa-submit',
        title: 'تحویل حضوری مدارک، انجام انگشت‌نگاری و بررسی ویزای نوع D',
        description: 'ارائه پرینت تاییدیه Universitaly، نامه تمکن مالی، مدارک بورسیه استانی، بیمه مسافرتی و اصل پاسپورت.',
        category: 'embassy',
        isIranSpecific: true,
        tips: 'نسخه‌های اصل ترجمه‌ها و کپی‌های واضح از تمام صفحات پاسپورت همراه داشته باشید.',
        estimatedTime: '۱ روز کاری'
      },
      {
        id: 'it-visa-collect',
        title: 'تحویل گذرنامه ویزا شده از باجه پستی یا باجه تحویل کارگزاری',
        description: 'دریافت گذرنامه به همراه برچسب ویزای ملی نوع D ایتالیا با اعتبار اولیه یک‌ساله.',
        category: 'embassy',
        isIranSpecific: false,
        tips: 'تاریخ اعتبار ویزا معمولاً از اوایل سپتامبر (شروع سال تحصیلی) آغاز می‌شود.',
        estimatedTime: '۳ تا ۶ هفته'
      }
    ]
  });

  phases.push({
    phaseNumber: 6,
    phaseTitle: 'فاز شش: ورود به ایتالیا، پرمسو دی سوجورنو (Permesso) و دریافت بورسیه',
    duration: '۳ تا ۴ هفته',
    summary: 'پرواز به ایتالیا، ارسال کیت پستی کارت اقامت ظرف ۸ روز کاری و اخذ کد مالیاتی.',
    steps: [
      {
        id: 'it-flight',
        title: 'خرید بلیت پرواز به رم یا میلان و عوارض خروج از ایران',
        description: 'تهیه بلیت هواپیما و ورود به خاک ایتالیا پیش از شروع کلاس‌های توجیهی دانشگاه.',
        category: 'arrival',
        isIranSpecific: true,
        tips: 'پرینت مدارک پذیرش و آدرس محل سکونت اولیه را در چمدان دستی همراه داشته باشید.',
        estimatedTime: '۱ هفته'
      },
      {
        id: 'it-permesso',
        title: 'مراجعه به اداره پست (Poste Italiane) ظرف ۸ روز کاری جهت درخواست پرمسو (کارت اقامت)',
        description: 'دریافت بسته کیت زرد‌رنگ اقامت از باجه Sportello Amico اداره پست، الصاق تمبر مالیاتی (Marca da Bollo ۱۶ یورویی) و دریافت برگه رسید پستی (Ricevuta).',
        category: 'arrival',
        isIranSpecific: false,
        tips: 'برگه رسید پستی ریچه‌ووتا (Ricevuta) تا زمان صدور کارت فیزیکی حکم اقامت قانونی و معتبر شما را دارد.',
        estimatedTime: '۸ روز اول ورود'
      },
      {
        id: 'it-codice-fiscale',
        title: 'اخذ کد مالیاتی (Codice Fiscale) و افتتاح حساب بانکی پستی (Postepay Evolution)',
        description: 'مراجعه به اداره درآمد ایتالیا (Agenzia delle Entrate) جهت دریافت برگه کد مالیاتی، و افتتاح حساب بانکی برای واریز اقساط بورسیه استانی DSU.',
        category: 'arrival',
        isIranSpecific: false,
        tips: 'شماره IBAN حساب بانکی ایتالیایی خود را سریعاً در پورتال بورسیه دانشگاه ثبت نمایید تا قسط اول بورسیه واریز شود.',
        estimatedTime: '۱ تا ۲ هفته'
      }
    ]
  });

  return phases;
}

// ۴. نقشه راه اختصاصی اتریش (تحصیل، گواهی عدم ممانعت، و کارت قرمز-سفید-قرمز)
function getAustriaRoadmapPhases(profile: UserProfile, country: CountryRecommendation): RoadmapPhase[] {
  const phases: RoadmapPhase[] = [];

  phases.push({
    phaseNumber: 0,
    phaseTitle: 'فاز صفر: پیگیری‌های اداری، سجاد و ترجمه رسمی آلمانی در ایران',
    duration: '۱ تا ۲ ماه',
    summary: 'آزادسازی دانشنامه در سجاد و ترجمه رسمی کلیه مدارک منحصراً به زبان آلمانی.',
    steps: [
      {
        id: 'at-passport',
        title: 'بررسی اعتبار گذرنامه با حداقل ۲ سال اعتبار',
        description: 'مراجعه به دفاتر پلیس+۱۰ جهت صدور گذرنامه جدید با بالاترین اعتبار ممکن جهت پوشش پروسه ویزای اتریش.',
        category: 'iran_admin',
        isIranSpecific: true,
        tips: 'پروسه اداری اتریش ممکن است تا ۶ الی ۹ ماه زمان ببرد؛ داشتن پاسپورت معتبر ضروری است.',
        estimatedTime: '۱ تا ۲ هفته'
      },
      ...(!profile.education.isDegreeReleased && profile.education.degree !== 'highschool' ? [{
        id: 'at-sajjad',
        title: 'آزادسازی مدارک در سامانه سجاد و دریافت کد صحت وزارت علوم',
        description: 'لغو تعهد آموزش رایگان و اخذ اصل دانشنامه و ریزنمرات جهت امکان تاییدات رسمی.',
        category: 'iran_admin' as const,
        isIranSpecific: true,
        tips: 'بدون بارکد سجاد، اداره مترجمان دادگستری مدارک را برای اتریش پلمپ نخواهد کرد.',
        estimatedTime: '۲ تا ۵ هفته'
      }] : []),
      {
        id: 'at-trans-german',
        title: 'ترجمه رسمی کلیه اسناد هویتی و تحصیلی منحصراً به زبان آلمانی',
        description: 'تحویل دانشنامه، ریزنمرات، شناسنامه و گواهی‌های دانشگاهی به دارالترجمه رسمی آلمانی با مهرهای دادگستری و امور خارجه.',
        category: 'documents',
        isIranSpecific: true,
        tips: 'دانشگاه‌های دولتی و سفارت اتریش در تهران ترجمه انگلیسی را برای بسیاری از فرآیندها نمی‌پذیرند؛ حتماً زبان آلمانی باشد.',
        estimatedTime: '۲ تا ۴ هفته'
      }
    ]
  });

  phases.push({
    phaseNumber: 1,
    phaseTitle: 'فاز یک: تسلط بر زبان آلمانی یا انگلیسی',
    duration: '۳ تا ۵ ماه',
    summary: 'کسب مدرک زبان آلمانی ÖSD اتریش یا گوته، یا آیلتس برای دوره‌های بین‌المللی.',
    steps: [
      {
        id: 'at-lang-exam',
        title: 'شرکت در آزمون زبان آلمانی ÖSD یا گوته (حداقل A2/B1 برای پذیرش مشروط با کالج زبان، یا C1 مستقیم)',
        description: 'ثبت‌نام در سنترهای رسمی آزمون ÖSD در تهران جهت دریافت مدرک زبان استاندارد اتریش.',
        category: 'language',
        isIranSpecific: false,
        tips: 'دانشگاه‌های اتریش به شما اجازه می‌دهند با مدرک A2 زبان آلمانی پذیرش مشروط بگیرید و دوره‌های زبان را در دانشگاه وین بگذرانید.',
        estimatedTime: '۳ تا ۵ ماه'
      }
    ]
  });

  phases.push({
    phaseNumber: 2,
    phaseTitle: 'فاز دو: گواهی عدم ممانعت تحصیلی در ایران و لگالایز سفارت اتریش در تهران',
    duration: '۱ تا ۲ ماه',
    summary: 'اخذ گواهی اشتغال به تحصیل دانشگاه دولتی ایران و تایید (لگالایز) مدارک در سفارت اتریش.',
    steps: [
      {
        id: 'at-studienplatz',
        title: 'اخذ گواهی اشتغال به تحصیل یا عدم ممانعت تحصیلی در ایران (Bestätigung der Studienplatz)',
        description: 'اخذ گواهی رسمی قبولی کنکور سراسری یا اشتغال به تحصیل در رشته و مقطع مشابه از دانشگاه سراسری یا آزاد معتبر در ایران (شرط کلیدی دانشگاه‌های دولتی اتریش).',
        category: 'documents',
        isIranSpecific: true,
        tips: 'اتریش طبق قانون آموزش عالی خود تاکید دارد که متقاضی باید در کشور خود حق ادامه تحصیل در آن رشته را داشته باشد.',
        estimatedTime: '۲ تا ۳ هفته'
      },
      {
        id: 'at-legalize',
        title: 'رزرو نوبت تایید مدارک (لگالایزیشن) در سفارت اتریش در تهران',
        description: 'حضور در سفارت اتریش (خیابان نیاوران / باهنر)، پرداخت هزینه لگالایزیشن یورویی و پلمپ دیپلماتیک مدارک ترجمه شده.',
        category: 'documents',
        isIranSpecific: true,
        tips: 'نوبت لگالایزیشن سفارت اتریش نیازمند ثبت‌نام در سامانه وقت‌دهی سفارت است؛ پوشه مدارک را با دقت بررسی کنید.',
        estimatedTime: '۳ تا ۶ هفته'
      }
    ]
  });

  phases.push({
    phaseNumber: 3,
    phaseTitle: 'فاز سه: ارسال پستی پرونده لگالایز شده به دانشگاه‌های اتریش و اخذ پذیرش',
    duration: '۲ تا ۳ ماه',
    summary: 'پست فیزیکی مدارک به دانشگاه وین (Universität Wien) یا گراتس و دریافت Zulassung.',
    steps: [
      {
        id: 'at-post-uni',
        title: 'ارسال پستی مدارک اصل لگالایز شده به دانشگاه وین (Uni Wien) یا TU Wien',
        description: 'ارسال بسته پلمپ‌شده از طریق پست بین‌المللی سریع (DHL یا TNT) به دبیرخانه پذیرش دانشجویان بین‌المللی دانشگاه مقصد.',
        category: 'application',
        isIranSpecific: false,
        tips: 'دانشگاه‌های اتریش بررسی پرونده را منحصراً پس از دریافت اصل نسخه فیزیکی لگالایز شده آغاز می‌کنند.',
        estimatedTime: '۴ تا ۸ هفته'
      },
      {
        id: 'at-admission-letter',
        title: 'دریافت برگه رسمی پذیرش قطعی (Zulassungsbescheid)',
        description: 'پرداخت شهریه هر ترم (حدود ۷۴۵ یورو در هر ترم برای دانشگاه‌های دولتی اتریش) و دریافت نامه تاییدیه رسمی جهت اقدام ویزا.',
        category: 'application',
        isIranSpecific: false,
        tips: 'نامه زولاسونگ اتریش تا ۳ ترم تحصیلی اعتبار دارد و به شما فرصت کافی برای اقدامات اقامتی می‌دهد.',
        estimatedTime: '۲ تا ۴ هفته'
      }
    ]
  });

  phases.push({
    phaseNumber: 4,
    phaseTitle: 'فاز چهار: تامین تمکن مالی و اثبات منبع وجوه (Source of Funds)',
    duration: '۳ تا ۴ هفته',
    summary: 'تامین تمکن در حساب ارزی طبق جدول قانون NAG اتریش و شفاف‌سازی منبع دارایی.',
    steps: [
      {
        id: 'at-bank-pof',
        title: 'تامین تمکن مالی در حساب ارزی شخصی مطابق قانون اقامت اتریش (NAG)',
        description: 'صدور گواهی تمکن بانکی لاتین (برای متقاضیان زیر ۲۴ سال حدود ۶۵۰ یورو در ماه و برای بالای ۲۴ سال حدود ۱۲۵۰ یورو در ماه برای مدت یک سال).',
        category: 'financial',
        isIranSpecific: true,
        tips: 'مبلغ باید در حساب بانکی معتبر با درج معادل یورویی نگهداری شود.',
        estimatedTime: '۱ هفته'
      },
      {
        id: 'at-source-funds',
        title: 'اثبات شفاف منبع درآمد (Source of Funds) و اسناد مالی سرپرست به زبان آلمانی',
        description: 'ترجمه فیش‌های حقوقی سرپرست، اسناد شغلی، مالیاتی و ملکی به زبان آلمانی جهت اقناع آفیسر مالی سفارت.',
        category: 'financial',
        isIranSpecific: true,
        tips: 'سفارت اتریش نسبت به منبع شفاف پول واریزی بسیار حساس و دقیق است.',
        estimatedTime: '۱ تا ۲ هفته'
      }
    ]
  });

  phases.push({
    phaseNumber: 5,
    phaseTitle: 'فاز پنج: وقت مستقیم سفارت اتریش در تهران و ارسال پرونده به اداره اقامت (MA35 وین)',
    duration: '۲ تا ۴ ماه',
    summary: 'مصاحبه حضوری در سفارت اتریش تهران، بررسی امنیتی در MA35 اتریش و صدور ویزای ورود Visa D.',
    steps: [
      {
        id: 'at-embassy-appointment',
        title: 'حضور در روز مصاحبه در سفارت اتریش در تهران (خیابان نیاوران)',
        description: 'تحویل پرونده درخواست مجوز اقامت دانشجویی (Aufenthaltsbewilligung Student)، پرداخت هزینه بررسی اقامت و انجام انگشت‌نگاری.',
        category: 'embassy',
        isIranSpecific: true,
        tips: 'تمام فرم‌ها باید به زبان آلمانی و با خط خوانا امضا و تکمیل شده باشند.',
        estimatedTime: '۱ روز کاری'
      },
      {
        id: 'at-ma35-process',
        title: 'بررسی پرونده در اداره امور اقامت و شهروندی اتریش (مانند MA35 در وین)',
        description: 'ارسال فیزیکی پرونده از تهران به اتریش، استعلام عدم سوءپیشینه و موافقت اداره اقامت محلی اتریش.',
        category: 'embassy',
        isIranSpecific: false,
        tips: 'در صورت نیاز به مدرک تکمیلی، اداره MA35 از طریق ایمیل با شما مکاتبه خواهد کرد.',
        estimatedTime: '۲ تا ۴ ماه'
      },
      {
        id: 'at-visa-d-stamp',
        title: 'صدور ویزای ورود ۴ ماهه نوع D (Visa D) جهت دریافت کارت فیزیکی در اتریش',
        description: 'مراجعه به سفارت اتریش در تهران با برگه بیمه مسافرتی و الصاق لیبل ویزای ورود در گذرنامه.',
        category: 'embassy',
        isIranSpecific: false,
        tips: 'این ویزا صرفاً برای ورود به اتریش و تحویل کارت هوشمند اقامت صادر می‌شود.',
        estimatedTime: '۱ تا ۲ هفته'
      }
    ]
  });

  phases.push({
    phaseNumber: 6,
    phaseTitle: 'فاز شش: پرواز به وین، ثبت شهرداری (Meldezettel) و دریافت کارت اقامت شینگن',
    duration: '۲ تا ۳ هفته',
    summary: 'ورود به اتریش، ثبت آدرس مسکونی ظرف ۳ روز در Meldeamt و دریافت کارت هوشمند اقامت.',
    steps: [
      {
        id: 'at-flight',
        title: 'خرید بلیت پرواز به وین و ورود به خاک اتریش',
        description: 'تهیه بلیت هواپیما و ورود به اتریش پیش از انقضای مهلت ثبت‌نام حضوری دانشگاه.',
        category: 'arrival',
        isIranSpecific: true,
        tips: 'عوارض خروج از کشور را به صورت اینترنتی قبل از پرواز پرداخت فرمایید.',
        estimatedTime: '۱ هفته'
      },
      {
        id: 'at-meldezettel',
        title: 'مراجعه به اداره شهرداری محلی (Meldeamt) ظرف ۳ روز کاری جهت ثبت آدرس (Meldezettel)',
        description: 'پر کردن برگه Meldezettel با امضای صاحبخانه یا خوابگاه دانشجویی و دریافت برگه رسمی ثبت سکونت.',
        category: 'arrival',
        isIranSpecific: false,
        tips: 'برگه ملدزتل سند هویتی مهم برای افتتاح حساب بانکی و بیمه درمانی دولتی اتریش است.',
        estimatedTime: '۳ روز اول ورود'
      },
      {
        id: 'at-rwr-card',
        title: 'مراجعه به اداره MA35 جهت دریافت کارت فیزیکی اقامت و ثبت‌نام در بیمه ÖGK',
        description: 'تحویل کارت اقامت هوشمند پلاستیکی، فعال‌سازی بیمه سلامت دولتی دانشجویی اتریش (ÖGK با حق بیمه حدود ۶۵ یورو در ماه) و افتتاح حساب بانکی (Erste Bank یا Bank Austria).',
        category: 'arrival',
        isIranSpecific: false,
        tips: 'با دریافت این کارت، اقامت شینگن معتبر دارید و اجازه کار پاره‌وقت دانشجویی تا ۲۰ ساعت در هفته برای شما فعال می‌گردد.',
        estimatedTime: '۲ هفته'
      }
    ]
  });

  return phases;
}

// ۵. نقشه راه اختصاصی امارات و عمان (ویزای کاری، جستجوی کار، دیتافلو و E-Visa)
function getUaeOmanRoadmapPhases(profile: UserProfile, country: CountryRecommendation): RoadmapPhase[] {
  const phases: RoadmapPhase[] = [];

  phases.push({
    phaseNumber: 0,
    phaseTitle: 'فاز صفر: مدارک اولیه و تاییدات کنسولگری در تهران',
    duration: '۳ تا ۵ هفته',
    summary: 'بررسی اعتبار پاسپورت، ترجمه رسمی انگلیسی و تایید نهایی سفارت امارات یا عمان در تهران.',
    steps: [
      {
        id: 'gulf-passport',
        title: 'اطمینان از اعتبار گذرنامه (حداقل ۶ تا ۱۲ ماه اعتبار)',
        description: 'بررسی تاریخ انقضا و سلامت فیزیکی گذرنامه جهت ثبت اطلاعات در پورتال‌های مهاجرتی خلیج فارس.',
        category: 'iran_admin',
        isIranSpecific: true,
        tips: 'حداقل ۶ ماه اعتبار پاسپورت برای صدور مجوز ورود (Entry Permit) امارات الزامی است.',
        estimatedTime: '۱ هفته'
      },
      {
        id: 'gulf-attest',
        title: 'ترجمه رسمی مدارک تحصیلی و شغلی با تایید وزارت خارجه و سفارت امارات/عمان در تهران',
        description: 'ترجمه مدارک به زبان انگلیسی با تایید دادگستری و امور خارجه، و ارجاع به سفارت امارات در تهران (خیابان ولیعصر) یا سفارت عمان جهت الصاق لیبل تاییدیه (Attestation).',
        category: 'documents',
        isIranSpecific: true,
        tips: 'تاییدیه سفارت امارات در تهران برای دریافت اقامت کارمندی در دبی و ابوظبی ضروری است.',
        estimatedTime: '۲ تا ۳ هفته'
      }
    ]
  });

  phases.push({
    phaseNumber: 1,
    phaseTitle: 'فاز یک: انگلیسی کاربردی تجاری و تنظیم رزومه حوزه خلیج فارس (Gulf Format)',
    duration: '۱ تا ۲ ماه',
    summary: 'بازنویسی رزومه طبق استانداردهای خلیج فارس (با عکس و مشخصات ویزا) و آمادگی مصاحبه آنلاین.',
    steps: [
      {
        id: 'gulf-resume',
        title: 'تنظیم رزومه استاندارد متناسب با بازار کار دبی و مسقط (Gulf CV Format)',
        description: 'درج عکس پرسنلی حرفه‌ای با کت و شلوار، ملیت، وضعیت تاهل، شماره تماس واتس‌اپ با پیش‌شماره بین‌المللی و وضعیت فعلی ویزا.',
        category: 'documents',
        isIranSpecific: false,
        tips: 'برخلاف اروپا و کانادا، کارفرمایان امارات و عمان اصرار به دیدن عکس پرسنلی رسمی و مشخصات هویتی در صفحه اول رزومه دارند.',
        estimatedTime: '۱ تا ۲ هفته'
      },
      {
        id: 'gulf-english',
        title: 'تقویت مهارت گفتگوی انگلیسی تجاری برای مصاحبه‌های فشرده با کارفرمایان چندملیتی',
        description: 'تمرکز بر اصطلاحات تخصصی حوزه کاری و شبیه‌سازی مصاحبه‌های ویدئویی در پلتفرم‌های Teams و Zoom.',
        category: 'language',
        isIranSpecific: false,
        tips: 'اکثر مصاحبه‌های شرکت‌های دبی با مدیران منابع انسانی بین‌المللی (اروپایی، هندی و عربی) به زبان انگلیسی روان انجام می‌شود.',
        estimatedTime: '۱ تا ۲ ماه'
      }
    ]
  });

  phases.push({
    phaseNumber: 2,
    phaseTitle: 'فاز دو: ارزیابی و استعلام مدارک (Dataflow / Equivalency / Prometric)',
    duration: '۱ تا ۲ ماه',
    summary: 'استعلام اصالت مدارک در سامانه دیتافلو، آزمون پرومتریک و معادل‌سازی مدرک در امارات.',
    steps: [
      ...(profile.education.majorCategory === 'medical_health' ? [{
        id: 'gulf-dataflow',
        title: 'ویژه کادر درمان و پزشکی: ثبت پرونده در سامانه Dataflow و آزمون پرومتریک',
        description: 'ارسال مدارک به موسسه بین‌المللی دیتافلو جهت استعلام مستقیم از دانشگاه و بیمارستان ایرانی، و اخذ مجوز آزمون DHA دبی یا Prometric عمان.',
        category: 'documents' as const,
        isIranSpecific: false,
        tips: 'گزارش تاییدیه مثبت دیتافلو (PSV Report) شرط اصلی استخدام هرگونه پزشک، دندانپزشک، داروساز و پرستار در کشورهای حوزه خلیج فارس است.',
        estimatedTime: '۴ تا ۸ هفته'
      }] : [{
        id: 'gulf-equiv',
        title: 'معادل‌سازی دانشنامه در سامانه وزارت آموزش عالی امارات (MOE Equivalency)',
        description: 'بارگذاری مدارک تایید شده در پورتال moj.gov.ae یا moe.gov.ae جهت تطبیق رتبه مدرک با استانداردهای شغلی امارات.',
        category: 'documents' as const,
        isIranSpecific: false,
        tips: 'معادل‌سازی وزارت آموزش امارات برای اخذ پوزیشن‌های مدیریتی و تخصصی الزامی است.',
        estimatedTime: '۲ تا ۴ هفته'
      }])
    ]
  });

  phases.push({
    phaseNumber: 3,
    phaseTitle: 'فاز سه: کاریابی مستقیم در پورتال‌های خلیج فارس یا اقدام برای ویزای طلایی / جستجوی کار',
    duration: '۱ تا ۳ ماه',
    summary: 'ارسال هدفمند رزومه در Bayt، لینکدین امارات یا اقدام برای ویزای ۶۰ روزه جستجوی کار.',
    steps: [
      {
        id: 'gulf-job-hunt',
        title: 'کاریابی فعال در پورتال‌های استخدامی معتبر (Bayt.com، GulfTalent، LinkedIn UAE و Indeed دبی)',
        description: 'ارسال رزومه سفارشی‌سازی شده برای آگهی‌های دارای پشتیبانی ویزای کاری (Visa Sponsorship Provided).',
        category: 'application',
        isIranSpecific: false,
        tips: 'بخش پیام خصوصی لینکدین و ارتباط با استخدام‌کنندگان (Recruiters) شرکت‌های مستقر در دبی نرخ پاسخ‌دهی بسیار بالایی دارد.',
        estimatedTime: '۱ تا ۳ ماه'
      },
      {
        id: 'gulf-job-seeker-visa',
        title: 'بررسی گزینه ویزای ۶۰ روزه جستجوی کار یا ویزای توریستی جهت حضور مستقیم در دبی',
        description: 'سفر به دبی با ویزای کوتاه‌مدت جهت شرکت در جلسات مصاحبه حضوری، شبکه ارتباطی و تبدیل مستقیم ویزا به اقامت کاری بدون خروج از کشور.',
        category: 'application',
        isIranSpecific: false,
        tips: 'بسیاری از شرکت‌های اماراتی ترجیح می‌دهند با کارجویانی مصاحبه کنند که هم‌اکنون در خاک دبی حضور فیزیکی دارند.',
        estimatedTime: '۱ تا ۲ ماه'
      }
    ]
  });

  phases.push({
    phaseNumber: 4,
    phaseTitle: 'فاز چهار: قرارداد رسمی (Job Offer) و صدور مجوز ورود کاری (Entry Permit)',
    duration: '۲ تا ۳ هفته',
    summary: 'امضای قرارداد با کارفرما طبق فرمت وزارت کار امارات (MOHRE) و صدور تاییدیه ورود الکترونیکی.',
    steps: [
      {
        id: 'gulf-offer-sign',
        title: 'امضای پیشنهاد کاری استاندارد وزارت کار امارات (MOHRE Offer Letter)',
        description: 'بررسی جزئیات حقوق ماهانه (Basic + Allowances)، بیمه درمان، مسکن، مرخصی سالانه و پاداش پایان خدمت (Gratuity).',
        category: 'application',
        isIranSpecific: false,
        tips: 'قرارداد استاندارد دو زبانه (انگلیسی و عربی) ملاک قانونی حل اختلافات کاری در مراجع قضایی امارات است.',
        estimatedTime: '۱ هفته'
      },
      {
        id: 'gulf-entry-permit',
        title: 'درخواست کارفرما برای صدور مجوز ورود استخدامی (Employment Entry Permit) از اداره اقامت (GDRFA)',
        description: 'ثبت اطلاعات پاسپورت شما در سامانه اداره کل اقامت و امور اتباع خارجی دبی (GDRFA) یا پلیس عمان توسط اسپانسر.',
        category: 'financial',
        isIranSpecific: false,
        tips: 'کلیه هزینه‌های دولتی صدور مجوز ورود کاری طبق قانون کار امارات بر عهده کارفرما/اسپانسر است.',
        estimatedTime: '۳ تا ۷ روز کاری'
      }
    ]
  });

  phases.push({
    phaseNumber: 5,
    phaseTitle: 'فاز پنج: صدور آنی ویزای الکترونیکی (E-Visa) بدون نیاز به مصاحبه در سفارت',
    duration: '۱ هفته',
    summary: 'صدور سریع ویزای الکترونیکی PDF بدون نیاز به مراجعه به سفارت یا صف‌های طولانی.',
    steps: [
      {
        id: 'gulf-evisa-issue',
        title: 'دریافت فایل الکترونیکی ویزای ورود کاری (E-Visa PDF) با بارکد رسمی',
        description: 'برخلاف کشورهای غربی، صدور ویزای ورود کاری امارات و عمان کاملاً دیجیتال است و نیازی به حضور در سفارت تهران یا مصاحبه کنسولی ندارد.',
        category: 'embassy',
        isIranSpecific: false,
        tips: 'فایل الکترونیکی ویزا به صورت فایل PDF ارسال می‌شود که باید پرینت رنگی باکیفیت از آن تهیه فرمایید.',
        estimatedTime: '۳ تا ۵ روز'
      },
      {
        id: 'gulf-ok-to-board',
        title: 'تاییدیه پرواز (Ok to Board) در شرکت هواپیمایی',
        description: 'ثبت شماره ویزا در سیستم ایرلاین (ماهان، فلای‌دبی، امارات یا ایرعربیا) جهت بلامانع بودن سوار شدن به هواپیما.',
        category: 'embassy',
        isIranSpecific: true,
        tips: 'حداقل ۴۸ ساعت قبل از پرواز، نسخه ویزا را به دفتر ایرلاین تحویل دهید تا استعلام تایید شود.',
        estimatedTime: '۱ تا ۲ روز'
      }
    ]
  });

  phases.push({
    phaseNumber: 6,
    phaseTitle: 'فاز شش: پرواز، انجام مدیکال، ثبت بیومتریک کارت اقامت (Emirates ID) و حساب بانکی',
    duration: '۲ تا ۳ هفته',
    summary: 'پرواز به دبی/مسقط، آزمایش خون و ریه، صدور کارت ملی هوشمند اقامت و افتتاح حساب بانکی.',
    steps: [
      {
        id: 'gulf-arrival',
        title: 'پرواز به دبی/شارجه/ابوظبی یا مسقط و ورود با مجوز الکترونیکی',
        description: 'ارائه پرینت E-Visa به گیت مهاجرت فرودگاه مقصد و مهر ورود (Entry Stamp) در پاسپورت.',
        category: 'arrival',
        isIranSpecific: true,
        tips: 'از لحظه ورود به امارات، ۶۰ روز مهلت دارید تا آزمایشات مدیکال و مراحل کارت هویت را نهایی کنید.',
        estimatedTime: '۱ روز'
      },
      {
        id: 'gulf-medical-test',
        title: 'مراجعه به مراکز خدمات سلامت جهت آزمایشات پزشکی الزامی (Medical Fitness Test)',
        description: 'انجام آزمایش خون و عکس‌برداری قفسه سینه در مراکز رسمی سلامت جهت دریافت گواهی عدم ابتلا به بیماری‌های واگیردار.',
        category: 'arrival',
        isIranSpecific: false,
        tips: 'نتیجه آزمایش مدیکال معمولاً ظرف ۲۴ تا ۴۸ ساعت صادر و مستقیماً به اداره اقامت ارسال می‌گردد.',
        estimatedTime: '۲ تا ۳ روز'
      },
      {
        id: 'gulf-emirates-id',
        title: 'مراجعه به مراکز ICP جهت انگشت‌نگاری و صدور کارت هویت هوشمند (Emirates ID / بطاقة مقیم)',
        description: 'ثبت اثر انگشت و اسکن چهره، الصاق مهر ویزای اقامت رسمی ۲ تا ۳ ساله و تحویل کارت هوشمند فیزیکی از طریق پست.',
        category: 'arrival',
        isIranSpecific: false,
        tips: 'کارت هویت هوشمند امارات (Emirates ID) کلید اصلی زندگی در امارات برای قرارداد اجاره خانه (Ejari)، خط تلفن و گواهینامه رانندگی است.',
        estimatedTime: '۱ تا ۲ هفته'
      },
      {
        id: 'gulf-bank-account',
        title: 'افتتاح حساب بانکی شخصی و حقوقی (Emirates NBD، ADCB، Mashreq یا بانک مسقط)',
        description: 'مراجعه به بانک با کارت هویت و قرارداد کاری، افتتاح حساب جاری و دریافت دبیت‌کارت بین‌المللی جهت دریافت مستقیم حقوق به درهم یا ریال عمان.',
        category: 'arrival',
        isIranSpecific: false,
        tips: 'اپلیکیشن‌های بانکی امارات امکان انتقال ارز سریع بین‌المللی بدون مالیات بر درآمد فردی را به شما می‌دهند.',
        estimatedTime: '۳ تا ۵ روز'
      }
    ]
  });

  return phases;
}

// ۶. نقشه راه اختصاصی سوئد (ویزای کاری، جاب‌آفر و تحصیلی)
function getSwedenRoadmapPhases(profile: UserProfile, country: CountryRecommendation): RoadmapPhase[] {
  const phases: RoadmapPhase[] = [];

  phases.push({
    phaseNumber: 0,
    phaseTitle: 'فاز صفر: پیگیری‌های اداری و اسناد هویتی در ایران',
    duration: '۱ تا ۲ ماه',
    summary: 'بررسی اعتبار پاسپورت، آزادسازی اصل دانشنامه‌ها در سامانه سجاد و ترجمه رسمی انگلیسی.',
    steps: [
      ...(profile.personal.gender === 'male' ? [{
        id: 'se-military',
        title: 'تعیین تکلیف نظام وظیفه و سامانه سخا',
        description: profile.personal.militaryStatus === 'completed'
          ? 'بررسی کارت پایان خدمت هوشمند جهت تحویل به دارالترجمه رسمی.'
          : 'ثبت درخواست معافیت تحصیلی یا وثیقه خروج از کشور در سامانه sakha.epolice.ir.',
        category: 'iran_admin' as const,
        isIranSpecific: true,
        tips: 'کارت پایان خدمت برای اخذ مجوز خروج از کشور و ترجمه رسمی الزامی است.',
        estimatedTime: '۱ تا ۲ هفته'
      }] : []),
      {
        id: 'se-passport',
        title: 'بررسی یا تمدید گذرنامه با حداقل ۲ سال اعتبار',
        description: 'مراجعه به دفاتر پلیس+۱۰ جهت صدور یا تمدید پاسپورت. هماهنگی املای لاتین نام و نام‌خانوادگی بسیار مهم است.',
        category: 'iran_admin',
        isIranSpecific: true,
        tips: 'اداره مهاجرت سوئد (Migrationsverket) مدت اجازه اقامت را حداکثر تا سقف اعتبار گذرنامه شما صادر می‌کند.',
        estimatedTime: '۱ تا ۲ هفته'
      },
      ...(!profile.education.isDegreeReleased && profile.education.degree !== 'highschool' ? [{
        id: 'se-sajjad',
        title: 'لغو تعهد آموزش رایگان و اخذ کد صحت در سامانه سجاد (portal.saorg.ir)',
        description: 'دریافت تاییدیه دانشنامه و ریزنمرات دانشگاهی از وزارت علوم یا بهداشت جهت ترجمه رسمی.',
        category: 'iran_admin' as const,
        isIranSpecific: true,
        tips: 'بدون کد صحت سامانه سجاد، مهرهای دادگستری و امور خارجه برای مدارک تحصیلی صادر نمی‌شود.',
        estimatedTime: '۲ تا ۵ هفته'
      }] : []),
      {
        id: 'se-translation',
        title: 'ترجمه رسمی کلیه مدارک به زبان انگلیسی با مهرهای کامل دادگستری و خارجه',
        description: 'ترجمه شناسنامه، مدارک تحصیلی، ریزنمرات و گواهی‌های سابقه کار همراه با تاییدیه دادگستری و وزارت امور خارجه.',
        category: 'documents',
        isIranSpecific: true,
        tips: 'در سوئد تمامی ادارات دولتی و دانشگاه‌ها ترجمه رسمی انگلیسی را با کمال میل می‌پذیرند.',
        estimatedTime: '۲ تا ۳ هفته'
      }
    ]
  });

  phases.push({
    phaseNumber: 1,
    phaseTitle: 'فاز یک: تسلط بر زبان انگلیسی و آماده‌سازی آزمون',
    duration: '۳ تا ۵ ماه',
    summary: 'کسب نمره آیلتس ۶.۵+ یا تافل ۹۰+ جهت کار در شرکت‌های بین‌المللی یا تحصیل در دانشگاه‌های سوئد.',
    steps: [
      {
        id: 'se-lang-prep',
        title: 'آمادگی فشرده برای آزمون آیلتس آکادمیک یا جنرال',
        description: 'تقویت مهارت‌های Speaking و Writing برای نمره حداقل ۶.۵ در آیلتس یا معادل تافل.',
        category: 'language',
        isIranSpecific: false,
        tips: 'زبان انگلیسی زبان کاری شرکت‌های بزرگ سوئدی (مانند اسپاتیفای، ولوو، اریکسون و ایکیا) است؛ سوئدی الزام ورود نیست اما پس از ورود رایگان آموزش داده می‌شود.',
        estimatedTime: '۳ تا ۵ ماه'
      },
      {
        id: 'se-lang-exam',
        title: 'ثبت‌نام و شرکت در آزمون رسمی آیلتس یا تافل در سنترهای ایران',
        description: 'اخذ کارنامه رسمی زبان معتبر جهت الصاق به پرونده دانشگاهی یا مصاحبه با کارفرمای سوئدی.',
        category: 'language',
        isIranSpecific: true,
        tips: 'کارنامه آزمون آیلتس ۲ سال اعتبار دارد؛ زمان‌بندی آزمون را با ددلاین‌های دانشگاهی و کاری هماهنگ فرمایید.',
        estimatedTime: '۲ تا ۳ هفته'
      }
    ]
  });

  phases.push({
    phaseNumber: 2,
    phaseTitle: 'فاز دو: تدوین رزومه استاندارد اسکاندیناوی و ارزیابی مدرک در UHR',
    duration: '۱ تا ۲ ماه',
    summary: 'تهیه رزومه سوئدی متمرکز بر پروژه‌ها، بهینه‌سازی لینکدین و ارزیابی مدارک در شورای آموزش عالی سوئد.',
    steps: [
      {
        id: 'se-resume-prep',
        title: 'تنظیم رزومه بر اساس فرهنگ کاری سوئد (مختصر، شفاف و مبتنی بر همکاری تیمی)',
        description: 'فرهنگ کاری سوئد بر کار تیمی، عدم سلسله‌مراتب عمودی و تعادل کار و زندگی (Lagom) استوار است. رزومه باید دستاوردهای تیمی و تخصصی شما را نشان دهد.',
        category: 'documents',
        isIranSpecific: false,
        tips: 'لینک پروفایل لینکدین و نمونه کارهای فنی (گیت‌هاب/پورتفولیو) را در صدر رزومه قرار دهید.',
        estimatedTime: '۲ هفته'
      },
      {
        id: 'se-uhr-eval',
        title: 'ارزیابی اختیاری مدارک تحصیلی در شورای آموزش عالی سوئد (UHR)',
        description: 'ثبت رایگان مدارک در پورتال uhr.se جهت دریافت گواهی تطبیق مدرک دانشگاهی با استانداردهای سوئد.',
        category: 'documents',
        isIranSpecific: false,
        tips: 'ارزیابی UHR برای رشته‌های مهندسی و مدیریت رایگان است و به کارفرمایان اطمینان خاطر می‌دهد.',
        estimatedTime: '۱ تا ۲ ماه'
      }
    ]
  });

  phases.push({
    phaseNumber: 3,
    phaseTitle: 'فاز سه: فرآیند اپلای (جاب‌آفر تایید شده اتحادیه یا پذیرش از UniversityAdmissions)',
    duration: '۲ تا ۴ ماه',
    summary: 'عقد قرارداد با کارفرمای سوئدی طبق مصوبه اتحادیه صنفی یا اخذ پذیرش و بورسیه انستیتو سوئد (SI).',
    steps: [
      country.pathwayType === 'work' ? {
        id: 'se-job-offer',
        title: 'دریافت جاب‌آفر از کارفرمای سوئدی با حداقل دستمزد قانونی مصوب اداره مهاجرت',
        description: 'کارفرما باید شغل را ابتدا به مدت ۱۰ روز در پورتال EURES آگهی کرده و شرایط کار، حقوق، بیمه درمانی و بازنشستگی را به تایید اتحادیه صنفی سوئد (Facket / Kollektivavtal) برساند.',
        category: 'application',
        isIranSpecific: false,
        tips: 'حداقل حقوق ماهانه برای ویزای کاری سوئد اکنون طبق قانون جدید حدود ۲۸,۴۸۰ کرون سوئد (حدود ۲,۶۰۰ دلار) است.',
        estimatedTime: '۲ تا ۴ ماه'
      } : {
        id: 'se-university-admissions',
        title: 'ثبت اپلیکیشن تحصیلی در پورتال ملی Universityadmissions.se و بورسیه SI',
        description: 'انتخاب حداکثر ۴ اولویت رشته در دانشگاه‌های سوئد (مانند KTH، لوند، چالمز و اوپسالا) و اقدام همزمان برای بورسیه کامل دولتی انستیتو سوئد (Swedish Institute Scholarship).',
        category: 'application',
        isIranSpecific: false,
        tips: 'ددلاین اپلای پاییز در سوئد معمولاً ۱۵ ژانویه است و بورسیه SI کلیه شهریه و هزینه‌های زندگی ۱۲,۰۰۰ کرونی را پوشش می‌دهد.',
        estimatedTime: '۲ تا ۳ ماه'
      },
      {
        id: 'se-admission-letter',
        title: 'دریافت نامه رسمی پذیرش تحصیلی یا آغاز پرونده آنلاین توسط کارفرما',
        description: 'دریافت نامه پذیرش Notification of Selection Results یا ایمیل دعوتنامه کارفرما برای شروع مراحل اداره مهاجرت.',
        category: 'application',
        isIranSpecific: false,
        tips: 'به محض دریافت نامه، سریعاً به فاز پرداخت فی و ثبت اقامت ورود کنید.',
        estimatedTime: '۲ تا ۴ هفته'
      }
    ]
  });

  phases.push({
    phaseNumber: 4,
    phaseTitle: 'فاز چهار: تمکن مالی، پرداخت اپلیکیشن فی و مقدمات مالی',
    duration: '۳ تا ۴ هفته',
    summary: 'صدور تمکن بانکی لاتین از ایران و پرداخت هزینه‌های دولتی با کارت اعتباری ارزی.',
    steps: [
      {
        id: 'se-bank-statement',
        title: 'صدور گواهی تمکن مالی لاتین از بانک ایرانی (معادل حدود ۱۰,۳۱۴ کرون در ماه)',
        description: 'گواهی مانده موجودی به نام متقاضی به زبان انگلیسی از بانک‌های خصوصی یا دولتی معتبر ایران با نرخ برابری روز.',
        category: 'financial',
        isIranSpecific: true,
        tips: 'برای ویزای تحصیلی، تمکن کل ۱ سال تحصیلی (حدود ۱۲۵ هزار کرون معادل ۱۱ هزار دلار) در حساب شخصی نیاز است.',
        estimatedTime: '۳ تا ۵ روز'
      },
      {
        id: 'se-app-fee',
        title: 'پرداخت اپلیکیشن فی پرونده اقامت سوئد (Migrationsverket Fee)',
        description: 'پرداخت هزینه بررسی پرونده اقامت کاری یا دانشجویی (حدود ۲,۲۰۰ کرون کاری یا ۱,۵۰۰ کرون تحصیلی) از طریق کارت‌های اعتباری ارزی بین‌المللی.',
        category: 'financial',
        isIranSpecific: false,
        tips: 'می‌توانید پرداخت ارزی را از طریق صرافی‌های معتبر آنلاین داخلی انجام دهید.',
        estimatedTime: '۱ تا ۲ روز'
      }
    ]
  });

  phases.push({
    phaseNumber: 5,
    phaseTitle: 'فاز پنج: ثبت در اداره مهاجرت سوئد (Migrationsverket) و بیومتریک در تهران',
    duration: '۲ تا ۴ ماه',
    summary: 'ثبت پرونده در سامانه آنلاین اداره مهاجرت، حضور در سفارت سوئد تهران جهت بیومتریک و صدور کارت اقامت.',
    steps: [
      {
        id: 'se-migrationsverket-portal',
        title: 'تکمیل فرم آنلاین در پرتال رسمی migrationsverket.se',
        description: 'بارگذاری پاسپورت، مدارک تحصیلی یا قرارداد تایید شده، فیش پرداخت و تمکن مالی در پورتال مهاجرت سوئد.',
        category: 'embassy',
        isIranSpecific: false,
        tips: 'تمامی فایل‌ها باید اسکن رنگی واضح با فرمت PDF باشند.',
        estimatedTime: '۱ تا ۲ هفته'
      },
      {
        id: 'se-embassy-tehran',
        title: 'رزرو نوبت و حضور در سفارت پادشاهی سوئد در تهران (خیابان فرمانیه)',
        description: 'ارائه اصل گذرنامه، ثبت اثر انگشت، گرفتن عکس بیومتریک و مصاحبه هویتی با آفیسر سفارت سوئد.',
        category: 'embassy',
        isIranSpecific: true,
        tips: 'در روز مصاحبه، آرامش خود را حفظ کرده و درباره اهداف شغلی و تحصیلی خود در سوئد شفاف صحبت کنید.',
        estimatedTime: '۱ روز کاری'
      },
      {
        id: 'se-ut-card',
        title: 'دریافت تصمیم قبولی (Bifall) و صدور کارت فیزیکی اقامت (UT-kort)',
        description: 'ابلاغ نتیجه مثبت پرونده و دریافت ویزای ورود یا کارت هوشمند اقامت (Uppehållstillståndskort).',
        category: 'embassy',
        isIranSpecific: false,
        tips: 'پس از دریافت تاییدیه، کارت اقامت توسط پست دیپلماتیک به تهران ارسال شده و آماده تحویل می‌گردد.',
        estimatedTime: '۴ تا ۸ هفته'
      }
    ]
  });

  phases.push({
    phaseNumber: 6,
    phaseTitle: 'فاز شش: پرواز به سوئد، ثبت در Skatteverket، دریافت Personnummer و BankID',
    duration: '۳ تا ۴ هفته',
    summary: 'ورود به خاک سوئد، دریافت شماره شناسایی ملی ۱۲ رقمی، هویت دیجیتال بانک‌آیدی و کلاس‌های زبان SFI.',
    steps: [
      {
        id: 'se-flight',
        title: 'خرید بلیت پرواز به استکهلم (فرودگاه آرلاندا) یا گوتنبرگ',
        description: 'رزرو پرواز با هواپیمایی ترکیش، قطر، پگاسوس یا امارات و پرداخت عوارض خروج در ایران.',
        category: 'arrival',
        isIranSpecific: true,
        tips: 'رسید پرداخت عوارض خروج را همراه پاسپورت در فرودگاه امام خمینی همراه داشته باشید.',
        estimatedTime: '۱ هفته'
      },
      {
        id: 'se-skatteverket',
        title: 'مراجعه به اداره مالیات سوئد (Skatteverket) و ثبت آدرس جهت صدور کد ملی (Personnummer)',
        description: 'کد ملی ۱۲ رقمی (Personnummer) شاهرگ حیاتی زندگی در سوئد است و برای کلیه امور بانکی، بیمه درمانی رایگان و اشتغال الزامی است.',
        category: 'arrival',
        isIranSpecific: false,
        tips: 'همراه داشتن قرارداد اجاره مسکن، کارت اقامت و پاسپورت در روز مراجعه به Skatteverket الزامی است.',
        estimatedTime: '۲ تا ۴ هفته'
      },
      {
        id: 'se-bankid-sfi',
        title: 'افتتاح حساب بانکی، فعال‌سازی BankID و ثبت‌نام در دوره‌های رایگان سوئدی (SFI)',
        description: 'افتتاح حساب در یکی از بانک‌های معتبر (Swedbank، SEB، Nordea یا Handelsbanken)، فعال‌سازی امضای دیجیتال BankID بر روی تلفن همراه و شروع کلاس‌های آموزش زبان سوئدی برای مهاجران (Swedish for Immigrants).',
        category: 'arrival',
        isIranSpecific: false,
        tips: 'شناسه BankID امکان دسترسی به تمامی خدمات اداری، خریدهای اینترنتی، پرداخت مالیات و اپلیکیشن پرکاربرد Swish را فراهم می‌کند.',
        estimatedTime: '۲ تا ۳ هفته'
      }
    ]
  });

  return phases;
}

// ۷. نقشه راه اختصاصی دانمارک (ویزای کاری، لیست مثبت، فست‌ترک و تحصیلی)
function getDenmarkRoadmapPhases(profile: UserProfile, country: CountryRecommendation): RoadmapPhase[] {
  const phases: RoadmapPhase[] = [];

  phases.push({
    phaseNumber: 0,
    phaseTitle: 'فاز صفر: پیگیری‌های اداری و اسناد هویتی در ایران',
    duration: '۱ تا ۲ ماه',
    summary: 'بررسی پاسپورت، آزادسازی مدارک در سامانه سجاد و ترجمه رسمی انگلیسی با تاییدات دولتی.',
    steps: [
      {
        id: 'dk-passport',
        title: 'اطمینان از اعتبار گذرنامه (حداقل ۲ سال اعتبار)',
        description: 'بررسی تاریخ انقضا و سلامت فیزیکی گذرنامه در پلیس+۱۰ جهت جلوگیری از هرگونه توقف اداری.',
        category: 'iran_admin',
        isIranSpecific: true,
        tips: 'دانمارک برای صدور پرمیت کاری و تحصیلی، حداقل اعتبار ۲ ساله گذرنامه را توصیه می‌کند.',
        estimatedTime: '۱ تا ۲ هفته'
      },
      ...(!profile.education.isDegreeReleased && profile.education.degree !== 'highschool' ? [{
        id: 'dk-sajjad',
        title: 'لغو تعهد آموزش رایگان در سامانه سجاد و دریافت ریزنمرات رسمی',
        description: 'ثبت درخواست لغو تعهد در portal.saorg.ir و اخذ بارکد صحت جهت تایید مدارک توسط مراجع قانونی.',
        category: 'iran_admin' as const,
        isIranSpecific: true,
        tips: 'ریزنمرات کامل کلیه دوره‌ها با نمرات تفکیکی باید ترجمه رسمی شوند.',
        estimatedTime: '۲ تا ۵ هفته'
      }] : []),
      {
        id: 'dk-translation',
        title: 'ترجمه رسمی مدارک تحصیلی و سوابق کاری به انگلیسی با مهرهای دادگستری و امور خارجه',
        description: 'ترجمه دانشنامه، سوابق بیمه تامین اجتماعی، شناسنامه و گواهی‌های شغلی به زبان انگلیسی.',
        category: 'documents',
        isIranSpecific: true,
        tips: 'کلیه موسسات دانمارکی اسناد رسمی تایید شده به زبان انگلیسی را قبول می‌کنند.',
        estimatedTime: '۲ تا ۳ هفته'
      }
    ]
  });

  phases.push({
    phaseNumber: 1,
    phaseTitle: 'فاز یک: کسب مدرک زبان انگلیسی معتبر بین‌المللی',
    duration: '۳ تا ۵ ماه',
    summary: 'اخذ نمره حداقل ۶.۵ در آیلتس آکادمیک یا ۸۸ در تافل اینترنتی.',
    steps: [
      {
        id: 'dk-lang-prep',
        title: 'آمادگی و شرکت در آزمون رسمی آیلتس یا تافل در ایران',
        description: 'بیش از ۹۵ درصد مردم دانمارک به روانی انگلیسی صحبت می‌کنند و محیط‌های کاری در کپنهاگ و آرهوس تماماً به زبان انگلیسی فعال هستند.',
        category: 'language',
        isIranSpecific: true,
        tips: 'کسب نمره آیلتس ۷ یا بالاتر، یک امتیاز رقابتی برجسته برای استخدام در شرکت‌های دانمارکی مانند Novo Nordisk، Mærsk و LEGO محسوب می‌شود.',
        estimatedTime: '۳ تا ۵ ماه'
      }
    ]
  });

  phases.push({
    phaseNumber: 2,
    phaseTitle: 'فاز دو: انطباق رشته با لیست مثبت دانمارک (Positive List) و رزومه‌سازی',
    duration: '۱ تا ۲ ماه',
    summary: 'بررسی موقعیت شغلی در Positive List دانمارک و ارزیابی آنلاین در اداره آموزش عالی دانمارک.',
    steps: [
      {
        id: 'dk-positive-list',
        title: 'بررسی عنوان شغلی در فهرست مشاغل مورد نیاز دانمارک (The Positive List)',
        description: 'اداره مهاجرت دانمارک سالانه دو بار فهرست مشاغل دارای کمبود نیرو را در دو دسته (Higher Education و Skilled Work) منتشر می‌کند. قرار داشتن شغل شما در این لیست اخذ اقامت را به شدت تسهیل می‌کند.',
        category: 'documents',
        isIranSpecific: false,
        tips: 'رشته‌های مهندسی نرم‌افزار، الکترونیک، عمران، مدیریت پروژه و کادر درمان همواره در صدر Positive List دانمارک قرار دارند.',
        estimatedTime: '۱ تا ۲ هفته'
      },
      {
        id: 'dk-resume',
        title: 'تدوین رزومه و پورتفولیو مطابق استانداردهای اسکاندیناوی و لینکدین بین‌المللی',
        description: 'ارائه دستاوردهای فنی، بهینه‌سازی کلمات کلیدی تخصصی و نگارش توصیه‌نامه‌های شغلی از مدیران قبلی.',
        category: 'documents',
        isIranSpecific: false,
        tips: 'پورتال استخدامی رسمی دانمارک یعنی workindenmark.dk را به طور مداوم رصد کنید.',
        estimatedTime: '۲ هفته'
      }
    ]
  });

  phases.push({
    phaseNumber: 3,
    phaseTitle: 'فاز سه: فرآیند اپلای (طرح‌های کاری SIRI یا پذیرش تحصیلی)',
    duration: '۲ تا ۳ ماه',
    summary: 'عقد قرارداد با کارفرمای دانمارکی (Fast-track / Pay Limit) یا اخذ پذیرش از دانشگاه‌های DTU و KU.',
    steps: [
      country.pathwayType === 'work' ? {
        id: 'dk-work-apply',
        title: 'دریافت جاب‌آفر از کارفرمای دانمارکی تحت طرح Pay Limit Scheme یا Fast-track',
        description: 'کارفرما قرارداد کاری با شرایط حقوقی مصوب قانون کار دانمارک تنظیم کرده و بخشی از درخواست اقامت را در پرتال SIRI آغاز می‌کند.',
        category: 'application',
        isIranSpecific: false,
        tips: 'طرح فست‌ترک دانمارک سریع‌ترین زمان پاسخگویی را در بین کشورهای اروپایی دارد.',
        estimatedTime: '۲ تا ۳ ماه'
      } : {
        id: 'dk-study-apply',
        title: 'ثبت درخواست پذیرش در دانشگاه‌های برتر دانمارک (DTU، کپنهاگ، آلبورگ و CBS)',
        description: 'ارسال مدارک، انگیزه‌نامه و ریزنمرات به پورتال پذیرش دانشگاه و دریافت تاییدیه قبولی تحصیلی.',
        category: 'application',
        isIranSpecific: false,
        tips: 'دانشجویان بین‌المللی در دانمارک حق کار ۲۰ ساعت در هفته در طول ترم و تمام وقت در تعطیلات را دارند.',
        estimatedTime: '۲ تا ۳ ماه'
      }
    ]
  });

  phases.push({
    phaseNumber: 4,
    phaseTitle: 'فاز چهار: ساخت Case Order ID و پرداخت هزینه دولتی (Gebyr) به اداره SIRI',
    duration: '۲ تا ۳ هفته',
    summary: 'ایجاد شناسه پرونده در پرتال newtodenmark.dk و واریز هزینه دولتی بررسی اقامت.',
    steps: [
      {
        id: 'dk-case-order',
        title: 'ایجاد شناسه پرونده (Case Order ID) در سایت رسمی اداره مهاجرت دانمارک (SIRI)',
        description: 'ورود به پرتال newtodenmark.dk، انتخاب نوع پرونده (کاری یا دانشجویی) و دریافت شماره اختصاصی پرونده اقامتی.',
        category: 'financial',
        isIranSpecific: false,
        tips: 'شماره پرونده دانمارک به عنوان کد رهگیری اصلی شما تا زمان صدور کارت اقامت عمل خواهد کرد.',
        estimatedTime: '۱ تا ۲ روز'
      },
      {
        id: 'dk-fee-payment',
        title: 'پرداخت آنلاین هزینه دولتی رسیدگی به پرونده (Gebyr) با کارت اعتباری بین‌المللی',
        description: 'واریز هزینه دولتی اداره مهاجرت دانمارک (حدود ۳,۳۰۰ تا ۴,۶۰۰ کرون دانمارک بسته به نوع ویزا) از طریق کردیت‌کارت ارزی.',
        category: 'financial',
        isIranSpecific: false,
        tips: 'رسید پرداخت الکترونیکی Gebyr را چاپ کرده و به پرونده بیومتریک الصاق کنید.',
        estimatedTime: '۱ تا ۲ روز'
      }
    ]
  });

  phases.push({
    phaseNumber: 5,
    phaseTitle: 'فاز پنج: ثبت بیومتریک در مرکز VFS Global تهران و صدور ویزای دانمارک',
    duration: '۱ تا ۲ ماه',
    summary: 'رزرو نوبت VFS تهران ظرف حداکثر ۱۴ روز پس از ساخت شناسه SIRI، انگشت‌نگاری و صدور ویزا.',
    steps: [
      {
        id: 'dk-vfs-appointment',
        title: 'رزرو وقت بیومتریک در کارگزاری VFS Global دانمارک در تهران (مرکز هروی سنتر)',
        description: 'مراجعه به سایت vfsglobal.com/denmark/iran و رزرو نوبت جهت ثبت اثر انگشت و چهره بیومتریک.',
        category: 'embassy',
        isIranSpecific: true,
        tips: 'توجه بسیار مهم: طبق قوانین دانمارک، ثبت بیومتریک باید ظرف حداکثر ۱۴ روز تقویمی پس از ثبت پرونده اینترنتی SIRI انجام شود.',
        estimatedTime: '۱ تا ۲ هفته'
      },
      {
        id: 'dk-vfs-attend',
        title: 'حضور در مرکز VFS، تحویل مدارک و مصاحبه هویتی با کارشناس کارگزاری',
        description: 'ارائه پاسپورت، رسید Gebyr، نسخه پرینت فرم اینترنتی، عکس و ثبت ۱۰ اثر انگشت.',
        category: 'embassy',
        isIranSpecific: true,
        tips: 'کارشناسان مدارک را بررسی کرده و پوشه دیجیتال را به سفارت پادشاهی دانمارک ارسال می‌نمایند.',
        estimatedTime: '۱ روز کاری'
      },
      {
        id: 'dk-visa-decision',
        title: 'دریافت تاییدیه رسمی اقامت و الصاق لیبل ویزای ورود نوع D در پاسپورت',
        description: 'پیگیری آنلاین وضعیت پرونده، دریافت پیامک آماده بودن پاسپورت و چسبانده شدن ویزای ورود.',
        category: 'embassy',
        isIranSpecific: false,
        tips: 'ویزای ورود به شما اجازه سفر به دانمارک و ثبت نام برای کارت اقامت را اعطا می‌کند.',
        estimatedTime: '۳ تا ۶ هفته'
      }
    ]
  });

  phases.push({
    phaseNumber: 6,
    phaseTitle: 'فاز شش: پرواز به دانمارک، اخذ کد CPR، کارت زرد درمانی و فعال‌سازی MitID',
    duration: '۲ تا ۳ هفته',
    summary: 'ورود به کپنهاگ/آرهوس، مراجعه به International Citizen Service، دریافت کارت سلامت و هویت MitID.',
    steps: [
      {
        id: 'dk-flight-arrival',
        title: 'پرواز به کپنهاگ (فرودگاه کاستروپ) و اسکان اولیه در دانمارک',
        description: 'سفر به دانمارک و اجاره اقامتگاه دارای امکان ثبت آدرس رسمی (CPR Registration).',
        category: 'arrival',
        isIranSpecific: true,
        tips: 'حتماً مطمئن شوید صاحبخانه به شما اجازه ثبت CPR بر روی آدرس منزل را می‌دهد.',
        estimatedTime: '۱ هفته'
      },
      {
        id: 'dk-ics-visit',
        title: 'مراجعه به مرکز بین‌المللی شهروندان (ICS) جهت صدور CPR Number و کارت سلامت زرد',
        description: 'مرکز ICS یک درگاه یکپارچه دولتی دانمارک برای مهاجران متخصص است که شماره شناسایی ملی (CPR) و کارت بیمه سلامت رایگان (Sundhedskort / Yellow Card) را در یک جلسه صادر می‌کند.',
        category: 'arrival',
        isIranSpecific: false,
        tips: 'با کارت زرد درمانی، تمامی خدمات پزشکی عمومی و بیمارستانی در دانمارک برای شما کاملاً رایگان خواهد بود.',
        estimatedTime: '۱ تا ۲ هفته'
      },
      {
        id: 'dk-mitid-bank',
        title: 'فعال‌سازی هویت دیجیتال دانمارک (MitID) و افتتاح حساب بانکی (NemKonto)',
        description: 'فعال‌سازی اپلیکیشن MitID در گوشی همراه، مراجعه به بانک دانمارکی (مانند Danske Bank، Nordea یا Jyske Bank)، افتتاح حساب جاری و تعیین آن به عنوان حساب رسمی واریز حقوق و تسهیلات دولتی (NemKonto).',
        category: 'arrival',
        isIranSpecific: false,
        tips: 'سیستم هوشمند جامعه بدون پول نقد (Cashless Society) دانمارک با MitID و اپلیکیشن پرداختی MobilePay زندگی روزمره را فوق‌العاده ساده می‌سازد.',
        estimatedTime: '۱ تا ۲ هفته'
      }
    ]
  });

  return phases;
}

// ۸. نقشه راه اختصاصی نروژ (ویزای نیروی کار ماهر UDI، صنعت انرژی/تک و تحصیلی)
function getNorwayRoadmapPhases(profile: UserProfile, country: CountryRecommendation): RoadmapPhase[] {
  const phases: RoadmapPhase[] = [];

  phases.push({
    phaseNumber: 0,
    phaseTitle: 'فاز صفر: پیگیری‌های اداری و اسناد اولیه در ایران',
    duration: '۱ تا ۲ ماه',
    summary: 'پاسپورت معتبر، آزادسازی مدارک در سامانه سجاد و ترجمه رسمی مدارک به انگلیسی.',
    steps: [
      {
        id: 'no-passport',
        title: 'بررسی اعتبار ۲ تا ۳ ساله پاسپورت و صدور گذرنامه جدید',
        description: 'مراجعه به پلیس+۱۰ و اطمینان از سلامت گذرنامه جهت ثبت اطلاعات در پرتال اداره مهاجرت نروژ (UDI).',
        category: 'iran_admin',
        isIranSpecific: true,
        tips: 'پاسپورت با اعتبار بالا آسودگی خاطر برای پروسه‌های اقامتی نروژ ایجاد می‌کند.',
        estimatedTime: '۱ تا ۲ هفته'
      },
      ...(!profile.education.isDegreeReleased && profile.education.degree !== 'highschool' ? [{
        id: 'no-sajjad',
        title: 'تسویه و آزادسازی دانشنامه در سامانه سجاد (portal.saorg.ir)',
        description: 'لغو تعهد آموزش رایگان و اخذ بارکد صحت برای دانشنامه و ریزنمرات دوره‌های کارشناسی و ارشد.',
        category: 'iran_admin' as const,
        isIranSpecific: true,
        tips: 'اداره مهاجرت نروژ (UDI) بر تطابق دقیق سرفصل‌ها و ریزنمرات دانشگاهی حساس است.',
        estimatedTime: '۲ تا ۵ هفته'
      }] : []),
      {
        id: 'no-translation',
        title: 'ترجمه رسمی کلیه مدارک هویتی، شغلی و تحصیلی به زبان انگلیسی',
        description: 'ترجمه رسمی با مهرهای وزارت دادگستری و وزارت امور خارجه ایران.',
        category: 'documents',
        isIranSpecific: true,
        tips: 'نروژ ترجمه انگلیسی را برای کلیه مراجع دولتی، کارفرمایان و دانشگاه‌ها کاملاً معتبر می‌داند.',
        estimatedTime: '۲ تا ۳ هفته'
      }
    ]
  });

  phases.push({
    phaseNumber: 1,
    phaseTitle: 'فاز یک: کسب مدرک زبان انگلیسی بین‌المللی',
    duration: '۳ تا ۵ ماه',
    summary: 'اخذ نمره آیلتس ۶.۵ به بالا یا تافل ۹۰ جهت ورود به بازار کار و دانشگاه‌های نروژ.',
    steps: [
      {
        id: 'no-lang-exam',
        title: 'آمادگی و شرکت در آزمون آیلتس (IELTS) یا تافل در سنترهای ایران',
        description: 'در صنایع پیشرفته نفت و گاز، انرژی‌های تجدیدپذیر، آی‌تی و علوم دریایی نروژ، زبان کاری رایج انگلیسی است.',
        category: 'language',
        isIranSpecific: true,
        tips: 'یادگیری زبان نروژی (Bokmål) مزیت فوق‌العاده‌ای در جامعه نروژ است اما پیش‌شرط اخذ ویزای نیروی کار ماهر نیست.',
        estimatedTime: '۳ تا ۵ ماه'
      }
    ]
  });

  phases.push({
    phaseNumber: 2,
    phaseTitle: 'فاز دو: ارزیابی مدارک در HK-dir (سابقاً NOKUT) و رزومه اسکاندیناوی',
    duration: '۱ تا ۲ ماه',
    summary: 'ارزیابی دانشگاه در اداره آموزش عالی نروژ و آماده‌سازی رزومه کاری شفاف و استاندارد.',
    steps: [
      {
        id: 'no-nokut-eval',
        title: 'ارسال مدارک به اداره آموزش عالی و مهارت‌های نروژ (HK-dir / سابقا NOKUT)',
        description: 'ثبت نام در پرتال hkdir.no و درخواست گواهی تطبیق مدرک دانشگاهی ایران با مقاطع کارشناسی و کارشناسی ارشد نروژ.',
        category: 'documents',
        isIranSpecific: false,
        tips: 'تاییدیه HK-dir پذیرش شغلی شما توسط کارفرمایان نروژی را بسیار سریع‌تر و روان‌تر می‌کند.',
        estimatedTime: '۱ تا ۲ ماه'
      },
      {
        id: 'no-resume',
        title: 'تدوین رزومه استاندارد بر اساس سبک نروژی (شفاف، مبتنی بر دستاوردها و بدون مبالغه)',
        description: 'نروژی‌ها به صداقت کاری، تخصص عملی و مهارت‌های تعاملی ارزش بالایی می‌دهند. رزومه باید دقیق و حاوی اطلاعات تماس معرف‌های قبلی باشد.',
        category: 'documents',
        isIranSpecific: false,
        tips: 'پورتال رسمی کاریابی نروژ یعنی finn.no و nav.no را برای مشاهده موقعیت‌های استخدام روزانه چک کنید.',
        estimatedTime: '۲ هفته'
      }
    ]
  });

  phases.push({
    phaseNumber: 3,
    phaseTitle: 'فاز سه: فرآیند اپلای (پیشنهاد کاری Skilled Worker یا پذیرش دانشگاهی)',
    duration: '۲ تا ۴ ماه',
    summary: 'دریافت جاب‌آفر با حداقل درآمد مصوب صنفی یا اخذ پذیرش از دانشگاه‌های NTNU، اسلو و برگن.',
    steps: [
      country.pathwayType === 'work' ? {
        id: 'no-work-offer',
        title: 'دریافت پیشنهاد کاری معتبر فول‌تایم از کارفرمای نروژی (Offer of Employment Form)',
        description: 'کارفرما باید فرم رسمی UDI Offer of Employment را تکمیل کند. حقوق پیشنهادی باید حداقل برابر با توافقنامه‌های جمعی صنف یا حداقل مصوب نروژ برای مقطع کارشناسی ارشد (حدود ۵۰۰ هزار کرون نروژ در سال) باشد.',
        category: 'application',
        isIranSpecific: false,
        tips: 'شغل پیشنهادی باید مستقیماً با مدارک تحصیلی و سوابق کاری شما همخوانی داشته باشد.',
        estimatedTime: '۲ تا ۴ ماه'
      } : {
        id: 'no-study-apply',
        title: 'اخذ پذیرش در دوره‌های کارشناسی ارشد یا دکترا از دانشگاه‌های برتر نروژ',
        description: 'ثبت اپلیکیشن در پورتال دانشگاه (مانند UiO, NTNU, UiB) و دریافت نامه قطعی پذیرش تحصیلی.',
        category: 'application',
        isIranSpecific: false,
        tips: 'دوره‌های دکترا در نروژ به عنوان موقعیت استخدامی با حقوق ماهانه بسیار بالا (حدود ۴۵ تا ۵۰ هزار یورو در سال) شناخته می‌شوند.',
        estimatedTime: '۲ تا ۳ ماه'
      }
    ]
  });

  phases.push({
    phaseNumber: 4,
    phaseTitle: 'فاز چهار: تمکن مالی، حساب امانی دانشگاه یا اثبات حقوق کاری',
    duration: '۳ تا ۴ هفته',
    summary: 'تامین مبلغ مصوب تمکن UDI در حساب سپرده نروژ یا قرارداد استخدامی معتبر.',
    steps: [
      {
        id: 'no-financial-proof',
        title: 'تامین هزینه زندگی مصوب اداره مهاجرت نروژ (UDI Subsistence Requirement)',
        description: country.pathwayType === 'work'
          ? 'قرارداد کاری رسمی با حقوق بالای ۵۰۰,۰۰۰ کرون در سال به طور خودکار شرط تمکن مالی ویزای کار را پوشش می‌دهد.'
          : 'برای ویزای دانشجویی، مبلغ ۱۵۱,۶۹۰ کرون نروژ باید پیش از صدور ویزا به حساب امانی ویژه دانشجویان در دانشگاه نروژ واریز گردد.',
        category: 'financial',
        isIranSpecific: false,
        tips: 'مبلغ تمکن دانشجویی پس از ورود به نروژ و افتتاح حساب بانکی، به صورت ماهانه به حساب شما واریز خواهد شد.',
        estimatedTime: '۲ تا ۳ هفته'
      },
      {
        id: 'no-udi-fee',
        title: 'پرداخت هزینه دولتی اپلیکیشن پرمیت کار یا تحصیل در سایت UDI',
        description: 'پرداخت اینترنتی مبلغ ۶,۳۰۰ کرون نروژ با کارت اعتباری بین‌المللی در پورتال اداره مهاجرت نروژ.',
        category: 'financial',
        isIranSpecific: false,
        tips: 'رسید پرداخت الکترونیکی باید ضمیمه پرونده کاغذی شود.',
        estimatedTime: '۱ تا ۲ روز'
      }
    ]
  });

  phases.push({
    phaseNumber: 5,
    phaseTitle: 'فاز پنج: ثبت در پورتال UDI و تحویل مدارک به VFS Global نروژ در تهران',
    duration: '۲ تا ۳ ماه',
    summary: 'سابمیت فرم آنلاین، نوبت انگشت‌نگاری در VFS تهران و بررسی پرونده توسط سفارت سلطنتی نروژ.',
    steps: [
      {
        id: 'no-udi-portal',
        title: 'تکمیل فرم آنلاین در پرتال رسمی اداره مهاجرت نروژ (udi.no)',
        description: 'ثبت اطلاعات هویتی، بارگذاری مدارک و انتخاب سفارت نروژ در تهران به عنوان محل تحویل مدارک.',
        category: 'embassy',
        isIranSpecific: false,
        tips: 'چک‌لیست رسمی مدارک (Checklist for Skilled Workers / Students) را دانلود و امضا نمایید.',
        estimatedTime: '۱ هفته'
      },
      {
        id: 'no-vfs-tehran',
        title: 'مراجعه به کارگزاری VFS Global نروژ در تهران جهت تحویل پوشه و بیومتریک',
        description: 'تحویل اصل پاسپورت، ترجمه‌ها با کپی برابر اصل، قرارداد کاری و ثبت ۱۰ اثر انگشت.',
        category: 'embassy',
        isIranSpecific: true,
        tips: 'پوشه مدارک را منظم و بر اساس ترتیب چک‌لیست رسمی UDI تحویل دهید.',
        estimatedTime: '۱ روز کاری'
      },
      {
        id: 'no-permit-decision',
        title: 'دریافت برگه تاییدیه اقامت و ویزای ورود نوع D (Entry Visa)',
        description: 'صدور مجوز رسمی اقامت توسط اداره مهاجرت نروژ (UDI) و الصاق لیبل ویزای ورود ۷ روزه در پاسپورت.',
        category: 'embassy',
        isIranSpecific: false,
        tips: 'این ویزا برای ورود به خاک نروژ و دریافت کارت هوشمند فیزیکی صادر می‌شود.',
        estimatedTime: '۴ تا ۸ هفته'
      }
    ]
  });

  phases.push({
    phaseNumber: 6,
    phaseTitle: 'فاز شش: پرواز به نروژ، اداره مالیات (Skatteetaten)، کد Fødselsnummer و BankID',
    duration: '۲ تا ۴ هفته',
    summary: 'ورود به اسلو/برگن، دریافت کد ملی نروژ، کارت مالیاتی Skattekort و هویت دیجیتال BankID.',
    steps: [
      {
        id: 'no-flight-arrival',
        title: 'پرواز به اسلو (فرودگاه گاردرموئن) و ورود به خاک نروژ',
        description: 'تهیه بلیت پرواز بین‌المللی و رزرو محل سکونت اولیه در نروژ.',
        category: 'arrival',
        isIranSpecific: true,
        tips: 'در باجه فرودگاه اسلو برگه تاییدیه اقامت UDI را همراه پاسپورت نشان دهید.',
        estimatedTime: '۱ هفته'
      },
      {
        id: 'no-police-skatteetaten',
        title: 'مراجعه به پلیس و اداره مالیات نروژ (Skatteetaten) جهت دریافت کد ملی (Fødselsnummer)',
        description: 'ثبت هویت حضوری ظرف ۷ روز اول ورود، صدور شماره ۱۱ رقمی ملی نروژ (Fødselsnummer) و صدور کارت مالیاتی (Skattekort).',
        category: 'arrival',
        isIranSpecific: false,
        tips: 'بدون کارت مالیاتی Skattekort، کارفرما مجبور خواهد بود ۵۰ درصد از اولین حقوق شما را به عنوان مالیات علی‌الحساب کسر کند.',
        estimatedTime: '۲ تا ۳ هفته'
      },
      {
        id: 'no-bank-bankid',
        title: 'افتتاح حساب بانکی در نروژ (DNB / Nordea) و فعال‌سازی هویت دیجیتال BankID نروژ',
        description: 'دریافت کارت بانکی بین‌المللی Visa/Mastercard و فعال‌سازی BankID که پلتفرم یکپارچه ورود به تمامی سامانه‌های بانکی، پزشکی و دولتی نروژ (Altinn) است.',
        category: 'arrival',
        isIranSpecific: false,
        tips: 'طبیعت خیره‌کننده، امنیت اجتماعی بالا و حقوق منصفانه نروژ استانداردی کم‌نظیر از زندگی برای شما فراهم می‌آورد.',
        estimatedTime: '۲ هفته'
      }
    ]
  });

  return phases;
}

// ۹. نقشه راه اختصاصی فنلاند (ویزای سریع متخصصان Fast-Track، تک‌هاب اروپا و تحصیلی)
function getFinlandRoadmapPhases(profile: UserProfile, country: CountryRecommendation): RoadmapPhase[] {
  const phases: RoadmapPhase[] = [];

  phases.push({
    phaseNumber: 0,
    phaseTitle: 'فاز صفر: مدارک اولیه و تاییدات اداری در ایران',
    duration: '۱ تا ۲ ماه',
    summary: 'بررسی پاسپورت، آزادسازی اصل دانشنامه‌ها در سامانه سجاد و ترجمه رسمی انگلیسی.',
    steps: [
      {
        id: 'fi-passport',
        title: 'بررسی سلامت و اعتبار گذرنامه (حداقل ۲ سال اعتبار)',
        description: 'اقدام جهت تعویض یا تمدید پاسپورت در دفاتر پلیس+۱۰ جهت درج اطلاعات در سامانه اقامتی فنلاند.',
        category: 'iran_admin',
        isIranSpecific: true,
        tips: 'اعتبار پاسپورت برای صدور کارت اقامت پیوسته نوع A فنلاند (معمولاً ۱ تا ۲ ساله) اهمیت دارد.',
        estimatedTime: '۱ تا ۲ هفته'
      },
      ...(!profile.education.isDegreeReleased && profile.education.degree !== 'highschool' ? [{
        id: 'fi-sajjad',
        title: 'لغو تعهد آموزش رایگان در سامانه سجاد (portal.saorg.ir)',
        description: 'تسویه با دانشگاه و اخذ بارکد صحت مدارک تحصیلی جهت دریافت تاییدیه وزارتخانه‌های مربوطه.',
        category: 'iran_admin' as const,
        isIranSpecific: true,
        tips: 'مدارک مقاطع دانشگاهی قبلی همراه ریزنمرات کامل به تایید دادگستری و امور خارجه می‌رسد.',
        estimatedTime: '۲ تا ۵ هفته'
      }] : []),
      {
        id: 'fi-translation',
        title: 'ترجمه رسمی مدارک تحصیلی، کاری و هویتی به زبان انگلیسی با مهرهای کامل',
        description: 'تحویل مدارک به دارالترجمه رسمی و دریافت پلمپ‌های معتبر وزارت دادگستری و وزارت امور خارجه.',
        category: 'documents',
        isIranSpecific: true,
        tips: 'فنلاند تمامی مدارک رسمی ترجمه شده به زبان انگلیسی را بدون نیاز به ترجمه به زبان فنلاندی قبول می‌کند.',
        estimatedTime: '۲ تا ۳ هفته'
      }
    ]
  });

  phases.push({
    phaseNumber: 1,
    phaseTitle: 'فاز یک: تسلط بر زبان انگلیسی و آزمون معتبر',
    duration: '۳ تا ۵ ماه',
    summary: 'کسب نمره آیلتس ۶.۵+ یا تافل ۹۰+؛ فنلاند یکی از برترین کشورهای انگلیسی‌زبان غیربومی جهان است.',
    steps: [
      {
        id: 'fi-lang-prep',
        title: 'آمادگی و شرکت در آزمون رسمی آیلتس یا تافل در ایران',
        description: 'زبان انگلیسی زبان کاری رایج در اکوسیستم فناوری، استارتاپ‌ها و شرکت‌های چندملیتی فنلاند (مانند نوکیا، روویو و سوپرسل) است.',
        category: 'language',
        isIranSpecific: true,
        tips: 'برای ویزای کاری و تخصصی فنلاند ارائه مدرک رسمی زبان فنلاندی الزامی نیست؛ تسلط بر زبان انگلیسی کافی است.',
        estimatedTime: '۳ تا ۵ ماه'
      }
    ]
  });

  phases.push({
    phaseNumber: 2,
    phaseTitle: 'فاز دو: رزومه استاندارد سبک نوردیک و حضور در جامعه استارتاپی فنلاند',
    duration: '۱ تا ۲ ماه',
    summary: 'تدوین رزومه مدرن متمرکز بر نوآوری، لینکدین بین‌المللی و استفاده از پلتفرم Business Finland.',
    steps: [
      {
        id: 'fi-resume-prep',
        title: 'تنظیم رزومه و لینکدین بر اساس فرهنگ کاری منعطف و بدون سلسله‌مراتب فنلاند (Flat Hierarchy)',
        description: 'مدیران فنلاندی به استقلال فردی، مسئولیت‌پذیری، کارایی و خلاقیت اهمیت زیادی می‌دهند. رزومه باید نتایج قابل اندازه‌گیری پروژه‌ها را نشان دهد.',
        category: 'documents',
        isIranSpecific: false,
        tips: 'پلتفرم دولتی Work in Finland (workinfinland.com) را برای یافتن شرکت‌های فنلاندی دارای استخدام بین‌المللی بررسی کنید.',
        estimatedTime: '۲ هفته'
      }
    ]
  });

  phases.push({
    phaseNumber: 3,
    phaseTitle: 'فاز سه: فرآیند اپلای (ویزای فوق‌سریع متخصصان Fast-Track یا پذیرش تحصیلی)',
    duration: '۲ تا ۳ ماه',
    summary: 'عقد قرارداد کاری متخصصان با فرآیند رسیدگی شگفت‌انگیز کمتر از ۱۴ روز کاری یا پذیرش دانشگاهی.',
    steps: [
      country.pathwayType === 'work' ? {
        id: 'fi-fast-track',
        title: 'دریافت جاب‌آفر تخصصی و استفاده از مسیر ویزای فوق‌سریع متخصصان فنلاند (Specialist Fast-Track)',
        description: 'اگر حقوق ناخالص شما حداقل ۳,۶۳۸ یورو در ماه باشد، شما و خانواده‌تان واجد شرایط طرح Fast-Track فنلاند می‌شوید. در این طرح، اداره مهاجرت فنلاند (Migri) درخواست اقامت را ظرف کمتر از ۱۴ روز کاری بررسی و صادر می‌کند!',
        category: 'application',
        isIranSpecific: false,
        tips: 'فنلاند سریع‌ترین فرآیند صدور ویزای کار متخصصان را در سراسر اتحادیه اروپا داراست.',
        estimatedTime: '۲ تا ۳ ماه'
      } : {
        id: 'fi-studyinfo',
        title: 'ثبت درخواست پذیرش در پورتال مرکزی Studyinfo.fi و اقدام برای بورسیه‌های تخفیف شهریه',
        description: 'انتخاب رشته‌های کارشناسی ارشد در دانشگاه‌های تراز اول مانند دانشگاه آلتو (Aalto University) یا دانشگاه هلسینکی و دریافت معافیت ۵۰ تا ۱۰۰ درصدی شهریه بر اساس رزومه علمی.',
        category: 'application',
        isIranSpecific: false,
        tips: 'دانشجویان فارغ‌التحصیل از فنلاند مجوز اقامت ویژه ۲ ساله برای جستجوی کار یا راه‌اندازی استارتاپ دریافت می‌کنند.',
        estimatedTime: '۲ تا ۳ ماه'
      }
    ]
  });

  phases.push({
    phaseNumber: 4,
    phaseTitle: 'فاز چهار: تمکن مالی، بیمه درمانی بین‌المللی و پرداخت هزینه پرتال',
    duration: '۳ تا ۴ هفته',
    summary: 'صدور تمکن بانکی لاتین، تهیه بیمه سلامت معتبر و پرداخت اینترنتی هزینه اقامت.',
    steps: [
      {
        id: 'fi-financial-insurance',
        title: 'تهیه گواهی تمکن بانکی لاتین و بیمه درمانی معتبر بین‌المللی (Swisscare / SIP)',
        description: 'برای دانشجویان تمکن سالانه ۶,۷۲۰ یورو (۵۶۰ یورو در هر ماه) در حساب شخصی و بیمه درمانی بین‌المللی با پوشش حداقل ۴۰,۰۰۰ یورو مورد نیاز است. برای شاغلان، قرارداد استخدامی کفایت می‌کند.',
        category: 'financial',
        isIranSpecific: true,
        tips: 'گواهی تمکن باید حداکثر ۳۰ روز قبل از ارسال مدارک از یکی از بانک‌های ایران به زبان انگلیسی صادر شده باشد.',
        estimatedTime: '۱ تا ۲ هفته'
      },
      {
        id: 'fi-migri-fee',
        title: 'پرداخت الکترونیکی هزینه رسیدگی اداره مهاجرت فنلاند (Migri Fee)',
        description: 'پرداخت آنلاین هزینه بررسی درخواست اقامت نوع A (حدود ۳۸۰ تا ۴۹۰ یورو بسته به نوع درخواست) با کارت اعتباری بین‌المللی.',
        category: 'financial',
        isIranSpecific: false,
        tips: 'ثبت اینترنتی در پرتال Enter Finland ارزان‌تر و سریع‌تر از درخواست کاغذی است.',
        estimatedTime: '۱ روز'
      }
    ]
  });

  phases.push({
    phaseNumber: 5,
    phaseTitle: 'فاز پنج: ثبت در سامانه Enter Finland و بیومتریک در کارگزاری VFS تهران',
    duration: '۲ تا ۴ هفته (یا کمتر از ۱۴ روز در مسیر Fast-Track)',
    summary: 'ثبت مدارک در پرتال enterfinland.fi، مراجعه به کارگزاری VFS تهران و صدور کارت اقامت نوع A.',
    steps: [
      {
        id: 'fi-enter-finland',
        title: 'تکمیل فرم آنلاین در پرتال رسمی Enter Finland (enterfinland.fi)',
        description: 'بارگذاری پاسپورت، مدارک شغلی/تحصیلی، تمکن مالی و بیمه در سامانه یکپارچه خدمات اقامتی فنلاند.',
        category: 'embassy',
        isIranSpecific: false,
        tips: 'پس از سابمیت پرونده، کد رهگیری یکتا و برگه احراز هویت برای تحویل به کارگزاری صادر می‌شود.',
        estimatedTime: '۱ تا ۲ هفته'
      },
      {
        id: 'fi-vfs-tehran',
        title: 'رزرو نوبت و حضور در مرکز VFS Global فنلاند در تهران (مرکز هروی سنتر)',
        description: 'ارائه اصل پاسپورت، برگه پرینت فرم Enter Finland، ثبت اثر انگشت و اسکن چهره بیومتریک.',
        category: 'embassy',
        isIranSpecific: true,
        tips: 'در مسیر Specialist Fast-Track، سفارت فنلاند ظرف چند روز گذرنامه و برگه D-Visa ویژه پرواز سریع را صادر می‌نماید.',
        estimatedTime: '۱ روز کاری'
      },
      {
        id: 'fi-residence-card',
        title: 'صدور کارت هوشمند اقامت شینگن نوع A (Continuous Residence Permit)',
        description: 'دریافت کارت فیزیکی اقامت فنلاند که اجازه رفت‌وآمد نامحدود در حوزه شینگن و حق کار کامل را به شما می‌دهد.',
        category: 'embassy',
        isIranSpecific: false,
        tips: 'اقامت نوع A پس از ۴ سال زندگی در فنلاند مستقیماً به اقامت دائم (Permanent Residence) و سپس پاسپورت فنلاندی تبدیل می‌شود.',
        estimatedTime: '۲ تا ۶ هفته'
      }
    ]
  });

  phases.push({
    phaseNumber: 6,
    phaseTitle: 'فاز شش: پرواز به هلسینکی، مراجعه به DVV، دریافت کد ملی و شناسه بانکی Suomi.fi',
    duration: '۲ تا ۳ هفته',
    summary: 'ورود به پایتخت فنلاند، دریافت Finnish Personal Identity Code، بیمه Kela و افتتاح حساب بانکی.',
    steps: [
      {
        id: 'fi-flight-arrival',
        title: 'پرواز به هلسینکی (فرودگاه هلسینکی-وانتا) و اسکان در فنلاند',
        description: 'سفر به فنلاند و اقامت در محل سکونت اولیه در منطقه کلان‌شهری هلسینکی (Helsinki, Espoo, Vantaa).',
        category: 'arrival',
        isIranSpecific: true,
        tips: 'سیستم حمل و نقل عمومی HSL هلسینکی از مدرن‌ترین و دقیق‌ترین شبکه‌های قطار و تراموای جهان است.',
        estimatedTime: '۱ هفته'
      },
      {
        id: 'fi-dvv-register',
        title: 'مراجعه به آژانس خدمات دیجیتال و جمعیت فنلاند (DVV) جهت دریافت کد ملی (Henkilötunnus)',
        description: 'ثبت آدرس سکونت دائمی و دریافت شماره شناسایی شخصی ۱۱ رقمی فنلاند (Finnish Personal Identity Code) که کلید اصلی کلیه خدمات اداری است.',
        category: 'arrival',
        isIranSpecific: false,
        tips: 'همزمان درخواست عضویت در سازمان بیمه تامین اجتماعی و سلامت فنلاند (Kela) را جهت دریافت خدمات درمانی و رفاهی رایگان ثبت نمایید.',
        estimatedTime: '۱ تا ۲ هفته'
      },
      {
        id: 'fi-bank-tupas',
        title: 'افتتاح حساب بانکی در فنلاند (Nordea / OP / Danske Bank) و فعال‌سازی کدهای آنلاین Suomi.fi',
        description: 'مراجعه به بانک با کارت اقامت و پاسپورت، دریافت کارت دبیت بین‌المللی و فعال‌سازی شناسه‌های الکترونیکی بانکی (Online Banking Credentials) که سیستم هویت دیجیتال فنلاند برای ورود به تمامی سایت‌های دولتی و مالیاتی است.',
        category: 'arrival',
        isIranSpecific: false,
        tips: 'فنلاند برای هفتمین سال پیاپی به عنوان شادترین کشور جهان شناخته شده و از بالاترین استانداردهای شفافیت، آموزش رایگان فرزندان و تعادل کار و زندگی برخوردار است.',
        estimatedTime: '۱ تا ۲ هفته'
      }
    ]
  });

  return phases;
}

// ۱۰. نقشه راه جنریک برای سایر کشورها
function getGenericRoadmapPhases(profile: UserProfile, country: CountryRecommendation): RoadmapPhase[] {
  const phases: RoadmapPhase[] = [];

  phases.push({
    phaseNumber: 0,
    phaseTitle: 'فاز صفر: پیگیری‌های اداری و اسناد اولیه در ایران',
    duration: '۱ تا ۲ ماه',
    summary: 'بررسی اعتبار پاسپورت، آزادسازی مدارک در سجاد و ترجمه رسمی با مهرهای کامل.',
    steps: [
      {
        id: 'gen-passport',
        title: 'بررسی اعتبار گذرنامه با حداقل ۱۸ ماه اعتبار',
        description: 'اقدام جهت صدور یا تعویض پاسپورت از طریق دفاتر پلیس+۱۰.',
        category: 'iran_admin',
        isIranSpecific: true,
        tips: 'اسپل لاتین نام را با مدارک تحصیلی و رزومه هماهنگ نمایید.',
        estimatedTime: '۱ تا ۲ هفته'
      },
      {
        id: 'gen-trans',
        title: 'ترجمه رسمی مدارک با مهرهای دادگستری و وزارت امور خارجه',
        description: 'تحویل مدارک هویتی، شغلی و تحصیلی به دارالترجمه رسمی.',
        category: 'documents',
        isIranSpecific: true,
        tips: 'همواره دو نسخه پلمپ‌شده از مدارک تهیه نمایید.',
        estimatedTime: '۲ تا ۳ هفته'
      }
    ]
  });

  phases.push({
    phaseNumber: 1,
    phaseTitle: 'فاز یک: تسلط بر زبان بین‌المللی و آزمون‌های معتبر',
    duration: '۳ تا ۵ ماه',
    summary: 'کسب نمره هدف در آزمون آیلتس، تافل یا زبان بومی کشور مقصد.',
    steps: [
      {
        id: 'gen-lang-exam',
        title: 'شرکت در آزمون رسمی زبان (IELTS / TOEFL / PTE)',
        description: 'ثبت‌نام در سنترهای رسمی و اخذ کارنامه معتبر بین‌المللی.',
        category: 'language',
        isIranSpecific: false,
        tips: 'نمره زبان بالاتر شانس اخذ ویزا و پذیرش را به طور چشمگیری افزایش می‌دهد.',
        estimatedTime: '۳ تا ۵ ماه'
      }
    ]
  });

  phases.push({
    phaseNumber: 2,
    phaseTitle: 'فاز دو: آماده‌سازی مدارک بین‌المللی و رزومه‌سازی استاندارد',
    duration: '۱ تا ۲ ماه',
    summary: 'نگارش رزومه بین‌المللی، انگیزه‌نامه هدفمند و استعلام سوابق بیمه.',
    steps: [
      {
        id: 'gen-resume',
        title: 'نگارش رزومه بین‌المللی استاندارد و انگیزه‌نامه قوی (SOP)',
        description: 'تنظیم ساختار رزومه بر اساس استانداردهای بین‌المللی و ارائه شفاف دستاوردها.',
        category: 'documents',
        isIranSpecific: false,
        tips: 'رزومه باید بر مهارت‌های قابل اثبات و پروژه‌های واقعی متمرکز باشد.',
        estimatedTime: '۲ هفته'
      }
    ]
  });

  phases.push({
    phaseNumber: 3,
    phaseTitle: 'فاز سه: فرآیند اپلای و دریافت پذیرش / پیشنهاد کاری',
    duration: '۲ تا ۴ ماه',
    summary: 'ارسال درخواست به موسسات آموزشی یا کارفرمایان و دریافت تاییدیه معتبر.',
    steps: [
      {
        id: 'gen-apply',
        title: `ارسال درخواست رسمی به مقصد ${country.countryName}`,
        description: 'ثبت اپلیکیشن در پورتال‌های رسمی و پیگیری پاسخ‌های دانشگاه یا کارفرما.',
        category: 'application',
        isIranSpecific: false,
        tips: 'کلیه مدارک خواسته شده را با فرمت پی‌دی‌اف خوانا و حجم استاندارد آپلود کنید.',
        estimatedTime: '۲ تا ۳ ماه'
      }
    ]
  });

  phases.push({
    phaseNumber: 4,
    phaseTitle: 'فاز چهار: تمکن مالی، حساب بانکی و اقدامات ارزی',
    duration: '۳ تا ۴ هفته',
    summary: 'صدور گواهی تمکن بانکی لاتین و آماده‌سازی هزینه‌های قانونی سفارت.',
    steps: [
      {
        id: 'gen-bank-statement',
        title: 'اخذ گواهی تمکن مالی و گردش حساب از بانک ایرانی',
        description: 'صدور نامه رسمی تمکن مالی به زبان انگلیسی با درج معادل ارزی.',
        category: 'financial',
        isIranSpecific: true,
        tips: 'تاریخ صدور گواهی نباید بیش از ۲ تا ۳ هفته با روز تحویل مدارک فاصله داشته باشد.',
        estimatedTime: '۳ تا ۵ روز'
      }
    ]
  });

  phases.push({
    phaseNumber: 5,
    phaseTitle: 'فاز پنج: وقت سفارت، روز مصاحبه و صدور ویزا',
    duration: '۲ تا ۴ ماه',
    summary: 'حضور در سفارت یا کارگزاری، تحویل مدارک و پیگیری تا الصاق برچسب ویزا.',
    steps: [
      {
        id: 'gen-embassy-attend',
        title: `رزرو نوبت و حضور در سفارت یا کارگزاری رسمی ${country.countryName}`,
        description: 'تحویل پوشه مدارک، انگشت‌نگاری و پاسخ به سوالات آفیسر در خصوص اهداف سفر.',
        category: 'embassy',
        isIranSpecific: true,
        tips: 'پوشه مدارک را دقیقاً مطابق چک‌لیست سفارت مرتب نمایید.',
        estimatedTime: '۱ تا ۳ ماه'
      },
      {
        id: 'gen-visa-stamp',
        title: 'پیگیری ویزا و دریافت گذرنامه ویزا شده',
        description: 'بررسی ایمیل نتیجه و مراجعه جهت تحویل پاسپورت با برچسب ویزا.',
        category: 'embassy',
        isIranSpecific: false,
        tips: 'اطلاعات درج شده روی ویزا را در همان روز تحویل کنترل فرمایید.',
        estimatedTime: '۳ تا ۶ هفته'
      }
    ]
  });

  phases.push({
    phaseNumber: 6,
    phaseTitle: 'فاز شش: آماده‌سازی پرواز و استقرار در مقصد',
    duration: '۳ تا ۴ هفته',
    summary: 'خرید بلیت، رزرو اقامتگاه اولیه، ورود به خاک مقصد و دریافت کارت اقامت.',
    steps: [
      {
        id: 'gen-flight',
        title: 'خرید بلیت پرواز و پرداخت عوارض خروج از کشور',
        description: 'تهیه بلیت هواپیما و پرداخت عوارض خروج در سامانه سداد بانک ملی.',
        category: 'arrival',
        isIranSpecific: true,
        tips: 'عوارض خروج را حداقل ۲۴ ساعت قبل از پرواز پرداخت نمایید.',
        estimatedTime: '۱ هفته'
      },
      {
        id: 'gen-arrival-setup',
        title: `ورود به خاک ${country.countryName} و نهایی‌سازی مدارک اقامتی`,
        description: 'مراجعه به مراجع قانونی محلی جهت ثبت آدرس، دریافت کارت هویت و افتتاح حساب بانکی.',
        category: 'arrival',
        isIranSpecific: false,
        tips: 'قبل از رسیدن به مقصد از اعتبار مدارک اقامتی موقت خود مطمئن شوید.',
        estimatedTime: '۲ تا ۳ هفته'
      }
    ]
  });

  return phases;
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
  else if (topCountry.countryId === 'sweden' || topCountry.countryId === 'norway' || topCountry.countryId === 'denmark' || topCountry.countryId === 'finland') credentialUSD = 'رایگان یا حدود ۱۵۰ $ (UHR / HK-dir)';

  let applicationFees = '150 - 500 $';
  if (topCountry.pathwayType === 'work') applicationFees = '100 - 250 $';

  let blockedOrProof = '۵,۰۰۰ تا ۱۵,۰۰۰ $';
  if (topCountry.countryId === 'germany') blockedOrProof = '11,904 € (حساب مسدود برای ۱ سال)';
  else if (topCountry.countryId === 'italy') blockedOrProof = '6,000 € (صرفاً در حساب ریالی ایران جهت تمکن)';
  else if (topCountry.countryId === 'canada') blockedOrProof = '20,635 $ CAD (تمکن قانونی)';
  else if (topCountry.countryId === 'sweden') blockedOrProof = 'حدود ۱۰,۳۱۴ کرون سوئد در ماه (حدود ۱۲,۰۰۰ دلار برای ۱ سال تحصیلی)';
  else if (topCountry.countryId === 'norway') blockedOrProof = '۱۵۱,۶۹۰ کرون نروژ (حدود ۱۴,۰۰۰ دلار در حساب امانی دانشگاه)';
  else if (topCountry.countryId === 'denmark') blockedOrProof = 'تمکن بانکی لاتین یا جاب‌آفر بالای مصوب Pay Limit';
  else if (topCountry.countryId === 'finland') blockedOrProof = '۶,۷۲۰ یورو در سال (۵۶۰ یورو در ماه تمکن دانشجویی)';

  const emergencyBuffer = '1,500 - 3,000 $';
  let totalStartingUSD = '12,000 - 16,000 $';
  if (topCountry.countryId === 'italy') totalStartingUSD = '4,500 - 6,500 $';
  else if (topCountry.countryId === 'uae_oman') totalStartingUSD = '3,000 - 5,000 $';
  else if (topCountry.countryId === 'canada') totalStartingUSD = '18,000 - 25,000 $';
  else if (topCountry.countryId === 'finland' && topCountry.pathwayType === 'work') totalStartingUSD = '3,500 - 6,000 $';

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
