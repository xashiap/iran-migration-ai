'use client';

import React from 'react';
import { User, GraduationCap, Briefcase, Languages, DollarSign, Target, Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

const STEPS = [
  { step: 1, title: 'فردی و سربازی', icon: User },
  { step: 2, title: 'تحصیلات و سجاد', icon: GraduationCap },
  { step: 3, title: 'شغل و بیمه', icon: Briefcase },
  { step: 4, title: 'مهارت‌های زبان', icon: Languages },
  { step: 5, title: 'بودجه و تمکن', icon: DollarSign },
  { step: 6, title: 'اولویت‌ها و اهداف', icon: Target },
];

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, onStepClick }) => {
  return (
    <div className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl p-3 sm:p-4 mb-8 backdrop-blur-sm shadow-xl no-print">
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {STEPS.map((s) => {
          const Icon = s.icon;
          const isCompleted = s.step < currentStep;
          const isCurrent = s.step === currentStep;

          return (
            <button
              key={s.step}
              onClick={() => onStepClick(s.step)}
              className={`flex items-center gap-2 p-2 sm:p-2.5 rounded-xl text-right transition group relative ${
                isCurrent
                  ? 'bg-indigo-600/20 border border-indigo-500/50 text-indigo-300 shadow-lg shadow-indigo-500/10'
                  : isCompleted
                  ? 'bg-slate-800/60 border border-slate-700/60 text-emerald-400 hover:bg-slate-800'
                  : 'bg-slate-950/40 border border-slate-800/40 text-slate-400 hover:bg-slate-800/40'
              }`}
            >
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold transition ${
                  isCurrent
                    ? 'bg-indigo-600 text-white shadow-md'
                    : isCompleted
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] sm:text-[11px] font-semibold text-slate-400 truncate">
                  مرحله {s.step}
                </div>
                <div className={`text-xs sm:text-xs font-bold truncate ${isCurrent ? 'text-white' : 'text-slate-300'}`}>
                  {s.title}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
