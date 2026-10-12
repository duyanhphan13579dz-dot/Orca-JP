import React, { useState } from 'react';
import { Play, RotateCcw, Volume2, Sparkles, PenTool, ArrowRight, Lightbulb } from 'lucide-react';
import { useSpeech } from '../../hooks/useSpeech';
import { VirtualCanvas } from '../kanji/VirtualCanvas';

interface StrokePlayerProps {
  char: string;
  romaji: string;
  strokes: number;
  strokeSvgPath?: string;
  mnemonicVi?: string;
  className?: string;
  initialMode?: 'guide' | 'practice';
}

export const StrokePlayer: React.FC<StrokePlayerProps> = ({
  char,
  romaji,
  strokes,
  strokeSvgPath,
  mnemonicVi,
  className = '',
  initialMode = 'guide',
}) => {
  const [viewMode, setViewMode] = useState<'guide' | 'practice'>(initialMode);
  const [isPlaying, setIsPlaying] = useState(false);
  const [key, setKey] = useState(0);
  const { speak } = useSpeech();

  const handleReplay = () => {
    setIsPlaying(false);
    setTimeout(() => {
      setKey(prev => prev + 1);
      setIsPlaying(true);
      speak(char, 'Zero');
    }, 50);
  };

  // Rule tip based on stroke count
  const getStrokeRuleTip = (s: number) => {
    if (s === 1) return 'Viết 1 nét liền mạch: Bắt đầu từ trên/trái, uốn lượn dứt khoát không ngắt tay.';
    if (s === 2) return 'Viết 2 nét: Nét 1 (trái/trên) trước, nét 2 (phải/dưới) kéo dài hoặc uốn vòm sau.';
    if (s === 3) return 'Viết 3 nét: Nét ngang trên trước, nét giữa đứng sau, nét uốn cong/phẩy sau cùng.';
    if (s === 4) return 'Quy tắc bút thuận: Trên trước dưới sau, trái trước phải sau, nét ngang trước nét sổ.';
    return 'Quy tắc bút thuận chuẩn: Từ trên xuống dưới, từ trái sang phải, bao quanh trước đóng đáy sau.';
  };

  return (
    <div className={`p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col items-center ${className}`}>
      {/* Top Mode Switcher: Hướng dẫn nét vs Luyện viết nét */}
      <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl w-full mb-3 text-xs border border-slate-200/60 dark:border-slate-700/60">
        <button
          onClick={() => setViewMode('guide')}
          className={`flex-1 py-1.5 px-2 rounded-xl font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            viewMode === 'guide'
              ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 shadow-sm'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Hướng dẫn đi nét</span>
        </button>
        <button
          onClick={() => setViewMode('practice')}
          className={`flex-1 py-1.5 px-2 rounded-xl font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            viewMode === 'practice'
              ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 shadow-sm'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <PenTool className="w-3.5 h-3.5 text-cyan-500" />
          <span>Tập viết nét</span>
        </button>
      </div>

      {/* Title & Romaji Bar */}
      <div className="w-full flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
            {strokes} nét viết
          </span>
          <span className="text-xs text-slate-400 uppercase font-black tracking-wider">
            /{romaji}/
          </span>
        </div>
        <button
          onClick={() => speak(char, 'Zero')}
          className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-cyan-500 transition cursor-pointer"
          title="Nghe phát âm chuẩn"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>

      {/* MODE 1: HƯỚNG DẪN ĐI NÉT & ANIMATION */}
      {viewMode === 'guide' && (
        <div className="w-full flex flex-col items-center animate-fade-in">
          {/* Grid Canvas for Kanji / Kana strokes */}
          <div className="relative w-44 h-44 bg-slate-50 dark:bg-slate-950/70 rounded-3xl border-2 border-dashed border-cyan-500/30 flex items-center justify-center overflow-hidden my-2 group shadow-inner">
            {/* Japanese Genkouyoushi calligraphy guide lines */}
            <line x1="88" y1="0" x2="88" y2="176" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="text-slate-200 dark:text-slate-800" />
            <line x1="0" y1="88" x2="176" y2="88" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="text-slate-200 dark:text-slate-800" />
            <circle cx="88" cy="88" r="78" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" className="text-slate-200/60 dark:text-slate-800/60" />

            {strokeSvgPath ? (
              <svg key={key} width="150" height="150" viewBox="0 0 100 100" className="stroke-current text-slate-800 dark:text-cyan-300">
                <path
                  d={strokeSvgPath}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="400"
                  strokeDashoffset={isPlaying ? '0' : '400'}
                  style={{
                    transition: 'stroke-dashoffset 2s ease-in-out',
                  }}
                />
              </svg>
            ) : (
              <div
                key={key}
                className={`font-jp text-8xl font-black select-none text-slate-800 dark:text-cyan-300 transition-all duration-700 ${
                  isPlaying ? 'scale-105 filter drop-shadow(0 0 12px rgba(6,182,212,0.5))' : ''
                }`}
              >
                {char}
              </div>
            )}

            {/* Floating Play Overlay button if not playing */}
            {!isPlaying && (
              <button
                onClick={handleReplay}
                className="absolute inset-0 m-auto w-11 h-11 rounded-full bg-cyan-500 text-white flex items-center justify-center opacity-85 hover:opacity-100 transition shadow-lg cursor-pointer scale-95 hover:scale-105"
                title="Phát hoạt họa nét viết"
              >
                <Play className="w-5 h-5 ml-0.5" />
              </button>
            )}
          </div>

          {/* Action Button: Xem lại & Chuyển sang tập viết */}
          <div className="flex items-center gap-2 mt-2 w-full">
            <button
              onClick={handleReplay}
              className="flex-1 py-1.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Xem lại nét
            </button>
            <button
              onClick={() => setViewMode('practice')}
              className="flex-1 py-1.5 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm shadow-cyan-500/20 transition cursor-pointer"
            >
              <span>Luyện viết ngay</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Stroke Rules Tip */}
          <div className="mt-3 p-2.5 rounded-2xl bg-cyan-500/5 dark:bg-cyan-950/20 border border-cyan-500/20 text-slate-700 dark:text-slate-300 text-xs text-left w-full flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-cyan-500 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-cyan-600 dark:text-cyan-400">Hướng dẫn đi nét: </span>
              <span>{getStrokeRuleTip(strokes)}</span>
            </div>
          </div>

          {/* Mnemonic Vi */}
          {mnemonicVi && (
            <div className="mt-2 p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs text-left w-full">
              <span className="font-bold mr-1">💡 Mẹo nhớ:</span>
              {mnemonicVi}
            </div>
          )}
        </div>
      )}

      {/* MODE 2: BẢNG LUYỆN VIẾT NÉT TƯƠNG TÁC (VIRTUAL CANVAS) */}
      {viewMode === 'practice' && (
        <div className="w-full flex flex-col items-center animate-fade-in">
          <VirtualCanvas
            guideChar={char}
            strokesCount={strokes}
            size="sm"
            className="w-full"
          />

          <div className="mt-3 text-[11px] text-slate-500 dark:text-slate-400 text-center">
            💡 Dùng ngón tay / bút cảm ứng đồ theo nét chữ mờ trên ô kẻ chuẩn.
          </div>
        </div>
      )}
    </div>
  );
};
