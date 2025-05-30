
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { X, Edit3, Eye, Code2, Move } from 'lucide-react';
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
  const [showPreview, setShowPreview] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const resizeStartRef = useRef<{ x: number; y: number; width: number; height: number } | null>(null);

  // Languages that support preview
  const previewableLanguages = ['html', 'css', 'javascript', 'react'];
  const canPreview = previewableLanguages.includes(title.toLowerCase());

  const handleWidgetMouseDown = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('[data-resize-handle]')) {
      return;
    }
    
    e.preventDefault();
    e.stopPropagation();
    
    if ('vibrate' in navigator) {
      navigator.vibrate(30);
    }
    
    onMouseDown(e);
  }, [onMouseDown]);

  const handleWidgetTouchStart = useCallback((e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('[data-resize-handle]')) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    
    if ('vibrate' in navigator) {
      navigator.vibrate(30);
    }
    onTouchStart(e);
  }, [onTouchStart]);

  const handleResizeStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    setIsResizing(true);
    resizeStartRef.current = {
      x: clientX,
      y: clientY,
      width: size.width,
      height: size.height
    };
    
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  }, [size]);

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
      const options = { passive: false };
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);
      document.addEventListener('touchmove', handleResizeMove, options);
      document.addEventListener('touchend', handleResizeEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('mouseup', handleResizeEnd);
        document.removeEventListener('touchmove', handleResizeMove);
        document.removeEventListener('touchend', handleResizeEnd);
      };
    }
  }, [isResizing, handleResizeMove, handleResizeEnd]);

  const handleTogglePreview = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPreview(!showPreview);
    setPreviewKey(prev => prev + 1);
  }, [showPreview]);

  const handleEdit = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit();
  }, [onEdit]);

  const handleDelete = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete();
  }, [onDelete]);

  const lineCount = code.split('\n').length;
  const isLargeWidget = size.width > 200 && size.height > 180;

  const getLanguageInfo = (language: string) => {
    const languageMap = {
      'html': { color: '#E34F26', bgColor: 'bg-orange-500' },
      'css': { color: '#1572B6', bgColor: 'bg-blue-500' },
      'javascript': { color: '#F7DF1E', bgColor: 'bg-yellow-500' },
      'react': { color: '#61DAFB', bgColor: 'bg-cyan-500' },
      'vue': { color: '#4FC08D', bgColor: 'bg-green-500' },
      'python': { color: '#3776AB', bgColor: 'bg-blue-600' },
      'java': { color: '#007396', bgColor: 'bg-blue-700' },
      'cpp': { color: '#00599C', bgColor: 'bg-blue-800' },
      'php': { color: '#777BB4', bgColor: 'bg-purple-500' },
      'swift': { color: '#FA7343', bgColor: 'bg-orange-500' },
      'go': { color: '#00ADD8', bgColor: 'bg-cyan-600' },
      'rust': { color: '#000000', bgColor: 'bg-gray-800' },
      'sql': { color: '#336791', bgColor: 'bg-blue-700' }
    };
    return languageMap[language.toLowerCase()] || { color: '#6B7280', bgColor: 'bg-gray-600' };
  };

  const langInfo = getLanguageInfo(title);

  return (
    <div
      className={`absolute rounded-xl shadow-2xl border overflow-hidden transition-all duration-200 ${
        isDragging ? 'cursor-grabbing scale-105 shadow-3xl' : 'cursor-grab'
      } select-none`}
      style={{
        left: position.x,
        top: position.y,
        width: Math.max(140, size.width),
        height: Math.max(120, size.height),
        zIndex: isDragging ? 9999 : zIndex,
        touchAction: 'none',
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        borderColor: isDragging ? '#10B981' : '#475569',
        boxShadow: isDragging 
          ? '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 20px rgba(16, 185, 129, 0.3)' 
          : '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
      }}
      onMouseDown={handleWidgetMouseDown}
      onTouchStart={handleWidgetTouchStart}
    >
      {/* Drag indicator when dragging */}
      {isDragging && (
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-blue-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center z-10 pointer-events-none">
          <div className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2">
            <Move className="w-3 h-3" />
            Moving...
          </div>
        </div>
      )}

      {/* Widget Header */}
      <div className="bg-slate-700/90 backdrop-blur-sm border-b border-slate-600 p-3 flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={`w-8 h-8 rounded-lg ${langInfo.bgColor} flex items-center justify-center text-white font-bold shadow-lg`}>
            {langIcon}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-white truncate">{title}</span>
            <span className="text-xs text-slate-400">{langName}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          {/* Preview Button - Show for previewable languages */}
          {canPreview && (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleTogglePreview}
              onTouchStart={handleTogglePreview}
              className="h-8 w-8 p-0 hover:bg-emerald-600 rounded-lg z-20 relative touch-manipulation"
              style={{ touchAction: 'manipulation' }}
            >
              <Eye className={`w-4 h-4 ${showPreview ? 'text-emerald-300' : 'text-emerald-400'} hover:text-white`} />
            </Button>
          )}
          
          {/* Code Toggle Button */}
          <Button
            size="sm"
            variant="ghost"
            onClick={handleTogglePreview}
            onTouchStart={handleTogglePreview}
            className="h-8 w-8 p-0 hover:bg-slate-600 rounded-lg z-20 relative touch-manipulation"
            style={{ touchAction: 'manipulation' }}
          >
            <Code2 className="w-4 h-4 text-slate-300 hover:text-white" />
          </Button>
          
          {/* Edit Button */}
          <Button
            size="sm"
            variant="ghost"
            onClick={handleEdit}
            onTouchStart={handleEdit}
            className="h-8 w-8 p-0 hover:bg-blue-600 rounded-lg z-20 relative touch-manipulation"
            style={{ touchAction: 'manipulation' }}
          >
            <Edit3 className="w-4 h-4 text-blue-400 hover:text-white" />
          </Button>
          
          {/* Delete Button */}
          <Button
            size="sm"
            variant="ghost"
            onClick={handleDelete}
            onTouchStart={handleDelete}
            className="h-8 w-8 p-0 hover:bg-red-600 rounded-lg z-20 relative touch-manipulation"
            style={{ touchAction: 'manipulation' }}
          >
            <X className="w-4 h-4 text-red-400 hover:text-white" />
          </Button>
        </div>
      </div>

      {/* Widget Content */}
      <div className="flex flex-col h-full relative">
        <div className="flex-1 p-4 overflow-hidden">
          {showPreview && isLargeWidget && canPreview ? (
            <div className="h-full bg-slate-800 rounded-lg p-3 overflow-hidden">
              <CodePreviewMini 
                key={previewKey}
                code={code} 
                language={title.toLowerCase()} 
                maxLines={Math.floor((size.height - 120) / 20)}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <div className={`w-16 h-16 rounded-2xl ${langInfo.bgColor} flex items-center justify-center text-white text-2xl mb-3 shadow-xl`}>
                {langIcon}
              </div>
              <span className="text-lg font-bold text-white text-center mb-2 pointer-events-none">
                {title}
              </span>
              <span className="text-sm text-slate-400 text-center mb-2 pointer-events-none">
                {langName}
              </span>
              <div className="bg-slate-700 px-3 py-1 rounded-full">
                <span className="text-xs text-slate-300 pointer-events-none">
                  {lineCount} lines
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Resize Handle */}
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
    </div>
  );
};

export default MobileWidget;
