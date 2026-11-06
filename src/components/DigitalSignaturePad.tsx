import React, { useRef, useState, useEffect } from 'react';
import { PenTool, RotateCcw, Check, CheckCircle2 } from 'lucide-react';

interface DigitalSignaturePadProps {
  label: string;
  signeeName: string;
  signeeRole: string;
  value?: string; // Data URL if already signed
  onChange: (dataUrl: string) => void;
  readOnly?: boolean;
}

export const DigitalSignaturePad: React.FC<DigitalSignaturePadProps> = ({
  label,
  signeeName,
  signeeRole,
  value,
  onChange,
  readOnly = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [isEditing, setIsEditing] = useState(!value);

  useEffect(() => {
    if (value && canvasRef.current && isEditing) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          setHasDrawn(true);
        };
        img.src = value;
      }
    }
  }, [value, isEditing]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (readOnly) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#0f172a'; // Dark slate for clean ink look
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || readOnly) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      onChange(dataUrl);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setHasDrawn(false);
    onChange('');
  };

  const handleConfirm = () => {
    if (canvasRef.current && hasDrawn) {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      onChange(dataUrl);
      setIsEditing(false);
    }
  };

  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 p-4 space-y-3 shadow-xs">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
            {label}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            {signeeName} <span className="opacity-70">({signeeRole})</span>
          </div>
        </div>

        {value && !isEditing ? (
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-md">
            <CheckCircle2 className="w-3.5 h-3.5" /> Assinado
          </div>
        ) : (
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <PenTool className="w-3.5 h-3.5" /> Assine no quadro
          </div>
        )}
      </div>

      {value && !isEditing ? (
        <div className="space-y-2">
          <div className="h-32 w-full rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center p-2">
            <img src={value} alt={`Assinatura ${signeeName}`} className="max-h-full object-contain filter dark:invert" />
          </div>
          {!readOnly && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="text-xs text-sky-600 dark:text-sky-400 hover:underline font-medium"
              >
                Refazer assinatura
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50/70 dark:bg-slate-950/60 overflow-hidden touch-none">
            <canvas
              ref={canvasRef}
              width={380}
              height={120}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-32 block cursor-crosshair"
            />
            {!hasDrawn && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-xs text-slate-400 font-medium select-none">
                Desenhe ou assine com o dedo ou mouse aqui
              </div>
            )}
            <div className="absolute bottom-2 left-4 right-4 pointer-events-none border-b border-slate-300 dark:border-slate-700"></div>
          </div>

          {!readOnly && (
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={clearCanvas}
                disabled={!hasDrawn}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 disabled:opacity-40"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Limpar
              </button>

              <button
                type="button"
                onClick={handleConfirm}
                disabled={!hasDrawn}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white text-xs font-semibold rounded-md shadow-xs disabled:opacity-40"
              >
                <Check className="w-3.5 h-3.5" /> Confirmar Assinatura
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
