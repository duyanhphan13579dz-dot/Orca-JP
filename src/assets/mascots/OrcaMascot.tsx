import React from 'react';

export type OrcaMood = 'idle' | 'studying' | 'deepdive' | 'celebration';

interface OrcaMascotProps {
  mood?: OrcaMood;
  className?: string;
  size?: number;
  showSpeechBubble?: boolean;
  speechText?: string;
}

export const OrcaMascot: React.FC<OrcaMascotProps> = ({
  mood = 'idle',
  className = '',
  size = 120,
  showSpeechBubble = false,
  speechText = 'こんにちは！Hãy cùng Orca bơi ra biển lớn JLPT nhé!',
}) => {
  const getMoodBadge = () => {
    switch (mood) {
      case 'celebration':
        return (
          <span
            title="Đang ăn mừng chuỗi học tập!"
            className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold shadow-sm animate-bounce"
          >
            👑 必勝!
          </span>
        );
      case 'deepdive':
        return (
          <span
            title="Đang lặn sâu vào bài đọc Dokkai!"
            className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-full bg-cyan-500 text-white text-[10px] font-bold shadow-sm"
          >
            🤿 N3
          </span>
        );
      case 'studying':
        return (
          <span
            title="Đang tập trung ôn luyện thẻ nhớ!"
            className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-full bg-indigo-500 text-white text-[10px] font-bold shadow-sm"
          >
            📖 SOV
          </span>
        );
      case 'idle':
      default:
        return null;
    }
  };

  return (
    <div className={`relative inline-flex flex-col items-center select-none ${className}`}>
      {/* Speech Bubble */}
      {showSpeechBubble && (
        <div className="mb-2 px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-800 dark:text-cyan-200 text-xs font-medium rounded-2xl shadow-md border border-cyan-200 dark:border-cyan-800 animate-bounce relative max-w-xs text-center z-10">
          {speechText}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white dark:bg-slate-800 border-b border-r border-cyan-200 dark:border-cyan-800 rotate-45" />
        </div>
      )}

      {/* Mascot Avatar Card */}
      <div className="relative group cursor-pointer">
        <div
          className="relative overflow-hidden rounded-3xl bg-white p-1 ring-2 ring-cyan-500/30 dark:ring-cyan-400/30 shadow-md group-hover:scale-105 group-hover:rotate-1 transition-all duration-300"
          style={{ width: `${size}px`, height: `${size}px` }}
        >
          <img
            src="./orca-mascot.png"
            alt="Orca-kun Mascot"
            className="w-full h-full object-contain select-none"
            loading="lazy"
          />
        </div>

        {/* Mood indicator badge */}
        {getMoodBadge()}
      </div>
    </div>
  );
};
