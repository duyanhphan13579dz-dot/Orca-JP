import React, { useState } from 'react';
import { SentencePart } from '../../types';
import { useSpeech } from '../../hooks/useSpeech';
import { useSoundEffects } from '../../hooks/useSoundEffects';
import { CheckCircle2, RotateCcw, Volume2, Sparkles } from 'lucide-react';

interface SentenceBuilderProps {
  originalParts: SentencePart[];
  targetMeaningVi: string;
}

export const SentenceBuilder: React.FC<SentenceBuilderProps> = ({
  originalParts,
  targetMeaningVi,
}) => {
  // Scramble the parts initially
  const [availableTokens, setAvailableTokens] = useState<SentencePart[]>(() =>
    [...originalParts].sort(() => Math.random() - 0.5)
  );
  const [selectedTokens, setSelectedTokens] = useState<SentencePart[]>([]);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const { speak } = useSpeech();
  const { playCorrect, playWrong } = useSoundEffects();

  const handlePickToken = (token: SentencePart, index: number) => {
    if (isEvaluated) return;
    setSelectedTokens(prev => [...prev, token]);
    setAvailableTokens(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveToken = (token: SentencePart, index: number) => {
    if (isEvaluated) return;
    setAvailableTokens(prev => [...prev, token]);
    setSelectedTokens(prev => prev.filter((_, i) => i !== index));
  };

  const handleCheck = () => {
    const userSentence = selectedTokens.map(t => t.text).join('');
    const targetSentence = originalParts.map(t => t.text).join('');

    const correct = userSentence === targetSentence;
    setIsCorrect(correct);
    setIsEvaluated(true);

    if (correct) {
      playCorrect();
      speak(targetSentence, 'N5');
    } else {
      playWrong();
    }
  };

  const handleReset = () => {
    setAvailableTokens([...originalParts].sort(() => Math.random() - 0.5));
    setSelectedTokens([]);
    setIsEvaluated(false);
    setIsCorrect(false);
  };

  const getRoleColor = (role: SentencePart['role']) => {
    switch (role) {
      case 'subject':
        return 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30';
      case 'particle':
        return 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30';
      case 'object':
      case 'location':
      case 'time':
        return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
      case 'verb':
      default:
        return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
    }
  };

  const getRoleLabel = (role: SentencePart['role']) => {
    switch (role) {
      case 'subject': return 'Chủ đề (S)';
      case 'particle': return 'Trợ từ';
      case 'object': return 'Tân ngữ (O)';
      case 'location': return 'Địa điểm';
      case 'time': return 'Thời gian';
      case 'verb': return 'Vị ngữ (V)';
      default: return '';
    }
  };

  return (
    <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-md">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          Ghép câu cấu trúc SOV
        </span>
        <button
          onClick={handleReset}
          className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Đặt lại
        </button>
      </div>

      <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 mb-4">
        Dịch nghĩa: <span className="text-cyan-600 dark:text-cyan-400">"{targetMeaningVi}"</span>
      </p>

      {/* Assembly Dropzone */}
      <div className="min-h-16 p-3 bg-slate-50 dark:bg-slate-950/70 rounded-2xl border-2 border-dashed border-cyan-500/30 flex flex-wrap items-center gap-2 mb-4">
        {selectedTokens.length === 0 ? (
          <span className="text-xs text-slate-400 italic">
            Nhấp vào các thẻ từ bên dưới theo đúng trật tự SOV (Chủ - Bổ trợ - Vị ngữ)...
          </span>
        ) : (
          selectedTokens.map((token, idx) => (
            <button
              key={idx}
              onClick={() => handleRemoveToken(token, idx)}
              className={`px-3 py-1.5 rounded-xl border font-bold text-xs sm:text-sm flex flex-col items-center shadow-sm transition hover:scale-95 cursor-pointer ${getRoleColor(
                token.role
              )}`}
            >
              <span className="font-jp">{token.text}</span>
              <span className="text-[9px] font-normal opacity-80">{getRoleLabel(token.role)}</span>
            </button>
          ))
        )}
      </div>

      {/* Available Token Pool */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {availableTokens.map((token, idx) => (
          <button
            key={idx}
            onClick={() => handlePickToken(token, idx)}
            className={`px-3 py-1.5 rounded-xl border font-bold text-xs sm:text-sm flex flex-col items-center transition hover:scale-105 cursor-pointer shadow-sm ${getRoleColor(
              token.role
            )}`}
          >
            <span className="font-jp">{token.text}</span>
            <span className="text-[9px] font-normal opacity-80">{getRoleLabel(token.role)}</span>
          </button>
        ))}
      </div>

      {/* Validation Result */}
      {isEvaluated && (
        <div
          className={`p-3 rounded-2xl mb-4 text-xs flex items-center justify-between ${
            isCorrect
              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
              : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>
              {isCorrect
                ? 'Tuyệt vời! Cấu trúc câu SOV hoàn toàn chính xác.'
                : 'Chưa chính xác! Nhớ nguyên tắc: Vị ngữ (Động từ) luôn đứng cuối cùng trong câu tiếng Nhật.'}
            </span>
          </div>
          {isCorrect && (
            <button
              onClick={() => speak(originalParts.map(t => t.text).join(''), 'N5')}
              className="p-1 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 hover:scale-110 transition cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Action check button */}
      <button
        onClick={handleCheck}
        disabled={selectedTokens.length === 0}
        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-40 text-white font-bold text-xs shadow-md shadow-cyan-500/20 transition cursor-pointer"
      >
        Kiểm tra câu
      </button>
    </div>
  );
};
