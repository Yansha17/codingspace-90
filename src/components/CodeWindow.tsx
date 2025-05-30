
import React, { useState, useRef, useCallback, useEffect, memo } from 'react';
import { CodeWindowType } from '@/types/CodeWindow';
import CodeEditor from './CodeEditor';
import CodePreview from './CodePreview';
import MobileCodeEditor from './MobileCodeEditor';
import WindowHeader from './WindowHeader';
import MobileWidget from './MobileWidget';
import WindowResizeHandle from './WindowResizeHandle';
import { getLanguageConfig } from '@/config/languages';
import { 
  triggerHapticFeedback, 
  useOptimizedDragHandler,
  useDebouncedCallback,
  optimizeTransform
} from '@/utils/performance';

interface CodeWindowProps {
  window: CodeWindowType;
  onUpdate: (id: string, updates: Partial<CodeWindowType>) => void;
  onBringToFront: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (id: string) => void;
}

const CodeWindow: React.FC<CodeWindowProps> = memo(({
  window: codeWindow,
  onUpdate,
  onBringToFront,
  onDelete,
  onEdit
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showPreview, setShowPreview] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileEditorOpen, setMobileEditorOpen] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const [isMaximized, setIsMaximized] = useState(false);
  const [previousSize, setPreviousSize] = useState({ width: 0, height: 0 });
  const [previousPosition, setPreviousPosition] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);
  const windowIdRef = useRef(codeWindow.id);

  const langConfig = getLanguageConfig(codeWindow.language);

  // Keep track of window identity to prevent state mixing
  useEffect(() => {
    if (windowIdRef.current !== codeWindow.id) {
      console.log(`Window ID changed from ${windowIdRef.current} to ${codeWindow.id}`);
      windowIdRef.current = codeWindow.id;
      setIsMaximized(false);
      setShowPreview(false);
      setMobileEditorOpen(false);
    }
  }, [codeWindow.id]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(globalThis.window.innerWidth <= 768 || 'ontouchstart' in globalThis.window);
    };
    checkMobile();
    globalThis.window.addEventListener('resize', checkMobile);
    return () => globalThis.window.removeEventListener('resize', checkMobile);
  }, []);

  const handleStart = useCallback((e: React.MouseEvent | React.TouchEvent, action: 'drag' | 'resize') => {
    e.preventDefault();
    e.stopPropagation();
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    onBringToFront(codeWindow.id);
    triggerHapticFeedback('light');
    
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

  // Optimized move handler with fast throttling for smooth dragging
  const handleMove = useOptimizedDragHandler((e: MouseEvent | TouchEvent) => {
    if (!isDragging && !isResizing) return;
    
    e.preventDefault();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    if (isDragging && !isMaximized) {
      const newX = Math.max(0, Math.min(globalThis.window.innerWidth - 120, clientX - dragOffset.x));
      const newY = Math.max(60, Math.min(globalThis.window.innerHeight - 120, clientY - dragOffset.y));
      
      // Direct DOM manipulation for immediate visual feedback
      if (windowRef.current) {
        optimizeTransform(windowRef.current, newX, newY);
      }
      
      // Debounced state update
      onUpdate(codeWindow.id, {
        position: { x: newX, y: newY }
      });
    } else if (isResizing && windowRef.current && !isMaximized) {
      const rect = windowRef.current.getBoundingClientRect();
      const newWidth = Math.max(isMobile ? 140 : 300, Math.min(globalThis.window.innerWidth - rect.left, clientX - rect.left + 10));
      const newHeight = Math.max(120, Math.min(globalThis.window.innerHeight - rect.top, clientY - rect.top + 10));
      
      // Direct DOM manipulation for smooth resizing
      windowRef.current.style.width = `${newWidth}px`;
      windowRef.current.style.height = `${newHeight}px`;
      
      // Debounced state update
      onUpdate(codeWindow.id, {
        size: { width: newWidth, height: newHeight }
      });
    }
  }, [isDragging, isResizing, dragOffset, codeWindow.id, onUpdate, isMobile, isMaximized]);

  const handleEnd = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);

  const toggleMaximize = useCallback(() => {
    triggerHapticFeedback('medium');
    if (isMaximized) {
      onUpdate(codeWindow.id, {
        size: previousSize,
        position: previousPosition
      });
      setIsMaximized(false);
    } else {
      setPreviousSize(codeWindow.size);
      setPreviousPosition(codeWindow.position);
      
      onUpdate(codeWindow.id, {
        size: { 
          width: globalThis.window.innerWidth - 40, 
          height: globalThis.window.innerHeight - 120 
        },
        position: { x: 20, y: 80 }
      });
      setIsMaximized(true);
    }
  }, [isMaximized, codeWindow.id, codeWindow.size, codeWindow.position, onUpdate, previousSize, previousPosition]);

  useEffect(() => {
    if (isDragging || isResizing) {
      const options = { passive: false };
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleEnd, { passive: true });
      document.addEventListener('touchmove', handleMove, options);
      document.addEventListener('touchend', handleEnd, { passive: true });
    }

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, isResizing, handleMove, handleEnd]);

  const handleCodeChange = useDebouncedCallback((newCode: string) => {
    onUpdate(codeWindow.id, { code: newCode });
  }, 100, [codeWindow.id, onUpdate]);

  const handleRunCode = useCallback(() => {
    console.log(`Running ${codeWindow.language} code:`, codeWindow.code);
    triggerHapticFeedback('medium');
    if (langConfig.previewable) {
      setShowPreview(true);
      setPreviewKey(prev => prev + 1);
    }
  }, [codeWindow.language, codeWindow.code, langConfig.previewable]);

  const handleTogglePreview = useCallback(() => {
    setShowPreview(!showPreview);
    if (!showPreview) {
      setPreviewKey(prev => prev + 1);
    }
    triggerHapticFeedback('light');
  }, [showPreview]);

  const handleEdit = useCallback(() => {
    triggerHapticFeedback('medium');
    if (onEdit) {
      onEdit(codeWindow.id);
    } else {
      setMobileEditorOpen(true);
    }
  }, [codeWindow.id, onEdit]);

  const handleWidgetResize = useDebouncedCallback((newSize: { width: number; height: number }) => {
    onUpdate(codeWindow.id, { size: newSize });
  }, 50, [codeWindow.id, onUpdate]);

  // Mobile widget mode - smaller, simplified interface
  if (isMobile && codeWindow.size.width < 300) {
    return (
      <>
        <MobileWidget
          title={codeWindow.title}
          langIcon={langConfig.name}
          langName={langConfig.name}
          code={codeWindow.code}
          position={codeWindow.position}
          size={codeWindow.size}
          zIndex={codeWindow.zIndex}
          languageColor={langConfig.borderColor}
          isDragging={isDragging}
          onEdit={handleEdit}
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
      className={`absolute bg-white rounded-lg shadow-xl border-2 ${langConfig.borderColor} ${
        isDragging ? 'cursor-grabbing shadow-2xl scale-105' : 'cursor-grab'
      } select-none overflow-hidden transition-transform duration-100 will-change-transform`}
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
        langColor={langConfig.color}
        langIcon={langConfig.name}
        isMobile={isMobile}
        showPreview={showPreview}
        canRun={langConfig.runnable}
        canPreview={langConfig.previewable}
        onRun={handleRunCode}
        onTogglePreview={handleTogglePreview}
        onDelete={() => onDelete(codeWindow.id)}
        onEdit={handleEdit}
        onMaximize={toggleMaximize}
        isMaximized={isMaximized}
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
        
        {showPreview && langConfig.previewable && (
          <div className="h-1/2 border-t border-gray-200">
            <CodePreview
              key={previewKey}
              language={codeWindow.language}
              code={codeWindow.code}
            />
          </div>
        )}
      </div>

      {!isMaximized && (
        <WindowResizeHandle
          isMobile={isMobile}
          onMouseDown={(e) => handleStart(e, 'resize')}
          onTouchStart={(e) => handleStart(e, 'resize')}
        />
      )}
    </div>
  );
});

CodeWindow.displayName = 'CodeWindow';

export default CodeWindow;
