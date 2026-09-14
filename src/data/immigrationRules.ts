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
