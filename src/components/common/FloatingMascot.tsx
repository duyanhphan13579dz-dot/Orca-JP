import React, { useState } from 'react';
import { X, MessageCircle, Sparkles } from 'lucide-react';

const MOTIVATIONAL_QUOTES = [
  { jp: '頑張って！', ro: 'Ganbatte!', vi: 'Cố lên nhé! Hãy cùng Orca bơi ra biển lớn JLPT!' },
  { jp: '継続は力なり', ro: 'Keizoku wa chikara nari', vi: 'Kiên trì là sức mạnh — duy trì chuỗi học mỗi ngày nhé!' },
  { jp: '必勝！', ro: 'Hisshou!', vi: 'Tất thắng! Mục tiêu N3 nằm trong tầm tay bạn!' },
  { jp: '千里の道も一歩から', ro: 'Senri no michi mo ippo kara', vi: 'Đường ngàn dặm bắt đầu từ từng chữ Kanji đầu tiên.' },
  { jp: '七転び八起き', ro: 'Nana korobi ya oki', vi: 'Ngã 7 lần, đứng dậy 8 lần — quên thẻ thì ôn lại ngay!' },
];

export const FloatingMascot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [bubbleKey, setBubbleKey] = useState(0);

  const handleClickMascot = () => {
    setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
    setIsOpen(true);
    setBubbleKey((prev) => prev + 1);
  };

  const currentQuote = MOTIVATIONAL_QUOTES[quoteIndex];

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end select-none">
      {/* Speech Bubble Popup */}
      {isOpen && (
        <div
          key={bubbleKey}
          className="mb-3 max-w-[260px] p-3.5 bg-white dark:bg-slate-900 border border-cyan-500/30 rounded-3xl shadow-2xl backdrop-blur-md animate-scale-up text-slate-800 dark:text-slate-100 relative"
        >
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition p-0.5"
            title="Đóng lời thoại"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-600 dark:text-cyan-400 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Orca-kun động viên:</span>
          </div>

          <div className="font-jp font-bold text-sm text-slate-900 dark:text-white leading-snug">
            {currentQuote.jp}
          </div>
          <div className="text-[11px] text-cyan-600 dark:text-cyan-400 font-medium">
            {currentQuote.ro}
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
            {currentQuote.vi}
          </div>

          {/* Pointer tail */}
          <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white dark:bg-slate-900 border-b border-r border-cyan-500/30 rotate-45" />
        </div>
      )}

      {/* Mini Mascot Floating Button */}
      <div
        onClick={handleClickMascot}
        title="Nhấp để nghe Orca-kun động viên học tập!"
        className="group relative cursor-pointer flex items-center justify-center p-1 rounded-3xl bg-white dark:bg-slate-900 ring-2 ring-cyan-500/50 hover:ring-cyan-400 shadow-xl hover:scale-110 active:scale-95 transition-all duration-300"
      >
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-white p-0.5">
          <img
            src="./orca-mascot.png"
            alt="Orca-kun Mascot Mini"
            className="w-full h-full object-contain select-none group-hover:rotate-3 transition-transform"
          />
        </div>

        {/* Pulsing notification badge */}
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-4 w-4 bg-cyan-500 border border-white dark:border-slate-900 items-center justify-center text-[9px] text-white font-bold">
            !
          </span>
        </span>
      </div>
    </div>
  );
};
