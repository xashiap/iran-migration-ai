'use client';

import React, { useState } from 'react';
import { UserProfile } from '@/types/migration';
import { 
  ShieldCheck, 
  CheckCircle2, 
  X, 
  Loader2, 
  Send
} from 'lucide-react';

interface ConsultationBookingModalProps {
  profile: UserProfile;
  targetCountry?: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ConsultationBookingModal: React.FC<ConsultationBookingModalProps> = ({
  profile,
  targetCountry = 'کشور مقصد',
  onClose,
  onSuccess,
}) => {
  const [fullName, setFullName] = useState(profile.personal?.fullName || '');
  const [phone, setPhone] = useState(profile.personal?.phone || '');
  const [telegramId, setTelegramId] = useState('');
  const [service, setService] = useState('جلسه مشاوره تلفنی تخصصی ۴۵ دقیقه‌ای با کارشناس ارشد');
  const [preferredTime, setPreferredTime] = useState('عصر (۱۶ الی ۲۰)');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const servicesList = [
    {
      id: 'phone_consult',
      title: 'جلسه مشاوره تلفنی تخصصی ۴۵ دقیقه‌ای با کارشناس ارشد',
      desc: 'بررسی دقیق بندهای پرونده، محاسبه نمره، شانس ویزا و رفع ابهامات'
    },
    {
      id: 'job_review',
      title: 'بررسی حقوقی جاب‌آفر، قرارداد کاری یا پذیرش دانشگاهی',
      desc: 'اعتبارسنجی کارفرما، تاییدیه LMIA یا دانشگاه و صحت مفاد قرارداد'
    },
    {
      id: 'sajjad_docs',
      title: 'پیگیری اداری لغو تعهد آموزش رایگان سجاد و دارالترجمه رسمی',
      desc: 'راهنمایی گام‌به‌گام دریافت کدهای صحت و تاییدات دادگستری و امور خارجه'
    },
    {
      id: 'embassy_prep',
      title: 'آماده‌سازی پکیج مصاحبه سفارت و چیدمان مدارک ویزامتریک/VFS',
      desc: 'شبیه‌سازی مدارک مالی، کاور لتر و کاهش ریسک ریجکت پرونده'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.trim().length < 10) {
      setError('وارد کردن شماره موبایل معتبر جهت تماس کارشناس الزامی است.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          phone,
          service,
          preferredTime,
          notes,
          telegramId,
          profile,
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'خطا در ثبت درخواست');

      setIsSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'خطایی در ثبت درخواست رخ داد.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden my-auto">
        {/* هدر */}
        <div className="p-5 bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                درخواست رزرو مشاوره تخصصی و بررسی پرونده VIP
              </h3>
              <p className="text-xs text-slate-400">
                بررسی اختصاصی پرونده متقاضی برای مقصد {targetCountry} توسط وکلای رسمی
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl text-xs">
                {error}
              </div>
            )}

            {/* نام و شماره تماس */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  نام و نام خانوادگی:
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="مثال: علی رضایی"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  شماره موبایل تماس:
                </label>
                <input
                  type="tel"
                  dir="ltr"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="09123456789"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>

            {/* انتخاب نوع خدمت */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300">
                نوع خدمت یا بررسی مورد نظر شما:
              </label>
              <div className="space-y-2">
                {servicesList.map((s) => (
                  <label
                    key={s.id}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition text-right ${
                      service === s.title
                        ? 'bg-indigo-600/15 border-indigo-500 text-white shadow-sm'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="service"
                      checked={service === s.title}
                      onChange={() => setService(s.title)}
                      className="mt-1 accent-indigo-500"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-100">{s.title}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{s.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* زمان مناسب تماس و آیدی تلگرام */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  بازه زمانی مناسب برای تماس:
                </label>
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition"
                >
                  <option value="صبح (۱۰ الی ۱۳)">صبح (۱۰ الی ۱۳)</option>
                  <option value="عصر (۱۶ الی ۲۰)">عصر (۱۶ الی ۲۰)</option>
                  <option value="شب (۲۰ الی ۲۲)">شب (۲۰ الی ۲۲)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  آیدی تلگرام (اختیاری):
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={telegramId}
                  onChange={(e) => setTelegramId(e.target.value)}
                  placeholder="@your_id"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>

            {/* توضیحات تکمیلی */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                توضیحات تکمیلی یا سوال مشخص پرونده:
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="اگر نکته خاصی در مورد پرونده، سفارت یا مدارک دارید اینجا بنویسید..."
                rows={2}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl text-xs transition"
              >
                انصراف
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-indigo-600/20"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-3.5 h-3.5 rotate-180" />}
                <span>ثبت نهایی درخواست مشاوره</span>
              </button>
            </div>
          </form>
        ) : (
          /* پیام تایید موفقیت */
          <div className="p-8 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h4 className="text-lg font-bold text-white">
              درخواست مشاوره VIP شما با موفقیت ثبت شد
            </h4>

            <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
              پرونده شما در اولویت بررسی کارشناسان قرار گرفت. مشاور مربوطه در بازه زمانی «{preferredTime}» با شماره <strong className="text-emerald-400 font-mono" dir="ltr">{phone}</strong> تماس خواهد گرفت.
            </p>

            <div className="pt-4">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition"
              >
                بازگشت به پرونده
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
