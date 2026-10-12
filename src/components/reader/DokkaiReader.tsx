import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ReadingItem, WordLookup } from '../../types';
import { FuriganaText, FuriganaDisplayMode } from './FuriganaText';
import { ClickLookupModal } from './ClickLookupModal';
import { OrcaMascot } from '../../assets/mascots/OrcaMascot';
import { LevelBadge } from '../common/LevelBadge';
import { AudioButton } from '../common/AudioButton';
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  Focus,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  FileText,
  Search,
} from 'lucide-react';
import { useSoundEffects } from '../../hooks/useSoundEffects';

interface DokkaiReaderProps {
  readings: ReadingItem[];
  initialReadingId?: string;
}

// Split text into Japanese sentences count
const countSentences = (text: string): number => {
  const paragraphs = text.split('\n').filter(p => p.trim().length > 0);
  let count = 0;
  for (const p of paragraphs) {
    let current = '';
    for (let i = 0; i < p.length; i++) {
      const char = p[i];
      current += char;
      if (char === '。' || char === '！' || char === '？') {
        count++;
        current = '';
      }
    }
    if (current.trim().length > 0) {
      count++;
    }
  }
  return count;
};

export const DokkaiReader: React.FC<DokkaiReaderProps> = ({ readings, initialReadingId }) => {
  const [selectedReadingId, setSelectedReadingId] = useState<string>(
    initialReadingId || readings[0]?.id || ''
  );
  const [furiganaMode, setFuriganaMode] = useState<FuriganaDisplayMode>('all');
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [focusedSentenceIndex, setFocusedSentenceIndex] = useState<number | null>(null);
  const [activeLookupWord, setActiveLookupWord] = useState<WordLookup | null>(null);
  const [levelFilter, setLevelFilter] = useState<'ALL' | 'N4' | 'N3'>('ALL');

  // User Quiz answers state: { [qIndex: number]: chosenIndex }
  const [quizAnswers, setQuizAnswers] = useState<{ [qIndex: number]: number }>({});
  const { playCorrect, playWrong } = useSoundEffects();

  // If initialReadingId changes from outside
  useEffect(() => {
    if (initialReadingId && readings.some(r => r.id === initialReadingId)) {
      setSelectedReadingId(initialReadingId);
      setQuizAnswers({});
      setFocusedSentenceIndex(null);
    }
  }, [initialReadingId, readings]);

  const filteredReadings = useMemo(() => {
    if (levelFilter === 'ALL') return readings;
    return readings.filter(r => r.level === levelFilter);
  }, [readings, levelFilter]);

  const currentReading = useMemo(() => {
    return readings.find(r => r.id === selectedReadingId) || filteredReadings[0] || readings[0];
  }, [readings, selectedReadingId, filteredReadings]);

  const totalSentences = useMemo(() => {
    if (!currentReading) return 0;
    return countSentences(currentReading.content);
  }, [currentReading]);

  const glossaryWords = useMemo(() => {
    return currentReading?.glossary.map(g => g.word) || [];
  }, [currentReading]);

  // Navigate sentences in focus mode
  const handlePrevSentence = useCallback(() => {
    setFocusedSentenceIndex(prev => {
      if (prev === null || prev <= 0) return 0;
      return prev - 1;
    });
  }, []);

  const handleNextSentence = useCallback(() => {
    setFocusedSentenceIndex(prev => {
      if (prev === null) return 0;
      if (prev >= totalSentences - 1) return totalSentences - 1;
      return prev + 1;
    });
  }, [totalSentences]);

  const handleExitFocus = useCallback(() => {
    setIsFocusMode(false);
    setFocusedSentenceIndex(null);
  }, []);

  // Keyboard navigation for Sentence Focus Mode
  useEffect(() => {
    if (!isFocusMode) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        handleNextSentence();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrevSentence();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleExitFocus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocusMode, handleNextSentence, handlePrevSentence, handleExitFocus]);

  if (!currentReading) {
    return <div className="text-center p-8 text-slate-400">Chưa có bài đọc nào...</div>;
  }

  const handleWordClick = (word: string) => {
    const found = currentReading.glossary.find(g => g.word === word);
    if (found) {
      setActiveLookupWord(found);
    } else {
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

  const handleSentenceClick = (sIdx: number) => {
    if (!isFocusMode) {
      setIsFocusMode(true);
    }
    setFocusedSentenceIndex(sIdx);
  };

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    if (quizAnswers[qIdx] !== undefined) return;
    setQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx }));

    if (optIdx === currentReading.questions[qIdx].correctIndex) {
      playCorrect();
    } else {
      playWrong();
    }
  };

  const getMondaiBadge = (mondai?: 'short' | 'medium' | 'info_search') => {
    switch (mondai) {
      case 'short':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
            <FileText className="w-3 h-3" />
            Mondai 10: Đoạn ngắn (短文)
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            <BookOpen className="w-3 h-3" />
            Mondai 11: Đoạn trung (中文)
          </span>
        );
      case 'info_search':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Search className="w-3 h-3" />
            Mondai 12: Tìm kiếm thông tin (情報検索)
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Selector & Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
        <div className="flex items-center gap-3">
          <OrcaMascot mood="deepdive" size={54} />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                Trình Luyện Đọc hiểu Tương tác (Dokkai 2.0)
              </h3>
              <LevelBadge level={currentReading.level} size="sm" />
              {getMondaiBadge(currentReading.mondaiType)}
            </div>
            <p className="text-xs text-slate-500">
              Hỗ trợ Focus từng câu để giảm tải nhận thức • Click trực tiếp vào từ để tra nghĩa
            </p>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Furigana 3-State Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setFuriganaMode('all')}
              title="Hiện đầy đủ Furigana trên toàn bộ bài đọc"
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                furiganaMode === 'all'
                  ? 'bg-cyan-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFuriganaMode('unmastered')}
              title="Chỉ hiện Furigana cho từ vựng mới/khó trong glossary"
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                furiganaMode === 'unmastered'
                  ? 'bg-cyan-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              Từ khó
            </button>
            <button
              onClick={() => setFuriganaMode('off')}
              title="Ẩn hoàn toàn Furigana (Mô phỏng áp lực phòng thi thật)"
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                furiganaMode === 'off'
                  ? 'bg-cyan-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Ẩn
            </button>
          </div>

          {/* Sentence Focus Mode Toggle */}
          <button
            onClick={() => {
              if (isFocusMode) {
                handleExitFocus();
              } else {
                setIsFocusMode(true);
                setFocusedSentenceIndex(0);
              }
            }}
            title="Chế độ tập trung đọc từng câu một (Sentence-by-Sentence)"
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border ${
              isFocusMode
                ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-purple-400'
            }`}
          >
            <Focus className="w-3.5 h-3.5" />
            <span>{isFocusMode ? 'Focus: BẬT' : 'Focus: TẮT'}</span>
          </button>

          {/* Level Filter Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-semibold">
            {(['ALL', 'N4', 'N3'] as const).map(lvl => (
              <button
                key={lvl}
                onClick={() => setLevelFilter(lvl)}
                className={`px-2 py-0.5 rounded-lg transition cursor-pointer ${
                  levelFilter === lvl
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Reading Picker dropdown */}
          <select
            value={selectedReadingId}
            onChange={e => {
              setSelectedReadingId(e.target.value);
              setQuizAnswers({});
              setFocusedSentenceIndex(null);
            }}
            className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 max-w-[200px] truncate"
          >
            {filteredReadings.map(r => (
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-100 dark:border-slate-800 gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                Chủ đề: {currentReading.topic}
              </span>
              {currentReading.mondaiType && getMondaiBadge(currentReading.mondaiType)}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-jp">
              {currentReading.title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <AudioButton text={currentReading.content.slice(0, 200)} level={currentReading.level} label="Nghe audio" />
          </div>
        </div>

        {/* Floating / Sticky Sentence Focus Navigation Bar (When Focus Mode is Active) */}
        {isFocusMode && totalSentences > 0 && (
          <div className="mb-4 p-3 bg-purple-500/10 dark:bg-purple-950/40 border border-purple-500/30 rounded-2xl flex flex-wrap items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-700 dark:text-purple-300">
              <Focus className="w-4 h-4" />
              <span>Chế độ đọc từng câu (Dùng phím mũi tên ← → để chuyển):</span>
              <span className="px-2 py-0.5 rounded-lg bg-purple-500/20 text-purple-700 dark:text-purple-200 font-mono">
                Câu {(focusedSentenceIndex ?? 0) + 1} / {totalSentences}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrevSentence}
                disabled={(focusedSentenceIndex ?? 0) <= 0}
                className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-purple-400 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Trước</span>
              </button>

              <button
                onClick={handleNextSentence}
                disabled={(focusedSentenceIndex ?? 0) >= totalSentences - 1}
                className="px-2.5 py-1 rounded-xl bg-purple-600 text-white text-xs font-semibold hover:bg-purple-700 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer flex items-center gap-1 shadow-xs"
              >
                <span>Tiếp</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleExitFocus}
                title="Thoát chế độ tập trung"
                className="p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Text Body with Interactive Furigana & Sentence Highlight */}
        <div className="bg-slate-50/70 dark:bg-slate-950/40 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 mb-8">
          <FuriganaText
            content={currentReading.content}
            furiganaMap={currentReading.furiganaMap}
            furiganaMode={furiganaMode}
            glossaryWords={glossaryWords}
            focusedSentenceIndex={isFocusMode ? focusedSentenceIndex : null}
            onSentenceClick={handleSentenceClick}
            onWordClick={handleWordClick}
          />
        </div>

        {/* Glossary Quick Bar */}
        <div className="mb-8 p-4 bg-cyan-500/5 border border-cyan-500/15 rounded-2xl">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
              <BookOpen className="w-4 h-4 text-cyan-500" />
              <span>Từ vựng trọng tâm trong bài:</span>
            </div>
            {furiganaMode === 'unmastered' && (
              <span className="text-[11px] text-cyan-600 dark:text-cyan-400 font-medium">
                (Đang hiển thị Furigana riêng cho các từ này)
              </span>
            )}
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
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>📝 Câu hỏi Đọc hiểu định dạng JLPT</span>
            </h3>
            <span className="text-xs text-slate-400">
              Đã trả lời: {Object.keys(quizAnswers).length} / {currentReading.questions.length}
            </span>
          </div>

          {currentReading.questions.map((q, qIdx) => {
            const chosen = quizAnswers[qIdx];
            const isAnswered = chosen !== undefined;

            return (
              <div
                key={qIdx}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3"
              >
                <div className="font-jp font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  Câu hỏi {qIdx + 1}: {q.question}
                </div>

                <div className="space-y-2">
                  {q.options.map((opt, optIdx) => {
                    let optStyle =
                      'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-cyan-400';

                    if (isAnswered) {
                      if (optIdx === q.correctIndex) {
                        optStyle =
                          'bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold';
                      } else if (chosen === optIdx) {
                        optStyle =
                          'bg-rose-500/15 border-rose-500 text-rose-600 dark:text-rose-400';
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
                        <span className="font-jp">
                          {optIdx + 1}. {opt}
                        </span>
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
