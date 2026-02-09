'use client';

// PLG UK Hub - Facial Mapping Canvas Overlay Tool
// Practitioners mark injection points on "Before" photos.
// Coordinates saved as JSON for longitudinal tracking.

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Plus,
  Minus,
  Undo2,
  Trash2,
  Save,
  X,
  MapPin,
  Crosshair,
  ZoomIn,
  Download,
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

export interface InjectionPoint {
  id: string;
  x: number; // Percentage 0-100 of image width
  y: number; // Percentage 0-100 of image height
  label: string;
  product?: string;
  units?: string;
  depth?: string;
  notes?: string;
  color?: string;
}

export interface FacialMappingData {
  imageId: string;
  points: InjectionPoint[];
  createdAt: string;
  updatedAt: string;
}

// Color presets for different products/areas
const POINT_COLORS = [
  { value: '#ef4444', label: 'Red' },
  { value: '#f97316', label: 'Orange' },
  { value: '#eab308', label: 'Yellow' },
  { value: '#22c55e', label: 'Green' },
  { value: '#3b82f6', label: 'Blue' },
  { value: '#8b5cf6', label: 'Purple' },
  { value: '#ec4899', label: 'Pink' },
];

// Default product list for quick selection
const DEFAULT_PRODUCTS = [
  'Botox (Allergan)',
  'Azzalure',
  'Bocouture',
  'Juvederm Voluma',
  'Juvederm Volbella',
  'Juvederm Volift',
  'Restylane',
  'Belotero',
  'Profhilo',
];

// ============================================
// COMPONENT
// ============================================

interface FacialMappingCanvasProps {
  imageUrl: string; // Base64 or URL of the "before" photo
  initialPoints?: InjectionPoint[];
  onSave: (data: FacialMappingData) => void;
  onClose: () => void;
  readOnly?: boolean;
}

