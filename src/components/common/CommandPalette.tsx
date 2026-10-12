import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { MainTab, JLPTLevel, KanjiItem, GrammarItem, ReadingItem, SRSCard } from '../../types';
import {
  Search,
  Command,
  BookOpen,
  Layers,
  Sparkles,
  Flame,
  ArrowRight,
  Database,
  Moon,
  Award,
  X,
  FileText,
  RotateCcw,
} from 'lucide-react';

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: MainTab) => void;
  onSelectLevel: (level: JLPTLevel) => void;
  onOpenPhoneticRules: () => void;
  onOpenBackup: () => void;
  onOpenProfileSettings?: () => void;
  onToggleTheme: () => void;
  onSelectGrammarSubView?: (subView: 'all' | 'nuance' | 'verbs' | 'sov') => void;
  onSelectKanjiSearch?: (query: string) => void;
  onSelectReading?: (readingId: string) => void;
  allKanji?: KanjiItem[];
  allGrammar?: GrammarItem[];
  allReadings?: ReadingItem[];
  allCards?: SRSCard[];
}

interface PaletteItem {
  id: string;
  category: 'Lệnh nhanh' | 'Chữ Hán' | 'Ngữ pháp' | 'Bài đọc' | 'Từ vựng';
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: string;
  action: () => void;
}

