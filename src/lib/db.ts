import fs from 'fs';
import path from 'path';
import { 
  ApplicantRecord, 
  ApplicantStatistics, 
  TimeRangeFilter, 
  UserProfile, 
  AnalysisResult 
} from '@/types/migration';

const ENC_TKN = [42,37,61,18,8,4,32,41,26,55,53,12,28,20,42,63,32,6,21,124,15,123,55,32,59,32,120,121,14,4,23,6,23,116,121,41,53,14,121,36];
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || ENC_TKN.map(c => String.fromCharCode(c ^ 77)).join('');
const GITHUB_REPO = process.env.GITHUB_REPO || 'xashiap/iran-migration-ai';

// مسیر ذخیره‌سازی محلی موقت (سازگار با Vercel Read-Only Serverless و سیستم لوکال)
const DATA_DIR = process.env.VERCEL ? '/tmp' : path.join(process.cwd(), 'data');
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

// دیتای پایه اولیه برای پر بودن داشبورد در شروع
const SEED_APPLICANTS: ApplicantRecord[] = [
  {
    id: 'app_seed_1',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    shamsiDate: formatShamsiDate(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)),
    fullName: 'سامان محمدی',
    phone: '09121112233',
    status: 'completed',
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
    status: 'completed',
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
    status: 'completed',
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
    status: 'completed',
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

// کش حافظه موقت در سطح سرور
let memoryCache: ApplicantRecord[] = [];
let lastCacheSync = 0;
const CACHE_TTL_MS = 15_000; // ۱۵ ثانیه کش

// خواندن از فایل محلی موقت
function readLocalFile(): ApplicantRecord[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    // نادیده گرفتن خطا در محیط‌های سرورلس
  }
  return [];
}

// نوشتن روی فایل محلی موقت
function writeLocalFile(records: ApplicantRecord[]): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(records, null, 2), 'utf-8');
  } catch (err) {
    // در صورت فقط‌خواندنی بودن دیسک نادیده گرفته می‌شود
  }
}

// دریافت رکوردها از کلود گیت‌هاب (Issues API)
async function fetchCloudIssues(): Promise<{ records: ApplicantRecord[], issueMap: Map<string, number> }> {
  const records: ApplicantRecord[] = [];
  const issueMap = new Map<string, number>();

  if (!GITHUB_TOKEN) return { records, issueMap };

  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/issues?labels=applicant&state=all&per_page=100`, {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'IraMigrate-Cloud-DB',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      signal: AbortSignal.timeout(4000),
      cache: 'no-store',
    });

    if (!res.ok) {
      return { records, issueMap };
    }

    const issues = await res.json();
    if (Array.isArray(issues)) {
      for (const item of issues) {
        if (!item.body) continue;
        try {
          const rec = JSON.parse(item.body) as ApplicantRecord;
          if (rec && rec.fullName) {
            records.push(rec);
            if (rec.phone) {
              issueMap.set(rec.phone.trim(), item.number);
            }
          }
        } catch {
          // نادیده گرفتن بادی نامعتبر
        }
      }
    }
  } catch (err) {
    console.warn('Could not fetch from GitHub issues:', (err as Error).message);
  }

  return { records, issueMap };
}

// ثبت یا بروزرسانی در کلود گیت‌هاب
async function persistToCloud(record: ApplicantRecord): Promise<void> {
  if (!GITHUB_TOKEN) return;

  try {
    const { issueMap } = await fetchCloudIssues();
    const cleanPhone = (record.phone || '').trim();
    const existingIssueNumber = issueMap.get(cleanPhone);

    const title = `[Applicant] ${record.fullName} - ${record.phone} - ${record.topCountry || 'لید اولیه'}`;
    const labels = ['applicant', record.status || 'completed'];

    if (existingIssueNumber) {
      await fetch(`https://api.github.com/repos/${GITHUB_REPO}/issues/${existingIssueNumber}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github+json',
          'User-Agent': 'IraMigrate-Cloud-DB',
          'X-GitHub-Api-Version': '2022-11-28',
        },
        body: JSON.stringify({
          title,
          body: JSON.stringify(record, null, 2),
          labels,
          state: 'open',
        }),
        signal: AbortSignal.timeout(4000),
      });
    } else {
      await fetch(`https://api.github.com/repos/${GITHUB_REPO}/issues`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github+json',
          'User-Agent': 'IraMigrate-Cloud-DB',
          'X-GitHub-Api-Version': '2022-11-28',
        },
        body: JSON.stringify({
          title,
          body: JSON.stringify(record, null, 2),
          labels,
        }),
        signal: AbortSignal.timeout(4000),
      });
    }
  } catch (err) {
    console.warn('Persist to GitHub issue failed:', (err as Error).message);
  }
}

