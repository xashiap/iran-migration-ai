'use client';

import React, { useState, useEffect } from 'react';
import { UserProfile, AnalysisResult } from '@/types/migration';
import { INITIAL_EMPTY_PROFILE } from '@/data/sampleProfiles';
import { Header } from '@/components/Header';
import { StepIndicator } from '@/components/Wizard/StepIndicator';
import { StepPersonal } from '@/components/Wizard/StepPersonal';
import { StepEducation } from '@/components/Wizard/StepEducation';
import { StepWork } from '@/components/Wizard/StepWork';
import { StepLanguage } from '@/components/Wizard/StepLanguage';
import { StepFinance } from '@/components/Wizard/StepFinance';
import { StepPreferences } from '@/components/Wizard/StepPreferences';
import { DossierDashboard } from '@/components/Result/DossierDashboard';
import { CurrencyBar } from '@/components/CurrencyBar';
import { ImmigrationRadar } from '@/components/Radar/ImmigrationRadar';
import { CurrencyData, DEFAULT_CURRENCY } from '@/lib/currency';
import { ThreeDimensionalDecorations } from '@/components/ThreeDimensionalDecorations';
import { 
  Sparkles, 
  Radio, 
  ArrowLeft, 
  ArrowRight,
  Clock, 
  Globe, 
  ShieldCheck, 
  Layers, 
  Bot, 
  Compass
} from 'lucide-react';

