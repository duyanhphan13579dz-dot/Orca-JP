import React, { useState, useMemo } from 'react';
import { GrammarItem, JLPTLevel } from '../../types';
import { NUANCE_PAIRS, NuanceDuel } from '../../data/nuancePairs';
import { AudioButton } from '../common/AudioButton';
import { LevelBadge } from '../common/LevelBadge';
import { Scale, BrainCircuit, AlertTriangle, Search } from 'lucide-react';

interface NuanceComparatorProps {
  grammarList?: GrammarItem[];
}

export const NuanceComparator: React.FC<NuanceComparatorProps> = ({ grammarList = [] }) => {
  const [selectedLevel, setSelectedLevel] = useState<'all' | JLPTLevel>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Combine static NUANCE_PAIRS with any items from grammarList having nuanceVs
  const allPairs: NuanceDuel[] = useMemo(() => {
    const list: NuanceDuel[] = [...NUANCE_PAIRS];

    // Merge any from grammarList not already present
    for (const g of grammarList) {
      if (g.nuanceVs && !list.some((p) => p.patternA.includes(g.title) || p.title.includes(g.title))) {
        list.push({
          id: `custom-${g.id}`,
          level: g.level,
          patternA: g.title,
          patternB: g.nuanceVs.rivalTitle,
          title: `${g.title} vs ${g.nuanceVs.rivalTitle}`,
          coreDifference: g.nuanceVs.difference,
          whenToUseA: g.nuanceVs.whenToUseA,
          whenToUseB: g.nuanceVs.whenToUseB,
          mnemonicTrick: g.nuanceVs.trick,
          exampleA: {
            jp: g.examples[0]?.jp || g.title,
            vi: g.examples[0]?.vi || '',
          },
          exampleB: {
            jp: g.examples[1]?.jp || g.nuanceVs.rivalTitle,
            vi: g.examples[1]?.vi || '',
          },
          commonTrap: 'Lưu ý sự khác biệt ngữ cảnh và điều kiện đi kèm của hai mẫu câu.',
        });
      }
    }
    return list;
  }, [grammarList]);

  const filteredPairs = useMemo(() => {
    return allPairs.filter((p) => {
      const matchLvl = selectedLevel === 'all' || p.level === selectedLevel;
      if (!matchLvl) return false;
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.patternA.toLowerCase().includes(q) ||
        p.patternB.toLowerCase().includes(q) ||
        p.coreDifference.toLowerCase().includes(q) ||
        p.mnemonicTrick.toLowerCase().includes(q)
      );
    });
  }, [allPairs, selectedLevel, searchQuery]);

  const currentPair: NuanceDuel | undefined = filteredPairs[selectedIndex % (filteredPairs.length || 1)];

  return (
    <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Bộ So Sánh Sắc Thái Ngữ Pháp Thực Chiến
              </h3>
              <span className="px-2 py-0.5 text-[10px] bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-full font-bold">
                Độc quyền Orca
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Phân tích sự khác biệt tâm lý và bẫy đề thi JLPT của những cặp ngữ pháp dễ gây nhầm lẫn nhất
            </p>
          </div>
        </div>

        {/* Level filter */}
        <div className="flex items-center gap-1.5">
          {(['all', 'N5', 'N4', 'N3'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => {
                setSelectedLevel(lvl);
                setSelectedIndex(0);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition cursor-pointer ${
                selectedLevel === lvl
                  ? 'bg-cyan-500 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {lvl === 'all' ? 'Tất cả' : lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Search & Selector row */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm cặp ngữ pháp..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        {filteredPairs.length > 0 && (
          <select
            value={selectedIndex}
            onChange={(e) => setSelectedIndex(Number(e.target.value))}
            className="w-full sm:w-auto bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            {filteredPairs.map((p, idx) => (
              <option key={p.id} value={idx}>
                [{p.level}] {p.title}
              </option>
            ))}
          </select>
        )}
      </div>

      {!currentPair ? (
        <div className="text-center py-12 text-slate-400 text-sm">
          Không tìm thấy cặp so sánh nào phù hợp với bộ lọc.
        </div>
      ) : (
        <div className="space-y-6">
          {/* Pair Title & Core Difference Highlight */}
          <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <LevelBadge level={currentPair.level} size="sm" />
                <h4 className="text-base font-black text-cyan-900 dark:text-cyan-200">
                  {currentPair.title}
                </h4>
              </div>
              <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                Điểm Khác Biệt Cốt Lõi
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
              {currentPair.coreDifference}
            </p>
          </div>

          {/* Main Duel Cards: A vs B */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pattern A Card */}
            <div className="p-5 rounded-2xl bg-blue-50/50 dark:bg-slate-800/50 border-2 border-blue-500/30 shadow-xs relative space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500 text-white text-[10px] font-black uppercase">
                  Mẫu A
                </span>
                <span className="text-base font-black text-blue-600 dark:text-blue-400 font-jp">
                  {currentPair.patternA}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                  Khi nào sử dụng:
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                  {currentPair.whenToUseA}
                </p>
              </div>

              {/* Example A */}
              <div className="pt-2 border-t border-blue-200/50 dark:border-slate-700/60">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                  Ví dụ thực tế:
                </span>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-jp text-xs font-bold text-slate-900 dark:text-white">
                      {currentPair.exampleA.jp}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {currentPair.exampleA.vi}
                    </div>
                  </div>
                  <AudioButton text={currentPair.exampleA.jp} level={currentPair.level} size="sm" />
                </div>
              </div>
            </div>

            {/* Pattern B Card */}
            <div className="p-5 rounded-2xl bg-purple-50/50 dark:bg-slate-800/50 border-2 border-purple-500/30 shadow-xs relative space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500 text-white text-[10px] font-black uppercase">
                  Mẫu B
                </span>
                <span className="text-base font-black text-purple-600 dark:text-purple-400 font-jp">
                  {currentPair.patternB}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                  Khi nào sử dụng:
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                  {currentPair.whenToUseB}
                </p>
              </div>

              {/* Example B */}
              <div className="pt-2 border-t border-purple-200/50 dark:border-slate-700/60">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                  Ví dụ thực tế:
                </span>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-jp text-xs font-bold text-slate-900 dark:text-white">
                      {currentPair.exampleB.jp}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {currentPair.exampleB.vi}
                    </div>
                  </div>
                  <AudioButton text={currentPair.exampleB.jp} level={currentPair.level} size="sm" />
                </div>
              </div>
            </div>
          </div>

          {/* Mnemonic Trick & Trap Alert */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Mnemonic Trick */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
              <BrainCircuit className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-black text-amber-700 dark:text-amber-300 block mb-1">
                  Mẹo Nhớ Siêu Tốc (Mnemonic):
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {currentPair.mnemonicTrick}
                </p>
              </div>
            </div>

            {/* Trap Warning */}
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-black text-rose-700 dark:text-rose-300 block mb-1">
                  Cảnh Báo Bẫy Đề Thi JLPT:
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {currentPair.commonTrap}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
