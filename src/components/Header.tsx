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
    <header className="border-b border-white/[0.07] bg-[#0c0f16]/90 backdrop-blur-md sticky top-0 z-50 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo & Branding */}
        <div 
          onClick={onReset}
          className="flex items-center space-x-3 space-x-reverse cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-2xl bg-indigo-600 border border-white/10 flex items-center justify-center shadow-md shadow-indigo-600/20 group-hover:scale-105 transition">
            <Compass className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#f3f4f6] flex items-center gap-1.5">
                <span>کوچ‌یار هوشمند</span>
                <span className="text-[10px] bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-mono font-bold">
                  AI 2026
                </span>
              </h1>
            </div>
            <p className="text-xs text-zinc-400 hidden sm:block">
              سامانه جامع ارزیابی و نقشه راه مهاجرت از ایران با هوش مصنوعی
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live Immigration Radar Button */}
          {onToggleRadar && (
            <button
              onClick={onToggleRadar}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border transition cursor-pointer ${
                isRadarOpen
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/25'
                  : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 border-white/[0.08]'
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
              className="px-3.5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-600/25 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>شروع ارزیابی</span>
            </button>
          )}

          {/* Gemini API Key Setting Button (Minimal Icon Button) */}
          <button
            onClick={() => setShowKeyModal(true)}
            className={`p-2.5 rounded-xl border transition cursor-pointer ${
              apiKey
                ? 'bg-indigo-950/40 text-indigo-300 border-indigo-500/40'
                : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border-white/[0.06]'
            }`}
            title={apiKey ? 'کلید Gemini اختصاصی شما فعال است' : 'تنظیم کلید هوش مصنوعی اختصاصی (اختیاری)'}
          >
            <Key className="w-4 h-4" />
          </button>

          {/* Reset / Home Button */}
          {isWizardOpen && (
            <button
              onClick={onReset}
              className="p-2.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 rounded-xl transition border border-transparent hover:border-zinc-700/60 cursor-pointer"
              title="بازگشت به صفحه اول"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#11141d] border border-white/[0.1] rounded-2xl max-w-md w-full p-6 shadow-2xl text-right animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">تنظیم کلید هوش مصنوعی Google Gemini</h3>
                <p className="text-xs text-zinc-400">اتصال مستقیم به مدل‌های پرسرعت گوگل</p>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed mb-4 bg-[#0c0f16] p-3 rounded-xl border border-white/[0.06]">
              سامانه دارای الگوریتم کارشناسی داخلی است و بدون کلید نیز به‌طور کامل و دقیق کار می‌کند. در صورت تمایل به دریافت تحلیل‌های متنی زنده‌تر با هوش مصنوعی جمینای، کلید API خود را وارد کنید.
            </p>

            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Google Gemini API Key:
            </label>
            <input
              type="password"
              value={tempKey}
              onChange={(e) => setTempKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-[#0c0f16] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition font-mono mb-4 text-left dir-ltr"
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowKeyModal(false)}
                className="px-4 py-2 text-xs font-medium rounded-xl bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={handleSaveKey}
                className="px-4 py-2 text-xs font-medium rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition flex items-center gap-1.5"
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
