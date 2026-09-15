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
    <div className="w-full bg-[#11141d]/85 border border-white/[0.07] rounded-2xl p-2.5 sm:p-3.5 mb-8 backdrop-blur-sm shadow-xl no-print">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        {STEPS.map((s) => {
          const Icon = s.icon;
          const isCompleted = s.step < currentStep;
          const isCurrent = s.step === currentStep;

          return (
            <button
              key={s.step}
              onClick={() => onStepClick(s.step)}
              className={`flex items-center gap-2 p-2 sm:p-2.5 rounded-xl text-right transition group relative cursor-pointer ${
                isCurrent
                  ? 'bg-indigo-600/15 border border-indigo-500/40 text-indigo-300 shadow-sm'
                  : isCompleted
                  ? 'bg-[#0c0f16] border border-white/[0.08] text-zinc-300 hover:bg-zinc-800/40'
                  : 'bg-transparent border border-transparent text-zinc-500 hover:bg-zinc-850/30'
              }`}
            >
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold transition ${
                  isCurrent
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : isCompleted
                    ? 'bg-zinc-800 text-zinc-300 border border-zinc-700/60'
                    : 'bg-zinc-900/60 text-zinc-500'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4 text-zinc-300" /> : <Icon className="w-4 h-4" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] sm:text-[11px] font-medium text-zinc-500 truncate">
                  مرحله {s.step}
                </div>
                <div className={`text-xs font-bold truncate ${isCurrent ? 'text-indigo-300' : isCompleted ? 'text-zinc-200' : 'text-zinc-400'}`}>
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
