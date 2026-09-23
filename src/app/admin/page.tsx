'use client';

import React, { useState, useEffect } from 'react';
import { 
  ApplicantRecord, 
  ApplicantStatistics, 
  TimeRangeFilter 
} from '@/types/migration';
import { 
  Users, 
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
  AlertCircle,
  Phone,
  CheckCircle2,
  Clock,
  Headphones
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [adminKey, setAdminKey] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [inputKey, setInputKey] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);

  const [timeRange, setTimeRange] = useState<TimeRangeFilter>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'lead' | 'consultation_requested'>('all');
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

  const fetchData = async (
    keyToUse: string = adminKey, 
    range: TimeRangeFilter = timeRange, 
    q: string = search,
    sFilter: 'all' | 'completed' | 'lead' | 'consultation_requested' = statusFilter
  ) => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/admin/applicants?timeRange=${range}&search=${encodeURIComponent(q)}&status=${sFilter}`, 
        {
          headers: {
            'x-admin-key': keyToUse,
          },
        }
      );

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
      fetchData(adminKey, timeRange, search, statusFilter);
    }
  }, [isAuthenticated, timeRange, statusFilter]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputKey.trim()) return;
    setAdminKey(inputKey);
    fetchData(inputKey, timeRange, search, statusFilter);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData(adminKey, timeRange, search, statusFilter);
  };

  const handleExportCSV = () => {
    const url = `/api/admin/applicants?timeRange=${timeRange}&search=${encodeURIComponent(search)}&status=${statusFilter}&format=csv&key=${encodeURIComponent(adminKey)}`;
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
              {isLoading ? 'در حال تایید اعتبار...' : 'ورود به داشبورد مدیریت ←'}
            </button>
          </form>

          <div className="pt-4 border-t border-white/[0.06] text-center">
            <Link
              href="/"
              className="text-xs text-zinc-400 hover:text-white transition inline-flex items-center gap-1"
            >
              <span>بازگشت به صفحه اصلی سامانه</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0c10] text-zinc-100 p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* هدر بالای پنل */}
        <div className="bg-[#11141d]/90 border border-white/[0.08] rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-indigo-400" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                داشبورد جامعه آماری و بیگ دیتای متقاضیان
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                کلود متصل
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              تحلیل زنده پرونده‌های مهاجرتی، بانک اطلاعاتی نام و شماره متقاضیان، و استخراج خودکار الگوها
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => fetchData(adminKey, timeRange, search, statusFilter)}
              disabled={isLoading}
              className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 border border-white/[0.06] cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>بروزرسانی زنده</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>خروجی اکسل (Excel CSV)</span>
            </button>

            <button
              onClick={handleGenerateAiReport}
              className="px-3.5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-600/25 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>تحلیل بیگ دیتا با هوش مصنوعی</span>
            </button>

            <Link
              href="/"
              className="px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-xl text-xs font-semibold transition border border-white/[0.06]"
            >
              مشاهده سایت
            </Link>
          </div>
        </div>

        {/* فیلترها و سرچ */}
        <div className="bg-[#11141d]/70 border border-white/[0.06] rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3">
          
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* بازه زمانی */}
            <div className="flex items-center gap-1.5 bg-[#0c0f16] p-1 rounded-xl border border-white/[0.06]">
              <Calendar className="w-3.5 h-3.5 text-zinc-500 ml-1 mr-2" />
              {(
                [
                  { key: '1m', label: '۱ ماه اخیر' },
                  { key: '2m', label: '۲ ماه اخیر' },
                  { key: '3m', label: '۳ ماه اخیر' },
                  { key: 'all', label: 'کل اطلاعات' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setTimeRange(tab.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    timeRange === tab.key
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* تفکیک وضعیت (لید / تکمیل‌شده / مشاوره VIP) */}
            <div className="flex items-center gap-1 bg-[#0c0f16] p-1 rounded-xl border border-white/[0.06] overflow-x-auto">
              {(
                [
                  { key: 'all', label: 'همه' },
                  { key: 'completed', label: 'فقط تکمیل‌شده' },
                  { key: 'lead', label: 'فقط لید مرحله ۱' },
                  { key: 'consultation_requested', label: 'درخواست مشاوره VIP 🌟' },
                ] as const
              ).map((s) => (
                <button
                  key={s.key}
                  onClick={() => setStatusFilter(s.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                    statusFilter === s.key
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* سرچ بار */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-1.5 w-full md:w-auto">
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
              <div className="text-[11px] text-zinc-400 flex items-center gap-2 pt-0.5">
                <span className="text-emerald-400 font-mono font-bold">{stats.completedCount} تکمیل‌شده</span>
                <span>•</span>
                <span className="text-amber-400 font-mono font-bold">{stats.leadsCount} لید مرحله ۱</span>
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
              کلیک روی هر سطر برای مشاهده جزئیات پرونده و تماس
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-white/[0.06] text-zinc-400">
                  <th className="py-3 px-3">ردیف</th>
                  <th className="py-3 px-3">وضعیت</th>
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
                    <td colSpan={11} className="py-12 text-center text-zinc-500">
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
                      <td className="py-3 px-3">
                        {app.status === 'consultation_requested' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-purple-500/20 text-purple-200 border border-purple-500/40 whitespace-nowrap shadow-sm shadow-purple-900/30">
                            <Headphones className="w-3 h-3 text-purple-400 animate-pulse" />
                            <span>رزرو مشاوره VIP</span>
                          </span>
                        ) : app.status === 'lead' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 whitespace-nowrap">
                            <Clock className="w-3 h-3 text-amber-400" />
                            <span>لید مرحله ۱</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 whitespace-nowrap">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span>تکمیل‌شده</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 font-bold text-white group-hover:text-indigo-300">
                        {app.fullName}
                      </td>
                      <td className="py-3 px-3 font-mono text-zinc-200 dir-ltr text-right font-semibold">
                        {app.phone}
                      </td>
                      <td className="py-3 px-3 text-zinc-400 font-mono">{app.age} سال</td>
                      <td className="py-3 px-3 text-zinc-300 truncate max-w-[140px]">
                        {app.field || '—'} {app.degree ? `(${app.degree})` : ''}
                      </td>
                      <td className="py-3 px-3 font-mono text-emerald-400 font-bold">
                        {app.liquidBudgetUSD ? `$${app.liquidBudgetUSD.toLocaleString()}` : '—'}
                      </td>
                      <td className="py-3 px-3 text-indigo-300 font-medium">
                        {app.topCountry || '—'}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-white">
                        {app.status === 'lead' ? '—' : `%${app.matchScore}`}
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

      {/* مودال مشاهده کامل پرونده متقاضی */}
      {selectedApplicant && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#11141d] border border-white/[0.1] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 text-right shadow-2xl">
            
            {/* هدر مودال */}
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                  <User className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>پرونده متقاضی: {selectedApplicant.fullName}</span>
                    {selectedApplicant.status === 'consultation_requested' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-purple-500/20 text-purple-200 border border-purple-500/40 font-bold flex items-center gap-1">
                        <Headphones className="w-3 h-3 text-purple-400" />
                        درخواست مشاوره VIP
                      </span>
                    ) : selectedApplicant.status === 'lead' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                        لید اولیه مرحله ۱
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                        تکمیل‌شده
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-zinc-400">ثبت‌شده در: {selectedApplicant.shamsiDate}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedApplicant(null)}
                className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* بنر درخواست مشاوره VIP */}
            {selectedApplicant.status === 'consultation_requested' && (
              <div className="p-4 bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-purple-950/40 border border-purple-500/40 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg shadow-purple-950/20">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-purple-200 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                    <span>متقاضی درخواست وقت مشاوره اختصاصی و بررسی وکیل ثبت کرده است</span>
                  </div>
                  <div className="text-[11px] text-zinc-300">
                    سرویس درخواستی: <span className="font-bold text-amber-300">{selectedApplicant.consultationService || 'بررسی جامع پرونده'}</span>
                    {selectedApplicant.consultationNotes && (
                      <div className="mt-1 text-zinc-300 bg-black/40 p-2.5 rounded-xl text-[11px] border border-white/10 leading-relaxed">
                        یادداشت متقاضی: «{selectedApplicant.consultationNotes}»
                      </div>
                    )}
                  </div>
                </div>
                <a
                  href={`tel:${selectedApplicant.phone}`}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md flex-shrink-0"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>تماس جهت هماهنگی</span>
                </a>
              </div>
            )}

            {/* بنر تماس و وضعیت برای لید */}
            {selectedApplicant.status === 'lead' && (
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>متقاضی در گام ۱ فرم متوقف شده و نیاز به پیگیری دارد</span>
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    شماره تماس و اطلاعات اولیه ثبت شده است. می‌توانید مستقیماً برای مشاوره با وی تماس بگیرید.
                  </div>
                </div>
                <a
                  href={`tel:${selectedApplicant.phone}`}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md flex-shrink-0"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>تماس تلفنی</span>
                </a>
              </div>
            )}

            {/* کارت‌های خلاصه اطلاعات فردی و تماس */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-[#0c0f16] p-3 rounded-xl border border-white/[0.06]">
                <span className="text-zinc-500 block mb-1">شماره تماس مستقیم:</span>
                <a 
                  href={`tel:${selectedApplicant.phone}`}
                  className="font-mono text-indigo-400 font-bold hover:underline flex items-center gap-1"
                >
                  <Phone className="w-3 h-3" />
                  <span>{selectedApplicant.phone}</span>
                </a>
              </div>
              <div className="bg-[#0c0f16] p-3 rounded-xl border border-white/[0.06]">
                <span className="text-zinc-500 block mb-1">سن و جنسیت:</span>
                <span className="font-bold text-zinc-200">
                  {selectedApplicant.age} سال ({selectedApplicant.gender === 'male' ? 'آقا' : 'خانم'})
                </span>
              </div>
              <div className="bg-[#0c0f16] p-3 rounded-xl border border-white/[0.06]">
                <span className="text-zinc-500 block mb-1">وضعیت سربازی:</span>
                <span className="font-bold text-zinc-200">
                  {selectedApplicant.militaryStatus === 'completed' ? 'پایان خدمت' :
                   selectedApplicant.militaryStatus === 'educational_exempt' ? 'معافیت تحصیلی' :
                   selectedApplicant.militaryStatus === 'medical_exempt' ? 'معافیت پزشکی' :
                   selectedApplicant.militaryStatus === 'not_applicable' ? 'غیرمشمول' : 'مشمول'}
                </span>
              </div>

              <div className="bg-[#0c0f16] p-3 rounded-xl border border-white/[0.06]">
                <span className="text-zinc-500 block mb-1">رشته و مدرک:</span>
                <span className="font-bold text-zinc-200">
                  {selectedApplicant.field || 'نامشخص'} ({selectedApplicant.degree || '—'})
                </span>
              </div>
              <div className="bg-[#0c0f16] p-3 rounded-xl border border-white/[0.06]">
                <span className="text-zinc-500 block mb-1">سابقه کار و شغل:</span>
                <span className="font-bold text-zinc-200">
                  {selectedApplicant.yearsExperience || 0} سال ({selectedApplicant.jobTitle || 'نامشخص'})
                </span>
              </div>
              <div className="bg-[#0c0f16] p-3 rounded-xl border border-white/[0.06]">
                <span className="text-zinc-500 block mb-1">بودجه نقدی دلاری:</span>
                <span className="font-bold text-emerald-400 font-mono">
                  ${selectedApplicant.liquidBudgetUSD?.toLocaleString() || 0}
                </span>
              </div>
              {selectedApplicant.telegramId && (
                <div className="bg-[#0c0f16] p-3 rounded-xl border border-cyan-500/20">
                  <span className="text-zinc-500 block mb-1">آیدی تلگرام:</span>
                  <a
                    href={`https://t.me/${selectedApplicant.telegramId.replace('@', '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-cyan-400 font-bold hover:underline dir-ltr text-right block"
                  >
                    {selectedApplicant.telegramId.startsWith('@') ? selectedApplicant.telegramId : `@${selectedApplicant.telegramId}`}
                  </a>
                </div>
              )}
            </div>

            {/* نتیجه ارزیابی اختصاصی */}
            {selectedApplicant.status !== 'lead' && (
              <div className="bg-indigo-950/30 border border-indigo-500/20 rounded-2xl p-4 space-y-2">
                <div className="text-xs font-bold text-indigo-300">نتیجه ارزیابی هوش مصنوعی:</div>
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div>
                    کشور پیشنهادی برتر: <span className="font-bold text-white">{selectedApplicant.topCountry}</span>
                  </div>
                  <div>
                    روش پیشنهادی: <span className="font-bold text-indigo-200">{selectedApplicant.recommendedPathway}</span>
                  </div>
                  <div>
                    شانس ویزا: <span className="font-bold text-emerald-400 font-mono">%{selectedApplicant.matchScore}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-white/[0.06]">
              <a
                href={`tel:${selectedApplicant.phone}`}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>تماس با متقاضی ({selectedApplicant.phone})</span>
              </a>
              <button
                onClick={() => setSelectedApplicant(null)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-bold transition"
              >
                بستن پنجره
              </button>
            </div>

          </div>
        </div>
      )}

      {/* مودال گزارش بیگ دیتای هوش مصنوعی */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#11141d] border border-white/[0.1] rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 text-right shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <h3 className="text-lg font-bold text-white">گزارش استراتژیک هوش مصنوعی (Executive AI Report)</h3>
              </div>
              <button
                onClick={() => setShowAiModal(false)}
                className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {isAiLoading ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-zinc-400">هوش مصنوعی در حال تحلیل متقاطع تمام داده‌های آماری متقاضیان است...</p>
              </div>
            ) : (
              <div className="text-xs sm:text-sm text-zinc-300 leading-relaxed space-y-3 whitespace-pre-wrap bg-[#0c0f16] p-5 rounded-2xl border border-white/[0.06]">
                {aiReport}
              </div>
            )}

            <div className="flex justify-end pt-3 border-t border-white/[0.06]">
              <button
                onClick={() => setShowAiModal(false)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-bold transition"
              >
                متوجه شدم و بستن
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
