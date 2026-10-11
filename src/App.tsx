import { useState, useEffect, useMemo } from 'react';
import { JLPTLevel, MainTab, KanjiItem, GrammarItem } from './types';
import { useSRSIndexedDB } from './hooks/useSRSIndexedDB';
import { useDatabaseSync } from './hooks/useDatabaseSync';
import { dataLoader } from './db/dataLoader';
import { HeaderStats } from './components/layout/HeaderStats';
import { BentoSidebar } from './components/layout/BentoSidebar';
import { LevelSelector } from './components/common/LevelSelector';
import { BackupModal } from './components/common/BackupModal';

// Mascots & Brand
import { OrcaMascot, OrcaMood } from './assets/mascots/OrcaMascot';

// Module 1: Kana
import { KanaGrid } from './components/kana/KanaGrid';
import { KanaSpeedGame } from './components/kana/KanaSpeedGame';

// Module 2: Kanji
import { KanjiCard } from './components/kanji/KanjiCard';
import { JukugoExplorer } from './components/kanji/JukugoExplorer';
import { PhoneticRulesModal } from './components/kanji/PhoneticRulesModal';
import { N5_KANJI } from './data/n5/kanji';
import { N4_KANJI } from './data/n4/kanji';
import { N3_KANJI } from './data/n3/kanji';

// Module 3: Grammar
import { SentenceBuilder } from './components/grammar/SentenceBuilder';
import { NuanceComparator } from './components/grammar/NuanceComparator';
import { VerbConjugator } from './components/grammar/VerbConjugator';
import { N5_GRAMMAR } from './data/n5/grammar';
import { N4_GRAMMAR } from './data/n4/grammar';
import { N3_GRAMMAR } from './data/n3/grammar';

// Module 4: Dokkai
import { DokkaiReader } from './components/reader/DokkaiReader';
import { DOKKAI_READINGS } from './data/n3/readings';

// Module 5: SRS & Dashboard
import { SRSFlashcardDeck } from './components/srs/SRSFlashcardDeck';
import { MemoryMatrix } from './components/srs/MemoryMatrix';
import { N5_VOCAB_SRS } from './data/n5/vocab';
import { N4_VOCAB_SRS } from './data/n4/vocab';
import { N3_VOCAB_SRS } from './data/n3/vocab';

import { Search, Sparkles, BookOpen, Layers, Trophy } from 'lucide-react';