export default function Home() {
  const [profile, setProfile] = useState<UserProfile>(INITIAL_EMPTY_PROFILE);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [currency, setCurrency] = useState<CurrencyData>(DEFAULT_CURRENCY);
  const [isCurrencyLoading, setIsCurrencyLoading] = useState<boolean>(false);
  const [isRadarOpen, setIsRadarOpen] = useState<boolean>(false);

  // استیت کنترل خلوت بودن صفحه اول: در ابتدا ویزارد بسته است
  const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);

  const fetchCurrency = async () => {
    setIsCurrencyLoading(true);
    try {
      const res = await fetch('/api/currency');
      const json = await res.json();
      if (json.success && json.data) {
        setCurrency(json.data);
      }
    } catch (e) {
      console.error('Failed to fetch currency', e);
    } finally {
      setIsCurrencyLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrency();
  }, []);

  // بارگذاری کلید از لوکال‌استوریج
  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) setApiKey(savedKey);
  }, []);

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('gemini_api_key', key);
  };

  const handleReset = () => {
    setProfile(INITIAL_EMPTY_PROFILE);
    setCurrentStep(1);
    setAnalysisResult(null);
    setError(null);
    setIsWizardOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const validateStep = (stepNumber: number): string | null => {
    if (stepNumber === 1) {
      if (!profile.personal.fullName || profile.personal.fullName.trim().length < 3) {
        return 'وارد کردن «نام و نام خانوادگی» در مرحله اول جهت ثبت پرونده اجباری است.';
      }
      const cleanPhone = (profile.personal.phone || '').trim().replace(/[\s-]/g, '');
      if (!cleanPhone || !/^09[0-9]{9}$/.test(cleanPhone)) {
        return 'وارد کردن «شماره موبایل» معتبر ایران (۱۱ رقمی با ۰۹) در مرحله اول اجباری است.';
      }
    }
    return null;
  };

  const handleStepNavigation = (targetStep: number) => {
    if (targetStep > currentStep) {
      const err = validateStep(currentStep);
      if (err) {
        setError(err);
        return;
      }
      // ثبت خودکار نام و شماره تماس در کلود بلافاصله پس از اتمام مرحله اول
      if (currentStep === 1 && profile.personal?.fullName && profile.personal?.phone) {
        fetch('/api/lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profile }),
        }).catch(() => {});
      }
    }
    setError(null);
    setCurrentStep(targetStep);
  };

  const handleSubmit = async () => {
    const err = validateStep(1);
    if (err) {
      setError(err);
      setCurrentStep(1);
      window.scrollTo({ top: 200, behavior: 'smooth' });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile,
          apiKey: apiKey || undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'خطا در ارزیابی پرونده');

      setAnalysisResult(json.data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'خطایی در پردازش رخ داد.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      {/* المان‌های سه‌بعدی بلورین ۴ گوشه صفحه با گلس‌مورفیسم نرم */}
      <ThreeDimensionalDecorations />

      <CurrencyBar
        currency={currency}
        isLoading={isCurrencyLoading}
        onRefresh={fetchCurrency}
      />

      <Header
        onReset={handleReset}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
        onToggleRadar={() => setIsRadarOpen(!isRadarOpen)}
        isRadarOpen={isRadarOpen}
        onStartAssessment={() => {
          setIsWizardOpen(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isWizardOpen={isWizardOpen || Boolean(analysisResult)}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* پیام خطا */}
        {error && (
          <div className="mb-6 bg-rose-500/10 border border-rose-500/30 text-rose-300 p-4 rounded-2xl text-xs sm:text-sm flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-rose-400 hover:text-white text-xs underline mr-3"
            >
              بستن
            </button>
          </div>
        )}

        {/* رادار زنده بخشنامه‌ها و وقت‌های سفارت */}
        {isRadarOpen && (
          <div className="mb-8 animate-in fade-in zoom-in-95 duration-200">
            <ImmigrationRadar onClose={() => setIsRadarOpen(false)} />
          </div>
        )}

        {/* ========================================================= */}
        {/* حالت ۱: صفحه نتایج جامع (وقتی ارزیابی تمام شد)            */}
        {/* ========================================================= */}
        {analysisResult ? (
          <DossierDashboard
            result={analysisResult}
            profile={profile}
            onEditProfile={() => setAnalysisResult(null)}
            onReset={handleReset}
            usdTomanRate={currency.usdToman}
            eurTomanRate={currency.eurToman}
            apiKey={apiKey}
          />
        ) : isWizardOpen ? (
          /* ========================================================= */
          /* حالت ۲: محیط متمرکز ارزیابی ویزارد (وقتی کاربر دکمه زد)     */
          /* ========================================================= */
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            {/* نوار هدایت بالای ویزارد */}
            <div className="flex items-center justify-between bg-[#11141d]/80 border border-white/[0.08] px-5 py-3.5 rounded-2xl backdrop-blur-md">
              <button
                type="button"
                onClick={() => setIsWizardOpen(false)}
                className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white transition cursor-pointer"
              >
                <ArrowRight className="w-4 h-4 text-indigo-400" />
                <span>بازگشت به معرفی سایت</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400">فرآیند ارزیابی پرونده</span>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 text-xs font-mono font-bold border border-indigo-500/30">
                  مرحله {currentStep} از ۶
                </span>
              </div>
            </div>

            {/* نوار مراحل فرم */}
            <StepIndicator
              currentStep={currentStep}
              onStepClick={handleStepNavigation}
            />

            {/* بدنه فرم مراحل */}
            <div className="bg-[#11141d]/90 border border-white/[0.08] rounded-3xl p-6 sm:p-9 shadow-2xl backdrop-blur-md">
              {currentStep === 1 && (
                <StepPersonal
                  profile={profile}
                  onChange={setProfile}
                  onNext={() => handleStepNavigation(2)}
                />
              )}

              {currentStep === 2 && (
                <StepEducation
                  profile={profile}
                  onChange={setProfile}
                  onPrev={() => handleStepNavigation(1)}
                  onNext={() => handleStepNavigation(3)}
                />
              )}

              {currentStep === 3 && (
                <StepWork
                  profile={profile}
                  onChange={setProfile}
                  onPrev={() => handleStepNavigation(2)}
                  onNext={() => handleStepNavigation(4)}
                />
              )}

              {currentStep === 4 && (
                <StepLanguage
                  profile={profile}
                  onChange={setProfile}
                  onPrev={() => handleStepNavigation(3)}
                  onNext={() => handleStepNavigation(5)}
                />
              )}

              {currentStep === 5 && (
                <StepFinance
                  profile={profile}
                  onChange={setProfile}
                  onPrev={() => handleStepNavigation(4)}
                  onNext={() => handleStepNavigation(6)}
                />
              )}

              {currentStep === 6 && (
                <StepPreferences
                  profile={profile}
                  onChange={setProfile}
                  onPrev={() => handleStepNavigation(5)}
                  onSubmit={handleSubmit}
                  isLoading={isLoading}
                />
              )}
            </div>
          </div>
        ) : (
          /* ========================================================= */
          /* حالت ۳: صفحه اول اصلی (خلوت، چشم‌نواز، لوکس و مدرن)         */
          /* ========================================================= */
          <div className="space-y-16 py-6 sm:py-10 animate-in fade-in duration-300 text-center">
            
            {/* هیرو سکشن اصلی */}
            <div className="max-w-4xl mx-auto space-y-6">
              
              {/* بج درخشان بالای تیتر */}
              <div className="inline-flex items-center gap-2.5 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 border border-indigo-500/25 px-4 py-1.5 rounded-full text-xs font-bold text-indigo-300 shadow-inner">
                <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                <span>نسخه ۲۰۲۶ • طراحی اختصاصی بر اساس قوانین ۱۶ کشور دنیا</span>
              </div>

              {/* تیتر بزرگ و خوانا */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.25]">
                مسیر هوشمند مهاجرت از ایران،<br />
                <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-emerald-400 bg-clip-text text-transparent">
                  بدون آزمون و خطا با هوش مصنوعی
                </span>
              </h1>

              {/* توضیح کوتاه و گیرا */}
              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-2xl mx-auto">
                ارزیابی تخصصی شرایط شما بر اساس جدیدترین مصوبات مهاجرتی؛ با تحلیل دقیق چالش‌های بومی ایران شامل نظام وظیفه، سامانه سجاد، تمکن ریالی و مصاحبه سفارت‌ها.
              </p>

              {/* دکمه‌های اصلی اقدام (CTAs) */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsWizardOpen(true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl text-base font-black shadow-xl shadow-indigo-600/35 hover:shadow-indigo-600/50 hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center gap-2.5 cursor-pointer border border-white/10"
                >
                  <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
                  <span>شروع ارزیابی هوشمند و رایگان</span>
                  <ArrowLeft className="w-5 h-5 mr-1" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsRadarOpen(true)}
                  className="w-full sm:w-auto px-6 py-4 bg-[#11141d]/90 hover:bg-zinc-800 text-zinc-200 hover:text-white rounded-2xl text-sm font-bold border border-white/[0.1] hover:border-white/[0.2] transition flex items-center justify-center gap-2 cursor-pointer shadow-lg backdrop-blur-md"
                >
                  <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span>مشاهده رادار زنده فرصت‌ها</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                </button>
              </div>

              {/* ویژگی‌های کلیدی سریع زیر دکمه‌ها */}
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 pt-4 text-xs text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  <span>مدت زمان: کمتر از ۳ دقیقه</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-emerald-400" />
                  <span>پوشش ۱۶ کشور قدرتمند دنیا</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-purple-400" />
                  <span>نقشه راه ۷ فازه از ایران تا لندینگ</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>۱۰۰٪ رایگان و محرمانه</span>
                </span>
              </div>
            </div>

            {/* کارت‌های ۳ گانه معرفی امکانات کلیدی (خیلی شیک و منظم) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-right max-w-5xl mx-auto pt-6">
              
              <div className="bg-[#11141d]/80 border border-white/[0.08] hover:border-indigo-500/30 rounded-3xl p-6 shadow-xl space-y-3 transition group backdrop-blur-sm">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/15 border border-indigo-500/25 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition">
                  اطلس ۱۶ کشور هدف با قوانین ۲۰۲۶
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  تحلیل دقیق مسیرهای کاری و تحصیلی در آمریکا (شامل لاتاری گرین‌کارت)، آلمان، کانادا، ایتالیا، سوئد، دانمارک، نروژ، فنلاند، هلند، فرانسه، ژاپن، انگلیس، استرالیا و ترکیه.
                </p>
              </div>

              <div className="bg-[#11141d]/80 border border-white/[0.08] hover:border-emerald-500/30 rounded-3xl p-6 shadow-xl space-y-3 transition group backdrop-blur-sm">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition">
                  <Radio className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition">
                  رادار زنده فرصت‌های استخدامی و بورسیه
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  رصد خودکار و روزانه جاب‌آفرهای دارای اسپانسرشیپ ویزا و بورسیه‌های فول‌فاند در سراسر جهان با به‌روزرسانی بدون وقفه کران‌جاب ابری.
                </p>
              </div>

              <div className="bg-[#11141d]/80 border border-white/[0.08] hover:border-purple-500/30 rounded-3xl p-6 shadow-xl space-y-3 transition group backdrop-blur-sm">
                <div className="w-12 h-12 rounded-2xl bg-purple-600/15 border border-purple-500/25 flex items-center justify-center text-purple-400 group-hover:scale-105 transition">
                  <Bot className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition">
                  شبیه‌ساز مصاحبه و مستشار هوش مصنوعی
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  تمرین گفتگوی زنده با آفیسر سفارت کشورهای آلمان، آمریکا، کانادا و ایتالیا همراه با چت اختصاصی مستشار حقوقی جهت پاسخ به تمام ابهامات پرونده.
                </p>
              </div>

            </div>

          </div>
        )}
      </main>

      {/* فوتر مینیمال */}
      <footer className="border-t border-white/[0.06] bg-[#090b10] py-6 text-center text-xs text-zinc-500 no-print mt-auto">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-indigo-400" />
            <span className="text-zinc-400 font-semibold">کوچ‌یار هوشمند (IraMigrate AI)</span>
            <span>—</span>
            <span>طراحی‌شده برای شهروندان مقیم ایران</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => setIsRadarOpen(true)}
              className="hover:text-zinc-300 transition cursor-pointer"
            >
              رادار فرصت‌ها
            </button>
            <a
              href="/admin"
              className="hover:text-zinc-300 transition"
            >
              پنل مدیریت
            </a>
            <span className="text-zinc-600">|</span>
            <span className="font-mono text-zinc-600">v3.5 • 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