export function FacialMappingCanvas({
  imageUrl,
  initialPoints = [],
  onSave,
  onClose,
  readOnly = false,
}: FacialMappingCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [points, setPoints] = useState<InjectionPoint[]>(initialPoints);
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);
  const [isPlacing, setIsPlacing] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);
  const [undoStack, setUndoStack] = useState<InjectionPoint[][]>([]);
  const [zoom, setZoom] = useState(1);

  // New point defaults
  const [newPointColor, setNewPointColor] = useState(POINT_COLORS[0].value);
  const [newPointProduct, setNewPointProduct] = useState('');

  // Load image
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageElement(img);
      setImageLoaded(true);
    };
    img.src = imageUrl;
  }, [imageUrl]);

  // Draw canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !imageElement) return;

    const container = containerRef.current;
    if (!container) return;

    const containerWidth = container.clientWidth;
    const aspectRatio = imageElement.height / imageElement.width;
    const displayWidth = containerWidth;
    const displayHeight = containerWidth * aspectRatio;

    canvas.width = displayWidth * zoom;
    canvas.height = displayHeight * zoom;
    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;

    ctx.scale(zoom, zoom);

    // Draw image
    ctx.drawImage(imageElement, 0, 0, displayWidth, displayHeight);

    // Draw points
    for (const point of points) {
      const px = (point.x / 100) * displayWidth;
      const py = (point.y / 100) * displayHeight;
      const color = point.color || '#ef4444';
      const isSelected = point.id === selectedPointId;

      // Outer ring
      ctx.beginPath();
      ctx.arc(px, py, isSelected ? 14 : 10, 0, Math.PI * 2);
      ctx.fillStyle = `${color}40`;
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = isSelected ? 3 : 2;
      ctx.stroke();

      // Inner dot
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      // Crosshair
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(px - 6, py);
      ctx.lineTo(px + 6, py);
      ctx.moveTo(px, py - 6);
      ctx.lineTo(px, py + 6);
      ctx.stroke();

      // Label
      if (point.label) {
        ctx.font = 'bold 11px Arial';
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        const textWidth = ctx.measureText(point.label).width;
        const labelX = px - textWidth / 2;
        const labelY = py - 16;

        // Background
        ctx.fillStyle = `${color}cc`;
        ctx.beginPath();
        ctx.roundRect(labelX - 4, labelY - 10, textWidth + 8, 16, 3);
        ctx.fill();

        // Text
        ctx.fillStyle = '#ffffff';
        ctx.fillText(point.label, labelX, labelY);
      }

      // Units badge
      if (point.units) {
        ctx.font = '10px Arial';
        const unitsText = `${point.units}u`;
        const unitsWidth = ctx.measureText(unitsText).width;
        ctx.fillStyle = '#000000cc';
        ctx.beginPath();
        ctx.roundRect(px + 10, py - 6, unitsWidth + 6, 14, 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.fillText(unitsText, px + 13, py + 4);
      }
    }

    // Placing mode cursor hint
    if (isPlacing) {
      ctx.strokeStyle = newPointColor;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(0, 0, displayWidth, displayHeight);
      ctx.setLineDash([]);
    }
  }, [imageElement, points, selectedPointId, isPlacing, zoom, newPointColor]);

  useEffect(() => {
    if (imageLoaded) drawCanvas();
  }, [imageLoaded, drawCanvas]);

  // Handle canvas click to place point
  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (readOnly || !canvasRef.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      if (isPlacing) {
        // Save undo state
        setUndoStack((prev) => [...prev, [...points]]);

        const newPoint: InjectionPoint = {
          id: `pt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          x,
          y,
          label: `Point ${points.length + 1}`,
          product: newPointProduct,
          units: '',
          depth: '',
          notes: '',
          color: newPointColor,
        };

        setPoints((prev) => [...prev, newPoint]);
        setSelectedPointId(newPoint.id);
        setIsPlacing(false);
      } else {
        // Check if clicking on an existing point
        const clickedPoint = points.find((p) => {
          const dx = Math.abs(p.x - x);
          const dy = Math.abs(p.y - y);
          return dx < 3 && dy < 3;
        });

        setSelectedPointId(clickedPoint?.id ?? null);
      }
    },
    [isPlacing, points, newPointColor, newPointProduct, readOnly]
  );

  // Update a point's properties
  const updatePoint = useCallback(
    (id: string, updates: Partial<InjectionPoint>) => {
      setPoints((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    },
    []
  );

  // Delete selected point
  const deleteSelectedPoint = useCallback(() => {
    if (!selectedPointId) return;
    setUndoStack((prev) => [...prev, [...points]]);
    setPoints((prev) => prev.filter((p) => p.id !== selectedPointId));
    setSelectedPointId(null);
  }, [selectedPointId, points]);

  // Undo last action
  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return;
    const previousState = undoStack[undoStack.length - 1];
    setPoints(previousState);
    setUndoStack((prev) => prev.slice(0, -1));
    setSelectedPointId(null);
  }, [undoStack]);

  // Save
  const handleSave = useCallback(() => {
    onSave({
      imageId: imageUrl.slice(0, 50), // Truncated ref
      points,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }, [points, imageUrl, onSave]);

  // Export as image with overlay
  const handleExport = useCallback(() => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `facial-mapping-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  }, []);

  const selectedPoint = points.find((p) => p.id === selectedPointId);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="text-lg font-bold text-gray-900">Facial Mapping Tool</h2>
              <p className="text-sm text-gray-500">Mark injection points for longitudinal tracking</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">{points.length} point{points.length !== 1 ? 's' : ''}</span>
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Canvas Area */}
          <div className="flex-1 overflow-auto p-4 bg-gray-100" ref={containerRef}>
            {imageLoaded ? (
              <div className="relative inline-block">
                <canvas
                  ref={canvasRef}
                  onClick={handleCanvasClick}
                  className={cn(
                    'border-2 rounded-lg shadow-lg',
                    isPlacing ? 'cursor-crosshair border-blue-400' : 'cursor-pointer border-gray-300'
                  )}
                />
                {isPlacing && (
                  <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-3 py-1.5 rounded-full font-medium animate-pulse">
                    Click to place injection point
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-400">
                Loading image...
              </div>
            )}
          </div>

          {/* Side Panel */}
          <div className="w-80 border-l bg-white overflow-y-auto">
            {/* Toolbar */}
            {!readOnly && (
              <div className="p-4 border-b space-y-3">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={isPlacing ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setIsPlacing(!isPlacing)}
                    className="flex-1 gap-1"
                  >
                    <Crosshair className="w-4 h-4" />
                    {isPlacing ? 'Cancel' : 'Add Point'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleUndo}
                    disabled={undoStack.length === 0}
                    title="Undo"
                  >
                    <Undo2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* Color & Product Presets */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Point Colour</label>
                  <div className="flex gap-1.5">
                    {POINT_COLORS.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setNewPointColor(c.value)}
                        className={cn(
                          'w-6 h-6 rounded-full border-2 transition-all',
                          newPointColor === c.value ? 'border-gray-900 scale-110' : 'border-transparent'
                        )}
                        style={{ backgroundColor: c.value }}
                        title={c.label}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Quick Product</label>
                  <select
                    className="w-full h-8 px-2 text-xs border rounded bg-white"
                    value={newPointProduct}
                    onChange={(e) => setNewPointProduct(e.target.value)}
                  >
                    <option value="">Select product...</option>
                    {DEFAULT_PRODUCTS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Selected Point Editor */}
            {selectedPoint && (
              <div className="p-4 border-b space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-900">Point Details</h3>
                  {!readOnly && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={deleteSelectedPoint}
                      className="text-red-500 hover:text-red-700 h-7"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-0.5">Label</label>
                    <Input
                      value={selectedPoint.label}
                      onChange={(e) => updatePoint(selectedPoint.id, { label: e.target.value })}
                      className="h-8 text-sm"
                      disabled={readOnly}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-0.5">Product</label>
                    <select
                      className="w-full h-8 px-2 text-xs border rounded bg-white"
                      value={selectedPoint.product || ''}
                      onChange={(e) => updatePoint(selectedPoint.id, { product: e.target.value })}
                      disabled={readOnly}
                    >
                      <option value="">Select...</option>
                      {DEFAULT_PRODUCTS.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-0.5">Units</label>
                      <Input
                        value={selectedPoint.units || ''}
                        onChange={(e) => updatePoint(selectedPoint.id, { units: e.target.value })}
                        className="h-8 text-sm"
                        placeholder="e.g., 4"
                        disabled={readOnly}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-0.5">Depth</label>
                      <Input
                        value={selectedPoint.depth || ''}
                        onChange={(e) => updatePoint(selectedPoint.id, { depth: e.target.value })}
                        className="h-8 text-sm"
                        placeholder="e.g., 3mm"
                        disabled={readOnly}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-0.5">Notes</label>
                    <textarea
                      className="w-full min-h-[50px] px-2 py-1 text-xs border rounded"
                      value={selectedPoint.notes || ''}
                      onChange={(e) => updatePoint(selectedPoint.id, { notes: e.target.value })}
                      disabled={readOnly}
                    />
                  </div>
                  <div className="text-xs text-gray-400">
                    Position: ({selectedPoint.x.toFixed(1)}%, {selectedPoint.y.toFixed(1)}%)
                  </div>
                </div>
              </div>
            )}

            {/* Points List */}
            <div className="p-4">
              <h3 className="text-sm font-bold text-gray-900 mb-2">All Points ({points.length})</h3>
              {points.length === 0 ? (
                <p className="text-xs text-gray-400">No injection points marked yet.</p>
              ) : (
                <div className="space-y-1.5">
                  {points.map((point) => (
                    <button
                      key={point.id}
                      type="button"
                      onClick={() => setSelectedPointId(point.id)}
                      className={cn(
                        'w-full flex items-center gap-2 px-2 py-1.5 rounded text-left text-xs transition-colors',
                        selectedPointId === point.id
                          ? 'bg-blue-50 border border-blue-200'
                          : 'hover:bg-gray-50 border border-transparent'
                      )}
                    >
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: point.color || '#ef4444' }} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{point.label}</p>
                        {point.product && <p className="text-gray-400 truncate">{point.product} {point.units ? `(${point.units}u)` : ''}</p>}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t bg-gray-50">
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={handleExport} className="gap-1">
              <Download className="w-4 h-4" />
              Export Image
            </Button>
            <div className="flex items-center gap-1 border rounded-md">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
                className="h-8 w-8 p-0"
              >
                <Minus className="w-3 h-3" />
              </Button>
              <span className="text-xs font-medium w-12 text-center">{Math.round(zoom * 100)}%</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
                className="h-8 w-8 p-0"
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            {!readOnly && (
              <Button type="button" onClick={handleSave} className="gap-1">
                <Save className="w-4 h-4" />
                Save Mapping
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
