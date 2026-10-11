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
    sm: { icon: 32, text: 'text-lg', subText: 'text-[10px]' },
    md: { icon: 42, text: 'text-2xl', subText: 'text-xs' },
    lg: { icon: 56, text: 'text-3xl', subText: 'text-sm' },
  };

  const { icon, text, subText } = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Orca "O" Icon with Hinomaru Rising Sun */}
      <div className="relative flex-shrink-0 group cursor-pointer">
        <svg
          width={icon}
          height={icon}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-300 group-hover:scale-110 drop-shadow-md"
        >
          {/* Hinomaru red sun inside the O */}
          <circle cx="50" cy="50" r="23" fill="#DC2626" opacity="0.9" />

          {/* Stylized Orca Body forming an "O" shape */}
          <path
            d="M 50 8 C 73 8 92 27 92 50 C 92 73 73 92 50 92 C 27 92 8 73 8 50 C 8 36 15 23 26 15"
            stroke="#0F172A"
            strokeWidth="13"
            strokeLinecap="round"
          />

          {/* Ocean Cyan Wave highlight on Orca back */}
          <path
            d="M 28 14 C 40 9 60 9 74 15 C 86 21 92 33 92 48"
            stroke="#06B6D4"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Orca Dorsal fin breaking the ring */}
          <path
            d="M 75 14 Q 85 -2 93 4 Q 87 14 83 20 Z"
            fill="#0F172A"
          />

          {/* Eye spot patch */}
          <ellipse cx="26" cy="38" rx="6" ry="3.5" fill="#FFFFFF" transform="rotate(-30 26 38)" />

          {/* Subtle water splash dot */}
          <circle cx="88" cy="2" r="2.5" fill="#38BDF8" />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className={`font-black tracking-tight ${text} text-slate-900 dark:text-white flex items-center`}>
            Orca<span className="text-cyan-500 dark:text-cyan-400 ml-0.5">JP</span>
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
