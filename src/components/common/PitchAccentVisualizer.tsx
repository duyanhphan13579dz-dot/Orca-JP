import React, { useCallback } from 'react';
import { Volume2 } from 'lucide-react';

export type PitchPattern = 'heiban' | 'atamadaka' | 'nakadaka' | 'odaka';

export interface PitchAccentData {
  pattern: PitchPattern;
  patternName?: string;
  pitchNumber: number;
  morae: number[]; // 0 for Low, 1 for High
}

interface PitchAccentVisualizerProps {
  word: string;
  reading?: string;
  pitchData?: PitchAccentData;
  size?: 'sm' | 'md' | 'lg';
  showAudioSynth?: boolean;
  className?: string;
}

// Automatic pitch pattern heuristic if not explicitly provided
export function inferPitchAccent(word: string, reading?: string): PitchAccentData {
  const text = reading || word;
  const count = Math.max(1, text.length);

  // Default heuristic for common patterns: Heiban or Atamadaka
  if (count <= 2) {
    return {
      pattern: 'atamadaka',
      patternName: 'Atamadaka (Cao đầu)',
      pitchNumber: 1,
      morae: [1, ...Array(count - 1).fill(0)],
    };
  }

  // Heiban pattern: Low then High throughout
  return {
    pattern: 'heiban',
    patternName: 'Heiban (Bằng phẳng)',
    pitchNumber: 0,
    morae: [0, ...Array(count - 1).fill(1)],
  };
}

export const PitchAccentVisualizer: React.FC<PitchAccentVisualizerProps> = ({
  word,
  reading,
  pitchData,
  size = 'md',
  showAudioSynth = true,
  className = '',
}) => {
  const data = pitchData || inferPitchAccent(word, reading);
  const text = reading || word;
  const chars = Array.from(text);
  const morae = data.morae.length >= chars.length ? data.morae : Array(chars.length).fill(0).map((_, i) => (i === 0 ? 0 : 1));

  // Synthesize pitch tones using Web Audio API
  const playPitchTone = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      const startTime = ctx.currentTime + 0.05;
      const moraDuration = 0.18; // 180ms per mora

      morae.forEach((pitchLevel, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Low pitch: 220Hz (A3), High pitch: 330Hz (E4)
        const freq = pitchLevel === 1 ? 329.63 : 220.0;
        osc.frequency.setValueAtTime(freq, startTime + index * moraDuration);
        osc.type = 'sine';

        // Envelope
        const t0 = startTime + index * moraDuration;
        gain.gain.setValueAtTime(0.001, t0);
        gain.gain.exponentialRampToValueAtTime(0.2, t0 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, t0 + moraDuration - 0.02);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t0);
        osc.stop(t0 + moraDuration);
      });
    } catch {
      // Audio context may be restricted before user gesture
    }
  }, [morae]);

  // Color theme according to NHK Japanese Pitch Accent standard
  const theme = {
    heiban: {
      badge: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
      dotHigh: '#F43F5E',
      line: '#FB7185',
      name: '🔴 Heiban (Bằng phẳng - 0)',
    },
    atamadaka: {
      badge: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30',
      dotHigh: '#0284C7',
      line: '#38BDF8',
      name: '🔵 Atamadaka (Cao đầu - 1)',
    },
    nakadaka: {
      badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      dotHigh: '#059669',
      line: '#34D399',
      name: '🟢 Nakadaka (Cao giữa)',
    },
    odaka: {
      badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
      dotHigh: '#D97706',
      line: '#FBBF24',
      name: '🟡 Odaka (Cao cuối)',
    },
  }[data.pattern];

  const dotSize = size === 'sm' ? 6 : size === 'lg' ? 10 : 8;
  const stepWidth = size === 'sm' ? 24 : size === 'lg' ? 36 : 28;
  const svgHeight = size === 'sm' ? 32 : size === 'lg' ? 48 : 38;
  const highY = size === 'sm' ? 8 : size === 'lg' ? 12 : 10;
  const lowY = size === 'sm' ? 24 : size === 'lg' ? 36 : 28;

  const points = morae.map((level, idx) => ({
    x: idx * stepWidth + stepWidth / 2,
    y: level === 1 ? highY : lowY,
    level,
    char: chars[idx] || '',
  }));

  const pathD = points
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  return (
    <div className={`inline-flex flex-col items-center gap-1.5 ${className}`}>
      {/* Pattern Badge & Audio Pitch Button */}
      <div className="flex items-center gap-1.5">
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${theme.badge}`}>
          {theme.name}
        </span>

        {showAudioSynth && (
          <button
            type="button"
            onClick={playPitchTone}
            title="Nghe cao độ giai điệu Pitch Accent"
            className="p-1 rounded-lg bg-slate-100 hover:bg-cyan-500/20 text-slate-500 hover:text-cyan-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-cyan-400 transition cursor-pointer"
          >
            <Volume2 className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* SVG Pitch Curve with mora syllables */}
      <div className="relative">
        <svg
          width={points.length * stepWidth}
          height={svgHeight}
          className="overflow-visible select-none"
        >
          {/* Reference High / Low dashed guide lines */}
          <line
            x1={0}
            y1={highY}
            x2={points.length * stepWidth}
            y2={highY}
            stroke="currentColor"
            strokeDasharray="2 2"
            className="text-slate-200 dark:text-slate-800"
          />
          <line
            x1={0}
            y1={lowY}
            x2={points.length * stepWidth}
            y2={lowY}
            stroke="currentColor"
            strokeDasharray="2 2"
            className="text-slate-200 dark:text-slate-800"
          />

          {/* Contour Line connecting morae */}
          <path
            d={pathD}
            fill="none"
            stroke={theme.line}
            strokeWidth={size === 'sm' ? 2 : 2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Mora Nodes */}
          {points.map((p, idx) => (
            <g key={idx}>
              <circle
                cx={p.x}
                cy={p.y}
                r={dotSize / 2}
                fill={p.level === 1 ? theme.dotHigh : '#94A3B8'}
                stroke="#ffffff"
                strokeWidth={1.5}
                className="drop-shadow-xs"
              />
              <text
                x={p.x}
                y={svgHeight}
                textAnchor="middle"
                className="font-jp text-[11px] font-bold fill-slate-700 dark:fill-slate-300"
              >
                {p.char}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};
