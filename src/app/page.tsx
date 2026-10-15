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
  Globe, 
  Bot, 
  Compass,
  User,
  Phone,
  Target,
  Lock
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

  // بارگذاری کلید و بررسی باز بودن ویزارد از آدرس
  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) setApiKey(savedKey);

    if (typeof window !== 'undefined' && window.location.search.includes('wizard=true')) {
      setIsWizardOpen(true);
    }
    if (typeof window !== 'undefined' && window.location.search.includes('radar=true')) {
      setIsRadarOpen(true);
    }
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

  const handleQuickStart = () => {
    const err = validateStep(1);
    if (err) {
      setError(err);
      setIsWizardOpen(true);
      setCurrentStep(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    // اگر مرحله ۱ پر شده بود، به مرحله ۲ هدایت شود
    fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile }),
    }).catch(() => {});
    setError(null);
    setIsWizardOpen(true);
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    <div className="min-h-screen flex flex-col relative overflow-x-hidden bg-[#08090d]">
      {/* المان‌های سه‌بعدی، نورافکن‌های تئاتری و شبکه خطوط AuthKit */}
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

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* پیام خطا */}
        {error && (
          <div className="mb-6 bg-rose-500/10 border border-rose-500/30 text-rose-300 p-4 rounded-xl text-xs sm:text-sm flex items-center justify-between backdrop-blur-md">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-rose-400 hover:text-white text-xs underline mr-3 cursor-pointer"
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
          /* حالت ۲: محیط متمرکز ارزیابی ویزارد (سبک AuthKit)           */
          /* ========================================================= */
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            {/* نوار هدایت بالای ویزارد با تم AuthKit */}
            <div className="flex items-center justify-between authkit-card px-5 py-3.5 rounded-xl">
              <button
                type="button"
                onClick={() => setIsWizardOpen(false)}
                className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition cursor-pointer"
              >
                <ArrowRight className="w-4 h-4 text-indigo-400" />
                <span>بازگشت به معرفی سایت</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400">فرآیند ارزیابی پرونده</span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/[0.04] text-zinc-300 text-xs font-mono font-medium border border-white/10">
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
            <div className="relative authkit-card rounded-2xl p-6 sm:p-9 shadow-2xl">
              {/* نشانگرهای مثبت گوشه AuthKit */}
              <span className="authkit-crosshair top-3 left-3">+</span>
              <span className="authkit-crosshair top-3 right-3">+</span>
              <span className="authkit-crosshair bottom-3 left-3">+</span>
              <span className="authkit-crosshair bottom-3 right-3">+</span>

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
          /* حالت ۳: صفحه اصلی بازطراحی‌شده با استاندارد AuthKit        */
          /* ========================================================= */
          <div className="space-y-16 py-6 sm:py-10 animate-in fade-in duration-300 text-center">
            
            {/* هیرو سکشن اصلی AuthKit */}
            <div className="max-w-4xl mx-auto space-y-6">
              
              {/* AuthKit Introducing Pill Badge */}
              <div className="inline-flex items-center gap-2 border border-white/[0.12] bg-white/[0.03] backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold text-zinc-300 shadow-[0_0_15px_rgba(99,102,241,0.12)]">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
                <span>نسخه ۲۰۲۶ • طراحی اختصاصی بر پایه زبان دیزاین مدرن AuthKit</span>
              </div>

              {/* تیتر بزرگ و خوانا با گرادیان مونوکروم شیک */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-100 to-zinc-400 tracking-tight leading-[1.25]">
                مسیر هوشمند مهاجرت از ایران،<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-indigo-200 to-purple-300">
                  بدون آزمون و خطا با هوش مصنوعی
                </span>
              </h1>

              {/* توضیح کوتاه و گیرا */}
              <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl mx-auto">
                ارزیابی تخصصی شرایط شما بر اساس جدیدترین مصوبات مهاجرتی؛ با تحلیل دقیق چالش‌های بومی ایران شامل نظام وظیفه، سامانه سجاد، تمکن ریالی و مصاحبه سفارت‌ها.
              </p>
            </div>

            {/* ========================================================= */}
            {/* المان شاخص سبک AuthKit: کارت شناور شروع سریع در کانون نور   */}
            {/* ========================================================= */}
            <div className="max-w-md mx-auto relative text-right">
              {/* ۴ نشانگر مثبت در اطراف کارت (AuthKit Signature Crosshairs) */}
              <span className="authkit-crosshair -top-3 -left-3 hidden sm:flex">+</span>
              <span className="authkit-crosshair -top-3 -right-3 hidden sm:flex">+</span>
              <span className="authkit-crosshair -bottom-3 -left-3 hidden sm:flex">+</span>
              <span className="authkit-crosshair -bottom-3 -right-3 hidden sm:flex">+</span>

              <div className="authkit-card rounded-2xl p-6 sm:p-7 shadow-2xl relative space-y-5">
                {/* هدر کارت */}
                <div className="flex items-center gap-3 border-b border-white/[0.08] pb-4">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-indigo-400 shadow-inner">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      ورود به ارزیابی هوشمند پرونده
                    </h3>
                    <p className="text-[11px] text-zinc-400">
                      مشخصات اولیه را وارد کنید یا مستقیماً شروع نمایید
                    </p>
                  </div>
                </div>

                {/* فیلدهای ورودی به سبک AuthKit Solid Input */}
                <div className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-zinc-400" />
                      <span>نام و نام خانوادگی:</span>
                    </label>
                    <input
                      type="text"
                      value={profile.personal.fullName}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          personal: { ...profile.personal, fullName: e.target.value },
                        })
                      }
                      placeholder="مثال: علیرضا محمدی"
                      className="w-full px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-600 border border-white/[0.1] bg-[#090b10] rounded-xl focus:border-indigo-500 focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-zinc-400" />
                      <span>شماره موبایل ایران (جهت دریافت پرونده):</span>
                    </label>
                    <input
                      type="tel"
                      dir="ltr"
                      value={profile.personal.phone}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          personal: { ...profile.personal, phone: e.target.value },
                        })
                      }
                      placeholder="09123456789"
                      className="w-full px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-600 border border-white/[0.1] bg-[#090b10] rounded-xl focus:border-indigo-500 focus:outline-none transition text-left font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-zinc-400" />
                      <span>هدف اصلی مهاجرت:</span>
                    </label>
                    <select
                      value={profile.preferences.primaryGoal}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          preferences: { ...profile.preferences, primaryGoal: e.target.value as any },
                        })
                      }
                      className="w-full px-3.5 py-2.5 text-xs text-zinc-100 border border-white/[0.1] bg-[#090b10] rounded-xl focus:border-indigo-500 focus:outline-none transition cursor-pointer"
                    >
                      <option value="quick_pr">اقامت دائم در سریع‌ترین زمان ممکن (PR)</option>
                      <option value="job_immediate">اشتغال و درآمد ارزی فوری (Job Offer / Blue Card)</option>
                      <option value="study_low_cost">تحصیل با حداقل هزینه یا بورسیه فول‌فاند</option>
                      <option value="family_relocation">مهاجرت امن خانوادگی همراه با همسر و فرزندان</option>
                      <option value="lifestyle_freedom">کیفیت زندگی، رفاه اجتماعی و آینده فرزندان</option>
                      <option value="citizenship">اخذ پاسپورت معتبر دوم</option>
                    </select>
                  </div>
                </div>

                {/* دکمه اصلی اقدام سبک AuthKit (High-Contrast Solid Button) */}
                <button
                  type="button"
                  onClick={handleQuickStart}
                  className="w-full py-3.5 px-4 rounded-xl authkit-button-primary text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer border-t border-white active:scale-[0.99]"
                >
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>ادامه و تکمیل ارزیابی هوشمند (رایگان)</span>
                  <ArrowLeft className="w-4 h-4 mr-0.5" />
                </button>

                {/* خط جداکننده OR به سبک AuthKit */}
                <div className="authkit-divider">یا</div>

                {/* دکمه ثانویه سبک AuthKit Outline */}
                <button
                  type="button"
                  onClick={() => setIsRadarOpen(true)}
                  className="w-full py-2.5 px-4 rounded-xl authkit-button-secondary text-xs font-semibold transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span>مشاهده رادار زنده فرصت‌ها (۳۹ موقعیت فعال)</span>
                </button>

                {/* پاورقی کارت */}
                <div className="pt-2 text-center text-[11px] text-zinc-500 flex items-center justify-center gap-1.5">
                  <Lock className="w-3 h-3 text-zinc-500" />
                  <span>ارزیابی ۱۰۰٪ محرمانه و بدون نیاز به ثبت‌نام اجباری</span>
                </div>
              </div>
            </div>

            {/* ========================================================= */}
            {/* نوار کپسولی ویژگی‌ها و مقاصد (Features Matrix Dock)         */}
            {/* ========================================================= */}
            <div className="max-w-4xl mx-auto pt-2">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 text-xs text-zinc-400">
                <span className="px-3 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.02] flex items-center gap-1.5">
                  <span>🇩🇪</span>
                  <span className="text-zinc-300">بلوکارت آلمان</span>
                </span>
                <span className="px-3 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.02] flex items-center gap-1.5">
                  <span>🇨🇦</span>
                  <span className="text-zinc-300">اکسپرس اینتری کانادا</span>
                </span>
                <span className="px-3 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.02] flex items-center gap-1.5">
                  <span>🇺🇸</span>
                  <span className="text-zinc-300">لاتاری گرین‌کارت آمریکا</span>
                </span>
                <span className="px-3 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.02] flex items-center gap-1.5">
                  <span>🇫🇷</span>
                  <span className="text-zinc-300">پاسپورت تلنت فرانسه</span>
                </span>
                <span className="px-3 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.02] flex items-center gap-1.5">
                  <span>🇦🇺</span>
                  <span className="text-zinc-300">اسکیل‌ورکر استرالیا</span>
                </span>
                <span className="px-3 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.02] flex items-center gap-1.5">
                  <span>🇮🇹</span>
                  <span className="text-zinc-300">بورسیه DSU ایتالیا</span>
                </span>
                <span className="px-3 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.02] flex items-center gap-1.5">
                  <span>🇳🇱</span>
                  <span className="text-zinc-300">قانون ۳۰٪ هلند</span>
                </span>
              </div>
            </div>

            {/* کارت‌های ۳ گانه معرفی امکانات کلیدی (Bento Grid به سبک AuthKit) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-right max-w-5xl mx-auto pt-4">
              
              <div className="authkit-card authkit-card-interactive rounded-2xl p-6 relative space-y-3">
                <span className="authkit-crosshair top-2 left-2 text-[10px]">+</span>
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-indigo-400">
                  <Globe className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white">
                  اطلس ۱۶ کشور هدف با قوانین ۲۰۲۶
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  تحلیل دقیق مسیرهای کاری و تحصیلی در آمریکا (شامل لاتاری گرین‌کارت)، آلمان، کانادا، ایتالیا، سوئد، دانمارک، نروژ، فنلاند، هلند، فرانسه، ژاپن، انگلیس، استرالیا و ترکیه.
                </p>
              </div>

              <div className="authkit-card authkit-card-interactive rounded-2xl p-6 relative space-y-3">
                <span className="authkit-crosshair top-2 left-2 text-[10px]">+</span>
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-emerald-400">
                  <Radio className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white">
                  رادار زنده فرصت‌های استخدامی و بورسیه
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  رصد خودکار و روزانه جاب‌آفرهای دارای اسپانسرشیپ ویزا و بورسیه‌های فول‌فاند در سراسر جهان با به‌روزرسانی بدون وقفه کران‌جاب ابری.
                </p>
              </div>

              <div className="authkit-card authkit-card-interactive rounded-2xl p-6 relative space-y-3">
                <span className="authkit-crosshair top-2 left-2 text-[10px]">+</span>
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-purple-400">
                  <Bot className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white">
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

      {/* فوتر مینیمال سبک AuthKit */}
      <footer className="border-t border-white/[0.06] bg-[#06070a] py-6 text-center text-xs text-zinc-500 no-print mt-auto relative z-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-indigo-400" />
            <span className="text-zinc-400 font-semibold">کوچ‌یار هوشمند (IraMigrate AI)</span>
            <span>—</span>
            <span>سیستم هوشمند ارزیابی مهاجرت ایرانیان</span>
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
            <span className="text-zinc-700">|</span>
            <span className="font-mono text-zinc-600">AuthKit Edition • 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
