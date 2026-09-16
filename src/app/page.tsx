'use client';

import React, { useState, useEffect } from 'react';
import { UserProfile, AnalysisResult } from '@/types/migration';
import { INITIAL_EMPTY_PROFILE, SAMPLE_PROFILES, SampleProfileItem } from '@/data/sampleProfiles';
import Link from 'next/link';
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
import { Sparkles, ChevronRight, Zap, Radio } from 'lucide-react';

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

  const handleSelectSample = (sample: SampleProfileItem) => {
    setProfile(sample.data);
    setError(null);
    // اسکرول نرم به ابتدای فرم
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  const handleQuickAnalyzeSample = async (sample: SampleProfileItem) => {
    setProfile(sample.data);
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: sample.data,
          apiKey: apiKey || undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'خطا در برقراری ارتباط');

      setAnalysisResult(json.data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'خطایی رخ داد.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setProfile(INITIAL_EMPTY_PROFILE);
    setCurrentStep(1);
    setAnalysisResult(null);
    setError(null);
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
      window.scrollTo({ top: 350, behavior: 'smooth' });
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
        onSelectSample={handleSelectSample}
        onReset={handleReset}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
        onToggleRadar={() => setIsRadarOpen(!isRadarOpen)}
        isRadarOpen={isRadarOpen}
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

        {analysisResult ? (
          /* صفحه نمایش نتایج جامع */
          <DossierDashboard
            result={analysisResult}
            onEditProfile={() => setAnalysisResult(null)}
            onReset={handleReset}
            usdTomanRate={currency.usdToman}
            eurTomanRate={currency.eurToman}
          />
        ) : (
          /* فرم چندمرحله‌ای ارزیابی */
          <div className="space-y-8">
            {/* هیرو بنر معرفی مدرن و مینیمال با عمق سه‌بعدی */}
            <div className="bg-[#11141d]/90 border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-md">
              <div className="max-w-3xl space-y-3.5 relative z-10">
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-3 py-1 rounded-full text-xs font-medium">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>طراحی اختصاصی برای متقاضیان ساکن ایران</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsRadarOpen(!isRadarOpen)}
                    className="inline-flex items-center gap-2 bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-300 border border-zinc-700/60 px-3 py-1 rounded-full text-xs font-medium transition cursor-pointer"
                  >
                    <Radio className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                    <span>رادار بخشنامه‌ها و وقت‌های سفارت ({isRadarOpen ? 'بستن' : 'مشاهده'})</span>
                  </button>
                </div>

                <h1 className="text-2xl sm:text-4xl font-black text-[#f3f4f6] tracking-tight leading-snug">
                  برنامه جامع مهاجرت شما از ایران، طراحی شده با هوش مصنوعی
                </h1>

                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-2xl">
                  اطلاعات تحصیلی، شغلی، سطح زبان و تمکن مالی خود را وارد کنید. هوش مصنوعی با در نظر گرفتن کلیه محدودیت‌های داخلی ایران (نظام وظیفه، سامانه سجاد و لغو تعهد رایگان، تمکن ریالی و چالش‌های وقت سفارت)، بهترین کشورها، مناسب‌ترین روش مهاجرتی و نقشه راه قدم‌به‌قدم از نقطه صفر تا فرودگاه را برای شما تدوین می‌کند.
                </p>
              </div>

              {/* کارت‌های نمونه آزمایشی سریع */}
              <div className="mt-6 pt-5 border-t border-white/[0.06]">
                <div className="text-xs font-semibold text-zinc-400 mb-2.5 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-indigo-400" />
                  <span>آزمون سریع با پروفایل‌های واقعی ایرانیان (یک کلیک برای تحلیل فوری):</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {SAMPLE_PROFILES.map((sample) => (
                    <button
                      key={sample.id}
                      onClick={() => handleQuickAnalyzeSample(sample)}
                      disabled={isLoading}
                      className="text-right p-3 rounded-xl bg-[#0c0f16]/90 hover:bg-[#141824] border border-white/[0.06] hover:border-indigo-500/40 transition-all duration-200 group flex items-center justify-between gap-2 shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-zinc-200 group-hover:text-indigo-300 flex items-center gap-1.5">
                          <span>{sample.icon}</span>
                          <span className="truncate">{sample.label}</span>
                        </div>
                        <div className="text-[10px] text-zinc-500 truncate mt-0.5">
                          {sample.description}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-indigo-400 flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* نوار مراحل فرم */}
            <StepIndicator
              currentStep={currentStep}
              onStepClick={handleStepNavigation}
            />

            {/* بدنه فرم مراحل */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-sm">
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
                  usdTomanRate={currency.usdToman}
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
        )}
      </main>

      {/* فوتر سامانه */}
      <footer className="border-t border-slate-850 bg-slate-950 py-6 text-center text-xs text-slate-400 no-print mt-12">
        <div className="max-w-6xl mx-auto px-4 space-y-2">
          <p className="font-medium text-slate-300">
            سامانه هوشمند «کوچ‌یار هوشمند (IraMigrate AI)» | راهنمای استراتژیک مهاجرت از ایران
          </p>
          <p className="text-[11px] text-slate-400">
            توجه: قوانین مهاجرتی کشورهای مختلف پیوسته در حال تغییر است. این سامانه با تلفیق آخرین قوانین رسمی و هوش مصنوعی، بهترین نقشه راه ممکن را تدوین می‌کند.
          </p>
          <div className="pt-2">
            <Link 
              href="/admin" 
              className="text-[11px] text-zinc-500 hover:text-indigo-400 transition inline-flex items-center gap-1 opacity-75 hover:opacity-100"
            >
              <span>ورود به پنل آمار و مدیریت متقاضیان (Admin)</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
