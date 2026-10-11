import React from 'react';
import { Logo } from '../branding/Logo';
import { UserStats } from '../../types';
import { Flame, Moon, Sun, Database } from 'lucide-react';

interface HeaderStatsProps {
  stats: UserStats | null;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenBackup: () => void;
}

export const HeaderStats: React.FC<HeaderStatsProps> = ({
  stats,
  isDark,
  onToggleTheme,
  onOpenBackup,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Logo showSlogan size="md" />

        {/* Right Action Icons & Streak */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Daily Streak Counter */}
          <div
            title="Chuỗi ngày học liên tục"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-bold shadow-xs select-none"
          >
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse" />
            <span>{stats?.streak || 1} ngày</span>
          </div>

          {/* Backup / Restore Modal Trigger */}
          <button
            onClick={onOpenBackup}
            title="Sao lưu & Phục hồi dữ liệu IndexedDB"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition cursor-pointer"
          >
            <Database className="w-4 h-4" />
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={onToggleTheme}
            title={isDark ? 'Chuyển sang chế độ Sáng (Iceberg White)' : 'Chuyển sang chế độ Tối (Midnight Abyss)'}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition cursor-pointer"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
        </div>
      </div>
    </header>
  );
};
