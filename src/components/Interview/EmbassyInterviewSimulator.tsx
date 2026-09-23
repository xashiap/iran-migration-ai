'use client';

import React, { useState } from 'react';
import { UserProfile } from '@/types/migration';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Send, 
  Award, 
  RotateCcw, 
  Sparkles, 
  Loader2,
  ChevronLeft,
  Info
} from 'lucide-react';

interface EmbassyInterviewSimulatorProps {
  profile: UserProfile;
  targetCountry?: string;
  apiKey?: string;
}

interface QuestionDef {
  id: string;
  questionFa: string;
  questionEn: string;
  category: string;
  tip: string;
}

interface EvaluationResult {
  score: number;
  strengths: string[];
  redFlags: string[];
  winningAnswer: string;
}

export const EmbassyInterviewSimulator: React.FC<EmbassyInterviewSimulatorProps> = ({
  profile,
  targetCountry = 'آلمان',
  apiKey,
}) => {
  const getQuestionsForCountry = (country: string): QuestionDef[] => {
    if (country.includes('کانادا') || country.includes('آمریکا')) {
      return [
        {
          id: 'ca_q1',
          questionFa: 'دقیقاً با چه هدفی قصد سفر به این کشور را دارید و چرا تحصیل یا کار در ایران را ادامه نمی‌دهید؟',
          questionEn: 'What is the primary purpose of your trip, and why not continue in Iran?',
          category: 'هدف از سفر و انگیزه',
          tip: 'روی ارتقای علمی یا شغلی تمرکز کنید؛ هرگز نگویید در ایران هیچ امیدی نیست.'
        },
        {
          id: 'ca_q2',
          questionFa: 'پس از اتمام دوره یا قرارداد، چه برنامه‌ای دارید و چه وابستگی‌هایی شما را به ایران بازمی‌گرداند؟',
          questionEn: 'What are your plans after completing this program, and what ties you to Iran?',
          category: 'قصد بازگشت و وابستگی به وطن (Ties)',
          tip: 'به دارایی‌ها، خانواده، ارتقای جایگاه شغلی آینده و مسئولیت‌هایتان در ایران اشاره کنید.'
        },
        {
          id: 'ca_q3',
          questionFa: 'هزینه‌های زندگی و پروسه ویزای شما از چه طریقی و با چه منابعی تامین شده است؟',
          questionEn: 'How will you fund your living expenses and who is supporting you?',
          category: 'شفافیت منابع مالی و تمکن',
          tip: 'منابع تمکن باید شفاف و با سوابق شغلی شما یا حامی مالی همخوانی داشته باشد.'
        }
      ];
    }

    if (country.includes('ایتالیا')) {
      return [
        {
          id: 'it_q1',
          questionFa: 'چرا دانشگاه‌های ایتالیا را انتخاب کردید و سرفصل‌های این رشته چه کمکی به آینده شما می‌کند؟',
          questionEn: 'Why did you choose Italian universities and this specific curriculum?',
          category: 'انگیزه آکادمیک و انتخاب کشور',
          tip: 'به رتبه دانشگاه و تطابق سیلابس درسی با سوابق مقطع قبلی خود اشاره کنید.'
        },
        {
          id: 'it_q2',
          questionFa: 'آیا متقاضی بورسیه استانی DSU هستید؟ در صورت عدم قبولی در بورسیه چگونه هزینه‌ها را پوشش می‌دهید؟',
          questionEn: 'Are you applying for DSU? How will you support yourself if not awarded?',
          category: 'پوشش ریسک تمکن مالی',
          tip: 'باید نشان دهید علاوه بر امید به بورسیه، تمکن شخصی ریالی/ارزی کافی برای ماه‌های اول را دارید.'
        }
      ];
    }

    // پیش‌فرض: آلمان و سایر کشورهای اروپایی
    return [
      {
        id: 'de_q1',
        questionFa: 'چرا برای این موقعیت کاری / کارت شانس در آلمان اقدام کرده‌اید و بازار کار آلمان چه مزیتی برای تخصص شما دارد؟',
        questionEn: 'Why are you applying for this position/Chancenkarte in Germany?',
        category: 'انگیزه شغلی و مهارت',
        tip: 'به کمبود نیروی متخصص در رشته خود و آمادگی زبانی‌تان اشاره کنید.'
      },
      {
        id: 'de_q2',
        questionFa: 'سطح زبان آلمانی یا انگلیسی شما چیست و در ماه‌های اول در آلمان چگونه ارتباط برقرار می‌کنید؟',
        questionEn: 'What is your language proficiency and how will you communicate initially?',
        category: 'صلاحیت زبانی',
        tip: 'اعتماد به نفس نشان دهید و برنامه خود را برای رسیدن به سطوح بالاتر زبان بیان کنید.'
      },
      {
        id: 'de_q3',
        questionFa: 'تمکن مالی حساب مسدود (Sperrkonto) یا هزینه‌های اقامت اولیه خود را چطور تامین کرده‌اید؟',
        questionEn: 'How have you prepared your blocked account and initial living costs?',
        category: 'تمکن مالی قانونی',
        tip: 'از پس‌اندازهای حاصل از سابقه کار قانونی در ایران بگویید.'
      }
    ];
  };

  const questions = getQuestionsForCountry(targetCountry);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [evaluations, setEvaluations] = useState<Record<number, EvaluationResult>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQ = questions[currentQuestionIndex];
  const currentEval = evaluations[currentQuestionIndex];

  const handleEvaluateAnswer = async () => {
    if (!userAnswer.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country: targetCountry,
          questionId: currentQ.id,
          questionText: currentQ.questionFa,
          userAnswer,
          profile,
          apiKey: apiKey || undefined,
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'خطا در ارزیابی مصاحبه');

      setEvaluations(prev => ({
        ...prev,
        [currentQuestionIndex]: data.evaluation
      }));
    } catch (err: unknown) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setUserAnswer('');
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setUserAnswer('');
    setEvaluations({});
    setIsCompleted(false);
  };

  // محاسبه میانگین نمره
  const totalScore = Object.values(evaluations).reduce((acc, curr) => acc + curr.score, 0);
  const averageScore = Object.keys(evaluations).length > 0 
    ? Math.round(totalScore / Object.keys(evaluations).length) 
    : 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
      {/* سربرگ شبیه‌ساز */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
            </span>
            <h3 className="text-base sm:text-lg font-black text-white">
              شبیه‌ساز هوشمند مصاحبه سفارت و ویزا (سفارت {targetCountry})
            </h3>
            <span className="bg-cyan-500/20 text-cyan-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-cyan-500/30">
              تحلیل ریسک ریجکتی
            </span>
          </div>
          <p className="text-xs text-slate-300">
            پاسخ‌های خود را بنویسید تا هوش مصنوعی نقاط ضعف، کلمات خطرناک و پاسخ برنده را مشخص کند:
          </p>
        </div>

        {!isCompleted && (
          <div className="text-xs text-slate-400 bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800 self-start sm:self-auto font-mono">
            سوال {currentQuestionIndex + 1} از {questions.length}
          </div>
        )}
      </div>

      {!isCompleted ? (
        <div className="space-y-5 animate-in fade-in duration-300">
          {/* کارت سوال آفیسر */}
          <div className="bg-slate-950/80 border border-indigo-500/30 rounded-2xl p-5 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-indigo-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>سوال کنسولار سفارت ({currentQ.category}):</span>
              </span>
              <span className="text-[11px] text-slate-400">{targetCountry}</span>
            </div>

            <div className="text-sm sm:text-base font-bold text-white leading-relaxed">
              « {currentQ.questionFa} »
            </div>

            <div className="text-xs font-mono text-slate-400 opacity-80" dir="ltr">
              {currentQ.questionEn}
            </div>

            <div className="pt-2 text-[11px] text-amber-300/90 flex items-start gap-1.5 border-t border-slate-800/80">
              <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              <span>نکته طلایی آفیسر: {currentQ.tip}</span>
            </div>
          </div>

          {/* کادر پاسخ متقاضی */}
          {!currentEval ? (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-200">
                پاسخ فرضی خود را به فارسی (یا انگلیسی) تایپ کنید:
              </label>
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="مثال: هدف اصلی من ارتقای سوابق تخصصی در حوزه مهندسی نرم‌افزار است و با توجه به..."
                rows={4}
                disabled={isLoading}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition leading-relaxed"
              />

              <div className="flex justify-end">
                <button
                  onClick={handleEvaluateAnswer}
                  disabled={!userAnswer.trim() || isLoading}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 shadow-lg shadow-indigo-600/20"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>آفیسر در حال سنجش پاسخ شما...</span>
                    </>
                  ) : (
                    <>
                      <span>ارزیابی و تحلیل ریسک ویزا</span>
                      <Send className="w-3.5 h-3.5 rotate-180" />
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* نمایش تحلیل آفیسر و پاسخ طلایی */
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-bold text-slate-300">کارنامه ارزیابی این سوال:</span>
                  <div className={`px-3 py-1 rounded-xl text-xs font-bold font-mono border ${
                    currentEval.score >= 80 
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' 
                      : currentEval.score >= 60 
                      ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' 
                      : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                  }`}>
                    نمره اعتماد آفیسر: {currentEval.score} از ۱۰۰
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {/* نقاط قوت */}
                  <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3.5 space-y-2">
                    <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>نقاط مثبت در کلام شما:</span>
                    </div>
                    <ul className="space-y-1 text-slate-300">
                      {currentEval.strengths.map((s, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-emerald-400">•</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* تله‌های ریجکتی */}
                  <div className="bg-rose-500/5 border border-rose-500/20 rounded-xl p-3.5 space-y-2">
                    <div className="font-bold text-rose-400 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>تله‌های مصاحبه و خطرات ریجکت:</span>
                    </div>
                    {currentEval.redFlags.length > 0 ? (
                      <ul className="space-y-1 text-rose-200">
                        {currentEval.redFlags.map((r, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-rose-400">⚠️</span>
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-slate-400 text-[11px]">
                        تبریک! هیچ جمله پرخطری در پاسخ شما که باعث شک آفیسر شود یافت نشد.
                      </p>
                    )}
                  </div>
                </div>

                {/* پاسخ برنده و استاندارد پیشنهادی */}
                <div className="bg-indigo-950/30 border border-indigo-500/30 rounded-xl p-4 space-y-1.5 text-xs">
                  <div className="font-bold text-indigo-300 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>پاسخ طلایی و استاندارد پیشنهادی برای این سوال:</span>
                  </div>
                  <p className="text-slate-200 leading-relaxed pt-1">
                    {currentEval.winningAnswer}
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
                >
                  <span>{currentQuestionIndex < questions.length - 1 ? 'سوال بعدی آفیسر' : 'مشاهده کارنامه نهایی مصاحبه'}</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* کارنامه نهایی پس از پاسخ به تمام سوالات */
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 text-center space-y-6 animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-emerald-400 p-0.5 mx-auto flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
              <Award className="w-8 h-8 text-emerald-400" />
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xl sm:text-2xl font-black text-white">
              کارنامه شبیه‌ساز مصاحبه سفارت {targetCountry}
            </h4>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
              شما به تمامی سوالات اساسی آفیسر سفارت پاسخ دادید. ارزیابی نهایی پرونده شما:
            </p>
          </div>

          <div className="inline-flex items-center gap-4 bg-slate-900 border border-slate-800 px-6 py-3 rounded-2xl">
            <div>
              <div className="text-[10px] text-slate-400">میانگین نمره مصاحبه:</div>
              <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400 font-mono">
                {averageScore}/۱۰۰
              </div>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-right">
              <div className="text-[10px] text-slate-400">پیش‌بینی نتیجه ویزا:</div>
              <div className="text-sm font-bold text-emerald-400">
                {averageScore >= 80 ? 'احتمال بالای صدور روادید' : averageScore >= 60 ? 'شانس متوسط با نیاز به تمرین' : 'نیازمند اصلاح استراتژی مصاحبه'}
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-center gap-3">
            <button
              onClick={handleRestart}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-2 transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>تمرین مجدد مصاحبه</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
