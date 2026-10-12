import React from 'react';

interface LogoProps {
  showSlogan?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  showSlogan = false,
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    sm: { icon: 34, text: 'text-lg', subText: 'text-[10px]' },
    md: { icon: 44, text: 'text-2xl', subText: 'text-xs' },
    lg: { icon: 58, text: 'text-3xl', subText: 'text-sm' },
  };

  const { icon, text, subText } = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Orca Chibi Mascot Avatar Icon */}
      <div className="relative flex-shrink-0 group cursor-pointer">
        <div
          className="relative overflow-hidden rounded-2xl ring-2 ring-cyan-500/40 dark:ring-cyan-400/40 shadow-sm bg-white p-0.5 group-hover:scale-110 group-hover:rotate-2 transition-all duration-300"
          style={{ width: `${icon}px`, height: `${icon}px` }}
        >
          <img
            src="./orca-mascot.png"
            alt="O-Shachi Mascot"
            className="w-full h-full object-contain select-none"
            loading="eager"
          />
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className={`font-black tracking-tight ${text} text-slate-900 dark:text-white flex items-center`}>
            O-<span className="text-cyan-500 dark:text-cyan-400">Shachi</span>
          </span>
          <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-600 dark:text-cyan-300 border border-cyan-400/30">
            Zero → N3
          </span>
        </div>
        {showSlogan && (
          <span className={`text-slate-500 dark:text-slate-400 font-medium ${subText} line-clamp-1`}>
            Chinh phục tiếng Nhật với sức mạnh cá voi sát thủ
          </span>
        )}
      </div>
    </div>
  );
};
