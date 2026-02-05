'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import SignaturePadLib from 'signature_pad';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SignaturePadProps {
  value?: string;
  onChange: (dataUrl: string | null) => void;
  width?: number;
  height?: number;
  className?: string;
  disabled?: boolean;
  label?: string;
  declaration?: string;
  required?: boolean;
  error?: string;
}

export function SignaturePad({
  value,
  onChange,
  width = 500,
  height = 200,
  className,
  disabled = false,
  label = 'Signature',
  declaration,
  required = false,
  error,
}: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const signaturePadRef = useRef<SignaturePadLib | null>(null);
  const [isEmpty, setIsEmpty] = useState(true);

  // Initialize SignaturePad
  useEffect(() => {
    if (canvasRef.current && !disabled) {
      signaturePadRef.current = new SignaturePadLib(canvasRef.current, {
        backgroundColor: 'rgb(255, 255, 255)',
        penColor: 'rgb(0, 0, 0)',
      });

      signaturePadRef.current.addEventListener('endStroke', () => {
        setIsEmpty(signaturePadRef.current?.isEmpty() ?? true);
        const dataUrl = signaturePadRef.current?.toDataURL('image/png');
        if (dataUrl) {
          onChange(dataUrl);
        }
      });

      // Load existing value
      if (value && signaturePadRef.current) {
        signaturePadRef.current.fromDataURL(value);
        setIsEmpty(false);
      }
    }

    return () => {
      if (signaturePadRef.current) {
        signaturePadRef.current.off();
      }
    };
  }, [disabled]);

  // Handle resize
  useEffect(() => {
    const resizeCanvas = () => {
      if (canvasRef.current && signaturePadRef.current) {
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        canvasRef.current.width = canvasRef.current.offsetWidth * ratio;
        canvasRef.current.height = canvasRef.current.offsetHeight * ratio;
        canvasRef.current.getContext('2d')?.scale(ratio, ratio);
        signaturePadRef.current.clear();

        // Reload value after resize
        if (value) {
          signaturePadRef.current.fromDataURL(value);
        }
      }
    };

    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [value]);

  const handleClear = useCallback(() => {
    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
      setIsEmpty(true);
      onChange(null);
    }
  }, [onChange]);

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-900">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {!disabled && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            disabled={isEmpty}
          >
            Clear
          </Button>
        )}
      </div>

      {declaration && (
        <p className="text-sm text-slate-600 italic">{declaration}</p>
      )}

      <div
        className={cn(
          'relative rounded-lg border-2 bg-white',
          error ? 'border-red-500' : 'border-slate-300',
          disabled && 'opacity-50'
        )}
      >
        {disabled && value ? (
          <img
            src={value}
            alt="Signature"
            className="w-full"
            style={{ maxHeight: height }}
          />
        ) : (
          <canvas
            ref={canvasRef}
            className="w-full touch-none"
            style={{
              height: height,
              maxWidth: '100%',
            }}
          />
        )}

        {isEmpty && !disabled && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-slate-400 text-sm">
              Sign here using your finger or mouse
            </p>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <p className="text-xs text-slate-500">
        Your signature will be timestamped and stored securely.
      </p>
    </div>
  );
}
