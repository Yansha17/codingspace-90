import React, { useState, useRef, useCallback, useEffect } from 'react';
import { CodeWindowType } from '@/types/CodeWindow';
import CodeEditor from './CodeEditor';
import CodePreview from './CodePreview';
import MobileCodeEditor from './MobileCodeEditor';
import WindowHeader from './WindowHeader';
import MobileWidget from './MobileWidget';
import WindowResizeHandle from './WindowResizeHandle';

interface CodeWindowProps {
  window: CodeWindowType;
  onUpdate: (id: string, updates: Partial<CodeWindowType>) => void;
  onBringToFront: (id: string) => void;
  onDelete: (id: string) => void;
}

const LANGUAGES = {
  javascript: { name: 'JavaScript', color: '#F7DF1E', icon: '⚡' },
  python: { name: 'Python', color: '#3776AB', icon: '🐍' },
  html: { name: 'HTML', color: '#E34F26', icon: '🌐' },
  css: { name: 'CSS', color: '#1572B6', icon: '🎨' },
  react: { name: 'React', color: '#61DAFB', icon: '⚛️' },
  vue: { name: 'Vue', color: '#4FC08D', icon: '💚' },
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
  const [previewKey, setPreviewKey] = useState(0);
  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(globalThis.window.innerWidth <= 768 || 'ontouchstart' in globalThis.window);
    };
    checkMobile();
    globalThis.window.addEventListener('resize', checkMobile);
    return () => globalThis.window.removeEventListener('resize', checkMobile);
  }, []);

  // Updated language colors to match the new design
  const languageColors = {
    javascript: 'border-yellow-400 bg-yellow-50',
    html: 'border-orange-400 bg-orange-50',
    css: 'border-blue-400 bg-blue-50',
    react: 'border-cyan-400 bg-cyan-50',
    vue: 'border-green-400 bg-green-50',
    python: 'border-blue-600 bg-blue-50',
    java: 'border-blue-700 bg-blue-50',
    cpp: 'border-blue-800 bg-blue-50',
    php: 'border-purple-500 bg-purple-50',
    swift: 'border-orange-500 bg-orange-50',
    go: 'border-cyan-500 bg-cyan-50',
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
      const newX = Math.max(0, Math.min(globalThis.window.innerWidth - 120, clientX - dragOffset.x));
      const newY = Math.max(60, Math.min(globalThis.window.innerHeight - 120, clientY - dragOffset.y));
      
      onUpdate(codeWindow.id, {
        position: { x: newX, y: newY }
      });
    } else if (isResizing && windowRef.current) {
      const rect = windowRef.current.getBoundingClientRect();
      const newWidth = Math.max(isMobile ? 140 : 300, Math.min(globalThis.window.innerWidth - rect.left, clientX - rect.left + 10));
      const newHeight = Math.max(120, Math.min(globalThis.window.innerHeight - rect.top, clientY - rect.top + 10));
      
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
      const options = { passive: false };
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleMove, options);
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
      setPreviewKey(prev => prev + 1);
    }
  }, [codeWindow.language, codeWindow.code]);

  const handleTogglePreview = useCallback(() => {
    setShowPreview(!showPreview);
    if (!showPreview) {
      setPreviewKey(prev => prev + 1);
    }
  }, [showPreview]);

  const canRun = ['javascript', 'python', 'html', 'css'].includes(codeWindow.language);
  const canPreview = ['html', 'css', 'javascript'].includes(codeWindow.language);

  // Handle widget resize from MobileWidget component
  const handleWidgetResize = useCallback((newSize: { width: number; height: number }) => {
    onUpdate(codeWindow.id, { size: newSize });
  }, [codeWindow.id, onUpdate]);

  // Mobile widget mode - smaller, simplified interface
  if (isMobile && codeWindow.size.width < 300) {
    return (
      <>
        <MobileWidget
          title={codeWindow.title}
          langIcon={lang.icon}
          langName={lang.name}
          code={codeWindow.code}
          position={codeWindow.position}
          size={codeWindow.size}
          zIndex={codeWindow.zIndex}
          languageColor={languageColor}
          isDragging={isDragging}
          onEdit={() => setMobileEditorOpen(true)}
          onDelete={() => onDelete(codeWindow.id)}
          onMouseDown={(e) => handleStart(e, 'drag')}
          onTouchStart={(e) => handleStart(e, 'drag')}
          onResize={handleWidgetResize}
        />

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
      <WindowHeader
        title={codeWindow.title}
        language={codeWindow.language}
        langColor={lang.color}
        langIcon={lang.icon}
        isMobile={isMobile}
        showPreview={showPreview}
        canRun={canRun}
        canPreview={canPreview}
        onRun={handleRunCode}
        onTogglePreview={handleTogglePreview}
        onDelete={() => onDelete(codeWindow.id)}
        onMouseDown={(e) => handleStart(e, 'drag')}
        onTouchStart={(e) => handleStart(e, 'drag')}
      />

      {/* Content */}
      <div className="flex flex-col h-full">
        <div className={`flex-1 ${showPreview ? 'h-1/2' : 'h-full'}`}>
          <CodeEditor
            language={codeWindow.language}
            code={codeWindow.code}
            onChange={handleCodeChange}
          />
        </div>
        
        {showPreview && canPreview && (
          <div className="h-1/2 border-t border-gray-200">
            <CodePreview
              key={previewKey}
              language={codeWindow.language}
              code={codeWindow.code}
            />
          </div>
        )}
      </div>

      <WindowResizeHandle
        isMobile={isMobile}
        onMouseDown={(e) => handleStart(e, 'resize')}
        onTouchStart={(e) => handleStart(e, 'resize')}
      />
    </div>
  );
};

export default CodeWindow;
