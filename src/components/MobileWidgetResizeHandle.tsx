
import React, { memo, useState, useRef, useEffect, useCallback } from 'react';

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

  const handleResizeStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    setIsResizing(true);
    resizeStartRef.current = {
      x: clientX,
      y: clientY,
      width: currentSize.width,
      height: currentSize.height
    };
  }, [currentSize]);

  const handleResizeMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isResizing || !resizeStartRef.current) return;
    
    e.preventDefault();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const deltaX = clientX - resizeStartRef.current.x;
    const deltaY = clientY - resizeStartRef.current.y;
    
    const newWidth = Math.max(140, resizeStartRef.current.width + deltaX);
    const newHeight = Math.max(120, resizeStartRef.current.height + deltaY);
    
    onResize({ width: newWidth, height: newHeight });
  }, [isResizing, onResize]);

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
    resizeStartRef.current = null;
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMove, { passive: false });
      document.addEventListener('mouseup', handleResizeEnd, { passive: true });
      document.addEventListener('touchmove', handleResizeMove, { passive: false });
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
