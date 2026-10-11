import React, { useState } from 'react';
import { GrammarItem } from '../../types';
import { Scale, Zap, Check, Sparkles, BrainCircuit } from 'lucide-react';

interface NuanceComparatorProps {
  grammarList: GrammarItem[];
}

export const NuanceComparator: React.FC<NuanceComparatorProps> = ({ grammarList }) => {
  const comparableItems = grammarList.filter(g => g.nuanceVs);
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (comparableItems.length === 0) {
    return <div className="text-center p-6 text-slate-400">Đang cập nhật các mẫu so sánh sắc thái...</div>;
  }

  const currentItem = comparableItems[selectedIndex % comparableItems.length];
  const nuance = currentItem.nuanceVs!;

  return (
    <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-cyan-500/20">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              Bộ so sánh Sắc thái Ngữ pháp
              <span className="px-2 py-0.5 text-[10px] bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-full font-bold">
                Độc quyền Orca
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Phân biệt những cấu trúc dễ gây nhầm lẫn nhất trong đề thi JLPT
            </p>
          </div>
        </div>

        {/* Pair Switcher */}
        <select
          value={selectedIndex}
          onChange={e => setSelectedIndex(Number(e.target.value))}
          className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          {comparableItems.map((item, idx) => (
            <option key={item.id} value={idx}>
              {item.title} VS {item.nuanceVs?.rivalTitle}
            </option>
          ))}
        </select>
      </div>

      {/* Main Duel Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Left Side: Pattern A */}
        <div className="p-5 rounded-2xl bg-cyan-50/50 dark:bg-slate-800/40 border-2 border-cyan-500/40 shadow-sm relative">
          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-cyan-500 text-white text-[10px] font-bold">
            Mẫu A
          </div>
          <h4 className="font-jp text-base font-black text-cyan-700 dark:text-cyan-300 mb-1">
            {currentItem.title}
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-3">
            Ý nghĩa cốt lõi: {currentItem.meaningVi}
          </p>

          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-cyan-500/20 text-xs space-y-2">
            <div className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-cyan-500" />
              Khi nào sử dụng:
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
              {nuance.whenToUseA}
            </p>
          </div>
        </div>

        {/* Right Side: Pattern B */}
        <div className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-slate-800/40 border-2 border-indigo-500/40 shadow-sm relative">
          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-indigo-500 text-white text-[10px] font-bold">
            Mẫu B (Đối trọng)
          </div>
          <h4 className="font-jp text-base font-black text-indigo-700 dark:text-indigo-300 mb-1">
            {nuance.rivalTitle}
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-3">
            Sắc thái đối ứng trong giao tiếp
          </p>

          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-indigo-500/20 text-xs space-y-2">
            <div className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-indigo-500" />
              Khi nào sử dụng:
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
              {nuance.whenToUseB}
            </p>
          </div>
        </div>
      </div>

      {/* Difference In Psychology */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 mb-4">
        <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-800 dark:text-slate-200">
          <BrainCircuit className="w-4 h-4 text-cyan-500" />
          <span>Bản chất Tâm lý người nói (Speaker Psychology):</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          {nuance.difference}
        </p>
      </div>

      {/* Golden Trick / JLPT exam tip */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 border border-amber-500/30 flex items-start gap-3">
        <div className="p-2 rounded-xl bg-amber-500 text-white flex-shrink-0 mt-0.5 shadow-sm">
          <Zap className="w-4 h-4" />
        </div>
        <div>
          <div className="font-bold text-amber-900 dark:text-amber-300 text-xs sm:text-sm flex items-center gap-1 mb-0.5">
            <Sparkles className="w-3.5 h-3.5" />
            Mẹo vàng phản xạ phòng thi JLPT
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            {nuance.trick}
          </p>
        </div>
      </div>
    </div>
  );
};
