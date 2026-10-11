import React, { useState } from 'react';
import { KanjiItem } from '../../types';
import { AudioButton } from '../common/AudioButton';
import { LevelBadge } from '../common/LevelBadge';
import { VirtualCanvas } from './VirtualCanvas';
import { Edit3, Layers, BookOpen, Sparkles, X } from 'lucide-react';

interface KanjiCardProps {
  kanji: KanjiItem;
  className?: string;
}

export const KanjiCard: React.FC<KanjiCardProps> = ({ kanji, className = '' }) => {
  const [showCanvas, setShowCanvas] = useState(false);

  return (
    <div className={`p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-md transition hover:shadow-lg ${className}`}>
      {/* Header Info */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <LevelBadge level={kanji.level} size="sm" />
          <span className="text-xs text-slate-400 font-semibold">{kanji.strokes} nét</span>
        </div>

        <button
          onClick={() => setShowCanvas(prev => !prev)}
          className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
            showCanvas
              ? 'bg-cyan-500 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-cyan-500'
          }`}
        >
          {showCanvas ? <X className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
          {showCanvas ? 'Đóng bảng vẽ' : 'Tập viết nét'}
        </button>
      </div>

      {/* Main Kanji Glyph + Han Viet block */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-500/10 via-slate-100 to-blue-500/10 dark:from-cyan-950/40 dark:via-slate-800/60 dark:to-blue-950/40 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 shadow-inner">
          <span className="font-jp text-5xl font-black text-slate-900 dark:text-white select-none">
            {kanji.kanji}
          </span>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-black tracking-wider text-rose-600 dark:text-rose-400">
              {kanji.hanViet}
            </h3>
            <AudioButton text={kanji.kanji} level={kanji.level} size="sm" />
          </div>
          <p className="text-xs font-medium text-slate-600 dark:text-slate-300 mt-0.5">
            {kanji.meaningVi}
          </p>

          {/* Radicals */}
          <div className="flex items-center gap-1 mt-2 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
            <Layers className="w-3.5 h-3.5 text-cyan-500 flex-shrink-0" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">Bộ thủ:</span>
            {kanji.radicals.map((rad, idx) => (
              <span key={idx} className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[11px] font-medium">
                {rad}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Virtual Canvas Drawer if open */}
      {showCanvas && (
        <div className="my-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-cyan-500/30 animate-fade-in flex flex-col items-center">
          <span className="text-xs font-bold text-slate-500 mb-2">Bảng luyện viết nét ảo: {kanji.kanji}</span>
          <VirtualCanvas guideChar={kanji.kanji} />
        </div>
      )}

      {/* On / Kun Readings Grid */}
      <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider block mb-1">
            Âm Onyomi (Âm Hán)
          </span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {kanji.onyomi.length > 0 ? kanji.onyomi.join(', ') : '—'}
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mb-1">
            Âm Kunyomi (Âm Nhật)
          </span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {kanji.kunyomi.length > 0 ? kanji.kunyomi.join(', ') : '—'}
          </span>
        </div>
      </div>

      {/* Phonetic Transfer Rule */}
      {kanji.phoneticRule && (
        <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-900 dark:text-cyan-200 text-xs mb-3 flex items-start gap-2">
          <Sparkles className="w-3.5 h-3.5 text-cyan-500 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Quy tắc chuyển âm Hán-Việt:</span> {kanji.phoneticRule}
          </div>
        </div>
      )}

      {/* Compound Jukugo Words */}
      {kanji.jukugo && kanji.jukugo.length > 0 && (
        <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            Từ ghép Jukugo thông dụng
          </span>
          <div className="space-y-1.5">
            {kanji.jukugo.map((w, idx) => (
              <div
                key={idx}
                className="p-2 rounded-xl bg-slate-50 hover:bg-cyan-50/50 dark:bg-slate-800/50 dark:hover:bg-slate-800 flex items-center justify-between text-xs transition"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-jp font-bold text-sm text-slate-900 dark:text-white">
                      {w.kanji}
                    </span>
                    <span className="text-cyan-600 dark:text-cyan-400 font-medium text-[11px]">
                      ({w.hiragana})
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold">
                      {w.hanViet}
                    </span>
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                    {w.meaningVi}
                  </div>
                </div>

                <AudioButton text={w.kanji} level={kanji.level} size="sm" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
