'use client';

import React from 'react';
import { UserProfile } from '@/types/migration';
import { ShieldAlert, CheckCircle, Globe2, QrCode } from 'lucide-react';

interface StepWorkProps {
  profile: UserProfile;
  onChange: (updated: UserProfile) => void;
  onPrev: () => void;
  onNext: () => void;
}

export const StepWork: React.FC<StepWorkProps> = ({ profile, onChange, onPrev, onNext }) => {
  const w = profile.work;

  const update = (fields: Partial<UserProfile['work']>) => {
    onChange({
      ...profile,
      work: {
        ...profile.work,
        ...fields,
      },
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <span>مرحله ۳: سوابق کاری، تخصص و سوابق بیمه تامین اجتماعی</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          برای ویزاهای کاری، کارت شانس و اسکیلد ورکر، اثبات سابقه کاری مستند با بیمه تامین اجتماعی یا پورتفولیو نقش اساسی دارد.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* عنوان شغلی */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">عنوان شغل یا تخصص اصلی شما:</label>
          <input
            type="text"
            value={w.jobTitle}
            onChange={(e) => update({ jobTitle: e.target.value })}
            placeholder="مثال: کارشناس شبکه، فرانت‌اند دولوپر، مهندس طراح مکانیک"
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        {/* سال‌های سابقه کار */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            مجموع سال‌های سابقه کار: <span className="text-indigo-400 font-bold font-mono">{w.yearsExperience} سال</span>
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={25}
              value={w.yearsExperience}
              onChange={(e) => update({ yearsExperience: parseInt(e.target.value) })}
              className="w-full accent-indigo-500 bg-slate-800 rounded-lg cursor-pointer h-2"
            />
            <input
              type="number"
              min={0}
              max={25}
              value={w.yearsExperience}
              onChange={(e) => update({ yearsExperience: parseInt(e.target.value) || 0 })}
              className="w-16 bg-slate-900 border border-slate-800 rounded-xl py-1.5 px-2 text-center text-sm font-bold text-indigo-400 font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            داشتن حداقل ۲ سال سابقه کار شرط کلیدی کارت شانس آلمان و ۳ سال برای اکسپرس اینتری کاناداست.
          </p>
        </div>
      </div>

      {/* بخش سابقه بیمه تامین اجتماعی - بسیار مهم برای ایرانیان */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 sm:p-5 rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <QrCode className="w-5 h-5" />
            <span>سابقه رسمی بیمه تامین اجتماعی (eservices.tamin.ir)</span>
          </div>
          <span className="text-[11px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-300">مدرک قابل استعلام</span>
        </div>

        <label className="flex items-start gap-3 p-3 rounded-xl border bg-slate-950/60 border-slate-800 cursor-pointer hover:bg-slate-800/40 transition">
          <input
            type="checkbox"
            checked={w.hasOfficialInsurance}
            onChange={(e) => update({ hasOfficialInsurance: e.target.checked })}
            className="mt-1 w-4 h-4 rounded accent-indigo-500"
          />
          <div>
            <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
              <span>سابقه بیمه رسمی رد شده با عنوان شغلی مرتبط دارم</span>
              {w.hasOfficialInsurance && <CheckCircle className="w-4 h-4 text-emerald-400" />}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              سفارتخانه‌ها و سازمان‌های ارزیاب (مانند VETASSESS یا ارزیاب‌های اروپایی) سوابق بیمه با کد QR را به عنوان سند قطعی سابقه کار می‌شناسند.
            </div>
          </div>
        </label>

        {w.hasOfficialInsurance && (
          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              تعداد سال‌های سابقه بیمه تامین اجتماعی:
            </label>
            <input
              type="number"
              min={0}
              max={30}
              value={w.insuranceYears}
              onChange={(e) => update({ insuranceYears: parseInt(e.target.value) || 0 })}
              className="w-48 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-indigo-400 font-bold font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>
        )}

        {!w.hasOfficialInsurance && w.yearsExperience > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-300 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <strong>راهکار برای کار بدون بیمه:</strong> در صورتی که بیمه ندارید، باید از شرکت‌های محل کار نامه سابقه کار سربرگ‌دار با شرح وظایف دقیق، فیش‌های حقوقی و پرینت حساب بانکی واریز حقوق دریافت کنید تا برای آفیسر یا کارفرما قابل اثبات باشد.
            </div>
          </div>
        )}
      </div>

      {/* مهارت‌های بین‌المللی و فریلنسری */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="flex items-start gap-3 p-3.5 rounded-xl border bg-slate-900 border-slate-800 cursor-pointer hover:bg-slate-850 transition">
          <input
            type="checkbox"
            checked={w.isRemoteOrFreelance}
            onChange={(e) => update({ isRemoteOrFreelance: e.target.checked })}
            className="mt-1 w-4 h-4 rounded accent-indigo-500"
          />
          <div>
            <div className="text-xs sm:text-sm font-bold text-white">تجربه دورکاری (Remote) یا پروژه‌ای</div>
            <div className="text-[11px] text-slate-400 mt-0.5">تجربه کار آنلاین با تیم‌های غیرحضوری</div>
          </div>
        </label>

        <label className="flex items-start gap-3 p-3.5 rounded-xl border bg-slate-900 border-slate-800 cursor-pointer hover:bg-slate-850 transition">
          <input
            type="checkbox"
            checked={w.hasInternationalPortfolio}
            onChange={(e) => update({ hasInternationalPortfolio: e.target.checked })}
            className="mt-1 w-4 h-4 rounded accent-indigo-500"
          />
          <div>
            <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-1">
              <span>گیت‌هاب فعال / پورتفولیو / مشتری خارجی</span>
              <Globe2 className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">نمونه‌کارهای قابل استناد برای کارفرمایان بین‌المللی</div>
          </div>
        </label>
      </div>

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
          مرحله بعد: مهارت‌های زبان ←
        </button>
      </div>
    </div>
  );
};
