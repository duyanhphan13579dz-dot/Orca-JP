import React, { useState, useEffect, useCallback } from 'react';
import { KanaItem } from '../../types';
import { HIRAGANA_DATA, KATAKANA_DATA, DAKUON_DATA, YOON_DATA } from '../../data/kanaData';
import { StrokePlayer } from './StrokePlayer';
import { useSpeech } from '../../hooks/useSpeech';
import { Search, X, ChevronLeft, ChevronRight, Volume2, Minimize2, Maximize2 } from 'lucide-react';

export const KanaGrid: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'hiragana' | 'katakana' | 'dakuon' | 'yoon'>('hiragana');
  const [selectedKana, setSelectedKana] = useState<KanaItem>(HIRAGANA_DATA[0]);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { speak } = useSpeech();

  const getSourceData = () => {
    switch (activeTab) {
      case 'katakana':
        return KATAKANA_DATA;
      case 'dakuon':
        return DAKUON_DATA;
      case 'yoon':
        return YOON_DATA;
      case 'hiragana':
      default:
        return HIRAGANA_DATA;
    }
  };

  const filteredKana = getSourceData().filter(k =>
    k.char.includes(searchQuery) ||
    k.romaji.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (k.exampleMeaning && k.exampleMeaning.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const currentIndex = filteredKana.findIndex(k => k.id === selectedKana.id);

  const handleSelectKana = (item: KanaItem) => {
    setSelectedKana(item);
    speak(item.char, 'Zero');
    setIsDetailOpen(true);
    setIsMinimized(false);
  };

  const handlePrevKana = useCallback(() => {
    if (currentIndex > 0) {
      const prevItem = filteredKana[currentIndex - 1];
      setSelectedKana(prevItem);
      speak(prevItem.char, 'Zero');
    }
  }, [currentIndex, filteredKana, speak]);

  const handleNextKana = useCallback(() => {
    if (currentIndex < filteredKana.length - 1) {
      const nextItem = filteredKana[currentIndex + 1];
      setSelectedKana(nextItem);
      speak(nextItem.char, 'Zero');
    }
  }, [currentIndex, filteredKana, speak]);

  // Keyboard navigation on PC (Left/Right arrows to browse, Esc to close)
  useEffect(() => {
    if (!isDetailOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsDetailOpen(false);
      } else if (e.key === 'ArrowLeft') {
        handlePrevKana();
      } else if (e.key === 'ArrowRight') {
        handleNextKana();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDetailOpen, handlePrevKana, handleNextKana]);

  return (
    <div className="space-y-6 relative">
      {/* Category Pills & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar touch-pan-x flex-nowrap">
          {[
            { id: 'hiragana', label: 'Hiragana (Chữ mềm)', shortLabel: 'Hiragana' },
            { id: 'katakana', label: 'Katakana (Chữ cứng)', shortLabel: 'Katakana' },
            { id: 'dakuon', label: 'Âm đục & Bán đục', shortLabel: 'Âm đục' },
            { id: 'yoon', label: 'Âm ghép (Ảo âm)', shortLabel: 'Âm ghép' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as typeof activeTab);
                const list = tab.id === 'katakana' ? KATAKANA_DATA : tab.id === 'dakuon' ? DAKUON_DATA : tab.id === 'yoon' ? YOON_DATA : HIRAGANA_DATA;
                setSelectedKana(list[0]);
              }}
              className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <span className="sm:hidden">{tab.shortLabel}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo romaji (ka, sa...)"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-800 dark:text-slate-200"
          />
        </div>
      </div>

      {/* Main Full-Width Bento Grid for PC & Mobile */}
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2.5 sm:gap-3">
        {filteredKana.map(item => {
          const isSelected = selectedKana.id === item.id;
          return (
            <div
              key={item.id}
              onClick={() => handleSelectKana(item)}
              className={`relative p-3 sm:p-4 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 cursor-pointer group border active:scale-95 ${
                isSelected && isDetailOpen
                  ? 'bg-gradient-to-b from-cyan-500/20 to-blue-500/20 border-cyan-500 shadow-md ring-2 ring-cyan-500 scale-102 z-10'
                  : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 hover:border-cyan-400/60 hover:shadow-sm hover:scale-102'
              }`}
            >
              <div className="font-jp text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100 group-hover:scale-110 transition-transform">
                {item.char}
              </div>
              <div className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 mt-1 uppercase">
                {item.romaji}
              </div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 line-clamp-1 text-center">
                {item.exampleWord}
              </div>
            </div>
          );
        })}
      </div>

      {/* Non-blocking, Highly Flexible Floating Inspector Widget */}
      {isDetailOpen && (
        <aside
          aria-label="Khối nổi chi tiết âm tiết"
          className={`fixed z-40 transition-all duration-300 ${
            isMinimized
              ? 'bottom-4 left-3 sm:left-auto sm:right-6 md:right-8 animate-scale-up'
              : 'bottom-3 left-3 right-3 sm:left-auto sm:right-6 md:right-8 sm:bottom-6 sm:w-[430px] md:w-[450px] animate-slide-up'
          }`}
        >
          {isMinimized ? (
            /* Minimized Sleek Pill Widget */
            <div className="flex items-center gap-2 p-2 px-3.5 bg-white/95 dark:bg-[#111827]/95 border border-cyan-500/50 rounded-2xl shadow-2xl shadow-black/20 dark:shadow-cyan-950/50 backdrop-blur-xl">
              <span className="font-jp text-2xl font-black text-cyan-600 dark:text-cyan-400">
                {selectedKana.char}
              </span>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-none">
                  /{selectedKana.romaji}/
                </span>
                <span className="text-[9px] text-slate-400">
                  {selectedKana.strokes} nét
                </span>
              </div>

              <div className="h-4 w-[1px] bg-slate-200 dark:border-slate-700 mx-1" />

              <button
                onClick={() => speak(selectedKana.char, 'Zero')}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition cursor-pointer"
                title="Phát âm"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsMinimized(false)}
                className="p-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 transition cursor-pointer"
                title="Mở rộng chi tiết"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsDetailOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                title="Đóng khối nổi"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            /* Full Floating Inspector Card (Floats over the background without locking it!) */
            <div className="w-full bg-white/95 dark:bg-[#111827]/95 border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-3.5 sm:p-4 shadow-2xl shadow-black/20 dark:shadow-cyan-950/50 backdrop-blur-xl max-h-[78vh] sm:max-h-[82vh] overflow-y-auto space-y-3 ring-1 ring-cyan-500/40">
              {/* Header with quick actions */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="font-jp text-3xl font-black text-cyan-600 dark:text-cyan-400">
                    {selectedKana.char}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                      /{selectedKana.romaji}/
                    </span>
                    <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-semibold">
                      {selectedKana.strokes} nét viết
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {/* Previous & Next Navigation */}
                  <button
                    onClick={handlePrevKana}
                    disabled={currentIndex <= 0}
                    className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-30 hover:bg-cyan-50 dark:hover:bg-slate-700 transition cursor-pointer"
                    title="Âm trước (←)"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNextKana}
                    disabled={currentIndex >= filteredKana.length - 1}
                    className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-30 hover:bg-cyan-50 dark:hover:bg-slate-700 transition cursor-pointer"
                    title="Âm sau (→)"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  {/* Minimize button */}
                  <button
                    onClick={() => setIsMinimized(true)}
                    className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 transition cursor-pointer"
                    title="Thu nhỏ thành thanh nổi"
                  >
                    <Minimize2 className="w-4 h-4" />
                  </button>

                  {/* Close button */}
                  <button
                    onClick={() => setIsDetailOpen(false)}
                    className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 transition cursor-pointer"
                    title="Đóng khối nổi (Esc)"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Stroke Player component with Guide and Virtual Canvas Drawing */}
              <StrokePlayer
                char={selectedKana.char}
                romaji={selectedKana.romaji}
                strokes={selectedKana.strokes}
                strokeSvgPath={selectedKana.strokeSvgPath}
                mnemonicVi={selectedKana.mnemonicVi}
              />

              {/* Example Word Mini Card */}
              <div className="p-3 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Từ vựng ứng dụng
                </span>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-jp text-lg font-bold text-slate-900 dark:text-white">
                      {selectedKana.exampleWord}
                    </div>
                    <div className="text-xs text-cyan-600 dark:text-cyan-400 font-semibold">
                      {selectedKana.exampleReading}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                      Nghĩa: <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedKana.exampleMeaning}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => speak(selectedKana.exampleWord, 'Zero')}
                    className="w-9 h-9 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center transition cursor-pointer"
                    title="Nghe phát âm từ vựng"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </aside>
      )}
    </div>
  );
};