export function App() {
  const [currentLevel, setCurrentLevel] = useState<JLPTLevel>('N5');
  const [activeTab, setActiveTab] = useState<MainTab>('kanji');
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('orca_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [isPhoneticRulesOpen, setIsPhoneticRulesOpen] = useState(false);
  const [kanjiSearch, setKanjiSearch] = useState('');
  const [kanjiSubView, setKanjiSubView] = useState<'cards' | 'quiz'>('cards');
  const [grammarSubView, setGrammarSubView] = useState<'all' | 'nuance' | 'verbs' | 'sov'>('all');
  const [kanaSubView, setKanaSubView] = useState<'grid' | 'game'>('grid');

  // IndexedDB data synchronization engine
  const { isLoading: isSyncing, progress: syncProgress, syncStatus } = useDatabaseSync();
  const [dbKanji, setDbKanji] = useState<KanjiItem[]>([]);
  const [dbGrammar, setDbGrammar] = useState<GrammarItem[]>([]);

  // Fetch dynamic items from IndexedDB whenever level or sync state updates
  useEffect(() => {
    let isMounted = true;
    dataLoader.getKanji(currentLevel).then((res) => {
      if (isMounted) setDbKanji(res);
    });
    dataLoader.getGrammar(currentLevel).then((res) => {
      if (isMounted) setDbGrammar(res);
    });
    return () => {
      isMounted = false;
    };
  }, [currentLevel, syncStatus.status]);

  // IndexedDB SRS hook
  const { cards, stats, reloadData, reviewCard, undoLastReview, canUndo, getDueCards, seedDefaultCards } = useSRSIndexedDB();

  // Dark mode class sync
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('orca_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('orca_theme', 'light');
    }
  }, [isDark]);

  // Seed default SRS cards on first run
  useEffect(() => {
    const combinedSeed = [...N5_VOCAB_SRS, ...N4_VOCAB_SRS, ...N3_VOCAB_SRS];
    seedDefaultCards(combinedSeed);
  }, [seedDefaultCards]);

  // When level switches to Zero, automatically activate Kana tab
  const handleSelectLevel = (lvl: JLPTLevel) => {
    setCurrentLevel(lvl);
    if (lvl === 'Zero') {
      setActiveTab('kana');
    }
  };

  // Due SRS cards for current level
  const dueCards = useMemo(() => {
    return getDueCards(currentLevel);
  }, [getDueCards, currentLevel]);

  // All Kanji based on current level (queries IndexedDB cache with static fallback)
  const activeKanjiList = useMemo(() => {
    let list = dbKanji.length > 0 ? dbKanji : N5_KANJI;
    if (dbKanji.length === 0) {
      if (currentLevel === 'N4') list = N4_KANJI;
      if (currentLevel === 'N3') list = N3_KANJI;
      if (currentLevel === 'Zero') list = N5_KANJI;
    }

    if (!kanjiSearch) return list;
    const q = kanjiSearch.toLowerCase();
    return list.filter(
      (k) =>
        k.kanji.includes(q) ||
        k.hanViet.toLowerCase().includes(q) ||
        k.meaningVi.toLowerCase().includes(q) ||
        k.onyomi.some((on) => on.toLowerCase().includes(q))
    );
  }, [currentLevel, dbKanji, kanjiSearch]);

  // Grammar list based on level (queries IndexedDB cache with static fallback)
  const activeGrammarList = useMemo(() => {
    if (dbGrammar.length > 0) return dbGrammar;
    if (currentLevel === 'N4') return N4_GRAMMAR;
    if (currentLevel === 'N3') return N3_GRAMMAR;
    return N5_GRAMMAR;
  }, [currentLevel, dbGrammar]);

  // Mascot mood adaptation
  const mascotMood: OrcaMood = useMemo(() => {
    if (activeTab === 'dokkai') return 'deepdive';
    if (activeTab === 'srs') return 'studying';
    if (activeTab === 'dashboard') return 'celebration';
    if (currentLevel === 'N3') return 'deepdive';
    return 'idle';
  }, [activeTab, currentLevel]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 transition-colors selection:bg-cyan-500 selection:text-white">
      {/* Top Header */}
      <HeaderStats
        stats={stats}
        isDark={isDark}
        onToggleTheme={() => setIsDark(prev => !prev)}
        onOpenBackup={() => setIsBackupOpen(true)}
        isSyncing={isSyncing}
        syncProgress={syncProgress}
      />

      {/* Main Content Wrap */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Level Switcher Hero Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <LevelSelector
            currentLevel={currentLevel}
            onSelectLevel={handleSelectLevel}
            className="w-full lg:w-auto"
          />

          {/* Quick Mascot Greeting */}
          <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <OrcaMascot mood={mascotMood} size={40} />
            <div className="text-xs">
              <span className="font-bold text-cyan-600 dark:text-cyan-400">Orca-kun: </span>
              <span className="text-slate-600 dark:text-slate-300">
                {currentLevel === 'Zero' && 'Bắt đầu từ số 0 với 2 bảng chữ cái Kana!'}
                {currentLevel === 'N5' && 'Chinh phục ngữ pháp SOV và trợ từ nhập môn!'}
                {currentLevel === 'N4' && 'Làm chủ 8 thể biến đổi động từ & Kính ngữ!'}
                {currentLevel === 'N3' && 'Luyện đọc hiểu Dokkai và so sánh sắc thái!'}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation Bento Bar */}
        <BentoSidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          dueCardsCount={dueCards.length}
        />

        {/* ================= TAB 1: KANA (BẢNG CHỮ CÁI & GAME) ================= */}
        {activeTab === 'kana' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setKanaSubView('grid')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    kanaSubView === 'grid'
                      ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Bảng chữ cái & Nét vẽ
                </button>
                <button
                  onClick={() => setKanaSubView('game')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                    kanaSubView === 'game'
                      ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <Trophy className="w-3.5 h-3.5 text-amber-500" />
                  Game Phản xạ Romaji
                </button>
              </div>
            </div>

            {kanaSubView === 'grid' ? <KanaGrid /> : <KanaSpeedGame />}
          </div>
        )}

        {/* ================= TAB 2: THƯ VIỆN KANJI 3 CẤP ĐỘ ================= */}
        {activeTab === 'kanji' && (
          <div className="space-y-6 animate-fade-in">
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setKanjiSubView('cards')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    kanjiSubView === 'cards'
                      ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Danh sách Thẻ chữ Hán ({activeKanjiList.length})
                </button>
                <button
                  onClick={() => setKanjiSubView('quiz')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    kanjiSubView === 'quiz'
                      ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Đố vui Từ ghép Jukugo
                </button>
                <button
                  onClick={() => setIsPhoneticRulesOpen(true)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 hover:from-cyan-500/20 hover:to-indigo-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  40+ Quy tắc Chuyển âm
                </button>
              </div>

              {kanjiSubView === 'cards' && (
                <div className="relative sm:w-72">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Tìm chữ Hán, Hán-Việt (NHẬT, SƠN...)"
                    value={kanjiSearch}
                    onChange={e => setKanjiSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-800 dark:text-slate-200"
                  />
                </div>
              )}
            </div>

            {kanjiSubView === 'cards' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeKanjiList.map(kanji => (
                  <KanjiCard key={kanji.id} kanji={kanji} />
                ))}
              </div>
            ) : (
              <JukugoExplorer kanjiList={activeKanjiList} />
            )}
          </div>
        )}

        {/* ================= TAB 3: NGỮ PHÁP & SO SÁNH SẮC THÁI ================= */}
        {activeTab === 'grammar' && (
          <div className="space-y-6 animate-fade-in">
            {/* Sub-view navigation */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setGrammarSubView('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  grammarSubView === 'all'
                    ? 'bg-cyan-500 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                Mẫu Ngữ pháp ({currentLevel})
              </button>

              <button
                onClick={() => setGrammarSubView('nuance')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                  grammarSubView === 'nuance'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                So sánh Sắc thái (Nuance)
              </button>

              <button
                onClick={() => setGrammarSubView('verbs')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                  grammarSubView === 'verbs'
                    ? 'bg-cyan-500 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                Ma Trận 10 Thể Động Từ (N5 - N3)
              </button>

              {currentLevel === 'N5' && (
                <button
                  onClick={() => setGrammarSubView('sov')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    grammarSubView === 'sov'
                      ? 'bg-cyan-500 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Thực hành Ghép câu SOV
                </button>
              )}
            </div>

            {grammarSubView === 'nuance' && (
              <NuanceComparator grammarList={[...N5_GRAMMAR, ...N4_GRAMMAR, ...N3_GRAMMAR]} />
            )}

            {grammarSubView === 'verbs' && <VerbConjugator />}

            {grammarSubView === 'sov' && (
              <SentenceBuilder
                originalParts={[
                  { text: 'わたし', role: 'subject' },
                  { text: 'は', role: 'particle' },
                  { text: 'としょかん', role: 'location' },
                  { text: 'で', role: 'particle' },
                  { text: 'ほん', role: 'object' },
                  { text: 'を', role: 'particle' },
                  { text: 'よみます', role: 'verb' },
                ]}
                targetMeaningVi="Tôi đọc sách ở thư viện"
              />
            )}

            {grammarSubView === 'all' && (
              <div className="space-y-4">
                {activeGrammarList.map((g) => (
                  <div
                    key={g.id}
                    className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm hover:shadow-md transition space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-cyan-600 dark:text-cyan-400 tracking-wider">
                          {g.category}
                        </span>
                        <h3 className="font-jp text-lg font-black text-slate-900 dark:text-white">
                          {g.title}
                        </h3>
                      </div>
                      <div className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        Cấu trúc: <code className="text-cyan-600 dark:text-cyan-400">{g.formation}</code>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {g.explanationVi}
                    </p>

                    {/* Example Sentences */}
                    <div className="space-y-2 pt-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <BookOpen className="w-3 h-3" /> Ví dụ thực tế
                      </span>
                      {g.examples.map((ex, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                        >
                          <div>
                            <div className="font-jp font-bold text-sm text-slate-900 dark:text-white">
                              {ex.jp}
                            </div>
                            <div className="text-slate-500 dark:text-slate-400 mt-0.5">
                              {ex.vi}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 4: TRÌNH ĐỌC HIỂU DOKKAI ================= */}
        {activeTab === 'dokkai' && (
          <div className="animate-fade-in">
            <DokkaiReader readings={DOKKAI_READINGS} />
          </div>
        )}

        {/* ================= TAB 5: CỖ MÁY ÔN TẬP SRS SM-2 ================= */}
        {activeTab === 'srs' && (
          <div className="animate-fade-in py-4">
            <SRSFlashcardDeck
              cards={dueCards}
              onReviewCard={async (id, grade) => {
                await reviewCard(id, grade);
              }}
              canUndo={canUndo}
              onUndo={undoLastReview}
              currentLevelFilter={currentLevel}
            />
          </div>
        )}

        {/* ================= TAB 6: DASHBOARD THỐNG KÊ TRÍ NHỚ ================= */}
        {activeTab === 'dashboard' && (
          <div className="animate-fade-in">
            <MemoryMatrix stats={stats} cards={cards} />
          </div>
        )}
      </main>

      {/* Footer Info */}
      <footer className="mt-12 py-8 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-black text-slate-700 dark:text-slate-300">Orca JP</span>
            <span>—</span>
            <span>Chinh phục tiếng Nhật từ số 0 đến N3 với sức mạnh cá voi sát thủ</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Client-side Only</span>
            <span>•</span>
            <span>Zero Backend</span>
            <span>•</span>
            <span>Offline-first IndexedDB</span>
          </div>
        </div>
      </footer>

      {/* Backup & Restore Modal */}
      <BackupModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
        onDataChanged={reloadData}
      />

      {/* 40+ Phonetic Rules Modal */}
      <PhoneticRulesModal
        isOpen={isPhoneticRulesOpen}
        onClose={() => setIsPhoneticRulesOpen(false)}
      />
    </div>
  );
}
export default App;
