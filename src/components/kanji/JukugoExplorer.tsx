import React, { useState } from 'react';
import { KanjiItem, JukugoWord } from '../../types';
import { useSoundEffects } from '../../hooks/useSoundEffects';
import { AudioButton } from '../common/AudioButton';
import { HelpCircle, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';

interface JukugoExplorerProps {
  kanjiList: KanjiItem[];
}

export const JukugoExplorer: React.FC<JukugoExplorerProps> = ({ kanjiList }) => {
  const allJukugo: { jukugo: JukugoWord; parentKanji: KanjiItem }[] = [];
  kanjiList.forEach(k => {
    k.jukugo.forEach(j => {
      allJukugo.push({ jukugo: j, parentKanji: k });
    });
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const { playCorrect, playWrong } = useSoundEffects();

  if (allJukugo.length === 0) {
    return <div className="text-center p-6 text-slate-400">Đang cập nhật từ ghép...</div>;
  }

  const currentItem = allJukugo[currentIndex % allJukugo.length];
  const correctMeaning = currentItem.jukugo.meaningVi;

  // Generate 4 options: 1 correct, 3 wrong
  const wrongPool = allJukugo
    .filter(item => item.jukugo.meaningVi !== correctMeaning)
    .map(item => item.jukugo.meaningVi);
  
  // Deterministic shuffled choices based on index
  const options = React.useMemo(() => {
    const randomWrongs = wrongPool.slice(0, 3);
    const combined = [correctMeaning, ...randomWrongs];
    return combined.sort(() => (currentIndex % 2 === 0 ? 0.5 - Math.random() : -0.5 + Math.random()));
  }, [currentIndex, correctMeaning]);

  const handleSelectOption = (opt: string) => {
    if (isAnswered) return;
    setSelectedOption(opt);
    setIsAnswered(true);

    if (opt === correctMeaning) {
      playCorrect();
      setScore(s => s + 1);
    } else {
      playWrong();
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setCurrentIndex(prev => prev + 1);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  return (
    <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl mx-auto shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-cyan-500" />
          <h3 className="font-bold text-sm text-slate-800 dark:text-white">
            Thử thách Đoán nghĩa Từ ghép Jukugo
          </h3>
        </div>
        <div className="text-xs font-bold text-cyan-600 dark:text-cyan-400">
          Đúng: {score} / {currentIndex + 1}
        </div>
      </div>

      {/* Target Word */}
      <div className="py-6 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="font-jp text-4xl font-black text-slate-900 dark:text-white">
            {currentItem.jukugo.kanji}
          </span>
          <AudioButton text={currentItem.jukugo.kanji} level={currentItem.parentKanji.level} size="sm" />
        </div>
        <div className="text-xs text-cyan-600 dark:text-cyan-400 font-semibold">
          Cách đọc: {currentItem.jukugo.hiragana} ({currentItem.jukugo.romaji})
        </div>
        <div className="mt-1 text-xs text-rose-500 font-bold uppercase tracking-wider">
          Âm Hán-Việt: {currentItem.jukugo.hanViet}
        </div>
      </div>

      {/* Options */}
      <div className="space-y-2.5 mb-6">
        {options.map((opt, i) => {
          let btnStyle = 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-cyan-400';

          if (isAnswered) {
            if (opt === correctMeaning) {
              btnStyle = 'bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold';
            } else if (selectedOption === opt) {
              btnStyle = 'bg-rose-500/15 border-rose-500 text-rose-600 dark:text-rose-400';
            } else {
              btnStyle = 'opacity-40 border-slate-200 dark:border-slate-800';
            }
          }

          return (
            <button
              key={i}
              onClick={() => handleSelectOption(opt)}
              disabled={isAnswered}
              className={`w-full p-3.5 rounded-2xl text-xs sm:text-sm text-left border font-medium flex items-center justify-between transition cursor-pointer ${btnStyle}`}
            >
              <span>{opt}</span>
              {isAnswered && opt === correctMeaning && (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              )}
              {isAnswered && selectedOption === opt && opt !== correctMeaning && (
                <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Footer controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleReset}
          className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Làm lại từ đầu
        </button>

        {isAnswered && (
          <button
            onClick={handleNext}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-bold shadow-md shadow-cyan-500/20 transition cursor-pointer"
          >
            Từ tiếp theo →
          </button>
        )}
      </div>
    </div>
  );
};
