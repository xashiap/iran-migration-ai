import { UserProfile } from '../types/migration';

export interface SampleProfileItem {
  id: string;
  label: string;
  description: string;
  icon: string;
  data: UserProfile;
}

export const SAMPLE_PROFILES: SampleProfileItem[] = [
  {
    id: 'software-engineer',
    label: 'توسعه‌دهنده نرم‌افزار (۲۸ ساله)',
    description: 'لیسانس مهندسی کامپیوتر، ۴ سال سابقه بیمه، آیلتس ۷، کارت پایان خدمت، بودجه متوسط',
    icon: '💻',
    data: {
      personal: {
        fullName: 'سامان محمدی',
        age: 28,
        gender: 'male',
        maritalStatus: 'single',
        childrenCount: 0,
        militaryStatus: 'completed',
        hasPassport: true,
        passportValidityMonths: 36
      },
      education: {
        degree: 'bachelor',
        field: 'مهندسی کامپیوتر و نرم‌افزار',
        majorCategory: 'computer_it',
        universityType: 'state_regular',
        universityName: 'دانشگاه دولتی',
        gpa: 16.5,
        isDegreeReleased: true
      },
      work: {
        jobTitle: 'توسعه‌دهنده فول‌استک (Full-Stack Developer)',
        yearsExperience: 4,
        hasOfficialInsurance: true,
        insuranceYears: 4,
        isRemoteOrFreelance: true,
        hasInternationalPortfolio: true
      },
      languages: {
        englishLevel: 'advanced',
        englishExam: 'ielts',
        englishScore: '7.5',
        germanLevel: 'a1_a2',
        frenchLevel: 'none',
        italianLevel: 'none',
        otherLanguages: '',
        willingToLearnNewLanguage: true
      },
      finances: {
        liquidBudgetUSD: 14000,
        canProvideBankStatement: true,
        bankStatementAmountToman: 800000000, // ۸۰۰ میلیون تومان
        needsScholarshipOrFreeTuition: false
      },
      preferences: {
        primaryGoal: 'job_immediate',
        preferredCountries: ['آلمان', 'کانادا', 'هلند'],
        timeline: 'under_1_year',
        riskTolerance: 'moderate',
        openToNonEnglishCountries: true
      }
    }
  },
  {
    id: 'student-dsu',
    label: 'دانشجو با بودجه اقتصادی (۲۳ ساله)',
    description: 'فارغ‌التحصیل لیسانس، بدون سابقه بیمه، آیلتس ۶.۵، معافیت تحصیلی، نیاز به بورسیه',
    icon: '🎓',
    data: {
      personal: {
        fullName: 'سارا رضایی',
        age: 23,
        gender: 'female',
        maritalStatus: 'single',
        childrenCount: 0,
        militaryStatus: 'not_applicable',
        hasPassport: true,
        passportValidityMonths: 24
      },
      education: {
        degree: 'bachelor',
        field: 'زیست‌شناسی و بیوتکنولوژی',
        majorCategory: 'basic_sciences',
        universityType: 'state_top',
        universityName: 'دانشگاه سراسری روزانه',
        gpa: 17.2,
        isDegreeReleased: false
      },
      work: {
        jobTitle: 'دستیار پژوهشی آزمایشگاه',
        yearsExperience: 1,
        hasOfficialInsurance: false,
        insuranceYears: 0,
        isRemoteOrFreelance: false,
        hasInternationalPortfolio: false
      },
      languages: {
        englishLevel: 'advanced',
        englishExam: 'ielts',
        englishScore: '6.5',
        germanLevel: 'none',
        frenchLevel: 'none',
        italianLevel: 'none',
        otherLanguages: '',
        willingToLearnNewLanguage: true
      },
      finances: {
        liquidBudgetUSD: 4500,
        canProvideBankStatement: true,
        bankStatementAmountToman: 350000000, // ۳۵۰ میلیون تومان
        needsScholarshipOrFreeTuition: true
      },
      preferences: {
        primaryGoal: 'study_low_cost',
        preferredCountries: ['ایتالیا', 'آلمان', 'اتریش'],
        timeline: 'under_1_year',
        riskTolerance: 'moderate',
        openToNonEnglishCountries: true
      }
    }
  },
  {
    id: 'nurse-healthcare',
    label: 'کادر درمان و پرستاری (۳۱ ساله)',
    description: 'لیسانس پرستاری، ۵ سال سابقه بیمارستان با بیمه، در حال یادگیری آلمانی، پایان خدمت',
    icon: '🩺',
    data: {
      personal: {
        fullName: 'امید نجفی',
        age: 31,
        gender: 'male',
        maritalStatus: 'married',
        childrenCount: 1,
        militaryStatus: 'completed',
        hasPassport: true,
        passportValidityMonths: 48
      },
      education: {
        degree: 'bachelor',
        field: 'کارشناسی پرستاری',
        majorCategory: 'medical_health',
        universityType: 'state_regular',
        universityName: 'دانشگاه علوم پزشکی',
        gpa: 15.8,
        isDegreeReleased: true
      },
      work: {
        jobTitle: 'پرستار بخش مراقبت‌های ویژه (ICU)',
        yearsExperience: 5,
        hasOfficialInsurance: true,
        insuranceYears: 5,
        isRemoteOrFreelance: false,
        hasInternationalPortfolio: false
      },
      languages: {
        englishLevel: 'intermediate',
        englishExam: 'none',
        englishScore: '',
        germanLevel: 'b1',
        frenchLevel: 'none',
        italianLevel: 'none',
        otherLanguages: '',
        willingToLearnNewLanguage: true
      },
      finances: {
        liquidBudgetUSD: 11000,
        canProvideBankStatement: true,
        bankStatementAmountToman: 650000000,
        needsScholarshipOrFreeTuition: false
      },
      preferences: {
        primaryGoal: 'family_relocation',
        preferredCountries: ['آلمان', 'عمان', 'استرالیا'],
        timeline: '1_to_2_years',
        riskTolerance: 'low',
        openToNonEnglishCountries: true
      }
    }
  }
];

export const INITIAL_EMPTY_PROFILE: UserProfile = {
  personal: {
    fullName: '',
    age: 26,
    gender: 'male',
    maritalStatus: 'single',
    childrenCount: 0,
    militaryStatus: 'completed',
    hasPassport: true,
    passportValidityMonths: 24
  },
  education: {
    degree: 'bachelor',
    field: '',
    majorCategory: 'computer_it',
    universityType: 'state_regular',
    universityName: '',
    gpa: 16,
    isDegreeReleased: false
  },
  work: {
    jobTitle: '',
    yearsExperience: 2,
    hasOfficialInsurance: true,
    insuranceYears: 2,
    isRemoteOrFreelance: false,
    hasInternationalPortfolio: false
  },
  languages: {
    englishLevel: 'intermediate',
    englishExam: 'none',
    englishScore: '',
    germanLevel: 'none',
    frenchLevel: 'none',
    italianLevel: 'none',
    otherLanguages: '',
    willingToLearnNewLanguage: true
  },
  finances: {
    liquidBudgetUSD: 8000,
    canProvideBankStatement: true,
    bankStatementAmountToman: 500000000,
    needsScholarshipOrFreeTuition: false
  },
  preferences: {
    primaryGoal: 'job_immediate',
    preferredCountries: ['آلمان', 'ایتالیا', 'کانادا'],
    timeline: 'under_1_year',
    riskTolerance: 'moderate',
    openToNonEnglishCountries: true
  }
};
