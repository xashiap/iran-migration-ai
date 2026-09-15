'use client';

import React from 'react';

/**
 * تم مینیمال، مدرن و سه‌بعدی (Minimalist Modern 3D Theme)
 * - تعداد رنگ بسیار محدود (پالت مونوکروم مشکی/گرافیتی/زینک با یک رنگ مکمل نیلی ملایم)
 * - المان‌های ژئومتریک سه‌بعدی و ایزومتریک در ۴ گوشه صفحه با خطوط مدرن
 * - بهینه‌سازی شده برای جلوگیری از خستگی چشم در گوشی و مانیتور
 * - کاملاً سبک، بدون لگ و با قابلیت هماهنگی در سایزهای مختلف نمایشگر
 */
export const ThreeDimensionalDecorations: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none" aria-hidden="true">
      {/* ۱. صفحه پرسپکتیو سه‌بعدی مینیمال در پس‌زمینه (شبکه هندسی با افق نرم) */}
      <div 
        className="absolute inset-0 opacity-[0.03] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_40%,#000_60%,transparent_100%)]"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          transform: 'perspective(900px) rotateX(28deg) translateY(-50px)',
          transformOrigin: 'center top',
        }}
      />

      {/* ۲. تک‌نور امبینت بسیار ملایم در بالای صفحه (تک‌رنگ، بدون آزار چشم) */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-indigo-600/[0.04] rounded-full blur-3xl" />

      {/* ==============================================================
          گوشه ۱: بالا - راست (مکعب ایزومتریک خطی سه‌بعدی)
          نمایش در دسکتاپ و موبایل (در موبایل کوچک‌تر و بدون تداخل با محتوا)
          ============================================================== */}
      <div className="absolute top-16 right-3 sm:top-24 sm:right-10 opacity-30 sm:opacity-40 transition-opacity">
        <div className="w-14 h-14 sm:w-20 sm:h-20 [perspective:800px]">
          <div 
            className="w-full h-full relative [transform-style:preserve-3d] animate-float-slow"
            style={{ transform: 'rotateX(30deg) rotateY(-45deg)' }}
          >
            {/* وجه پایه مکعب */}
            <div className="absolute inset-0 border border-zinc-600/60 rounded-xl bg-zinc-900/30 shadow-lg shadow-black/40" />
            {/* وجه معلق بالاتر با عمق سه‌بعدی */}
            <div 
              className="absolute inset-1.5 sm:inset-2 border border-indigo-400/40 rounded-lg bg-indigo-950/10"
              style={{ transform: 'translateZ(20px)' }}
            />
            {/* خطوط اتصال‌دهنده پرسپکتیو */}
            <div 
              className="absolute w-2 h-2 rounded-full bg-indigo-400/60"
              style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%) translateZ(28px)' }}
            />
          </div>
        </div>
      </div>

      {/* ==============================================================
          گوشه ۲: بالا - چپ (مدار و حلقه ژیروسکوپی ایزومتریک سه‌بعدی)
          ============================================================== */}
      <div className="absolute top-16 left-3 sm:top-24 sm:left-10 opacity-25 sm:opacity-35 transition-opacity">
        <div className="w-14 h-14 sm:w-20 sm:h-20 [perspective:800px]">
          <div 
            className="w-full h-full relative [transform-style:preserve-3d] animate-float-reverse"
            style={{ transform: 'rotateX(55deg) rotateZ(20deg)' }}
          >
            {/* حلقه بیرونی */}
            <div className="w-full h-full rounded-full border border-zinc-600/60 shadow-sm" />
            {/* حلقه داخلی با زاویه سه‌بعدی معکوس */}
            <div 
              className="absolute inset-2 sm:inset-3 rounded-full border border-dashed border-zinc-500/50"
              style={{ transform: 'translateZ(12px) rotateY(25deg)' }}
            />
            {/* نقطه کانونی */}
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-zinc-400/50"
              style={{ transform: 'translateZ(18px)' }}
            />
          </div>
        </div>
      </div>

      {/* ==============================================================
          گوشه ۳: پایین - راست (صفحه پله‌ای ژئومتریک سه‌بعدی)
          ============================================================== */}
      <div className="absolute bottom-16 right-3 sm:bottom-20 sm:right-10 opacity-25 sm:opacity-35 transition-opacity">
        <div className="w-14 h-14 sm:w-18 sm:h-18 [perspective:700px]">
          <div 
            className="w-full h-full relative [transform-style:preserve-3d] animate-float-reverse"
            style={{ transform: 'rotateX(40deg) rotateY(35deg)' }}
          >
            {/* لایه پایه */}
            <div className="absolute inset-0 border border-zinc-700/60 rounded-xl bg-zinc-900/20" />
            {/* لایه میانی با عمق سه‌بعدی */}
            <div 
              className="absolute inset-2 border border-zinc-600/50 rounded-lg"
              style={{ transform: 'translateZ(14px)' }}
            />
            {/* لایه بالایی نیلی ملایم */}
            <div 
              className="absolute inset-4 border border-indigo-400/40 rounded-md"
              style={{ transform: 'translateZ(24px)' }}
            />
          </div>
        </div>
      </div>

      {/* ==============================================================
          گوشه ۴: پایین - چپ (منشور و نگین لوزی سه‌بعدی مینیمال)
          ============================================================== */}
      <div className="absolute bottom-16 left-3 sm:bottom-20 sm:left-10 opacity-25 sm:opacity-35 transition-opacity">
        <div className="w-14 h-14 sm:w-18 sm:h-18 [perspective:700px]">
          <div 
            className="w-full h-full relative [transform-style:preserve-3d] animate-float-slow"
            style={{ transform: 'rotateX(35deg) rotateZ(45deg)' }}
          >
            <div className="absolute inset-0 border border-zinc-600/60 rounded-lg bg-zinc-900/20 shadow-md" />
            <div 
              className="absolute inset-2 border border-zinc-500/40 rounded-md"
              style={{ transform: 'translateZ(16px)' }}
            />
            <div 
              className="absolute inset-3 border border-indigo-400/30 rounded-sm"
              style={{ transform: 'translateZ(26px)' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
