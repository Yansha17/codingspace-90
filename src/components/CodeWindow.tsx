
import React, { useState, useRef, useCallback, useEffect, memo } from 'react';
import { CodeWindowType } from '@/types/CodeWindow';
import CodeEditor from './CodeEditor';
import CodePreview from './CodePreview';
import MobileCodeEditor from './MobileCodeEditor';
import WindowHeader from './WindowHeader';
import MobileWidget from './MobileWidget';
import WindowResizeHandle from './WindowResizeHandle';
import { getLanguageConfig } from '@/config/languages';
import { useStandardWidget, StandardWidgetActions } from '@/hooks/useStandardWidget';

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
  const [isMobile, setIsMobile] = useState(false);
  const [mobileEditorOpen, setMobileEditorOpen] = useState(false);

  const langConfig = getLanguageConfig(codeWindow.language);

  // Check mobile status
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(globalThis.window.innerWidth <= 768 || 'ontouchstart' in globalThis.window);
    };
    checkMobile();
    globalThis.window.addEventListener('resize', checkMobile);
    return () => globalThis.window.removeEventListener('resize', checkMobile);
  }, []);

  // Standard widget actions
  const actions: StandardWidgetActions = {
    onUpdate,
    onBringToFront,
    onDelete,
    onEdit: onEdit || (() => setMobileEditorOpen(true))
  };

  // Use the standardized widget hook
  const {
    isDragging,
    isResizing,
    isMaximized,
    showPreview,
    previewKey,
    elementRef,
    handleDragStart,
    handleResizeStart,
    toggleMaximize,
    togglePreview,
    handleEdit,
    handleDelete,
    handleCodeChange,
    dragStyles
  } = useStandardWidget({ 
    window: codeWindow, 
    actions, 
    isMobile 
  });

  const handleRunCode = useCallback(() => {
    console.log(`Running ${codeWindow.language} code:`, codeWindow.code);
    if (langConfig.previewable) {
      togglePreview();
    }
  }, [codeWindow.language, codeWindow.code, langConfig.previewable, togglePreview]);

  const handleWidgetResize = useCallback((newSize: { width: number; height: number }) => {
    onUpdate(codeWindow.id, { size: newSize });
  }, [codeWindow.id, onUpdate]);

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
          showPreview={showPreview}
          previewKey={previewKey}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onTogglePreview={togglePreview}
          onMaximize={toggleMaximize}
          isMaximized={isMaximized}
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
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
      ref={elementRef}
      className={`absolute bg-white rounded-lg shadow-xl border-2 ${langConfig.borderColor} select-none overflow-hidden will-change-transform`}
      style={{
        left: codeWindow.position.x,
        top: codeWindow.position.y,
        width: codeWindow.size.width,
        height: codeWindow.size.height,
        touchAction: 'none',
        ...dragStyles
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
        onTogglePreview={togglePreview}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onMaximize={toggleMaximize}
        isMaximized={isMaximized}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
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
          onMouseDown={handleResizeStart}
          onTouchStart={handleResizeStart}
        />
      )}
    </div>
  );
});

CodeWindow.displayName = 'CodeWindow';

export default CodeWindow;
