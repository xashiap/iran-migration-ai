'use client';

import React, { useState } from 'react';
import { AnalysisResult, CountryRecommendation, UserProfile } from '@/types/migration';
import { RoadmapTimeline } from './RoadmapTimeline';
import { CostEstimator } from './CostEstimator';
import { AICounselorChat } from './AICounselorChat';
import { EmbassyInterviewSimulator } from '../Interview/EmbassyInterviewSimulator';
import { ResumeBuilderModal } from '../Resume/ResumeBuilderModal';
import { ConsultationBookingModal } from './ConsultationBookingModal';
import { TelegramAlertBanner } from '../Radar/TelegramAlertBanner';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Printer, 
  ArrowRight, 
  DollarSign, 
  MapPin, 
  Brain, 
  ShieldCheck,
  Zap,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Building2,
  Clock,
  Sparkles,
  Award,
  FileText,
  PhoneCall
} from 'lucide-react';
import { formatCostStringWithToman } from '@/lib/currency';

interface DossierDashboardProps {
  result: AnalysisResult;
  profile?: UserProfile;
  onEditProfile: () => void;
  onReset: () => void;
  usdTomanRate?: number;
  eurTomanRate?: number;
  apiKey?: string;
}

export const DossierDashboard: React.FC<DossierDashboardProps> = ({
  result,
  profile,
  onEditProfile,
  onReset,
  usdTomanRate = 231300,
  eurTomanRate = 268130,
  apiKey,
}) => {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'counselor' | 'interview' | 'finance' | 'ai_insights'>('roadmap');
  const [selectedCountry, setSelectedCountry] = useState<CountryRecommendation>(result.topCountries[0]);
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);
  const [showResumeModal, setShowResumeModal] = useState<boolean>(false);
  const [showConsultationModal, setShowConsultationModal] = useState<boolean>(false);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* سربرگ گزارش رسمی */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>پرونده با موفقیت تحلیل شد</span>
              </span>
              <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full text-xs font-medium">
                {result.profilePersona}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              داشبورد برنامه جامع مهاجرت شما از ایران
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed">
              {result.overallSummary}
            </p>
          </div>

          {/* شاخص آمادگی پرونده */}
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-5 flex flex-col items-center justify-center text-center flex-shrink-0 shadow-lg min-w-[180px]">
            <div className="text-xs text-slate-400 mb-1">نمره آمادگی پرونده:</div>
            <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-400 font-mono">
              {result.readinessScore}/۱۰۰
            </div>
            <div className="text-[11px] text-emerald-400 font-bold mt-1.5 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>پتانسیل موفقیت عالی</span>
            </div>
          </div>
        </div>

        {/* دکمه‌های پرینت و عملیات */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-6 mt-6 border-t border-slate-800/80 no-print">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onEditProfile}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <ArrowRight className="w-4 h-4" />
              <span>ویرایش پاسخ‌های فرم</span>
            </button>
            <button
              onClick={onReset}
              className="px-4 py-2 bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-xl text-xs transition"
            >
              شروع ارزیابی جدید
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowResumeModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-lg shadow-indigo-600/20"
            >
              <FileText className="w-4 h-4 text-indigo-200" />
              <span>ساخت رزومه بین‌المللی (CV)</span>
            </button>

            <button
              onClick={() => setShowConsultationModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-lg shadow-amber-600/20"
            >
              <PhoneCall className="w-4 h-4 text-amber-200" />
              <span>رزرو مشاوره VIP و وکیل</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
            >
              <Printer className="w-4 h-4 text-slate-300" />
              <span>چاپ (PDF)</span>
            </button>
          </div>
        </div>
      </div>

      {/* هشدارهای ویژه شهروندان ایرانی */}
      {result.iranSpecificAlerts && result.iranSpecificAlerts.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 px-1">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>هشدارهای حقوقی، اداری و مالی مختص شرایط فعلی در ایران:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {result.iranSpecificAlerts.map((alert, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border text-right transition ${
                  alert.severity === 'critical'
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                    : alert.severity === 'warning'
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                    : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-200'
                }`}
              >
                <div className="font-bold text-xs sm:text-sm mb-1.5 flex items-center justify-between">
                  <span>{alert.title}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                      alert.severity === 'critical'
                        ? 'bg-rose-500/20 text-rose-300'
                        : alert.severity === 'warning'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-indigo-500/20 text-indigo-300'
                    }`}
                  >
                    {alert.severity === 'critical' ? 'حیاتی' : alert.severity === 'warning' ? 'مهم' : 'راهنما'}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed opacity-90">{alert.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* فرصت‌های فعال امروز منطبق با تخصص کاربر */}
      {result.dailyMatches && result.dailyMatches.length > 0 && (
        <div className="bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* سربرگ بخش موقعیت‌ها */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4 relative z-10">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Zap className="w-5 h-5 fill-amber-400/20 animate-pulse" />
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  فرصت‌های طلایی و جاب‌آفرهای فعال امروز منطبق با پرونده شما
                </h3>
                <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                  آپدیت زنده
                </span>
              </div>
              <p className="text-xs text-slate-300">
                سیستم رادار بین‌المللی بر پایه رشته تحصیلی، شغل، سوابق و بودجه شما این موقعیت‌های واقعی را استخراج کرده است:
              </p>
            </div>

            <div className="text-xs text-slate-400 font-mono bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-2 self-start sm:self-auto">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>{result.dailyMatches.length} موقعیت با تطابق بالای ۸۰٪</span>
            </div>
          </div>

          {/* لیست کارت‌های موقعیت */}
          <div className="grid grid-cols-1 gap-4 relative z-10">
            {result.dailyMatches.map((opp) => {
              const isExpanded = expandedMatchId === opp.id;

              return (
                <div 
                  key={opp.id}
                  className="bg-slate-950/70 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-5 sm:p-6 transition shadow-lg space-y-4"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xl">{opp.countryFlag}</span>
                        <span className="font-bold text-sm text-white">{opp.country}</span>
                        {opp.city && <span className="text-xs text-slate-400">({opp.city})</span>}
                        <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] px-2.5 py-0.5 rounded-full font-semibold">
                          {opp.typeLabel}
                        </span>
                        {opp.isHot && (
                          <span className="bg-rose-500/20 text-rose-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-500/30">
                            🔥 با تقاضای بالا
                          </span>
                        )}
                      </div>

                      <h4 className="text-base sm:text-lg font-bold text-white leading-snug">
                        {opp.title}
                      </h4>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                          <span>{opp.institutionOrCompany}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                          <DollarSign className="w-3.5 h-3.5" />
                          <span>{opp.salaryOrFund}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          <span>مهلت: {opp.deadline}</span>
                        </div>
                      </div>
                    </div>

                    {/* بج درصد تطابق و دکمه اقدام */}
                    <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 flex-shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                      <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5">
                        <Award className="w-4 h-4" />
                        <span>٪{opp.matchPercentage} تطابق با پرونده</span>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => setExpandedMatchId(isExpanded ? null : opp.id)}
                          className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs rounded-xl border border-slate-700 transition flex items-center gap-1"
                        >
                          <span>{isExpanded ? 'بستن جزئیات' : 'مراحل اقدام'}</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                        <a
                          href={opp.applyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-indigo-600/20 flex items-center gap-1.5"
                        >
                          <span>سامانه رسمی اقدام</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* جعبه دلیل تطابق پرونده */}
                  <div className="bg-indigo-950/30 border border-indigo-500/20 rounded-xl p-3 text-xs text-indigo-200 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white font-bold">چرا این موقعیت برای شما انتخاب شد: </strong>
                      <span>{opp.matchReason}</span>
                    </div>
                  </div>

                  {/* بخش کشویی مراحل اقدام و نکات سفارت */}
                  {isExpanded && (
                    <div className="pt-3 border-t border-slate-800/80 space-y-4 animate-in fade-in duration-300 text-xs">
                      <p className="text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                        {opp.summary}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl space-y-2">
                          <div className="font-bold text-slate-200 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>پیش‌نیازهای کلیدی برای متقاضی ایرانی:</span>
                          </div>
                          <ul className="space-y-1.5 text-slate-300 pr-3 list-disc">
                            {opp.iranianCompatibility.keyRequirements.map((req, rIdx) => (
                              <li key={rIdx}>{req}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl space-y-2">
                          <div className="font-bold text-slate-200 flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                            <span>وضعیت ویزا و سفارت برای ایرانیان:</span>
                          </div>
                          <div className="space-y-1 text-slate-300">
                            <div>شانس دریافت ویزا: <strong className="text-emerald-400">٪{opp.iranianCompatibility.successRate}</strong></div>
                            <div>نوع ویزا: <strong className="text-white">{opp.visaType}</strong></div>
                            <div className="text-[11px] text-slate-400 mt-1">{opp.iranianCompatibility.embassyNotes}</div>
                          </div>
                        </div>
                      </div>

                      {/* مراحل گام به گام */}
                      <div className="bg-indigo-950/20 border border-indigo-900/30 p-4 rounded-xl space-y-2">
                        <div className="font-bold text-indigo-300">گام‌های عملی ثبت درخواست:</div>
                        <div className="space-y-2">
                          {opp.stepsToApply.map((step, sIdx) => (
                            <div key={sIdx} className="flex items-start gap-2 text-slate-200">
                              <span className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-300 font-mono text-[11px] flex items-center justify-center flex-shrink-0">
                                {sIdx + 1}
                              </span>
                              <span className="leading-relaxed">{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* بنر اطلاع‌رسانی فرصت‌ها در تلگرام */}
      <TelegramAlertBanner
        userField={profile?.education?.field || profile?.work?.jobTitle || 'رشته و تخصص شما'}
        userPhone={profile?.personal?.phone}
      />

      {/* بخش رتبه‌بندی کشورهای پیشنهادی */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-indigo-400" />
            <span>بهترین کشورهای متناسب با شرایط شما (رتبه‌بندی شده):</span>
          </h3>
          <span className="text-xs text-slate-400">روی هر کشور کلیک کنید تا جزئیات نمایش یابد</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {result.topCountries.map((c, index) => {
            const isSelected = selectedCountry.countryId === c.countryId;

            return (
              <button
                key={c.countryId}
                onClick={() => setSelectedCountry(c)}
                className={`p-4 rounded-2xl border text-right transition group relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-indigo-600/15 border-indigo-500 text-white shadow-xl shadow-indigo-500/10 ring-1 ring-indigo-500'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-2xl">{c.flag}</span>
                    <span
                      className={`text-xs font-bold font-mono px-2 py-0.5 rounded-full ${
                        index === 0
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {c.matchScore}٪ تطابق
                    </span>
                  </div>

                  <h4 className="font-bold text-sm sm:text-base text-white group-hover:text-indigo-300 transition">
                    {c.countryName}
                  </h4>
                  <div className="text-[11px] text-indigo-400 font-semibold mt-0.5 line-clamp-1">
                    {c.recommendedPathway}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>زمان تقریبی:</span>
                  <span className="font-bold text-slate-200">{c.estimatedTimeMonths}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* نمایش جزئیات کشور انتخاب شده */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl sm:text-4xl">{selectedCountry.flag}</span>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-lg sm:text-xl font-black text-white">
                  {selectedCountry.countryName} ({selectedCountry.countryNameEn})
                </h4>
                <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-bold">
                  {selectedCountry.matchScore}٪ تطابق هوشمند
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                روش پیشنهادی: <strong className="text-slate-200">{selectedCountry.recommendedPathway}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-left bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-400">حداقل سرمایه تخمینی:</div>
              <div className="text-xs sm:text-sm font-bold text-emerald-400 font-mono">
                {selectedCountry.estimatedCostUSD}
              </div>
              <div className="text-[10px] text-emerald-300/90 font-medium mt-0.5">
                {formatCostStringWithToman(selectedCountry.estimatedCostUSD, usdTomanRate, eurTomanRate).replace(selectedCountry.estimatedCostUSD, '').trim()}
              </div>
            </div>
          </div>
        </div>

        {/* نقاط قوت و ضعف این کشور */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4">
            <div className="text-xs font-bold text-emerald-400 mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>مزایای اصلی این انتخاب برای شما:</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {selectedCountry.pros.map((p, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-4">
            <div className="text-xs font-bold text-rose-400 mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>چالش‌ها و نکات نیازمند دقت:</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {selectedCountry.cons.map((c, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-rose-400">!</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* تب‌های اصلی محتوا (نقشه راه، مستشار AI، مصاحبه سفارت، برآورد هزینه‌ها، تحلیل هوش مصنوعی) */}
      <div className="space-y-6">
        <div className="flex flex-wrap border-b border-slate-800 no-print gap-1">
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`px-4 sm:px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'roadmap'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>نقشه راه گام‌به‌گام (فاز ۰ تا فرودگاه)</span>
          </button>

          <button
            onClick={() => setActiveTab('counselor')}
            className={`px-4 sm:px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'counselor'
                ? 'border-cyan-500 text-cyan-400 bg-cyan-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Brain className="w-4 h-4 text-cyan-400" />
            <span>مستشار هوش مصنوعی (۵ سوال)</span>
            <span className="bg-cyan-500/20 text-cyan-300 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
              آنلاین
            </span>
          </button>

          <button
            onClick={() => setActiveTab('interview')}
            className={`px-4 sm:px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'interview'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>شبیه‌ساز مصاحبه سفارت</span>
          </button>

          <button
            onClick={() => setActiveTab('finance')}
            className={`px-4 sm:px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'finance'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>برآورد هزینه‌ها و تمکن</span>
          </button>

          <button
            onClick={() => setActiveTab('ai_insights')}
            className={`px-4 sm:px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'ai_insights'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>تحلیل و شاه‌کلیدها</span>
          </button>
        </div>

        {/* تب ۱: نقشه راه اختصاصی کشور انتخاب شده */}
        {activeTab === 'roadmap' && (
          <RoadmapTimeline
            key={selectedCountry.countryId}
            phases={selectedCountry.roadmap?.phases || result.primaryRoadmap.phases}
            targetCountry={selectedCountry.countryName}
            pathwayTitle={selectedCountry.recommendedPathway}
          />
        )}

        {/* تب ۲: مستشار هوش مصنوعی (۵ سوال رایگان) */}
        {activeTab === 'counselor' && (
          <AICounselorChat
            profile={profile || ({} as UserProfile)}
            targetCountry={selectedCountry.countryName}
            onOpenConsultation={() => setShowConsultationModal(true)}
            apiKey={apiKey}
          />
        )}

        {/* تب ۳: شبیه‌ساز مصاحبه سفارت */}
        {activeTab === 'interview' && (
          <EmbassyInterviewSimulator
            profile={profile || ({} as UserProfile)}
            targetCountry={selectedCountry.countryName}
            apiKey={apiKey}
          />
        )}

        {/* تب ۴: هزینه‌ها */}
        {activeTab === 'finance' && (
          <CostEstimator
            financials={result.financialEstimate}
            targetCountry={selectedCountry.countryName}
            usdTomanRate={usdTomanRate}
            eurTomanRate={eurTomanRate}
          />
        )}

        {/* تب ۵: تحلیل هوش مصنوعی */}
        {activeTab === 'ai_insights' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  تحلیل موشکافانه و استراتژی اختصاصی هوش مصنوعی
                </h3>
                <p className="text-xs text-slate-400">
                  راهنمای اختصاصی نگارش شده بر اساس نقاط ضعف و قوت پرونده شما
                </p>
              </div>
            </div>

            <div className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line bg-slate-950/80 p-5 rounded-2xl border border-slate-800/80">
              {result.aiGeneratedAdvice}
            </div>

            {/* نقاط قوت کلیدی */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="text-xs font-bold text-emerald-400 mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>نقاط قوت کلیدی پرونده شما:</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  {result.keyStrengths.map((str, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-400">•</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="text-xs font-bold text-amber-400 mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>مواردی که باید در آنها دقت کنید:</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  {result.keyChallenges.map((ch, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-400">•</span>
                      <span>{ch}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* بنر رزرو مشاوره VIP و وکیل رسمی در انتهای پرونده */}
      <div className="bg-gradient-to-r from-amber-500/10 via-slate-900 to-indigo-950/40 border border-amber-500/30 rounded-3xl p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-5 shadow-2xl relative overflow-hidden">
        <div className="space-y-2 max-w-2xl relative z-10">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
            </span>
            <h3 className="text-base sm:text-lg font-black text-white">
              نیاز به بررسی دقیق‌تر پرونده توسط وکلای رسمی و کارشناسان مهاجرت دارید؟
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            اگر قرارداد کاری، نامه جاب‌آفر، پرونده سجاد، ریزنمرات خاص یا ابهاماتی در خصوص مصاحبه سفارت دارید، می‌توانید یک جلسه مشاوره تخصصی اختصاصی جهت بررسی حقوقی رزرو نمایید.
          </p>
        </div>

        <button
          onClick={() => setShowConsultationModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-2xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 shadow-xl shadow-amber-600/20 flex-shrink-0"
        >
          <PhoneCall className="w-4 h-4" />
          <span>درخواست نوبت مشاوره اختصاصی VIP</span>
        </button>
      </div>

      {/* مودال رزومه‌ساز بین‌المللی */}
      {showResumeModal && (
        <ResumeBuilderModal
          profile={profile || ({} as UserProfile)}
          targetCountry={selectedCountry.countryName}
          onClose={() => setShowResumeModal(false)}
          apiKey={apiKey}
        />
      )}

      {/* مودال رزرو مشاوره VIP */}
      {showConsultationModal && (
        <ConsultationBookingModal
          profile={profile || ({} as UserProfile)}
          targetCountry={selectedCountry.countryName}
          onClose={() => setShowConsultationModal(false)}
        />
      )}
    </div>
  );
};
