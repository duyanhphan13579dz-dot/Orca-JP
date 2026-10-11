import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useSpeech } from '../../hooks/useSpeech';
import { JLPTLevel } from '../../types';

interface AudioButtonProps {
  text: string;
  level?: JLPTLevel;
  customRate?: number;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

export const AudioButton: React.FC<AudioButtonProps> = ({
  text,
  level = 'N5',
  customRate,
  size = 'md',
  label,
  className = '',
}) => {
  const { speak, isPlaying, isSupported } = useSpeech();
  const [active, setActive] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isSupported) return;
    setActive(true);
    speak(text, level, customRate);
    setTimeout(() => setActive(false), 800);
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const buttonPaddings = {
    sm: 'p-1 text-xs',
    md: 'p-1.5 text-xs',
    lg: 'p-2 text-sm',
  };

  if (!isSupported) {
    return (
      <button
        disabled
        title="Web Speech không khả dụng trên trình duyệt này"
        className="opacity-40 cursor-not-allowed text-slate-400 p-1"
      >
        <VolumeX className={iconSizes[size]} />
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      title={`Nghe phát âm (${text})`}
      className={`inline-flex items-center gap-1.5 rounded-full transition-all duration-200 cursor-pointer ${
        buttonPaddings[size]
      } ${
        isPlaying || active
          ? 'bg-cyan-500 text-white ring-4 ring-cyan-400/30 scale-105'
          : 'bg-slate-100 hover:bg-cyan-50 text-slate-700 hover:text-cyan-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 dark:hover:text-cyan-300 border border-slate-200 dark:border-slate-700'
      } ${className}`}
    >
      <Volume2
        className={`${iconSizes[size]} ${isPlaying || active ? 'animate-bounce' : ''}`}
      />
      {label && <span className="font-medium pr-1">{label}</span>}
    </button>
  );
};
