'use client';

import React, { useState } from 'react';
import { Compass, Key, RefreshCw, CheckCircle2, Radio, Sparkles } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  apiKey: string;
  onSaveApiKey: (key: string) => void;
  onToggleRadar?: () => void;
  isRadarOpen?: boolean;
  onStartAssessment?: () => void;
  isWizardOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onReset,
  apiKey,
  onSaveApiKey,
  onToggleRadar,
  isRadarOpen,
  onStartAssessment,
  isWizardOpen,
}) => {
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey);

  const handleSaveKey = () => {
    onSaveApiKey(tempKey);
    setShowKeyModal(false);
  };

  return (
    <header className="border-b border-white/[0.08] bg-[#08090d]/85 backdrop-blur-xl sticky top-0 z-50 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Logo & Branding - AuthKit Style */}
        <div 
          onClick={onReset}
          className="flex items-center space-x-3 space-x-reverse cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.12] flex items-center justify-center shadow-inner group-hover:border-white/25 transition">
            <Compass className="w-5 h-5 text-indigo-400 group-hover:rotate-45 transition duration-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                <span>کوچ‌یار هوشمند</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full border border-white/10 bg-white/[0.04] text-zinc-300 font-mono">
                  v3.5
                </span>
              </h1>
            </div>
            <p className="text-[11px] text-zinc-400 hidden sm:block">
              سامانه هوشمند ارزیابی و نقشه راه مهاجرت از ایران
            </p>
          </div>
        </div>

        {/* Action Controls - AuthKit Style Pill Buttons */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Live Immigration Radar Button */}
          {onToggleRadar && (
            <button
              onClick={onToggleRadar}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition cursor-pointer ${
                isRadarOpen
                  ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/50 shadow-sm'
                  : 'bg-white/[0.03] hover:bg-white/[0.07] text-zinc-300 border-white/[0.08]'
              }`}
              title="رادار زنده اخبار، بورسیه‌ها و جاب‌آفرهای جهان"
            >
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="hidden sm:inline">رادار فرصت‌های روز</span>
              <span className="sm:hidden">رادار</span>
            </button>
          )}

          {/* Quick CTA to start assessment if not already started */}
          {onStartAssessment && !isWizardOpen && (
            <button
              onClick={onStartAssessment}
              className="px-3.5 py-1.5 bg-white text-zinc-950 hover:bg-zinc-200 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,255,255,0.12)] cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>شروع ارزیابی</span>
            </button>
          )}

          {/* Gemini API Key Setting Button */}
          <button
            onClick={() => setShowKeyModal(true)}
            className={`p-2 rounded-lg border transition cursor-pointer ${
              apiKey
                ? 'bg-indigo-950/40 text-indigo-300 border-indigo-500/40'
                : 'bg-white/[0.03] hover:bg-white/[0.07] text-zinc-400 hover:text-zinc-200 border-white/[0.08]'
            }`}
            title={apiKey ? 'کلید Gemini اختصاصی شما فعال است' : 'تنظیم کلید هوش مصنوعی اختصاصی (اختیاری)'}
          >
            <Key className="w-4 h-4" />
          </button>

          {/* Reset / Home Button */}
          {isWizardOpen && (
            <button
              onClick={onReset}
              className="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.05] rounded-lg transition border border-transparent hover:border-white/[0.08] cursor-pointer"
              title="بازگشت به صفحه اول"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* API Key Modal - AuthKit Style */}
      {showKeyModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="relative authkit-card rounded-2xl max-w-md w-full p-6 shadow-2xl text-right animate-in fade-in zoom-in-95">
            {/* Crosshairs */}
            <span className="authkit-crosshair top-3 left-3">+</span>
            <span className="authkit-crosshair top-3 right-3">+</span>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.1] text-indigo-400 flex items-center justify-center">
                <Key className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">تنظیم کلید هوش مصنوعی Google Gemini</h3>
                <p className="text-[11px] text-zinc-400">اتصال مستقیم به مدل‌های پردازش زبان گوگل</p>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed mb-4 bg-black/30 p-3 rounded-xl border border-white/[0.06]">
              سامانه به موتور کارشناسی داخلی مجهز است و بدون کلید نیز تحلیل کامل و دقیق ارائه می‌دهد. وارد کردن کلید API جمینای اختیاری است.
            </p>

            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Google Gemini API Key:
            </label>
            <input
              type="password"
              value={tempKey}
              onChange={(e) => setTempKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-[#090b10] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition font-mono mb-4 text-left dir-ltr"
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowKeyModal(false)}
                className="px-3.5 py-2 text-xs font-medium rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-zinc-300 border border-white/[0.08] transition cursor-pointer"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={handleSaveKey}
                className="px-4 py-2 text-xs font-bold rounded-xl authkit-button-primary transition flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                ذخیره تنظیمات
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
