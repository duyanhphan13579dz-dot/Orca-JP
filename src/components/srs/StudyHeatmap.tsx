import React, { useState, useEffect, useMemo } from 'react';
import { DailyStreakRecord } from '../../types';
import { dataLoader } from '../../db/dataLoader';
import { Flame, Calendar, Sparkles, TrendingUp, HelpCircle } from 'lucide-react';

interface StudyHeatmapProps {
  initialStreaks?: DailyStreakRecord[];
  currentStreak?: number;
}

interface DayCell {
  dateStr: string; // YYYY-MM-DD
  dayOfWeek: number; // 0 (Sun) to 6 (Sat)
  reviews: number;
  formattedDate: string;
}

export const StudyHeatmap: React.FC<StudyHeatmapProps> = ({ currentStreak = 1 }) => {
  const [streaks, setStreaks] = useState<DailyStreakRecord[]>([]);
  const [activeCell, setActiveCell] = useState<DayCell | null>(null);

  // Fetch daily study streaks from IndexedDB
  useEffect(() => {
    let isMounted = true;
    dataLoader.getDailyStreaks(365).then((data) => {
      if (isMounted) setStreaks(data);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Map of YYYY-MM-DD -> reviewsCount
  const streaksMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of streaks) {
      map.set(s.date, s.reviewsCount);
    }
    return map;
  }, [streaks]);

  // Generate 52 weeks ending today
  const { weeks, totalReviewsYear, activeDaysCount, maxReviewsInDay } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Compute start date: 52 weeks ago, aligned to Monday
    const daysToShow = 52 * 7;
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - daysToShow + 1);

    // Adjust to Monday
    const dayOfWeek = startDate.getDay();
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    startDate.setDate(startDate.getDate() + diffToMonday);

    const generatedWeeks: DayCell[][] = [];
    let currentWeek: DayCell[] = [];
    let totalReviews = 0;
    let activeDays = 0;
    let maxReviews = 0;

    const curr = new Date(startDate);
    while (curr <= today || currentWeek.length > 0) {
      const dateStr = curr.toISOString().slice(0, 10);
      const reviews = streaksMap.get(dateStr) || 0;
      totalReviews += reviews;
      if (reviews > 0) activeDays++;
      if (reviews > maxReviews) maxReviews = reviews;

      const cell: DayCell = {
        dateStr,
        dayOfWeek: curr.getDay(),
        reviews,
        formattedDate: curr.toLocaleDateString('vi-VN', {
          weekday: 'short',
          day: 'numeric',
          month: 'numeric',
          year: 'numeric',
        }),
      };

      currentWeek.push(cell);

      if (currentWeek.length === 7) {
        generatedWeeks.push(currentWeek);
        currentWeek = [];
      }

      if (curr > today && currentWeek.length === 0) {
        break;
      }

      curr.setDate(curr.getDate() + 1);
    }

    return {
      weeks: generatedWeeks,
      totalReviewsYear: totalReviews,
      activeDaysCount: activeDays,
      maxReviewsInDay: maxReviews,
    };
  }, [streaksMap]);

  // Color intensity helper
  const getColorClass = (reviews: number) => {
    if (reviews === 0) {
      return 'bg-slate-100 dark:bg-slate-800/80 hover:ring-1 hover:ring-slate-300 dark:hover:ring-slate-600';
    }
    if (reviews <= 4) {
      return 'bg-cyan-500/30 dark:bg-cyan-600/40 hover:ring-1 hover:ring-cyan-400';
    }
    if (reviews <= 9) {
      return 'bg-cyan-500/60 dark:bg-cyan-500/70 hover:ring-1 hover:ring-cyan-300';
    }
    if (reviews <= 19) {
      return 'bg-cyan-500/90 dark:bg-cyan-400 hover:ring-2 hover:ring-cyan-200';
    }
    return 'bg-cyan-400 dark:bg-cyan-300 shadow-xs hover:ring-2 hover:ring-white';
  };

  return (
    <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-4">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-500" />
              <span>Biểu Đồ Thói Quen Học Tập (Contribution Heatmap)</span>
            </h3>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold border border-cyan-500/20">
              52 Tuần
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Mỗi ô đại diện cho số lượt thẻ flashcard được ôn luyện trong ngày
          </p>
        </div>

        {/* Quick Highlights */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-bold">
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>Chuỗi: {currentStreak} ngày</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 font-bold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{totalReviewsYear} lượt năm nay</span>
          </div>
        </div>
      </div>

      {/* Heatmap Matrix Grid */}
      <div className="overflow-x-auto pb-2 pt-1">
        <div className="min-w-[720px] flex gap-1.5 justify-start">
          {weeks.map((week, wIdx) => (
            <div key={wIdx} className="flex flex-col gap-1.5">
              {week.map((day, dIdx) => (
                <div
                  key={dIdx}
                  onMouseEnter={() => setActiveCell(day)}
                  onMouseLeave={() => setActiveCell(null)}
                  className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-sm transition-all cursor-pointer ${getColorClass(
                    day.reviews
                  )}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Footer Controls & Legend */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
        {/* Active Hover Tooltip Display */}
        <div className="h-5 flex items-center font-medium">
          {activeCell ? (
            <span className="text-cyan-600 dark:text-cyan-400 font-bold animate-fade-in flex items-center gap-1.5">
              <span>📅 {activeCell.formattedDate}:</span>
              <span>{activeCell.reviews} lượt ôn tập</span>
            </span>
          ) : (
            <span className="text-slate-400 italic">
              Di chuột vào từng ô vuông để xem số lượng ôn tập cụ thể
            </span>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1.5 select-none">
          <span className="text-[11px] text-slate-400">Ít</span>
          <div className="w-3 h-3 rounded-xs bg-slate-100 dark:bg-slate-800/80" />
          <div className="w-3 h-3 rounded-xs bg-cyan-500/30" />
          <div className="w-3 h-3 rounded-xs bg-cyan-500/60" />
          <div className="w-3 h-3 rounded-xs bg-cyan-500/90" />
          <div className="w-3 h-3 rounded-xs bg-cyan-400 shadow-xs" />
          <span className="text-[11px] text-slate-400 ml-1">Nhiều</span>
        </div>
      </div>
    </div>
  );
};
