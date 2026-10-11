import React, { useState, useEffect, useCallback } from 'react';
import { SRSCard, JLPTLevel } from '../../types';
import { ReviewGrade } from '../../hooks/useSRSIndexedDB';
import { useSpeech } from '../../hooks/useSpeech';
import { useSoundEffects } from '../../hooks/useSoundEffects';
import { LevelBadge } from '../common/LevelBadge';
import { PitchAccentVisualizer } from '../common/PitchAccentVisualizer';
import { OrcaMascot } from '../../assets/mascots/OrcaMascot';
import { Volume2, RotateCw, Sparkles, Brain, Undo2, AlertTriangle, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SRSFlashcardDeckProps {
  cards: SRSCard[];
  onReviewCard: (cardId: string, grade: ReviewGrade) => Promise<unknown>;
  canUndo?: boolean;
  onUndo?: () => Promise<boolean>;
  currentLevelFilter?: JLPTLevel;
}

export const SRSFlashcardDeck: React.FC<SRSFlashcardDeckProps> = ({
  cards,
  onReviewCard,
  canUndo = false,
  onUndo,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionReviewedCount, setSessionReviewedCount] = useState(0);

  const { speak } = useSpeech();
  const { playCorrect, playWrong, playStreakFanfare } = useSoundEffects();

  const currentCard = cards[currentIndex];

  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => {
      const next = !prev;
      if (next && currentCard) {
        speak(currentCard.front.split(' ')[0], currentCard.level);
      }
      return next;
    });
  }, [currentCard, speak]);

  const handleGrade = useCallback(
    async (grade: ReviewGrade) => {
      if (!currentCard) return;

      if (grade === 1) {
        playWrong();
      } else if (grade === 2) {
        playCorrect();
      } else {
        playCorrect();
        if ((sessionReviewedCount + 1) % 5 === 0) {
          playStreakFanfare();
          confetti({ particleCount: 35, spread: 65, origin: { y: 0.6 } });
        }
      }

      await onReviewCard(currentCard.id, grade);
      setSessionReviewedCount((c) => c + 1);
      setIsFlipped(false);
      setCurrentIndex((i) => i + 1);
    },
    [currentCard, onReviewCard, playWrong, playCorrect, playStreakFanfare, sessionReviewedCount]
  );

  const handleUndo = useCallback(async () => {
    if (!canUndo || !onUndo) return;
    const success = await onUndo();
    if (success) {
      setIsFlipped(false);
      setCurrentIndex((i) => Math.max(0, i - 1));
      setSessionReviewedCount((c) => Math.max(0, c - 1));
    }
  }, [canUndo, onUndo]);

  // Keyboard shortcuts handler:
  // Space: Flip / Audio
  // 1: Again (Quên)
  // 2: Hard (Khó)
  // 3: Good (Nhớ tạm)
  // 4: Easy (Dễ)
  // Z: Undo (Hoàn tác)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        handleFlip();
      } else if (e.code === 'KeyZ' || e.key === 'z' || e.key === 'Z') {
        e.preventDefault();
        handleUndo();
      } else if (isFlipped) {
        if (e.key === '1') {
          e.preventDefault();
          handleGrade(1);
        } else if (e.key === '2') {
          e.preventDefault();
          handleGrade(2);
        } else if (e.key === '3') {
          e.preventDefault();
          handleGrade(3);
        } else if (e.key === '4') {
          e.preventDefault();
          handleGrade(4);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFlip, handleGrade, handleUndo, isFlipped]);

  // When card finishes or no cards due
  if (!currentCard || currentIndex >= cards.length) {
    return (
      <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg mx-auto text-center shadow-xl space-y-4">
        <OrcaMascot mood="celebration" size={130} />
        <h3 className="text-xl font-black text-slate-900 dark:text-white">
          🎉 Hoàn thành phiên ôn tập SRS!
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Bạn đã hoàn thành xuất sắc{' '}
          <span className="font-bold text-cyan-600 dark:text-cyan-400">{sessionReviewedCount} thẻ</span> hôm nay
          theo thuật toán SuperMemo-2 Plus.
        </p>

        {canUndo && (
          <button
            onClick={handleUndo}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Undo2 className="w-3.5 h-3.5" />
            Hoàn tác thẻ vừa đánh giá (Phím Z)
          </button>
        )}

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-2 text-xs text-slate-400">
          <Brain className="w-4 h-4 text-cyan-500" />
          <span>Khoảng cách ôn tập tiếp theo đã được tối ưu vào IndexedDB</span>
        </div>
      </div>
    );
  }

  const progressPercent = Math.round(((currentIndex + 1) / cards.length) * 100);

  return (
    <div className="max-w-xl mx-auto space-y-4">
      {/* Top Deck Stats & Progress Bar & Undo */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-cyan-500" />
          <span>
            Thẻ {currentIndex + 1} / {cards.length}
          </span>
          <LevelBadge level={currentCard.level} size="sm" />
        </div>

        <div className="flex items-center gap-3">
          {canUndo && (
            <button
              onClick={handleUndo}
              title="Hoàn tác đánh giá thẻ trước (Phím Z)"
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-cyan-500/10 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
            >
              <Undo2 className="w-3 h-3" />
              <span>Hoàn tác (Z)</span>
            </button>
          )}

          <div className="flex items-center gap-1 font-bold text-cyan-600 dark:text-cyan-400">
            <span>{progressPercent}%</span>
          </div>
        </div>
      </div>

      <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Leech Card Alert Banner */}
      {currentCard.isLeech && (
        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs flex items-center justify-between gap-2 animate-pulse">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <span>
              <strong>Thẻ Khó (Leech):</strong> Bạn đã quên từ này {currentCard.lapses} lần. Hãy liên tưởng hình ảnh hoặc ghi chú lại!
            </span>
          </div>
        </div>
      )}

      {/* Main Flashcard */}
      <div
        onClick={handleFlip}
        className="min-h-80 p-8 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 rounded-3xl shadow-xl flex flex-col items-center justify-between cursor-pointer select-none transition-all duration-200 hover:shadow-2xl relative"
      >
        <div className="w-full flex items-center justify-between text-xs text-slate-400">
          <span className="capitalize font-semibold text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
            {currentCard.type}
          </span>

          <div className="flex items-center gap-2">
            {currentCard.lapses ? (
              <span className="text-[10px] text-slate-400">Đã quên: {currentCard.lapses} lần</span>
            ) : null}

            <button
              onClick={(e) => {
                e.stopPropagation();
                speak(currentCard.front.split(' ')[0], currentCard.level);
              }}
              className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-cyan-500 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Card Content Front / Back */}
        <div className="text-center my-auto py-4 w-full">
          <div className="font-jp text-5xl font-black text-slate-900 dark:text-white mb-2 tracking-wide">
            {currentCard.front}
          </div>

          {!isFlipped ? (
            <div className="text-xs text-slate-400 flex items-center justify-center gap-1.5 mt-6">
              <RotateCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Chạm hoặc bấm [Phím Cách / Space] để xem đáp án</span>
            </div>
          ) : (
            <div className="space-y-3 mt-4 animate-fade-in flex flex-col items-center">
              {currentCard.furigana && (
                <div className="text-sm font-semibold text-cyan-600 dark:text-cyan-400">
                  Cách đọc: {currentCard.furigana}
                </div>
              )}

              {currentCard.hanViet && (
                <div className="text-xs text-rose-500 font-bold uppercase tracking-wider">
                  Âm Hán: {currentCard.hanViet}
                </div>
              )}

              {/* Pitch Accent Contour */}
              <div className="pt-1">
                <PitchAccentVisualizer
                  word={currentCard.front}
                  reading={currentCard.furigana}
                  pitchData={currentCard.pitchAccent}
                  size="sm"
                />
              </div>

              <div className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-2">
                {currentCard.back}
              </div>
            </div>
          )}
        </div>

        <div className="w-full text-center text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <span>Chu kỳ: {currentCard.interval} ngày</span>
          <span>Hệ số dễ (EF): {currentCard.easeFactor}</span>
        </div>
      </div>

      {/* 4-Grade SM-2 Plus Action Buttons */}
      {isFlipped ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 animate-fade-in">
          {/* Grade 1: Again */}
          <button
            onClick={() => handleGrade(1)}
            className="p-3 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-600 dark:text-rose-400 rounded-2xl flex flex-col items-center justify-center transition cursor-pointer shadow-xs"
          >
            <span className="text-xs font-black">1. Quên (1 ngày)</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Phím 1</span>
          </button>

          {/* Grade 2: Hard */}
          <button
            onClick={() => handleGrade(2)}
            className="p-3 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-600 dark:text-orange-400 rounded-2xl flex flex-col items-center justify-center transition cursor-pointer shadow-xs"
          >
            <span className="text-xs font-black">2. Khó (1-2 ngày)</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Phím 2</span>
          </button>

          {/* Grade 3: Good */}
          <button
            onClick={() => handleGrade(3)}
            className="p-3 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-600 dark:text-blue-400 rounded-2xl flex flex-col items-center justify-center transition cursor-pointer shadow-xs"
          >
            <span className="text-xs font-black">3. Nhớ (3-6 ngày)</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Phím 3</span>
          </button>

          {/* Grade 4: Easy */}
          <button
            onClick={() => handleGrade(4)}
            className="p-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-2xl flex flex-col items-center justify-center transition cursor-pointer shadow-xs"
          >
            <span className="text-xs font-black flex items-center gap-1">
              4. Dễ <Sparkles className="w-3 h-3 text-emerald-500" />
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">Phím 4</span>
          </button>
        </div>
      ) : (
        <button
          onClick={handleFlip}
          className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md shadow-cyan-500/20 transition cursor-pointer flex items-center justify-center gap-2"
        >
          <RotateCw className="w-4 h-4" />
          Lật mặt sau thẻ (Space)
        </button>
      )}

      {/* Keyboard Shortcuts Guide */}
      <div className="text-center text-[10px] text-slate-400 dark:text-slate-500 flex flex-wrap items-center justify-center gap-1.5">
        <span>💡 Phím tắt:</span>
        <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded font-mono">Space</kbd>
        <span>Lật thẻ •</span>
        <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded font-mono">1</kbd>
        <span>Quên •</span>
        <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded font-mono">2</kbd>
        <span>Khó •</span>
        <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded font-mono">3</kbd>
        <span>Nhớ •</span>
        <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded font-mono">4</kbd>
        <span>Dễ •</span>
        <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded font-mono">Z</kbd>
        <span>Hoàn tác</span>
      </div>
    </div>
  );
};
