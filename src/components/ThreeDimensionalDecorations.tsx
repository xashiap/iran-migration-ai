'use client';

import React from 'react';

/**
 * المان‌های سه‌بعدی و بلورین در ۴ گوشه صفحه
 * طراحی شده به صورت سبک، نرم، چشم‌نواز با جلوه گلس‌مورفیسم
 * غیرمزاحم (pointer-events-none) با تطابق کامل در موبایل و دسکتاپ
 */
export const ThreeDimensionalDecorations: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* -------------------------------------------------------------
          گوشه ۱: بالا - راست (مکعب منشوری شیشه‌ای ۳بعدی شناور)
          ------------------------------------------------------------- */}
      <div className="absolute -top-6 -right-6 sm:top-6 sm:right-6 opacity-60 sm:opacity-75 animate-float-slow">
        <div className="relative w-28 h-28 sm:w-36 sm:h-36 [perspective:800px]">
          <div className="w-full h-full relative [transform-style:preserve-3d] rotate-12 hover:rotate-45 transition-transform duration-700">
            {/* وجه جلویی شیشه‌ای */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/20 via-slate-800/40 to-cyan-500/10 backdrop-blur-md border border-white/15 shadow-[0_15px_35px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500/30 to-cyan-400/20 border border-white/20 transform rotate-45 shadow-inner" />
            </div>

            {/* لایه پرسپکتیو عقبی */}
            <div className="absolute inset-1 rounded-2xl border border-indigo-400/20 transform -translate-z-6 -rotate-6" />

            {/* هاله نور ملایم پشت المان */}
            <div className="absolute -inset-4 bg-indigo-600/15 rounded-full blur-2xl -z-10" />
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------
          گوشه ۲: بالا - چپ (کره ژئودزیک / رینگ قطب‌نمای ۳بعدی مهاجرت)
          ------------------------------------------------------------- */}
      <div className="absolute -top-8 -left-8 sm:top-8 sm:left-8 opacity-50 sm:opacity-70 animate-float-reverse">
        <div className="relative w-32 h-32 sm:w-40 sm:h-40 [perspective:800px]">
          <div className="w-full h-full relative flex items-center justify-center [transform-style:preserve-3d] -rotate-12">
            {/* حلقه بیرونی ۳بعدی */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-dashed border-cyan-400/30 animate-spin-very-slow" />

            {/* کره شیشه‌ای مرکزی با شکست نور */}
            <div className="absolute w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-slate-900/80 via-indigo-950/50 to-cyan-400/20 backdrop-blur-lg border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.3)] flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-cyan-400/30 blur-xs animate-pulse" />
            </div>

            {/* مدار بیضوی شناور */}
            <div className="absolute w-28 h-10 border border-indigo-400/30 rounded-[100%] transform rotate-45" />

            {/* هاله نور فیروزه‌ای ملایم */}
            <div className="absolute -inset-4 bg-cyan-500/10 rounded-full blur-2xl -z-10" />
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------
          گوشه ۳: پایین - راست (لوزی / منشور ۳بعدی کریستالی)
          ------------------------------------------------------------- */}
      <div className="absolute -bottom-8 -right-8 sm:bottom-10 sm:right-10 opacity-50 sm:opacity-70 animate-float-slow">
        <div className="relative w-32 h-32 sm:w-40 sm:h-40 [perspective:900px]">
          <div className="w-full h-full relative [transform-style:preserve-3d] rotate-45">
            {/* منشور شیشه‌ای دولایه */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-bl from-indigo-600/20 via-slate-900/60 to-purple-600/15 backdrop-blur-md border border-white/15 shadow-[0_20px_40px_rgba(0,0,0,0.6),inset_0_1px_2px_rgba(255,255,255,0.25)] mx-auto mt-4" />
            
            {/* لایه انعکاس خطی */}
            <div className="absolute inset-4 rounded-2xl border border-purple-400/20 transform -translate-x-2 -translate-y-2" />

            {/* هاله نور بنفش تیره آرامش‌بخش */}
            <div className="absolute -inset-4 bg-purple-600/10 rounded-full blur-3xl -z-10" />
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------
          گوشه ۴: پایین - چپ (سپر محافظتی ۳بعدی و ژئومتریک شیشه‌ای)
          ------------------------------------------------------------- */}
      <div className="absolute -bottom-8 -left-8 sm:bottom-10 sm:left-10 opacity-55 sm:opacity-75 animate-float-reverse">
        <div className="relative w-28 h-28 sm:w-36 sm:h-36 [perspective:800px]">
          <div className="w-full h-full relative [transform-style:preserve-3d] -rotate-6">
            {/* صفحات شیشه‌ای لایه‌لایه با پرسپکتیو */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-slate-900/90 via-indigo-900/30 to-emerald-400/15 backdrop-blur-md border border-white/15 shadow-[0_15px_35px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center transform rotate-6">
              <div className="w-8 h-8 rounded-lg border border-emerald-400/30 bg-emerald-500/10 rotate-12" />
            </div>

            {/* بازتاب زیرین */}
            <div className="absolute inset-2 rounded-2xl border border-indigo-400/20 transform translate-x-2 translate-y-2 -z-10" />

            {/* هاله نور زمردی/نیلی بسیار ملایم */}
            <div className="absolute -inset-4 bg-emerald-500/10 rounded-full blur-2xl -z-10" />
          </div>
        </div>
      </div>

      {/* گرادیان پس‌زمینه بسیار نرم برای خستگی‌ناپذیری چشم */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.12),rgba(255,255,255,0))] pointer-events-none" />
    </div>
  );
};
