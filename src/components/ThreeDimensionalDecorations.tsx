'use client';

import React from 'react';

/**
 * AuthKit by WorkOS Design Canvas:
 * - Theatrical Spotlights: Multiple soft gradient light cones radiating from the top
 * - Hairline Orthogonal Grid: Precision 1px grid guides fading into dark space
 * - Dot Matrix Grid: 28px radial dot pattern
 * - Corner Crosshairs: Distinctive AuthKit '+' cross markers at grid intersections
 */
export const ThreeDimensionalDecorations: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none" aria-hidden="true">
      {/* ۱. کانوای ماتریس نقطه‌ای سبک AuthKit (Dot Matrix Overlay) */}
      <div 
        className="absolute inset-0 opacity-[0.45]"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.09) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(ellipse 90% 70% at 50% 20%, #000 40%, transparent 95%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 50% 20%, #000 40%, transparent 95%)',
        }}
      />

      {/* ۲. نورافکن‌های تئاتری بالا (Theatrical Spotlights - AuthKit Signature) */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[650px] overflow-hidden">
        {/* مخروط نوری چپ (-18deg) */}
        <div 
          className="absolute top-0 left-1/2 w-[520px] h-[600px] origin-top opacity-35"
          style={{
            transform: 'translateX(-65%) rotate(-18deg)',
            background: 'conic-gradient(from 180deg at 50% 0%, transparent 35%, rgba(99, 102, 241, 0.15) 50%, transparent 65%)',
            filter: 'blur(30px)',
          }}
        />

        {/* مخروط نوری مرکزی (0deg) */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[550px] opacity-45"
          style={{
            background: 'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(129, 140, 248, 0.18), transparent 70%)',
            filter: 'blur(25px)',
          }}
        />

        {/* مخروط نوری راست (+18deg) */}
        <div 
          className="absolute top-0 left-1/2 w-[520px] h-[600px] origin-top opacity-35"
          style={{
            transform: 'translateX(-35%) rotate(18deg)',
            background: 'conic-gradient(from 180deg at 50% 0%, transparent 35%, rgba(168, 85, 247, 0.12) 50%, transparent 65%)',
            filter: 'blur(30px)',
          }}
        />
      </div>

      {/* ۳. خطوط مویی هدایت‌کننده مدرن AuthKit (Hairline Grid Lines) */}
      <div className="absolute inset-0 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* خط راهنمای عمودی چپ */}
        <div className="absolute left-6 top-0 bottom-0 w-[1px] bg-gradient-to-b from-white/[0.08] via-white/[0.04] to-transparent hidden md:block" />
        {/* خط راهنمای عمودی راست */}
        <div className="absolute right-6 top-0 bottom-0 w-[1px] bg-gradient-to-b from-white/[0.08] via-white/[0.04] to-transparent hidden md:block" />
      </div>

      {/* ۴. نشانگرهای مثبت تلاقی AuthKit (+ Crosshairs) در نقاط کلیدی */}
      <div className="absolute top-28 left-8 sm:left-16 text-zinc-600/70 font-mono text-xs select-none hidden sm:block">
        +
      </div>
      <div className="absolute top-28 right-8 sm:right-16 text-zinc-600/70 font-mono text-xs select-none hidden sm:block">
        +
      </div>
      <div className="absolute top-[480px] left-12 sm:left-24 text-zinc-700/60 font-mono text-xs select-none hidden md:block">
        +
      </div>
      <div className="absolute top-[480px] right-12 sm:right-24 text-zinc-700/60 font-mono text-xs select-none hidden md:block">
        +
      </div>
    </div>
  );
};
