'use client';

import React, { useState, useEffect } from 'react';
import { 
  ApplicantRecord, 
  ApplicantStatistics, 
  TimeRangeFilter,
  GlobalOpportunity 
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
  Headphones,
  Radio,
  Plus,
  Trash2,
  Globe,
  ExternalLink,
  Flame,
  GraduationCap,
  Briefcase
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [adminKey, setAdminKey] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [inputKey, setInputKey] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);

  // تب فعال در داشبورد: متقاضیان یا رادار
  const [activeTab, setActiveTab] = useState<'applicants' | 'radar'>('applicants');

  // استیت‌های متقاضیان
  const [timeRange, setTimeRange] = useState<TimeRangeFilter>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'lead' | 'consultation_requested'>('all');
  const [search, setSearch] = useState<string>('');
  const [applicants, setApplicants] = useState<ApplicantRecord[]>([]);
  const [stats, setStats] = useState<ApplicantStatistics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedApplicant, setSelectedApplicant] = useState<ApplicantRecord | null>(null);

  // استیت‌های رادار فرصت‌ها
  const [radarOpps, setRadarOpps] = useState<GlobalOpportunity[]>([]);
  const [isRadarLoading, setIsRadarLoading] = useState<boolean>(false);
  const [isAiRefreshingRadar, setIsAiRefreshingRadar] = useState<boolean>(false);
  const [radarMessage, setRadarMessage] = useState<string | null>(null);
  const [radarSearch, setRadarSearch] = useState<string>('');
  const [radarRegionFilter, setRadarRegionFilter] = useState<string>('all');
  const [showAddOppModal, setShowAddOppModal] = useState<boolean>(false);

  // فرم افزودن فرصت جدید
  const [newTitle, setNewTitle] = useState('');
  const [newCountry, setNewCountry] = useState('آلمان');
  const [newFlag, setNewFlag] = useState('🇩🇪');
  const [newRegion, setNewRegion] = useState<'europe' | 'americas' | 'asia_turkey' | 'gulf'>('europe');
  const [newCity, setNewCity] = useState('');
  const [newType, setNewType] = useState<'job_offer' | 'scholarship' | 'university_admission' | 'job_seeker_visa'>('job_offer');
  const [newCompany, setNewCompany] = useState('');
  const [newSalary, setNewSalary] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [newDeadline, setNewDeadline] = useState('');
  const [newVisaType, setNewVisaType] = useState('');
  const [newSummary, setNewSummary] = useState('');
  const [newApplyUrl, setNewApplyUrl] = useState('');
  const [newIsHot, setNewIsHot] = useState<boolean>(true);

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

  const fetchRadarData = async (keyToUse: string = adminKey) => {
    setIsRadarLoading(true);
    try {
      const res = await fetch('/api/admin/opportunities', {
        headers: { 'x-admin-key': keyToUse },
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setRadarOpps(json.opportunities || []);
        }
      }
    } catch (e) {
      console.error('Error fetching radar data:', e);
    } finally {
      setIsRadarLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && adminKey) {
      if (activeTab === 'applicants') {
        fetchData(adminKey, timeRange, search, statusFilter);
      } else {
        fetchRadarData(adminKey);
      }
    }
  }, [isAuthenticated, activeTab, timeRange, statusFilter]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputKey.trim()) return;
    setAdminKey(inputKey);
    fetchData(inputKey, timeRange, search, statusFilter);
    fetchRadarData(inputKey);
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
        setAiReport('خطا در تولید گزارش هوش مصنوعی. لطفاً مجدداً تلاش کنید.');
      }
    } catch {
      setAiReport('خطای ارتباط با سرور.');
    } finally {
      setIsAiLoading(false);
    }
  };

  // اکشن‌های رادار
  const handleAiRadarRefresh = async () => {
    setIsAiRefreshingRadar(true);
    setRadarMessage(null);
    try {
      const res = await fetch('/api/admin/opportunities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
        },
        body: JSON.stringify({ action: 'refresh_ai' }),
      });
      const data = await res.json();
      if (data.success) {
        setRadarMessage(data.message);
        if (Array.isArray(data.opportunities)) {
          setRadarOpps(data.opportunities);
        }
      } else {
        setRadarMessage(data.error || 'خطا در تازه‌سازی هوشمند رادار');
      }
    } catch {
      setRadarMessage('خطای ارتباط با سرور در هنگام به‌روزرسانی رادار.');
    } finally {
      setIsAiRefreshingRadar(false);
    }
  };

  const handleDeleteOpp = async (id: string) => {
    if (!confirm('آیا از حذف این موقعیت از رادار اطمینان دارید؟')) return;
    try {
      const res = await fetch(`/api/admin/opportunities?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { 'x-admin-key': adminKey },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.opportunities)) {
        setRadarOpps(data.opportunities);
      }
    } catch {
      alert('خطا در حذف موقعیت.');
    }
  };

  const handleCreateOppSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newCountry.trim()) return;

    const opp: GlobalOpportunity = {
      id: `dyn_admin_${Date.now()}`,
      title: newTitle.trim(),
      country: newCountry.trim(),
      countryFlag: newFlag.trim() || '🌐',
      region: newRegion,
      city: newCity.trim(),
      type: newType,
      typeLabel: newType === 'job_offer' ? 'جاب‌آفر با اسپانسرشیپ ویزا' : newType === 'scholarship' ? 'بورسیه فول‌فاند' : 'پذیرش تحصیلی',
      institutionOrCompany: newCompany.trim() || 'مرجع بین‌المللی',
      salaryOrFund: newSalary.trim() || 'طبق مصوبات حقوق ۲۰۲۶',
      languageRequirement: newLanguage.trim() || 'انگلیسی آکادمیک یا کاری',
      deadline: newDeadline.trim() || 'تا زمان تکمیل ظرفیت',
      visaType: newVisaType.trim() || 'ویزای کاری / تحصیلی استاندارد',
      iranianCompatibility: {
        successRate: 92,
        embassyDifficulty: 'moderate',
        militarySensitive: false,
        keyRequirements: ['مدارک معتبر و رزومه همسو با الزامات اعلامی'],
        embassyNotes: 'پرونده با ارائه نامه معتبر کارفرما یا دانشگاه با اولویت بررسی می‌شود.',
      },
      summary: newSummary.trim() || newTitle.trim(),
      stepsToApply: ['بررسی شرایط کامل در لینک مرجع', 'آماده‌سازی مدارک و ترجمه رسمی', 'سابمیت پرونده در پرتال رسمی'],
      applyUrl: newApplyUrl.trim() || 'https://google.com',
      tags: [newCountry, newType === 'job_offer' ? 'کاری' : 'تحصیلی'],
      publishedDate: new Intl.DateTimeFormat('fa-IR', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()),
      isHot: newIsHot,
    };

    try {
      const res = await fetch('/api/admin/opportunities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
        },
        body: JSON.stringify({ opportunity: opp }),
      });
      const data = await res.json();
      if (data.success) {
        if (Array.isArray(data.opportunities)) {
          setRadarOpps(data.opportunities);
        }
        setShowAddOppModal(false);
        setNewTitle('');
        setNewCompany('');
        setNewSalary('');
        setNewCity('');
        setNewSummary('');
        setNewApplyUrl('');
      } else {
        alert(data.error || 'خطا در ثبت فرصت');
      }
    } catch {
      alert('خطا در ارسال اطلاعات به سرور');
    }
  };

  // فیلتر رادار در پنل ادمین
  const filteredRadarOpps = radarOpps.filter((item) => {
    if (radarRegionFilter !== 'all' && item.region !== radarRegionFilter) return false;
    if (radarSearch.trim()) {
      const q = radarSearch.trim().toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.country.toLowerCase().includes(q) ||
        item.institutionOrCompany.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // صفحه لاگین
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#07090e] text-white flex items-center justify-center p-4">
        <div className="bg-[#11141d] border border-white/[0.08] rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6 text-right">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-2xl mx-auto flex items-center justify-center mb-3">
              <Shield className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-bold">پنل مدیریت هوشمند کوچ‌یار</h1>
            <p className="text-xs text-zinc-400">
              دسترسی به اطلاعات آماری متقاضیان، مدیریت رادار فرصت‌ها و تحلیل بیگ دیتا
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-2">
                رمز عبور مدیریت (Admin Key):
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  placeholder="رمز عبور ادمین را وارد کنید..."
                  className="w-full bg-[#0c0f16] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition"
                  dir="ltr"
                />
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {authError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900 text-white font-bold rounded-xl text-sm transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>در حال بررسی اعتبار...</span>
                </>
              ) : (
                <span>ورود به داشبورد مدیریت</span>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <Link href="/" className="text-xs text-zinc-500 hover:text-zinc-300 transition inline-flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>بازگشت به صفحه اصلی</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // داشبورد لاگین شده
  return (
    <div className="min-h-screen bg-[#07090e] text-white p-4 sm:p-8 space-y-6 text-right">
      
      {/* هدر بالای داشبورد */}
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#11141d]/90 border border-white/[0.08] rounded-3xl p-5 sm:p-6 shadow-xl">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-indigo-400" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                داشبورد مدیریت و بیگ دیتای کوچ‌یار
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                کلود متصل
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              مدیریت زنده پرونده‌های متقاضیان، کنترل اتوماسیون رادار هوشمند روزانه و تحلیل بیگ دیتا
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {activeTab === 'applicants' ? (
              <>
                <button
                  onClick={() => fetchData(adminKey, timeRange, search, statusFilter)}
                  disabled={isLoading}
                  className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 border border-white/[0.06] cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>بروزرسانی داده‌ها</span>
                </button>

                <button
                  onClick={handleExportCSV}
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>خروجی اکسل</span>
                </button>

                <button
                  onClick={handleGenerateAiReport}
                  className="px-3.5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-600/25 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                  <span>تحلیل هوش مصنوعی</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => fetchRadarData(adminKey)}
                  disabled={isRadarLoading}
                  className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 border border-white/[0.06] cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRadarLoading ? 'animate-spin' : ''}`} />
                  <span>بروزرسانی رادار</span>
                </button>

                <button
                  onClick={handleAiRadarRefresh}
                  disabled={isAiRefreshingRadar}
                  className="px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-purple-600/25 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className={`w-3.5 h-3.5 text-amber-300 ${isAiRefreshingRadar ? 'animate-spin' : ''}`} />
                  <span>{isAiRefreshingRadar ? 'در حال تولید و به‌روزرسانی هوشمند...' : 'تولید خودکار با هوش مصنوعی'}</span>
                </button>

                <button
                  onClick={() => setShowAddOppModal(true)}
                  className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-600/20 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>افزودن فرصت جدید</span>
                </button>
              </>
            )}

            <Link
              href="/"
              className="px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-xl text-xs font-semibold transition border border-white/[0.06]"
            >
              مشاهده سایت
            </Link>
          </div>
        </div>

        {/* سوییچر تب‌های اصلی پنل ادمین */}
        <div className="flex items-center gap-2 p-1.5 bg-[#11141d] rounded-2xl border border-white/[0.08] max-w-md shadow-lg">
          <button
            type="button"
            onClick={() => setActiveTab('applicants')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'applicants'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>پرونده‌ها و متقاضیان ({applicants.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('radar');
              if (radarOpps.length === 0) fetchRadarData(adminKey);
            }}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'radar'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>مدیریت رادار فرصت‌ها ({radarOpps.length})</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* تب ۱: پرونده‌ها و متقاضیان                                 */}
        {/* ========================================================= */}
        {activeTab === 'applicants' && (
          <div className="space-y-6">
            {/* فیلترها و سرچ */}
            <div className="bg-[#11141d]/70 border border-white/[0.06] rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
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
                  <div className="text-xl sm:text-2xl font-black text-cyan-400 truncate">
                    {Object.entries(stats.countryDistribution || {}).sort((a, b) => b[1] - a[1])[0]?.[0] || 'آلمان'}
                  </div>
                  <div className="text-[11px] text-zinc-500">
                    انتخاب اول اکثر متقاضیان
                  </div>
                </div>

                <div className="bg-[#11141d]/90 border border-white/[0.07] rounded-2xl p-4 shadow-md space-y-1">
                  <div className="text-xs text-zinc-400 flex items-center justify-between">
                    <span>درخواست مشاوره VIP:</span>
                    <Headphones className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-2xl font-black text-purple-400 font-mono">
                    {applicants.filter(a => a.status === 'consultation_requested').length} <span className="text-xs font-normal text-zinc-500">مورد</span>
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    نیازمند تماس تلفنی فوری
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
        )}

        {/* ========================================================= */}
        {/* تب ۲: مدیریت رادار فرصت‌ها                                 */}
        {/* ========================================================= */}
        {activeTab === 'radar' && (
          <div className="space-y-6">
            
            {/* پیام وضعیت هوش مصنوعی */}
            {radarMessage && (
              <div className="p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl flex items-center justify-between text-xs text-indigo-200 shadow-md">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                  <span>{radarMessage}</span>
                </div>
                <button
                  onClick={() => setRadarMessage(null)}
                  className="text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* کارت‌های شاخص‌های رادار */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
              <div className="bg-[#11141d]/90 border border-white/[0.07] rounded-2xl p-4 shadow-md space-y-1">
                <div className="text-xs text-zinc-400 flex items-center justify-between">
                  <span>کل فرصت‌های فعال رادار:</span>
                  <Globe className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="text-2xl font-black text-white font-mono">
                  {radarOpps.length} <span className="text-xs font-normal text-zinc-500">موقعیت</span>
                </div>
                <div className="text-[11px] text-zinc-400">
                  همگام با سرور و آماده نمایش
                </div>
              </div>

              <div className="bg-[#11141d]/90 border border-white/[0.07] rounded-2xl p-4 shadow-md space-y-1">
                <div className="text-xs text-zinc-400 flex items-center justify-between">
                  <span>فرصت‌های کاری اسپانسردار:</span>
                  <Briefcase className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-emerald-400 font-mono">
                  {radarOpps.filter(i => i.type === 'job_offer').length}
                </div>
                <div className="text-[11px] text-zinc-500">
                  استخدام با ویزای تخصصی
                </div>
              </div>

              <div className="bg-[#11141d]/90 border border-white/[0.07] rounded-2xl p-4 shadow-md space-y-1">
                <div className="text-xs text-zinc-400 flex items-center justify-between">
                  <span>بورسیه‌های تحصیلی و فاند:</span>
                  <GraduationCap className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl font-black text-purple-400 font-mono">
                  {radarOpps.filter(i => i.type === 'scholarship' || i.type === 'university_admission').length}
                </div>
                <div className="text-[11px] text-zinc-500">
                  فول‌فاند و شهریه رایگان
                </div>
              </div>

              <div className="bg-[#11141d]/90 border border-white/[0.07] rounded-2xl p-4 shadow-md space-y-1">
                <div className="text-xs text-zinc-400 flex items-center justify-between">
                  <span>موقعیت‌های داغ ویژه (Hot):</span>
                  <Flame className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-black text-amber-400 font-mono">
                  {radarOpps.filter(i => i.isHot).length}
                </div>
                <div className="text-[11px] text-zinc-500">
                  بیشترین تطابق با ایرانیان
                </div>
              </div>
            </div>

            {/* فیلترها و سرچ در رادار */}
            <div className="bg-[#11141d]/70 border border-white/[0.06] rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {(
                  [
                    { key: 'all', label: 'همه مناطق' },
                    { key: 'europe', label: 'اروپا و اسکاندیناوی' },
                    { key: 'americas', label: 'آمریکا و کانادا و استرالیا' },
                    { key: 'gulf', label: 'حاشیه خلیج فارس' },
                    { key: 'asia_turkey', label: 'آسیا و ترکیه' },
                  ] as const
                ).map((reg) => (
                  <button
                    key={reg.key}
                    onClick={() => setRadarRegionFilter(reg.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      radarRegionFilter === reg.key
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-200 bg-[#0c0f16]'
                    }`}
                  >
                    {reg.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full md:w-72">
                <input
                  type="text"
                  value={radarSearch}
                  onChange={(e) => setRadarSearch(e.target.value)}
                  placeholder="جستجو در عنوان، کشور، شرکت..."
                  className="w-full bg-[#0c0f16] border border-white/[0.08] rounded-xl pr-9 pl-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition"
                />
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* جدول فرصت‌های رادار */}
            <div className="bg-[#11141d]/90 border border-white/[0.08] rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <span>جدول فرصت‌های رادار هوشمند</span>
                  <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full font-mono">
                    {filteredRadarOpps.length} مورد
                  </span>
                </h2>

                <div className="text-xs text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>زمان‌بندی کران Vercel فعال (روزانه 06:00 UTC)</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-white/[0.06] text-zinc-400">
                      <th className="py-3 px-3">کشور</th>
                      <th className="py-3 px-3">نوع</th>
                      <th className="py-3 px-3">عنوان موقعیت</th>
                      <th className="py-3 px-3">شرکت / دانشگاه</th>
                      <th className="py-3 px-3">حقوق یا فاند</th>
                      <th className="py-3 px-3">ددلاین</th>
                      <th className="py-3 px-3">تاریخ ثبت</th>
                      <th className="py-3 px-3 text-center">عملیات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {filteredRadarOpps.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-zinc-500">
                          موقعیتی با این مشخصات یافت نشد.
                        </td>
                      </tr>
                    ) : (
                      filteredRadarOpps.map((opp) => (
                        <tr key={opp.id} className="hover:bg-zinc-800/40 transition group">
                          <td className="py-3 px-3 font-bold text-white whitespace-nowrap">
                            <span className="ml-1.5 text-base">{opp.countryFlag}</span>
                            <span>{opp.country}</span>
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap">
                            {opp.type === 'job_offer' ? (
                              <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
                                جاب‌آفر کاری
                              </span>
                            ) : opp.type === 'scholarship' ? (
                              <span className="px-2 py-0.5 rounded-md bg-purple-500/15 text-purple-300 border border-purple-500/30 text-[11px] font-bold">
                                بورسیه تحصیلی
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-md bg-blue-500/15 text-blue-300 border border-blue-500/30 text-[11px] font-bold">
                                پذیرش / ویزا
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 font-semibold text-zinc-200 group-hover:text-indigo-300 max-w-xs truncate">
                            {opp.isHot && <span className="text-amber-400 ml-1">🔥</span>}
                            <span>{opp.title}</span>
                          </td>
                          <td className="py-3 px-3 text-zinc-400 truncate max-w-[130px]">
                            {opp.institutionOrCompany}
                          </td>
                          <td className="py-3 px-3 font-bold text-emerald-400 text-[11px]">
                            {opp.salaryOrFund}
                          </td>
                          <td className="py-3 px-3 text-zinc-400 whitespace-nowrap font-mono text-[11px]">
                            {opp.deadline}
                          </td>
                          <td className="py-3 px-3 text-zinc-500 font-mono text-[11px] whitespace-nowrap">
                            {opp.publishedDate}
                          </td>
                          <td className="py-3 px-3 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1.5">
                              {opp.applyUrl && (
                                <a
                                  href={opp.applyUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition"
                                  title="مشاهده لینک اپلای"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              )}
                              <button
                                type="button"
                                onClick={() => handleDeleteOpp(opp.id)}
                                className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition"
                                title="حذف از رادار"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* مودال افزودن فرصت جدید */}
      {showAddOppModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#11141d] border border-white/[0.1] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 text-right shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2.5">
                <Plus className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-white">افزودن موقعیت جدید به رادار روزانه</h3>
              </div>
              <button
                onClick={() => setShowAddOppModal(false)}
                className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateOppSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">عنوان کامل موقعیت:</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="مثلاً: مهندس نرم‌افزار ارشد در برلین"
                    className="w-full bg-[#0c0f16] border border-white/[0.1] rounded-xl px-3 py-2 text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">شرکت یا دانشگاه:</label>
                  <input
                    type="text"
                    required
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    placeholder="مثلاً: SAP SE یا دانشگاه صنعتی مونیخ"
                    className="w-full bg-[#0c0f16] border border-white/[0.1] rounded-xl px-3 py-2 text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">نام کشور:</label>
                  <input
                    type="text"
                    required
                    value={newCountry}
                    onChange={(e) => setNewCountry(e.target.value)}
                    placeholder="آلمان"
                    className="w-full bg-[#0c0f16] border border-white/[0.1] rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">اموجی پرچم:</label>
                  <input
                    type="text"
                    value={newFlag}
                    onChange={(e) => setNewFlag(e.target.value)}
                    placeholder="🇩🇪"
                    className="w-full bg-[#0c0f16] border border-white/[0.1] rounded-xl px-3 py-2 text-white text-center"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">شهر:</label>
                  <input
                    type="text"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    placeholder="برلین"
                    className="w-full bg-[#0c0f16] border border-white/[0.1] rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">منطقه:</label>
                  <select
                    value={newRegion}
                    onChange={(e) => setNewRegion(e.target.value as any)}
                    className="w-full bg-[#0c0f16] border border-white/[0.1] rounded-xl px-2 py-2 text-white"
                  >
                    <option value="europe">اروپا</option>
                    <option value="americas">آمریکا و کانادا و استرالیا</option>
                    <option value="gulf">خلیج فارس</option>
                    <option value="asia_turkey">آسیا و ترکیه</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">نوع موقعیت:</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full bg-[#0c0f16] border border-white/[0.1] rounded-xl px-2 py-2 text-white"
                  >
                    <option value="job_offer">جاب‌آفر با اسپانسرشیپ ویزا</option>
                    <option value="scholarship">بورسیه فول‌فاند</option>
                    <option value="university_admission">پذیرش تحصیلی</option>
                    <option value="job_seeker_visa">ویزای جستجوی کار</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">حقوق یا فاند:</label>
                  <input
                    type="text"
                    value={newSalary}
                    onChange={(e) => setNewSalary(e.target.value)}
                    placeholder="۷۰,۰۰۰ یورو سالانه"
                    className="w-full bg-[#0c0f16] border border-white/[0.1] rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">ددلاین اپلای:</label>
                  <input
                    type="text"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    placeholder="۳۰ روز آینده"
                    className="w-full bg-[#0c0f16] border border-white/[0.1] rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">شرایط زبانی:</label>
                  <input
                    type="text"
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    placeholder="انگلیسی C1 (بدون نیاز به زبان محلی)"
                    className="w-full bg-[#0c0f16] border border-white/[0.1] rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">نوع ویزا:</label>
                  <input
                    type="text"
                    value={newVisaType}
                    onChange={(e) => setNewVisaType(e.target.value)}
                    placeholder="EU Blue Card یا Student Visa"
                    className="w-full bg-[#0c0f16] border border-white/[0.1] rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">لینک مستقیم اپلای یا وب‌سایت:</label>
                <input
                  type="url"
                  value={newApplyUrl}
                  onChange={(e) => setNewApplyUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-[#0c0f16] border border-white/[0.1] rounded-xl px-3 py-2 text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">خلاصه توضیحات:</label>
                <textarea
                  rows={2}
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder="توضیح کوتاه درباره فرصت و امتیازات آن برای ایرانیان..."
                  className="w-full bg-[#0c0f16] border border-white/[0.1] rounded-xl px-3 py-2 text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="hotCheck"
                  checked={newIsHot}
                  onChange={(e) => setNewIsHot(e.target.checked)}
                  className="rounded border-zinc-700 bg-zinc-800 text-indigo-600 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="hotCheck" className="text-zinc-300 font-semibold cursor-pointer flex items-center gap-1">
                  <span>نمایش به عنوان موقعیت ویژه و داغ (Hot Opportunity 🔥)</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setShowAddOppModal(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl font-bold transition"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
                >
                  <Plus className="w-4 h-4" />
                  <span>ثبت و انتشار در رادار</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* مودال مشاهده کامل پرونده متقاضی */}
      {selectedApplicant && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#11141d] border border-white/[0.1] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 text-right shadow-2xl">
            
            {/* هدر مودال */}
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    پرونده مهاجرتی: {selectedApplicant.fullName}
                  </h3>
                  <p className="text-xs text-zinc-400">
                    ثبت‌شده در تاریخ {selectedApplicant.shamsiDate}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedApplicant(null)}
                className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition"
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
                  <span className="font-mono text-cyan-300 font-bold">
                    @{selectedApplicant.telegramId.replace('@', '')}
                  </span>
                </div>
              )}
            </div>

            {/* نتیجه تحلیل و کشور پیشنهادی */}
            {selectedApplicant.topCountry && (
              <div className="bg-[#0c0f16] p-4 rounded-2xl border border-white/[0.06] space-y-2">
                <div className="text-xs text-zinc-400 flex items-center justify-between">
                  <span>نتیجه تحلیل هوش مصنوعی:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    شانس ویزا: %{selectedApplicant.matchScore}
                  </span>
                </div>
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="text-indigo-400">کشور پیشنهادی اول:</span>
                  <span>{selectedApplicant.topCountry}</span>
                </div>
                {selectedApplicant.recommendedPathway && (
                  <div className="text-xs text-zinc-300">
                    مسیر پیشنهادی: <span className="text-amber-300 font-medium">{selectedApplicant.recommendedPathway}</span>
                  </div>
                )}
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
