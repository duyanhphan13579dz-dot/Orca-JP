import React from 'react';
import { WordLookup } from '../../types';
import { AudioButton } from '../common/AudioButton';
import { X, BookMarked } from 'lucide-react';

interface ClickLookupModalProps {
  wordData: WordLookup | null;
  onClose: () => void;
}

export const ClickLookupModal: React.FC<ClickLookupModalProps> = ({ wordData, onClose }) => {
  if (!wordData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 max-w-sm w-full shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-3">
          <BookMarked className="w-4 h-4 text-cyan-500" />
          <span className="text-[11px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
            Tra từ nhanh trong bài đọc
          </span>
        </div>

        {/* Word Kanji / Hiragana */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="font-jp text-3xl font-black text-slate-900 dark:text-white">
              {wordData.word}
            </div>
            <div className="text-xs text-cyan-600 dark:text-cyan-400 font-semibold">
              Cách đọc: {wordData.furigana}
            </div>
          </div>
          <AudioButton text={wordData.word} level="N3" size="md" />
        </div>

        {/* Han-Viet & Type */}
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold">
            Âm Hán: {wordData.hanViet}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium">
            {wordData.type}
          </span>
        </div>

        {/* Meaning */}
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 mb-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Giải nghĩa tiếng Việt</span>
          <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 leading-snug">
            {wordData.meaning}
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition cursor-pointer"
        >
          Tiếp tục đọc bài
        </button>
      </div>
    </div>
  );
};
