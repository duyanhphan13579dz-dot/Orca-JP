import React, { useState } from 'react';
import { ReadingItem, WordLookup } from '../../types';
import { FuriganaText } from './FuriganaText';
import { ClickLookupModal } from './ClickLookupModal';
import { OrcaMascot } from '../../assets/mascots/OrcaMascot';
import { LevelBadge } from '../common/LevelBadge';
import { AudioButton } from '../common/AudioButton';
import { Eye, EyeOff, BookOpen, CheckCircle2, XCircle } from 'lucide-react';
import { useSoundEffects } from '../../hooks/useSoundEffects';

interface DokkaiReaderProps {
  readings: ReadingItem[];
}

export const DokkaiReader: React.FC<DokkaiReaderProps> = ({ readings }) => {
  const [selectedReadingId, setSelectedReadingId] = useState<string>(readings[0]?.id || '');
  const [showFurigana, setShowFurigana] = useState(true);
  const [activeLookupWord, setActiveLookupWord] = useState<WordLookup | null>(null);

  // User Quiz answers state: { [qIndex: number]: chosenIndex }
  const [quizAnswers, setQuizAnswers] = useState<{ [qIndex: number]: number }>({});
  const { playCorrect, playWrong } = useSoundEffects();

  const currentReading = readings.find(r => r.id === selectedReadingId) || readings[0];

  if (!currentReading) {
    return <div className="text-center p-8 text-slate-400">Chưa có bài đọc nào...</div>;
  }

  const handleWordClick = (word: string) => {
    // Check in glossary
    const found = currentReading.glossary.find(g => g.word === word);
    if (found) {
      setActiveLookupWord(found);
    } else {
      // Fallback lookup
      const furigana = currentReading.furiganaMap[word] || '';
      setActiveLookupWord({
        word,
        furigana,
        hanViet: 'TỪ VỰNG',
        meaning: `Từ vựng trong bài đọc: ${word} (${furigana})`,
        type: 'Từ trong bài',
      });
    }
  };

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    if (quizAnswers[qIdx] !== undefined) return; // already answered
    setQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx }));

    if (optIdx === currentReading.questions[qIdx].correctIndex) {
      playCorrect();
    } else {
      playWrong();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Selector & Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
        <div className="flex items-center gap-3">
          <OrcaMascot mood="deepdive" size={54} />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                Trình Luyện Đọc hiểu Tương tác (Dokkai)
              </h3>
              <LevelBadge level={currentReading.level} size="sm" />
            </div>
            <p className="text-xs text-slate-500">
              Nhấp trực tiếp vào bất kỳ từ vựng nào trong bài để tra nghĩa tức thì
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Furigana Toggle */}
          <button
            onClick={() => setShowFurigana(prev => !prev)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border ${
              showFurigana
                ? 'bg-cyan-500 text-white border-cyan-500 shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
          >
            {showFurigana ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            {showFurigana ? 'Furigana: BẬT' : 'Furigana: TẮT'}
          </button>

          {/* Reading Picker dropdown */}
          <select
            value={selectedReadingId}
            onChange={e => {
              setSelectedReadingId(e.target.value);
              setQuizAnswers({});
            }}
            className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            {readings.map(r => (
              <option key={r.id} value={r.id}>
                [{r.level}] {r.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Reading Passage Container */}
      <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl relative">
        {/* Header of Passage */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-100 dark:border-slate-800 gap-2">
          <div>
            <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider block mb-1">
              Chủ đề: {currentReading.topic}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-jp">
              {currentReading.title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <AudioButton text={currentReading.content.slice(0, 200)} level={currentReading.level} label="Đọc đoạn đầu" />
          </div>
        </div>

        {/* Text Body with Interactive Furigana & Spans */}
        <div className="bg-slate-50/70 dark:bg-slate-950/40 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 mb-8">
          <FuriganaText
            content={currentReading.content}
            furiganaMap={currentReading.furiganaMap}
            showFurigana={showFurigana}
            onWordClick={handleWordClick}
          />
        </div>

        {/* Glossary Quick Bar */}
        <div className="mb-8 p-4 bg-cyan-500/5 border border-cyan-500/15 rounded-2xl">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-800 dark:text-slate-200">
            <BookOpen className="w-4 h-4 text-cyan-500" />
            <span>Từ vựng trọng tâm trong bài:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {currentReading.glossary.map((w, idx) => (
              <button
                key={idx}
                onClick={() => setActiveLookupWord(w)}
                className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium hover:border-cyan-400 transition cursor-pointer flex items-center gap-1.5"
              >
                <span className="font-jp font-bold text-slate-900 dark:text-white">{w.word}</span>
                <span className="text-[10px] text-cyan-600 dark:text-cyan-400">({w.furigana})</span>
              </button>
            ))}
          </div>
        </div>

        {/* JLPT Comprehension Questions */}
        <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>📝 Câu hỏi Đọc hiểu định dạng JLPT</span>
          </h3>

          {currentReading.questions.map((q, qIdx) => {
            const chosen = quizAnswers[qIdx];
            const isAnswered = chosen !== undefined;

            return (
              <div key={qIdx} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="font-jp font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  Câu hỏi {qIdx + 1}: {q.question}
                </div>

                <div className="space-y-2">
                  {q.options.map((opt, optIdx) => {
                    let optStyle = 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-cyan-400';

                    if (isAnswered) {
                      if (optIdx === q.correctIndex) {
                        optStyle = 'bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold';
                      } else if (chosen === optIdx) {
                        optStyle = 'bg-rose-500/15 border-rose-500 text-rose-600 dark:text-rose-400';
                      } else {
                        optStyle = 'opacity-40 border-slate-200 dark:border-slate-800';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(qIdx, optIdx)}
                        disabled={isAnswered}
                        className={`w-full p-3 rounded-xl border text-xs sm:text-sm text-left flex items-center justify-between transition cursor-pointer ${optStyle}`}
                      >
                        <span className="font-jp">{optIdx + 1}. {opt}</span>
                        {isAnswered && optIdx === q.correctIndex && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        )}
                        {isAnswered && chosen === optIdx && optIdx !== q.correctIndex && (
                          <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {isAnswered && (
                  <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-slate-700 dark:text-slate-300 animate-fade-in">
                    <span className="font-bold text-cyan-600 dark:text-cyan-400 block mb-0.5">
                      💡 Giải thích chi tiết:
                    </span>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Popover lookup modal */}
      <ClickLookupModal
        wordData={activeLookupWord}
        onClose={() => setActiveLookupWord(null)}
      />
    </div>
  );
};
