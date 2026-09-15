export interface ImmigrationNewsItem {
  id: string;
  title: string;
  country: string;
  countryFlag: string;
  category: 'embassy_appointment' | 'rule_change' | 'financial' | 'iran_regulation';
  categoryLabel: string;
  summary: string;
  impactLevel: 'high' | 'medium' | 'info';
  date: string;
  source: string;
  verified: boolean;
  highlight?: string;
}

export const IMMIGRATION_NEWS_DATABASE: ImmigrationNewsItem[] = [
  {
    id: 'visametric-de-2026',
    title: 'آخرین وضعیت نوبت‌دهی کارگزاری ویزامتریک تهران برای کارت شانس آلمان',
    country: 'آلمان',
    countryFlag: '🇩🇪',
    category: 'embassy_appointment',
    categoryLabel: 'وقت سفارت',
    summary: 'کارگزاری ویزامتریک در خیابان بهشتی تهران تقویم نوبت‌گیری متقاضیان Chancenkarte را به صورت هفتگی باز می‌کند. الزام ارائه گواهی ارزیابی اولیه مدارک ZAB یا پرینت آنابین H+ در روز تحویل مدارک همچنان پابرجاست.',
    impactLevel: 'high',
    date: 'امروز',
    source: 'کارگزاری ویزامتریک تهران / سفارت آلمان',
    verified: true,
    highlight: 'نوبت‌ها معمولاً روزهای دوشنبه و چهارشنبه در سایت باز می‌شوند.'
  },
  {
    id: 'sajjad-costs-update',
    title: 'به‌روزرسانی تعرفه‌های آزادسازی دانشنامه و کد صحت در سامانه سجاد',
    country: 'ایران',
    countryFlag: '🇮🇷',
    category: 'iran_regulation',
    categoryLabel: 'قوانین داخلی ایران',
    summary: 'سازمان امور دانشجویان وزارت علوم نحوه محاسبه هزینه لغو تعهد آموزش رایگان برای دانشگاه‌های دولتی روزانه را بر مبنای جدول سال فارغ‌التحصیلی ابلاغ نمود. امکان تسویه از طریق گواهی عدم کاریابی ۶ ماهه اداره کار همچنان معتبر است.',
    impactLevel: 'high',
    date: '۲ روز پیش',
    source: 'سازمان امور دانشجویان (portal.saorg.ir)',
    verified: true,
    highlight: 'دریافت کد صحت ۲۰ رقمی برای تایید دادگستری و خارجه الزامی است.'
  },
  {
    id: 'italy-dsu-2026',
    title: 'اعلام تقویم ثبت‌نام بورسیه‌های استانی ایتالیا (DSU / DiSCo / ER.GO)',
    country: 'ایتالیا',
    countryFlag: '🇮🇷',
    category: 'financial',
    categoryLabel: 'بورسیه و تمکن',
    summary: 'سازمان‌های بورسیه استان‌های لاتزیو و لومباردی فراخوان سال جدید را منتشر کردند. خانواده‌های ایرانی با درآمد زیر ۲۵ هزار یورو در سال (بر مبنای عدد ایزه ISEE Parificato) واجد شرایط دریافت کمک‌هزینه تا ۸,۰۰۰ یورو بعلاوه اسکان و معافیت شهریه هستند.',
    impactLevel: 'medium',
    date: '۳ روز پیش',
    source: 'اداره بورسیه دانشگاه‌های ایتالیا (MUR)',
    verified: true,
    highlight: 'مدارک مالی سرپرست خانواده باید به تایید سفارت ایتالیا در تهران برسد.'
  },
  {
    id: 'canada-express-entry-draws',
    title: 'تغییر تمرکز دراوهای اکسپرس اینتری کانادا روی زبان فرانسوی و مشاغل سلامت و IT',
    country: 'کانادا',
    countryFlag: '🇨🇦',
    category: 'rule_change',
    categoryLabel: 'تغییر قوانین',
    summary: 'اداره مهاجرت کانادا (IRCC) اعلام کرد دراوهای شاخه کتگوری-بیس (Category-Based Selection) با اولویت متقاضیان دارای تسلط به زبان فرانسه (نمره NCLC 7) و متخصصان حوزه سلامت و مهندسی کامپیوتر با امتیازات پایین‌تر برگزار می‌شود.',
    impactLevel: 'high',
    date: 'هفته جاری',
    source: 'اداره مهاجرت کانادا (IRCC Official)',
    verified: true,
    highlight: 'داشتن مدرک زبان فرانسه امتیاز شما را در دراوهای اختصاصی تا ۵۰ امتیاز ارتقا می‌دهد.'
  },
  {
    id: 'austria-red-white-red',
    title: 'تسهیل شرایط کارت قرمز-سفید-قرمز اتریش برای نیروهای متخصص IT و فنی',
    country: 'اتریش',
    countryFlag: '🇦🇹',
    category: 'rule_change',
    categoryLabel: 'تغییر قوانین',
    summary: 'دولت اتریش حداقل دستمزد مورد نیاز برای کارت Rot-Weiß-Rot در رشته‌های مهندسی و علوم کامپیوتر را منعطف‌تر کرده و حداقل امتیاز در جدول نیروهای دارای مهارت‌های کلیدی (Key Workers) را تعدیل نمود.',
    impactLevel: 'medium',
    date: '۵ روز پیش',
    source: 'سفارت اتریش در تهران / وزارت کار اتریش',
    verified: true,
    highlight: 'متقاضیان با سن زیر ۳۵ سال و مدرک زبان آلمانی یا انگلیسی امتیاز مازاد می‌گیرند.'
  },
  {
    id: 'military-sakha-exit',
    title: 'ضوابط جدید وثیقه خروج از کشور دانشجویان مشمول در سامانه سخا',
    country: 'ایران',
    countryFlag: '🇮🇷',
    category: 'iran_regulation',
    categoryLabel: 'قوانین داخلی ایران',
    summary: 'سازمان وظیفه عمومی فراجا فرآیند استعلام و تودیع وثیقه نقدی برای سفرهای علمی، مصاحبه سفارت و آزمون‌های بین‌المللی در کشورهای همسایه (ترکیه، ارمنستان، امارات) را به طور کامل الکترونیکی از طریق درگاه خدمات الکترونیک انتظامی (sakha.epolice.ir) برقرار کرد.',
    impactLevel: 'high',
    date: 'هفته گذشته',
    source: 'سازمان وظیفه عمومی فراجا',
    verified: true,
    highlight: 'وثیقه سفرهای زیارتی و علمی تفکیک شده و نیازی به مراجعه حضوری به پلیس نیست.'
  }
];
