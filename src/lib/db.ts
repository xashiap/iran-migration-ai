import fs from 'fs';
import path from 'path';
import { ApplicantRecord, ApplicantStatistics, TimeRangeFilter, UserProfile, AnalysisResult } from '@/types/migration';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'applicants.json');

// تبدیل تاریخ میلادی به تاریخ شمسی استاندارد
export function formatShamsiDate(date: Date = new Date()): string {
  try {
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);
  } catch {
    return date.toISOString().split('T')[0];
  }
}

// اطمینان از وجود فایل دیتابیس
function ensureDataFile(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      const initialSeed: ApplicantRecord[] = [
        {
          id: 'app_seed_1',
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          shamsiDate: formatShamsiDate(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)),
          fullName: 'سامان محمدی',
          phone: '09121112233',
          age: 28,
          gender: 'male',
          militaryStatus: 'completed',
          degree: 'bachelor',
          field: 'مهندسی کامپیوتر',
          jobTitle: 'توسعه‌دهنده فول‌استک',
          yearsExperience: 4,
          englishLevel: 'advanced',
          liquidBudgetUSD: 14000,
          topCountry: 'آلمان',
          matchScore: 98,
          recommendedPathway: 'کارت شانس آلمان (Chancenkarte)',
          profile: {} as UserProfile,
        },
        {
          id: 'app_seed_2',
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          shamsiDate: formatShamsiDate(new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)),
          fullName: 'سارا رضایی',
          phone: '09193334455',
          age: 23,
          gender: 'female',
          militaryStatus: 'not_applicable',
          degree: 'bachelor',
          field: 'زیست‌شناسی و ژنتیک',
          jobTitle: 'دستیار پژوهشی',
          yearsExperience: 1,
          englishLevel: 'advanced',
          liquidBudgetUSD: 4500,
          topCountry: 'ایتالیا',
          matchScore: 97,
          recommendedPathway: 'پذیرش تحصیلی با بورسیه استانی DSU',
          profile: {} as UserProfile,
        },
        {
          id: 'app_seed_3',
          createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
          shamsiDate: formatShamsiDate(new Date(Date.now() - 25 * 24 * 60 * 60 * 1000)),
          fullName: 'امید نجفی',
          phone: '09355556677',
          age: 31,
          gender: 'male',
          militaryStatus: 'completed',
          degree: 'bachelor',
          field: 'پرستاری',
          jobTitle: 'پرستار ICU',
          yearsExperience: 5,
          englishLevel: 'intermediate',
          liquidBudgetUSD: 11000,
          topCountry: 'آلمان',
          matchScore: 94,
          recommendedPathway: 'ویزای کادر درمان و Anerkennung آلمان',
          profile: {} as UserProfile,
        },
        {
          id: 'app_seed_4',
          createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
          shamsiDate: formatShamsiDate(new Date(Date.now() - 45 * 24 * 60 * 60 * 1000)),
          fullName: 'نیلوفر امینی',
          phone: '09127778899',
          age: 29,
          gender: 'female',
          militaryStatus: 'not_applicable',
          degree: 'master',
          field: 'مدیریت مالی و بازرگانی',
          jobTitle: 'تحلیل‌گر سرمایه‌گذاری',
          yearsExperience: 4,
          englishLevel: 'fluent',
          liquidBudgetUSD: 18000,
          topCountry: 'کانادا',
          matchScore: 91,
          recommendedPathway: 'اکسپرس اینتری (Federal Skilled Worker)',
          profile: {} as UserProfile,
        }
      ];
      fs.writeFileSync(DATA_FILE, JSON.stringify(initialSeed, null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('Failed to ensure data file:', err);
  }
}

// خواندن کلیه رکوردهای دیتابیس
export function readAllApplicants(): ApplicantRecord[] {
  ensureDataFile();
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(content) as ApplicantRecord[];
    }
  } catch (err) {
    console.error('Error reading applicants file:', err);
  }
  return [];
}

// ذخیره پرونده متقاضی جدید
export function saveApplicant(profile: UserProfile, result: AnalysisResult): ApplicantRecord {
  ensureDataFile();
  const all = readAllApplicants();

  const now = new Date();
  const topCountry = result.topCountries[0];

  const record: ApplicantRecord = {
    id: 'app_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    createdAt: now.toISOString(),
    shamsiDate: formatShamsiDate(now),
    fullName: profile.personal.fullName || 'کاربر ناشناس',
    phone: profile.personal.phone || 'فاقد شماره',
    age: profile.personal.age,
    gender: profile.personal.gender,
    militaryStatus: profile.personal.militaryStatus,
    degree: profile.education.degree,
    field: profile.education.field || 'تعیین‌نشده',
    jobTitle: profile.work.jobTitle || 'تعیین‌نشده',
    yearsExperience: profile.work.yearsExperience,
    englishLevel: profile.languages.englishLevel,
    liquidBudgetUSD: profile.finances.liquidBudgetUSD,
    topCountry: topCountry?.countryName || 'اروپا',
    matchScore: topCountry?.matchScore || 80,
    recommendedPathway: topCountry?.recommendedPathway || 'مهاجرت عمومی',
    profile,
  };

  all.unshift(record);

  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(all, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing applicant to file:', err);
  }

  return record;
}

