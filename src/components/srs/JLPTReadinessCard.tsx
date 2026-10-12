import React, { useState, useMemo } from 'react';
import { SRSCard } from '../../types';
import confetti from 'canvas-confetti';
import { Award, Target, Sparkles, BookOpen, Layers } from 'lucide-react';
import { OrcaMascot } from '../../assets/mascots/OrcaMascot';

interface JLPTReadinessCardProps {
  cards: SRSCard[];
}

interface LevelBenchmark {
  targetKanji: number;
  targetVocab: number;
  targetGrammar: number;
  passScoreMin: number;
  description: string;
}

const BENCHMARKS: Record<'N5' | 'N4' | 'N3', LevelBenchmark> = {
  N5: {
    targetKanji: 100,
    targetVocab: 600,
    targetGrammar: 40,
    passScoreMin: 80,
    description: 'Hiểu các câu văn tiếng Nhật cơ bản, hiragana, katakana và chữ Hán thông dụng trong đời sống.',
  },
  N4: {
    targetKanji: 180,
    targetVocab: 1200,
    targetGrammar: 80,
    passScoreMin: 90,
    description: 'Đọc hiểu các chủ đề thường nhật, hội thoại tốc độ chậm và các thể động từ biến hóa.',
  },
  N3: {
    targetKanji: 350,
    targetVocab: 2000,
    targetGrammar: 140,
    passScoreMin: 95,
    description: 'Hiểu tiếng Nhật trong các tình huống thực tế thường nhật, đọc hiểu báo chí cơ bản và phân biệt sắc thái ngữ pháp.',
  },
};

export const JLPTReadinessCard: React.FC<JLPTReadinessCardProps> = ({ cards }) => {
  const [selectedLevel, setSelectedLevel] = useState<'N5' | 'N4' | 'N3'>('N5');

  // Compute mastered counts for the selected level
  const stats = useMemo(() => {
    const levelCards = cards.filter(c => c.level === selectedLevel);
    const benchmark = BENCHMARKS[selectedLevel];

    const masteredCards = levelCards.filter(c => c.status === 'mastered');
    const masteredKanji = masteredCards.filter(c => c.type === 'kanji').length;
    const masteredVocab = masteredCards.filter(c => c.type === 'vocab').length;
    const masteredGrammar = masteredCards.filter(c => c.type === 'grammar').length;

    // Relative mastery percentages capped at 100%
    const kanjiPercent = Math.min(100, Math.round((masteredKanji / benchmark.targetKanji) * 100));
    const vocabPercent = Math.min(100, Math.round((masteredVocab / benchmark.targetVocab) * 100));
    const grammarPercent = Math.min(100, Math.round((masteredGrammar / benchmark.targetGrammar) * 100));

    // Weighted JLPT Readiness Score: 35% Kanji + 40% Vocab + 25% Grammar
    // If cards count is small, scale based on current learning progress in deck
    const deckProgress = levelCards.length > 0 ? (masteredCards.length / levelCards.length) : 0;
    const weightedScore = Math.min(
      100,
      Math.round(kanjiPercent * 0.35 + vocabPercent * 0.40 + grammarPercent * 0.25 + deckProgress * 25)
    );

    let statusText = 'Đang khởi động kiến thức';
    let statusColor = 'text-amber-500';
    let statusBg = 'bg-amber-500/10 border-amber-500/20';

    if (weightedScore >= 85) {
      statusText = 'Sẵn sàng thi đỗ điểm cao!';
      statusColor = 'text-emerald-500';
      statusBg = 'bg-emerald-500/10 border-emerald-500/20';
    } else if (weightedScore >= 60) {
      statusText = 'Tiến bộ ổn định, sắp đạt chuẩn';
      statusColor = 'text-cyan-500';
      statusBg = 'bg-cyan-500/10 border-cyan-500/20';
    } else if (weightedScore >= 35) {
      statusText = 'Đang củng cố nền tảng';
      statusColor = 'text-blue-500';
      statusBg = 'bg-blue-500/10 border-blue-500/20';
    }

    return {
      masteredKanji,
      masteredVocab,
      masteredGrammar,
      kanjiPercent,
      vocabPercent,
      grammarPercent,
      weightedScore,
      statusText,
      statusColor,
      statusBg,
      benchmark,
    };
  }, [cards, selectedLevel]);

  const triggerCelebrate = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#06B6D4', '#38BDF8', '#818CF8', '#F59E0B'],
    });
  };

  return (
    <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm space-y-6">
      {/* Header and Level Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-500" />
              <span>Chỉ Số Sẵn Sàng Thi JLPT (Readiness Score)</span>
            </h3>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-500/20">
              Chuẩn Ebbinghaus
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Ước lượng xác suất đỗ kỳ thi JLPT dựa trên các thẻ đã đạt trạng thái Thuần Thục (Mastered)
          </p>
        </div>

        {/* Level Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
          {(['N5', 'N4', 'N3'] as const).map(lvl => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedLevel === lvl
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Mục tiêu {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Main Readiness Gauge Hero Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-500/5 via-cyan-500/5 to-purple-500/5 border border-indigo-500/15 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left flex-1">
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
            <span className="text-xs font-semibold text-slate-500">Mức độ sẵn sàng đỗ {selectedLevel}:</span>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${stats.statusBg} ${stats.statusColor}`}>
              {stats.statusText}
            </span>
          </div>

          <div className="flex items-baseline gap-2 justify-center sm:justify-start">
            <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
              {stats.weightedScore}%
            </span>
            <span className="text-xs text-slate-400">/ 100% chuẩn năng lực</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-3 rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 rounded-full transition-all duration-700 shadow-xs"
              style={{ width: `${stats.weightedScore}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
            {stats.benchmark.description}
          </p>
        </div>

        <div className="flex flex-col items-center gap-2">
          <OrcaMascot mood={stats.weightedScore >= 70 ? 'celebration' : 'studying'} size={85} />
          <button
            onClick={triggerCelebrate}
            className="px-3 py-1 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-400 transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Tiếp thêm động lực</span>
          </button>
        </div>
      </div>

      {/* 3 Pillars Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Pillar 1: Kanji */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" /> Chữ Hán (Kanji)
            </span>
            <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
              {stats.kanjiPercent}%
            </span>
          </div>
          <div className="text-lg font-black text-slate-900 dark:text-white">
            {stats.masteredKanji} <span className="text-xs text-slate-400 font-normal">/ {stats.benchmark.targetKanji} mục tiêu</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div className="bg-cyan-500 h-full rounded-full transition-all" style={{ width: `${stats.kanjiPercent}%` }} />
          </div>
        </div>

        {/* Pillar 2: Vocab */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5" /> Từ vựng (Vocabulary)
            </span>
            <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
              {stats.vocabPercent}%
            </span>
          </div>
          <div className="text-lg font-black text-slate-900 dark:text-white">
            {stats.masteredVocab} <span className="text-xs text-slate-400 font-normal">/ {stats.benchmark.targetVocab} mục tiêu</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-full rounded-full transition-all" style={{ width: `${stats.vocabPercent}%` }} />
          </div>
        </div>

        {/* Pillar 3: Grammar */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" /> Ngữ pháp (Grammar)
            </span>
            <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
              {stats.grammarPercent}%
            </span>
          </div>
          <div className="text-lg font-black text-slate-900 dark:text-white">
            {stats.masteredGrammar} <span className="text-xs text-slate-400 font-normal">/ {stats.benchmark.targetGrammar} mục tiêu</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div className="bg-purple-500 h-full rounded-full transition-all" style={{ width: `${stats.grammarPercent}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
};
