import React, { useState, useMemo } from 'react';
import { AudioButton } from '../common/AudioButton';
import { Layers, Sparkles, Search, BookOpen, Volume2 } from 'lucide-react';

export interface VerbItem {
  dictionary: string;
  reading: string;
  hanViet: string;
  meaning: string;
  group: 'Nhóm 1' | 'Nhóm 2' | 'Nhóm 3';
  masu: string;
  ta: string;
  te: string;
  nai: string;
  potential: string;      // Khả năng
  passive: string;        // Bị động
  causative: string;      // Sai khiến
  causativePassive: string; // Sai khiến bị động
  conditional: string;    // Điều kiện ば
  volitional: string;     // Ý chí
  imperative: string;     // Mệnh lệnh
}

export const VERB_DATABASE: VerbItem[] = [
  // --- NHÓM 1 (GODAN) ---
  {
    dictionary: '書く',
    reading: 'かく',
    hanViet: 'THƯ',
    meaning: 'Viết',
    group: 'Nhóm 1',
    masu: '書きます (かきます)',
    ta: '書いた (かいた)',
    te: '書いて (かいて)',
    nai: '書かない (かかない)',
    potential: '書ける (かける)',
    passive: '書かれる (かかれる)',
    causative: '書かせる (かかせる)',
    causativePassive: '書かせられる (かかせられる)',
    conditional: '書けば (かけば)',
    volitional: '書こう (かこう)',
    imperative: '書け (かけ)',
  },
  {
    dictionary: '行く',
    reading: 'いく',
    hanViet: 'HÀNH',
    meaning: 'Đi (Bất quy tắc thể Te/Ta)',
    group: 'Nhóm 1',
    masu: '行きます (いきます)',
    ta: '行った (いった)',
    te: '行って (いって)',
    nai: '行かない (いかない)',
    potential: '行ける (いける)',
    passive: '行かれる (いかれる)',
    causative: '行かせる (いかせる)',
    causativePassive: '行かせられる (いかせられる)',
    conditional: '行けば (いけば)',
    volitional: '行こう (いこう)',
    imperative: '行け (いけ)',
  },
  {
    dictionary: '飲む',
    reading: 'のむ',
    hanViet: 'ẨM',
    meaning: 'Uống',
    group: 'Nhóm 1',
    masu: '飲みます (のみます)',
    ta: '飲んだ (のんだ)',
    te: '飲んで (のんで)',
    nai: '飲まない (のまない)',
    potential: '飲める (のめる)',
    passive: '飲まれる (のまれる)',
    causative: '飲ませる (のませる)',
    causativePassive: '飲まされる (のまされる)',
    conditional: '飲めば (のめば)',
    volitional: '飲もう (のもよう)',
    imperative: '飲め (のめ)',
  },
  {
    dictionary: '話す',
    reading: 'はなす',
    hanViet: 'THOẠI',
    meaning: 'Nói chuyện',
    group: 'Nhóm 1',
    masu: '話します (はなします)',
    ta: '話した (はなした)',
    te: '話して (はなして)',
    nai: '話さない (はなさない)',
    potential: '話せる (はなせる)',
    passive: '話される (はなされる)',
    causative: '話させる (はなさせる)',
    causativePassive: '話させられる (はなさせられる)',
    conditional: '話せば (はなせば)',
    volitional: '話そう (はなそう)',
    imperative: '話せ (はなせ)',
  },
  {
    dictionary: '待つ',
    reading: 'まつ',
    hanViet: 'ĐÃI',
    meaning: 'Chờ đợi',
    group: 'Nhóm 1',
    masu: '待ちます (まちます)',
    ta: '待った (まった)',
    te: '待って (まって)',
    nai: '待たない (またない)',
    potential: '待てる (まてる)',
    passive: '待たれる (またれる)',
    causative: '待たせる (またせる)',
    causativePassive: '待たされる (またされる)',
    conditional: '待てば (まてば)',
    volitional: '待とう (まとう)',
    imperative: '待て (まて)',
  },
  {
    dictionary: '買う',
    reading: 'かう',
    hanViet: 'MÃI',
    meaning: 'Mua',
    group: 'Nhóm 1',
    masu: '買います (かいます)',
    ta: '買った (かった)',
    te: '買って (かって)',
    nai: '買わない (かわない)',
    potential: '買える (かえる)',
    passive: '買われる (かわれる)',
    causative: '買わせる (かわせる)',
    causativePassive: '買わされる (かわされる)',
    conditional: '買えば (かえば)',
    volitional: '買おう (かおう)',
    imperative: '買え (かえ)',
  },
  {
    dictionary: '泳ぐ',
    reading: 'およぐ',
    hanViet: 'VỊNH',
    meaning: 'Bơi lội',
    group: 'Nhóm 1',
    masu: '泳ぎます (およぎます)',
    ta: '泳いだ (およいだ)',
    te: '泳いで (およいで)',
    nai: '泳がない (およがない)',
    potential: '泳げる (およげる)',
    passive: '泳がれる (およがれる)',
    causative: '泳がせる (およがせる)',
    causativePassive: '泳がせられる (およがせられる)',
    conditional: '泳げば (およげば)',
    volitional: '泳ごう (およごう)',
    imperative: '泳げ (およげ)',
  },
  {
    dictionary: '遊ぶ',
    reading: 'あそぶ',
    hanViet: 'DU',
    meaning: 'Chơi đùa',
    group: 'Nhóm 1',
    masu: '遊びます (あそびます)',
    ta: '遊んだ (あそんだ)',
    te: '遊んで (あそんで)',
    nai: '遊ばない (あそばない)',
    potential: '遊べる (あそべる)',
    passive: '遊ばれる (あそばれる)',
    causative: '遊ばせる (あそばせる)',
    causativePassive: '遊ばされる (あそばされる)',
    conditional: '遊べば (あそべば)',
    volitional: '遊ぼう (あそぼう)',
    imperative: '遊べ (あそべ)',
  },

  // --- NHÓM 2 (ICHIDAN) ---
  {
    dictionary: '食べる',
    reading: 'たべる',
    hanViet: 'THỰC',
    meaning: 'Ăn',
    group: 'Nhóm 2',
    masu: '食べます (たべます)',
    ta: '食べた (たべた)',
    te: '食べて (たべて)',
    nai: '食べない (たべない)',
    potential: '食べられる (たべられる)',
    passive: '食べられる (たべられる)',
    causative: '食べさせる (たべさせる)',
    causativePassive: '食べさせられる (たべさせられる)',
    conditional: '食べれば (たべれば)',
    volitional: '食べよう (たべよう)',
    imperative: '食べろ (たべろ)',
  },
  {
    dictionary: '見る',
    reading: 'みる',
    hanViet: 'KIẾN',
    meaning: 'Nhìn, xem',
    group: 'Nhóm 2',
    masu: '見ます (みます)',
    ta: '見た (みた)',
    te: '見て (みて)',
    nai: '見ない (みない)',
    potential: '見られる (みられる)',
    passive: '見られる (みられる)',
    causative: '見させる (みさせる)',
    causativePassive: '見させられる (みさせられる)',
    conditional: '見れば (みれば)',
    volitional: '見よう (みよう)',
    imperative: '見ろ (みろ)',
  },
  {
    dictionary: '起きる',
    reading: 'おきる',
    hanViet: 'KHỞI',
    meaning: 'Thức dậy',
    group: 'Nhóm 2',
    masu: '起きます (おきます)',
    ta: '起きた (おきた)',
    te: '起きて (おきて)',
    nai: '起きない (おきない)',
    potential: '起きられる (おきられる)',
    passive: '起きられる (おきられる)',
    causative: '起きさせる (おきさせる)',
    causativePassive: '起きさせられる (おきさせられる)',
    conditional: '起きれば (おきれば)',
    volitional: '起きよう (おきよう)',
    imperative: '起きろ (おきろ)',
  },
  {
    dictionary: '教える',
    reading: 'おしえる',
    hanViet: 'GIÁO',
    meaning: 'Dạy học, chỉ dẫn',
    group: 'Nhóm 2',
    masu: '教えます (おしえます)',
    ta: '教えた (おしえた)',
    te: '教えて (おしえて)',
    nai: '教えない (おしえない)',
    potential: '教えられる (おしえられる)',
    passive: '教えられる (おしえられる)',
    causative: '教えさせる (おしえさせる)',
    causativePassive: '教えさせられる (おしえさせられる)',
    conditional: '教えれば (おしえれば)',
    volitional: '教えよう (おしえよう)',
    imperative: '教えろ (おしえろ)',
  },

  // --- NHÓM 3 (BẤT QUY TẮC) ---
  {
    dictionary: 'する',
    reading: 'する',
    hanViet: 'VI',
    meaning: 'Làm',
    group: 'Nhóm 3',
    masu: 'します',
    ta: 'した',
    te: 'して',
    nai: 'しない',
    potential: 'できる',
    passive: 'される',
    causative: 'させる',
    causativePassive: 'させられる',
    conditional: 'すれば',
    volitional: 'しよう',
    imperative: 'しろ',
  },
  {
    dictionary: '来る',
    reading: 'くる',
    hanViet: 'LAI',
    meaning: 'Đến',
    group: 'Nhóm 3',
    masu: '来ます (きます)',
    ta: '来た (きた)',
    te: '来て (きて)',
    nai: '来ない (こない)',
    potential: '来られる (こられる)',
    passive: '来られる (こられる)',
    causative: '来させる (こさせる)',
    causativePassive: '来させられる (こさせられる)',
    conditional: '来れば (くれば)',
    volitional: '来よう (こよう)',
    imperative: '来い (こい)',
  },
  {
    dictionary: '勉強する',
    reading: 'べんきょうする',
    hanViet: 'MIỄN CƯỠNG',
    meaning: 'Học tập (Danh động từ Suru)',
    group: 'Nhóm 3',
    masu: '勉強します',
    ta: '勉強した',
    te: '勉強して',
    nai: '勉強しない',
    potential: '勉強できる',
    passive: '勉強される',
    causative: '勉強させる',
    causativePassive: '勉強させられる',
    conditional: '勉強すれば',
    volitional: '勉強しよう',
    imperative: '勉強しろ',
  },
];

