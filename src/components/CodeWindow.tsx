
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { X, Play, Maximize2, Minimize2, GripHorizontal, Eye, Code as CodeIcon, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CodeWindowType } from '@/types/CodeWindow';
import CodeEditor from './CodeEditor';
import CodePreview from './CodePreview';
import MobileCodeEditor from './MobileCodeEditor';

interface CodeWindowProps {
  window: CodeWindowType;
  onUpdate: (id: string, updates: Partial<CodeWindowType>) => void;
  onBringToFront: (id: string) => void;
  onDelete: (id: string) => void;
}

const LANGUAGES = {
  javascript: { name: 'JavaScript', color: '#F7DF1E', icon: '🟨' },
  python: { name: 'Python', color: '#3776AB', icon: '🐍' },
  html: { name: 'HTML', color: '#E34F26', icon: '🌐' },
  css: { name: 'CSS', color: '#1572B6', icon: '🎨' },
  react: { name: 'React', color: '#61DAFB', icon: '⚛️' },
  java: { name: 'Java', color: '#007396', icon: '☕' },
  cpp: { name: 'C++', color: '#00599C', icon: '⚙️' },
  php: { name: 'PHP', color: '#777BB4', icon: '🐘' },
  swift: { name: 'Swift', color: '#FA7343', icon: '🦉' },
  go: { name: 'Go', color: '#00ADD8', icon: '🐹' },
  rust: { name: 'Rust', color: '#000000', icon: '🦀' },
  sql: { name: 'SQL', color: '#336791', icon: '🗃️' }
};

