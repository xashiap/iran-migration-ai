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
    <div className="w-full bg-[#08090d]/95 border-b border-white/[0.06] text-xs text-zinc-400 py-2 px-4 sm:px-6 lg:px-8 no-print backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
        {/* نرخ‌های زنده دلار و یورو با نشانگر TGJU */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-4">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-zinc-300 text-[11px]">نرخ لحظه‌ای ارز:</span>
          </div>

          {/* دلار */}
          <div className="flex items-center gap-1.5 bg-white/[0.03] px-2.5 py-0.5 rounded-md border border-white/[0.08]">
            <span className="text-zinc-400 text-[11px]">🇺🇸 ۱ دلار:</span>
            <span className="font-bold text-emerald-400 font-mono text-xs">
              {currency.formattedUsdToman}
            </span>
            <span className="text-[10px] text-zinc-500">تومان</span>
          </div>

          {/* یورو */}
          <div className="flex items-center gap-1.5 bg-white/[0.03] px-2.5 py-0.5 rounded-md border border-white/[0.08]">
            <span className="text-zinc-400 text-[11px]">🇪🇺 ۱ یورو:</span>
            <span className="font-bold text-cyan-400 font-mono text-xs">
              {currency.formattedEurToman}
            </span>
            <span className="text-[10px] text-zinc-500">تومان</span>
          </div>

          {/* منبع TGJU */}
          <a
            href={currency.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1 text-[10px] text-zinc-500 hover:text-zinc-300 transition"
            title="مشاهده مستقیم در سایت منبع TGJU.org"
          >
            <span>منبع: {currency.sourceName}</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>

        {/* دکمه‌های ماشین‌حساب و به‌روزرسانی */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowCalculator(!showCalculator)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md border transition text-[11px] cursor-pointer ${
              showCalculator
                ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-300'
                : 'bg-white/[0.03] hover:bg-white/[0.07] border-white/[0.08] text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Calculator className="w-3 h-3 text-indigo-400" />
            <span>ماشین‌حساب تمکن</span>
          </button>

          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] text-zinc-400 hover:text-zinc-200 transition text-[11px] disabled:opacity-50 cursor-pointer"
            title="به‌روزرسانی آنلاین آخرین قیمت از TGJU"
          >
            <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
            <span className="hidden sm:inline">به‌روزرسانی</span>
          </button>
        </div>
      </div>

      {/* پنجره تعاملی ماشین‌حساب تبدیل ارز */}
      {showCalculator && (
        <div className="max-w-7xl mx-auto mt-2 p-3 bg-[#0c0f17] border border-white/[0.08] rounded-xl animate-in fade-in zoom-in-95">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ArrowLeftRight className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-semibold text-zinc-200 text-xs">تبدیل سریع دلار به ریال/تومان برای اثبات تمکن مالی:</span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
              <div className="flex items-center gap-1 bg-[#08090d] border border-white/[0.1] rounded-lg px-2.5 py-1">
                <span className="text-zinc-500">$</span>
                <input
                  type="number"
                  min={1}
                  step={500}
                  value={calcUsdAmount}
                  onChange={(e) => setCalcUsdAmount(parseInt(e.target.value) || 0)}
                  className="w-20 bg-transparent text-white font-mono text-xs font-bold focus:outline-none text-left"
                />
                <span className="text-[10px] text-zinc-500">دلار</span>
              </div>

              <span className="text-zinc-600 font-bold">=</span>

              <div className="bg-white/[0.04] border border-white/[0.1] rounded-lg px-3 py-1 flex items-center gap-2">
                <span className="text-emerald-400 font-bold font-mono text-xs">
                  {calculatedToman.toLocaleString('fa-IR')}
                </span>
                <span className="text-zinc-400 text-[11px]">تومان</span>
                <span className="text-[10px] text-indigo-300 font-medium">
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
