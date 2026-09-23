'use client';

import React, { useState } from 'react';
import { UserProfile } from '@/types/migration';
import { 
  Brain, 
  Send, 
  User, 
  Sparkles, 
  HelpCircle,
  Loader2,
  Lock
} from 'lucide-react';

interface AICounselorChatProps {
  profile: UserProfile;
  targetCountry?: string;
  onOpenConsultation?: () => void;
  apiKey?: string;
}

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

const MAX_QUESTIONS = 5;

export const AICounselorChat: React.FC<AICounselorChatProps> = ({
  profile,
  targetCountry = 'کشور مقصد',
  onOpenConsultation,
  apiKey,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome_1',
      role: 'model',
      text: `سلام و درود! من مستشار هوش مصنوعی اختصاصی پرونده شما هستم. تمام جزئیات سوابق تحصیلی در رشته «${profile.education?.field || 'تخصصی'}»، سابقه کاری «${profile.work?.jobTitle || 'تخصصی'}»، سرمایه نقدی و مقصد پیشنهادی «${targetCountry}» را بررسی کرده‌ام.\n\nشما دارای ۵ سهمیه پرسش اختصاصی درباره چالش‌ها، سفارت، تمکن یا ویزای همراه هستید. چه سوالی مدنظرتان است؟`,
      timestamp: 'الان'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);

  // پیشنهادهای هوشمند پرسش بر اساس شرایط پرونده
  const quickSuggestions = [
    `شانس دریافت ویزای همراه برای همسر و فرزندان من در ${targetCountry} چقدر است؟`,
    `با توجه به بودجه من، چه راه‌حلی برای اثبات تمکن مالی در سفارت پیشنهاد می‌کنید؟`,
    `آیا وضعیت نظام وظیفه من مانع یا چالش اداری برای خروج ایجاد می‌کند؟`,
    `برای تقویت رزومه و مصاحبه با کارفرمایان ${targetCountry} چه مهارتی اولویت دارد؟`,
    `روند آزادسازی مدرک دانشگاهی در سامانه سجاد چقدر زمان می‌برد؟`
  ];

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading || questionCount >= MAX_QUESTIONS) return;

    const userMsg: Message = {
      id: 'user_' + Date.now(),
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);
    setQuestionCount(prev => prev + 1);

    try {
      const historyPayload = messages.map(m => ({ role: m.role, text: m.text }));

      const res = await fetch('/api/counselor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile,
          question: text,
          history: historyPayload,
          apiKey: apiKey || undefined,
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'خطا در ارتباط با مشاور هوش مصنوعی');

      const modelMsg: Message = {
        id: 'model_' + Date.now(),
        role: 'model',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, modelMsg]);
    } catch {
      const errorMsg: Message = {
        id: 'err_' + Date.now(),
        role: 'model',
        text: 'متاسفانه در برقراری ارتباط مشکلی پیش آمد. لطفاً مجدداً سوال خود را بپرسید.',
        timestamp: 'الان'
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const remaining = MAX_QUESTIONS - questionCount;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
      {/* هدر چت */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-white">
                مستشار هوش مصنوعی پرونده شما (AI Migration Counselor)
              </h3>
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] px-2 py-0.5 rounded-full font-bold">
                آنلاین
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              پاسخ اختصاصی و حقوقی به سوالات بر اساس اطلاعات ثبت‌شده شما
            </p>
          </div>
        </div>

        {/* سهمیه سوال */}
        <div className="flex items-center gap-2">
          <div className={`px-3 py-1 rounded-xl text-xs font-bold border flex items-center gap-1.5 ${
            remaining > 2 
              ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30' 
              : remaining > 0 
              ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' 
              : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
          }`}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>سهمیه: {remaining} از ۵ سوال باقیمانده</span>
          </div>
        </div>
      </div>

      {/* ناحیه نمایش پیام‌ها */}
      <div className="p-4 sm:p-6 space-y-4 max-h-[460px] overflow-y-auto bg-slate-950/60">
        {messages.map((m) => (
          <div 
            key={m.id} 
            className={`flex items-start gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${
              m.role === 'user' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-slate-800 text-indigo-400 border border-slate-700'
            }`}>
              {m.role === 'user' ? <User className="w-4 h-4" /> : <Brain className="w-4 h-4" />}
            </div>

            <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
              m.role === 'user'
                ? 'bg-indigo-600 text-white rounded-tl-none shadow-md'
                : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tr-none shadow-md'
            }`}>
              <div className="whitespace-pre-line">{m.text}</div>
              <div className={`text-[10px] mt-2 font-mono ${
                m.role === 'user' ? 'text-indigo-200 text-left' : 'text-slate-500 text-right'
              }`}>
                {m.timestamp}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-800 text-indigo-400 border border-slate-700 flex items-center justify-center flex-shrink-0">
              <Brain className="w-4 h-4" />
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-2 text-xs text-slate-400">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
              <span>مستشار هوش مصنوعی در حال بررسی پرونده و تدوین پاسخ حقوقی...</span>
            </div>
          </div>
        )}
      </div>

      {/* پیشنهادهای سریع سوال */}
      {remaining > 0 && (
        <div className="p-3 bg-slate-900/90 border-t border-slate-800">
          <div className="text-[11px] text-slate-400 mb-2 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
            <span>سوالات پرتکرار متناسب با شرایط شما (یک کلیک برای ارسال):</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {quickSuggestions.slice(0, 3).map((sugg, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(sugg)}
                disabled={isLoading}
                className="text-[11px] bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 px-2.5 py-1 rounded-lg transition text-right disabled:opacity-50"
              >
                {sugg}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* کادر ورودی سوال */}
      <div className="p-3 sm:p-4 bg-slate-900 border-t border-slate-800">
        {remaining > 0 ? (
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="سوال اختصاصی خود را درباره پرونده، سفارت یا تمکن بپرسید..."
              disabled={isLoading}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
            >
              <span>ارسال</span>
              <Send className="w-3.5 h-3.5 rotate-180" />
            </button>
          </form>
        ) : (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-rose-300">
              <Lock className="w-4 h-4 flex-shrink-0" />
              <span>سقف ۵ سوال رایگان شما به پایان رسید.</span>
            </div>
            {onOpenConsultation && (
              <button
                onClick={onOpenConsultation}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-xs transition"
              >
                رزرو وقت مشاوره تخصصی با کارشناس
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