const CodeWindow: React.FC<CodeWindowProps> = ({
  window: codeWindow,
  onUpdate,
  onBringToFront,
  onDelete
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showPreview, setShowPreview] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileEditorOpen, setMobileEditorOpen] = useState(false);
  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(globalThis.window.innerWidth <= 768 || 'ontouchstart' in globalThis.window);
    };
    checkMobile();
    globalThis.window.addEventListener('resize', checkMobile);
    return () => globalThis.window.removeEventListener('resize', checkMobile);
  }, []);

  const languageColors = {
    javascript: 'border-orange-400 bg-orange-50',
    html: 'border-blue-400 bg-blue-50',
    css: 'border-purple-400 bg-purple-50',
    python: 'border-green-400 bg-green-50',
    java: 'border-red-400 bg-red-50',
    cpp: 'border-indigo-400 bg-indigo-50',
    react: 'border-cyan-400 bg-cyan-50',
    php: 'border-purple-600 bg-purple-50',
    swift: 'border-orange-600 bg-orange-50',
    go: 'border-blue-600 bg-blue-50',
    rust: 'border-gray-800 bg-gray-50',
    sql: 'border-blue-700 bg-blue-50'
  };

  const languageColor = languageColors[codeWindow.language as keyof typeof languageColors] || 'border-gray-400 bg-gray-50';
  const lang = LANGUAGES[codeWindow.language as keyof typeof LANGUAGES] || { name: codeWindow.language, color: '#666', icon: '📄' };

  const handleStart = useCallback((e: React.MouseEvent | React.TouchEvent, action: 'drag' | 'resize') => {
    e.preventDefault();
    e.stopPropagation();
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    onBringToFront(codeWindow.id);
    
    if (action === 'drag') {
      setIsDragging(true);
      const rect = windowRef.current?.getBoundingClientRect();
      if (rect) {
        setDragOffset({
          x: clientX - rect.left,
          y: clientY - rect.top
        });
      }
    } else if (action === 'resize') {
      setIsResizing(true);
    }
  }, [codeWindow.id, onBringToFront]);

  const handleMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging && !isResizing) return;
    
    e.preventDefault();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    if (isDragging) {
      const newX = Math.max(0, clientX - dragOffset.x);
      const newY = Math.max(60, clientY - dragOffset.y);
      
      onUpdate(codeWindow.id, {
        position: { x: newX, y: newY }
      });
    } else if (isResizing && windowRef.current) {
      const rect = windowRef.current.getBoundingClientRect();
      const newWidth = Math.max(isMobile ? 280 : 300, clientX - rect.left + 10);
      const newHeight = Math.max(200, clientY - rect.top + 10);
      
      onUpdate(codeWindow.id, {
        size: { width: newWidth, height: newHeight }
      });
    }
  }, [isDragging, isResizing, dragOffset, codeWindow.id, onUpdate, isMobile]);

  const handleEnd = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleMove, { passive: false });
      document.addEventListener('touchend', handleEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, isResizing, handleMove, handleEnd]);

  const handleCodeChange = useCallback((newCode: string) => {
    onUpdate(codeWindow.id, { code: newCode });
  }, [codeWindow.id, onUpdate]);

  const handleRunCode = useCallback(() => {
    console.log(`Running ${codeWindow.language} code:`, codeWindow.code);
    if (['html', 'css', 'javascript'].includes(codeWindow.language)) {
      setShowPreview(true);
    }
  }, [codeWindow.language, codeWindow.code]);

  const handleMobileEdit = () => {
    setMobileEditorOpen(true);
  };

  // Mobile widget mode - smaller, simplified interface
  if (isMobile && codeWindow.size.width < 200) {
    return (
      <>
        <div
          ref={windowRef}
          className={`absolute bg-white rounded-2xl shadow-xl border-2 ${languageColor} ${
            isDragging ? 'cursor-grabbing shadow-2xl scale-105' : 'cursor-grab'
          } select-none overflow-hidden transition-all duration-200`}
          style={{
            left: codeWindow.position.x,
            top: codeWindow.position.y,
            width: Math.max(120, codeWindow.size.width),
            height: Math.max(120, codeWindow.size.height),
            zIndex: codeWindow.zIndex,
            touchAction: 'none'
          }}
        >
          {/* Widget Header */}
          <div
            className="bg-white/90 backdrop-blur-sm border-b border-gray-200 p-2 flex items-center justify-between cursor-move touch-none"
            onMouseDown={(e) => handleStart(e, 'drag')}
            onTouchStart={(e) => handleStart(e, 'drag')}
          >
            <span className="text-xs font-medium text-gray-700 truncate flex-1">{codeWindow.title}</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(codeWindow.id)}
              className="h-6 w-6 p-0 hover:bg-red-100"
            >
              <X className="w-3 h-3 text-red-600" />
            </Button>
          </div>

          {/* Widget Content */}
          <div className="p-3 flex flex-col items-center justify-center h-full bg-gray-50">
            <span className="text-2xl mb-2">{lang.icon}</span>
            <span className="text-xs text-gray-600 text-center mb-2">{lang.name}</span>
            <Button
              size="sm"
              onClick={handleMobileEdit}
              className="h-8 w-full text-xs bg-blue-600 hover:bg-blue-700"
            >
              <Edit3 className="w-3 h-3 mr-1" />
              Edit
            </Button>
          </div>

          {/* Widget Resize Handle */}
          <div
            className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize"
            onMouseDown={(e) => handleStart(e, 'resize')}
            onTouchStart={(e) => handleStart(e, 'resize')}
          >
            <GripHorizontal className="w-4 h-4 text-gray-400 transform rotate-45 absolute bottom-1 right-1" />
          </div>
        </div>

        <MobileCodeEditor
          isOpen={mobileEditorOpen}
          onClose={() => setMobileEditorOpen(false)}
          title={codeWindow.title}
          language={codeWindow.language}
          code={codeWindow.code}
          onChange={handleCodeChange}
        />
      </>
    );
  }

  // Regular desktop/large mobile window mode
  return (
    <div
      ref={windowRef}
      className={`absolute bg-white rounded-lg shadow-xl border-2 ${languageColor} ${
        isDragging ? 'cursor-grabbing shadow-2xl scale-105' : 'cursor-grab'
      } select-none overflow-hidden transition-all duration-200`}
      style={{
        left: codeWindow.position.x,
        top: codeWindow.position.y,
        width: codeWindow.size.width,
        height: codeWindow.size.height,
        zIndex: codeWindow.zIndex,
        touchAction: 'none'
      }}
    >
      {/* Mobile-Optimized Title Bar */}
      <div
        className="bg-white/90 backdrop-blur-sm border-b border-gray-200 p-3 flex items-center justify-between cursor-move touch-none"
        onMouseDown={(e) => handleStart(e, 'drag')}
        onTouchStart={(e) => handleStart(e, 'drag')}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="flex gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span className="text-sm font-medium text-gray-700 truncate">{codeWindow.title}</span>
          <span 
            className={`text-xs px-2 py-1 rounded text-white ${isMobile ? 'hidden' : ''}`}
            style={{ backgroundColor: lang.color }}
          >
            {lang.icon}
          </span>
        </div>
        
        <div className="flex items-center gap-1 flex-shrink-0">
          {['javascript', 'python', 'html', 'css'].includes(codeWindow.language) && (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleRunCode}
              className={`${isMobile ? 'h-8 w-8' : 'h-6 w-6'} p-0 hover:bg-green-100 touch-manipulation`}
            >
              <Play className={`${isMobile ? 'w-4 h-4' : 'w-3 h-3'} text-green-600`} />
            </Button>
          )}
          
          {['html', 'css', 'javascript'].includes(codeWindow.language) && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowPreview(!showPreview)}
              className={`${isMobile ? 'h-8 w-8' : 'h-6 w-6'} p-0 hover:bg-blue-100 touch-manipulation`}
            >
              {showPreview ? (
                <CodeIcon className={`${isMobile ? 'w-4 h-4' : 'w-3 h-3'} text-blue-600`} />
              ) : (
                <Eye className={`${isMobile ? 'w-4 h-4' : 'w-3 h-3'} text-blue-600`} />
              )}
            </Button>
          )}
          
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(codeWindow.id)}
            className={`${isMobile ? 'h-8 w-8' : 'h-6 w-6'} p-0 hover:bg-red-100 touch-manipulation`}
          >
            <X className={`${isMobile ? 'w-4 h-4' : 'w-3 h-3'} text-red-600`} />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col h-full">
        <div className={`flex-1 ${showPreview ? 'h-1/2' : 'h-full'}`}>
          <CodeEditor
            language={codeWindow.language}
            code={codeWindow.code}
            onChange={handleCodeChange}
          />
        </div>
        
        {showPreview && ['html', 'css', 'javascript'].includes(codeWindow.language) && (
          <div className="h-1/2 border-t border-gray-200">
            <CodePreview
              language={codeWindow.language}
              code={codeWindow.code}
            />
          </div>
        )}
      </div>

      {/* Mobile-Optimized Resize Handle */}
      <div
        className={`absolute bottom-0 right-0 ${isMobile ? 'w-8 h-8' : 'w-4 h-4'} cursor-se-resize touch-manipulation`}
        onMouseDown={(e) => handleStart(e, 'resize')}
        onTouchStart={(e) => handleStart(e, 'resize')}
      >
        <GripHorizontal className={`${isMobile ? 'w-6 h-6' : 'w-3 h-3'} text-gray-400 transform rotate-45 absolute bottom-1 right-1`} />
      </div>
    </div>
  );
};

export default CodeWindow;
