
import React from 'react';
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
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if ('touches' in e) {
      onTouchStart(e);
    } else {
      onMouseDown(e);
    }
  };

  const handleResizeStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if ('touches' in e) {
      onResizeTouchStart(e);
    } else {
      onResizeMouseDown(e);
    }
  };

  return (
    <div
      className={`absolute bg-white rounded-2xl shadow-xl border-2 ${languageColor} ${
        isDragging ? 'cursor-grabbing shadow-2xl' : 'cursor-grab'
      } select-none overflow-hidden transition-shadow duration-200`}
      style={{
        left: position.x,
        top: position.y,
        width: Math.max(120, size.width),
        height: Math.max(120, size.height),
        zIndex: isDragging ? 9999 : zIndex,
        touchAction: 'none',
        transform: isDragging ? 'scale(1.05)' : 'scale(1)',
        transition: isDragging ? 'none' : 'transform 0.2s ease-out, box-shadow 0.2s ease-out'
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
          className="h-6 w-6 p-0 hover:bg-red-100 z-10 relative touch-manipulation"
          style={{ touchAction: 'manipulation' }}
        >
          <X className="w-3 h-3 text-red-600" />
        </Button>
      </div>

      {/* Widget Content */}
      <div className="p-3 flex flex-col items-center justify-center h-full bg-gray-50 pointer-events-none">
        <span className="text-2xl mb-2 pointer-events-none">{langIcon}</span>
        <span className="text-xs text-gray-600 text-center mb-2 pointer-events-none">{langName}</span>
        <Button
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onEdit();
          }}
          className="h-8 w-full text-xs bg-blue-600 hover:bg-blue-700 pointer-events-auto z-10 relative touch-manipulation"
          style={{ touchAction: 'manipulation' }}
        >
          <Edit3 className="w-3 h-3 mr-1" />
          Edit
        </Button>
      </div>

      {/* Widget Resize Handle */}
      <div
        className="absolute bottom-0 right-0 w-8 h-8 cursor-se-resize z-20 touch-manipulation"
        onMouseDown={handleResizeStart}
        onTouchStart={handleResizeStart}
        style={{ touchAction: 'none' }}
      >
        <GripHorizontal className="w-4 h-4 text-gray-400 transform rotate-45 absolute bottom-1 right-1 pointer-events-none" />
      </div>
    </div>
  );
};

export default MobileWidget;