// Strip Vietnamese tone marks for fuzzy matching ("thuy" matches "thủy")
const removeAccents = (str: string): string => {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd');
};

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onSelectLevel,
  onOpenPhoneticRules,
  onOpenBackup,
  onOpenProfileSettings,
  onToggleTheme,
  onSelectGrammarSubView,
  onSelectKanjiSearch,
  onSelectReading,
  allKanji = [],
  allGrammar = [],
  allReadings = [],
  allCards = [],
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Static Quick Commands definition
  const quickCommands: PaletteItem[] = useMemo(() => [
    {
      id: 'cmd-srs',
      category: 'Lệnh nhanh',
      icon: <Flame className="w-4 h-4 text-amber-500" />,
      title: 'Luyện tập SRS (Spaced Repetition)',
      subtitle: '> srs • Ôn thẻ nhớ theo thuật toán SM-2 Plus',
      badge: 'Tab',
      badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      action: () => onNavigateTab('srs'),
    },
    {
      id: 'cmd-kanji',
      category: 'Lệnh nhanh',
      icon: <Layers className="w-4 h-4 text-cyan-500" />,
      title: 'Kho Chữ Hán (Kanji Matrix)',
      subtitle: '> kanji • Tra cứu, chiết tự và mô phỏng nét vẽ',
      badge: 'Tab',
      badgeColor: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
      action: () => onNavigateTab('kanji'),
    },
    {
      id: 'cmd-grammar',
      category: 'Lệnh nhanh',
      icon: <BookOpen className="w-4 h-4 text-blue-500" />,
      title: 'Cấu trúc Ngữ pháp (Grammar Lab)',
      subtitle: '> grammar • Công thức câu, trợ từ và câu ví dụ',
      badge: 'Tab',
      badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      action: () => onNavigateTab('grammar'),
    },
    {
      id: 'cmd-dokkai',
      category: 'Lệnh nhanh',
      icon: <FileText className="w-4 h-4 text-emerald-500" />,
      title: 'Trình Đọc hiểu Tương tác (Dokkai 2.0)',
      subtitle: '> dokkai • Mondai 10, 11, 12, Focus từng câu',
      badge: 'Tab',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      action: () => onNavigateTab('dokkai'),
    },
    {
      id: 'cmd-kana',
      category: 'Lệnh nhanh',
      icon: <RotateCcw className="w-4 h-4 text-rose-500" />,
      title: 'Bảng chữ cái Hiragana & Katakana',
      subtitle: '> kana • Luyện âm, viết nét và Game tốc độ',
      badge: 'Level Zero',
      badgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
      action: () => {
        onSelectLevel('Zero');
        onNavigateTab('kana');
      },
    },
    {
      id: 'cmd-phonetic',
      category: 'Lệnh nhanh',
      icon: <Sparkles className="w-4 h-4 text-purple-500" />,
      title: 'Quy tắc chuyển âm Hán-Việt ➔ Onyomi',
      subtitle: '> phonetic • Bí kíp 40+ công thức chuyển âm thần tốc',
      badge: 'Bí kíp',
      badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
      action: () => onOpenPhoneticRules(),
    },
    {
      id: 'cmd-nuance',
      category: 'Lệnh nhanh',
      icon: <Sparkles className="w-4 h-4 text-pink-500" />,
      title: 'Đấu trường Sắc thái Ngữ pháp (Nuance Duels)',
      subtitle: '> nuance • So sánh các cặp ngữ pháp dễ nhầm lẫn',
      badge: 'Chuyên sâu',
      badgeColor: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20',
      action: () => {
        onNavigateTab('grammar');
        if (onSelectGrammarSubView) onSelectGrammarSubView('nuance');
      },
    },
    {
      id: 'cmd-verb',
      category: 'Lệnh nhanh',
      icon: <Layers className="w-4 h-4 text-indigo-500" />,
      title: 'Ma trận chia 10 thể Động từ (Verb Conjugator)',
      subtitle: '> verb • Chia thể Te, Ta, Nai, Bị động, Sai khiến...',
      badge: 'Tra cứu',
      badgeColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
      action: () => {
        onNavigateTab('grammar');
        if (onSelectGrammarSubView) onSelectGrammarSubView('verbs');
      },
    },
    {
      id: 'cmd-n5',
      category: 'Lệnh nhanh',
      icon: <Command className="w-4 h-4 text-emerald-500" />,
      title: 'Chuyển sang Cấp độ N5 (Nhập môn)',
      subtitle: '> n5 • Đổi toàn bộ giao diện và kho tài liệu sang N5',
      badge: 'Cấp độ',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      action: () => onSelectLevel('N5'),
    },
    {
      id: 'cmd-n4',
      category: 'Lệnh nhanh',
      icon: <Command className="w-4 h-4 text-cyan-500" />,
      title: 'Chuyển sang Cấp độ N4 (Sơ cấp)',
      subtitle: '> n4 • Đổi toàn bộ giao diện và kho tài liệu sang N4',
      badge: 'Cấp độ',
      badgeColor: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
      action: () => onSelectLevel('N4'),
    },
    {
      id: 'cmd-n3',
      category: 'Lệnh nhanh',
      icon: <Command className="w-4 h-4 text-indigo-500" />,
      title: 'Chuyển sang Cấp độ N3 (Trung cấp)',
      subtitle: '> n3 • Đổi toàn bộ giao diện và kho tài liệu sang N3',
      badge: 'Cấp độ',
      badgeColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
      action: () => onSelectLevel('N3'),
    },
    {
      id: 'cmd-profile',
      category: 'Lệnh nhanh',
      icon: <Command className="w-4 h-4 text-cyan-500" />,
      title: 'Hồ sơ Cá nhân & Cài đặt Đồng bộ (Profile & Sync)',
      subtitle: '> profile • Xem tài khoản, trạng thái Online/Offline và đồng bộ Cloud',
      badge: 'Hồ sơ',
      badgeColor: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
      action: () => {
        if (onOpenProfileSettings) onOpenProfileSettings();
      },
    },
    {
      id: 'cmd-backup',
      category: 'Lệnh nhanh',
      icon: <Database className="w-4 h-4 text-teal-500" />,
      title: 'Sao lưu & Phục hồi dữ liệu (Backup / Restore)',
      subtitle: '> backup • Xuất và nhập tệp JSON an toàn cho IndexedDB',
      badge: 'Hệ thống',
      badgeColor: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
      action: () => onOpenBackup(),
    },
    {
      id: 'cmd-dashboard',
      category: 'Lệnh nhanh',
      icon: <Award className="w-4 h-4 text-purple-500" />,
      title: 'Thống kê Trí nhớ & Heatmap (Memory Matrix)',
      subtitle: '> dashboard • Điểm chuẩn JLPT Readiness & 52 tuần Heatmap',
      badge: 'Tab',
      badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
      action: () => onNavigateTab('dashboard'),
    },
    {
      id: 'cmd-theme',
      category: 'Lệnh nhanh',
      icon: <Moon className="w-4 h-4 text-amber-500" />,
      title: 'Chuyển đổi Giao diện Tối / Sáng (Theme)',
      subtitle: '> theme • Midnight Abyss ⇄ Iceberg White',
      badge: 'Giao diện',
      badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      action: () => onToggleTheme(),
    },
  ], [onNavigateTab, onSelectLevel, onOpenPhoneticRules, onOpenBackup, onToggleTheme, onSelectGrammarSubView]);

  // Compute matched items
  const matchedItems: PaletteItem[] = useMemo(() => {
    const rawQ = query.trim();
    if (!rawQ) {
      return quickCommands;
    }

    const q = rawQ.toLowerCase();
    const qClean = removeAccents(q);
    const isCommandQuery = q.startsWith('>');
    const searchKeyword = isCommandQuery ? q.slice(1).trim() : q;
    const searchClean = removeAccents(searchKeyword);

    const results: PaletteItem[] = [];

    // 1. Filter Quick Commands
    for (const cmd of quickCommands) {
      const match =
        cmd.title.toLowerCase().includes(searchKeyword) ||
        removeAccents(cmd.title).includes(searchClean) ||
        cmd.subtitle?.toLowerCase().includes(searchKeyword) ||
        removeAccents(cmd.subtitle || '').includes(searchClean);

      if (match) {
        results.push(cmd);
      }
    }

    if (isCommandQuery) {
      return results;
    }

    // 2. Filter Kanji Items
    let kanjiCount = 0;
    for (const k of allKanji) {
      if (kanjiCount >= 10) break;
      const hanVietClean = removeAccents(k.hanViet);
      const meaningClean = removeAccents(k.meaningVi);

      const isMatch =
        k.kanji.includes(q) ||
        k.hanViet.toLowerCase().includes(q) ||
        hanVietClean.includes(qClean) ||
        k.meaningVi.toLowerCase().includes(q) ||
        meaningClean.includes(qClean) ||
        k.onyomi.some(on => on.toLowerCase().includes(q)) ||
        k.kunyomi.some(kun => kun.toLowerCase().includes(q));

      if (isMatch) {
        results.push({
          id: `kanji-${k.id}`,
          category: 'Chữ Hán',
          icon: <span className="font-jp font-black text-base text-cyan-500">{k.kanji}</span>,
          title: `${k.kanji} [${k.hanViet}] — ${k.meaningVi}`,
          subtitle: `On: ${k.onyomi.join(', ')} • Kun: ${k.kunyomi.join(', ')}`,
          badge: k.level,
          badgeColor: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
          action: () => {
            onSelectLevel(k.level);
            onNavigateTab('kanji');
            if (onSelectKanjiSearch) onSelectKanjiSearch(k.kanji);
          },
        });
        kanjiCount++;
      }
    }

    // 3. Filter Grammar Items
    let grammarCount = 0;
    for (const g of allGrammar) {
      if (grammarCount >= 10) break;
      const titleClean = removeAccents(g.title);
      const meaningClean = removeAccents(g.meaningVi);

      const isMatch =
        g.title.toLowerCase().includes(q) ||
        titleClean.includes(qClean) ||
        g.meaningVi.toLowerCase().includes(q) ||
        meaningClean.includes(qClean) ||
        g.category.toLowerCase().includes(q);

      if (isMatch) {
        results.push({
          id: `grammar-${g.id}`,
          category: 'Ngữ pháp',
          icon: <BookOpen className="w-4 h-4 text-blue-500" />,
          title: `${g.title} — ${g.meaningVi}`,
          subtitle: `${g.category} • ${g.formation}`,
          badge: g.level,
          badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
          action: () => {
            onSelectLevel(g.level);
            onNavigateTab('grammar');
          },
        });
        grammarCount++;
      }
    }

    // 4. Filter Dokkai Readings
    for (const r of allReadings) {
      const titleClean = removeAccents(r.title);
      const topicClean = removeAccents(r.topic);

      const isMatch =
        r.title.toLowerCase().includes(q) ||
        titleClean.includes(qClean) ||
        r.topic.toLowerCase().includes(q) ||
        topicClean.includes(qClean);

      if (isMatch) {
        results.push({
          id: `reading-${r.id}`,
          category: 'Bài đọc',
          icon: <FileText className="w-4 h-4 text-emerald-500" />,
          title: r.title,
          subtitle: `Chủ đề: ${r.topic}`,
          badge: r.level,
          badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
          action: () => {
            onNavigateTab('dokkai');
            if (onSelectReading) onSelectReading(r.id);
          },
        });
      }
    }

    // 5. Filter Vocabulary / SRS Cards
    let vocabCount = 0;
    for (const c of allCards) {
      if (vocabCount >= 10) break;
      const backClean = removeAccents(c.back);
      const hanVietClean = c.hanViet ? removeAccents(c.hanViet) : '';

      const isMatch =
        c.front.includes(q) ||
        (c.furigana && c.furigana.includes(q)) ||
        (c.hanViet && (c.hanViet.toLowerCase().includes(q) || hanVietClean.includes(qClean))) ||
        c.back.toLowerCase().includes(q) ||
        backClean.includes(qClean);

      if (isMatch) {
        results.push({
          id: `card-${c.id}`,
          category: 'Từ vựng',
          icon: <span className="font-jp font-bold text-sm text-amber-500">{c.front}</span>,
          title: `${c.front} ${c.hanViet ? `[${c.hanViet}]` : ''} — ${c.back}`,
          subtitle: `Furigana: ${c.furigana || '-'} • Trạng thái: ${c.status}`,
          badge: c.level,
          badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
          action: () => {
            onSelectLevel(c.level);
            onNavigateTab('srs');
          },
        });
        vocabCount++;
      }
    }

    return results;
  }, [query, quickCommands, allKanji, allGrammar, allReadings, allCards, onSelectLevel, onNavigateTab, onSelectKanjiSearch, onSelectReading]);

  // Reset selected index when query results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [matchedItems.length]);

  // Execute selected item
  const handleSelect = useCallback((item: PaletteItem) => {
    item.action();
    onClose();
  }, [onClose]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < matchedItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : matchedItems.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (matchedItems[selectedIndex]) {
        handleSelect(matchedItems[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  }, [matchedItems, selectedIndex, handleSelect, onClose]);

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.querySelector(`[data-index="${selectedIndex}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/60 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-scale-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Header Input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <Search className="w-5 h-5 text-cyan-500 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tra Hán-Việt ('thủy'), Romaji ('taberu'), Ngữ pháp, hoặc gõ '>' để xem lệnh..."
            className="w-full bg-transparent text-sm sm:text-base font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono font-bold text-slate-400 bg-slate-200/60 dark:bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-300 dark:border-slate-700">
            ESC
          </div>
        </div>

        {/* Results List */}
        <div ref={listRef} className="overflow-y-auto p-2 space-y-1 flex-1">
          {matchedItems.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              <Command className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p>Không tìm thấy kết quả nào phù hợp với &quot;{query}&quot;</p>
              <p className="text-xs text-slate-500 mt-1">
                Thử gõ Hán-Việt (ví dụ: "thủy", "nhật"), Kana, hoặc gõ &quot;&gt;&quot; để xem menu lệnh
              </p>
            </div>
          ) : (
            matchedItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  data-index={idx}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`group px-3.5 py-2.5 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition select-none ${
                    isSelected
                      ? 'bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-900 dark:text-cyan-100'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 border transition ${
                        isSelected
                          ? 'bg-white dark:bg-slate-800 border-cyan-400/50 shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80'
                      }`}
                    >
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-bold truncate flex items-center gap-2">
                        <span>{item.title}</span>
                        {item.badge && (
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded-md font-bold border ${
                              item.badgeColor || 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                      {item.subtitle && (
                        <div className="text-[11px] text-slate-400 dark:text-slate-400 truncate">
                          {item.subtitle}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[10px] text-slate-400 uppercase font-mono hidden sm:inline">
                      {item.category}
                    </span>
                    <ArrowRight
                      className={`w-4 h-4 transition ${
                        isSelected
                          ? 'text-cyan-600 dark:text-cyan-400 translate-x-0.5'
                          : 'text-slate-300 dark:text-slate-700 opacity-0 group-hover:opacity-100'
                      }`}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Navigation Hints */}
        <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 text-[11px] text-slate-500 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">
                ↑
              </kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">
                ↓
              </kbd>
              <span>Di chuyển</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">
                ↵
              </kbd>
              <span>Chọn</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">
                Esc
              </kbd>
              <span>Đóng</span>
            </span>
          </div>
          <div className="text-slate-400">
            O-Shachi Spotlight • <span className="font-mono text-cyan-600 dark:text-cyan-400 font-semibold">Ctrl + K</span>
          </div>
        </div>
      </div>
    </div>
  );
};
