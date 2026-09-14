'use client';

import React, { useState } from 'react';
import { Compass, Key, Sparkles, RefreshCw, CheckCircle2 } from 'lucide-react';
import { SAMPLE_PROFILES, SampleProfileItem } from '@/data/sampleProfiles';

interface HeaderProps {
  onSelectSample: (sample: SampleProfileItem) => void;
  onReset: () => void;
  apiKey: string;
  onSaveApiKey: (key: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onSelectSample,
  onReset,
  apiKey,
  onSaveApiKey,
}) => {
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey);
  const [showSampleDropdown, setShowSampleDropdown] = useState(false);

  const handleSaveKey = () => {
    onSaveApiKey(tempKey);
    setShowKeyModal(false);
  };

  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo & Branding */}
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Compass className="w-7 h-7 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
                <span>کوچ‌یار هوشمند</span>
                <span className="text-xs bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-full font-mono font-medium">
                  AI 2.0
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              سامانه جامع ارزیابی و نقشه راه مهاجرت از ایران با تحلیل اختصاصی چالش‌ها
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sample Profiles Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSampleDropdown(!showSampleDropdown)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              title="بارگذاری نمونه‌های آماده برای تست سریع"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="hidden md:inline">نمونه‌های آماده</span>
              <span className="md:hidden">نمونه‌ها</span>
            </button>

            {showSampleDropdown && (
              <div className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-72 sm:w-80 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                <div className="text-xs font-semibold text-slate-400 px-3 py-1.5 border-b border-slate-800 mb-1">
                  انتخاب پروفایل پیش‌فرض برای تست سریع:
                </div>
                {SAMPLE_PROFILES.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => {
                      onSelectSample(sample);
                      setShowSampleDropdown(false);
                    }}
                    className="w-full text-right p-2.5 rounded-xl hover:bg-slate-800 flex items-start gap-2.5 transition text-slate-200 group"
                  >
                    <span className="text-xl bg-slate-800 group-hover:bg-slate-700 p-2 rounded-lg">{sample.icon}</span>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-white group-hover:text-indigo-400">
                        {sample.label}
                      </div>
                      <div className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                        {sample.description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Gemini API Key Setting Button */}
          <button
            onClick={() => setShowKeyModal(true)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-xl border transition ${
              apiKey
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title="تنظیم کلید هوش مصنوعی جمینای (اختیاری)"
          >
            <Key className="w-4 h-4" />
            <span className="hidden lg:inline">{apiKey ? 'کلید هوش مصنوعی فعال' : 'کلید Gemini (اختیاری)'}</span>
          </button>

          {/* Reset Button */}
          <button
            onClick={onReset}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition border border-transparent hover:border-slate-700"
            title="شروع مجدد و پاک کردن فرم"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl text-right animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">تنظیم کلید Gemini API</h3>
                <p className="text-xs text-slate-400">تحلیل زنده با جدیدترین مدل‌های گوگل جمینای</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4 bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
              سامانه دارای موتور هوشمند کارشناسی داخلی است و بدون کلید نیز به‌طور کامل و دقیق کار می‌کند. در صورت تمایل به دریافت تحلیل‌های متنی زنده‌تر با هوش مصنوعی جمینای، کلید API خود را وارد کنید.
            </p>

            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Google Gemini API Key:
            </label>
            <input
              type="password"
              value={tempKey}
              onChange={(e) => setTempKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition font-mono mb-4 text-left dir-ltr"
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowKeyModal(false)}
                className="px-4 py-2 text-xs font-medium rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
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
