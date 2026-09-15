'use client';

import React from 'react';
import { AppTheme, THEME_OPTIONS } from '@/types/theme';
import { Palette, Check } from 'lucide-react';

interface ThemeSwitcherProps {
  currentTheme: AppTheme;
  onSelectTheme: (theme: AppTheme) => void;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ currentTheme, onSelectTheme }) => {
  return (
    <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950/60 border border-slate-800 backdrop-blur-md shadow-inner">
      <div className="hidden lg:flex items-center gap-1.5 px-2 text-[11px] font-bold text-slate-400 border-l border-slate-800">
        <Palette className="w-3.5 h-3.5 text-indigo-400" />
        <span>قالب طراحی:</span>
      </div>

      <div className="flex items-center gap-1">
        {THEME_OPTIONS.map((theme) => {
          const isActive = currentTheme === theme.id;
          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => onSelectTheme(theme.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
              title={`${theme.titleFa} - ${theme.descriptionFa}`}
            >
              <span>{theme.icon}</span>
              <span className="hidden sm:inline">{theme.titleFa.split(' ')[0]} {theme.titleFa.split(' ')[1]}</span>
              {isActive && <Check className="w-3 h-3 text-white hidden md:inline" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};
