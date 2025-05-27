
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { X, Play, Maximize2, Minimize2, GripHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CodeWindowType } from '@/types/CodeWindow';
import CodeEditor from './CodeEditor';
import CodePreview from './CodePreview';

interface CodeWindowProps {
  window: CodeWindowType;
  onUpdate: (id: string, updates: Partial<CodeWindowType>) => void;
  onBringToFront: (id: string) => void;
  onDelete: (id: string) => void;
}

const CodeWindow: React.FC<CodeWindowProps> = ({
  window,
  onUpdate,
  onBringToFront,
  onDelete
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showPreview, setShowPreview] = useState(false);
  const windowRef = useRef<HTMLDivElement>(null);

  const languageColors = {
    javascript: 'border-orange-400 bg-orange-50',
    html: 'border-blue-400 bg-blue-50',
    css: 'border-purple-400 bg-purple-50',
    python: 'border-green-400 bg-green-50',
    java: 'border-red-400 bg-red-50',
    cpp: 'border-indigo-400 bg-indigo-50'
  };

  const languageColor = languageColors[window.language as keyof typeof languageColors] || 'border-gray-400 bg-gray-50';

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target !== e.currentTarget && !(e.target as HTMLElement).classList.contains('drag-handle')) {
      return;
    }
    
    e.preventDefault();
    setIsDragging(true);
    onBringToFront(window.id);
    
    const rect = windowRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  }, [window.id, onBringToFront]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    e.preventDefault();
    onUpdate(window.id, {
      position: {
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      }
    });
  }, [isDragging, dragOffset, window.id, onUpdate]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);

  const handleResizeMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    onBringToFront(window.id);
  }, [window.id, onBringToFront]);

  const handleResizeMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    
    e.preventDefault();
    const rect = windowRef.current?.getBoundingClientRect();
    if (rect) {
      onUpdate(window.id, {
        size: {
          width: Math.max(300, e.clientX - rect.left),
          height: Math.max(200, e.clientY - rect.top)
        }
      });
    }
  }, [isResizing, window.id, onUpdate]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousemove', handleResizeMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, handleMouseMove, handleResizeMouseMove, handleMouseUp]);

  const handleCodeChange = useCallback((newCode: string) => {
    onUpdate(window.id, { code: newCode });
  }, [window.id, onUpdate]);

  const handleRunCode = useCallback(() => {
    console.log(`Running ${window.language} code:`, window.code);
    if (['html', 'css', 'javascript'].includes(window.language)) {
      setShowPreview(true);
    }
  }, [window.language, window.code]);

  return (
    <div
      ref={windowRef}
      className={`absolute bg-white rounded-lg shadow-xl border-2 ${languageColor} ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} select-none overflow-hidden`}
      style={{
        left: window.position.x,
        top: window.position.y,
        width: window.size.width,
        height: window.size.height,
        zIndex: window.zIndex
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Title Bar */}
      <div className="drag-handle flex items-center justify-between p-3 bg-white/90 backdrop-blur-sm border-b border-gray-200 cursor-grab">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${window.language === 'javascript' ? 'bg-orange-400' : 
            window.language === 'html' ? 'bg-blue-400' :
            window.language === 'css' ? 'bg-purple-400' :
            window.language === 'python' ? 'bg-green-400' :
            window.language === 'java' ? 'bg-red-400' :
            window.language === 'cpp' ? 'bg-indigo-400' : 'bg-gray-400'
          }`} />
          <span className="font-medium text-gray-900">{window.title}</span>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleRunCode}
            className="h-6 w-6 p-0 hover:bg-green-100"
          >
            <Play className="w-3 h-3 text-green-600" />
          </Button>
          
          {['html', 'css', 'javascript'].includes(window.language) && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowPreview(!showPreview)}
              className="h-6 w-6 p-0 hover:bg-blue-100"
            >
              {showPreview ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
            </Button>
          )}
          
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(window.id)}
            className="h-6 w-6 p-0 hover:bg-red-100"
          >
            <X className="w-3 h-3 text-red-600" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col h-full">
        <div className={`flex-1 ${showPreview ? 'h-1/2' : 'h-full'}`}>
          <CodeEditor
            language={window.language}
            code={window.code}
            onChange={handleCodeChange}
          />
        </div>
        
        {showPreview && ['html', 'css', 'javascript'].includes(window.language) && (
          <div className="h-1/2 border-t border-gray-200">
            <CodePreview
              language={window.language}
              code={window.code}
            />
          </div>
        )}
      </div>

      {/* Resize Handle */}
      <div
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
        onMouseDown={handleResizeMouseDown}
      >
        <GripHorizontal className="w-3 h-3 text-gray-400 transform rotate-45" />
      </div>
    </div>
  );
};

export default CodeWindow;
