'use client';

import React from 'react';
import { UserProfile, PrimaryGoal, TimelinePreference, RiskTolerance } from '@/types/migration';
import { Sparkles, Check } from 'lucide-react';

interface StepPreferencesProps {
  profile: UserProfile;
  onChange: (updated: UserProfile) => void;
  onPrev: () => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const COUNTRIES_LIST = [
  { name: 'آلمان', flag: '🇩🇪' },
  { name: 'ایتالیا', flag: '🇮🇹' },
  { name: 'کانادا', flag: '🇨🇦' },
  { name: 'سوئد', flag: '🇸🇪' },
  { name: 'دانمارک', flag: '🇩🇰' },
  { name: 'نروژ', flag: '🇳🇴' },
  { name: 'فنلاند', flag: '🇫🇮' },
  { name: 'اتریش', flag: '🇦🇹' },
  { name: 'استرالیا', flag: '🇦🇺' },
  { name: 'هلند', flag: '🇳🇱' },
  { name: 'فرانسه', flag: '🇫🇷' },
  { name: 'امارات و عمان', flag: '🇦🇪' },
];

export const StepPreferences: React.FC<StepPreferencesProps> = ({
  profile,
  onChange,
  onPrev,
  onSubmit,
  isLoading,
}) => {
  const pref = profile.preferences;

  const update = (fields: Partial<UserProfile['preferences']>) => {
    onChange({
      ...profile,
      preferences: {
        ...profile.preferences,
        ...fields,
      },
    });
  };

  const toggleCountry = (name: string) => {
    const list = [...pref.preferredCountries];
    const index = list.indexOf(name);
    if (index > -1) {
      list.splice(index, 1);
    } else {
      list.push(name);
    }
    update({ preferredCountries: list });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <span>مرحله ۶: اهداف، اولویت‌ها و مقاصد مورد علاقه</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          مشخص کنید چه عاملی برای شما اولویت شماره یک است تا نقشه راه و مقاصد دقیقاً حول اهداف زندگی شما سفارشی‌سازی شوند.
        </p>
      </div>

      {/* هدف اصلی از مهاجرت */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-300">مهم‌ترین هدف و اولویت شما:</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {[
            { id: 'quick_pr', label: 'اقامت دائم (PR) سریع', desc: 'اولویت داشتن وضعیت اقامت پایدار و بی‌استرس' },
            { id: 'job_immediate', label: 'کار و درآمد فوری', desc: 'کسب درآمد ارزی بلافاصله پس از ورود' },
            { id: 'study_low_cost', label: 'تحصیل کم‌هزینه / بورسیه', desc: 'ارتقای علمی در دانشگاه‌های معتبر با بودجه اقتصادی' },
            { id: 'family_relocation', label: 'آینده فرزندان و آرامش خانواده', desc: 'مهاجرت امن همراه با همسر و فرزندان' },
            { id: 'citizenship', label: 'پاسپورت معتبر و شهروندی', desc: 'رهایی از محدودیت‌های سفر و ویزا' },
            { id: 'lifestyle_freedom', label: 'کیفیت زندگی و استانداردهای رفاهی', desc: 'هوای پاک، امنیت اجتماعی و آرامش روانی' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => update({ primaryGoal: item.id as PrimaryGoal })}
              className={`p-3 rounded-xl border text-right transition ${
                pref.primaryGoal === item.id
                  ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'
              }`}
            >
              <div className="text-xs sm:text-sm font-bold flex items-center justify-between">
                <span>{item.label}</span>
                {pref.primaryGoal === item.id && <Check className="w-4 h-4 text-indigo-400" />}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">{item.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* کشورهای مورد علاقه */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-300">
          کشورهایی که خودتان به آنها علاقه دارید (انتخاب آزاد):
        </label>
        <div className="flex flex-wrap gap-2">
          {COUNTRIES_LIST.map((c) => {
            const isSelected = pref.preferredCountries.includes(c.name);
            return (
              <button
                key={c.name}
                type="button"
                onClick={() => toggleCountry(c.name)}
                className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium border flex items-center gap-1.5 transition ${
                  isSelected
                    ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850'
                }`}
              >
                <span>{c.flag}</span>
                <span>{c.name}</span>
                {isSelected && <Check className="w-3.5 h-3.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* زمان‌بندی مد نظر و ریسک‌پذیری */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">بازه زمانی مورد نظر برای پرواز:</label>
          <select
            value={pref.timeline}
            onChange={(e) => update({ timeline: e.target.value as TimelinePreference })}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition"
          >
            <option value="immediate">فوری و در سریع‌ترین زمان ممکن (زیر ۶ ماه)</option>
            <option value="under_1_year">بین ۶ ماه تا ۱ سال (بازه منطقی استاندارد)</option>
            <option value="1_to_2_years">۱ تا ۲ سال (فرصت کافی برای ارتقای زبان)</option>
            <option value="flexible">منعطف و بدون عجله (برنامه‌ریزی بلندمدت)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">میزان ریسک‌پذیری شما:</label>
          <select
            value={pref.riskTolerance}
            onChange={(e) => update({ riskTolerance: e.target.value as RiskTolerance })}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition"
          >
            <option value="low">پایین (فقط روش‌های قطعی با کمترین احتمال ریجکتی)</option>
            <option value="moderate">متوسط (تعادل میان زمان، هزینه و احتمال موفقیت)</option>
            <option value="high">بالا (آمادگی برای روش‌های جستجوی کار یا استارتاپی)</option>
          </select>
        </div>
      </div>

      {/* تمایل به کشورهای غیرانگلیسی زبان */}
      <label className="flex items-start gap-3 p-3.5 rounded-xl border bg-slate-900 border-slate-800 cursor-pointer hover:bg-slate-850 transition">
        <input
          type="checkbox"
          checked={pref.openToNonEnglishCountries}
          onChange={(e) => update({ openToNonEnglishCountries: e.target.checked })}
          className="mt-1 w-4 h-4 rounded accent-indigo-500"
        />
        <div>
          <div className="text-xs sm:text-sm font-bold text-white">
            کشورهای اروپایی غیرانگلیسی‌زبان (آلمان، اتریش، ایتالیا، فرانسه) در گزینه‌های من قرار گیرند
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            این کشورها اغلب تحصیل تقریباً رایگان و بازار کار پرتقاضاتری دارند.
          </div>
        </div>
      </label>

      <div className="flex justify-between pt-4 border-t border-slate-850">
        <button
          type="button"
          onClick={onPrev}
          disabled={isLoading}
          className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs sm:text-sm font-semibold transition disabled:opacity-50"
        >
          → مرحله قبل
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={isLoading}
          className="px-8 py-3 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white rounded-xl text-sm font-black transition shadow-xl shadow-indigo-600/30 flex items-center gap-2 disabled:opacity-60 cursor-pointer"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>در حال پردازش هوشمند پرونده...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 animate-pulse text-amber-300" />
              <span>تولید برنامه جامع مهاجرت با هوش مصنوعی ←</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
