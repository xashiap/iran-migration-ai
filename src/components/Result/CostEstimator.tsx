'use client';

import React from 'react';
import { AnalysisResult } from '@/types/migration';
import { Coins, ShieldAlert, TrendingUp, Calculator } from 'lucide-react';
import { formatCostStringWithToman, convertUsdToTomanText } from '@/lib/currency';

interface CostEstimatorProps {
  financials: AnalysisResult['financialEstimate'];
  targetCountry: string;
  usdTomanRate?: number;
  eurTomanRate?: number;
}

export const CostEstimator: React.FC<CostEstimatorProps> = ({ 
  financials, 
  targetCountry,
  usdTomanRate = 231300,
  eurTomanRate = 268130
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <Coins className="w-6 h-6 text-amber-400" />
              <span>برآورد واقع‌بینانه هزینه‌های مهاجرت به {targetCountry}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              تفکیک مخارج ریالی داخل ایران و هزینه‌های ارزی روز محاسبه‌شده با نرخ زنده TGJU
            </p>
          </div>

          {/* نرخ زنده و کل سرمایه */}
          <div className="flex items-center gap-3">
            <div className="text-left bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl hidden sm:block">
              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                <span>دلار روز TGJU:</span>
              </div>
              <div className="text-xs font-bold text-emerald-400 font-mono">
                {usdTomanRate.toLocaleString('fa-IR')} تومان
              </div>
            </div>

            <div className="text-left bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-2 rounded-xl">
              <div className="text-[10px] text-emerald-300">کل سرمایه پیشنهادی:</div>
              <div className="text-sm sm:text-base font-black text-emerald-400 font-mono">
                {financials.totalStartingBudgetUSD}
              </div>
              <div className="text-[10px] text-emerald-300/80 font-medium mt-0.5">
                {formatCostStringWithToman(financials.totalStartingBudgetUSD, usdTomanRate, eurTomanRate).replace(financials.totalStartingBudgetUSD, '').trim()}
              </div>
            </div>
          </div>
        </div>

        {/* جدول هزینه‌ها */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          {/* ستون ۱: مخارج ریالی در ایران */}
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 space-y-3">
            <div className="text-xs font-bold text-indigo-400 flex items-center justify-between border-b border-slate-800 pb-2">
              <span>۱. اقدامات اداری، ترجمه و خروج در ایران (ریالی)</span>
              <span className="font-mono text-white text-xs">{financials.iranAdministrativeIRR}</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-indigo-400">•</span>
                <span>هزینه آزادسازی دانشنامه یا لغو تعهد آموزش رایگان (در صورت روزانه بودن)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400">•</span>
                <span>ترجمه رسمی با مهرهای دادگستری و وزارت خارجه (هر پلمپ حدود ۱.۵ تا ۳ میلیون تومان)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400">•</span>
                <span>گذرنامه، عوارض خروج از کشور و امور نظام وظیفه و وثیقه</span>
              </li>
            </ul>
          </div>

          {/* ستون ۲: آزمون‌های بین‌المللی و معادل‌سازی */}
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 space-y-3">
            <div className="text-xs font-bold text-cyan-400 flex items-center justify-between border-b border-slate-800 pb-2">
              <span>۲. آزمون‌های زبان و ارزیابی مدرک (ارزی)</span>
              <span className="font-mono text-white text-xs">
                {financials.languageExamsUSD}
              </span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start justify-between gap-2">
                <span>ثبت‌نام آزمون رسمی آیلتس، تافل یا گوته:</span>
                <strong className="text-cyan-300 font-mono text-[11px]">
                  {formatCostStringWithToman(financials.languageExamsUSD, usdTomanRate, eurTomanRate)}
                </strong>
              </li>
              <li className="flex items-start justify-between gap-2">
                <span>هزینه ارزشیابی مدارک (WES یا ZAB):</span>
                <strong className="text-cyan-300 font-mono text-[11px]">
                  {formatCostStringWithToman(financials.credentialEvaluationUSD, usdTomanRate, eurTomanRate)}
                </strong>
              </li>
              <li className="flex items-start justify-between gap-2">
                <span>اپلیکیشن فی و کارگزاری‌ها:</span>
                <strong className="text-cyan-300 font-mono text-[11px]">
                  {formatCostStringWithToman(financials.applicationAndFeesUSD, usdTomanRate, eurTomanRate)}
                </strong>
              </li>
            </ul>
          </div>

          {/* ستون ۳: تمکن مالی لازم برای سفارت */}
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 space-y-3">
            <div className="text-xs font-bold text-amber-400 flex items-center justify-between border-b border-slate-800 pb-2">
              <span>۳. موجودی تمکن مالی (حساب مسدود یا پرینت بانک)</span>
              <span className="font-mono text-white text-xs">
                {financials.blockedAccountOrProofUSD}
              </span>
            </div>
            <div className="text-xs text-slate-300 leading-relaxed space-y-1.5">
              <p>
                این مبلغ به عنوان هزینه زندگی سال اول محسوب می‌شود و در سفارتخانه مورد بررسی قرار می‌گیرد.
              </p>
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-[11px] text-amber-300 flex items-center justify-between">
                <span>معادل به نرخ زنده TGJU:</span>
                <span className="font-bold font-mono">
                  {formatCostStringWithToman(financials.blockedAccountOrProofUSD, usdTomanRate, eurTomanRate)}
                </span>
              </div>
            </div>
          </div>

          {/* ستون ۴: مخارج اولیه استقرار و ماه‌های اول */}
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 space-y-3">
            <div className="text-xs font-bold text-emerald-400 flex items-center justify-between border-b border-slate-800 pb-2">
              <span>۴. بلیت پرواز و هزینه‌های ماه اول لندینگ</span>
              <span className="font-mono text-white text-xs">{financials.emergencyBufferUSD}</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start justify-between gap-2">
                <span>بلیت هواپیما و بیمه مسافرتی:</span>
                <span className="text-slate-400 text-[11px]">شامل پرواز و بیمه اولیه</span>
              </li>
              <li className="flex items-start justify-between gap-2">
                <span>ودیعه و کرایه ماه اول مسکن:</span>
                <strong className="text-emerald-300 font-mono text-[11px]">
                  {formatCostStringWithToman(financials.emergencyBufferUSD, usdTomanRate, eurTomanRate)}
                </strong>
              </li>
            </ul>
          </div>
        </div>

        {/* نکات ایمنی مالی و ارزی ویژه ایرانیان */}
        <div className="mt-5 bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-xs text-amber-300 space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-amber-200">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>نکات حیاتی انتقال وجه و صرافی برای ایرانیان:</span>
          </div>
          <p className="leading-relaxed">
            به دلیل تحریم‌های بانکی، انتقال وجوه حساب مسدود یا دیپازیت‌ها صرفاً باید از طریق صرافی‌های مجاز و معتبر دارای کد سنا انجام شود. حتماً رسید سوئیفت (Swift Copy) یا رسید پرداخت بانکی را از صرافی دریافت و نزد خود نگاه دارید.
          </p>
        </div>
      </div>
    </div>
  );
};
