
import React, { memo, useState, useRef, useEffect, useCallback } from 'react';
import { optimizeResize, triggerHapticFeedback, throttleRAF } from '@/utils/performance';

interface MobileWidgetResizeHandleProps {
  onResize: (size: { width: number; height: number }) => void;
  currentSize: { width: number; height: number };
}

const MobileWidgetResizeHandle: React.FC<MobileWidgetResizeHandleProps> = memo(({
  onResize,
  currentSize
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const resizeStartRef = useRef<{ x: number; y: number; width: number; height: number } | null>(null);
  const elementRef = useRef<HTMLDivElement>(null);
  const throttledResize = useRef<((e: MouseEvent | TouchEvent) => void) | null>(null);

  const handleResizeStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    setIsResizing(true);
    triggerHapticFeedback('medium');
    
    resizeStartRef.current = {
      x: clientX,
      y: clientY,
      width: currentSize.width,
      height: currentSize.height
    };

    // Initialize throttled resize function
    throttledResize.current = throttleRAF((e: MouseEvent | TouchEvent) => {
      if (!isResizing || !resizeStartRef.current) return;
      
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      
      const deltaX = clientX - resizeStartRef.current.x;
      const deltaY = clientY - resizeStartRef.current.y;
      
      const minWidth = 140;
      const minHeight = 120;
      const maxWidth = window.innerWidth - 40;
      const maxHeight = window.innerHeight - 120;
      
      const newWidth = Math.max(minWidth, Math.min(maxWidth, resizeStartRef.current.width + deltaX));
      const newHeight = Math.max(minHeight, Math.min(maxHeight, resizeStartRef.current.height + deltaY));
      
      // Immediate visual feedback
      const parentElement = elementRef.current?.parentElement;
      if (parentElement) {
        optimizeResize(parentElement, newWidth, newHeight);
      }
      
      onResize({ width: newWidth, height: newHeight });
    });
  }, [currentSize, isResizing, onResize]);

  const handleResizeMove = useCallback((e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    if (throttledResize.current) {
      throttledResize.current(e);
    }
  }, []);

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
    resizeStartRef.current = null;
    throttledResize.current = null;
    
    // Reset performance optimizations
    const parentElement = elementRef.current?.parentElement;
    if (parentElement) {
      parentElement.style.willChange = 'auto';
    }
  }, []);

  useEffect(() => {
    if (isResizing) {
      const options = { passive: false };
      document.addEventListener('mousemove', handleResizeMove, options);
      document.addEventListener('mouseup', handleResizeEnd, { passive: true });
      document.addEventListener('touchmove', handleResizeMove, options);
      document.addEventListener('touchend', handleResizeEnd, { passive: true });
      
      return () => {
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('mouseup', handleResizeEnd);
        document.removeEventListener('touchmove', handleResizeMove);
        document.removeEventListener('touchend', handleResizeEnd);
      };
    }
  }, [isResizing, handleResizeMove, handleResizeEnd]);

  return (
    <div
      ref={elementRef}
      data-resize-handle="true"
      className={`absolute bottom-2 right-2 w-8 h-8 cursor-se-resize z-30 touch-manipulation ${
        isResizing ? 'bg-blue-500 scale-110' : 'bg-slate-600 hover:bg-slate-500'
      } rounded-full flex items-center justify-center transition-all opacity-70 hover:opacity-100 shadow-lg`}
      onMouseDown={handleResizeStart}
      onTouchStart={handleResizeStart}
      style={{ touchAction: 'none' }}
    >
      <div className="flex flex-col gap-0.5">
        <div className="flex gap-0.5">
          <div className="w-1 h-1 bg-white rounded-full opacity-80"></div>
          <div className="w-1 h-1 bg-white rounded-full opacity-60"></div>
        </div>
        <div className="flex gap-0.5">
          <div className="w-1 h-1 bg-white rounded-full opacity-60"></div>
          <div className="w-1 h-1 bg-white rounded-full opacity-80"></div>
        </div>
      </div>
    </div>
  );
});

MobileWidgetResizeHandle.displayName = 'MobileWidgetResizeHandle';

export default MobileWidgetResizeHandle;
