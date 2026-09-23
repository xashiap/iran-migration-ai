'use client';

import React, { useState, useMemo } from 'react';
import { IMMIGRATION_NEWS_DATABASE } from '@/data/immigrationNews';
import { GLOBAL_OPPORTUNITIES_DATABASE } from '@/data/globalOpportunities';
import { WorldRegion, OpportunityType } from '@/types/migration';
import { 
  Radio, 
  Clock, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  X, 
  Globe, 
  Briefcase, 
  GraduationCap, 
  Compass, 
  Search, 
  Flame, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles,
  DollarSign,
  Languages,
  Building2,
  Layers
} from 'lucide-react';

interface ImmigrationRadarProps {
  onClose?: () => void;
  defaultRegion?: WorldRegion;
}

export const ImmigrationRadar: React.FC<ImmigrationRadarProps> = ({ onClose, defaultRegion = 'all' }) => {
  // تب اصلی: 'opportunities' (فرصت‌های شغلی و دانشگاهی) یا 'news' (بخشنامه‌ها و سفارت‌ها)
  const [activeMainTab, setActiveMainTab] = useState<'opportunities' | 'news'>('opportunities');

  // استیت‌های بخش فرصت‌های جهانی
  const [selectedRegion, setSelectedRegion] = useState<WorldRegion>(defaultRegion);
  const [selectedType, setSelectedType] = useState<OpportunityType>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [hotOnly, setHotOnly] = useState<boolean>(false);
  const [expandedOppId, setExpandedOppId] = useState<string | null>(null);

  // استیت‌های بخش بخشنامه‌ها
  const [selectedNewsCountry, setSelectedNewsCountry] = useState<string>('all');
  const [selectedNewsCategory] = useState<string>('all');
  const [expandedNewsItems, setExpandedNewsItems] = useState<Record<string, boolean>>({});

  const toggleExpandNews = (id: string) => {
    setExpandedNewsItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleExpandOpp = (id: string) => {
    setExpandedOppId(prev => (prev === id ? null : id));
  };

  // فیلتر کردن فرصت‌های جهانی
  const filteredOpportunities = useMemo(() => {
    return GLOBAL_OPPORTUNITIES_DATABASE.filter(item => {
      if (selectedRegion !== 'all' && item.region !== selectedRegion) return false;
      if (selectedType !== 'all' && item.type !== selectedType) return false;
      if (hotOnly && !item.isHot) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchCountry = item.country.toLowerCase().includes(q);
        const matchCity = item.city ? item.city.toLowerCase().includes(q) : false;
        const matchCompany = item.institutionOrCompany.toLowerCase().includes(q);
        const matchSummary = item.summary.toLowerCase().includes(q);
        const matchTags = item.tags.some(t => t.toLowerCase().includes(q));
        if (!matchTitle && !matchCountry && !matchCity && !matchCompany && !matchSummary && !matchTags) {
          return false;
        }
      }
      return true;
    });
  }, [selectedRegion, selectedType, hotOnly, searchQuery]);

  // فیلتر کردن اخبار و بخشنامه‌ها
  const filteredNews = useMemo(() => {
    return IMMIGRATION_NEWS_DATABASE.filter(item => {
      if (selectedNewsCountry !== 'all' && item.country !== selectedNewsCountry) return false;
      if (selectedNewsCategory !== 'all' && item.category !== selectedNewsCategory) return false;
      return true;
    });
  }, [selectedNewsCountry, selectedNewsCategory]);

  // شمارش فرصت‌ها بر اساس منطقه
  const regionalCounts = useMemo(() => ({
    all: GLOBAL_OPPORTUNITIES_DATABASE.length,
    americas: GLOBAL_OPPORTUNITIES_DATABASE.filter(i => i.region === 'americas').length,
    gulf: GLOBAL_OPPORTUNITIES_DATABASE.filter(i => i.region === 'gulf').length,
    asia_turkey: GLOBAL_OPPORTUNITIES_DATABASE.filter(i => i.region === 'asia_turkey').length,
    europe: GLOBAL_OPPORTUNITIES_DATABASE.filter(i => i.region === 'europe').length,
  }), []);

  return (
    <div className="bg-[#11141d] border border-white/[0.09] rounded-3xl p-4 sm:p-7 shadow-2xl space-y-6 text-right">
      
      {/* هدر بالای رادار */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center relative shadow-inner">
            <Radio className="w-6 h-6 animate-pulse text-indigo-400" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg sm:text-xl font-black text-white">
                رادار زنده فرصت‌های جهانی و اخبار مهاجرت
              </h3>
              <span className="text-[10px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>به‌روزرسانی اختصاصی امروز</span>
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              رصد روزانه جاب‌آفرهای دارای اسپانسر ویزا، بورسیه‌های فول‌فاند و بخشنامه‌های سفارت‌ها در سراسر جهان
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition cursor-pointer border border-white/[0.06]"
              title="بستن رادار"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* انتخابگر تب اصلی (فرصت‌های روزانه vs بخشنامه‌های رسمی) */}
      <div className="flex items-center gap-2 p-1.5 bg-[#0c0f16] rounded-2xl border border-white/[0.07] max-w-md">
        <button
          type="button"
          onClick={() => setActiveMainTab('opportunities')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            activeMainTab === 'opportunities'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>فرصت‌های شغلی و دانشگاهی ({GLOBAL_OPPORTUNITIES_DATABASE.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMainTab('news')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            activeMainTab === 'news'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>بخشنامه‌ها و وقت‌های سفارت ({IMMIGRATION_NEWS_DATABASE.length})</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* تب اول: رادار فرصت‌های شغلی و دانشگاهی ۴ قطب جهان            */}
      {/* ========================================================= */}
      {activeMainTab === 'opportunities' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          
          {/* فیلترهای ۴ قطب جغرافیایی جهان */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              <span>انتخاب منطقه جغرافیایی:</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { id: 'all', label: 'همه مناطق جهان', flag: '🌐', count: regionalCounts.all },
                { id: 'gulf', label: 'حوزه خلیج فارس', flag: '🌴', count: regionalCounts.gulf, subtitle: 'دبی، عمان، قطر' },
                { id: 'americas', label: 'آمریکای شمالی', flag: '🍁', count: regionalCounts.americas, subtitle: 'کانادا و آمریکا' },
                { id: 'asia_turkey', label: 'آسیا و ترکیه', flag: '🌸', count: regionalCounts.asia_turkey, subtitle: 'ترکیه و ژاپن' },
                { id: 'europe', label: 'قاره اروپا', flag: '🏰', count: regionalCounts.europe, subtitle: 'آلمان، ایتالیا و...' },
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedRegion(tab.id as WorldRegion)}
                  className={`p-2.5 rounded-2xl border text-right transition cursor-pointer flex flex-col justify-between ${
                    selectedRegion === tab.id
                      ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                      : 'bg-[#0c0f16] border-white/[0.06] text-zinc-400 hover:bg-[#141824] hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{tab.flag}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                      selectedRegion === tab.id ? 'bg-indigo-500 text-white' : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {tab.count}
                    </span>
                  </div>
                  <div className="mt-1.5">
                    <div className="text-xs font-bold text-zinc-200">{tab.label}</div>
                    {tab.subtitle && (
                      <div className="text-[10px] text-zinc-500 truncate mt-0.5">{tab.subtitle}</div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* فیلتر نوع فرصت + جستجو و فیلتر فوری */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
            
            {/* نوع فرصت */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'all', label: 'همه فرصت‌ها', icon: null },
                { id: 'job_offer', label: 'جاب‌آفر با اسپانسر ویزا', icon: Briefcase },
                { id: 'scholarship', label: 'بورسیه فول‌فاند', icon: GraduationCap },
                { id: 'job_seeker_visa', label: 'ویزای جستجوی کار / مهارتی', icon: Compass },
              ].map(typeItem => {
                const IconComponent = typeItem.icon;
                return (
                  <button
                    key={typeItem.id}
                    type="button"
                    onClick={() => setSelectedType(typeItem.id as OpportunityType)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition cursor-pointer flex items-center gap-1.5 ${
                      selectedType === typeItem.id
                        ? 'bg-purple-600/30 border-purple-500 text-purple-200 font-bold'
                        : 'bg-[#0c0f16] border-white/[0.06] text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'
                    }`}
                  >
                    {IconComponent && <IconComponent className="w-3.5 h-3.5" />}
                    <span>{typeItem.label}</span>
                  </button>
                );
              })}
            </div>

            {/* نوار سرچ و فیلتر فوری */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setHotOnly(!hotOnly)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer flex items-center gap-1 ${
                  hotOnly
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    : 'bg-[#0c0f16] border-white/[0.06] text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Flame className={`w-3.5 h-3.5 ${hotOnly ? 'text-amber-400 fill-amber-400 animate-pulse' : 'text-zinc-500'}`} />
                <span>فقط داغ و فوری 🔥</span>
              </button>

              <div className="relative flex-1 sm:w-52">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="جستجو در عنوان، رشته، کشور..."
                  className="w-full bg-[#0c0f16] border border-white/[0.08] rounded-xl pr-8 pl-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition"
                />
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* لیست کارت‌های فرصت‌های جهانی */}
          <div className="space-y-3.5 pt-1">
            {filteredOpportunities.length === 0 ? (
              <div className="py-14 text-center bg-[#0c0f16] border border-white/[0.05] rounded-3xl space-y-2">
                <Globe className="w-8 h-8 text-zinc-600 mx-auto" />
                <p className="text-xs text-zinc-400">موقعیتی با فیلترهای انتخابی شما در این منطقه یافت نشد.</p>
                <button
                  type="button"
                  onClick={() => { setSelectedRegion('all'); setSelectedType('all'); setSearchQuery(''); setHotOnly(false); }}
                  className="text-xs text-indigo-400 hover:underline cursor-pointer"
                >
                  حذف تمام فیلترها و مشاهده همه فرصت‌ها
                </button>
              </div>
            ) : (
              filteredOpportunities.map(opp => {
                const isExpanded = expandedOppId === opp.id;
                return (
                  <div
                    key={opp.id}
                    className={`bg-[#0c0f16]/95 border rounded-2xl transition duration-200 overflow-hidden ${
                      isExpanded ? 'border-indigo-500/50 shadow-xl shadow-indigo-600/10' : 'border-white/[0.07] hover:border-white/[0.15]'
                    }`}
                  >
                    {/* ردیف اصلی کارت */}
                    <div 
                      onClick={() => toggleExpandOpp(opp.id)}
                      className="p-4 sm:p-5 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-2 flex-1">
                        
                        {/* بج‌های اطلاعاتی بالای کارت */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-zinc-800/80 px-2.5 py-0.5 rounded-lg border border-white/[0.06]">
                            <span>{opp.countryFlag}</span>
                            <span>{opp.country}</span>
                            {opp.city && <span className="text-zinc-400 text-[11px] font-normal">({opp.city})</span>}
                          </span>

                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                            opp.type === 'job_offer' 
                              ? 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                              : opp.type === 'scholarship'
                              ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                              : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          }`}>
                            {opp.typeLabel}
                          </span>

                          {opp.isHot && (
                            <span className="text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-md flex items-center gap-1">
                              <Flame className="w-3 h-3 text-amber-400" />
                              <span>فوری</span>
                            </span>
                          )}

                          <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md font-mono font-bold mr-auto">
                            شانس قبولی ایرانیان: %{opp.iranianCompatibility.successRate}
                          </span>
                        </div>

                        {/* عنوان اصلی موقعیت */}
                        <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-indigo-300 transition">
                          {opp.title}
                        </h4>

                        {/* سازمان / حقوق / زبان در حالت فشرده */}
                        <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400">
                          <div className="flex items-center gap-1.5 text-zinc-300 font-medium">
                            <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                            <span>{opp.institutionOrCompany}</span>
                          </div>

                          <div className="flex items-center gap-1.5 text-emerald-300 font-medium">
                            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{opp.salaryOrFund}</span>
                          </div>

                          <div className="flex items-center gap-1.5 text-zinc-400">
                            <Languages className="w-3.5 h-3.5 text-zinc-500" />
                            <span>{opp.languageRequirement}</span>
                          </div>
                        </div>
                      </div>

                      {/* دکمه بازکردن جزئیات */}
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          type="button"
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                            isExpanded 
                              ? 'bg-indigo-600 text-white' 
                              : 'bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700'
                          }`}
                        >
                          <span>{isExpanded ? 'بستن راهنما' : 'نحوه اقدام'}</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* بخش بازشونده: شرایط، مراحل اقدام و لینک اپلای */}
                    {isExpanded && (
                      <div className="p-4 sm:p-5 border-t border-white/[0.08] bg-[#11141d]/70 space-y-4 text-xs leading-relaxed animate-in fade-in duration-150">
                        
                        {/* خلاصه توضیحات */}
                        <p className="text-zinc-300">{opp.summary}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                          
                          {/* شرایط کلیدی برای متقاضی ایرانی */}
                          <div className="bg-[#0c0f16] p-3.5 rounded-xl border border-white/[0.06] space-y-2">
                            <div className="font-bold text-indigo-300 flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                              <span>پیش‌نیازها و مدارک لازم:</span>
                            </div>
                            <ul className="space-y-1.5 text-zinc-300 pr-4 list-disc marker:text-indigo-500">
                              {opp.iranianCompatibility.keyRequirements.map((req, rIdx) => (
                                <li key={rIdx}>{req}</li>
                              ))}
                            </ul>
                            <div className="pt-2 border-t border-white/[0.05] text-[11px] text-zinc-400">
                              <b>وضعیت سفارت و مصاحبه: </b>
                              <span>{opp.iranianCompatibility.embassyNotes}</span>
                            </div>
                          </div>

                          {/* مراحل اقدام گام‌به‌گام */}
                          <div className="bg-[#0c0f16] p-3.5 rounded-xl border border-white/[0.06] space-y-2">
                            <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                              <Compass className="w-4 h-4 text-emerald-400" />
                              <span>مراحل ۴ گانه اقدام برای این موقعیت:</span>
                            </div>
                            <ol className="space-y-1.5 text-zinc-300 pr-4 list-decimal marker:text-emerald-500 font-medium">
                              {opp.stepsToApply.map((step, sIdx) => (
                                <li key={sIdx}>{step}</li>
                              ))}
                            </ol>
                            <div className="pt-2 border-t border-white/[0.05] text-[11px] text-zinc-400">
                              <b>نوع ویزای صادره: </b>
                              <span className="text-zinc-200">{opp.visaType}</span>
                            </div>
                          </div>

                        </div>

                        {/* برچسب‌ها و دکمه لینک اقدام مستقیم */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {opp.tags.map((tag, tIdx) => (
                              <span key={tIdx} className="text-[10px] bg-zinc-800/80 text-zinc-400 px-2 py-0.5 rounded-md border border-white/[0.04]">
                                #{tag}
                              </span>
                            ))}
                          </div>

                          <a
                            href={opp.applyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
                          >
                            <span>ورود به سامانه رسمی و اقدام مستقیم</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>

                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* تب دوم: بخشنامه‌ها و اخبار سفارت‌ها (کامپوننت قبلی)        */}
      {/* ========================================================= */}
      {activeMainTab === 'news' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          
          {/* فیلترهای کشورها و موضوعات اخبار */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-zinc-400 flex items-center gap-1 ml-1">
              <Filter className="w-3.5 h-3.5 text-indigo-400" />
              <span>فیلتر کشور:</span>
            </span>

            {[
              { id: 'all', label: 'همه کشورها' },
              { id: 'آلمان', label: '🇩🇪 آلمان و ویزامتریک' },
              { id: 'ایران', label: '🇮🇷 قوانین داخلی ایران' },
              { id: 'کانادا', label: '🇨🇦 کانادا و دراوها' },
              { id: 'ایتالیا', label: '🇮🇹 ایتالیا و DSU' },
              { id: 'اتریش', label: '🇦🇹 اتریش' },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedNewsCountry(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition cursor-pointer ${
                  selectedNewsCountry === tab.id
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                    : 'bg-[#0c0f16] border-white/[0.06] text-zinc-400 hover:bg-zinc-800/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* لیست اخبار */}
          <div className="space-y-3 pt-1">
            {filteredNews.map(item => {
              const isExpanded = Boolean(expandedNewsItems[item.id]);
              return (
                <div
                  key={item.id}
                  className="bg-[#0c0f16] border border-white/[0.07] rounded-2xl p-4 transition hover:border-white/[0.15] space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{item.countryFlag}</span>
                      <span className="text-xs font-bold text-zinc-300">{item.country}</span>
                      <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-md">
                        {item.categoryLabel}
                      </span>
                    </div>
                    <span className="text-[11px] text-zinc-500 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{item.date}</span>
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-white">
                    {item.title}
                  </h4>

                  <p className={`text-xs text-zinc-400 leading-relaxed ${isExpanded ? '' : 'line-clamp-2'}`}>
                    {item.summary}
                  </p>

                  {item.highlight && isExpanded && (
                    <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-xl text-[11px] flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 flex-shrink-0 text-indigo-400" />
                      <span>{item.highlight}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-zinc-500">منبع: {item.source}</span>
                    <button
                      type="button"
                      onClick={() => toggleExpandNews(item.id)}
                      className="text-xs text-indigo-400 hover:text-indigo-300 transition flex items-center gap-1 cursor-pointer"
                    >
                      <span>{isExpanded ? 'بستن' : 'جزئیات بیشتر'}</span>
                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
};
