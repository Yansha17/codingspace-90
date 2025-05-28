
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
  return (
    <div
      className={`absolute bg-white rounded-2xl shadow-xl border-2 ${languageColor} ${
        isDragging ? 'cursor-grabbing shadow-2xl scale-105' : 'cursor-grab'
      } select-none overflow-hidden transition-all duration-200`}
      style={{
        left: position.x,
        top: position.y,
        width: Math.max(120, size.width),
        height: Math.max(120, size.height),
        zIndex,
        touchAction: 'none'
      }}
    >
      {/* Widget Header */}
      <div
        className="bg-white/90 backdrop-blur-sm border-b border-gray-200 p-2 flex items-center justify-between cursor-move touch-none"
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        <span className="text-xs font-medium text-gray-700 truncate flex-1">{title}</span>
        <Button
          size="sm"
          variant="ghost"
          onClick={onDelete}
          className="h-6 w-6 p-0 hover:bg-red-100"
        >
          <X className="w-3 h-3 text-red-600" />
        </Button>
      </div>

      {/* Widget Content */}
      <div className="p-3 flex flex-col items-center justify-center h-full bg-gray-50">
        <span className="text-2xl mb-2">{langIcon}</span>
        <span className="text-xs text-gray-600 text-center mb-2">{langName}</span>
        <Button
          size="sm"
          onClick={onEdit}
          className="h-8 w-full text-xs bg-blue-600 hover:bg-blue-700"
        >
          <Edit3 className="w-3 h-3 mr-1" />
          Edit
        </Button>
      </div>

      {/* Widget Resize Handle */}
      <div
        className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize"
        onMouseDown={onResizeMouseDown}
        onTouchStart={onResizeTouchStart}
      >
        <GripHorizontal className="w-4 h-4 text-gray-400 transform rotate-45 absolute bottom-1 right-1" />
      </div>
    </div>
  );
};

export default MobileWidget;