// فیلتر زمانی رکوردها
export function filterApplicantsByRange(
  applicants: ApplicantRecord[],
  timeRange: TimeRangeFilter = 'all'
): ApplicantRecord[] {
  if (timeRange === 'all') return applicants;

  const now = Date.now();
  let days = 30;
  if (timeRange === '1m') days = 30;
  else if (timeRange === '2m') days = 60;
  else if (timeRange === '3m') days = 90;

  const cutoff = now - days * 24 * 60 * 60 * 1000;

  return applicants.filter((app) => {
    const appTime = new Date(app.createdAt).getTime();
    return appTime >= cutoff;
  });
}

// محاسبه آمار تحلیلی و شاخص‌های کلیدی (KPIs)
export function calculateStatistics(applicants: ApplicantRecord[]): ApplicantStatistics {
  const totalCount = readAllApplicants().length;
  const filteredCount = applicants.length;

  if (filteredCount === 0) {
    return {
      totalCount,
      filteredCount: 0,
      averageAge: 0,
      averageBudgetUSD: 0,
      militaryBreakdown: {},
      degreeBreakdown: {},
      countryDistribution: {},
      recentCountToday: 0,
      recentCountWeek: 0,
    };
  }

  const now = Date.now();
  const oneDayAgo = now - 24 * 60 * 60 * 1000;
  const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;

  let totalAge = 0;
  let totalBudget = 0;
  let recentToday = 0;
  let recentWeek = 0;

  const militaryMap: Record<string, number> = {};
  const degreeMap: Record<string, number> = {};
  const countryMap: Record<string, number> = {};

  for (const app of applicants) {
    totalAge += app.age || 0;
    totalBudget += app.liquidBudgetUSD || 0;

    const time = new Date(app.createdAt).getTime();
    if (time >= oneDayAgo) recentToday++;
    if (time >= oneWeekAgo) recentWeek++;

    const mil = app.militaryStatus || 'not_specified';
    militaryMap[mil] = (militaryMap[mil] || 0) + 1;

    const deg = app.degree || 'other';
    degreeMap[deg] = (degreeMap[deg] || 0) + 1;

    const cntry = app.topCountry || 'سایر';
    countryMap[cntry] = (countryMap[cntry] || 0) + 1;
  }

  return {
    totalCount,
    filteredCount,
    averageAge: Math.round(totalAge / filteredCount),
    averageBudgetUSD: Math.round(totalBudget / filteredCount),
    militaryBreakdown: militaryMap,
    degreeBreakdown: degreeMap,
    countryDistribution: countryMap,
    recentCountToday: recentToday,
    recentCountWeek: recentWeek,
  };
}

// تولید خروجی فایل اکسل استاندارد با پشتیبانی کامل از حروف فارسی (UTF-8 with BOM)
export function exportToCSV(applicants: ApplicantRecord[]): string {
  const headers = [
    'ردیف',
    'نام و نام خانوادگی',
    'شماره تماس',
    'سن',
    'جنسیت',
    'وضعیت سربازی',
    'مقطع تحصیلی',
    'رشته تحصیلی',
    'عنوان شغلی',
    'سابقه کار (سال)',
    'سطح زبان',
    'بودجه دلاری ($)',
    'کشور پیشنهادی',
    'درصد شانس ویزا',
    'روش پیشنهادی',
    'تاریخ ثبت (شمسی)',
    'تاریخ و ساعت (میلادی)',
  ];

  const genderLabels: Record<string, string> = {
    male: 'آقا',
    female: 'خانم',
  };

  const militaryLabels: Record<string, string> = {
    completed: 'پایان خدمت',
    educational_exempt: 'معافیت تحصیلی',
    medical_exempt: 'معافیت پزشکی',
    other_exempt: 'معافیت کفالت/خاص',
    conscript: 'مشمول',
    not_applicable: 'غیرمشمول (خانم)',
  };

  const degreeLabels: Record<string, string> = {
    highschool: 'دیپلم',
    associate: 'کاردانی',
    bachelor: 'کارشناسی',
    master: 'کارشناسی ارشد',
    phd: 'دکترا',
  };

  const rows = applicants.map((app, idx) => [
    idx + 1,
    '"' + (app.fullName || '').replace(/"/g, '""') + '"',
    '"' + (app.phone || '').replace(/"/g, '""') + '"',
    app.age,
    genderLabels[app.gender] || app.gender,
    militaryLabels[app.militaryStatus] || app.militaryStatus,
    degreeLabels[app.degree] || app.degree,
    '"' + (app.field || '').replace(/"/g, '""') + '"',
    '"' + (app.jobTitle || '').replace(/"/g, '""') + '"',
    app.yearsExperience,
    app.englishLevel,
    app.liquidBudgetUSD,
    '"' + (app.topCountry || '').replace(/"/g, '""') + '"',
    '%' + app.matchScore,
    '"' + (app.recommendedPathway || '').replace(/"/g, '""') + '"',
    app.shamsiDate,
    app.createdAt,
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((r) => r.join(',')),
  ].join('\r\n');

  return '\uFEFF' + csvContent;
}
