'use client';

import React, { useState } from 'react';
import { CurrencyData, convertUsdToTomanText } from '@/lib/currency';
import { RefreshCw, ExternalLink, Calculator, ArrowLeftRight } from 'lucide-react';

interface CurrencyBarProps {
  currency: CurrencyData;
  isLoading: boolean;
  onRefresh: () => void;
}

export const CurrencyBar: React.FC<CurrencyBarProps> = ({ currency, isLoading, onRefresh }) => {
  const [showCalculator, setShowCalculator] = useState(false);
  const [calcUsdAmount, setCalcUsdAmount] = useState<number>(10000);

  const calculatedToman = Math.round(calcUsdAmount * currency.usdToman);

  return (
    <div className="w-full bg-slate-900/90 border-b border-slate-800 text-xs text-slate-300 py-2.5 px-4 sm:px-6 lg:px-8 no-print backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* نرخ‌های زنده دلار و یورو با نشانگر TGJU */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-bold text-slate-200">نرخ زنده ارز:</span>
          </div>

          {/* دلار */}
          <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
            <span className="text-slate-400">🇺🇸 ۱ دلار:</span>
            <span className="font-bold text-emerald-400 font-mono text-xs sm:text-sm">
              {currency.formattedUsdToman}
            </span>
            <span className="text-[10px] text-slate-400">تومان</span>
          </div>

          {/* یورو */}
          <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
            <span className="text-slate-400">🇪🇺 ۱ یورو:</span>
            <span className="font-bold text-cyan-400 font-mono text-xs sm:text-sm">
              {currency.formattedEurToman}
            </span>
            <span className="text-[10px] text-slate-400">تومان</span>
          </div>

          {/* منبع TGJU */}
          <a
            href={currency.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1 text-[11px] text-slate-400 hover:text-indigo-400 transition"
            title="مشاهده مستقیم در سایت منبع TGJU.org"
          >
            <span>منبع: {currency.sourceName}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* دکمه‌های ماشین‌حساب و به‌روزرسانی */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowCalculator(!showCalculator)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition text-[11px] ${
              showCalculator
                ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300'
                : 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-300'
            }`}
          >
            <Calculator className="w-3.5 h-3.5 text-indigo-400" />
            <span>ماشین‌حساب تبدیل دلار</span>
          </button>

          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 transition text-[11px] disabled:opacity-50"
            title="به‌روزرسانی آنلاین آخرین قیمت از TGJU"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
            <span className="hidden sm:inline">به‌روزرسانی</span>
          </button>
        </div>
      </div>

      {/* پنجره تعاملی ماشین‌حساب تبدیل ارز */}
      {showCalculator && (
        <div className="max-w-7xl mx-auto mt-2.5 p-3 sm:p-4 bg-slate-950 border border-slate-800 rounded-2xl animate-in fade-in zoom-in-95">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ArrowLeftRight className="w-4 h-4 text-indigo-400" />
              <span className="font-bold text-white text-xs">تبدیل سریع دلار به تومان (با نرخ لحظه‌ای TGJU):</span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
              <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5">
                <span className="text-slate-400">$</span>
                <input
                  type="number"
                  min={1}
                  step={500}
                  value={calcUsdAmount}
                  onChange={(e) => setCalcUsdAmount(parseInt(e.target.value) || 0)}
                  className="w-24 bg-transparent text-white font-mono text-xs sm:text-sm font-bold focus:outline-none text-left"
                />
                <span className="text-[10px] text-slate-400">دلار</span>
              </div>

              <span className="text-slate-500 font-bold">=</span>

              <div className="bg-indigo-950/60 border border-indigo-500/40 rounded-xl px-3 py-1.5 flex items-center gap-2">
                <span className="text-emerald-400 font-bold font-mono text-xs sm:text-sm">
                  {calculatedToman.toLocaleString('fa-IR')}
                </span>
                <span className="text-slate-300 text-xs">تومان</span>
                <span className="text-[11px] text-indigo-300 font-medium">
                  ({convertUsdToTomanText(calcUsdAmount, currency.usdToman)})
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
