import React from 'react';

interface ParticleBadgeProps {
  particle: string;
  role: string;
  color?: 'wa' | 'ga' | 'wo' | 'ni' | 'de' | 'to';
  className?: string;
}

export const ParticleBadge: React.FC<ParticleBadgeProps> = ({
  particle,
  role,
  className = '',
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20 ${className}`}
    >
      <span className="font-jp font-black text-sm text-cyan-600 dark:text-cyan-400">{particle}</span>
      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">({role})</span>
    </span>
  );
};
