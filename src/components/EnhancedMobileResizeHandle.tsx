
import React, { memo, useState, useRef, useEffect, useCallback } from 'react';
import { optimizeResize, triggerHapticFeedback, throttleRAF } from '@/utils/performance';

interface EnhancedMobileResizeHandleProps {
  onResize: (size: { width: number; height: number }) => void;
  currentSize: { width: number; height: number };
  onPinchZoom?: (scale: number) => void;
}

const EnhancedMobileResizeHandle: React.FC<EnhancedMobileResizeHandleProps> = memo(({
  onResize,
  currentSize,
  onPinchZoom
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const [isPinching, setIsPinching] = useState(false);
  const resizeStartRef = useRef<{ x: number; y: number; width: number; height: number } | null>(null);
  const pinchStartRef = useRef<{ distance: number; scale: number } | null>(null);
  const elementRef = useRef<HTMLDivElement>(null);

  const getDistance = (touch1: React.Touch, touch2: React.Touch) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.touches.length === 2) {
      // Pinch gesture
      const distance = getDistance(e.touches[0], e.touches[1]);
      setIsPinching(true);
      pinchStartRef.current = { distance, scale: 1 };
      triggerHapticFeedback('light');
    } else if (e.touches.length === 1) {
      // Single touch resize
      const touch = e.touches[0];
      setIsResizing(true);
      triggerHapticFeedback('medium');
      
      resizeStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        width: currentSize.width,
        height: currentSize.height
      };
    }
  }, [currentSize]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault();

    if (e.touches.length === 2 && isPinching && pinchStartRef.current) {
      // Handle pinch gesture
      const distance = getDistance(e.touches[0], e.touches[1]);
      const scale = distance / pinchStartRef.current.distance;
      
      if (onPinchZoom) {
        onPinchZoom(scale);
      } else {
        // Fallback to resize
        const newWidth = Math.max(140, Math.min(window.innerWidth - 40, currentSize.width * scale));
        const newHeight = Math.max(120, Math.min(window.innerHeight - 120, currentSize.height * scale));
        onResize({ width: newWidth, height: newHeight });
      }
    } else if (e.touches.length === 1 && isResizing && resizeStartRef.current) {
      // Handle single touch resize
      const touch = e.touches[0];
      const deltaX = touch.clientX - resizeStartRef.current.x;
      const deltaY = touch.clientY - resizeStartRef.current.y;
      
      const minWidth = 140;
      const minHeight = 120;
      const maxWidth = window.innerWidth - 40;
      const maxHeight = window.innerHeight - 120;
      
      const newWidth = Math.max(minWidth, Math.min(maxWidth, resizeStartRef.current.width + deltaX));
      const newHeight = Math.max(minHeight, Math.min(maxHeight, resizeStartRef.current.height + deltaY));
      
      onResize({ width: newWidth, height: newHeight });
    }
  }, [isPinching, isResizing, currentSize, onPinchZoom, onResize]);

  const handleTouchEnd = useCallback(() => {
    setIsResizing(false);
    setIsPinching(false);
    resizeStartRef.current = null;
    pinchStartRef.current = null;
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsResizing(true);
    triggerHapticFeedback('medium');
    
    resizeStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      width: currentSize.width,
      height: currentSize.height
    };
  }, [currentSize]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !resizeStartRef.current) return;
    
    e.preventDefault();
    const deltaX = e.clientX - resizeStartRef.current.x;
    const deltaY = e.clientY - resizeStartRef.current.y;
    
    const minWidth = 140;
    const minHeight = 120;
    const maxWidth = window.innerWidth - 40;
    const maxHeight = window.innerHeight - 120;
    
    const newWidth = Math.max(minWidth, Math.min(maxWidth, resizeStartRef.current.width + deltaX));
    const newHeight = Math.max(minHeight, Math.min(maxHeight, resizeStartRef.current.height + deltaY));
    
    onResize({ width: newWidth, height: newHeight });
  }, [isResizing, onResize]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    resizeStartRef.current = null;
  }, []);

  useEffect(() => {
    if (isResizing || isPinching) {
      const options = { passive: false };
      document.addEventListener('touchmove', handleTouchMove, options);
      document.addEventListener('touchend', handleTouchEnd, { passive: true });
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing, isPinching, handleTouchMove, handleTouchEnd, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={elementRef}
      data-resize-handle="true"
      className={`absolute bottom-2 right-2 w-8 h-8 cursor-se-resize z-30 touch-manipulation ${
        isResizing || isPinching ? 'bg-blue-500 scale-125' : 'bg-slate-600 hover:bg-slate-500'
      } rounded-lg flex items-center justify-center transition-all opacity-90 hover:opacity-100 shadow-lg`}
      onTouchStart={handleTouchStart}
      onMouseDown={handleMouseDown}
      style={{ touchAction: 'none' }}
    >
      <div className="grid grid-cols-2 gap-0.5">
        <div className="w-1 h-1 bg-white rounded-full opacity-80"></div>
        <div className="w-1 h-1 bg-white rounded-full opacity-60"></div>
        <div className="w-1 h-1 bg-white rounded-full opacity-60"></div>
        <div className="w-1 h-1 bg-white rounded-full opacity-80"></div>
      </div>
      
      {/* Visual feedback indicators */}
      {isPinching && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
          Pinch to resize
        </div>
      )}
      {isResizing && !isPinching && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-xs px-2 py-1 rounded">
          Resizing
        </div>
      )}
    </div>
  );
});

EnhancedMobileResizeHandle.displayName = 'EnhancedMobileResizeHandle';

export default EnhancedMobileResizeHandle;
