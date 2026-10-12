import React, { useState } from 'react';
import { KanaItem } from '../../types';
import { HIRAGANA_DATA, KATAKANA_DATA, DAKUON_DATA, YOON_DATA } from '../../data/kanaData';
import { StrokePlayer } from './StrokePlayer';
import { useSpeech } from '../../hooks/useSpeech';
import { Search, X, ChevronLeft, ChevronRight, Volume2 } from 'lucide-react';

export const KanaGrid: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'hiragana' | 'katakana' | 'dakuon' | 'yoon'>('hiragana');
  const [selectedKana, setSelectedKana] = useState<KanaItem>(HIRAGANA_DATA[0]);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
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
    setIsMobileModalOpen(true);
  };

  const handlePrevKana = () => {
    if (currentIndex > 0) {
      const prevItem = filteredKana[currentIndex - 1];
      setSelectedKana(prevItem);
      speak(prevItem.char, 'Zero');
    }
  };

  const handleNextKana = () => {
    if (currentIndex < filteredKana.length - 1) {
      const nextItem = filteredKana[currentIndex + 1];
      setSelectedKana(nextItem);
      speak(nextItem.char, 'Zero');
    }
  };

  return (
    <div className="space-y-6">
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

      {/* Main Grid + Sidebar Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kana Grid Bento */}
        <div className="lg:col-span-2 grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-2.5 sm:gap-3">
          {filteredKana.map(item => {
            const isSelected = selectedKana.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => handleSelectKana(item)}
                className={`relative p-3 sm:p-3.5 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 cursor-pointer group border active:scale-95 ${
                  isSelected
                    ? 'bg-gradient-to-b from-cyan-500/10 to-blue-500/10 border-cyan-500 shadow-md ring-2 ring-cyan-500/30'
                    : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 hover:border-cyan-400/60 hover:shadow-sm'
                }`}
              >
                <div className="font-jp text-3xl font-bold text-slate-800 dark:text-slate-100 group-hover:scale-110 transition-transform">
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

        {/* Selected Kana Detail & Stroke Player (Desktop sidebar ONLY: hidden on mobile) */}
        <div className="hidden lg:block lg:col-span-1 space-y-4">
          <StrokePlayer
            char={selectedKana.char}
            romaji={selectedKana.romaji}
            strokes={selectedKana.strokes}
            strokeSvgPath={selectedKana.strokeSvgPath}
            mnemonicVi={selectedKana.mnemonicVi}
          />

          {/* Example Word Mini Card */}
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Từ vựng ứng dụng
            </span>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-jp text-xl font-bold text-slate-900 dark:text-white">
                  {selectedKana.exampleWord}
                </div>
                <div className="text-xs text-cyan-600 dark:text-cyan-400 font-medium">
                  {selectedKana.exampleReading}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Nghĩa: <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedKana.exampleMeaning}</span>
                </div>
              </div>
              <button
                onClick={() => speak(selectedKana.exampleWord, 'Zero')}
                className="w-10 h-10 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center transition cursor-pointer"
                title="Nghe phát âm từ vựng"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Floating Centered Modal for Selected Kana */}
      {isMobileModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 animate-fade-in lg:hidden"
          onClick={() => setIsMobileModalOpen(false)}
        >
          <div
            className="w-full max-w-sm sm:max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl animate-scale-up max-h-[88vh] overflow-y-auto space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
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

              <div className="flex items-center gap-1.5">
                {/* Previous & Next Navigation */}
                <button
                  onClick={handlePrevKana}
                  disabled={currentIndex <= 0}
                  className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-30 transition cursor-pointer"
                  title="Âm trước"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextKana}
                  disabled={currentIndex >= filteredKana.length - 1}
                  className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-30 transition cursor-pointer"
                  title="Âm sau"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                {/* Close Button */}
                <button
                  onClick={() => setIsMobileModalOpen(false)}
                  className="p-1.5 ml-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 transition cursor-pointer"
                  title="Đóng bảng chi tiết"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Stroke Player component */}
            <StrokePlayer
              char={selectedKana.char}
              romaji={selectedKana.romaji}
              strokes={selectedKana.strokes}
              strokeSvgPath={selectedKana.strokeSvgPath}
              mnemonicVi={selectedKana.mnemonicVi}
            />

            {/* Example Word Mini Card */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl">
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
        </div>
      )}
    </div>
  );
};
