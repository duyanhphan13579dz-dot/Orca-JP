import React from 'react';
import { UserStats, SRSCard } from '../../types';
import { OrcaMascot } from '../../assets/mascots/OrcaMascot';
import { Flame, Calendar, Award, Database } from 'lucide-react';
import { StudyHeatmap } from './StudyHeatmap';
import { JLPTReadinessCard } from './JLPTReadinessCard';

interface MemoryMatrixProps {
  stats: UserStats | null;
  cards: SRSCard[];
}

export const MemoryMatrix: React.FC<MemoryMatrixProps> = ({ stats, cards }) => {
  const n5Cards = cards.filter(c => c.level === 'N5');
  const n4Cards = cards.filter(c => c.level === 'N4');
  const n3Cards = cards.filter(c => c.level === 'N3');

  const n5Mastered = n5Cards.filter(c => c.status === 'mastered').length;
  const n4Mastered = n4Cards.filter(c => c.status === 'mastered').length;
  const n3Mastered = n3Cards.filter(c => c.status === 'mastered').length;

  const totalMastered = n5Mastered + n4Mastered + n3Mastered;
  const totalCards = cards.length || 1;
  const overallMasteryPercent = Math.round((totalMastered / totalCards) * 100);

  // Projected JLPT readiness date
  // Assuming 10 cards mastered per week
  const remainingCards = Math.max(0, totalCards - totalMastered);
  const weeksNeeded = Math.ceil(remainingCards / 7);
  const projectedDate = new Date();
  projectedDate.setDate(projectedDate.getDate() + weeksNeeded * 7);
  const formattedProjectedDate = projectedDate.toLocaleDateString('vi-VN', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="space-y-6">
      {/* Top Banner with Mascot Celebration */}
      <div className="p-6 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10 dark:from-cyan-950/30 dark:via-blue-950/30 dark:to-indigo-950/30 border border-cyan-500/20 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-bold">
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
            Chuỗi học liên tục: {stats?.streak || 1} ngày
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Trung tâm Phân tích Trí nhớ & Gamification
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md">
            Mô hình hóa đường cong lãng quên Ebbinghaus, tính toán điểm sẵn sàng thi JLPT và trực quan hóa thói quen học tập 365 ngày.
          </p>
        </div>

        <OrcaMascot mood="celebration" size={130} />
      </div>

      {/* 4 Bento Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Total Mastered */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-3">
            <Award className="w-5 h-5" />
          </div>
          <span className="text-xs text-slate-400 uppercase font-semibold">Thẻ đã thuần thục</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
            {totalMastered} / {totalCards}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
            {overallMasteryPercent}% kho kiến thức
          </div>
        </div>

        {/* Stat 2: N5 Status */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-teal-600 dark:text-teal-400">N5 Nhập môn</span>
            <span className="text-xs font-black">{n5Cards.length ? Math.round((n5Mastered / n5Cards.length) * 100) : 0}%</span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {n5Mastered} <span className="text-xs text-slate-400 font-normal">/ {n5Cards.length} thẻ</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-teal-500 h-full rounded-full transition-all"
              style={{ width: `${n5Cards.length ? (n5Mastered / n5Cards.length) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Stat 3: N4 & N3 Status */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-sky-600 dark:text-sky-400">N4 & N3</span>
            <span className="text-xs font-black">
              {n4Mastered + n3Mastered} thẻ
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {n4Cards.length + n3Cards.length} <span className="text-xs text-slate-400 font-normal">tổng thẻ</span>
          </div>
          <div className="text-[11px] text-sky-600 dark:text-sky-400 mt-1 font-medium">
            N4: {n4Mastered} • N3: {n3Mastered}
          </div>
        </div>

        {/* Stat 4: Projected JLPT readiness */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-3">
            <Calendar className="w-5 h-5" />
          </div>
          <span className="text-xs text-slate-400 uppercase font-semibold">Dự kiến sẵn sàng thi</span>
          <div className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
            {formattedProjectedDate}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Dựa trên tốc độ ôn tập hàng ngày
          </div>
        </div>
      </div>

      {/* Gamification Pillar 1: JLPT Readiness Score */}
      <JLPTReadinessCard cards={cards} />

      {/* Gamification Pillar 2: GitHub-style 52-Week Contribution Heatmap */}
      <StudyHeatmap currentStreak={stats?.streak || 1} />

      {/* Storage and System Health status */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-cyan-500" />
          <span className="text-slate-600 dark:text-slate-300">
            Trạng thái lưu trữ IndexedDB: <strong className="text-emerald-500">Đã đồng bộ cục bộ (Offline ready)</strong>
          </span>
        </div>
        <div className="text-slate-400">
          Tổng số lượt ôn tập đã ghi nhận: <strong className="text-slate-700 dark:text-slate-200">{stats?.totalReviewsCompleted || 0}</strong>
        </div>
      </div>
    </div>
  );
};
