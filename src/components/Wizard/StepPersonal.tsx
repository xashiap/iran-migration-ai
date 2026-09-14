'use client';

import React from 'react';
import { UserProfile, MilitaryStatus, MaritalStatus } from '@/types/migration';
import { AlertCircle, ShieldCheck, Info } from 'lucide-react';

interface StepPersonalProps {
  profile: UserProfile;
  onChange: (updated: UserProfile) => void;
  onNext: () => void;
}

export const StepPersonal: React.FC<StepPersonalProps> = ({ profile, onChange, onNext }) => {
  const p = profile.personal;

  const update = (fields: Partial<UserProfile['personal']>) => {
    onChange({
      ...profile,
      personal: {
        ...profile.personal,
        ...fields,
      },
    });
  };

  const isMale = p.gender === 'male';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <span>مرحله ۱: اطلاعات هویتی و وضعیت نظام وظیفه</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          این اطلاعات پایه برای محاسبه سن در سیستم امتیازدهی (CRS و Chancenkarte) و امکان‌سنجی خروج قانونی از کشور استفاده می‌شود.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* نام و نام خانوادگی */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            نام یا عنوان شما (اختیاری):
          </label>
          <input
            type="text"
            value={p.fullName || ''}
            onChange={(e) => update({ fullName: e.target.value })}
            placeholder="مثال: علی رضایی"
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        {/* سن */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            سن شما: <span className="text-indigo-400 font-bold font-mono">{p.age} سال</span>
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={18}
              max={60}
              value={p.age}
              onChange={(e) => update({ age: parseInt(e.target.value) })}
              className="w-full accent-indigo-500 bg-slate-800 rounded-lg cursor-pointer h-2"
            />
            <input
              type="number"
              min={18}
              max={60}
              value={p.age}
              onChange={(e) => update({ age: parseInt(e.target.value) || 18 })}
              className="w-16 bg-slate-900 border border-slate-800 rounded-xl py-1.5 px-2 text-center text-sm font-bold text-indigo-400 font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            سن بین ۱۸ تا ۳۲ سال بالاترین امتیاز سن را در سیستم‌های اکسپرس اینتری و کارت شانس آلمان دریافت می‌کند.
          </p>
        </div>

        {/* جنسیت */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">جنسیت:</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => update({ gender: 'male' })}
              className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold border transition ${
                p.gender === 'male'
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-850'
              }`}
            >
              آقا (مرد)
            </button>
            <button
              type="button"
              onClick={() => update({ gender: 'female', militaryStatus: 'not_applicable' })}
              className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold border transition ${
                p.gender === 'female'
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-850'
              }`}
            >
              خانم (زن)
            </button>
          </div>
        </div>

        {/* وضعیت تاهل */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">وضعیت تاهل و همراهان:</label>
          <select
            value={p.maritalStatus}
            onChange={(e) => update({ maritalStatus: e.target.value as MaritalStatus })}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition"
          >
            <option value="single">مجرد</option>
            <option value="married">متاهل (بدون فرزند)</option>
            <option value="married_with_children">متاهل (دارای فرزند)</option>
          </select>
        </div>

        {/* تعداد فرزندان */}
        {p.maritalStatus === 'married_with_children' && (
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">تعداد فرزندان:</label>
            <input
              type="number"
              min={1}
              max={6}
              value={p.childrenCount || 1}
              onChange={(e) => update({ childrenCount: parseInt(e.target.value) || 1 })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>
        )}
      </div>

      {/* بخش ویژه نظام وظیفه (برای آقایان) */}
      {isMale && (
        <div className="bg-slate-900/90 border border-slate-800 p-4 sm:p-5 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <ShieldCheck className="w-5 h-5" />
            <span>وضعیت نظام وظیفه و خدمت سربازی (چالش کلیدی خروج از ایران)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              { id: 'completed', label: 'کارت پایان خدمت هوشمند', desc: 'خدمت به اتمام رسیده و کارت الکترونیکی صادر شده' },
              { id: 'educational_exempt', label: 'معافیت تحصیلی (دانشجویی)', desc: 'مشغول به تحصیل در دانشگاه و دارای فرجه یا معافیت تحصیلی' },
              { id: 'medical_exempt', label: 'معافیت پزشکی', desc: 'دارای کارت معافیت دائم پزشکی' },
              { id: 'other_exempt', label: 'معافیت کفالت یا موارد خاص', desc: 'معافیت کفالت مادر، پدر یا ایثارگری' },
              { id: 'conscript', label: 'مشمول / در انتظار خدمت یا غایب', desc: 'فاقد هرگونه معافیت یا کارت' },
            ].map((item) => (
              <label
                key={item.id}
                onClick={() => update({ militaryStatus: item.id as MilitaryStatus })}
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                  p.militaryStatus === item.id
                    ? 'bg-indigo-600/15 border-indigo-500/80 text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/40'
                }`}
              >
                <input
                  type="radio"
                  name="military"
                  checked={p.militaryStatus === item.id}
                  onChange={() => {}}
                  className="mt-1 accent-indigo-500"
                />
                <div>
                  <div className="text-xs sm:text-sm font-bold">{item.label}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{item.desc}</div>
                </div>
              </label>
            ))}
          </div>

          {/* هشدارهای تطبیقی نظام وظیفه */}
          {p.militaryStatus === 'educational_exempt' && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-300 flex items-start gap-2">
              <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <strong>نکته مهم خروج موقت یا دائم:</strong> با معافیت تحصیلی می‌توانید با ثبت درخواست در سامانه سخا (sakha.epolice.ir) و سپردن وثیقه نقدی برای مصاحبه سفارت به کشورهای همسایه بروید. برای خروج دائم تحصیلی، پذیرش شما باید در سامانه سجاد به تایید سازمان امور دانشجویان برسد.
              </div>
            </div>
          )}

          {p.militaryStatus === 'conscript' && (
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-3 text-xs text-rose-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <strong>هشدار قانونی خروج:</strong> متقاضیان مشمول بدون معافیت امکان خروج از مرز یا صدور گذرنامه را ندارند. در صورتی که امکان معافیت تحصیلی با قبولی در یک مقطع بالاتر را دارید، این بهترین پنجره قانونی برای شماست.
              </div>
            </div>
          )}
        </div>
      )}

      {/* وضعیت پاسپورت */}
      <div className="bg-slate-900/60 border border-slate-800 p-4 sm:p-5 rounded-2xl">
        <label className="block text-xs font-semibold text-slate-300 mb-2">وضعیت گذرنامه (پاسپورت):</label>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={p.hasPassport}
              onChange={(e) => update({ hasPassport: e.target.checked })}
              className="w-4 h-4 rounded accent-indigo-500"
            />
            <span className="text-xs sm:text-sm text-slate-200">گذرنامه دارم و معتبر است</span>
          </label>

          {p.hasPassport && (
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <span>مدت اعتبار باقیمانده:</span>
              <select
                value={p.passportValidityMonths}
                onChange={(e) => update({ passportValidityMonths: parseInt(e.target.value) })}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-indigo-300 focus:outline-none focus:border-indigo-500"
              >
                <option value={6}>کمتر از ۶ ماه (نیاز به تعویض فوری)</option>
                <option value={12}>حدود ۱ سال</option>
                <option value={24}>حدود ۲ سال</option>
                <option value={48}>بیش از ۳ سال (ایده‌آل)</option>
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={onNext}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs sm:text-sm font-bold transition shadow-lg shadow-indigo-600/20"
        >
          مرحله بعد: تحصیلات و سجاد ←
        </button>
      </div>
    </div>
  );
};
