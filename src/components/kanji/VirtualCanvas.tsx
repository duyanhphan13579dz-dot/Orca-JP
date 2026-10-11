import React, { useRef, useState, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';

interface VirtualCanvasProps {
  guideChar: string;
  className?: string;
}

export const VirtualCanvas: React.FC<VirtualCanvasProps> = ({ guideChar, className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showGuide, setShowGuide] = useState(true);

  const getPos = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const { x, y } = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getPos(e, canvas);
    ctx.lineTo(x, y);
    ctx.strokeStyle = '#06B6D4';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  useEffect(() => {
    clearCanvas();
  }, [guideChar]);

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative w-64 h-64 bg-slate-50 dark:bg-slate-950 rounded-2xl border-2 border-cyan-500/40 shadow-inner overflow-hidden select-none">
        {/* Japanese Genkouyoushi calligraphy grid lines */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-0 w-full h-[1px] border-b border-dashed border-cyan-500/20" />
          <div className="absolute left-1/2 top-0 h-full w-[1px] border-r border-dashed border-cyan-500/20" />
          <div className="absolute inset-4 rounded-xl border border-dashed border-cyan-500/10" />
        </div>

        {/* Faint Background Guide Kanji */}
        {showGuide && (
          <div className="absolute inset-0 flex items-center justify-center font-jp text-[120px] font-bold text-slate-300/40 dark:text-slate-700/50 pointer-events-none select-none">
            {guideChar}
          </div>
        )}

        {/* Drawing canvas */}
        <canvas
          ref={canvasRef}
          width={256}
          height={256}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="absolute inset-0 cursor-crosshair touch-none"
        />
      </div>

      <div className="flex items-center gap-2 mt-3">
        <button
          onClick={() => setShowGuide(prev => !prev)}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition cursor-pointer ${
            showGuide
              ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
          }`}
        >
          {showGuide ? 'Ẩn chữ mẫu' : 'Hiện chữ mẫu'}
        </button>

        <button
          onClick={clearCanvas}
          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-rose-500/10 text-slate-700 dark:text-slate-300 hover:text-rose-500 border border-slate-200 dark:border-slate-700 transition flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Xóa nét vẽ
        </button>
      </div>
    </div>
  );
};
