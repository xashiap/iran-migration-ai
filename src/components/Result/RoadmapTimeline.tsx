'use client';

import React, { useState } from 'react';
import { RoadmapPhase } from '@/types/migration';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Lightbulb, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';

interface RoadmapTimelineProps {
  phases: RoadmapPhase[];
  targetCountry: string;
  pathwayTitle: string;
}

export const RoadmapTimeline: React.FC<RoadmapTimelineProps> = ({
  phases,
  targetCountry,
  pathwayTitle,
}) => {
  // ذخیره وضعیت مراحل تکمیل شده توسط کاربر
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [collapsedPhases, setCollapsedPhases] = useState<Record<number, boolean>>({});

  const toggleStep = (stepId: string) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepId]: !prev[stepId],
    }));
  };

  const togglePhaseCollapse = (phaseNumber: number) => {
    setCollapsedPhases((prev) => ({
      ...prev,
      [phaseNumber]: !prev[phaseNumber],
    }));
  };

  // محاسبه پیشرفت کل
  const allSteps = phases.flatMap((p) => p.steps);
  const totalCount = allSteps.length;
  const completedCount = allSteps.filter((s) => completedSteps[s.id]).length;
  const progressPercent = Math.round((completedCount / (totalCount || 1)) * 100);

  return (
    <div className="space-y-6">
      {/* هدر نقشه راه و نوار پیشرفت شخصی */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2.5 py-0.5 rounded-full font-bold">
                نقشه راه اختصاصی نقطه صفر تا فرودگاه
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white mt-1">
              رودمپ گام‌به‌گام مهاجرت به {targetCountry} ({pathwayTitle})
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              مراحل را به ترتیب اولویت انجام داده و کارهای تمام شده را تیک بزنید تا پیشرفت پرونده خود را بسنجید.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center gap-4 flex-shrink-0">
            <div>
              <div className="text-[11px] text-slate-400">پیشرفت پرونده شما:</div>
              <div className="text-lg font-black text-indigo-400 font-mono">
                {completedCount} از {totalCount} مرحله ({progressPercent}٪)
              </div>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-indigo-500 flex items-center justify-center font-mono font-bold text-xs text-white">
              {progressPercent}%
            </div>
          </div>
        </div>

        {/* نوار پیشرفت بصری */}
        <div className="w-full bg-slate-950 rounded-full h-2 mt-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* فازهای مرحله‌به‌مرحله */}
      <div className="space-y-4">
        {phases.map((phase) => {
          const isCollapsed = collapsedPhases[phase.phaseNumber];
          const phaseCompletedSteps = phase.steps.filter((s) => completedSteps[s.id]).length;
          const isPhaseDone = phaseCompletedSteps === phase.steps.length && phase.steps.length > 0;

          return (
            <div
              key={phase.phaseNumber}
              className={`border rounded-2xl transition overflow-hidden ${
                phase.phaseNumber === 0
                  ? 'bg-gradient-to-b from-indigo-950/40 to-slate-900/90 border-indigo-500/40 shadow-lg shadow-indigo-500/5'
                  : 'bg-slate-900/80 border-slate-800'
              }`}
            >
              {/* سربرگ فاز */}
              <button
                onClick={() => togglePhaseCollapse(phase.phaseNumber)}
                className="w-full p-4 sm:p-5 flex items-center justify-between text-right hover:bg-slate-800/40 transition gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 ${
                      isPhaseDone
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : phase.phaseNumber === 0
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {isPhaseDone ? '✓' : phase.phaseNumber}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm sm:text-base font-bold text-white truncate">
                        {phase.phaseTitle}
                      </h4>
                      {phase.phaseNumber === 0 && (
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold">
                          اقدامات حیاتی داخل ایران
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 truncate">{phase.summary}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-left hidden sm:block">
                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{phase.duration}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
                      {phaseCompletedSteps} از {phase.steps.length}
                    </div>
                  </div>
                  {isCollapsed ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronUp className="w-5 h-5 text-slate-400" />}
                </div>
              </button>

              {/* لیست تسک‌های این فاز */}
              {!isCollapsed && (
                <div className="p-4 sm:p-5 pt-0 border-t border-slate-800/60 space-y-3 mt-1">
                  {phase.steps.map((step) => {
                    const isDone = completedSteps[step.id];

                    return (
                      <div
                        key={step.id}
                        onClick={() => toggleStep(step.id)}
                        className={`p-3.5 sm:p-4 rounded-xl border transition cursor-pointer flex items-start gap-3.5 group ${
                          isDone
                            ? 'bg-slate-950/40 border-slate-800/60 opacity-70'
                            : 'bg-slate-950/90 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                        }`}
                      >
                        <button
                          type="button"
                          className="mt-0.5 flex-shrink-0 focus:outline-none"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleStep(step.id);
                          }}
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-600 group-hover:text-slate-400 transition" />
                          )}
                        </button>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h5
                              className={`text-xs sm:text-sm font-bold ${
                                isDone ? 'text-slate-400 line-through' : 'text-slate-100'
                              }`}
                            >
                              {step.title}
                            </h5>
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              {step.isIranSpecific && (
                                <span className="text-[10px] bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-md font-medium">
                                  ویژه ایران
                                </span>
                              )}
                              <span className="text-[10px] text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-md flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {step.estimatedTime}
                              </span>
                            </div>
                          </div>

                          <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                            {step.description}
                          </p>

                          {step.tips && (
                            <div className="mt-2.5 bg-slate-900/90 border border-slate-800/80 rounded-lg p-2.5 text-[11px] text-amber-300 flex items-start gap-2">
                              <Lightbulb className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                              <div className="leading-snug">
                                <span className="font-bold text-amber-200">نکته تجربی: </span>
                                {step.tips}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
