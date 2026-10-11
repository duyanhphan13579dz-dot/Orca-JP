import React, { useState } from 'react';
import { AudioButton } from '../common/AudioButton';
import { Layers } from 'lucide-react';

interface VerbExample {
  dictionary: string;
  hanViet: string;
  meaning: string;
  group: 'Nhóm 1' | 'Nhóm 2' | 'Nhóm 3';
  masu: string;
  te: string;
  nai: string;
  potential: string; // Khả năng
  passive: string;   // Bị động
  causative: string; // Sai khiến
  conditional: string; // Điều kiện ば
}

const SAMPLE_VERBS: VerbExample[] = [
  {
    dictionary: '書く (かく)',
    hanViet: 'THƯ',
    meaning: 'Viết',
    group: 'Nhóm 1',
    masu: '書きます',
    te: '書いて',
    nai: '書かない',
    potential: '書ける',
    passive: '書かれる',
    causative: '書かせる',
    conditional: '書けば',
  },
  {
    dictionary: '飲む (のむ)',
    hanViet: 'ẨM',
    meaning: 'Uống',
    group: 'Nhóm 1',
    masu: '飲みます',
    te: '飲んで',
    nai: '飲まない',
    potential: '飲める',
    passive: '飲まれる',
    causative: '飲ませる',
    conditional: '飲めば',
  },
  {
    dictionary: '食べる (たべる)',
    hanViet: 'THỰC',
    meaning: 'Ăn',
    group: 'Nhóm 2',
    masu: '食べます',
    te: '食べて',
    nai: '食べない',
    potential: '食べられる',
    passive: '食べられる',
    causative: '食べさせる',
    conditional: '食べれば',
  },
  {
    dictionary: '見る (みる)',
    hanViet: 'KIẾN',
    meaning: 'Nhìn, xem',
    group: 'Nhóm 2',
    masu: '見ます',
    te: '見て',
    nai: '見ない',
    potential: '見られる',
    passive: '見られる',
    causative: '見させる',
    conditional: '見れば',
  },
  {
    dictionary: 'する',
    hanViet: 'VI',
    meaning: 'Làm',
    group: 'Nhóm 3',
    masu: 'します',
    te: 'して',
    nai: 'しない',
    potential: 'できる',
    passive: 'される',
    causative: 'させる',
    conditional: 'すれば',
  },
  {
    dictionary: '来る (くる)',
    hanViet: 'LAI',
    meaning: 'Đến',
    group: 'Nhóm 3',
    masu: '来ます (きます)',
    te: '来て (きて)',
    nai: '来ない (こない)',
    potential: '来られる (こられる)',
    passive: '来られる (こられる)',
    causative: '来させる (こさせる)',
    conditional: '来れば (くれば)',
  },
];

export const VerbConjugator: React.FC = () => {
  const [selectedVerb, setSelectedVerb] = useState<VerbExample>(SAMPLE_VERBS[0]);

  const forms: { label: string; desc: string; key: keyof VerbExample; badgeColor: string }[] = [
    { label: 'Thể Thường (Jisho)', desc: 'Nguyên mẫu từ điển', key: 'dictionary', badgeColor: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
    { label: 'Thể Lịch sự (Masu)', desc: 'Dùng trong đàm thoại lịch thiệp', key: 'masu', badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
    { label: 'Thể Te (て)', desc: 'Nối câu, mệnh lệnh, tiếp diễn', key: 'te', badgeColor: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400' },
    { label: 'Thể Phủ định (Nai)', desc: 'Không làm gì...', key: 'nai', badgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400' },
    { label: 'Thể Khả năng (Kanou)', desc: 'Có thể làm gì...', key: 'potential', badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
    { label: 'Thể Bị động (Ukemi)', desc: 'Bị / Được tác động...', key: 'passive', badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
    { label: 'Thể Sai khiến (Shieki)', desc: 'Bắt / Cho phép ai làm...', key: 'causative', badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400' },
    { label: 'Thể Điều kiện (Ba)', desc: 'Nếu làm gì thì...', key: 'conditional', badgeColor: 'bg-teal-500/10 text-teal-600 dark:text-teal-400' },
  ];

  return (
    <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
          <Layers className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Bảng Biến đổi 8 Thể Động từ N4 Thực chiến
          </h3>
          <p className="text-xs text-slate-500">Tra cứu tức thì cách biến đổi thể của 3 nhóm động từ</p>
        </div>
      </div>

      {/* Select verb chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {SAMPLE_VERBS.map((v, i) => (
          <button
            key={i}
            onClick={() => setSelectedVerb(v)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
              selectedVerb.dictionary === v.dictionary
                ? 'bg-cyan-500 text-white border-cyan-500 shadow-md shadow-cyan-500/20'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-cyan-400'
            }`}
          >
            {v.dictionary.split(' ')[0]} ({v.meaning})
          </button>
        ))}
      </div>

      {/* Selected Verb Detail Card */}
      <div className="p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-jp text-2xl font-black text-slate-900 dark:text-white">
              {selectedVerb.dictionary}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold">
              {selectedVerb.hanViet}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold">
              {selectedVerb.group}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Nghĩa: <span className="font-medium text-slate-700 dark:text-slate-200">{selectedVerb.meaning}</span>
          </p>
        </div>

        <AudioButton text={selectedVerb.dictionary.split(' ')[0]} level="N4" size="md" label="Nghe mẫu" />
      </div>

      {/* 8 Form Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {forms.map((f, i) => {
          const val = selectedVerb[f.key] as string;
          return (
            <div
              key={i}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex flex-col justify-between hover:border-cyan-400 transition"
            >
              <div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mb-1.5 ${f.badgeColor}`}>
                  {f.label}
                </span>
                <div className="font-jp text-lg font-bold text-slate-900 dark:text-white mb-0.5">
                  {val}
                </div>
                <div className="text-[11px] text-slate-400 line-clamp-1">{f.desc}</div>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-end">
                <AudioButton text={val.split(' ')[0]} level="N4" size="sm" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
