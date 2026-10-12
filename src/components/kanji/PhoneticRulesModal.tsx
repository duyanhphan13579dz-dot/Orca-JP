import React, { useState, useMemo } from 'react';
import { PHONETIC_RULES } from '../../data/phoneticRules';
import { AudioButton } from '../common/AudioButton';
import { Sparkles, X, Search } from 'lucide-react';

interface PhoneticRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PhoneticRulesModal: React.FC<PhoneticRulesModalProps> = ({ isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'rhyme' | 'initial_consonant' | 'tone'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRules = useMemo(() => {
    return PHONETIC_RULES.filter((rule) => {
      const matchCategory = selectedCategory === 'all' || rule.category === selectedCategory;
      if (!matchCategory) return false;

      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        rule.vietnamesePattern.toLowerCase().includes(q) ||
        rule.japaneseOnyomi.toLowerCase().includes(q) ||
        rule.explanation.toLowerCase().includes(q) ||
        rule.examples.some(
          (ex) =>
            ex.hanViet.toLowerCase().includes(q) ||
            ex.kanji.includes(q) ||
            ex.meaning.toLowerCase().includes(q)
        )
      );
    });
  }, [selectedCategory, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Kho Quy Tắc Chuyển Âm Hán-Việt ➔ Onyomi
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-cyan-500/10 text-cyan-500 rounded-full">
                  Bí Kíp Độc Quyền
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Biến vốn từ vựng Hán-Việt thành vũ khí đoán âm On của hàng trăm chữ Kanji không cần học vẹt
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Category Chips */}
          <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
            {[
              { id: 'all', label: 'Tất cả quy tắc' },
              { id: 'rhyme', label: 'Theo Vần (-AN, -ƯƠNG, -ÂT...)' },
              { id: 'initial_consonant', label: 'Theo Phụ Âm Đầu (Đ-, B-, TR-...)' },
              { id: 'tone', label: 'Theo Thanh Điệu (Nặng, Ngã...)' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-cyan-500 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-cyan-400'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm vần, Hán-Việt, Onyomi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>

        {/* Rules Grid */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {filteredRules.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              Không tìm thấy quy tắc nào phù hợp với từ khóa "{searchQuery}"
            </div>
          ) : (
            filteredRules.map((rule) => (
              <div
                key={rule.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 hover:border-cyan-500/50 shadow-xs transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 font-black text-sm">
                      {rule.vietnamesePattern}
                    </span>
                    <span className="text-slate-400">➔</span>
                    <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-black text-sm">
                      {rule.japaneseOnyomi}
                    </span>
                  </div>

                  <span className="text-[11px] font-medium text-slate-400">
                    {rule.category === 'rhyme' && 'Nhóm Vần'}
                    {rule.category === 'initial_consonant' && 'Nhóm Phụ Âm Đầu'}
                    {rule.category === 'tone' && 'Nhóm Thanh Điệu'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 mb-3 leading-relaxed">
                  {rule.explanation}
                </p>

                {/* Example Kanji Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {rule.examples.map((ex, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-jp text-lg font-bold text-slate-900 dark:text-white">
                            {ex.kanji}
                          </span>
                          <span className="text-[11px] font-bold text-rose-500">
                            {ex.hanViet}
                          </span>
                        </div>
                        <div className="text-[10px] text-cyan-600 dark:text-cyan-400 font-semibold">
                          On: {ex.onyomi}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[120px]">
                          {ex.meaning}
                        </div>
                      </div>

                      <AudioButton text={ex.kanji} level="N5" size="sm" />
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
