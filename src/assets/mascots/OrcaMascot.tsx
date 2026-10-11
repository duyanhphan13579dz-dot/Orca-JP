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
  return (
    <div className={`relative inline-flex flex-col items-center ${className}`}>
      {showSpeechBubble && (
        <div className="mb-2 px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-800 dark:text-cyan-200 text-xs font-medium rounded-2xl shadow-md border border-cyan-200 dark:border-cyan-800 animate-bounce relative max-w-xs text-center z-10">
          {speechText}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white dark:bg-slate-800 border-b border-r border-cyan-200 dark:border-cyan-800 rotate-45" />
        </div>
      )}

      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-300 hover:scale-105 select-none"
      >
        <defs>
          <linearGradient id="orcaSkin" x1="20" y1="20" x2="180" y2="180" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0F172A" />
            <stop offset="60%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>

          <linearGradient id="orcaBelly" x1="60" y1="100" x2="140" y2="160" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>

          <radialGradient id="sunGlow" cx="100" cy="100" r="80" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#EF4444" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
          </radialGradient>

          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Deep sea water wave ring / ambient */}
        <circle cx="100" cy="100" r="92" stroke="#06B6D4" strokeWidth="2" strokeDasharray="6 6" opacity="0.35" className="animate-spin" style={{ animationDuration: '30s' }} />

        {/* Ambient blowhole spray */}
        <g className="animate-mist">
          <ellipse cx="95" cy="22" rx="4" ry="7" fill="#38BDF8" opacity="0.75" />
          <ellipse cx="105" cy="18" rx="3" ry="5" fill="#38BDF8" opacity="0.6" />
          <circle cx="90" cy="14" r="2.5" fill="#bae6fd" opacity="0.8" />
        </g>

        {/* Orca Main Body */}
        <path
          d="M 50 130 C 35 110 38 70 70 45 C 110 15 155 35 165 75 C 172 105 160 145 130 158 C 95 172 65 150 50 130 Z"
          fill="url(#orcaSkin)"
          stroke="#0284C7"
          strokeWidth="2.5"
        />

        {/* Dorsal Fin */}
        <path
          d="M 125 40 Q 140 5 155 15 Q 145 35 140 45 Z"
          fill="#0F172A"
          stroke="#0284C7"
          strokeWidth="1.5"
        />

        {/* Tail Flukes */}
        <path
          d="M 45 135 C 30 150 10 140 18 162 C 28 152 40 148 52 145 C 48 155 42 172 58 170 C 60 155 55 142 45 135 Z"
          fill="url(#orcaSkin)"
          stroke="#0284C7"
          strokeWidth="1.5"
        />

        {/* Flipper / Pectoral Fin */}
        <path
          d="M 105 135 C 120 150 135 155 140 145 C 130 135 120 128 110 125 Z"
          fill="#1E293B"
          stroke="#0284C7"
          strokeWidth="1.5"
          className={mood === 'idle' ? 'origin-[105px_125px] animate-pulse' : ''}
        />

        {/* Orca Belly (White patch) */}
        <path
          d="M 75 125 C 85 100 115 105 140 135 C 130 155 105 160 85 150 C 78 140 73 132 75 125 Z"
          fill="url(#orcaBelly)"
        />

        {/* Orca Eye Patch (Signature White Oval) */}
        <ellipse cx="145" cy="72" rx="14" ry="8" fill="#FFFFFF" transform="rotate(-15 145 72)" />

        {/* Eye */}
        <circle cx="143" cy="73" r="3.5" fill="#0F172A" />
        <circle cx="144.5" cy="71.5" r="1.2" fill="#FFFFFF" />

        {/* Mouth with cute smile */}
        <path
          d="M 160 90 Q 152 98 142 94"
          stroke="#0F172A"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Blush cheek */}
        <ellipse cx="152" cy="85" rx="5" ry="3" fill="#FDA4AF" opacity="0.75" />

        {/* ============= MOOD ADAPTIVE ACCESSORIES ============= */}

        {/* 1. STUDYING (N5 / N4): Japanese Hachimaki headband & Kanji Brush */}
        {mood === 'studying' && (
          <g>
            {/* Red Headband (Hachimaki) with gold sun */}
            <path
              d="M 115 52 Q 145 56 168 68"
              stroke="#EF4444"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <circle cx="140" cy="58" r="4.5" fill="#FEF08A" />
            <text x="140" y="60.5" fontSize="5" fontWeight="bold" textAnchor="middle" fill="#DC2626">必</text>
            {/* Cute glasses */}
            <circle cx="144" cy="72" r="9" stroke="#F59E0B" strokeWidth="2" fill="none" />
            <path d="M 135 72 L 130 70" stroke="#F59E0B" strokeWidth="2" />
            {/* Writing brush */}
            <g transform="translate(130, 115) rotate(35)">
              <rect x="0" y="0" width="4" height="25" rx="2" fill="#78350F" />
              <path d="M 0 25 Q 2 32 4 25 Z" fill="#1E293B" />
            </g>
          </g>
        )}

        {/* 2. DEEP DIVE (N3 Dokkai): Diving Goggles & Underwater Bubble Stream */}
        {mood === 'deepdive' && (
          <g>
            {/* Diving Goggles */}
            <rect x="130" y="60" width="28" height="22" rx="7" fill="#06B6D4" fillOpacity="0.35" stroke="#0891B2" strokeWidth="2.5" />
            <path d="M 125 71 L 130 71" stroke="#0891B2" strokeWidth="3" />
            <line x1="134" y1="64" x2="142" y2="78" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
            {/* Snorkel tube */}
            <path
              d="M 152 75 Q 165 85 168 60 L 168 35 Q 168 25 178 25"
              fill="none"
              stroke="#F97316"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Extra Bubbles */}
            <circle cx="178" cy="20" r="3" fill="#67E8F9" opacity="0.8" />
            <circle cx="182" cy="12" r="4" fill="#A5F3FC" opacity="0.9" />
          </g>
        )}

        {/* 3. CELEBRATION (Streak / Mastery): Golden Crown & Confetti */}
        {mood === 'celebration' && (
          <g>
            {/* Golden Crown */}
            <path
              d="M 122 36 L 126 20 L 135 28 L 145 18 L 154 28 L 162 20 L 166 36 Z"
              fill="#FBBF24"
              stroke="#D97706"
              strokeWidth="1.5"
            />
            <circle cx="126" cy="19" r="2" fill="#EF4444" />
            <circle cx="145" cy="17" r="2.5" fill="#06B6D4" />
            <circle cx="162" cy="19" r="2" fill="#8B5CF6" />
            {/* Starry spark in eye */}
            <path
              d="M 143 70 L 144 72 L 146 73 L 144 74 L 143 76 L 142 74 L 140 73 L 142 72 Z"
              fill="#FDE047"
            />
            {/* Confetti stars */}
            <circle cx="85" cy="35" r="3" fill="#F43F5E" />
            <circle cx="175" cy="45" r="3" fill="#10B981" />
            <circle cx="70" cy="80" r="2.5" fill="#3B82F6" />
          </g>
        )}
      </svg>
    </div>
  );
};
