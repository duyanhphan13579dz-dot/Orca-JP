import React from 'react';
import { MainTab } from '../../types';
import { Sparkles, BookOpen, GitCompare, BookMarked, Brain, BarChart3 } from 'lucide-react';

interface BentoSidebarProps {
  activeTab: MainTab;
  onSelectTab: (tab: MainTab) => void;
  dueCardsCount: number;
}

export const BentoSidebar: React.FC<BentoSidebarProps> = ({
  activeTab,
  onSelectTab,
  dueCardsCount,
}) => {
  const tabs: { id: MainTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'kana',
      label: 'Bảng chữ cái & Game',
      icon: <Sparkles className="w-4 h-4" />,
    },
    {
      id: 'kanji',
      label: 'Thư viện Kanji',
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      id: 'grammar',
      label: 'Ngữ pháp & Sắc thái',
      icon: <GitCompare className="w-4 h-4" />,
    },
    {
      id: 'dokkai',
      label: 'Đọc hiểu Dokkai',
      icon: <BookMarked className="w-4 h-4" />,
    },
    {
      id: 'srs',
      label: 'Ôn tập SRS SM-2',
      icon: <Brain className="w-4 h-4" />,
      badge: dueCardsCount > 0 ? dueCardsCount : undefined,
    },
    {
      id: 'dashboard',
      label: 'Thống kê Trí nhớ',
      icon: <BarChart3 className="w-4 h-4" />,
    },
  ];

  return (
    <nav className="flex items-center gap-1.5 p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-x-auto no-scrollbar">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`flex items-center gap-2 py-2 px-3.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition cursor-pointer relative ${
              isActive
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>

            {tab.badge !== undefined && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  isActive ? 'bg-white text-cyan-600' : 'bg-cyan-500 text-white'
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};
