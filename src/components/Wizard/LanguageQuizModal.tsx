'use client';

import React, { useState } from 'react';
import {
  QuizLanguage,
  QuizQuestion,
  QuizResultData,
  getRandomQuizQuestions,
  evaluateLanguageQuiz,
} from '@/data/languageQuizData';
import {
  X,
  Languages,
  Award,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  HelpCircle,
  Zap,
} from 'lucide-react';

interface LanguageQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyResult: (result: QuizResultData) => void;
}

export const LanguageQuizModal: React.FC<LanguageQuizModalProps> = ({
  isOpen,
  onClose,
  onApplyResult,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<QuizLanguage | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [quizResult, setQuizResult] = useState<QuizResultData | null>(null);
  const [showExplanations, setShowExplanations] = useState<boolean>(false);

  if (!isOpen) return null;

  const startQuizForLanguage = (lang: QuizLanguage) => {
    const randomized = getRandomQuizQuestions(lang, 15);
    setSelectedLanguage(lang);
    setQuestions(randomized);
    setCurrentIndex(0);
    setUserAnswers({});
    setSelectedOption(null);
    setIsFinished(false);
    setQuizResult(null);
    setShowExplanations(false);
  };

  const handleSelectOption = (index: number) => {
    setSelectedOption(index);
  };

  const handleNextQuestion = () => {
    if (selectedOption === null) return;

    const updatedAnswers = { ...userAnswers, [currentIndex]: selectedOption };
    setUserAnswers(updatedAnswers);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(updatedAnswers[currentIndex + 1] ?? null);
    } else {
      // پایان آزمون و محاسبه نتیجه
      let correct = 0;
      questions.forEach((q, idx) => {
        if (updatedAnswers[idx] === q.correctIndex) {
          correct++;
        }
      });
      const result = evaluateLanguageQuiz(selectedLanguage!, correct, questions.length);
      setQuizResult(result);
      setIsFinished(true);
    }
  };

  const handlePrevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedOption(userAnswers[currentIndex - 1] ?? null);
    }
  };

  const handleApplyToProfile = () => {
    if (quizResult) {
      onApplyResult(quizResult);
      onClose();
    }
  };

  const currentQ = questions[currentIndex];
  const progressPercent = questions.length > 0 ? Math.round(((currentIndex + 1) / questions.length) * 100) : 0;

  const getLanguageMeta = (lang: QuizLanguage) => {
    switch (lang) {
      case 'english':
        return { name: 'انگلیسی', flag: '🇬🇧', target: 'آیلتس / تافل / مهاجرت کانادا، استرالیا و کار بین‌الملل' };
      case 'german':
        return { name: 'آلمانی', flag: '🇩🇪', target: 'گوته / کارت شانس آلمان (Chancenkarte)، آسبیلدونگ و اتریش' };
      case 'french':
        return { name: 'فرانسوی', flag: '🇫🇷', target: 'TCF / دراوهای زبان فرانسه کانادا و استان کبک' };
      case 'italian':
        return { name: 'ایتالیایی', flag: '🇮🇹', target: 'CILS / تحصیل در ایتالیا و بورسیه استانی DSU' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* سربرگ مودال */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Languages className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>آزمون هوشمند تعیین سطح زبان</span>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-mono">
                  ۱۵ سوال تصادفی
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                سنجش استاندارد CEFR از A1 تا C1 و نگاشت فوری به مدارک مهاجرتی
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            title="بستن"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* بدنه متغیر */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* حالت ۱: انتخاب زبان */}
          {!selectedLanguage && (
            <div className="space-y-4">
              <div className="text-center space-y-1.5 py-2">
                <h4 className="text-base font-bold text-white">زبان مورد نظر خود را برای تعیین سطح انتخاب کنید:</h4>
                <p className="text-xs text-slate-400">
                  سوالات برای هر بار آزمون به‌صورت تصادفی از سطوح آسان تا پیشرفته انتخاب می‌شوند.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'english' as QuizLanguage, flag: '🇬🇧', title: 'زبان انگلیسی', badge: 'آیلتس / کانادا / اروپا', desc: 'مناسب برای اکسپرس اینتری کانادا، اسکیلد ورکر و پذیرش دانشگاه‌ها' },
                  { id: 'german' as QuizLanguage, flag: '🇩🇪', title: 'زبان آلمانی', badge: 'کارت شانس آلمان / اتریش', desc: 'سنجش سطح برای Chancenkarte، اشتغال تخصصی، آسبیلدونگ و ویزامتریک' },
                  { id: 'french' as QuizLanguage, flag: '🇫🇷', title: 'زبان فرانسوی', badge: 'دراوهای فرانسه کانادا / کبک', desc: 'تا ۵۰ امتیاز طلایی مازاد در دراوهای کتگوری-بیس فدرال کانادا' },
                  { id: 'italian' as QuizLanguage, flag: '🇮🇹', title: 'زبان ایتالیایی', badge: 'بورسیه استانی DSU', desc: 'پذیرش در دانشگاه‌های میلان و رم با پوشش کامل شهریه و کمک‌هزینه' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => startQuizForLanguage(item.id)}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500/70 hover:bg-slate-850/60 transition text-right group flex flex-col justify-between space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{item.flag}</span>
                        <span className="font-bold text-sm text-slate-100 group-hover:text-indigo-300 transition">
                          {item.title}
                        </span>
                      </div>
                      <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full font-medium">
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {item.desc}
                    </p>
                    <div className="text-[11px] text-indigo-400 font-bold flex items-center gap-1 pt-1">
                      <span>شروع آزمون ۱۵ سوالی</span>
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* حالت ۲: در حال پاسخ به سوالات کوییز */}
          {selectedLanguage && !isFinished && currentQ && (
            <div className="space-y-5">
              {/* نوار پیشرفت */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5 font-medium">
                    <span>{getLanguageMeta(selectedLanguage).flag}</span>
                    <span>{getLanguageMeta(selectedLanguage).name}</span>
                    <span>• سوال {currentIndex + 1} از {questions.length}</span>
                  </span>
                  <span className="font-mono text-indigo-400 font-bold">{progressPercent}٪</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* کارت سوال */}
              <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-lg border border-slate-700">
                    سطح تخمینی سوال: <strong>{currentQ.level}</strong>
                  </span>
                  <span className="text-[11px] text-slate-500">
                    دسته‌بندی: {currentQ.category === 'grammar' ? 'گرامر' : currentQ.category === 'vocabulary' ? 'واژگان' : currentQ.category === 'comprehension' ? 'درک مطلب' : 'موقعیت روزمره'}
                  </span>
                </div>

                <p className="text-base sm:text-lg font-medium text-white leading-relaxed dir-ltr text-left font-sans select-none">
                  {currentQ.prompt}
                </p>
              </div>

              {/* گزینه‌های پاسخ */}
              <div className="grid grid-cols-1 gap-2.5">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectOption(idx)}
                      className={`p-3.5 sm:p-4 rounded-xl border text-left dir-ltr font-sans transition flex items-center justify-between ${
                        isSelected
                          ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                          : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center font-mono ${
                          isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="text-sm font-medium">{opt}</span>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* دکمه‌های پیمایش سوال */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handlePrevQuestion}
                  disabled={currentIndex === 0}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-950 border border-slate-800 disabled:opacity-40 transition flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>سوال قبلی</span>
                </button>

                <button
                  type="button"
                  onClick={handleNextQuestion}
                  disabled={selectedOption === null}
                  className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition shadow-lg shadow-indigo-600/25 flex items-center gap-1.5"
                >
                  <span>{currentIndex + 1 === questions.length ? 'پایان و مشاهده کارنامه' : 'ثبت و سوال بعد'}</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* حالت ۳: نمایش کارنامه نهایی و اعمال خودکار */}
          {isFinished && quizResult && (
            <div className="space-y-6 animate-in zoom-in-95 duration-300">
              {/* کادر نتیجه اصلی */}
              <div className="bg-gradient-to-br from-indigo-950/70 via-slate-900 to-slate-950 border border-indigo-500/40 rounded-3xl p-6 text-center space-y-3 relative overflow-hidden">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mx-auto mb-2">
                  <Award className="w-7 h-7" />
                </div>

                <div className="inline-block bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full text-xs font-bold">
                  سطح برآورد شده شما در زبان {getLanguageMeta(quizResult.language).name}:
                </div>

                <h3 className="text-3xl font-black text-white">
                  {quizResult.levelLabelFa}
                </h3>

                <div className="flex flex-wrap items-center justify-center gap-3 text-xs pt-1">
                  <span className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300">
                    تعداد پاسخ صحیح: <strong className="text-emerald-400 font-mono font-bold">{quizResult.score} از {quizResult.total}</strong> ({quizResult.percentage}٪)
                  </span>
                  <span className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-indigo-300 font-medium">
                    🎯 {quizResult.examEquivalent}
                  </span>
                </div>
              </div>

              {/* جعبه اثر روی پرونده مهاجرتی */}
              <div className="bg-slate-950/80 border border-slate-800 p-4 sm:p-5 rounded-2xl space-y-2">
                <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <Zap className="w-4 h-4" />
                  <span>اثر مستقیم این سطح در پرونده مهاجرت شما:</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {quizResult.immigrationImpact}
                </p>
                <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                  💡 <strong className="text-slate-300">توصیه یادگیری:</strong> {quizResult.studyRecommendation}
                </div>
              </div>

              {/* دکمه برجسته اعمال در پرونده */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={handleApplyToProfile}
                  className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>ثبت خودکار این سطح در فرم پرونده من</span>
                </button>

                <button
                  type="button"
                  onClick={() => startQuizForLanguage(quizResult.language)}
                  className="w-full sm:w-auto py-3.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition border border-slate-700 flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>آزمون مجدد با سوالات جدید</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedLanguage(null)}
                  className="w-full sm:w-auto py-3.5 px-4 rounded-2xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white font-semibold text-xs transition border border-slate-800 flex items-center justify-center"
                >
                  <span>تغییر زبان</span>
                </button>
              </div>

              {/* آکاردئون مشاهده پاسخ‌های تشریحی */}
              <div className="border border-slate-800 rounded-2xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowExplanations(!showExplanations)}
                  className="w-full p-3.5 bg-slate-950/60 hover:bg-slate-950 text-xs font-semibold text-slate-300 flex items-center justify-between transition"
                >
                  <span className="flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-indigo-400" />
                    <span>مرور پاسخ‌های شما و توضیحات آموزشی سوالات ({showExplanations ? 'بستن' : 'مشاهده'})</span>
                  </span>
                  <span className="text-[11px] text-indigo-400">{showExplanations ? '▲' : '▼'}</span>
                </button>

                {showExplanations && (
                  <div className="p-4 space-y-3 bg-slate-950/40 border-t border-slate-800 max-h-72 overflow-y-auto">
                    {questions.map((q, idx) => {
                      const userAns = userAnswers[idx];
                      const isCorrect = userAns === q.correctIndex;
                      return (
                        <div
                          key={q.id}
                          className={`p-3 rounded-xl border text-right text-xs space-y-1.5 ${
                            isCorrect ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-rose-950/20 border-rose-500/30'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-200">سوال {idx + 1} ({q.level})</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                              isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                            }`}>
                              {isCorrect ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                              {isCorrect ? 'پاسخ صحیح' : 'پاسخ اشتباه'}
                            </span>
                          </div>
                          <p className="dir-ltr text-left text-slate-300 font-sans">{q.prompt}</p>
                          <div className="text-[11px] text-slate-400 pt-1">
                            پاسخ صحیح: <strong className="text-white dir-ltr">{q.options[q.correctIndex]}</strong>
                          </div>
                          <div className="text-[11px] text-indigo-300/90 leading-relaxed">
                            💡 نکته: {q.explanation}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
