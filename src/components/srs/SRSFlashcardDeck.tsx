import React, { useState, useEffect, useCallback } from 'react';
import { SRSCard, JLPTLevel } from '../../types';
import { useSpeech } from '../../hooks/useSpeech';
import { useSoundEffects } from '../../hooks/useSoundEffects';
import { LevelBadge } from '../common/LevelBadge';
import { OrcaMascot } from '../../assets/mascots/OrcaMascot';
import { Volume2, RotateCw, Sparkles, Brain } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SRSFlashcardDeckProps {
  cards: SRSCard[];
  onReviewCard: (cardId: string, grade: 1 | 2 | 3) => Promise<void>;
  currentLevelFilter?: JLPTLevel;
}

export const SRSFlashcardDeck: React.FC<SRSFlashcardDeckProps> = ({
  cards,
  onReviewCard,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionReviewedCount, setSessionReviewedCount] = useState(0);

  const { speak } = useSpeech();
  const { playCorrect, playWrong, playStreakFanfare } = useSoundEffects();

  const currentCard = cards[currentIndex];

  const handleFlip = useCallback(() => {
    setIsFlipped(prev => {
      const next = !prev;
      if (next && currentCard) {
        speak(currentCard.front.split(' ')[0], currentCard.level);
      }
      return next;
    });
  }, [currentCard, speak]);

  const handleGrade = useCallback(async (grade: 1 | 2 | 3) => {
    if (!currentCard) return;

    if (grade === 1) {
      playWrong();
    } else if (grade === 2) {
      playCorrect();
    } else {
      playCorrect();
      if ((sessionReviewedCount + 1) % 5 === 0) {
        playStreakFanfare();
        confetti({ particleCount: 30, spread: 60, origin: { y: 0.6 } });
      }
    }

    await onReviewCard(currentCard.id, grade);
    setSessionReviewedCount(c => c + 1);
    setIsFlipped(false);
    setCurrentIndex(i => i + 1);
  }, [currentCard, onReviewCard, playWrong, playCorrect, playStreakFanfare, sessionReviewedCount]);

  // Keyboard shortcuts handler: 1 (Quên), 2 (Nhớ tạm), 3 (Thuần thục), Space (Lật / Nghe âm)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid firing if active element is an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        handleFlip();
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
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFlip, handleGrade, isFlipped]);

  // When card finishes or no cards due
  if (!currentCard || currentIndex >= cards.length) {
    return (
      <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg mx-auto text-center shadow-xl space-y-4">
        <OrcaMascot mood="celebration" size={130} />
        <h3 className="text-xl font-black text-slate-900 dark:text-white">
          🎉 Hoàn thành phiên ôn tập SRS!
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Bạn đã ôn tập xuất sắc <span className="font-bold text-cyan-600 dark:text-cyan-400">{sessionReviewedCount} thẻ</span> hôm nay theo thuật toán SuperMemo-2.
        </p>
        <button
          onClick={() => {
            setCurrentIndex(0);
            setSessionReviewedCount(0);
            setIsFlipped(false);
          }}
          className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs rounded-xl shadow-md shadow-cyan-500/20 cursor-pointer"
        >
          Ôn lại phiên này
        </button>
      </div>
    );
  }

  const progressPercent = Math.min(100, Math.round(((currentIndex + 1) / cards.length) * 100));

  return (
    <div className="max-w-xl mx-auto space-y-4">
      {/* Top Session Progress Bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-cyan-500" />
          <span>Thẻ {currentIndex + 1} / {cards.length}</span>
          <LevelBadge level={currentCard.level} size="sm" />
        </div>
        <div className="flex items-center gap-1.5 font-bold text-cyan-600 dark:text-cyan-400">
          <span>{progressPercent}%</span>
        </div>
      </div>

      <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Flashcard with 3D Flip style */}
      <div
        onClick={handleFlip}
        className="min-h-72 p-8 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 rounded-3xl shadow-xl flex flex-col items-center justify-between cursor-pointer select-none transition-all duration-200 hover:shadow-2xl relative"
      >
        <div className="w-full flex items-center justify-between text-xs text-slate-400">
          <span className="capitalize font-semibold text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
            {currentCard.type}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              speak(currentCard.front.split(' ')[0], currentCard.level);
            }}
            className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-cyan-500"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        {/* Card Content Front / Back */}
        <div className="text-center my-auto py-4">
          <div className="font-jp text-5xl font-black text-slate-900 dark:text-white mb-2">
            {currentCard.front}
          </div>

          {!isFlipped ? (
            <div className="text-xs text-slate-400 flex items-center justify-center gap-1 mt-4">
              <RotateCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Chạm hoặc bấm [Phím Cách / Space] để xem đáp án</span>
            </div>
          ) : (
            <div className="space-y-2 mt-4 animate-fade-in">
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
              <div className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-2">
                {currentCard.back}
              </div>
            </div>
          )}
        </div>

        <div className="w-full text-center text-[11px] text-slate-400">
          {isFlipped ? 'Đánh giá mức độ nhớ của bạn bên dưới:' : 'SM-2 Interval: ' + currentCard.interval + ' ngày'}
        </div>
      </div>

      {/* SM-2 Review Action Buttons */}
      {isFlipped ? (
        <div className="grid grid-cols-3 gap-3 animate-fade-in">
          {/* Grade 1 */}
          <button
            onClick={() => handleGrade(1)}
            className="p-3 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-600 dark:text-rose-400 rounded-2xl flex flex-col items-center justify-center transition cursor-pointer shadow-sm"
          >
            <span className="text-xs font-black">1. Quên (1 ngày)</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Phím 1</span>
          </button>

          {/* Grade 2 */}
          <button
            onClick={() => handleGrade(2)}
            className="p-3 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-600 dark:text-amber-400 rounded-2xl flex flex-col items-center justify-center transition cursor-pointer shadow-sm"
          >
            <span className="text-xs font-black">2. Nhớ tạm (3-6 ngày)</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Phím 2</span>
          </button>

          {/* Grade 3 */}
          <button
            onClick={() => handleGrade(3)}
            className="p-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-2xl flex flex-col items-center justify-center transition cursor-pointer shadow-sm"
          >
            <span className="text-xs font-black flex items-center gap-1">
              3. Thuần thục <Sparkles className="w-3 h-3 text-emerald-500" />
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">Phím 3</span>
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

      {/* Keyboard guide note */}
      <div className="text-center text-[10px] text-slate-400 dark:text-slate-500">
        💡 Hỗ trợ phím tắt: <kbd className="px-1 py-0.5 bg-slate-200 dark:bg-slate-800 rounded">Space</kbd> Lật thẻ • <kbd className="px-1 py-0.5 bg-slate-200 dark:bg-slate-800 rounded">1</kbd> Quên • <kbd className="px-1 py-0.5 bg-slate-200 dark:bg-slate-800 rounded">2</kbd> Nhớ tạm • <kbd className="px-1 py-0.5 bg-slate-200 dark:bg-slate-800 rounded">3</kbd> Thuần thục
      </div>
    </div>
  );
};
