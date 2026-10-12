import React from 'react';
import { JLPTLevel } from '../../types';
import { Sparkles, Compass, Shield, Flame } from 'lucide-react';

interface LevelSelectorProps {
  currentLevel: JLPTLevel;
  onSelectLevel: (lvl: JLPTLevel) => void;
  className?: string;
}

export const LevelSelector: React.FC<LevelSelectorProps> = ({
  currentLevel,
  onSelectLevel,
  className = '',
}) => {
  const levels: { id: JLPTLevel; title: string; subtitle: string; icon: React.ReactNode; color: string }[] = [
    {
      id: 'Zero',
      title: 'Zero',
      subtitle: 'Kana & Phát âm',
      icon: <Sparkles className="w-3.5 h-3.5" />,
      color: 'from-emerald-500 to-teal-500',
    },
    {
      id: 'N5',
      title: 'N5',
      subtitle: 'Nhập môn (SOV)',
      icon: <Compass className="w-3.5 h-3.5" />,
      color: 'from-teal-500 to-cyan-500',
    },
    {
      id: 'N4',
      title: 'N4',
      subtitle: 'Sơ cấp (Biến đổi thể)',
      icon: <Shield className="w-3.5 h-3.5" />,
      color: 'from-cyan-500 to-blue-600',
    },
    {
      id: 'N3',
      title: 'N3',
      subtitle: 'Trung cấp (Đọc hiểu sâu)',
      icon: <Flame className="w-3.5 h-3.5" />,
      color: 'from-indigo-500 to-purple-600',
    },
  ];

  return (
    <div className={`flex items-center p-1 bg-slate-100 dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner ${className}`}>
      {levels.map((lvl) => {
        const isActive = currentLevel === lvl.id;
        return (
          <button
            key={lvl.id}
            onClick={() => onSelectLevel(lvl.id)}
            className={`flex-1 relative flex items-center justify-center gap-1.5 sm:gap-2 py-1.5 sm:py-2 px-1 sm:px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
              isActive
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-md shadow-cyan-500/10 border border-slate-200/80 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/40'
            }`}
          >
            <div
              className={`w-5 h-5 sm:w-6 sm:h-6 rounded-lg flex items-center justify-center transition-transform ${
                isActive ? `bg-gradient-to-tr ${lvl.color} text-white scale-105 sm:scale-110 shadow-sm` : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
              }`}
            >
              {lvl.icon}
            </div>

            <div className="flex flex-col text-left">
              <span className="font-bold leading-tight">{lvl.title}</span>
              <span className="hidden md:inline text-[10px] text-slate-500 dark:text-slate-400 font-normal leading-tight">
                {lvl.subtitle}
              </span>
            </div>

            {isActive && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
};
