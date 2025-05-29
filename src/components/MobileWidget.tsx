
import React, { useRef, useState } from 'react';
import { X, Edit3, GripHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileWidgetProps {
  title: string;
  langIcon: string;
  langName: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  languageColor: string;
  isDragging: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onResizeMouseDown: (e: React.MouseEvent) => void;
  onResizeTouchStart: (e: React.TouchEvent) => void;
}

const MobileWidget: React.FC<MobileWidgetProps> = ({
  title,
  langIcon,
  langName,
  position,
  size,
  zIndex,
  languageColor,
  isDragging,
  onEdit,
  onDelete,
  onMouseDown,
  onTouchStart,
  onResizeMouseDown,
  onResizeTouchStart
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const [initialPinchDistance, setInitialPinchDistance] = useState(0);
  const [initialSize, setInitialSize] = useState({ width: 0, height: 0 });
  const resizeRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if ('touches' in e) {
      onTouchStart(e);
    } else {
      onMouseDown(e);
    }
  };

  const getDistance = (touch1: Touch, touch2: Touch) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleResizeStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if ('touches' in e) {
      if (e.touches.length === 2) {
        // Pinch gesture
        setIsResizing(true);
        setInitialPinchDistance(getDistance(e.touches[0], e.touches[1]));
        setInitialSize({ width: size.width, height: size.height });
      } else {
        // Single touch resize
        onResizeTouchStart(e);
      }
    } else {
      onResizeMouseDown(e);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isResizing || e.touches.length !== 2) return;
    
    e.preventDefault();
    const currentDistance = getDistance(e.touches[0], e.touches[1]);
    const scale = currentDistance / initialPinchDistance;
    
    // Calculate new size with constraints
    const newWidth = Math.max(120, Math.min(400, initialSize.width * scale));
    const newHeight = Math.max(120, Math.min(400, initialSize.height * scale));
    
    // Trigger resize through parent component
    const resizeEvent = new CustomEvent('widgetResize', {
      detail: { width: newWidth, height: newHeight }
    });
    window.dispatchEvent(resizeEvent);
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (isResizing) {
      setIsResizing(false);
      setInitialPinchDistance(0);
      setInitialSize({ width: 0, height: 0 });
    }
  };

  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isResizing, initialPinchDistance, initialSize]);

  const handleEditClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit();
  };

  return (
    <div
      className={`absolute bg-white rounded-2xl shadow-xl border-2 ${languageColor} ${
        isDragging ? 'cursor-grabbing shadow-2xl' : ''
      } ${isResizing ? 'ring-2 ring-blue-400' : ''} select-none overflow-hidden transition-all duration-200`}
      style={{
        left: position.x,
        top: position.y,
        width: Math.max(120, size.width),
        height: Math.max(120, size.height),
        zIndex: isDragging || isResizing ? 9999 : zIndex,
        touchAction: 'none',
        transform: isDragging ? 'scale(1.05)' : isResizing ? 'scale(1.02)' : 'scale(1)',
        transition: (isDragging || isResizing) ? 'none' : 'transform 0.2s ease-out, box-shadow 0.2s ease-out'
      }}
    >
      {/* Widget Header - Drag Area */}
      <div
        className="bg-white/90 backdrop-blur-sm border-b border-gray-200 p-2 flex items-center justify-between cursor-move active:cursor-grabbing"
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
        style={{ touchAction: 'none' }}
      >
        <span className="text-xs font-medium text-gray-700 truncate flex-1 pointer-events-none">{title}</span>
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete();
          }}
          className="h-6 w-6 p-0 hover:bg-red-100 z-20 relative touch-manipulation"
          style={{ touchAction: 'manipulation' }}
        >
          <X className="w-3 h-3 text-red-600" />
        </Button>
      </div>

      {/* Widget Content - Always show edit button prominently */}
      <div className="p-3 flex flex-col items-center justify-center h-full bg-gray-50 relative">
        <span className="text-2xl mb-2 pointer-events-none">{langIcon}</span>
        <span className="text-xs text-gray-600 text-center mb-3 pointer-events-none">{langName}</span>
        
        {/* Large, prominent edit button */}
        <Button
          size="sm"
          onClick={handleEditClick}
          onTouchStart={handleEditClick}
          className="h-10 w-full text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium z-30 relative touch-manipulation min-h-[44px]"
          style={{ touchAction: 'manipulation' }}
        >
          <Edit3 className="w-4 h-4 mr-2" />
          Edit Code
        </Button>
      </div>

      {/* Widget Resize Handle - Enhanced for pinch */}
      <div
        ref={resizeRef}
        className={`absolute bottom-0 right-0 w-12 h-12 cursor-se-resize z-20 touch-manipulation ${
          isResizing ? 'bg-blue-100 rounded-tl-lg' : ''
        } flex items-center justify-center`}
        onMouseDown={handleResizeStart}
        onTouchStart={handleResizeStart}
        style={{ touchAction: 'none' }}
      >
        <GripHorizontal className={`w-5 h-5 text-gray-400 transform rotate-45 ${
          isResizing ? 'text-blue-600' : ''
        } transition-colors pointer-events-none`} />
        {isResizing && (
          <div className="absolute -top-8 -left-16 bg-blue-600 text-white text-xs px-2 py-1 rounded">
            Pinch to resize
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileWidget;
