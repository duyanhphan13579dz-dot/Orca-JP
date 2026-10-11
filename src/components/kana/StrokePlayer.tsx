import React, { useState } from 'react';
import { Play, RotateCcw, Volume2 } from 'lucide-react';
import { useSpeech } from '../../hooks/useSpeech';

interface StrokePlayerProps {
  char: string;
  romaji: string;
  strokes: number;
  strokeSvgPath?: string;
  mnemonicVi?: string;
  className?: string;
}

export const StrokePlayer: React.FC<StrokePlayerProps> = ({
  char,
  romaji,
  strokes,
  strokeSvgPath,
  mnemonicVi,
  className = '',
}) => {
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

  return (
    <div className={`p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col items-center ${className}`}>
      {/* Title & Romaji */}
      <div className="w-full flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
            {strokes} nét
          </span>
          <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">
            /{romaji}/
          </span>
        </div>
        <button
          onClick={() => speak(char, 'Zero')}
          className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-cyan-500 transition cursor-pointer"
          title="Phát âm"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>

      {/* Grid Canvas for Kanji / Kana strokes */}
      <div className="relative w-40 h-40 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border-2 border-dashed border-cyan-500/30 flex items-center justify-center overflow-hidden my-2 group shadow-inner">
        {/* Japanese Genkouyoushi calligraphy guide lines */}
        <line x1="80" y1="0" x2="80" y2="160" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="text-slate-200 dark:text-slate-800" />
        <line x1="0" y1="80" x2="160" y2="80" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="text-slate-200 dark:text-slate-800" />
        <circle cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" className="text-slate-200/60 dark:text-slate-800/60" />

        {strokeSvgPath ? (
          <svg key={key} width="140" height="140" viewBox="0 0 100 100" className="stroke-current text-slate-800 dark:text-cyan-300">
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
            className={`font-jp text-7xl font-bold select-none text-slate-800 dark:text-cyan-300 transition-all duration-700 ${
              isPlaying ? 'scale-105 filter drop-shadow(0 0 8px rgba(6,182,212,0.4))' : ''
            }`}
          >
            {char}
          </div>
        )}

        {/* Floating Play Overlay button if not playing */}
        {!isPlaying && (
          <button
            onClick={handleReplay}
            className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-cyan-500/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-lg cursor-pointer scale-90 group-hover:scale-100"
          >
            <Play className="w-5 h-5 ml-0.5" />
          </button>
        )}
      </div>

      {/* Control buttons */}
      <div className="flex items-center gap-2 mt-2 w-full">
        <button
          onClick={handleReplay}
          className="flex-1 py-1.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Xem lại nét
        </button>
      </div>

      {/* Mnemonic Vi */}
      {mnemonicVi && (
        <div className="mt-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs text-left w-full">
          <span className="font-bold mr-1">💡 Mẹo nhớ:</span>
          {mnemonicVi}
        </div>
      )}
    </div>
  );
};
