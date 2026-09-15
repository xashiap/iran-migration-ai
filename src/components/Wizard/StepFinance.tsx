'use client';

import React from 'react';
import { UserProfile } from '@/types/migration';
import { Landmark, Sparkles, TrendingUp } from 'lucide-react';
import { convertUsdToTomanText } from '@/lib/currency';

interface StepFinanceProps {
  profile: UserProfile;
  onChange: (updated: UserProfile) => void;
  onPrev: () => void;
  onNext: () => void;
  usdTomanRate?: number;
}

export const StepFinance: React.FC<StepFinanceProps> = ({ 
  profile, 
  onChange, 
  onPrev, 
  onNext,
  usdTomanRate = 231300
}) => {
  const fin = profile.finances;

  const update = (fields: Partial<UserProfile['finances']>) => {
    onChange({
      ...profile,
      finances: {
        ...profile.finances,
        ...fields,
      },
    });
  };

  // قالب‌بندی اعداد به تومان
  const formatToman = (val: number) => {
    if (val >= 1000000000) {
      return `${(val / 1000000000).toFixed(1)} میلیارد تومان`;
    }
    return `${Math.round(val / 1000000)} میلیون تومان`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <span>مرحله ۵: سرمایه، بودجه ارزی و تمکن مالی در ایران</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          تمکن مالی یکی از مهم‌ترین ستون‌های دریافت ویزاست. مبالغ دلاری با نرخ لحظه‌ای TGJU به تومان محاسبه می‌شوند.
        </p>
      </div>

      {/* بودجه نقدی ارزی در دسترس */}
      <div className="bg-slate-900/60 border border-slate-800 p-4 sm:p-5 rounded-2xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="block text-xs font-semibold text-slate-300">
            کل سرمایه نقدی که می‌توانید برای مهاجرت هزینه کنید (معادل دلاری):
          </label>
          <span className="text-[11px] text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            محاسبه با دلار روز: {usdTomanRate.toLocaleString('fa-IR')} تومان
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={1000}
            max={50000}
            step={1000}
            value={fin.liquidBudgetUSD}
            onChange={(e) => update({ liquidBudgetUSD: parseInt(e.target.value) })}
            className="w-full accent-indigo-500 bg-slate-800 rounded-lg cursor-pointer h-2.5"
          />
          <div className="w-28 bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-center text-sm font-bold text-emerald-400 font-mono flex-shrink-0">
            ${fin.liquidBudgetUSD.toLocaleString()}
          </div>
        </div>

        {/* معادل تومانی زنده بر اساس نرخ TGJU */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 flex items-center justify-between">
          <span className="text-xs text-slate-400">معادل تومانی به نرخ زنده TGJU:</span>
          <span className="text-xs sm:text-sm font-bold text-emerald-400 font-mono">
            {convertUsdToTomanText(fin.liquidBudgetUSD, usdTomanRate)}
          </span>
        </div>

        {/* بازه‌های بودجه پیشنهادی */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
          {[
            { amount: 4000, label: 'زیر ۵ هزار دلار', desc: convertUsdToTomanText(4000, usdTomanRate) },
            { amount: 10000, label: '۱۰ هزار دلار', desc: convertUsdToTomanText(10000, usdTomanRate) },
            { amount: 15000, label: '۱۵ هزار دلار', desc: convertUsdToTomanText(15000, usdTomanRate) },
            { amount: 30000, label: 'بالای ۲۵ هزار دلار', desc: convertUsdToTomanText(30000, usdTomanRate) },
          ].map((b) => (
            <button
              key={b.amount}
              type="button"
              onClick={() => update({ liquidBudgetUSD: b.amount })}
              className={`p-2.5 rounded-xl border text-right transition ${
                fin.liquidBudgetUSD === b.amount
                  ? 'bg-emerald-500/15 border-emerald-500 text-white'
                  : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:bg-slate-800/40'
              }`}
            >
              <div className="text-xs font-bold text-slate-200">{b.label}</div>
              <div className="text-[10px] text-emerald-400 font-mono mt-0.5 truncate">{b.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* بخش تمکن بانکی در ایران */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 sm:p-5 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
            <Landmark className="w-5 h-5" />
            <span>گواهی تمکن مالی و گردش حساب در بانک‌های ایران (Bank Statement)</span>
          </div>
          <span className="text-[11px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-300">مهر بین‌الملل</span>
        </div>

        <label className="flex items-start gap-3 p-3 rounded-xl border bg-slate-950/60 border-slate-800 cursor-pointer hover:bg-slate-800/40 transition">
          <input
            type="checkbox"
            checked={fin.canProvideBankStatement}
            onChange={(e) => update({ canProvideBankStatement: e.target.checked })}
            className="mt-1 w-4 h-4 rounded accent-indigo-500"
          />
          <div>
            <div className="text-xs sm:text-sm font-bold text-white">
              امکان ارائه گواهی رسمی تمکن و گردش حساب از بانک ایرانی را دارم
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              نامه رسمی انگلیسی از بانک‌های ملی، ملت، پاسارگاد، پارسیان و... با درج نرخ برابری ارز
            </div>
          </div>
        </label>

        {fin.canProvideBankStatement && (
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              موجودی ریالی قابل اثبات در حساب (به تومان):
              <span className="text-amber-400 font-bold mr-2 font-mono">
                {formatToman(fin.bankStatementAmountToman)}
              </span>
            </label>
            <input
              type="range"
              min={100000000}
              max={3000000000}
              step={50000000}
              value={fin.bankStatementAmountToman}
              onChange={(e) => update({ bankStatementAmountToman: parseInt(e.target.value) })}
              className="w-full accent-amber-500 bg-slate-800 rounded-lg cursor-pointer h-2"
            />
          </div>
        )}
      </div>

      {/* نیاز به بورسیه یا تحصیل رایگان */}
      <label className="flex items-start gap-3 p-3.5 rounded-xl border bg-slate-900 border-slate-800 cursor-pointer hover:bg-slate-850 transition">
        <input
          type="checkbox"
          checked={fin.needsScholarshipOrFreeTuition}
          onChange={(e) => update({ needsScholarshipOrFreeTuition: e.target.checked })}
          className="mt-1 w-4 h-4 rounded accent-indigo-500"
        />
        <div>
          <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>نیاز مبرم به بورسیه استانی (مثل DSU ایتالیا) یا تحصیل کاملاً رایگان دارم</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
            در صورت تیک زدن، الگوریتم کشورهایی مانند ایتالیا (که بورسیه استانی سالانه ۷ تا ۸ هزار یورویی برای خانواده‌های ایرانی پرداخت می‌کند) و دانشگاه‌های دولتی آلمان و فرانسه را در اولویت اول پیشنهاد می‌دهد.
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
          مرحله بعد: اولویت‌ها و اهداف ←
        </button>
      </div>
    </div>
  );
};
