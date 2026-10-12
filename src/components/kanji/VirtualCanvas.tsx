import React, { useRef, useState, useEffect, useCallback } from 'react';
import { RotateCcw, Play, CheckCircle2, AlertCircle, Eye, EyeOff, Sparkles, Undo2 } from 'lucide-react';
import { useSoundEffects } from '../../hooks/useSoundEffects';

interface VirtualCanvasProps {
  guideChar: string;
  strokesCount?: number;
  className?: string;
}

export const VirtualCanvas: React.FC<VirtualCanvasProps> = ({
  guideChar,
  strokesCount = 4,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeTouchIdRef = useRef<number | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showGhostGuide, setShowGhostGuide] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [activeMode, setActiveMode] = useState<'guided' | 'freehand'>('guided');
  const [userStrokeCount, setUserStrokeCount] = useState(0);
  const [strokeHistory, setStrokeHistory] = useState<ImageData[]>([]);
  const [isAnimatingStroke, setIsAnimatingStroke] = useState(false);

  const { playCorrect } = useSoundEffects();

  const getPos = useCallback((e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / (rect.width || 1);
    const scaleY = canvas.height / (rect.height || 1);

    if ('touches' in e && e.touches.length > 0) {
      let touch = e.touches[0];
      if (activeTouchIdRef.current !== null) {
        for (let i = 0; i < e.touches.length; i++) {
          if (e.touches[i].identifier === activeTouchIdRef.current) {
            touch = e.touches[i];
            break;
          }
        }
      }
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    }
    const mouseEvent = e as MouseEvent | React.MouseEvent;
    return {
      x: (mouseEvent.clientX - rect.left) * scaleX,
      y: (mouseEvent.clientY - rect.top) * scaleY,
    };
  }, []);

  const saveCanvasState = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const currentState = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setStrokeHistory((prev) => [...prev, currentState]);
  }, []);

  const startDrawingInternal = useCallback((e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    saveCanvasState();
    setIsDrawing(true);
    const { x, y } = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(x, y);
  }, [getPos, saveCanvasState]);

  const drawInternal = useCallback((e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getPos(e, canvas);
    ctx.lineTo(x, y);
    ctx.strokeStyle = activeMode === 'guided' ? '#06B6D4' : '#0EA5E9';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  }, [activeMode, getPos]);

  const stopDrawingInternal = useCallback(() => {
    setIsDrawing((wasDrawing) => {
      if (wasDrawing) {
        setUserStrokeCount((prev) => {
          const next = prev + 1;
          if (next === strokesCount) {
            playCorrect();
          }
          return next;
        });
      }
      return false;
    });
  }, [playCorrect, strokesCount]);

  // Native non-passive touch listeners for 100% rock-solid mobile & tablet drawing without scrolling or jitter
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length > 0) {
        activeTouchIdRef.current = e.touches[0].identifier;
      }
      startDrawingInternal(e);
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      drawInternal(e);
    };

    const onTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      activeTouchIdRef.current = null;
      stopDrawingInternal();
    };

    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd, { passive: false });
    canvas.addEventListener('touchcancel', onTouchEnd, { passive: false });

    return () => {
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
      canvas.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [drawInternal, startDrawingInternal, stopDrawingInternal]);

  const startDrawing = (e: React.MouseEvent) => {
    startDrawingInternal(e);
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    drawInternal(e);
  };

  const stopDrawing = () => {
    if (isDrawing) {
      stopDrawingInternal();
    }
  };

  const undoLastStroke = () => {
    const canvas = canvasRef.current;
    if (!canvas || strokeHistory.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const lastState = strokeHistory[strokeHistory.length - 1];
    ctx.putImageData(lastState, 0, 0);
    setStrokeHistory((prev) => prev.slice(0, -1));
    setUserStrokeCount((prev) => Math.max(0, prev - 1));
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setUserStrokeCount(0);
    setStrokeHistory([]);
  };

  // Animate stroke player demonstration
  const handlePlayStrokeDemo = () => {
    setIsAnimatingStroke(true);
    clearCanvas();
    setShowGhostGuide(true);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let progress = 0;
    const interval = setInterval(() => {
      progress += 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = 'bold 150px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = `rgba(6, 182, 212, ${progress / 10})`;
      ctx.fillText(guideChar, canvas.width / 2, canvas.height / 2 + 10);

      if (progress >= 10) {
        clearInterval(interval);
        setIsAnimatingStroke(false);
      }
    }, 60);
  };

  useEffect(() => {
    clearCanvas();
  }, [guideChar]);

  const strokeStatus = userStrokeCount === strokesCount ? 'perfect' : userStrokeCount > strokesCount ? 'overflow' : 'progress';

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Mode Selector & Stroke Counter Header */}
      <div className="w-full max-w-xs sm:max-w-sm flex items-center justify-between mb-3 px-1 text-xs">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              setActiveMode('guided');
              setShowGhostGuide(true);
            }}
            className={`px-2.5 py-1 rounded-xl font-bold transition cursor-pointer ${
              activeMode === 'guided'
                ? 'bg-cyan-500 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800'
            }`}
          >
            Từng nét
          </button>
          <button
            onClick={() => setActiveMode('freehand')}
            className={`px-2.5 py-1 rounded-xl font-bold transition cursor-pointer ${
              activeMode === 'freehand'
                ? 'bg-cyan-500 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800'
            }`}
          >
            Tự do
          </button>
        </div>

        {/* Live Stroke Counter */}
        <div
          className={`flex items-center gap-1 px-2.5 py-1 rounded-xl font-bold border transition ${
            strokeStatus === 'perfect'
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
              : strokeStatus === 'overflow'
              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
          }`}
        >
          {strokeStatus === 'perfect' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
          {strokeStatus === 'overflow' && <AlertCircle className="w-3.5 h-3.5 text-rose-500" />}
          <span>
            {userStrokeCount} / {strokesCount} nét
          </span>
        </div>
      </div>

      {/* Main Genkouyoushi Square Canvas */}
      <div className="relative w-72 h-72 sm:w-80 sm:h-80 max-w-full aspect-square bg-slate-50 dark:bg-slate-950 rounded-3xl border-2 border-cyan-500/40 shadow-inner overflow-hidden select-none touch-none">
        {/* Japanese Genkouyoushi calligraphy grid */}
        {showGrid && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Center crosshair dashed lines */}
            <div className="absolute top-1/2 left-0 w-full h-[1px] border-b border-dashed border-cyan-500/20" />
            <div className="absolute left-1/2 top-0 h-full w-[1px] border-r border-dashed border-cyan-500/20" />
            {/* Diagonal dashed guide lines */}
            <svg className="absolute inset-0 w-full h-full text-cyan-500/10">
              <line x1="0" y1="0" x2="100%" y2="100%" stroke="currentColor" strokeDasharray="3 3" />
              <line x1="100%" y1="0" x2="0" y2="100%" stroke="currentColor" strokeDasharray="3 3" />
            </svg>
            <div className="absolute inset-4 rounded-2xl border border-dashed border-cyan-500/10" />
          </div>
        )}

        {/* Ghost Stroke Guide Kanji */}
        {showGhostGuide && (
          <div className="absolute inset-0 flex items-center justify-center font-jp text-[150px] font-black text-slate-300/30 dark:text-slate-700/40 pointer-events-none select-none transition-opacity duration-300">
            {guideChar}
          </div>
        )}

        {/* Interactive Drawing Canvas */}
        <canvas
          ref={canvasRef}
          width={320}
          height={320}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
        />

        {/* Success celebratory banner when user matches exact stroke count */}
        {strokeStatus === 'perfect' && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-500 text-white text-[11px] font-black shadow-lg shadow-emerald-500/30 flex items-center gap-1 animate-bounce pointer-events-none">
            <Sparkles className="w-3 h-3" />
            Đủ số nét chuẩn!
          </div>
        )}
      </div>

      {/* Control Buttons Bar */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-3 max-w-xs sm:max-w-sm">
        {/* Toggle Ghost Kanji */}
        <button
          onClick={() => setShowGhostGuide((prev) => !prev)}
          title={showGhostGuide ? 'Ẩn nét chữ mẫu' : 'Hiện nét chữ mẫu'}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition cursor-pointer"
        >
          {showGhostGuide ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>

        {/* Play Stroke Animation */}
        <button
          onClick={handlePlayStrokeDemo}
          disabled={isAnimatingStroke}
          title="Xem hoạt họa mẫu nét viết"
          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
        >
          <Play className="w-3.5 h-3.5 fill-cyan-500" />
          Phát mẫu
        </button>

        {/* Undo Stroke */}
        <button
          onClick={undoLastStroke}
          disabled={strokeHistory.length === 0}
          title="Hoàn tác nét vẽ vừa viết"
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition cursor-pointer disabled:opacity-40"
        >
          <Undo2 className="w-4 h-4" />
        </button>

        {/* Clear Canvas */}
        <button
          onClick={clearCanvas}
          title="Xóa toàn bộ để viết lại"
          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-rose-500/10 text-slate-700 dark:text-slate-300 hover:text-rose-500 border border-slate-200 dark:border-slate-700 transition flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Viết lại
        </button>
      </div>
    </div>
  );
};
