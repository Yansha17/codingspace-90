import React, { useRef, useState, useEffect } from 'react';
import { X, Edit3, GripHorizontal, Eye, Code2, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CodePreviewMini from './CodePreviewMini';

interface MobileWidgetProps {
  title: string;
  langIcon: string;
  langName: string;
  code: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  languageColor: string;
  isDragging: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onResize: (size: { width: number; height: number }) => void;
}

const MobileWidget: React.FC<MobileWidgetProps> = ({
  title,
  langIcon,
  langName,
  code,
  position,
  size,
  zIndex,
  languageColor,
  isDragging,
  onEdit,
  onDelete,
  onMouseDown,
  onTouchStart,
  onResize
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const [initialPinchDistance, setInitialPinchDistance] = useState(0);
  const [initialSize, setInitialSize] = useState({ width: 0, height: 0 });
  const [showCodePreview, setShowCodePreview] = useState(true);
  const [resizeStartPos, setResizeStartPos] = useState({ x: 0, y: 0 });
  const resizeRef = useRef<HTMLDivElement>(null);

  const getDistance = (touch1: React.Touch, touch2: React.Touch) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleDragMouseStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onMouseDown(e);
  };

  const handleDragTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.touches.length === 1) {
      onTouchStart(e);
    } else if (e.touches.length === 2) {
      // Handle pinch gesture for resizing
      setIsResizing(true);
      setInitialPinchDistance(getDistance(e.touches[0], e.touches[1]));
      setInitialSize({ width: size.width, height: size.height });
    }
  };

  const handleResizeMouseStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeStartPos({ x: e.clientX, y: e.clientY });
    setInitialSize({ width: size.width, height: size.height });
  };

  const handleResizeTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.touches.length === 1) {
      setIsResizing(true);
      setResizeStartPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      setInitialSize({ width: size.width, height: size.height });
    } else if (e.touches.length === 2) {
      setIsResizing(true);
      setInitialPinchDistance(getDistance(e.touches[0], e.touches[1]));
      setInitialSize({ width: size.width, height: size.height });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;
    
    e.preventDefault();
    const deltaX = e.clientX - resizeStartPos.x;
    const deltaY = e.clientY - resizeStartPos.y;
    
    const newWidth = Math.max(140, Math.min(400, initialSize.width + deltaX));
    const newHeight = Math.max(120, Math.min(400, initialSize.height + deltaY));
    
    onResize({ width: newWidth, height: newHeight });
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isResizing) return;
    
    e.preventDefault();
    
    if (e.touches.length === 2 && initialPinchDistance > 0) {
      // Handle pinch gesture
      const currentDistance = getDistance(e.touches[0] as React.Touch, e.touches[1] as React.Touch);
      const scale = currentDistance / initialPinchDistance;
      
      const newWidth = Math.max(140, Math.min(400, initialSize.width * scale));
      const newHeight = Math.max(120, Math.min(400, initialSize.height * scale));
      
      onResize({ width: newWidth, height: newHeight });
    } else if (e.touches.length === 1) {
      // Handle single touch resize
      const deltaX = e.touches[0].clientX - resizeStartPos.x;
      const deltaY = e.touches[0].clientY - resizeStartPos.y;
      
      const newWidth = Math.max(140, Math.min(400, initialSize.width + deltaX));
      const newHeight = Math.max(120, Math.min(400, initialSize.height + deltaY));
      
      onResize({ width: newWidth, height: newHeight });
    }
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
    setInitialPinchDistance(0);
    setInitialSize({ width: 0, height: 0 });
    setResizeStartPos({ x: 0, y: 0 });
  };

  useEffect(() => {
    if (isResizing) {
      const handleMove = (e: MouseEvent) => handleMouseMove(e);
      const handleTouchMoveEvent = (e: TouchEvent) => handleTouchMove(e);
      const handleEnd = () => handleResizeEnd();
      
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleTouchMoveEvent, { passive: false });
      document.addEventListener('touchend', handleEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('mouseup', handleEnd);
        document.removeEventListener('touchmove', handleTouchMoveEvent);
        document.removeEventListener('touchend', handleEnd);
      };
    }
  }, [isResizing, resizeStartPos, initialPinchDistance, initialSize]);

  const handleEditClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit();
  };

  const handleToggleView = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowCodePreview(!showCodePreview);
  };

  const lineCount = code.split('\n').length;
  const isLargeWidget = size.width > 200 && size.height > 160;

  // Get proper language colors based on the language
  const getLanguageAccentColor = (language: string) => {
    const colorMap = {
      'JavaScript': '#F7DF1E',
      'HTML': '#E34F26',
      'CSS': '#1572B6',
      'React': '#61DAFB',
      'Vue': '#4FC08D',
      'Python': '#3776AB',
      'Java': '#007396',
      'C++': '#00599C',
      'PHP': '#777BB4',
      'Swift': '#FA7343',
      'Go': '#00ADD8',
      'Rust': '#000000',
      'SQL': '#336791'
    };
    return colorMap[language] || '#6B7280';
  };

  const accentColor = getLanguageAccentColor(title);

  return (
    <div
      className={`absolute bg-white rounded-2xl shadow-xl border-2 ${languageColor} ${
        isDragging ? 'cursor-grabbing shadow-2xl' : ''
      } ${isResizing ? 'ring-2 ring-blue-400' : ''} select-none overflow-hidden transition-all duration-200`}
      style={{
        left: position.x,
        top: position.y,
        width: Math.max(140, size.width),
        height: Math.max(120, size.height),
        zIndex: isDragging || isResizing ? 9999 : zIndex,
        touchAction: 'none',
        transform: isDragging ? 'scale(1.05)' : isResizing ? 'scale(1.02)' : 'scale(1)',
        transition: (isDragging || isResizing) ? 'none' : 'transform 0.2s ease-out, box-shadow 0.2s ease-out',
        borderColor: accentColor
      }}
    >
      {/* Widget Header - Enhanced with more info */}
      <div
        className="bg-white/90 backdrop-blur-sm border-b border-gray-200 p-2 flex items-center justify-between cursor-move active:cursor-grabbing"
        onMouseDown={handleDragMouseStart}
        onTouchStart={handleDragTouchStart}
        style={{ touchAction: 'none' }}
      >
        <div className="flex items-center gap-1 flex-1 min-w-0">
          <span className="text-lg">{langIcon}</span>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-medium text-gray-700 truncate">{title}</span>
            {isLargeWidget && (
              <span className="text-xs text-gray-500">{lineCount} lines</span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          {isLargeWidget && (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleToggleView}
              className="h-6 w-6 p-0 hover:bg-blue-100 z-20 relative touch-manipulation"
              style={{ touchAction: 'manipulation' }}
            >
              {showCodePreview ? (
                <Eye className="w-3 h-3 text-blue-600" />
              ) : (
                <Code2 className="w-3 h-3 text-blue-600" />
              )}
            </Button>
          )}
          
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
      </div>

      {/* Widget Content */}
      <div className="flex flex-col h-full bg-gray-50 relative">
        <div className="flex-1 p-2 overflow-hidden">
          {showCodePreview && isLargeWidget ? (
            <CodePreviewMini 
              code={code} 
              language={title.toLowerCase()} 
              maxLines={Math.floor((size.height - 80) / 20)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <span className="text-3xl mb-2 pointer-events-none">{langIcon}</span>
              <span className="text-xs text-gray-600 text-center mb-2 pointer-events-none">
                {langName}
              </span>
              {!isLargeWidget && (
                <span className="text-xs text-gray-500 text-center pointer-events-none">
                  {lineCount} lines
                </span>
              )}
            </div>
          )}
        </div>
        
        {/* Action Button with language color */}
        <div className="p-2 border-t border-gray-200">
          <Button
            size="sm"
            onClick={handleEditClick}
            onTouchStart={handleEditClick}
            className="h-8 w-full text-xs text-white font-medium z-30 relative touch-manipulation"
            style={{ 
              backgroundColor: accentColor,
              touchAction: 'manipulation'
            }}
          >
            <Edit3 className="w-3 h-3 mr-1" />
            Edit Code
          </Button>
        </div>
      </div>

      {/* Enhanced Resize Handle with Size Indicator */}
      <div
        ref={resizeRef}
        className={`absolute bottom-0 right-0 w-12 h-12 cursor-se-resize z-20 touch-manipulation ${
          isResizing ? 'bg-blue-100 rounded-tl-lg' : 'bg-gray-100/50 hover:bg-gray-100'
        } flex items-center justify-center transition-colors`}
        onMouseDown={handleResizeMouseStart}
        onTouchStart={handleResizeTouchStart}
        style={{ touchAction: 'none' }}
      >
        <GripHorizontal className={`w-4 h-4 text-gray-400 transform rotate-45 ${
          isResizing ? 'text-blue-600' : ''
        } transition-colors pointer-events-none`} />
        
        {isResizing && (
          <div className="absolute -top-8 -left-16 bg-blue-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            {Math.round(size.width)}x{Math.round(size.height)}
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileWidget;
