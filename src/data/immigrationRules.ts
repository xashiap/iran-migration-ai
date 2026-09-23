import { UserProfile } from '../types/migration';

export interface CountryData {
  id: string;
  name: string;
  nameEn: string;
  flag: string;
  languages: string[];
  minimumBudgetUSD: number;
  averageTimelineMonths: number;
  currency: string;
  visaCenterInIran: string;
  summary: string;
  pros: string[];
  cons: string[];
  pathways: {
    id: string;
    title: string;
    type: 'work' | 'study' | 'startup' | 'job_seeker' | 'nomad';
    description: string;
    costUSD: string;
    durationMonths: string;
    requirements: string[];
    isSuitableFor: (profile: UserProfile) => { score: number; reason: string };
  }[];
}

export const COUNTRIES_DATABASE: CountryData[] = [
  {
    id: 'germany',
    name: 'آلمان',
    nameEn: 'Germany',
    flag: '🇩🇪',
    languages: ['آلمانی', 'انگلیسی'],
    minimumBudgetUSD: 14000, // حساب مسدود حدود ۱۱,۹۰۴ یورو + بلیت و شروع
    averageTimelineMonths: 10,
    currency: 'یورو (€)',
    visaCenterInIran: 'کارگزاری ویزامتریک (Visametric) در تهران + سایت سفارت',
    summary: 'قدرتمندترین اقتصاد اروپا با کمبود شدید نیروی کار و سیستم جدید کارت شانس (Chancenkarte) و تحصیل رایگان.',
    pros: [
      'دانشگاه‌های دولتی تقریباً رایگان (بدون شهریه)',
      'کارت شانس جدید بدون نیاز به جاب‌آفر اولیه برای افراد ماهر',
      'بازار کار فوق‌العاده برای IT، مهندسی و کادر درمان',
      'امکان اخذ اقامت دائم (بلوکارت) پس از ۲۱ تا ۲۷ ماه با مدرک زبان'
    ],
    cons: [
      'نیاز به تمکن مالی در حساب مسدود (حدود ۱۲ هزار یورو)',
      'یادگیری زبان آلمانی برای ادغام در جامعه و بسیاری از مشاغل ضروری است',
      'طولانی بودن وقت‌های سفارت و ویزامتریک در برخی دوره‌ها'
    ],
    pathways: [
      {
        id: 'chancenkarte',
        title: 'کارت شانس آلمان (Chancenkarte 2024-2026)',
        type: 'job_seeker',
        description: 'ویزای ۱ ساله بر پایه سیستم امتیازدهی (حداقل ۶ امتیاز) برای ورود به آلمان و جستجوی کار با اجازه کار پاره‌وقت ۲۰ ساعت در هفته.',
        costUSD: '13,500 - 15,000 $ (شامل تمکن ۱۲ هزار یورویی)',
        durationMonths: '6 تا 10 ماه',
        requirements: [
          'مدرک دانشگاهی یا فنی حداقل ۲ ساله معتبر',
          'مدرک زبان آلمانی A1/A2 یا انگلیسی B2',
          'کسب حداقل ۶ امتیاز از جداول سن، مهارت، سابقه و زبان',
          'تمکن مالی حدود ۱,۰۲۷ یورو در ماه برای مدت اقامت'
        ],
        isSuitableFor: (p) => {
          let score = 50;
          const reasons: string[] = [];

          if (p.education.degree === 'bachelor' || p.education.degree === 'master' || p.education.degree === 'phd') {
            score += 20;
            reasons.push('مدرک دانشگاهی معتبر');
          }
          if (p.personal.age >= 18 && p.personal.age <= 35) {
            score += 15;
            reasons.push('امتیاز سن ایده‌آل');
          }
          if (p.languages.germanLevel !== 'none') {
            score += 15;
            reasons.push('آشنایی با زبان آلمانی');
          }
          if (p.languages.englishLevel === 'advanced' || p.languages.englishLevel === 'fluent') {
            score += 10;
            reasons.push('تسلط به انگلیسی B2/C1');
          }
          if (p.work.yearsExperience >= 2) {
            score += 10;
            reasons.push('سابقه کار کافی');
          }
          if (p.education.majorCategory === 'computer_it' || p.education.majorCategory === 'engineering' || p.education.majorCategory === 'medical_health') {
            score += 15;
            reasons.push('رشته جزو مشاغل با کمبود نیرو (MINT)');
          }

          return { score: Math.min(score, 98), reason: reasons.join('، ') };
        }
      },
      {
        id: 'study_germany',
        title: 'مهاجرت تحصیلی (کارشناسی ارشد یا دکترا)',
        type: 'study',
        description: 'تحصیل در دانشگاه‌های دولتی آلمان به زبان انگلیسی یا آلمانی بدون شهریه به همراه اجازه کار دانشجویی.',
        costUSD: '14,000 $ (حساب مسدود برای سال اول)',
        durationMonths: '8 تا 12 ماه',
        requirements: [
          'مدرک کارشناسی با معدل بالای ۱۴-۱۵',
          'آیلتس ۶.۵ یا تافل یا مدرک آلمانی B2/TestDaF',
          'آزادسازی دانشنامه و تاییدیه سجاد و زاب (ZAB)',
          'اثبات تمکن مالی سالانه (حساب مسدود ارزی)'
        ],
        isSuitableFor: (p) => {
          let score = 40;
          const reasons: string[] = [];
          if (p.education.degree === 'bachelor' || p.education.degree === 'master') {
            score += 25;
            reasons.push('داشتن لیسانس/فوق‌لیسانس برای پذیرش ارشد/دکترا');
          }
          if (p.education.gpa >= 15) {
            score += 15;
            reasons.push('معدل مناسب دانشگاهی');
          }
          if (p.languages.englishLevel === 'advanced' || p.languages.germanLevel !== 'none') {
            score += 20;
            reasons.push('سطح زبان کافی');
          }
          if (p.finances.liquidBudgetUSD >= 13000 || p.finances.canProvideBankStatement) {
            score += 15;
            reasons.push('توانایی تامین حساب مسدود');
          }
          return { score: Math.min(score, 95), reason: reasons.join('، ') };
        }
      },
      {
        id: 'blue_card',
        title: 'ویزای کاری و بلوکارت اتحادیه اروپا (EU Blue Card)',
        type: 'work',
        description: 'مهاجرت مستقیم با قرارداد کاری رسمی از کارفرمای آلمانی با حقوق مصوب سالانه و اقامت دائم سریع.',
        costUSD: '3,000 - 5,000 $ (بدون نیاز به حساب مسدود)',
        durationMonths: '4 تا 8 ماه',
        requirements: [
          'پیشنهاد کاری (Job Offer) با حداقل حقوق سالانه مصوب',
          'تطبیق مدرک تحصیلی با آلمان (آنابین / ZAB)',
          'سابقه کار مرتبط مستند (با بیمه یا پورتفولیو قوی)',
          'زبان انگلیسی یا آلمانی در حد مصاحبه کاری'
        ],
        isSuitableFor: (p) => {
          let score = 30;
          const reasons: string[] = [];
          if (p.education.majorCategory === 'computer_it') {
            score += 35;
            reasons.push('حوزه IT با امکان اپلای ریموت و جاب‌آفر');
          } else if (p.education.majorCategory === 'medical_health') {
            score += 30;
            reasons.push('حوزه درمان با تقاضای بالا (نیاز به معادل‌سازی)');
          }
          if (p.work.yearsExperience >= 3) {
            score += 20;
            reasons.push('سابقه کار حرفه‌ای مستند');
          }
          if (p.work.hasInternationalPortfolio) {
            score += 15;
            reasons.push('پورتفولیو بین‌المللی یا گیت‌هاب معتبر');
          }
          return { score: Math.min(score, 96), reason: reasons.join('، ') };
        }
      }
    ]
  },
  {
    id: 'italy',
    name: 'ایتالیا',
    nameEn: 'Italy',
    flag: '🇮🇹',
    languages: ['ایتالیایی', 'انگلیسی'],
    minimumBudgetUSD: 4000, // بورسیه استانی بخش زیادی از هزینه را پوشش می‌دهد
    averageTimelineMonths: 8,
    currency: 'یورو (€)',
    visaCenterInIran: 'کارگزاری ویزامتریک / سفارت ایتالیا در فرمانیه تهران',
    summary: 'بهترین و مقرون‌به‌صرفه‌ترین مقصد تحصیلی برای دانشجویان ایرانی به لطف بورسیه‌های استانی (DSU / ER.GO) تا سقف ۸۰۰۰ یورو در سال.',
    pros: [
      'بورسیه استانی که شهریه را صفر کرده و هزینه خوابگاه و زندگی را پرداخت می‌کند',
      'امکان تحصیل به زبان انگلیسی در مقطع ارشد و دکترا',
      'شرایط آسان‌تر پذیرش تحصیلی نسبت به اروپای شمالی',
      'ویزای شنگن با امکان سفر به کل اروپا'
    ],
    cons: [
      'بازار کار پس از فارغ‌التحصیلی در ایتالیا رقابتی و نرخ بیکاری جوانان نسبتاً بالا است',
      'بوروکراسی اداری کند (گرفتن مدارک ارزشیابی DOV یا CIMEA)',
      'سفارت ایتالیا در تهران در بررسی مدارک مالی و اصالت مدارک سخت‌گیر است'
    ],
    pathways: [
      {
        id: 'study_dsu',
        title: 'تحصیل کارشناسی ارشد با بورسیه استانی (DSU Scholarship)',
        type: 'study',
        description: 'اخذ پذیرش به زبان انگلیسی و دریافت بورسیه استانی مبتنی بر درآمد خانواده در ایران (عدد ایزه ISEE Parificato).',
        costUSD: '3,500 - 5,000 $ (هزینه‌های اولیه تا اولین قسط بورسیه)',
        durationMonths: '6 تا 9 ماه',
        requirements: [
          'مدرک کارشناسی مرتبط',
          'مدرک زبان انگلیسی (آیلتس ۶ یا تافل یا گاهی دولینگو بسته به دانشگاه)',
          'مدارک درآمدی سرپرست خانواده برای تشکیل پرونده ISEE در ایتالیا',
          'گردش حساب و تمکن مالی حدود ۶۰۰۰ یورو برای روز سفارت'
        ],
        isSuitableFor: (p) => {
          let score = 50;
          const reasons: string[] = [];
          if (p.education.degree === 'bachelor' || p.education.degree === 'associate') {
            score += 25;
            reasons.push('آمادگی کامل برای مقطع ارشد');
          }
          if (p.finances.needsScholarshipOrFreeTuition || p.finances.liquidBudgetUSD < 10000) {
            score += 20;
            reasons.push('تناسب عالی با بودجه‌های اقتصادی و تمایل به بورسیه');
          }
          if (p.languages.englishLevel === 'intermediate' || p.languages.englishLevel === 'advanced') {
            score += 15;
            reasons.push('امکان تحصیل به زبان انگلیسی');
          }
          return { score: Math.min(score, 97), reason: reasons.join('، ') };
        }
      }
    ]
  },
  {
    id: 'canada',
    name: 'کانادا',
    nameEn: 'Canada',
    flag: '🇨🇦',
    languages: ['انگلیسی', 'فرانسوی'],
    minimumBudgetUSD: 20000,
    averageTimelineMonths: 12,
    currency: 'دلار کانادا (CAD)',
    visaCenterInIran: 'سفارت در ایران تعطیل است (انگشت‌نگاری بیومتریک در استانبول، دبی، باکو یا ایروان)',
    summary: 'مقصد سنتی و محبوب ایرانیان با مسیرهای شفاف اقامت دائم (Express Entry)، استارتاپ و ویزای تحصیلی.',
    pros: [
      'جامعه مهاجرپذیر و جامعه بزرگ ایرانیان مقیم',
      'مسیر مستقیم اقامت دائم (PR) برای افراد با امتیاز CRS بالا',
      'امکان کار همسر به صورت تمام‌وقت (Open Work Permit) در بسیاری از دوره‌ها',
      'زبان رسمی انگلیسی (و فرانسوی با امتیاز فوق‌العاده)'
    ],
    cons: [
      'شهریه بالای دانشگاه‌ها برای دانشجویان بین‌المللی (سالانه ۱۵ تا ۳۰ هزار دلار)',
      'افزایش شدید امتیازات اکسپرس اینتری و رقابت بالا',
      'نیاز به سفر خارجی جهت انگشت‌نگاری و بیومتریک (VAC)',
      'هزینه‌های مسکن و زندگی بالا در تورنتو و ونکوور'
    ],
    pathways: [
      {
        id: 'express_entry',
        title: 'اسکیلد ورکر فدرال (Express Entry / PNP)',
        type: 'work',
        description: 'سیستم امتیازبندی سرمایه انسانی جهت دریافت کارت اقامت دائم (PR) مستقیم از ایران.',
        costUSD: '4,000 $ (هزینه‌های دولتی) + تمکن حدود 15,000 $ کانادا',
        durationMonths: '9 تا 18 ماه',
        requirements: [
          'حداقل مدرک کارشناسی یا ارشد معادل‌سازی شده با WES',
          'آیلتس جنرال با CLB 9 (معادل لیسنینگ 8، سایر مهارت‌ها 7) یا مدرک زبان فرانسه TEF/TCF',
          'حداقل ۳ سال سابقه کار رسمی مستند',
          'سن ترجیحاً زیر ۳۵ سال برای حداکثر امتیاز'
        ],
        isSuitableFor: (p) => {
          let score = 30;
          const reasons: string[] = [];
          if (p.languages.englishScore && (p.languages.englishLevel === 'advanced' || p.languages.englishLevel === 'fluent')) {
            score += 25;
            reasons.push('سطح زبان عالی (کلید CRS)');
          }
          if (p.education.degree === 'master' || p.education.degree === 'phd') {
            score += 20;
            reasons.push('امتیاز تحصیلی بالا (ارشد/دکترا)');
          }
          if (p.personal.age <= 30) {
            score += 15;
            reasons.push('حداکثر امتیاز سن');
          }
          if (p.work.yearsExperience >= 3 && p.work.hasOfficialInsurance) {
            score += 15;
            reasons.push('سابقه کار رسمی مستند با بیمه');
          }
          if (p.languages.frenchLevel !== 'none') {
            score += 20;
            reasons.push('مزیت طلایی زبان فرانسوی برای دراوهای اختصاصی');
          }
          return { score: Math.min(score, 95), reason: reasons.join('، ') };
        }
      },
      {
        id: 'study_canada',
        title: 'ویزای تحصیلی (Study Permit) و اجازه کار پس از تحصیل (PGWP)',
        type: 'study',
        description: 'تحصیل در دانشگاه‌ها و کالج‌های کانادا با حق کار در حین تحصیل و تبدیل به اقامت کاری پس از فارغ‌التحصیلی.',
        costUSD: '22,000 - 35,000 $ (شهریه سال اول + تمکن ۲۰ هزار دلاری)',
        durationMonths: '8 تا 12 ماه',
        requirements: [
          'پذیرش از موسسه معتبر آموزشی (DLI) با نامه PAL استانی',
          'مدرک زبان انگلیسی (آیلتس آکادمیک ۶.۵ یا تافل یا PTE)',
          'اثبات تمکن مالی قوی و دلیل قانع‌کننده بازگشت به کشور (Tie)',
          'انگیزه‌نامه بسیار قوی برای متقاعد کردن آفیسر ویزا'
        ],
        isSuitableFor: (p) => {
          let score = 40;
          const reasons: string[] = [];
          if (p.finances.liquidBudgetUSD >= 25000) {
            score += 30;
            reasons.push('تمکن مالی مناسب برای شهریه و زندگی');
          }
          if (p.personal.age <= 32) {
            score += 15;
            reasons.push('گپ تحصیلی کم و سن مناسب');
          }
          if (p.languages.englishLevel === 'advanced' || p.languages.englishLevel === 'fluent') {
            score += 15;
            reasons.push('زبان کافی برای پذیرش مستقیم');
          }
          return { score: Math.min(score, 90), reason: reasons.join('، ') };
        }
      }
    ]
  },
  {
    id: 'australia',
    name: 'استرالیا',
    nameEn: 'Australia',
    flag: '🇦🇺',
    languages: ['انگلیسی'],
    minimumBudgetUSD: 18000,
    averageTimelineMonths: 14,
    currency: 'دلار استرالیا (AUD)',
    visaCenterInIran: 'سفارت در تهران فعال برای ویزاهای خاص / ارزیابی آنلاین از طریق ImmiAccount',
    summary: 'بالاترین کیفیت زندگی، درآمد بالا و برنامه‌های مهاجرت مهارتی استانی (Subclass 190 و 491) برای مشاغل فنی و مهندسی.',
    pros: [
      'حقوق و دستمزدهای بالا و استانداردهای رفاهی عالی',
      'اقامت دائم در بدو ورود با ویزاهای مهارتی ۱۹۰ و ۱۸۹',
      'آب‌وهوای فوق‌العاده و جامعه چندفرهنگی',
      'امکان اقدام آنلاین بدون الزام به سفر اولیه'
    ],
    cons: [
      'سیستم اسسمنت (ارزیابی مدارک) بسیار سخت‌گیرانه با سازمان‌های ارزیاب (Engineers Australia, ACS, VETASSESS)',
      'نیاز به نمرات زبان بالا (حداقل آیلتس ۷ یا ۸ معادل در تمام مهارت‌ها)',
      'هزینه‌های اداری اسسمنت و لاج ویزا بالا است'
    ],
    pathways: [
      {
        id: 'skilled_migration_aus',
        title: 'ویزای مهارتی استرالیا (Subclass 189 / 190 / 491)',
        type: 'work',
        description: 'مهاجرت تخصصی نیروی کار ماهر بر اساس لیست مشاغل مورد نیاز و اسپانسری ایالتی.',
        costUSD: '6,000 $ (هزینه لاج و اسسمنت) + تمکن اولیه',
        durationMonths: '12 تا 20 ماه',
        requirements: [
          'ارزیابی مثبت سوابق کاری و تحصیلی از سازمان ارزیاب مربوطه (Skill Assessment)',
          'آیلتس ۷ یا ۸ (یا نمره معادل در آزمون PTE Academic)',
          'کسب حداقل ۶۵ امتیاز پایه در سیستم امتیازدهی مهاجرت استرالیا',
          'سن زیر ۴۵ سال و سوابق بیمه دقیق'
        ],
        isSuitableFor: (p) => {
          let score = 30;
          const reasons: string[] = [];
          if (p.work.yearsExperience >= 4 && p.work.hasOfficialInsurance) {
            score += 25;
            reasons.push('سابقه کار بیمه‌ای قوی جهت تایید اسسمنت');
          }
          if (p.languages.englishLevel === 'fluent' || (p.languages.englishExam === 'pte' || p.languages.englishExam === 'ielts')) {
            score += 25;
            reasons.push('پتانسیل کسب ۲۰ امتیاز زبان (PTE 79+ / IELTS 8)');
          }
          if (p.education.degree === 'bachelor' || p.education.degree === 'master') {
            score += 15;
            reasons.push('مدرک تحصیلی منطبق');
          }
          return { score: Math.min(score, 94), reason: reasons.join('، ') };
        }
      }
    ]
  },
  {
    id: 'austria',
    name: 'اتریش',
    nameEn: 'Austria',
    flag: '🇦🇹',
    languages: ['آلمانی'],
    minimumBudgetUSD: 10000,
    averageTimelineMonths: 9,
    currency: 'یورو (€)',
    visaCenterInIran: 'سفارت اتریش در تهران (نیاوران) + کارگزاری VFS Global',
    summary: 'قلب اروپای مرکزی با کیفیت زندگی تکرارنشدنی در وین و سیستم کارت قرمز-سفید-قرمز (Rot-Weiß-Rot Karte) برای متقاضیان کار و تحصیل.',
    pros: [
      'شهریه دانشگاه‌های دولتی برای ایرانیان حدود ۷۵۰ یورو در ترم (بسیار ارزان)',
      'ویزای جستجوی کار ۶ ماهه (Job Seeker Visa) بر اساس امتیاز',
      'امنیت اجتماعی و کیفیت زندگی رتبه اول جهانی در وین',
      'موقعیت مرکزی در قلب حوزه شنگن'
    ],
    cons: [
      'آلمانی‌زبان بودن جامعه و سختی پیدا کردن کار بدون آلمانی B2',
      'فرایند تایید مدارک در سفارت اتریش نیازمند تاییدات دادگستری و امور خارجه است'
    ],
    pathways: [
      {
        id: 'austria_job_seeker',
        title: 'ویزای جستجوی کار اتریش (Very Highly Qualified Workers)',
        type: 'job_seeker',
        description: 'ویزای ۶ ماهه جهت جستجوی کار در خاک اتریش و تبدیل به کارت Rot-Weiß-Rot.',
        costUSD: '8,000 - 10,000 $ (شامل تمکن مالی مسدود و هزینه‌ها)',
        durationMonths: '6 تا 9 ماه',
        requirements: [
          'کسب حداقل ۷۰ امتیاز از ۱۰۰ امتیاز جدول نیروهای متخصص عالی',
          'مدرک دانشگاهی مرتبط، زبان انگلیسی یا آلمانی، سن و سابقه کار',
          'تمکن مالی برای دوران ۶ ماهه در اتریش'
        ],
        isSuitableFor: (p) => {
          let score = 35;
          const reasons: string[] = [];
          if (p.education.degree === 'master' || p.education.degree === 'phd') {
            score += 25;
            reasons.push('تحصیلات عالی با امتیاز بالا');
          }
          if (p.languages.germanLevel !== 'none') {
            score += 20;
            reasons.push('مدرک یا دانش زبان آلمانی');
          }
          return { score: Math.min(score, 90), reason: reasons.join('، ') };
        }
      },
      {
        id: 'study_austria',
        title: 'تحصیل در اتریش (کارشناسی یا ارشد)',
        type: 'study',
        description: 'تحصیل با هزینه اندک (حدود ۷۲۶ یورو در ترم) با امکان شرکت در دوره‌های زبان آلمانی پیش‌نیاز در دانشگاه.',
        costUSD: '9,000 - 12,000 $ (تمکن مالی در حساب بانکی شخص)',
        durationMonths: '7 تا 10 ماه',
        requirements: [
          'گواهی اشتغال به تحصیل یا فارغ‌التحصیلی از دانشگاه معتبر در ایران (اشتغال در همان مقطع)',
          'تاییدیه سفارت اتریش روی مدارک ترجمه شده',
          'تمکن مالی در حساب ارزی'
        ],
        isSuitableFor: (p) => {
          let score = 45;
          const reasons: string[] = [];
          if (p.education.degree === 'highschool' || p.education.degree === 'bachelor') {
            score += 25;
            reasons.push('موقعیت مناسب برای اپلای لیسانس یا ارشد');
          }
          if (p.finances.liquidBudgetUSD >= 9000) {
            score += 20;
            reasons.push('تمکن مالی کافی');
          }
          return { score: Math.min(score, 92), reason: reasons.join('، ') };
        }
      }
    ]
  },
  {
    id: 'uae_oman',
    name: 'امارات و عمان',
    nameEn: 'UAE & Oman',
    flag: '🇦🇪 🇴🇲',
    languages: ['عربی', 'انگلیسی'],
    minimumBudgetUSD: 4000,
    averageTimelineMonths: 3,
    currency: 'درهم امارات / ریال عمان',
    visaCenterInIran: 'سفارت عمان و کارگزاری‌های ویزای دبی (آنلاین / دفاتر هواپیمایی)',
    summary: 'سریع‌ترین و در دسترس‌ترین مقاصد برای درآمد دلاری فوری، معاف از مالیات و نزدیکی به خانواده در ایران.',
    pros: [
      'فرایند صدور ویزا بسیار سریع (۲ تا ۴ هفته)',
      'بدون مالیات بر درآمد و درآمدزایی مستقیم به درهم/دلار',
      'فاصله پروازی کوتاه تا ایران (کمتر از ۲ ساعت) و سهولت رفت‌وآمد',
      'زبان انگلیسی در دبی زبان اصلی کار و تجارت است'
    ],
    cons: [
      'عدم اعطای تابعیت و شهروندی دائم (اقامت‌ها ۲ تا ۱۰ ساله و تمدیدپذیرند)',
      'هزینه‌های مسکن بالا در دبی',
      'گرمای شدید هوا در تابستان'
    ],
    pathways: [
      {
        id: 'work_gulf',
        title: 'ویزای کاری / جستجوی کار دبی و عمان',
        type: 'work',
        description: 'ورود با ویزای توریستی یا جاب‌سیکر، مصاحبه حضوری و تبدیل سریع به ویزای اقامت کاری ۲ ساله اسپانسری.',
        costUSD: '2,500 - 4,000 $ (بلیت، هتل ۱ ماهه و تبدیل ویزا)',
        durationMonths: '1 تا 3 ماه',
        requirements: [
          'پاسپورت با حداقل ۷ ماه اعتبار',
          'رزومه انگلیسی حرفه‌ای و آمادگی مصاحبه',
          'تایید مدارک در سفارت (در صورت الزام رشته‌های مهندسی و درمانی)'
        ],
        isSuitableFor: (p) => {
          let score = 40;
          const reasons: string[] = [];
          if (p.preferences.timeline === 'immediate' || p.preferences.timeline === 'under_1_year') {
            score += 25;
            reasons.push('نیاز به مهاجرت فوق‌العاده سریع');
          }
          if (p.education.majorCategory === 'medical_health') {
            score += 30;
            reasons.push('تقاضای بسیار بالا برای پزشک و پرستار با آزمون پرومتریک (Prometric/DHA)');
          } else if (p.education.majorCategory === 'computer_it' || p.education.majorCategory === 'business_finance') {
            score += 20;
            reasons.push('فرصت‌های استارتاپی و مالی دبی');
          }
          return { score: Math.min(score, 93), reason: reasons.join('، ') };
        }
      }
    ]
  },
  {
    id: 'sweden',
    name: 'سوئد',
    nameEn: 'Sweden',
    flag: '🇸🇪',
    languages: ['سوئدی', 'انگلیسی'],
    minimumBudgetUSD: 12000,
    averageTimelineMonths: 8,
    currency: 'کرون سوئد (SEK)',
    visaCenterInIran: 'سفارت سوئد در تهران و اداره مهاجرت سوئد (Migrationsverket)',
    summary: 'پایتخت نوآوری اروپا، مهد شرکت‌های بزرگ فناوری (Spotify, Klarna, Ericsson) و بالاترین استانداردهای رفاه اجتماعی.',
    pros: [
      'بیش از ۹۰٪ جامعه و محیط‌های شرکتی به زبان انگلیسی مسلط هستند',
      'بورسیه فول‌فاند انستیتو سوئد (SI Scholarship) با پوشش کامل شهریه و حقوق ماهانه',
      'امکان اخذ اقامت دائم پس از ۴ سال کار قانونی و بیمه',
      'تعادل بی‌نظیر کار و زندگی (Work-Life Balance) و حمایت‌های سخاوتمندانه از خانواده'
    ],
    cons: [
      'زمستان‌های سرد و طولانی در نیمه شمالی',
      'مالیات بر درآمد نسبتاً بالا در مقایسه با کشورهای حوزه خلیج فارس',
      'کمبود مسکن اجاره‌ای رسمی در شهرهای استکهلم و گوتنبرگ'
    ],
    pathways: [
      {
        id: 'sweden_work',
        title: 'ویزای کار تخصصی و IT سوئد (Work Permit)',
        type: 'work',
        description: 'مهاجرت مستقیم با قرارداد کاری رسمی از کارفرمای سوئدی دارای تاییدیه اتحادیه‌های کارگری (Facket).',
        costUSD: '3,000 - 5,000 $',
        durationMonths: '4 تا 8 ماه',
        requirements: [
          'پیشنهاد کاری تمام‌وقت با حداقل حقوق مصوب اداره مهاجرت سوئد',
          'بیمه‌های سلامت، عمر و بازنشستگی از سوی کارفرما',
          'پاسپورت معتبر و سابقه کاری مرتبط'
        ],
        isSuitableFor: (p) => {
          let score = 35;
          const reasons: string[] = [];
          if (p.education.majorCategory === 'computer_it') {
            score += 35;
            reasons.push('تقاضای شدید اکوسیستم استارتاپی سوئد برای برنامه‌نویسان');
          } else if (p.education.majorCategory === 'engineering') {
            score += 25;
            reasons.push('فرصت‌های صنعتی ولوو و اسکانیا');
          }
          if (p.languages.englishLevel === 'advanced' || p.languages.englishLevel === 'fluent') {
            score += 20;
            reasons.push('انگلیسی مسلط جهت استخدام در سوئد');
          }
          if (p.work.yearsExperience >= 3) {
            score += 15;
            reasons.push('سابقه کار کافی');
          }
          return { score: Math.min(score, 96), reason: reasons.join('، ') };
        }
      },
      {
        id: 'sweden_study_si',
        title: 'تحصیل کارشناسی ارشد و بورسیه انستیتو سوئد (SI Scholarship)',
        type: 'study',
        description: 'اخذ پذیرش از دانشگاه‌های ممتاز سوئد (KTH, Lund, Uppsala) و رقابت برای بورسیه فول‌فاند دولتی SI.',
        costUSD: '2,500 - 4,500 $ (با بورسیه SI شهریه صفر و ماهانه ۱۲ هزار کرون حقوق پرداخت می‌شود)',
        durationMonths: '6 تا 9 ماه',
        requirements: [
          'مدرک کارشناسی معتبر با معدل مناسب',
          'مدرک زبان آیلتس آکادمیک ۶.۵+ بدون مهارت زیر ۵.۵',
          'حداقل ۳۰۰۰ ساعت سابقه کار یا فعالیت اجتماعی برای بورسیه SI'
        ],
        isSuitableFor: (p) => {
          let score = 40;
          const reasons: string[] = [];
          if (p.education.degree === 'bachelor' || p.education.degree === 'master') {
            score += 25;
            reasons.push('واجد شرایط کارشناسی ارشد سوئد');
          }
          if (p.finances.needsScholarshipOrFreeTuition) {
            score += 20;
            reasons.push('هدف‌گذاری بورسیه انستیتو سوئد');
          }
          if (p.languages.englishLevel === 'advanced') {
            score += 15;
            reasons.push('نمره زبان ایده‌آل');
          }
          return { score: Math.min(score, 94), reason: reasons.join('، ') };
        }
      }
    ]
  },
  {
    id: 'denmark',
    name: 'دانمارک',
    nameEn: 'Denmark',
    flag: '🇩🇰',
    languages: ['دانمارکی', 'انگلیسی'],
    minimumBudgetUSD: 14000,
    averageTimelineMonths: 6,
    currency: 'کرون دانمارک (DKK)',
    visaCenterInIran: 'کارگزاری VFS Global تهران و آژانس استخدام بین‌المللی دانمارک (SIRI)',
    summary: 'شادترین و باثبات‌ترین اقتصاد شمال اروپا با طرح‌های کاری سریع لیست مثبت (Positive List) و درآمدهای بالا.',
    pros: [
      'بالاترین میانگین دستمزد و درآمدهای خالص در اروپا',
      'طرح لیست مثبت برای مهندسان، کادر درمان و متخصصان IT با کمترین تشریفات بوروکراتیک',
      'زبان انگلیسی به عنوان زبان دوم غیررسمی در تمام سطوح اداری و اجتماعی رایج است',
      'ساعات کاری استاندارد ۳۷ ساعت در هفته و مرخصی‌های باحقوق ۵ تا ۶ هفته در سال'
    ],
    cons: [
      'هزینه‌های زندگی و اجاره مسکن در کپنهاگ بسیار بالاست',
      'ارزیابی و تایید مدارک رشته‌های پزشکی و پیراپزشکی روندی دقیق و زمان‌بر دارد',
      'قوانین اخذ تابعیت و شهروندی دانمارک جزو سخت‌گیرانه‌ترین‌ها در اروپاست'
    ],
    pathways: [
      {
        id: 'denmark_positive_list',
        title: 'طرح لیست مشاغل مثبت دانمارک (Positive List Scheme)',
        type: 'work',
        description: 'اقامت کاری برای مشاغلی که در فهرست رسمی کمبود نیروی کار تخصصی دانمارک قرار دارند.',
        costUSD: '3,500 - 5,500 $',
        durationMonths: '3 تا 6 ماه',
        requirements: [
          'پیشنهاد کاری از کارفرمای دانمارکی در عناوین شغلی لیست مثبت',
          'مدرک دانشگاهی مرتبط معادل کارشناسی یا کارشناسی ارشد دانمارک',
          'حداقل حقوق قانونی سالانه مصوب دانمارک'
        ],
        isSuitableFor: (p) => {
          let score = 35;
          const reasons: string[] = [];
          if (p.education.majorCategory === 'engineering' || p.education.majorCategory === 'computer_it') {
            score += 35;
            reasons.push('حضور رشته در لیست مشاغل با کمبود دانمارک');
          } else if (p.education.majorCategory === 'medical_health') {
            score += 25;
            reasons.push('نیاز به کادر درمان');
          }
          if (p.work.yearsExperience >= 2) {
            score += 20;
            reasons.push('سوابق حرفه‌ای مستند');
          }
          return { score: Math.min(score, 95), reason: reasons.join('، ') };
        }
      },
      {
        id: 'denmark_fast_track',
        title: 'ویزای طرح سریع فست‌ترک دانمارک (Fast-Track Scheme)',
        type: 'work',
        description: 'صدور ویزای ورود و مجوز کار ظرف حداکثر ۱ ماه از طریق شرکت‌های تایید شده دولتی دانمارک.',
        costUSD: '3,000 - 4,500 $',
        durationMonths: '1 تا 3 ماه',
        requirements: [
          'قرارداد کاری با شرکت معتبر دارای گواهینامه Fast-Track',
          'حقوق بالاتر از سقف مصوب طرح حقوق سریع (Pay Limit Scheme)',
          'پاسپورت معتبر'
        ],
        isSuitableFor: (p) => {
          let score = 30;
          const reasons: string[] = [];
          if (p.preferences.timeline === 'immediate' || p.preferences.timeline === 'under_1_year') {
            score += 30;
            reasons.push('تمایل به سریع‌ترین پردازش ممکن');
          }
          if (p.education.majorCategory === 'computer_it' || p.education.majorCategory === 'business_finance') {
            score += 25;
            reasons.push('پتانسیل بالای استخدام در شرکت‌های بین‌المللی دانمارک');
          }
          return { score: Math.min(score, 93), reason: reasons.join('، ') };
        }
      }
    ]
  },
  {
    id: 'norway',
    name: 'نروژ',
    nameEn: 'Norway',
    flag: '🇳🇴',
    languages: ['نروژی', 'انگلیسی'],
    minimumBudgetUSD: 16000,
    averageTimelineMonths: 7,
    currency: 'کرون نروژ (NOK)',
    visaCenterInIran: 'کارگزاری VFS Global تهران و اداره مهاجرت نروژ (UDI)',
    summary: 'ثروتمندترین کشور اسکاندیناوی، رتبه ۱ شاخص توسعه انسانی جهان و بالاترین سطح رفاه و دستمزد.',
    pros: [
      'بالاترین پایه حقوق و قدرت خرید در کل قاره اروپا',
      'بازار کار فوق‌العاده برای مهندسان نفت، گاز، صنایع دریایی، انرژی‌های تجدیدپذیر و IT',
      'طبیعت رویایی، آب و هوای پاک و ضریب امنیت اجتماعی کم‌نظیر',
      'امکان همراهی همسر و فرزندان با اجازه کار فول‌تایم برای همسر'
    ],
    cons: [
      'هزینه‌های زندگی، حمل و نقل و اقلام خوراکی بسیار گران است',
      'از سال ۲۰۲۳ دانشگاه‌های نروژ برای دانشجویان خارج از اروپا شهریه وضع کرده‌اند',
      'نیاز به یادگیری زبان نروژی برای ارتباطات عمیق و مشاغل غیر از IT'
    ],
    pathways: [
      {
        id: 'norway_skilled_worker',
        title: 'ویزای نیروی کار ماهر نروژ (Skilled Worker Residence Permit)',
        type: 'work',
        description: 'اقامت کاری نروژ از طریق اداره مهاجرت UDI بر مبنای قرارداد رسمی تمام‌وقت از یک کارفرمای نروژی.',
        costUSD: '4,000 - 6,500 $',
        durationMonths: '3 تا 6 ماه',
        requirements: [
          'مدرک دانشگاهی مرتبط با رشته و پوزیشن شغلی',
          'پیشنهاد کاری رسمی با حداقل حقوق مصوب صنفی نروژ',
          'تطابق قرارداد با استانداردهای اداره کار نروژ (Arbeidstilsynet)'
        ],
        isSuitableFor: (p) => {
          let score = 35;
          const reasons: string[] = [];
          if (p.education.majorCategory === 'engineering' || p.education.majorCategory === 'computer_it') {
            score += 35;
            reasons.push('تقاضای بالا در صنایع انرژی، دریانوردی و IT نروژ');
          }
          if (p.work.yearsExperience >= 3) {
            score += 20;
            reasons.push('تجربه کاری حرفه‌ای');
          }
          if (p.preferences.primaryGoal === 'lifestyle_freedom') {
            score += 15;
            reasons.push('بهترین کیفیت زندگی در جهان');
          }
          return { score: Math.min(score, 94), reason: reasons.join('، ') };
        }
      }
    ]
  },
  {
    id: 'finland',
    name: 'فنلاند',
    nameEn: 'Finland',
    flag: '🇫🇮',
    languages: ['فنلاندی', 'سوئدی', 'انگلیسی'],
    minimumBudgetUSD: 11000,
    averageTimelineMonths: 5,
    currency: 'یورو (€)',
    visaCenterInIran: 'کارگزاری VFS Global تهران و اداره مهاجرت فنلاند (Migri)',
    summary: 'شادترین کشور دنیا، پیشروترین نظام آموزشی جهان و ارائه‌دهنده ویزای کاری فست‌ترک ۲ هفته‌ای.',
    pros: [
      'ویزای فست‌ترک ۲ هفته‌ای (Specialist Fast Track) برای متخصصان و مدیران فناوری',
      'اعطای مجوز اقامت پیوسته نوع A به دانشجویان بین‌المللی و احتساب دوران تحصیل در سابقه اقامت دائم',
      'اجازه کار ۳۰ ساعت در هفته در حین تحصیل و ویزای ۲ ساله جستجوی کار پس از فراغت',
      'رتبه ۱ جهان در شفافیت اداری، سلامت روانی و برابری اجتماعی'
    ],
    cons: [
      'زبان فنلاندی گرامر و ساختار بسیار دشواری دارد',
      'زمستان‌های تاریک و کمبود نور خورشید در ماه‌های دسامبر و ژانویه',
      'بازار کار داخلی نسبت به آلمان و بریتانیا فشرده‌تر است'
    ],
    pathways: [
      {
        id: 'finland_specialist_fasttrack',
        title: 'ویزای فوق‌سریع متخصصان فنلاند (Specialist Fast Track 14 Days)',
        type: 'work',
        description: 'سریع‌ترین ویزای شنگن اروپا با صدور ویزای D ورود ظرف ۲ هفته برای متخصصان فناوری و مدیران.',
        costUSD: '3,000 - 5,000 $',
        durationMonths: '1 تا 2 ماه',
        requirements: [
          'پیشنهاد کاری با حداقل حقوق ماهانه حدود ۳,۶۰۰ یورو ناخالص',
          'مدرک دانشگاهی مرتبط',
          'سابقه کاری حرفه‌ای قابل استناد'
        ],
        isSuitableFor: (p) => {
          let score = 35;
          const reasons: string[] = [];
          if (p.education.majorCategory === 'computer_it') {
            score += 35;
            reasons.push('اکوسیستم استارتاپی و گیمینگ فنلاند (Nokia, Rovio, Supercell)');
          }
          if (p.preferences.timeline === 'immediate' || p.preferences.timeline === 'under_1_year') {
            score += 25;
            reasons.push('نیاز به پردازش فوق‌سریع ۲ هفته‌ای');
          }
          return { score: Math.min(score, 97), reason: reasons.join('، ') };
        }
      },
      {
        id: 'finland_study_pr',
        title: 'تحصیل در فنلاند با اقامت پیوسته (Type A Continuous Residence Permit)',
        type: 'study',
        description: 'تحصیل در دانشگاه‌های علمی‌کاربردی و جامع فنلاند با ویزای اقامت پیوسته و هموارترین مسیر اقامت دائم اروپا.',
        costUSD: '10,000 - 13,000 $ (شامل تمکن و شهریه پس از بورسیه)',
        durationMonths: '4 تا 7 ماه',
        requirements: [
          'مدرک دیپلم یا کارشناسی با ترجمه رسمی',
          'آیلتس آکادمیک ۶.۰+ یا تافل',
          'تمکن مالی سالانه ۶,۷۲۰ یورو در حساب بانکی'
        ],
        isSuitableFor: (p) => {
          let score = 35;
          const reasons: string[] = [];
          if (p.preferences.primaryGoal === 'quick_pr') {
            score += 30;
            reasons.push('احتساب کل دوران تحصیل در سنوات اقامت دائم فنلاند');
          }
          if (p.education.degree === 'highschool' || p.education.degree === 'bachelor') {
            score += 20;
            reasons.push('واجد شرایط مقاطع لیسانس و ارشد');
          }
          return { score: Math.min(score, 95), reason: reasons.join('، ') };
        }
      }
    ]
  },
  {
    id: 'uk',
    name: 'انگلیس',
    nameEn: 'United Kingdom',
    flag: '🇬🇧',
    languages: ['انگلیسی'],
    minimumBudgetUSD: 16000,
    averageTimelineMonths: 6,
    currency: 'پوند استرلینگ (£)',
    visaCenterInIran: 'مرکز VFS Global تهران و پورتال رسمی gov.uk',
    summary: 'پایتخت مالی و فناوری اروپا با مسیرهای شفاف ویزای کار ماهر (Skilled Worker) و ویزای فارغ‌التحصیلی ۲ ساله (Graduate Route).',
    pros: [
      'زبان رسمی انگلیسی بدون نیاز به یادگیری زبان دوم',
      'بازار کار فوق‌العاده برای IT، امور مالی و مهندسی در لندن، منچستر و ادینبرو',
      'امکان کار همسر به صورت فول‌تایم در اکثر ویزاهای کاری',
      'اخذ اقامت دائم (ILR) پس از ۵ سال کار قانونی با بیمه'
    ],
    cons: [
      'هزینه‌های بالای مسکن و زندگی به ویژه در لندن',
      'شهریه سنگین دانشگاه‌ها برای دانشجویان بین‌المللی (۱۵ تا ۲۵ هزار پوند در سال)',
      'افزایش حداقل حقوق مصوب ویزای کار به ۳۸,۷۰۰ پوند در سال ۲۰۲۴'
    ],
    pathways: [
      {
        id: 'uk_skilled_worker',
        title: 'ویزای نیروی کار ماهر انگلیس (Skilled Worker Visa)',
        type: 'work',
        description: 'مهاجرت با جاب‌آفر رسمی از کارفرمای دارای لایسنس اسپانسرشیپ Home Office با حداقل حقوق سالانه ۳۸,۷۰۰ پوند.',
        costUSD: '4,000 - 6,000 $ (شامل هزینه ویزا و بیمه سلامت NHS)',
        durationMonths: '3 تا 6 ماه',
        requirements: [
          'پیشنهاد کاری از کارفرمای مورد تایید وزارت کشور بریتانیا با نامه CoS',
          'مدرک زبان انگلیسی حداقل B1 (آیلتس جنرال/آکادمیک ۴.۰ یا SELT)',
          'شغل در لیست مشاغل واجد شرایط SOC کد Home Office'
        ],
        isSuitableFor: (p) => {
          let score = 35;
          const reasons: string[] = [];
          if (p.languages.englishLevel === 'advanced' || p.languages.englishLevel === 'fluent') {
            score += 25;
            reasons.push('تسلط بر زبان انگلیسی');
          }
          if (p.education.majorCategory === 'computer_it' || p.education.majorCategory === 'business_finance') {
            score += 25;
            reasons.push('رشته دارای تقاضای بالا در بازار کار بریتانیا');
          }
          if (p.work.yearsExperience >= 3) {
            score += 15;
            reasons.push('سابقه کار حرفه‌ای مستند');
          }
          return { score: Math.min(score, 95), reason: reasons.join('، ') };
        }
      },
      {
        id: 'uk_study_graduate',
        title: 'ویزای تحصیلی و اقامت پس از فراغت (Student Visa + Graduate PSW)',
        type: 'study',
        description: 'تحصیل کارشناسی ارشد ۱ ساله در دانشگاه‌های ممتاز بریتانیا و دریافت اقامت کاری ۲ ساله آزاد بدون نیاز به اسپانسر.',
        costUSD: '22,000 - 32,000 $ (شهریه دوره ارشد ۱ ساله + تمکن بانکی)',
        durationMonths: '4 تا 8 ماه',
        requirements: [
          'پذیرش رسمی با شماره CAS از دانشگاه معتبر بریتانیا',
          'آیلتس آکادمیک ۶.۵ یا تافل معادل',
          'تمکن مالی ۲۸ روزه در حساب بانکی شخص متقاضی یا والدین'
        ],
        isSuitableFor: (p) => {
          let score = 35;
          const reasons: string[] = [];
          if (p.education.degree === 'bachelor' || p.education.degree === 'master') {
            score += 25;
            reasons.push('مناسب برای مقطع کارشناسی ارشد ۱ ساله فشرده');
          }
          if (p.finances.liquidBudgetUSD >= 20000) {
            score += 20;
            reasons.push('توانایی تامین شهریه و هزینه‌های اولیه');
          }
          if (p.preferences.primaryGoal === 'quick_pr' || p.preferences.timeline === 'under_1_year') {
            score += 15;
            reasons.push('دوره‌های ۱ ساله بریتانیا سریع‌ترین زمان فارغ‌التحصیلی را دارند');
          }
          return { score: Math.min(score, 92), reason: reasons.join('، ') };
        }
      }
    ]
  },
  {
    id: 'usa',
    name: 'آمریکا',
    nameEn: 'United States',
    flag: '🇺🇸',
    languages: ['انگلیسی'],
    minimumBudgetUSD: 18000,
    averageTimelineMonths: 12,
    currency: 'دلار آمریکا ($)',
    visaCenterInIran: 'سفارت‌های آمریکا در آنکارا (ترکیه)، ایروان (ارمنستان) و ابوظبی (امارات)',
    summary: 'بزرگترین اقتصاد جهان، مهد غول‌های سیلیکون‌ولی و بالاترین درآمدهای فناوری، با مسیرهای لاتاری، تحصیلی F-1 و گرین‌کارت نخبگان.',
    pros: [
      'بالاترین حقوق و دستمزدهای جهان در حوزه‌های IT، مهندسی و پزشکی',
      'فرصت کار ۳ ساله پس از فارغ‌التحصیلی در رشته‌های STEM (STEM OPT)',
      'لاتاری سالانه گرین‌کارت (DV Lottery) با شانس اخذ اقامت دائم مستقیم بدون مدرک زبان و هزینه',
      'امکان خوداسپانسری اقامت دائم از طریق گرین‌کارت نخبگان (EB-2 NIW)'
    ],
    cons: [
      'عدم وجود سفارت در ایران و الزام به سفر خارجی برای مصاحبه کنسولی',
      'پروسه کلیرنس اداری و امنیتی (Administrative Processing) برای متقاضیان ایرانی',
      'شهریه بالای دانشگاه‌ها برای دوره‌های بدون فاند',
      'سیستم پیچیده قرعه‌کشی ویزای کار تجاری H-1B'
    ],
    pathways: [
      {
        id: 'usa_dv_lottery',
        title: 'لاتاری گرین‌کارت آمریکا (Diversity Immigrant Visa - DV Lottery)',
        type: 'job_seeker',
        description: 'برنامه سالانه قرعه‌کشی ویزای تنوع نژادی وزارت امور خارجه آمریکا با اعطای اقامت دائم قطعی (Green Card) از بدو ورود به برندگان.',
        costUSD: '1,500 - 3,000 $ (صرفاً هزینه‌های مدیکال، مصاحبه سفارت و صدور گرین‌کارت پس از قبولی)',
        durationMonths: '12 تا 18 ماه',
        requirements: [
          'ثبت‌نام اینترنتی در سایت رسمی dvprogram.state.gov در مهر و آبان',
          'حداقل مدرک دیپلم ۱۲ ساله یا ۲ سال سابقه کار مهارتی در ۵ سال اخیر',
          'بدون نیاز به مدرک زبان انگلیسی یا تمکن مالی سنگین',
          'پاسپورت معتبر در زمان مصاحبه سفارت'
        ],
        isSuitableFor: (p) => {
          let score = 50;
          const reasons: string[] = [];
          if (p.education.degree !== 'associate') {
            score += 20;
            reasons.push('دارای حداقل مدرک دیپلم معتبر جهت احراز صلاحیت لاتاری');
          }
          if (p.preferences.primaryGoal === 'quick_pr' || p.preferences.riskTolerance === 'moderate') {
            score += 20;
            reasons.push('دریافت مستقیم گرین‌کارت دائمی آمریکا بدون وابستگی به کارفرما');
          }
          return { score: Math.min(score, 98), reason: reasons.join('، ') };
        }
      },
      {
        id: 'usa_f1_opt',
        title: 'ویزای تحصیلی F-1 با ۳ سال کار قانونی (STEM OPT Extension)',
        type: 'study',
        description: 'تحصیل در دانشگاه‌های معتبر آمریکا با فاند کامل (TA/RA) یا سلف‌فاند و اشتغال ۳۶ ماهه با درآمد دلاری پس از فراغت در رشته‌های فنی-مهندسی.',
        costUSD: '20,000 - 35,000 $ (در صورت عدم دریافت فاند کامل سال اول)',
        durationMonths: '8 تا 14 ماه',
        requirements: [
          'اخذ فرم I-20 رسمی از دانشگاه معتبر آمریکا (SEVP Approved)',
          'مدرک تافل (۸۰+) یا آیلتس (۶.۵+) یا دولینگو (۱۱۰+)',
          'اثبات تمکن مالی و علایق قوی بازگشت به کشور (Non-immigrant Intent)',
          'پرداخت کارمزد سویس (SEVIS I-901 Fee)'
        ],
        isSuitableFor: (p) => {
          let score = 35;
          const reasons: string[] = [];
          if (p.education.majorCategory === 'computer_it' || p.education.majorCategory === 'engineering' || p.education.majorCategory === 'basic_sciences') {
            score += 35;
            reasons.push('رشته جزو دسته‌بندی STEM با ۳ سال مجوز کار تمام‌وقت (OPT)');
          }
          if (p.education.degree === 'bachelor' || p.education.degree === 'master') {
            score += 20;
            reasons.push('آمادگی آکادمیک برای کارشناسی ارشد و دکترا');
          }
          if (p.languages.englishLevel === 'advanced' || p.languages.englishLevel === 'fluent') {
            score += 15;
            reasons.push('نمره زبان ایده‌آل');
          }
          return { score: Math.min(score, 94), reason: reasons.join('، ') };
        }
      },
      {
        id: 'usa_eb2_niw',
        title: 'گرین‌کارت منافع ملی نخبگان آمریکا (EB-2 NIW Green Card)',
        type: 'work',
        description: 'دریافت مستقیم اقامت دائم بدون نیاز به کارفرمای آمریکایی، جاب‌آفر یا فرآیند کارگری PERM بر مبنای سوابق علمی و دستاوردهای تخصصی.',
        costUSD: '5,000 - 9,000 $ (هزینه‌های وکیل مهاجرتی و لاج فرم I-140 به USCIS)',
        durationMonths: '12 تا 24 ماه',
        requirements: [
          'مدرک کارشناسی ارشد یا دکترا (یا کارشناسی با حداقل ۵ سال سابقه کار تخصصی)',
          'اثبات اهمیت ملی تخصص و توانایی شما برای اقتصاد یا علم آمریکا',
          'داشتن مقالات، استنادات علمی، پتنت، جوایز یا پروژه‌های شاخص بین‌المللی'
        ],
        isSuitableFor: (p) => {
          let score = 30;
          const reasons: string[] = [];
          if (p.education.degree === 'phd' || p.education.degree === 'master') {
            score += 35;
            reasons.push('مدرک تحصیلات تکمیلی مورد نیاز برای رده EB-2');
          }
          if (p.work.yearsExperience >= 4) {
            score += 20;
            reasons.push('سوابق کاری حرفه‌ای قابل اتکا');
          }
          return { score: Math.min(score, 93), reason: reasons.join('، ') };
        }
      }
    ]
  },
  {
    id: 'netherlands',
    name: 'هلند',
    nameEn: 'Netherlands',
    flag: '🇳🇱',
    languages: ['هلندی', 'انگلیسی'],
    minimumBudgetUSD: 13000,
    averageTimelineMonths: 6,
    currency: 'یورو (€)',
    visaCenterInIran: 'کارگزاری VFS Global تهران و اداره مهاجرت هلند (IND)',
    summary: 'هاب فناوری و تجارت اروپای غربی با بیشترین درصد تسلط به انگلیسی و طرح مهاجر ماهر (Kennismigrant) همراه با مزیت ۳۰٪ معافیت مالیاتی.',
    pros: [
      'بیش از ۹۵٪ جامعه به روانی انگلیسی صحبت می‌کنند',
      'طرح ۳۰٪ معافیت مالیاتی (30% Tax Ruling) برای متخصصان خارجی جذب شده',
      'ویزای ۱ ساله جستجوی کار (Zoekjaar) برای فارغ‌التحصیلان ۲۰۰ دانشگاه برتر جهان',
      'مقر شرکت‌های غول فناوری مانند ASML, Booking.com, Philips و Adyen'
    ],
    cons: [
      'بحران کمبود شدید مسکن اجاره‌ای در آمستردام، روتردام و اوترخت',
      'هزینه‌های زندگی بالا نسبت به جنوب اروپا',
      'آب‌وهوای ابری و بارانی در طول سال'
    ],
    pathways: [
      {
        id: 'nl_kennismigrant',
        title: 'ویزای مهاجر بسیار ماهر هلند (Highly Skilled Migrant - Kennismigrant)',
        type: 'work',
        description: 'مهاجرت با جاب‌آفر از کارفرمای مورد تایید اداره مهاجرت هلند (IND Recognised Sponsor) با حداقل حقوق مصوب دولتی.',
        costUSD: '3,000 - 5,000 $',
        durationMonths: '2 تا 4 ماه',
        requirements: [
          'قرارداد کاری با کارفرمای معتبر ثبت‌شده در IND',
          'حداقل حقوق ماهانه مصوب (حدود ۴,۰۷۱ یورو برای افراد بالای ۳۰ سال و ۲,۹۸۹ یورو برای زیر ۳۰ سال)',
          'پاسپورت معتبر و مدارک دانشگاهی مرتبط'
        ],
        isSuitableFor: (p) => {
          let score = 35;
          const reasons: string[] = [];
          if (p.education.majorCategory === 'computer_it' || p.education.majorCategory === 'engineering') {
            score += 35;
            reasons.push('تقاضای شدید اکوسیستم های‌تک هلند برای مهندسان نرم‌افزار و سخت‌افزار');
          }
          if (p.languages.englishLevel === 'advanced' || p.languages.englishLevel === 'fluent') {
            score += 20;
            reasons.push('زبان کاری شرکت‌های هلندی تماماً انگلیسی است');
          }
          if (p.work.yearsExperience >= 2) {
            score += 15;
            reasons.push('سوابق کاری مکفی');
          }
          return { score: Math.min(score, 96), reason: reasons.join('، ') };
        }
      },
      {
        id: 'nl_zoekjaar',
        title: 'ویزای جستجوی کار هلند (Orientation Year / Zoekjaar)',
        type: 'job_seeker',
        description: 'ویزای اقامت ۱ ساله جهت جستجوی کار در هلند برای فارغ‌التحصیلان دانشگاه‌های هلند یا فارغ‌التحصیلان ۲۰۰ دانشگاه برتر جهان (QS/THE).',
        costUSD: '2,500 - 4,000 $',
        durationMonths: '2 تا 4 ماه',
        requirements: [
          'فارغ‌التحصیلی در ۳ سال اخیر از ۲۰۰ دانشگاه برتر جهان یا دانشگاه‌های هلند',
          'مدرک زبان انگلیسی آیلتس ۶.۰ یا معادل',
          'تمکن مالی برای دوره اقامت در هلند'
        ],
        isSuitableFor: (p) => {
          let score = 30;
          const reasons: string[] = [];
          if (p.education.universityType === 'state_top' || p.education.degree === 'master' || p.education.degree === 'phd') {
            score += 30;
            reasons.push('فارغ‌التحصیل دانشگاه‌های رتبه برتر');
          }
          if (p.preferences.timeline === 'immediate' || p.preferences.timeline === 'under_1_year') {
            score += 20;
            reasons.push('تمایل به جستجوی کار مستقیم در خاک هلند');
          }
          return { score: Math.min(score, 91), reason: reasons.join('، ') };
        }
      }
    ]
  },
  {
    id: 'france',
    name: 'فرانسه',
    nameEn: 'France',
    flag: '🇫🇷',
    languages: ['فرانسوی', 'انگلیسی'],
    minimumBudgetUSD: 8000,
    averageTimelineMonths: 6,
    currency: 'یورو (€)',
    visaCenterInIran: 'مرکز VFS Global تهران و درگاه رسمی کمپیوس فرانس ایران (Campus France)',
    summary: 'مرکز فرهنگ و هنر اروپا با سیستم حمایتی دانشجویی بی‌نظیر (CAF)، شهریه کم دانشگاه‌های دولتی و ویزای پاسپورت تلنت.',
    pros: [
      'شهریه بسیار ارزان دانشگاه‌های دولتی فرانسه برای دانشجویان بین‌المللی',
      'کمک‌هزینه مسکن ماهانه دانشجویی از طرف دولت فرانسه (کمک‌هزینه CAF بین ۱۰۰ تا ۲۵۰ یورو در ماه)',
      'ویزای ۴ ساله اقامت کاری پاسپورت تلنت (Passeport Talent) برای متخصصان و استارتاپ‌ها',
      'امکان کار دانشجویی تا ۶۰٪ ساعات کاری رسمی (حدود ۲۰ ساعت در هفته)'
    ],
    cons: [
      'یادگیری زبان فرانسوی برای زندگی روزمره و اکثر مشاغل خارج از حوزه IT حیاتی است',
      'بوروکراسی اداری و زمان‌بر بودن تایید مدارک در پرتال کمپیوس فرانس',
      'سفارت فرانسه در ارزیابی مدارک مالی و انگیزه‌نامه تحصیلی سخت‌گیر است'
    ],
    pathways: [
      {
        id: 'fr_passeport_talent',
        title: 'ویزای اقامت مهارتی پاسپورت تلنت (Passeport Talent)',
        type: 'work',
        description: 'اقامت کاری ۴ ساله چندبار ورود بدون نیاز به مجوز اداره کار برای متخصصان فناوری، استارتاپ‌ها و فارغ‌التحصیلان ارشد.',
        costUSD: '3,000 - 4,500 $',
        durationMonths: '2 تا 4 ماه',
        requirements: [
          'قرارداد کاری با شرکت فرانسوی با حداقل حقوق ناخالص سالانه مصوب (حدود ۴۲,۰۰۰ یورو)',
          'مدرک کارشناسی ارشد یا سابقه ۵ سال فعالیت حرفه‌ای معادل',
          'پاسپورت معتبر'
        ],
        isSuitableFor: (p) => {
          let score = 35;
          const reasons: string[] = [];
          if (p.education.majorCategory === 'computer_it' || p.education.majorCategory === 'engineering') {
            score += 35;
            reasons.push('تقاضای اکوسیستم فناوری Station F و شرکت‌های فناوری فرانسه');
          }
          if (p.languages.frenchLevel !== 'none') {
            score += 25;
            reasons.push('تسلط بر زبان فرانسوی');
          } else if (p.languages.englishLevel === 'advanced') {
            score += 15;
            reasons.push('امکان کار به زبان انگلیسی در شرکت‌های بین‌المللی پاریس');
          }
          return { score: Math.min(score, 95), reason: reasons.join('، ') };
        }
      },
      {
        id: 'fr_campus_study',
        title: 'تحصیل در فرانسه از طریق کمپیوس فرانس (Campus France)',
        type: 'study',
        description: 'اخذ پذیرش از دانشگاه‌های دولتی فرانسه با شهریه اندک، بیمه درمانی رایگان و کمک‌هزینه مسکن دانشجویی CAF.',
        costUSD: '5,000 - 8,000 $ (شامل تمکن مالی حدود ۷,۵۰۰ یورو)',
        durationMonths: '4 تا 8 ماه',
        requirements: [
          'ثبت پرونده و مصاحبه در سامانه کمپیوس فرانس تهران (Etudes en France)',
          'مدرک زبان فرانسوی B2 (TCF/DELF) یا مدرک زبان انگلیسی آیلتس ۶.۵ برای دوره‌های انگلیسی‌زبان',
          'تمکن مالی حداقل ۶۱۵ یورو در ماه برای مدت ۱ سال تحصیلی'
        ],
        isSuitableFor: (p) => {
          let score = 40;
          const reasons: string[] = [];
          if (p.languages.frenchLevel !== 'none') {
            score += 30;
            reasons.push('امتیاز طلایی آشنایی با زبان فرانسه');
          }
          if (p.finances.needsScholarshipOrFreeTuition || p.finances.liquidBudgetUSD < 12000) {
            score += 20;
            reasons.push('تناسب با بودجه اقتصادی و شهریه پایین دانشگاه‌های فرانسه');
          }
          return { score: Math.min(score, 93), reason: reasons.join('، ') };
        }
      }
    ]
  },
  {
    id: 'japan',
    name: 'ژاپن',
    nameEn: 'Japan',
    flag: '🇯🇵',
    languages: ['ژاپنی', 'انگلیسی'],
    minimumBudgetUSD: 9000,
    averageTimelineMonths: 7,
    currency: 'ین ژاپن (JPY)',
    visaCenterInIran: 'سفارت ژاپن در تهران (خیابان وزرا)',
    summary: 'امن‌ترین و منظم‌ترین کشور دنیا با کمبود شدید نیروی کار و سیستم پیشرفته ویزای متخصصان ماهر (HSP) و بورسیه دولتی MEXT.',
    pros: [
      'امنیت اجتماعی رتبه اول جهان و سیستم درمانی و بهداشتی فوق‌العاده',
      'بورسیه دولتی فول‌فاند MEXT با حقوق ماهانه عالی و بدون نیاز به تمکن',
      'امکان اخذ اقامت دائم ژاپن ظرف تنها ۱ تا ۲ سال با سیستم امتیازبندی HSP (۸۰ امتیاز)',
      'تقاضای بالا برای استخدام مهندسان نرم‌افزار، الکترونیک و مکانیک'
    ],
    cons: [
      'زبان ژاپنی با ۳ سیستم نگارشی ساختار متفاوتی دارد',
      'فرهنگ کاری سخت‌کوشانه و سلسله‌مراتب سنتی در شرکت‌های ژاپنی',
      'سفارت ژاپن در تهران برای ویزای کار حتماً نیاز به ارائه اصل گواهی COE دارد'
    ],
    pathways: [
      {
        id: 'jp_hsp_visa',
        title: 'ویزای متخصصان بسیار ماهر ژاپن (Highly Skilled Professional - HSP)',
        type: 'work',
        description: 'اقامت ۵ ساله بر مبنای کسب حداقل ۷۰ امتیاز (سن، مدرک، زبان، درآمد) با سریع‌ترین مسیر اقامت دائم ژاپن (۱ تا ۳ سال).',
        costUSD: '2,500 - 4,000 $',
        durationMonths: '2 تا 4 ماه',
        requirements: [
          'پیشنهاد کاری از شرکتی در ژاپن با درآمد حداقل ۳ میلیون ین در سال',
          'کسب حداقل ۷۰ امتیاز از جدول امتیازات مهاجرت ژاپن',
          'اخذ گواهی صلاحیت اقامت (Certificate of Eligibility - COE)'
        ],
        isSuitableFor: (p) => {
          let score = 35;
          const reasons: string[] = [];
          if (p.education.majorCategory === 'computer_it' || p.education.majorCategory === 'engineering') {
            score += 35;
            reasons.push('تقاضای استخدام شدید در غول‌های فناوری ژاپن (Sony, Rakuten, Line)');
          }
          if (p.education.degree === 'master' || p.education.degree === 'phd') {
            score += 20;
            reasons.push('امتیاز تحصیلی بالا در جدول HSP ژاپن');
          }
          return { score: Math.min(score, 95), reason: reasons.join('، ') };
        }
      },
      {
        id: 'jp_mext_study',
        title: 'بورسیه دولتی ژاپن (MEXT Scholarship) و پذیرش دانشگاهی',
        type: 'study',
        description: 'تحصیل در دانشگاه‌های برتر ژاپن (توکیو، کیوتو، اوزاکا) با پوشش ۱۰۰٪ شهریه، بلیت رفت و برگشت و حقوق ماهیانه ۱۴۴ هزار ین.',
        costUSD: '1,500 - 2,500 $ (با قبولی در MEXT شهریه کاملاً رایگان است)',
        durationMonths: '6 تا 10 ماه',
        requirements: [
          'معدل بالای ۱۶ در مقطع تحصیلی قبلی',
          'تسلط به زبان انگلیسی (آیلتس ۶.۵+) یا زبان ژاپنی',
          'پروپوزال تحقیقاتی قوی و قبولی در آزمون و مصاحبه سفارت ژاپن در تهران'
        ],
        isSuitableFor: (p) => {
          let score = 40;
          const reasons: string[] = [];
          if (p.education.degree === 'bachelor' || p.education.degree === 'master') {
            score += 25;
            reasons.push('مناسب برای مقاطع کارشناسی ارشد و دکترا با بورسیه MEXT');
          }
          if (p.finances.needsScholarshipOrFreeTuition) {
            score += 25;
            reasons.push('هدف‌گذاری بورسیه دولتی فول‌فاند');
          }
          return { score: Math.min(score, 94), reason: reasons.join('، ') };
        }
      }
    ]
  },
  {
    id: 'turkey',
    name: 'ترکیه',
    nameEn: 'Turkey',
    flag: '🇹🇷',
    languages: ['ترکی استانبولی'],
    minimumBudgetUSD: 4000,
    averageTimelineMonths: 2,
    currency: 'لیر ترکیه (TRY)',
    visaCenterInIran: 'سفارت ترکیه در تهران و کنسولگری‌های تبریز، مشهد و ارومیه (ورود بدون ویزا)',
    summary: 'نزدیک‌ترین و سریع‌ترین مقصد برای مهاجرت بدون نیاز به ویزای ورود اولیه، با هزینه‌های زندگی اقتصادی و بورسیه دولتی Türkiye Bursları.',
    pros: [
      'بدون نیاز به اخذ ویزای ورودی برای شهروندان ایرانی (اقامت ۹۰ روزه رایگان در هر سفر)',
      'فاصله جغرافیایی بسیار کوتاه و پروازهای روزانه متعدد از شهرهای مختلف ایران',
      'فراخوان بورسیه دولتی فول‌فاند سالانه ترکیه (Türkiye Bursları) با خوابگاه و بیمه رایگان',
      'تشابهات فرهنگی عمیق و سهولت راه‌اندازی کسب‌وکار و خرید ملک'
    ],
    cons: [
      'کاهش ارزش لیر و تورم اقتصادی در سال‌های اخیر',
      'دشواری دریافت اقامت توریستی در شهرهای بزرگ مانند استانبول در قوانین جدید',
      'حقوق پایه به لیر نسبت به کشورهای اروپای غربی پایین‌تر است'
    ],
    pathways: [
      {
        id: 'tr_work_permit',
        title: 'مجوز کار رسمی ترکیه (Çalışma İzni)',
        type: 'work',
        description: 'اقامت کاری قانونی با عقد قرارداد با کارفرمای معتبر در ترکیه و بیمه تامین اجتماعی دولتی (SGK).',
        costUSD: '1,500 - 3,000 $',
        durationMonths: '1 تا 3 ماه',
        requirements: [
          'قرارداد کاری با شرکت ثبت‌شده در ترکیه (به ازای هر کارمند خارجی، ۵ کارمند ترک)',
          'کارت اقامت معتبر یا ثبت درخواست از طریق سفارت ترکیه در ایران',
          'بیمه SGK و حداقل حقوق رسمی مصوب وزارت کار ترکیه'
        ],
        isSuitableFor: (p) => {
          let score = 40;
          const reasons: string[] = [];
          if (p.preferences.timeline === 'immediate') {
            score += 30;
            reasons.push('نیاز به مهاجرت فوق‌العاده سریع بدون معطلی ویزا');
          }
          if (p.finances.liquidBudgetUSD < 7000) {
            score += 20;
            reasons.push('تناسب با بودجه‌های شروع اقتصادی');
          }
          return { score: Math.min(score, 92), reason: reasons.join('، ') };
        }
      },
      {
        id: 'tr_study_burslari',
        title: 'تحصیل دانشگاهی و بورسیه دولتی ترکیه (Türkiye Bursları / YÖS)',
        type: 'study',
        description: 'تحصیل در دانشگاه‌های برتر استانبول و آنکارا به زبان انگلیسی یا ترکی، با بورسیه دولتی جامع یا آزمون ورودی YÖS.',
        costUSD: '2,000 - 4,500 $ (با بورسیه دولتی شهریه و خوابگاه کاملاً رایگان است)',
        durationMonths: '3 تا 6 ماه',
        requirements: [
          'مدرک دیپلم یا کارشناسی با ترجمه رسمی به زبان ترکی یا انگلیسی',
          'ثبت درخواست آنلاین در سامane Türkiye Bursları',
          'شرکت در آزمون TR-YÖS در صورت اپلای مستقیم دانشگاه‌ها'
        ],
        isSuitableFor: (p) => {
          let score = 45;
          const reasons: string[] = [];
          if (p.education.degree === 'highschool' || p.education.degree === 'bachelor') {
            score += 25;
            reasons.push('مناسب برای مقاطع کارشناسی و ارشد');
          }
          if (p.finances.needsScholarshipOrFreeTuition) {
            score += 20;
            reasons.push('هدف‌گذاری بورسیه دولتی ترکیه با خوابگاه و بیمه رایگان');
          }
          return { score: Math.min(score, 95), reason: reasons.join('، ') };
        }
      }
    ]
  }
];

