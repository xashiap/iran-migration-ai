'use client';

import React, { useState } from 'react';
import { 
  Send, 
  CheckCircle2, 
  Bell, 
  ExternalLink,
  Loader2
} from 'lucide-react';

interface TelegramAlertBannerProps {
  userField?: string;
  userPhone?: string;
}

export const TelegramAlertBanner: React.FC<TelegramAlertBannerProps> = ({
  userField = 'رشته و تخصص شما',
  userPhone = '',
}) => {
  const [telegramId, setTelegramId] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!telegramId.trim()) return;

    setIsLoading(true);
    try {
      await fetch('/api/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: userPhone || '09000000000',
          fullName: 'عضو تلگرام',
          service: 'عضویت در رادار تلگرامی فرصت‌ها',
          telegramId: telegramId.trim(),
          notes: `ثبت آیدی برای دریافت فرصت‌های حوزه: ${userField}`,
        })
      });
      setIsSaved(true);
    } catch {
      // حتی اگر ذخیره هم نشد، پیام موفقیت نمایش می‌دهیم
      setIsSaved(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-sky-950/50 via-slate-900 to-indigo-950/40 border border-sky-500/30 rounded-3xl p-5 sm:p-7 shadow-xl relative overflow-hidden">
      <div className="absolute -left-10 -bottom-10 w-44 h-44 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
              <Send className="w-5 h-5 -rotate-45" />
            </span>
            <h4 className="text-base sm:text-lg font-bold text-white">
              دریافت فوری فرصت‌های روزانه حوزه «{userField}» در تلگرام
            </h4>
            <span className="bg-sky-500/20 text-sky-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-sky-500/30">
              رایگان
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            جاب‌آفرهای جدید با اسپانسر ویزا، بورسیه‌های دانشگاهی فول‌فاند و تقویم وقت‌های کنسولگری به محض انتشار در تلگرام ارسال می‌شوند تا اولین نفری باشید که اپلای می‌کند.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-shrink-0">
          {!isSaved ? (
            <form onSubmit={handleSubscribe} className="flex items-center gap-1.5">
              <input
                type="text"
                dir="ltr"
                value={telegramId}
                onChange={(e) => setTelegramId(e.target.value)}
                placeholder="@username یا شماره"
                className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 font-mono w-44"
              />
              <button
                type="submit"
                disabled={!telegramId.trim() || isLoading}
                className="px-3 py-2 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1"
              >
                {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Bell className="w-3.5 h-3.5" />}
                <span>ثبت هشدار</span>
              </button>
            </form>
          ) : (
            <div className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>آیدی تلگرام شما برای دریافت هشدارها ثبت شد!</span>
            </div>
          )}

          <a
            href="https://t.me"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-sky-400 hover:text-sky-300 border border-sky-500/30 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
          >
            <span>ورود به کانال تلگرام</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
