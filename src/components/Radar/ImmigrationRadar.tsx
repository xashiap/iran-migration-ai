'use client';

import React, { useState } from 'react';
import { IMMIGRATION_NEWS_DATABASE } from '@/data/immigrationNews';
import { Radio, ShieldCheck, Clock, Filter, ChevronDown, ChevronUp, BookmarkCheck, X } from 'lucide-react';

interface ImmigrationRadarProps {
  onClose?: () => void;
  selectedCountryFilter?: string;
}

export const ImmigrationRadar: React.FC<ImmigrationRadarProps> = ({ onClose, selectedCountryFilter }) => {
  const [selectedCountry, setSelectedCountry] = useState<string>(selectedCountryFilter || 'all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredNews = IMMIGRATION_NEWS_DATABASE.filter(item => {
    if (selectedCountry !== 'all' && item.country !== selectedCountry) return false;
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5">
      {/* سربرگ رادار */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center relative">
            <Radio className="w-5 h-5 animate-pulse" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-white">
                رادار زنده اخبار و بخشنامه‌های مهاجرتی روز
              </h3>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                به‌روزرسانی امروز
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              رصد مستمر وقت‌های سفارت، آخرین دراوها، بخشنامه‌های سجاد، نظام وظیفه و بورسیه‌ها
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="text-left text-[11px] text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <span>تعداد اطلاعیه‌ها: </span>
            <strong className="text-white font-mono font-bold">{filteredNews.length}</strong>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
              title="بستن رادار"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* فیلترهای کشورها و موضوعات */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-xs text-slate-400 flex items-center gap-1 ml-1">
          <Filter className="w-3.5 h-3.5 text-indigo-400" />
          <span>فیلتر کشور:</span>
        </span>

        {[
          { id: 'all', label: 'همه کشورها' },
          { id: 'آلمان', label: '🇩🇪 آلمان و ویزامتریک' },
          { id: 'ایران', label: '🇮🇷 مقررات داخلی ایران' },
          { id: 'کانادا', label: '🇨🇦 کانادا و دراوها' },
          { id: 'ایتالیا', label: '🇮🇹 ایتالیا و DSU' },
          { id: 'اتریش', label: '🇦🇹 اتریش' },
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSelectedCountry(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
              selectedCountry === tab.id
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* فیلتر دسته‌بندی موضوعی */}
      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
        <span className="text-[11px] text-slate-400 flex items-center gap-1 ml-1">
          <span>دسته:</span>
        </span>
        {[
          { id: 'all', label: 'همه دسته‌ها' },
          { id: 'consular', label: 'وقت سفارت و کنسولی' },
          { id: 'work', label: 'ویزای کاری و شانس' },
          { id: 'student', label: 'تحصیلی و بورسیه' },
          { id: 'iran_admin', label: 'قوانین داخلی (سجاد / سربازی)' },
        ].map(cat => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition ${
              selectedCategory === cat.id
                ? 'bg-rose-600 border-rose-500 text-white shadow-sm'
                : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:bg-slate-800/60'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* لیست کارت‌های خبری و بخشنامه‌ها */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredNews.map((item) => {
          const isExpanded = expandedItems[item.id];

          return (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition text-right flex flex-col justify-between ${
                item.impactLevel === 'high'
                  ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-slate-800 hover:border-slate-700'
                  : 'bg-slate-950/70 border-slate-850 hover:border-slate-750'
              }`}
            >
              <div>
                {/* برچسب‌های کارت */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg">{item.countryFlag}</span>
                    <span className="text-[11px] font-bold text-slate-300 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
                      {item.categoryLabel}
                    </span>
                    {item.verified && (
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-md flex items-center gap-0.5 border border-emerald-500/20">
                        <ShieldCheck className="w-3 h-3" />
                        <span>رسمی</span>
                      </span>
                    )}
                  </div>

                  <div className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{item.date}</span>
                  </div>
                </div>

                {/* عنوان خبر */}
                <h4 className="text-xs sm:text-sm font-bold text-white leading-snug">
                  {item.title}
                </h4>

                {/* خلاصه متن */}
                <p className={`text-xs text-slate-300 mt-2 leading-relaxed ${!isExpanded ? 'line-clamp-2' : ''}`}>
                  {item.summary}
                </p>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-850">
                {/* نکته کلیدی / هایلایت */}
                {item.highlight && (
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-2.5 text-[11px] text-amber-300 flex items-start gap-1.5 mb-2">
                    <BookmarkCheck className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div className="leading-snug">
                      <strong className="text-amber-200">نکته کلیدی: </strong>
                      {item.highlight}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>منبع: {item.source}</span>
                  <button
                    type="button"
                    onClick={() => toggleExpand(item.id)}
                    className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-0.5"
                  >
                    <span>{isExpanded ? 'بستن' : 'جزئیات کامل'}</span>
                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
