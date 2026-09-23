export type MaritalStatus = 'single' | 'married' | 'married_with_children';
export type Gender = 'male' | 'female';
export type MilitaryStatus = 
  | 'completed'           // کارت پایان خدمت
  | 'medical_exempt'     // معافیت پزشکی
  | 'other_exempt'       // معافیت کفالت / موارد خاص
  | 'educational_exempt' // معافیت تحصیلی (دانشجویی)
  | 'conscript'          // مشمول خدمت / بدون معافیت
  | 'not_applicable';    // خانم‌ها / غیر مشمول

export type DegreeLevel = 
  | 'highschool'   // دیپلم
  | 'associate'    // کاردانی / فوق دیپلم
  | 'bachelor'     // کارشناسی (لیسانس)
  | 'master'       // کارشناسی ارشد (فوق لیسانس)
  | 'phd';         // دکترا یا تخصص

export type MajorCategory = 
  | 'computer_it'      // کامپیوتر، نرم‌افزار، هوش مصنوعی، شبکه
  | 'engineering'      // مهندسی برق، مکانیک، عمران، صنایع و...
  | 'medical_health'   // پزشکی، دندان‌پزشکی، داروسازی، پرستاری، مامایی
  | 'basic_sciences'   // ریاضی، فیزیک، شیمی، زیست‌شناسی
  | 'business_finance' // مدیریت، اقتصاد، حسابداری، بازاریابی
  | 'humanities_art'   // علوم انسانی، حقوق، معماری، گرافیک، زبان‌ها
  | 'vocational'       // فنی و حرفه‌ای، تکنسین، جوشکاری، آشپزی
  | 'other';

export type UniversityType = 
  | 'state_top'       // دانشگاه سراسری ممتاز (تهران، شریف، امیرکبیر و...)
  | 'state_regular'   // سایر دانشگاه‌های دولتی شهرستان‌ها
  | 'azad'            // دانشگاه آزاد اسلامی
  | 'payame_noor'     // دانشگاه پیام نور
  | 'non_profit'      // غیرانتفاعی
  | 'applied_science' // علمی-کاربردی
  | 'foreign';        // دانشگاه خارج از کشور

export type LanguageLevel = 'none' | 'a1_a2' | 'b1' | 'b2' | 'c1_c2';
export type EnglishGeneralLevel = 'none' | 'basic' | 'intermediate' | 'advanced' | 'fluent';
export type EnglishExamType = 'none' | 'ielts' | 'toefl' | 'duolingo' | 'pte';

export type PrimaryGoal = 
  | 'quick_pr'          // اقامت دائم در سریع‌ترین زمان
  | 'job_immediate'     // کار و درآمدزایی فوری
  | 'study_low_cost'    // تحصیل با حداقل هزینه یا بورسیه
  | 'family_relocation' // مهاجرت امن همراه خانواده و فرزندان
  | 'lifestyle_freedom' // کیفیت زندگی و آزادی‌های فردی
  | 'citizenship';      // اخذ پاسپورت قدرتمند

export type RiskTolerance = 'low' | 'moderate' | 'high';
export type TimelinePreference = 'immediate' | 'under_1_year' | '1_to_2_years' | 'flexible';

export interface UserProfile {
  // فاز ۱: اطلاعات فردی
  personal: {
    fullName: string;
    phone: string;
    age: number;
    gender: Gender;
    maritalStatus: MaritalStatus;
    childrenCount: number;
    militaryStatus: MilitaryStatus;
    hasPassport: boolean;
    passportValidityMonths: number;
  };
  
  // فاز ۲: تحصیلات
  education: {
    degree: DegreeLevel;
    field: string;
    majorCategory: MajorCategory;
    universityType: UniversityType;
    universityName: string;
    gpa: number; // از ۲۰
    isDegreeReleased: boolean; // آزادسازی مدرک و سجاد
  };
  
  // فاز ۳: سابقه شغلی
  work: {
    jobTitle: string;
    yearsExperience: number;
    hasOfficialInsurance: boolean; // سابقه بیمه رسمی تامین اجتماعی
    insuranceYears: number;
    isRemoteOrFreelance: boolean;
    hasInternationalPortfolio: boolean; // گیت‌هاب، پورتفولیو یا مشتری خارجی
  };
  
  // فاز ۴: زبان‌ها
  languages: {
    englishLevel: EnglishGeneralLevel;
    englishExam: EnglishExamType;
    englishScore: string;
    germanLevel: LanguageLevel;
    frenchLevel: LanguageLevel;
    italianLevel: LanguageLevel;
    otherLanguages: string;
    willingToLearnNewLanguage: boolean;
  };
  
  // فاز ۵: سرمایه و تمکن
  finances: {
    liquidBudgetUSD: number; // سرمایه نقدی دلاری قابل هزینه
    canProvideBankStatement: boolean; // توانایی صدور گردش حساب تمکن مالی در ایران
    bankStatementAmountToman: number; // تمکن ریالی در حساب (تومان)
    needsScholarshipOrFreeTuition: boolean; // نیاز ضروری به تحصیل رایگان یا بورسیه
  };
  
