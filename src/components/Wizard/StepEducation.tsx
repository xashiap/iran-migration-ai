'use client';

import React from 'react';
import { UserProfile, DegreeLevel, MajorCategory, UniversityType } from '@/types/migration';
import { BookOpen, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface StepEducationProps {
  profile: UserProfile;
  onChange: (updated: UserProfile) => void;
  onPrev: () => void;
  onNext: () => void;
}

export const StepEducation: React.FC<StepEducationProps> = ({ profile, onChange, onPrev, onNext }) => {
  const edu = profile.education;

  const update = (fields: Partial<UserProfile['education']>) => {
    onChange({
      ...profile,
      education: {
        ...profile.education,
        ...fields,
      },
    });
  };

  const isStateUniv = edu.universityType === 'state_top' || edu.universityType === 'state_regular';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <span>مرحله ۲: سوابق تحصیلی و وضعیت آزادسازی دانشنامه</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          سطح مدرک تحصیلی، نوع دانشگاه و آزادسازی آن از مواردی است که در سیستم‌های اعتبارسنجی بین‌المللی (مانند ZAB و WES) بررسی می‌شود.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* آخرین مقطع تحصیلی */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">آخرین مقطع تحصیلی:</label>
          <select
            value={edu.degree}
            onChange={(e) => update({ degree: e.target.value as DegreeLevel })}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition"
          >
            <option value="highschool">دیپلم متوسطه</option>
            <option value="associate">کاردانی (فوق دیپلم)</option>
            <option value="bachelor">کارشناسی (لیسانس)</option>
            <option value="master">کارشناسی ارشد (فوق لیسانس)</option>
            <option value="phd">دکترا یا تخصص</option>
          </select>
        </div>

        {/* حوزه تخصصی کلان */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">حوزه کلان رشته:</label>
          <select
            value={edu.majorCategory}
            onChange={(e) => update({ majorCategory: e.target.value as MajorCategory })}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition"
          >
            <option value="computer_it">کامپیوتر، نرم‌افزار و هوش مصنوعی (بالاترین تقاضا)</option>
            <option value="engineering">مهندسی برق، مکانیک، عمران، صنایع و شیمی</option>
            <option value="medical_health">پزشکی، دندانپزشکی، داروسازی و پرستاری</option>
            <option value="basic_sciences">علوم پایه (ریاضی، فیزیک، شیمی، زیست‌شناسی)</option>
            <option value="business_finance">مدیریت، MBA، اقتصاد، مالی و مارکتینگ</option>
            <option value="humanities_art">علوم انسانی، معماری، هنر، طراحی و زبان‌ها</option>
            <option value="vocational">مشاغل فنی، مهارتی و تکنسین</option>
            <option value="other">سایر رشته‌ها</option>
          </select>
        </div>

        {/* رشته دقیق */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">عنوان دقیق رشته تحصیلی:</label>
          <input
            type="text"
            value={edu.field}
            onChange={(e) => update({ field: e.target.value })}
            placeholder="مثال: مهندسی کامپیوتر گرایش نرم‌افزار"
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        {/* نوع دانشگاه */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">نوع دانشگاه محل تحصیل:</label>
          <select
            value={edu.universityType}
            onChange={(e) => update({ universityType: e.target.value as UniversityType })}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition"
          >
            <option value="state_top">دانشگاه دولتی ممتاز (شریف، تهران، امیرکبیر، تبریز و...)</option>
            <option value="state_regular">دانشگاه دولتی روزانه / نوبت دوم سایر شهرها</option>
            <option value="azad">دانشگاه آزاد اسلامی</option>
            <option value="payame_noor">دانشگاه پیام نور</option>
            <option value="non_profit">موسسات غیرانتفاعی</option>
            <option value="applied_science">دانشگاه جامع علمی - کاربردی</option>
            <option value="foreign">دانشگاه خارجی خارج از ایران</option>
          </select>
        </div>

        {/* نام دانشگاه */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">نام دانشگاه:</label>
          <input
            type="text"
            value={edu.universityName}
            onChange={(e) => update({ universityName: e.target.value })}
            placeholder="مثال: دانشگاه صنعتی شریف / دانشگاه آزاد تهران مرکز"
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        {/* معدل کل */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            معدل کل: <span className="text-indigo-400 font-bold font-mono">{edu.gpa}</span> از ۲۰
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={12}
              max={20}
              step={0.1}
              value={edu.gpa}
              onChange={(e) => update({ gpa: parseFloat(e.target.value) })}
              className="w-full accent-indigo-500 bg-slate-800 rounded-lg cursor-pointer h-2"
            />
            <input
              type="number"
              min={10}
              max={20}
              step={0.1}
              value={edu.gpa}
              onChange={(e) => update({ gpa: parseFloat(e.target.value) || 12 })}
              className="w-20 bg-slate-900 border border-slate-800 rounded-xl py-1.5 px-2 text-center text-sm font-bold text-indigo-400 font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            معدل بالای ۱۵ در اکثر دانشگاه‌های معتبر خارجی مزیت رقابتی محسوب می‌شود.
          </p>
        </div>
      </div>

      {/* بخش ویژه آزادسازی مدارک و سامانه سجاد */}
      {edu.degree !== 'highschool' && (
        <div className="bg-slate-900/90 border border-slate-800 p-4 sm:p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
              <BookOpen className="w-5 h-5" />
              <span>وضعیت آزادسازی اصل دانشنامه و سامانه سجاد (portal.saorg.ir)</span>
            </div>
            <span className="text-[11px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-300">ویژه ایران</span>
          </div>

          <label className="flex items-start gap-3 p-3 rounded-xl border bg-slate-950/60 border-slate-800 cursor-pointer hover:bg-slate-800/40 transition">
            <input
              type="checkbox"
              checked={edu.isDegreeReleased}
              onChange={(e) => update({ isDegreeReleased: e.target.checked })}
              className="mt-1 w-4 h-4 rounded accent-indigo-500"
            />
            <div>
              <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                <span>اصل دانشنامه و ریزنمرات آزاد شده و کد سجاد یا تاییدیه مرکزی دارم</span>
                {edu.isDegreeReleased && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                اگر دانشنامه در دست دارید و آماده ترجمه رسمی با مهر دادگستری و وزارت خارجه است تیک بزنید.
              </div>
            </div>
          </label>

          {!edu.isDegreeReleased && isStateUniv && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-300 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <strong>نکته مهم برای دانش‌آموختگان دانشگاه‌های روزانه دولتی:</strong> دانشنامه شما به دلیل تعهد خدمت آموزش رایگان در رهن دانشگاه است. برای ترجمه رسمی، ابتدا باید تعهد را از طریق «تسویه نقدی»، «سابقه کار بیمه‌ای پس از تحصیل» یا «نامه عدم کاریابی اداره کار» لغو نموده و تاییدیه سامانه سجاد دریافت کنید.
              </div>
            </div>
          )}
        </div>
      )}

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
          مرحله بعد: سوابق شغلی و بیمه ←
        </button>
      </div>
    </div>
  );
};