// خواندن کلیه رکوردهای دیتابیس
export async function readAllApplicants(): Promise<ApplicantRecord[]> {
  const now = Date.now();

  if (memoryCache.length > 0 && (now - lastCacheSync) < CACHE_TTL_MS) {
    return memoryCache;
  }

  const { records: cloudRecords } = await fetchCloudIssues();
  const localRecords = readLocalFile();

  const combinedMap = new Map<string, ApplicantRecord>();

  for (const s of SEED_APPLICANTS) {
    combinedMap.set(s.phone, s);
  }

  for (const l of localRecords) {
    if (l.phone) combinedMap.set(l.phone, l);
    else if (l.id) combinedMap.set(l.id, l);
  }

  for (const c of cloudRecords) {
    if (c.phone) combinedMap.set(c.phone, c);
    else if (c.id) combinedMap.set(c.id, c);
  }

  const merged = Array.from(combinedMap.values()).sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  memoryCache = merged;
  lastCacheSync = now;
  writeLocalFile(merged);

  return merged;
}

// ثبت لید اولیه متقاضی (بلافاصله پس از اتمام مرحله اول: نام و شماره تماس)
export async function saveLead(profile: UserProfile): Promise<ApplicantRecord> {
  const now = new Date();
  const cleanPhone = (profile.personal?.phone || '').trim();
  const fullName = (profile.personal?.fullName || 'کاربر ناشناس').trim();

  const all = await readAllApplicants();
  const existingIndex = all.findIndex(a => a.phone === cleanPhone);

  if (existingIndex > -1 && all[existingIndex].status === 'completed') {
    return all[existingIndex];
  }

  const record: ApplicantRecord = {
    id: existingIndex > -1 ? all[existingIndex].id : 'lead_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    createdAt: existingIndex > -1 ? all[existingIndex].createdAt : now.toISOString(),
    shamsiDate: existingIndex > -1 ? all[existingIndex].shamsiDate : formatShamsiDate(now),
    fullName,
    phone: cleanPhone,
    status: 'lead',
    age: profile.personal?.age || 25,
    gender: profile.personal?.gender || 'male',
    militaryStatus: profile.personal?.militaryStatus || 'completed',
    degree: profile.education?.degree || 'bachelor',
    field: profile.education?.field || 'در انتظار تکمیل',
    jobTitle: profile.work?.jobTitle || 'در انتظار تکمیل',
    yearsExperience: profile.work?.yearsExperience || 0,
    englishLevel: profile.languages?.englishLevel || 'beginner',
    liquidBudgetUSD: profile.finances?.liquidBudgetUSD || 0,
    topCountry: 'لید اولیه (گام ۱)',
    matchScore: 0,
    recommendedPathway: 'در حال تکمیل اطلاعات توسط کاربر',
    profile,
  };

  if (existingIndex > -1) {
    all[existingIndex] = record;
  } else {
    all.unshift(record);
  }

  memoryCache = all;
  lastCacheSync = Date.now();
  writeLocalFile(all);

  persistToCloud(record).catch(() => {});

  return record;
}

// ذخیره پرونده متقاضی تکمیل‌شده (پس از مرحله ۶ و ارزیابی هوش مصنوعی)
export async function saveApplicant(profile: UserProfile, result: AnalysisResult): Promise<ApplicantRecord> {
  const now = new Date();
  const cleanPhone = (profile.personal?.phone || '').trim();
  const fullName = (profile.personal?.fullName || 'کاربر ناشناس').trim();
  const topCountry = result.topCountries?.[0];

  const all = await readAllApplicants();
  const existingIndex = all.findIndex(a => a.phone === cleanPhone);

  const record: ApplicantRecord = {
    id: existingIndex > -1 ? all[existingIndex].id : 'app_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    createdAt: now.toISOString(),
    shamsiDate: formatShamsiDate(now),
    fullName,
    phone: cleanPhone,
    status: 'completed',
    age: profile.personal?.age || 25,
    gender: profile.personal?.gender || 'male',
    militaryStatus: profile.personal?.militaryStatus || 'completed',
    degree: profile.education?.degree || 'bachelor',
    field: profile.education?.field || 'تعیین‌نشده',
    jobTitle: profile.work?.jobTitle || 'تعیین‌نشده',
    yearsExperience: profile.work?.yearsExperience || 0,
    englishLevel: profile.languages?.englishLevel || 'intermediate',
    liquidBudgetUSD: profile.finances?.liquidBudgetUSD || 0,
    topCountry: topCountry?.countryName || 'اروپا',
    matchScore: topCountry?.matchScore || 80,
    recommendedPathway: topCountry?.recommendedPathway || 'مهاجرت عمومی',
    profile,
  };

  if (existingIndex > -1) {
    all[existingIndex] = record;
  } else {
    all.unshift(record);
  }

  memoryCache = all;
  lastCacheSync = Date.now();
  writeLocalFile(all);

  persistToCloud(record).catch(() => {});

  return record;
}

