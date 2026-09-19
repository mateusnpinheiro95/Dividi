import { useEffect, useRef, useState } from 'react';
import { Button } from '../Button';

interface ImageCropperProps {
  imageUrl: string;
  onCropComplete: (croppedFile: File) => void;
  onCancel: () => void;
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Simple image cropper that allows users to select a region of interest.
 * Uses native Canvas API - no external dependencies.
 */
export const ImageCropper = ({
  imageUrl,
  onCropComplete,
  onCancel,
}: ImageCropperProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [crop, setCrop] = useState<CropArea>({ x: 5, y: 15, width: 90, height: 70 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      imageRef.current = img;
      setIsLoading(false);
      drawCanvas();
    };
    img.onerror = () => {
      setIsLoading(false);
    };
    img.src = imageUrl;
  }, [imageUrl]);

  useEffect(() => {
    drawCanvas();
  }, [crop, containerSize]);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({ width: rect.width, height: rect.height });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const container = containerRef.current;
    if (!container) return;

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    // Calculate scale to fit image in container
    const scale = Math.min(
      containerWidth / img.width,
      containerHeight / img.height
    );

    const scaledWidth = img.width * scale;
    const scaledHeight = img.height * scale;

    canvas.width = scaledWidth;
    canvas.height = scaledHeight;

    // Draw image
    ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);

    // Draw overlay (darken areas outside crop)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, scaledWidth, scaledHeight);

    // Clear crop area (show original image)
    const cropX = (crop.x / 100) * scaledWidth;
    const cropY = (crop.y / 100) * scaledHeight;
    const cropWidth = (crop.width / 100) * scaledWidth;
    const cropHeight = (crop.height / 100) * scaledHeight;

    ctx.clearRect(cropX, cropY, cropWidth, cropHeight);
    ctx.drawImage(
      img,
      (cropX / scaledWidth) * img.width,
      (cropY / scaledHeight) * img.height,
      (cropWidth / scaledWidth) * img.width,
      (cropHeight / scaledHeight) * img.height,
      cropX,
      cropY,
      cropWidth,
      cropHeight
    );

    // Draw crop border
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.strokeRect(cropX, cropY, cropWidth, cropHeight);

    // Draw corner handles
    const handleSize = 12;
    ctx.fillStyle = '#3b82f6';
    // Top-left
    ctx.fillRect(cropX - handleSize / 2, cropY - handleSize / 2, handleSize, handleSize);
    // Top-right
    ctx.fillRect(
      cropX + cropWidth - handleSize / 2,
      cropY - handleSize / 2,
      handleSize,
      handleSize
    );
    // Bottom-left
    ctx.fillRect(
      cropX - handleSize / 2,
      cropY + cropHeight - handleSize / 2,
      handleSize,
      handleSize
    );
    // Bottom-right
    ctx.fillRect(
      cropX + cropWidth - handleSize / 2,
      cropY + cropHeight - handleSize / 2,
      handleSize,
      handleSize
    );
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setIsDragging(true);
    setDragStart({ x, y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const deltaX = x - dragStart.x;
    const deltaY = y - dragStart.y;

    setCrop((prev) => {
      const newX = Math.max(0, Math.min(100 - prev.width, prev.x + deltaX));
      const newY = Math.max(0, Math.min(100 - prev.height, prev.y + deltaY));
      return { ...prev, x: newX, y: newY };
    });

    setDragStart({ x, y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas || e.touches.length === 0) return;

    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    const y = ((touch.clientY - rect.top) / rect.height) * 100;

    setIsDragging(true);
    setDragStart({ x, y });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDragging || e.touches.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    const y = ((touch.clientY - rect.top) / rect.height) * 100;

    const deltaX = x - dragStart.x;
    const deltaY = y - dragStart.y;

    setCrop((prev) => {
      const newX = Math.max(0, Math.min(100 - prev.width, prev.x + deltaX));
      const newY = Math.max(0, Math.min(100 - prev.height, prev.y + deltaY));
      return { ...prev, x: newX, y: newY };
    });

    setDragStart({ x, y });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleCrop = async () => {
    const img = imageRef.current;
    if (!img) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Calculate crop coordinates in original image dimensions
    const cropX = (crop.x / 100) * img.width;
    const cropY = (crop.y / 100) * img.height;
    const cropWidth = (crop.width / 100) * img.width;
    const cropHeight = (crop.height / 100) * img.height;

    canvas.width = cropWidth;
    canvas.height = cropHeight;

    // Draw cropped region
    ctx.drawImage(
      img,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      cropWidth,
      cropHeight
    );

    // Convert to blob and then to file
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], 'cropped-receipt.jpg', {
            type: 'image/jpeg',
          });
          onCropComplete(file);
        }
      },
      'image/jpeg',
      0.92
    );
  };

  const adjustCropSize = (delta: number) => {
    setCrop((prev) => {
      const newWidth = Math.max(20, Math.min(100, prev.width + delta));
      const newHeight = Math.max(20, Math.min(100, prev.height + delta));
      
      // Keep crop centered if possible
      const widthDiff = newWidth - prev.width;
      const heightDiff = newHeight - prev.height;
      const newX = Math.max(0, Math.min(100 - newWidth, prev.x - widthDiff / 2));
      const newY = Math.max(0, Math.min(100 - newHeight, prev.y - heightDiff / 2));

      return {
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight,
      };
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-900">
        <h3 className="text-white font-medium">Ajustar área de leitura</h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-white hover:text-gray-300 transition-colors"
          aria-label="Voltar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="size-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Canvas Container */}
      <div
        ref={containerRef}
        className="flex-1 flex items-center justify-center p-4 touch-none"
      >
        {isLoading ? (
          <div className="text-white text-sm">Carregando imagem...</div>
        ) : (
          <canvas
            ref={canvasRef}
            className="max-w-full max-h-full cursor-move"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />
        )}
      </div>

      {/* Controls */}
      <div className="p-4 bg-gray-900 space-y-3">
        <div className="flex items-center gap-2 justify-center">
          <button
            type="button"
            onClick={() => adjustCropSize(-10)}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 active:bg-gray-700 transition-colors"
            aria-label="Diminuir área"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="size-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
            </svg>
          </button>
          <span className="text-white text-sm min-w-20 text-center">
            Tamanho da área
          </span>
          <button
            type="button"
            onClick={() => adjustCropSize(10)}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 active:bg-gray-700 transition-colors"
            aria-label="Aumentar área"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="size-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m7-7H5" />
            </svg>
          </button>
        </div>

        <div className="flex gap-3">
          <Button type="button" variant="secondary" fullWidth onClick={onCancel}>
            Cancelar
          </Button>
          <Button
            type="button"
            variant="primary"
            fullWidth
            onClick={() => void handleCrop()}
            disabled={isLoading}
          >
            Confirmar
          </Button>
        </div>
      </div>

      {/* Instructions */}
      <div className="px-4 pb-4 text-center">
        <p className="text-gray-400 text-xs">
          Arraste o retângulo azul para posicionar a área de leitura
        </p>
      </div>
    </div>
  );
};
