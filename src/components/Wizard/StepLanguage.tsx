'use client';

import React, { useState } from 'react';
import { UserProfile, EnglishGeneralLevel, EnglishExamType, LanguageLevel } from '@/types/migration';
import { Flame, Check, Sparkles, CheckCircle2, Award } from 'lucide-react';
import { LanguageQuizModal } from './LanguageQuizModal';
import { QuizResultData } from '@/data/languageQuizData';

interface StepLanguageProps {
  profile: UserProfile;
  onChange: (updated: UserProfile) => void;
  onPrev: () => void;
  onNext: () => void;
}

export const StepLanguage: React.FC<StepLanguageProps> = ({ profile, onChange, onPrev, onNext }) => {
  const lang = profile.languages;
  const [isQuizOpen, setIsQuizOpen] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const update = (fields: Partial<UserProfile['languages']>) => {
    onChange({
      ...profile,
      languages: {
        ...profile.languages,
        ...fields,
      },
    });
  };

  const handleApplyQuizResult = (result: QuizResultData) => {
    const updates: Partial<UserProfile['languages']> = {};
    if (result.formFieldsToUpdate.englishLevel) {
      updates.englishLevel = result.formFieldsToUpdate.englishLevel;
    }
    if (result.formFieldsToUpdate.englishExam) {
      updates.englishExam = result.formFieldsToUpdate.englishExam;
    }
    if (result.formFieldsToUpdate.englishScore !== undefined) {
      updates.englishScore = result.formFieldsToUpdate.englishScore;
    }
    if (result.formFieldsToUpdate.germanLevel) {
      updates.germanLevel = result.formFieldsToUpdate.germanLevel;
    }
    if (result.formFieldsToUpdate.frenchLevel) {
      updates.frenchLevel = result.formFieldsToUpdate.frenchLevel;
    }
    if (result.formFieldsToUpdate.italianLevel) {
      updates.italianLevel = result.formFieldsToUpdate.italianLevel;
    }

    update(updates);
    setSuccessMessage(`کارنامه آزمون (${result.levelLabelFa}) با موفقیت در فرم شما اعمال شد.`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <span>مرحله ۴: سطح زبان‌های خارجی و مدارک بین‌المللی</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          مدرک زبان، موتور محرک پرونده مهاجرتی است. حتی داشتن مدرک مقدماتی A1 آلمانی یا آیلتس عمومی، مسیرهای متعددی را باز می‌کند.
        </p>
      </div>

      {/* اعلان موفقیت ثبت سطح زبان از طریق کوییز */}
      {successMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-400 hover:text-white text-xs underline mr-2"
          >
            بستن
          </button>
        </div>
      )}

      {/* بنر جذاب آزمون هوشمند تعیین سطح زبان */}
      <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl relative overflow-hidden">
        <div className="flex items-start sm:items-center gap-3 relative z-10">
          <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center flex-shrink-0 shadow-inner">
            <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-bold text-white">
                سطح دقیق زبان خود را نمی‌دانید؟
              </h3>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-bold">
                ۴ زبان: 🇬🇧 🇩🇪 🇫🇷 🇮🇹
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              در کوییز ۱۵ سوالی تصادفی شرکت کنید تا سیستم سطح استاندارد اروپایی (CEFR) شما را تشخیص دهد و فرم را خودکار پر کند.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsQuizOpen(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold rounded-xl transition shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 flex-shrink-0 cursor-pointer"
        >
          <Award className="w-4 h-4 text-amber-300" />
          <span>شروع کوییز تعیین سطح هوشمند</span>
        </button>
      </div>

      {/* سطح انگلیسی عمومی */}
      <div className="bg-slate-900/60 border border-slate-800 p-4 sm:p-5 rounded-2xl space-y-3">
        <label className="block text-xs font-semibold text-slate-300 mb-1">
          سطح کلی زبان انگلیسی شما (ارزیابی شخصی):
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[
            { id: 'basic', label: 'مقدماتی (A1/A2)', desc: 'مکالمات بسیار ساده' },
            { id: 'intermediate', label: 'متوسط (B1/B2)', desc: 'فهم متون، مکالمه کاری نسبی' },
            { id: 'advanced', label: 'پیشرفته (C1)', desc: 'تسلط روان، نوشتن مقالات' },
            { id: 'fluent', label: 'بسیار مسلط (Fluent)', desc: 'نزدیک به سطح زبان مادری' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => update({ englishLevel: item.id as EnglishGeneralLevel })}
              className={`p-3 rounded-xl border text-right transition ${
                lang.englishLevel === item.id
                  ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                  : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/40'
              }`}
            >
              <div className="text-xs sm:text-sm font-bold flex items-center justify-between">
                <span>{item.label}</span>
                {lang.englishLevel === item.id && <Check className="w-3.5 h-3.5 text-indigo-400" />}
              </div>
              <div className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">{item.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* مدارک رسمی زبان انگلیسی */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">مدرک آزمون زبان انگلیسی رسمی:</label>
          <select
            value={lang.englishExam}
            onChange={(e) => update({ englishExam: e.target.value as EnglishExamType })}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition"
          >
            <option value="none">هنوز آزمون نداده‌ام / مدرک رسمی ندارم</option>
            <option value="ielts">IELTS (آکادمیک یا جنرال)</option>
            <option value="toefl">TOEFL iBT</option>
            <option value="duolingo">Duolingo English Test (DET)</option>
            <option value="pte">PTE Academic</option>
          </select>
        </div>

        {lang.englishExam !== 'none' && (
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">نمره کلی کارنامه شما (Overall Score):</label>
            <input
              type="text"
              value={lang.englishScore}
              onChange={(e) => update({ englishScore: e.target.value })}
              placeholder="مثال: 7.0 یا 95 یا 120"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>
        )}
      </div>

      {/* زبان‌های دوم (آلمانی، فرانسه، ایتالیایی) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* آلمانی */}
        <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <span>🇩🇪 زبان آلمانی</span>
              <span className="text-[10px] text-amber-400 font-normal">کلید آلمان و اتریش</span>
            </span>
          </div>
          <select
            value={lang.germanLevel}
            onChange={(e) => update({ germanLevel: e.target.value as LanguageLevel })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="none">بلد نیستم (سطح صفر)</option>
            <option value="a1_a2">مقدماتی (A1 یا A2)</option>
            <option value="b1">متوسط کاربردی (B1) - مناسب کار</option>
            <option value="b2">پیشرفته (B2) - دانشگاهی و کاری</option>
            <option value="c1_c2">بسیار مسلط (C1 یا C2)</option>
          </select>
        </div>

        {/* فرانسوی */}
        <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <span>🇫🇷 زبان فرانسوی</span>
              <span className="text-[10px] text-cyan-400 font-normal">امتیاز طلایی کانادا</span>
            </span>
          </div>
          <select
            value={lang.frenchLevel}
            onChange={(e) => update({ frenchLevel: e.target.value as LanguageLevel })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="none">بلد نیستم (سطح صفر)</option>
            <option value="a1_a2">مقدماتی (A1 یا A2)</option>
            <option value="b1">متوسط (B1)</option>
            <option value="b2">پیشرفته (B2 - کلید دراو فرانسه کانادا)</option>
            <option value="c1_c2">بسیار مسلط (C1 یا C2)</option>
          </select>
        </div>

        {/* ایتالیایی یا سایر */}
        <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <span>🇮🇹 زبان ایتالیایی</span>
            </span>
          </div>
          <select
            value={lang.italianLevel}
            onChange={(e) => update({ italianLevel: e.target.value as LanguageLevel })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="none">بلد نیستم (سطح صفر)</option>
            <option value="a1_a2">مقدماتی (A1 یا A2)</option>
            <option value="b1">متوسط (B1)</option>
            <option value="b2">پیشرفته (B2)</option>
          </select>
        </div>
      </div>

      {/* تمایل به یادگیری زبان جدید */}
      <label className="flex items-start gap-3 p-3.5 rounded-xl border bg-slate-900/60 border-slate-800 cursor-pointer hover:bg-slate-850 transition">
        <input
          type="checkbox"
          checked={lang.willingToLearnNewLanguage}
          onChange={(e) => update({ willingToLearnNewLanguage: e.target.checked })}
          className="mt-1 w-4 h-4 rounded accent-indigo-500"
        />
        <div>
          <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-1">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>آمادگی دارم روزانه ۱ تا ۳ ساعت برای یادگیری زبان کشور مقصد وقت بگذارم</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            این تعهد مسیرهای پرطرفداری مانند کارت شانس آلمان، اتریش و دراوهای فرانسوی کانادا را در دسترس شما قرار می‌دهد.
          </div>
        </div>
      </label>

      <div className="flex justify-between pt-2">
        <button
          type="button"
          onClick={onPrev}
          className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs sm:text-sm font-semibold transition"
        >
          → مرحله قبل
        </button>
        <button
          type="button"
          onClick={onNext}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs sm:text-sm font-bold transition shadow-lg shadow-indigo-600/20"
        >
          مرحله بعد: تمکن و بودجه مالی ←
        </button>
      </div>

      {/* مودال کوییز تعیین سطح هوشمند */}
      <LanguageQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onApplyResult={handleApplyQuizResult}
      />
    </div>
  );
};
