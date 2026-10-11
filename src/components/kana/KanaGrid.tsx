import React, { useState } from 'react';
import { KanaItem } from '../../types';
import { HIRAGANA_DATA, KATAKANA_DATA, DAKUON_DATA, YOON_DATA } from '../../data/kanaData';
import { StrokePlayer } from './StrokePlayer';
import { useSpeech } from '../../hooks/useSpeech';
import { Search } from 'lucide-react';

export const KanaGrid: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'hiragana' | 'katakana' | 'dakuon' | 'yoon'>('hiragana');
  const [selectedKana, setSelectedKana] = useState<KanaItem>(HIRAGANA_DATA[0]);
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

  return (
    <div className="space-y-6">
      {/* Category Pills & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 w-full sm:w-auto">
          {[
            { id: 'hiragana', label: 'Hiragana (Chữ mềm)' },
            { id: 'katakana', label: 'Katakana (Chữ cứng)' },
            { id: 'dakuon', label: 'Âm đục & Bán đục' },
            { id: 'yoon', label: 'Âm ghép (Ảo âm)' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as typeof activeTab);
                const list = tab.id === 'katakana' ? KATAKANA_DATA : tab.id === 'dakuon' ? DAKUON_DATA : tab.id === 'yoon' ? YOON_DATA : HIRAGANA_DATA;
                setSelectedKana(list[0]);
              }}
              className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
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
        <div className="lg:col-span-2 grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-3">
          {filteredKana.map(item => {
            const isSelected = selectedKana.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedKana(item);
                  speak(item.char, 'Zero');
                }}
                className={`relative p-3.5 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 cursor-pointer group border ${
                  isSelected
                    ? 'bg-gradient-to-b from-cyan-500/10 to-blue-500/10 border-cyan-500 shadow-md scale-102 ring-2 ring-cyan-500/30'
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

        {/* Selected Kana Detail & Stroke Player */}
        <div className="space-y-4">
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
              >
                🔊
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
