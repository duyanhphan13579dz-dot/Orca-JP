import React, { useState, useMemo } from 'react';
import { Play, RotateCcw, Volume2, Sparkles, PenTool, ArrowRight, Lightbulb, Compass } from 'lucide-react';
import { useSpeech } from '../../hooks/useSpeech';
import { VirtualCanvas } from '../kanji/VirtualCanvas';
import { getStrokeGuide } from '../../data/kanaStrokeGuides';

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
  const [activeStepTab, setActiveStepTab] = useState<number>(0); // 0 = all steps
  const [showBadges, setShowBadges] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [key, setKey] = useState(0);
  const { speak } = useSpeech();

  const guideData = useMemo(() => getStrokeGuide(char, strokes), [char, strokes]);

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
        <div className="flex items-center gap-1">
          {viewMode === 'guide' && (
            <button
              onClick={() => setShowBadges(prev => !prev)}
              title={showBadges ? 'Ẩn điểm đặt bút ①②③' : 'Hiện điểm đặt bút ①②③'}
              className={`p-1.5 rounded-xl border text-xs transition cursor-pointer flex items-center gap-1 ${
                showBadges
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-transparent'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span className="text-[10px] font-semibold hidden sm:inline">Điểm bút</span>
            </button>
          )}
          <button
            onClick={() => speak(char, 'Zero')}
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-cyan-500 transition cursor-pointer"
            title="Nghe phát âm chuẩn"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* MODE 1: HƯỚNG DẪN ĐI NÉT & ANIMATION */}
      {viewMode === 'guide' && (
        <div className="w-full flex flex-col items-center animate-fade-in space-y-3">
          {/* Grid Canvas for Kanji / Kana strokes */}
          <div className="relative w-44 h-44 bg-slate-50 dark:bg-slate-950/70 rounded-3xl border-2 border-dashed border-cyan-500/30 flex items-center justify-center overflow-hidden my-1 group shadow-inner select-none">
            {/* Japanese Genkouyoushi calligraphy guide lines */}
            <line x1="88" y1="0" x2="88" y2="176" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="text-slate-200 dark:text-slate-800" />
            <line x1="0" y1="88" x2="176" y2="88" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="text-slate-200 dark:text-slate-800" />
            <circle cx="88" cy="88" r="78" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" className="text-slate-200/60 dark:text-slate-800/60" />

            {/* Glyph display or SVG Stroke Path */}
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

            {/* Visual Numbered Stroke Badges with Directional Arrows */}
            {showBadges && (
              <div className="absolute inset-0 pointer-events-none z-10">
                {guideData.steps.map((st) => {
                  const isCurrent = activeStepTab === st.num;
                  const isFiltered = activeStepTab !== 0 && !isCurrent;
                  return (
                    <div
                      key={st.num}
                      style={{
                        left: `${st.start.x}%`,
                        top: `${st.start.y}%`,
                      }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-black shadow-md border transition-all duration-300 ${
                        isCurrent
                          ? 'bg-amber-400 text-slate-900 border-white ring-2 ring-amber-400/80 scale-110 z-20 animate-bounce'
                          : isFiltered
                          ? 'bg-slate-700/50 text-white/40 border-slate-700/50 scale-75 opacity-40'
                          : 'bg-slate-900/90 dark:bg-slate-800/90 text-cyan-400 border-cyan-500/40 opacity-90 scale-95 z-10'
                      }`}
                    >
                      <span>{st.num}</span>
                      <span className="font-mono text-[10px] leading-none text-amber-500 dark:text-amber-300">
                        {st.arrow}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Floating Play Overlay button if not playing */}
            {!isPlaying && (
              <button
                onClick={handleReplay}
                className="absolute inset-0 m-auto w-11 h-11 rounded-full bg-cyan-500 text-white flex items-center justify-center opacity-85 hover:opacity-100 transition shadow-lg cursor-pointer scale-95 hover:scale-105 z-20"
                title="Phát hoạt họa nét viết"
              >
                <Play className="w-5 h-5 ml-0.5" />
              </button>
            )}
          </div>

          {/* Action Buttons: Xem lại & Chuyển sang tập viết */}
          <div className="flex items-center gap-2 w-full">
            <button
              onClick={handleReplay}
              className="flex-1 py-1.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Xem lại animation</span>
            </button>
            <button
              onClick={() => setViewMode('practice')}
              className="flex-1 py-1.5 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm shadow-cyan-500/20 transition cursor-pointer"
            >
              <span>Luyện viết ngay</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Step-by-Step Navigation Pills */}
          <div className="w-full">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
              <span>Đường đi của nét bút ({guideData.steps.length} nét):</span>
              <span className="text-[10px] font-normal text-cyan-600 dark:text-cyan-400">Chọn nét để xem hướng</span>
            </div>

            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1">
              <button
                onClick={() => setActiveStepTab(0)}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex-shrink-0 ${
                  activeStepTab === 0
                    ? 'bg-cyan-500 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Tất cả nét
              </button>
              {guideData.steps.map((st) => (
                <button
                  key={st.num}
                  onClick={() => setActiveStepTab(st.num)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1 cursor-pointer flex-shrink-0 ${
                    activeStepTab === st.num
                      ? 'bg-amber-400 text-slate-900 shadow-xs ring-2 ring-amber-400/40'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <span>Nét {st.num}</span>
                  <span className="font-mono text-cyan-600 dark:text-cyan-400">{st.arrow}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Detailed Stroke Instruction Breakdown List */}
          <div className="w-full space-y-1.5 max-h-48 overflow-y-auto no-scrollbar pr-0.5">
            {guideData.steps
              .filter((st) => activeStepTab === 0 || activeStepTab === st.num)
              .map((st) => (
                <div
                  key={st.num}
                  onClick={() => setActiveStepTab(st.num)}
                  className={`p-2.5 rounded-2xl border transition-all text-xs text-left cursor-pointer ${
                    activeStepTab === st.num
                      ? 'bg-amber-500/10 dark:bg-amber-950/20 border-amber-500/40 ring-1 ring-amber-500/30'
                      : 'bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 hover:border-cyan-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-cyan-500 text-white text-[11px] font-black flex items-center justify-center flex-shrink-0">
                        {st.num}
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        Hướng đi: {st.direction}
                      </span>
                    </div>
                    <span className="font-mono text-base font-bold text-amber-500 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg">
                      {st.arrow}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed pl-6">
                    {st.tip}
                  </p>
                </div>
              ))}
          </div>

          {/* General Calligraphy Rule Tip */}
          <div className="p-2.5 rounded-2xl bg-cyan-500/5 dark:bg-cyan-950/20 border border-cyan-500/20 text-slate-700 dark:text-slate-300 text-xs text-left w-full flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-cyan-500 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-cyan-600 dark:text-cyan-400">Quy tắc bút thuận: </span>
              <span className="text-[11px]">{guideData.generalRule}</span>
            </div>
          </div>

          {/* Mnemonic Vi */}
          {mnemonicVi && (
            <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs text-left w-full">
              <span className="font-bold mr-1">💡 Mẹo nhớ:</span>
              <span className="text-[11px]">{mnemonicVi}</span>
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
            💡 Dùng ngón tay / bút cảm ứng đồ theo các điểm đánh số ① ② ③ và mũi tên chỉ hướng.
          </div>
        </div>
      )}
    </div>
  );
};
