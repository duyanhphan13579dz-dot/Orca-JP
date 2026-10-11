import React, { useState, useEffect, useRef } from 'react';
import { HIRAGANA_DATA, KATAKANA_DATA } from '../../data/kanaData';
import { useSoundEffects } from '../../hooks/useSoundEffects';
import { OrcaMascot } from '../../assets/mascots/OrcaMascot';
import { Play, RotateCcw, Timer, Trophy, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

export const KanaSpeedGame: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [currentKana, setCurrentKana] = useState(HIRAGANA_DATA[0]);
  const [inputVal, setInputVal] = useState('');
  const [kanaMode, setKanaMode] = useState<'hiragana' | 'katakana' | 'mixed'>('hiragana');

  const inputRef = useRef<HTMLInputElement>(null);
  const { playCorrect, playWrong, playStreakFanfare } = useSoundEffects();

  const pickRandomKana = () => {
    let pool = HIRAGANA_DATA;
    if (kanaMode === 'katakana') pool = KATAKANA_DATA;
    if (kanaMode === 'mixed') pool = [...HIRAGANA_DATA, ...KATAKANA_DATA];
    const rand = pool[Math.floor(Math.random() * pool.length)];
    setCurrentKana(rand);
  };

  const startGame = () => {
    setIsPlaying(true);
    setTimeLeft(45);
    setScore(0);
    setStreak(0);
    setInputVal('');
    pickRandomKana();
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const endGame = () => {
    setIsPlaying(false);
    if (score > bestScore) {
      setBestScore(score);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      playStreakFanfare();
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.trim().toLowerCase();
    setInputVal(val);

    if (val === currentKana.romaji.toLowerCase()) {
      playCorrect();
      setScore(s => s + 10 + streak * 2);
      const newStreak = streak + 1;
      setStreak(newStreak);

      if (newStreak % 5 === 0) {
        playStreakFanfare();
        confetti({ particleCount: 35, spread: 50, origin: { y: 0.5 } });
      }

      setInputVal('');
      pickRandomKana();
    } else if (val.length >= currentKana.romaji.length && val !== currentKana.romaji.toLowerCase()) {
      playWrong();
      setStreak(0);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl mx-auto shadow-xl">
      {/* Header Bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center font-bold">
            <Zap className="w-5 h-5 text-cyan-500" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Thử thách Phản xạ Kana</h3>
            <p className="text-xs text-slate-500">Gõ Romaji nhanh nhất có thể trước khi hết giờ</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl text-xs font-bold">
          <Trophy className="w-3.5 h-3.5" />
          Kỷ lục: {bestScore}
        </div>
      </div>

      {!isPlaying ? (
        <div className="text-center py-8 space-y-5">
          <OrcaMascot mood="idle" size={130} showSpeechBubble speechText="Sẵn sàng thử tài phản xạ gõ Romaji chưa?" />

          {/* Mode switch */}
          <div className="flex justify-center gap-2">
            {[
              { id: 'hiragana', label: 'Hiragana' },
              { id: 'katakana', label: 'Katakana' },
              { id: 'mixed', label: 'Hỗn hợp' },
            ].map(m => (
              <button
                key={m.id}
                onClick={() => setKanaMode(m.id as typeof kanaMode)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                  kanaMode === m.id
                    ? 'bg-cyan-500 text-white border-cyan-500 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div>
            <button
              onClick={startGame}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-cyan-500/25 transition flex items-center gap-2 mx-auto cursor-pointer"
            >
              <Play className="w-5 h-5" />
              Bắt đầu ngay (45s)
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stats HUD */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-rose-500 font-bold text-sm">
              <Timer className="w-4 h-4" />
              <span>{timeLeft}s</span>
            </div>

            <div className="text-center">
              <span className="text-[10px] text-slate-400 block uppercase">Điểm số</span>
              <span className="text-xl font-black text-cyan-600 dark:text-cyan-400">{score}</span>
            </div>

            <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
              <Zap className="w-4 h-4 fill-amber-500" />
              <span>Streak: {streak}x</span>
            </div>
          </div>

          {/* Big Kana Card */}
          <div className="relative py-8 bg-gradient-to-b from-slate-50 to-white dark:from-slate-800/40 dark:to-slate-900 rounded-3xl border border-cyan-500/20 flex flex-col items-center justify-center shadow-inner">
            <div className="font-jp text-8xl font-black text-slate-900 dark:text-white drop-shadow-sm select-none">
              {currentKana.char}
            </div>

            {/* Mascot cheering */}
            <div className="absolute right-4 bottom-2 opacity-80">
              <OrcaMascot mood={streak >= 5 ? 'celebration' : 'studying'} size={70} />
            </div>
          </div>

          {/* Typing input */}
          <div className="space-y-2">
            <input
              ref={inputRef}
              type="text"
              autoFocus
              value={inputVal}
              onChange={handleInputChange}
              placeholder="Gõ Romaji vào đây..."
              className="w-full text-center py-3.5 text-2xl font-bold tracking-widest bg-white dark:bg-slate-800 border-2 border-cyan-500 rounded-2xl focus:outline-none focus:ring-4 focus:ring-cyan-500/20 text-slate-900 dark:text-white uppercase"
            />
            <div className="flex justify-between items-center text-xs text-slate-400 px-2">
              <span>Gõ đúng sẽ tự động nhảy chữ tiếp theo</span>
              <button
                onClick={endGame}
                className="text-rose-500 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Dừng chơi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
