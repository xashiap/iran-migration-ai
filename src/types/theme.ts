export type AppTheme = 'cyber-dark' | 'clean-luxury' | 'midnight-aurora';

export interface ThemeOption {
  id: AppTheme;
  titleFa: string;
  badgeFa: string;
  descriptionFa: string;
  icon: string;
  previewColors: {
    bg: string;
    card: string;
    accent: string;
    text: string;
  };
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'cyber-dark',
    titleFa: 'کنسول سایبرنتیک (تیره مدرن)',
    badgeFa: 'پیش‌فرض تکنولوژی',
    descriptionFa: 'کنتراست عمیق مشکی و سرمه‌ای با نوارهای نئونی نیلی و فیروزه‌ای. الهام‌گرفته از کنسول‌های پیشرفته هوش مصنوعی.',
    icon: '🪐',
    previewColors: {
      bg: '#020617',
      card: '#0f172a',
      accent: '#4f46e5',
      text: '#f8fafc',
    },
  },
  {
    id: 'clean-luxury',
    titleFa: 'ادیتوریال لوکس (روشن رسمی)',
    badgeFa: 'سبک شرکتی و ژورنالی',
    descriptionFa: 'پس‌زمینه سفید شیری و عاجی با سایه‌های نرم، با تایپوگرافی سربی و سبز زمردی سلطنتی. پرستیژ بالا و خوانایی عالی.',
    icon: '🏛️',
    previewColors: {
      bg: '#f8fafc',
      card: '#ffffff',
      accent: '#059669',
      text: '#0f172a',
    },
  },
  {
    id: 'midnight-aurora',
    titleFa: 'کهکشان شیشه‌ای (آئورا و نئون)',
    badgeFa: 'ترند مدرن ۲۰۲۶',
    descriptionFa: 'شیشه‌های مات با افکت بلور (Glassmorphism)، گرادیان‌های کهکشانی بنفش و ارغوانی. طراحی چشم‌نواز و زنده.',
    icon: '🌌',
    previewColors: {
      bg: '#070114',
      card: '#1e0b38',
      accent: '#c026d3',
      text: '#f3e8ff',
    },
  },
];