  // فاز ۶: اهداف و اولویت‌ها
  preferences: {
    primaryGoal: PrimaryGoal;
    preferredCountries: string[]; // آلمان، کانادا، ایتالیا و...
    timeline: TimelinePreference;
    riskTolerance: RiskTolerance;
    openToNonEnglishCountries: boolean;
  };
}

export type PathwayType = 'work' | 'study' | 'startup' | 'job_seeker' | 'nomad';

export interface CountryRecommendation {
  countryId: string;
  countryName: string;
  countryNameEn: string;
  flag: string;
  matchScore: number; // 0 to 100
  recommendedPathway: string;
  pathwayType: PathwayType;
  estimatedCostUSD: string;
  estimatedTimeMonths: string;
  difficultyLevel: 'آسان' | 'متوسط' | 'چالش‌برانگیز';
  whyRecommended: string;
  keyRequirements: string[];
  pros: string[];
  cons: string[];
}

export interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  category: 'iran_admin' | 'documents' | 'language' | 'application' | 'financial' | 'embassy' | 'arrival';
  isIranSpecific: boolean;
  tips: string;
  estimatedTime: string;
  completed?: boolean;
}

export interface RoadmapPhase {
  phaseNumber: number;
  phaseTitle: string;
  duration: string;
  summary: string;
  steps: RoadmapStep[];
}

export interface AnalysisResult {
  overallSummary: string;
  profilePersona: string;
  readinessScore: number; // 0 to 100
  keyStrengths: string[];
  keyChallenges: string[];
  iranSpecificAlerts: {
    title: string;
    severity: 'critical' | 'warning' | 'tip';
    content: string;
  }[];
  topCountries: CountryRecommendation[];
  primaryRoadmap: {
    targetCountry: string;
    pathwayTitle: string;
    totalPhasesCount: number;
    estimatedTotalDuration: string;
    phases: RoadmapPhase[];
  };
  financialEstimate: {
    iranAdministrativeIRR: string; // هزینه‌های ریالی داخل ایران (ترجمه، سجاد، وثیقه، پاسپورت)
    languageExamsUSD: string;      // هزینه آزمون‌های بین‌المللی
    credentialEvaluationUSD: string; // WES / ZAB و ارزیابی مدارک
    applicationAndFeesUSD: string;   // اپلیکیشن فی دانشگاه‌ها یا ویزا
    blockedAccountOrProofUSD: string; // تمکن مالی لازم در حساب
    emergencyBufferUSD: string;     // هزینه ماه‌های اول ورود
    totalStartingBudgetUSD: string;
  };
  aiGeneratedAdvice?: string;
  dailyMatches?: MatchedOpportunity[];
}

export type TimeRangeFilter = '1m' | '2m' | '3m' | 'all';
export type ApplicantStatus = 'lead' | 'completed' | 'consultation_requested';

export interface ApplicantRecord {
  id: string;
  createdAt: string; // ISO 8601
  shamsiDate: string; // تاریخ شمسی مانند ۱۴۰۵/۰۶/۲۴
  fullName: string;
  phone: string;
  status?: ApplicantStatus; // 'lead' | 'completed' | 'consultation_requested'
  age: number;
  gender: Gender;
  militaryStatus: MilitaryStatus;
  degree?: DegreeLevel;
  field?: string;
  jobTitle?: string;
  yearsExperience?: number;
  englishLevel?: string;
  liquidBudgetUSD?: number;
  topCountry?: string;
  matchScore?: number;
  recommendedPathway?: string;
  consultationService?: string;
  consultationNotes?: string;
  telegramId?: string;
  profile?: UserProfile;
}

export interface ApplicantStatistics {
  totalCount: number;
  filteredCount: number;
  leadsCount: number;
  completedCount: number;
  averageAge: number;
  averageBudgetUSD: number;
  militaryBreakdown: Record<string, number>;
  degreeBreakdown: Record<string, number>;
  countryDistribution: Record<string, number>;
  recentCountToday: number;
  recentCountWeek: number;
}

export type WorldRegion = 'all' | 'americas' | 'gulf' | 'asia_turkey' | 'europe';
export type OpportunityType = 'all' | 'job_offer' | 'university_admission' | 'scholarship' | 'job_seeker_visa';

export interface GlobalOpportunity {
  id: string;
  title: string;
  region: 'americas' | 'gulf' | 'asia_turkey' | 'europe';
  country: string;
  countryFlag: string;
  city?: string;
  type: 'job_offer' | 'university_admission' | 'scholarship' | 'job_seeker_visa';
  typeLabel: string;
  institutionOrCompany: string;
  salaryOrFund: string;
  languageRequirement: string;
  deadline: string;
  visaType: string;
  iranianCompatibility: {
    successRate: number; // e.g. 95%
    embassyDifficulty: 'easy' | 'moderate' | 'challenging';
    militarySensitive: boolean;
    keyRequirements: string[];
    embassyNotes: string;
  };
  summary: string;
  stepsToApply: string[];
  applyUrl: string;
  tags: string[];
  publishedDate: string;
  isHot?: boolean;
}

export interface MatchedOpportunity extends GlobalOpportunity {
  matchPercentage: number; // e.g. 96%
  matchReason: string; // e.g. "تطبیق کامل با رشته مهندسی کامپیوتر و بودجه نقدی شما"
}