export const VerbConjugator: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState<'all' | 'Nhóm 1' | 'Nhóm 2' | 'Nhóm 3'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVerb, setSelectedVerb] = useState<VerbItem>(VERB_DATABASE[0]);

  const filteredVerbs = useMemo(() => {
    return VERB_DATABASE.filter((v) => {
      const matchGroup = selectedGroup === 'all' || v.group === selectedGroup;
      if (!matchGroup) return false;
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        v.dictionary.includes(q) ||
        v.reading.includes(q) ||
        v.hanViet.toLowerCase().includes(q) ||
        v.meaning.toLowerCase().includes(q)
      );
    });
  }, [selectedGroup, searchQuery]);

  const forms: {
    label: string;
    desc: string;
    key: keyof VerbItem;
    badgeColor: string;
    bgAccent: string;
  }[] = [
    {
      label: 'Thể Thường (Jisho)',
      desc: 'Nguyên mẫu từ điển, dùng trong giao tiếp thân mật hoặc bổ nghĩa cho danh từ',
      key: 'dictionary',
      badgeColor: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
      bgAccent: 'border-slate-300 dark:border-slate-700',
    },
    {
      label: 'Thể Lịch sự (Masu)',
      desc: 'Đàm thoại chuẩn mực lịch thiệp với người lạ, cấp trên',
      key: 'masu',
      badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      bgAccent: 'border-blue-500/30',
    },
    {
      label: 'Thể Quá khứ (Ta - た)',
      desc: 'Đã hoàn thành hành động trong quá khứ hoặc trải nghiệm đã qua (～たことがある)',
      key: 'ta',
      badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
      bgAccent: 'border-amber-500/30',
    },
    {
      label: 'Thể Te (て)',
      desc: 'Nối câu, mệnh lệnh thân mật, đang làm gì đó (～ている), chuẩn bị trước (～ておく)',
      key: 'te',
      badgeColor: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
      bgAccent: 'border-cyan-500/30',
    },
    {
      label: 'Thể Phủ định (Nai)',
      desc: 'Không làm gì đó (hiện tại / tương lai), xin đừng làm gì (～ないでください)',
      key: 'nai',
      badgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
      bgAccent: 'border-rose-500/30',
    },
    {
      label: 'Thể Khả năng (Kanou)',
      desc: 'Có thể làm gì... (Biến đổi tân ngữ を thành が)',
      key: 'potential',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      bgAccent: 'border-emerald-500/30',
    },
    {
      label: 'Thể Bị động (Ukemi)',
      desc: 'Bị tác động (bị động phiền toái) hoặc được khen ngợi, tôn vinh',
      key: 'passive',
      badgeColor: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
      bgAccent: 'border-orange-500/30',
    },
    {
      label: 'Thể Sai khiến (Shieki)',
      desc: 'Bắt ai làm / Cho phép ai làm việc gì',
      key: 'causative',
      badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
      bgAccent: 'border-purple-500/30',
    },
    {
      label: 'Thể Sai khiến Bị động (Shieki-Ukemi)',
      desc: 'Bị bắt buộc phải làm việc gì một cách miễn cưỡng (Tôi bị ép uống rượu)',
      key: 'causativePassive',
      badgeColor: 'bg-red-500/10 text-red-600 dark:text-red-400',
      bgAccent: 'border-red-500/30',
    },
    {
      label: 'Thể Điều kiện (Ba - ば)',
      desc: 'Nếu làm gì đó thì... (Điều kiện giả định khách quan)',
      key: 'conditional',
      badgeColor: 'bg-teal-500/10 text-teal-600 dark:text-teal-400',
      bgAccent: 'border-teal-500/30',
    },
    {
      label: 'Thể Ý chí (Ikou - よう/おう)',
      desc: 'Rủ rê thân mật ("Hãy cùng làm nào!"), dự định cá nhân (～ようと思う)',
      key: 'volitional',
      badgeColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
      bgAccent: 'border-indigo-500/30',
    },
  ];

  return (
    <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-lg text-slate-900 dark:text-white">
                Bảng Ma Trận 10 Thể Biến Đổi Động Từ Toàn Diện
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-full">
                N5 - N4 - N3
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tra cứu nhanh và phân tích cách chia của cả 3 nhóm động từ tiếng Nhật kèm phát âm mẫu
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-60">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm động từ (Kanji, Romaji)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
      </div>

      {/* Group selector chips */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs font-bold text-slate-400 mr-2">Nhóm:</span>
        {(['all', 'Nhóm 1', 'Nhóm 2', 'Nhóm 3'] as const).map((grp) => (
          <button
            key={grp}
            onClick={() => setSelectedGroup(grp)}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition cursor-pointer ${
              selectedGroup === grp
                ? 'bg-cyan-500 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {grp === 'all' ? 'Tất cả 3 nhóm' : grp}
          </button>
        ))}
      </div>

      {/* Selected verb chips list */}
      <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-2 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
        {filteredVerbs.map((v, i) => (
          <button
            key={i}
            onClick={() => setSelectedVerb(v)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer flex items-center gap-1.5 ${
              selectedVerb.dictionary === v.dictionary
                ? 'bg-cyan-500 text-white border-cyan-500 shadow-md shadow-cyan-500/20'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-cyan-400'
            }`}
          >
            <span className="font-jp font-bold">{v.dictionary}</span>
            <span className="text-[10px] opacity-80">({v.meaning})</span>
          </button>
        ))}
      </div>

      {/* Current Active Verb Spotlight */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-blue-500/5 to-transparent border border-cyan-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 border border-cyan-500/30 flex items-center justify-center text-3xl font-jp font-black text-slate-900 dark:text-white shadow-inner">
            {selectedVerb.dictionary}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                {selectedVerb.dictionary} ({selectedVerb.reading})
              </span>
              <span className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-black">
                {selectedVerb.hanViet}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-bold">
                {selectedVerb.group}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              Ý nghĩa: <strong className="text-slate-900 dark:text-white">{selectedVerb.meaning}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <AudioButton text={selectedVerb.dictionary} level="N4" size="md" />
        </div>
      </div>

      {/* 10-Form Conjugation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {forms.map((f, i) => {
          const val = selectedVerb[f.key] as string;
          return (
            <div
              key={i}
              className={`p-4 rounded-2xl bg-white dark:bg-slate-800/80 border ${f.bgAccent} hover:border-cyan-400 shadow-xs transition flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${f.badgeColor}`}>
                    {f.label}
                  </span>
                  <AudioButton text={val.split(' ')[0]} level="N4" size="sm" />
                </div>
                <div className="font-jp text-base font-black text-slate-900 dark:text-white mt-1">
                  {val}
                </div>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                {f.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