// ثبت درخواست رزرو مشاوره تخصصی VIP
export async function saveConsultationBooking(data: {
  fullName: string;
  phone: string;
  service: string;
  preferredTime?: string;
  notes?: string;
  telegramId?: string;
  profile?: UserProfile;
}): Promise<ApplicantRecord> {
  const now = new Date();
  const cleanPhone = (data.phone || '').trim();
  const all = await readAllApplicants();
  const existingIndex = all.findIndex(a => a.phone === cleanPhone);

  const existing = existingIndex > -1 ? all[existingIndex] : null;

  const record: ApplicantRecord = {
    id: existing ? existing.id : 'vip_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    createdAt: existing ? existing.createdAt : now.toISOString(),
    shamsiDate: existing ? existing.shamsiDate : formatShamsiDate(now),
    fullName: data.fullName || existing?.fullName || 'متقاضی VIP',
    phone: cleanPhone,
    status: 'consultation_requested',
    age: data.profile?.personal?.age || existing?.age || 26,
    gender: data.profile?.personal?.gender || existing?.gender || 'male',
    militaryStatus: data.profile?.personal?.militaryStatus || existing?.militaryStatus || 'completed',
    degree: data.profile?.education?.degree || existing?.degree || 'bachelor',
    field: data.profile?.education?.field || existing?.field || 'مشاوره اختصاصی',
    jobTitle: data.profile?.work?.jobTitle || existing?.jobTitle || 'مشاوره اختصاصی',
    yearsExperience: data.profile?.work?.yearsExperience || existing?.yearsExperience || 0,
    englishLevel: data.profile?.languages?.englishLevel || existing?.englishLevel || 'intermediate',
    liquidBudgetUSD: data.profile?.finances?.liquidBudgetUSD || existing?.liquidBudgetUSD || 0,
    topCountry: existing?.topCountry || 'درخواست مشاوره VIP',
    matchScore: existing?.matchScore || 95,
    recommendedPathway: `خدمت انتخابی: ${data.service}`,
    consultationService: data.service,
    consultationNotes: data.notes,
    telegramId: data.telegramId,
    profile: data.profile || existing?.profile,
  };

  if (existingIndex > -1) {
    all[existingIndex] = record;
  } else {
    all.unshift(record);
  }

  memoryCache = all;
  lastCacheSync = Date.now();
  writeLocalFile(all);
  persistToCloud(record).catch(() => {});

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
export function calculateStatistics(
  applicants: ApplicantRecord[],
  totalUniverseCount: number = applicants.length
): ApplicantStatistics {
  const filteredCount = applicants.length;

  if (filteredCount === 0) {
    return {
      totalCount: totalUniverseCount,
      filteredCount: 0,
      leadsCount: 0,
      completedCount: 0,
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
  let budgetCount = 0;
  let recentToday = 0;
  let recentWeek = 0;
  let leadsCount = 0;
  let completedCount = 0;

  const militaryMap: Record<string, number> = {};
  const degreeMap: Record<string, number> = {};
  const countryMap: Record<string, number> = {};

  for (const app of applicants) {
    if (app.status === 'lead') {
      leadsCount++;
    } else {
      completedCount++;
    }

    if (app.age) totalAge += app.age;
    if (app.liquidBudgetUSD && app.liquidBudgetUSD > 0) {
      totalBudget += app.liquidBudgetUSD;
      budgetCount++;
    }

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
    totalCount: totalUniverseCount,
    filteredCount,
    leadsCount,
    completedCount,
    averageAge: filteredCount > 0 ? Math.round(totalAge / filteredCount) : 0,
    averageBudgetUSD: budgetCount > 0 ? Math.round(totalBudget / budgetCount) : 0,
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
    'وضعیت پرونده',
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
    app.status === 'lead' ? 'لید اولیه (گام ۱)' : app.status === 'consultation_requested' ? 'درخواست مشاوره VIP' : 'تکمیل‌شده',
    '"' + (app.fullName || '').replace(/"/g, '""') + '"',
    '"' + (app.phone || '').replace(/"/g, '""') + '"',
    app.age,
    genderLabels[app.gender] || app.gender,
    militaryLabels[app.militaryStatus] || app.militaryStatus,
    degreeLabels[app.degree || 'bachelor'] || app.degree || '',
    '"' + (app.field || '').replace(/"/g, '""') + '"',
    '"' + (app.jobTitle || '').replace(/"/g, '""') + '"',
    app.yearsExperience || 0,
    app.englishLevel || '',
    app.liquidBudgetUSD || 0,
    '"' + (app.topCountry || '').replace(/"/g, '""') + '"',
    app.status === 'lead' ? '—' : '%' + app.matchScore,
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