// دستورالعمل‌ها و هشدارهای حیاتی مختص متقاضیان ایرانی
export const IRAN_SPECIFIC_KNOWLEDGE = {
  militaryService: {
    title: 'وضعیت خدمت سربازی و خروج از کشور (آقایان)',
    alerts: [
      {
        status: 'completed',
        tip: 'کارت پایان خدمت هوشمند نیاز به ترجمه رسمی با تایید دادگستری و وزارت خارجه دارد. حتماً اصل کارت هوشمند در دست باشد.'
      },
      {
        status: 'medical_exempt',
        tip: 'معافیت پزشکی برای مهاجرت تحصیلی و کاری مانعی ندارد؛ اما در صورتی که بیماری روانی حاد یا معافیت بند اعصاب و روان قید شده باشد، در معاینات مدیکال برخی کشورها (نظیر کانادا یا استرالیا) نیاز به نامه پزشک معتمد دال بر سلامت فعلی دارد.'
      },
      {
        status: 'educational_exempt',
        tip: 'مشمولان با معافیت تحصیلی می‌توانند با وثیقه نقدی (حدود ۴۰ تا ۵۰ میلیون تومان در سامانه سخا sakha.epolice.ir) برای سفرهای کوتاه‌مدت یا مصاحبه سفارت در کشورهای همسایه (ترکیه، ارمنستان، دبی) مجوز خروج بگیرند. برای خروج قطعی تحصیلی، باید پذیرش در سامانه سجاد ثبت و وثیقه بلندمدت تودیع شود.'
      },
      {
        status: 'conscript',
        tip: 'بدون کارت یا معافیت تحصیلی، امکان خروج قانونی از مرزهای کشور وجود ندارد. اگر مشمول غایب هستید، مسیر قانونی اول ثبت نام در یک مقطع تحصیلی بالاتر یا استفاده از تسهیلات ویژه مشمولان غایب در صورت ابلاغ است.'
      }
    ]
  },
  degreeRelease: {
    title: 'آزادسازی دانشنامه و ریزنمرات (سامانه سجاد و لغو تعهد خدمت رایگان)',
    steps: [
      'برای فارغ‌التحصیلان دانشگاه‌های روزانه سراسری: دانشنامه به دلیل آموزش رایگان در رهن دولت است. لغو تعهد یا با پرداخت هزینه به دانشگاه یا با سابقه کار دارای بیمه پس از فارغ‌التحصیلی یا با نامه عدم کاریابی اداره کار (۶ ماه بعد از فراغت/پایان خدمت) انجام می‌شود.',
      'ثبت نام در سامانه سجاد (portal.saorg.ir) جهت دریافت کد تاییدیه ۲۰ رقمی صحت مدارک برای درج مهرهای دادگستری و وزارت امور خارجه ضروری است.',
      'برای فارغ‌التحصیلان دانشگاه آزاد: دریافت تاییدیه دانشنامه از سازمان مرکزی دانشگاه آزاد در بلوار سازمان آب تهران یا استعلام آنلاین از طریق سامانه استعلام مدارک دانشگاه آزاد.',
      'برای رشته‌های پزشکی و پیراپزشکی: دریافت تاییدیه و دانشنامه از وزارت بهداشت، درمان و آموزش پزشکی (سامانه خدمات آموزشی وزارت بهداشت).'
    ]
  },
  financialProof: {
    title: 'اثبات تمکن مالی (Bank Statement) در شبکه بانکی ایران',
    tips: [
      'گواهی تمکن مالی باید از بانک‌های رسمی ایران (ملی، ملت، پاسارگاد، پارسیان، سامان و...) به زبان انگلیسی با درج نرخ ارز رسمی (ارز دولتی/نیمایی یا بازار آزاد) و مهر امور بین‌الملل بانک صادر شود.',
      'سفارت‌ها به گردش حساب (Turnover) ۳ تا ۶ ماهه به همراه مانده نهایی توجه دارند. از واریز ناگهانی پول سنگین (Dump Money) درست چند روز قبل از نامه تمکن خودداری کنید؛ واریزی‌های عمده باید دارای توجیه مثل فروش ملک، خودرو یا سپرده بلندمدت باشد.',
      'برای آلمان: پس از دریافت پذیرش، مبلغ تمکن (حدود ۱۲ هزار یورو) باید در یکی از حساب‌های مسدود مجاز آلمان (مثل Expatrio یا Coracle یا Fintiba) سپرده‌گذاری شود که انتقال آن از ایران از طریق صرافی‌های معتبر عضو سیستم سنا انجام می‌پذیرد.'
    ]
  },
  embassyAppointments: {
    title: 'چالش وقت سفارت و کارگزاری‌های ویزا در تهران',
    tips: [
      'ویزای آلمان: کارگزاری ویزامتریک (Visametric) در خیابان بهشتی تهران. برای کارت شانس یا تایید مدارک، نوبت‌ها دوره‌ای باز می‌شوند.',
      'ویزای ایتالیا: کارگزاری ویزامتریک در تهران برای ویزای تحصیلی سهمیه‌بندی دانشگاهی دارد و نوبت‌گیری باید با تقویم پذیرش دانشگاه همگام شود.',
      'ویزای فرانسه، هلند، فنلاند، اتریش، دانمارک: از طریق کارگزاری VFS Global در مرکز خرید هروی سنتر یا پالادیوم تهران.',
      'ویزای اسپانیا: کارگزاری BLS در تهران.',
      'ویزای آمریکا و کانادا: سفارت در ایران فعال نیست. بیومتریک و مصاحبه در آنکارا یا استانبول (ترکیه)، ایروان (ارمنستان) یا دبی انجام می‌گیرد.'
    ]
  }
};
