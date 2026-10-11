import React from 'react';
import { JLPTLevel } from '../../types';

interface LevelBadgeProps {
  level: JLPTLevel;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LevelBadge: React.FC<LevelBadgeProps> = ({
  level,
  size = 'md',
  className = '',
}) => {
  const levelStyles = {
    Zero: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    N5: 'bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/30',
    N4: 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30',
    N3: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
  };

  const sizeStyles = {
    sm: 'text-[10px] px-1.5 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3.5 py-1.5 font-bold',
  };

  const labels = {
    Zero: 'Zero',
    N5: 'N5 Nhập môn',
    N4: 'N4 Sơ cấp',
    N3: 'N3 Trung cấp',
  };

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border ${levelStyles[level]} ${sizeStyles[size]} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current animate-pulse" />
      {labels[level]}
    </span>
  );
};
