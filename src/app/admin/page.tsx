'use client';

import React, { useState, useEffect } from 'react';
import { 
  ApplicantRecord, 
  ApplicantStatistics, 
  TimeRangeFilter 
} from '@/types/migration';
import { 
  Users, 
  Download, 
  Sparkles, 
  RefreshCw, 
  Search, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Shield, 
  Lock, 
  ArrowLeft, 
  User, 
  X, 
  BarChart3, 
  FileSpreadsheet, 
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [adminKey, setAdminKey] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [inputKey, setInputKey] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);

  const [timeRange, setTimeRange] = useState<TimeRangeFilter>('1m');
  const [search, setSearch] = useState<string>('');
  const [applicants, setApplicants] = useState<ApplicantRecord[]>([]);
  const [stats, setStats] = useState<ApplicantStatistics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // مشاهده پرونده تکی
  const [selectedApplicant, setSelectedApplicant] = useState<ApplicantRecord | null>(null);

  // گزارش هوش مصنوعی
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [showAiModal, setShowAiModal] = useState<boolean>(false);

  // بررسی کلید ذخیره‌شده
  useEffect(() => {
    const saved = sessionStorage.getItem('iramigrate_admin_key');
    if (saved) {
      setAdminKey(saved);
      setIsAuthenticated(true);
    }
  }, []);

  const fetchData = async (keyToUse: string = adminKey, range: TimeRangeFilter = timeRange, q: string = search) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/applicants?timeRange=${range}&search=${encodeURIComponent(q)}`, {
        headers: {
          'x-admin-key': keyToUse,
        },
      });

      if (res.status === 401) {
        setIsAuthenticated(false);
        sessionStorage.removeItem('iramigrate_admin_key');
        setAuthError('رمز عبور مدیریت اشتباه است.');
        return;
      }

      const json = await res.json();
      if (json.success) {
        setApplicants(json.applicants || []);
        setStats(json.statistics || null);
        setIsAuthenticated(true);
        sessionStorage.setItem('iramigrate_admin_key', keyToUse);
        setAuthError(null);
      }
    } catch (e) {
      console.error('Error fetching admin data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && adminKey) {
      fetchData(adminKey, timeRange, search);
    }
  }, [isAuthenticated, timeRange]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputKey.trim()) return;
    setAdminKey(inputKey);
    fetchData(inputKey, timeRange, search);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData(adminKey, timeRange, search);
  };

  const handleExportCSV = () => {
    const url = `/api/admin/applicants?timeRange=${timeRange}&search=${encodeURIComponent(search)}&format=csv&key=${encodeURIComponent(adminKey)}`;
    window.open(url, '_blank');
  };

  const handleGenerateAiReport = async () => {
    setIsAiLoading(true);
    setShowAiModal(true);
    setAiReport(null);
    try {
      const res = await fetch('/api/admin/applicants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
        },
        body: JSON.stringify({ timeRange }),
      });
      const json = await res.json();
      if (json.success) {
        setAiReport(json.report);
      } else {
        setAiReport(json.error || 'خطا در تولید گزارش');
      }
    } catch (e: any) {
      setAiReport('خطا در برقراری ارتباط: ' + e.message);
    } finally {
      setIsAiLoading(false);
    }
  };

  // گیت لاگین مدیریت
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0c10] text-zinc-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#11141d] border border-white/[0.08] rounded-3xl p-8 shadow-2xl space-y-6 text-right">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 border border-white/10 flex items-center justify-center shadow-md shadow-indigo-600/20">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">ورود به پنل مدیریت جامعه آماری</h1>
              <p className="text-xs text-zinc-400">بانک اطلاعات و بیگ دیتای کوچ‌یار هوشمند</p>
            </div>
          </div>

          {authError && (
            <div className="p-3 bg-rose-500/15 border border-rose-500/30 text-rose-300 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                رمز عبور مدیریت (Admin Password):
              </label>
              <input
                type="password"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="رمز عبور مدیریت را وارد کنید..."
                className="w-full bg-[#0c0f16] border border-white/[0.09] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition font-mono"
              />
              <p className="text-[11px] text-zinc-500 mt-1">
                دسترسی محافظت‌شده ویژه مدیران سامانه کوچ‌یار هوشمند
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold transition shadow-lg shadow-indigo-600/25 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'در حال بررسی...' : 'ورود به پنل آمار و اطلاعات'}
            </button>
          </form>

          <div className="pt-2 text-center">
            <Link href="/" className="text-xs text-zinc-400 hover:text-indigo-300 inline-flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>بازگشت به صفحه اصلی سایت</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0c10] text-[#ededed] p-4 sm:p-6 lg:p-8" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* نوار بالای داشبورد */}
        <div className="bg-[#11141d]/90 border border-white/[0.08] rounded-3xl p-5 sm:p-6 shadow-xl flex flex-wrap items-center justify-between gap-4 backdrop-blur-md">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 border border-white/10 flex items-center justify-center shadow-md shadow-indigo-600/20">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">داشبورد جامعه آماری و بیگ دیتا</h1>
                <span className="text-xs bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-mono">
                  IraMigrate DB
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                رصد هوشمند متقاضیان، پرونده‌ها، شماره‌های تماس و تحلیل الگوهای مهاجرت
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/"
              className="px-3 py-2 text-xs rounded-xl bg-zinc-900 border border-white/[0.06] text-zinc-300 hover:bg-zinc-800 transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>نمای کاربر (سایت)</span>
            </Link>

            <button
              onClick={handleExportCSV}
              disabled={applicants.length === 0}
              className="px-3.5 py-2 text-xs rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition flex items-center gap-1.5 font-bold cursor-pointer disabled:opacity-50"
              title="خروجی فایل اکسل با فرمت استاندارد فارسی"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>دانلود اکسل (CSV)</span>
            </button>

            <button
              onClick={handleGenerateAiReport}
              disabled={isAiLoading || applicants.length === 0}
              className="px-3.5 py-2 text-xs rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition flex items-center gap-1.5 font-bold shadow-md shadow-indigo-600/20 cursor-pointer disabled:opacity-50"
              title="تولید تحلیل هوش مصنوعی از این جامعه آماری"
            >
              <Sparkles className="w-4 h-4 text-indigo-200" />
              <span>تحلیل بیگ دیتا با AI</span>
            </button>

            <button
              onClick={() => fetchData()}
              disabled={isLoading}
              className="p-2 text-zinc-400 hover:text-white bg-zinc-900 border border-white/[0.06] rounded-xl transition cursor-pointer"
              title="به‌روزرسانی داده‌ها"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-indigo-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* فیلترهای زمانی و جستجو */}
        <div className="bg-[#11141d]/80 border border-white/[0.07] rounded-2xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 shadow-md">
          {/* تب‌های بازه زمانی */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-zinc-400 ml-1 font-medium flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span>بازه زمانی:</span>
            </span>

            {(
              [
                { key: '1m', label: '۱ ماه اخیر' },
                { key: '2m', label: '۲ ماه اخیر' },
                { key: '3m', label: '۳ ماه اخیر' },
                { key: 'all', label: 'کل اطلاعات (همه)' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setTimeRange(tab.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  timeRange === tab.key
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-[#0c0f16] text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* سرچ بار */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-1.5 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="جستجو نام، شماره موبایل، رشته..."
                className="w-full bg-[#0c0f16] border border-white/[0.08] rounded-xl pr-9 pl-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition"
              />
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <button
              type="submit"
              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-medium transition cursor-pointer"
            >
              جستجو
            </button>
          </form>
        </div>

        {/* کارت‌های شاخص‌های کلیدی (KPIs) */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="bg-[#11141d]/90 border border-white/[0.07] rounded-2xl p-4 shadow-md space-y-1">
              <div className="text-xs text-zinc-400 flex items-center justify-between">
                <span>تعداد کل متقاضیان:</span>
                <Users className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-black text-white font-mono">
                {stats.totalCount.toLocaleString('fa-IR')} <span className="text-xs font-normal text-zinc-500">نفر</span>
              </div>
              <div className="text-[11px] text-zinc-500">
                در بازه انتخابی: <span className="text-indigo-300 font-bold font-mono">{stats.filteredCount.toLocaleString('fa-IR')}</span> پرونده
              </div>
            </div>

            <div className="bg-[#11141d]/90 border border-white/[0.07] rounded-2xl p-4 shadow-md space-y-1">
              <div className="text-xs text-zinc-400 flex items-center justify-between">
                <span>میانگین بودجه نقدی:</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-emerald-400 font-mono">
                ${stats.averageBudgetUSD.toLocaleString()}
              </div>
              <div className="text-[11px] text-zinc-500">
                میانگین سن: <span className="text-zinc-300 font-bold font-mono">{stats.averageAge}</span> سال
              </div>
            </div>

            <div className="bg-[#11141d]/90 border border-white/[0.07] rounded-2xl p-4 shadow-md space-y-1">
              <div className="text-xs text-zinc-400 flex items-center justify-between">
                <span>محبوب‌ترین مقصد:</span>
                <TrendingUp className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-lg font-black text-white truncate">
                {Object.keys(stats.countryDistribution)[0] || 'آلمان'}
              </div>
              <div className="text-[11px] text-zinc-500 truncate">
                {Object.entries(stats.countryDistribution).map(([c, n]) => `${c} (${n})`).slice(0, 2).join('، ')}
              </div>
            </div>

            <div className="bg-[#11141d]/90 border border-white/[0.07] rounded-2xl p-4 shadow-md space-y-1">
              <div className="text-xs text-zinc-400 flex items-center justify-between">
                <span>پایان خدمت آقایان:</span>
                <Shield className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-black text-white font-mono">
                {((stats.militaryBreakdown['completed'] || 0)).toLocaleString('fa-IR')} <span className="text-xs font-normal text-zinc-500">نفر</span>
              </div>
              <div className="text-[11px] text-zinc-500">
                معافیت تحصیلی: <span className="text-amber-400 font-mono">{stats.militaryBreakdown['educational_exempt'] || 0}</span> نفر
              </div>
            </div>
          </div>
        )}

        {/* جدول سوابق کاربران */}
        <div className="bg-[#11141d]/90 border border-white/[0.08] rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span>فهرست متقاضیان و شماره‌های ثبت‌شده</span>
              <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full font-mono">
                {applicants.length} رکورد
              </span>
            </h2>

            <span className="text-xs text-zinc-500">
              کلیک روی هر سطر برای مشاهده جزئیات کامل پرونده
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-white/[0.06] text-zinc-400">
                  <th className="py-3 px-3">ردیف</th>
                  <th className="py-3 px-3">نام متقاضی</th>
                  <th className="py-3 px-3">شماره تماس</th>
                  <th className="py-3 px-3">سن</th>
                  <th className="py-3 px-3">رشته و مقطع</th>
                  <th className="py-3 px-3">بودجه دلاری</th>
                  <th className="py-3 px-3">کشور هدف</th>
                  <th className="py-3 px-3">شانس ویزا</th>
                  <th className="py-3 px-3">تاریخ ثبت (شمسی)</th>
                  <th className="py-3 px-3 text-center">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {applicants.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-zinc-500">
                      هیچ پرونده‌ای با این مشخصات در این بازه زمانی یافت نشد.
                    </td>
                  </tr>
                ) : (
                  applicants.map((app, idx) => (
                    <tr
                      key={app.id}
                      onClick={() => setSelectedApplicant(app)}
                      className="hover:bg-zinc-800/40 transition cursor-pointer group"
                    >
                      <td className="py-3 px-3 text-zinc-500 font-mono">{idx + 1}</td>
                      <td className="py-3 px-3 font-bold text-white group-hover:text-indigo-300">
                        {app.fullName}
                      </td>
                      <td className="py-3 px-3 font-mono text-zinc-300 dir-ltr text-right">
                        {app.phone}
                      </td>
                      <td className="py-3 px-3 text-zinc-400 font-mono">{app.age} سال</td>
                      <td className="py-3 px-3 text-zinc-300 truncate max-w-[140px]">
                        {app.field} ({app.degree})
                      </td>
                      <td className="py-3 px-3 font-mono text-emerald-400 font-bold">
                        ${app.liquidBudgetUSD?.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-indigo-300 font-medium">
                        {app.topCountry}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-white">
                        %{app.matchScore}
                      </td>
                      <td className="py-3 px-3 text-zinc-400 font-mono text-[11px]">
                        {app.shamsiDate}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedApplicant(app);
                          }}
                          className="px-2.5 py-1 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-lg text-[11px] transition"
                        >
                          مشاهده پرونده
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* مودال مشاهده پرونده کامل کاربر */}
      {selectedApplicant && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#11141d] border border-white/[0.08] rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto text-right">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{selectedApplicant.fullName}</h3>
                  <p className="text-xs text-zinc-400 font-mono dir-ltr text-right">{selectedApplicant.phone}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedApplicant(null)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-[#0c0f16] p-3 rounded-xl border border-white/[0.04]">
                <span className="text-zinc-500 block mb-1">سن و جنسیت:</span>
                <span className="font-bold text-white">{selectedApplicant.age} سال ({selectedApplicant.gender === 'male' ? 'آقا' : 'خانم'})</span>
              </div>

              <div className="bg-[#0c0f16] p-3 rounded-xl border border-white/[0.04]">
                <span className="text-zinc-500 block mb-1">وضعیت سربازی:</span>
                <span className="font-bold text-white">{selectedApplicant.militaryStatus}</span>
              </div>

              <div className="bg-[#0c0f16] p-3 rounded-xl border border-white/[0.04]">
                <span className="text-zinc-500 block mb-1">مدرک تحصیلی:</span>
                <span className="font-bold text-white">{selectedApplicant.degree}</span>
              </div>

              <div className="bg-[#0c0f16] p-3 rounded-xl border border-white/[0.04]">
                <span className="text-zinc-500 block mb-1">رشته تحصیلی:</span>
                <span className="font-bold text-white truncate block">{selectedApplicant.field}</span>
              </div>

              <div className="bg-[#0c0f16] p-3 rounded-xl border border-white/[0.04]">
                <span className="text-zinc-500 block mb-1">شغل و سابقه:</span>
                <span className="font-bold text-white">{selectedApplicant.jobTitle} ({selectedApplicant.yearsExperience} سال)</span>
              </div>

              <div className="bg-[#0c0f16] p-3 rounded-xl border border-white/[0.04]">
                <span className="text-zinc-500 block mb-1">سطح زبان:</span>
                <span className="font-bold text-white">{selectedApplicant.englishLevel}</span>
              </div>

              <div className="bg-[#0c0f16] p-3 rounded-xl border border-white/[0.04]">
                <span className="text-zinc-500 block mb-1">بودجه نقدی دلاری:</span>
                <span className="font-bold text-emerald-400 font-mono">${selectedApplicant.liquidBudgetUSD?.toLocaleString()}</span>
              </div>

              <div className="bg-[#0c0f16] p-3 rounded-xl border border-white/[0.04]">
                <span className="text-zinc-500 block mb-1">کشور هدف:</span>
                <span className="font-bold text-indigo-300">{selectedApplicant.topCountry}</span>
              </div>

              <div className="bg-[#0c0f16] p-3 rounded-xl border border-white/[0.04]">
                <span className="text-zinc-500 block mb-1">تاریخ ثبت:</span>
                <span className="font-bold text-zinc-300 font-mono">{selectedApplicant.shamsiDate}</span>
              </div>
            </div>

            <div className="bg-[#0c0f16] p-4 rounded-xl border border-white/[0.04] space-y-1 text-xs">
              <span className="text-zinc-400 block font-semibold">روش پیشنهادی سیستم هوشمند:</span>
              <p className="text-white font-medium">{selectedApplicant.recommendedPathway}</p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedApplicant(null)}
                className="px-5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                بستن پنجره
              </button>
            </div>
          </div>
        </div>
      )}

      {/* مودال تحلیل بیگ دیتا با هوش مصنوعی */}
      {showAiModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#11141d] border border-white/[0.08] rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 max-h-[85vh] overflow-y-auto text-right">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">گزارش هوش مصنوعی از جامعه آماری</h3>
                  <p className="text-xs text-zinc-400">
                    تحلیل بیگ دیتای متقاضیان در بازه {timeRange === '1m' ? 'یک ماه اخیر' : timeRange === '2m' ? 'دو ماه اخیر' : timeRange === '3m' ? 'سه ماه اخیر' : 'کل تاریخ'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowAiModal(false)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isAiLoading ? (
              <div className="py-16 text-center space-y-3">
                <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
                <p className="text-xs text-zinc-400">در حال آنالیز الگوها و تولید گزارش بازار با هوش مصنوعی...</p>
              </div>
            ) : (
              <div className="bg-[#0c0f16] p-5 rounded-2xl border border-white/[0.04] text-xs sm:text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap font-sans">
                {aiReport}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowAiModal(false)}
                className="px-5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                بستن گزارش
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
