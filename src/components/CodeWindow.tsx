
import React, { useState, useRef, useCallback, useEffect, memo } from 'react';
import { CodeWindowType } from '@/types/CodeWindow';
import CodeEditor from './CodeEditor';
import CodePreview from './CodePreview';
import BottomEditor from './BottomEditor';
import WindowHeader from './WindowHeader';
import MobileWidget from './MobileWidget';
import WindowResizeHandle from './WindowResizeHandle';
import { getLanguageConfig } from '@/config/languages';
import { useStandardWidget, StandardWidgetActions } from '@/hooks/useStandardWidget';
import FuturisticBottomEditor from './FuturisticBottomEditor';
import { useAutoSave } from '@/hooks/useAutoSave';

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
  const [bottomEditorOpen, setBottomEditorOpen] = useState(false);
  const [localCode, setLocalCode] = useState(codeWindow.code);

  const langConfig = getLanguageConfig(codeWindow.language);

  // Auto-save functionality
  useAutoSave({
    value: localCode,
    onSave: (newCode) => {
      onUpdate(codeWindow.id, { code: newCode });
    },
    delay: 300
  });

  // Check mobile status
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(globalThis.window.innerWidth <= 768 || 'ontouchstart' in globalThis.window);
    };
    checkMobile();
    globalThis.window.addEventListener('resize', checkMobile);
    return () => globalThis.window.removeEventListener('resize', checkMobile);
  }, []);

  // Sync local code with window code
  useEffect(() => {
    setLocalCode(codeWindow.code);
  }, [codeWindow.code]);

  // Standard widget actions
  const actions: StandardWidgetActions = {
    onUpdate,
    onBringToFront,
    onDelete,
    onEdit: onEdit || (() => setBottomEditorOpen(true))
  };

  // Use the standardized widget hook
  const {
    isResizing,
    isMaximized,
    showPreview,
    previewKey,
    elementRef,
    handleResizeStart,
    toggleMaximize,
    togglePreview,
    handleEdit,
    handleDelete,
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

  const handleWidgetPositionChange = useCallback((position: { x: number; y: number }) => {
    onUpdate(codeWindow.id, { position });
  }, [codeWindow.id, onUpdate]);

  const handleWidgetBringToFront = useCallback(() => {
    onBringToFront(codeWindow.id);
  }, [codeWindow.id, onBringToFront]);

  const handleLocalCodeChange = useCallback((newCode: string) => {
    setLocalCode(newCode);
  }, []);

  const handleEditClick = useCallback(() => {
    setBottomEditorOpen(true);
  }, []);

  const handleCloseBottomEditor = useCallback(() => {
    setBottomEditorOpen(false);
  }, []);

  // Mobile widget mode - smaller, simplified interface
  if (isMobile && codeWindow.size.width < 300) {
    return (
      <>
        <MobileWidget
          title={codeWindow.title}
          langIcon={langConfig.name}
          langName={langConfig.name}
          code={localCode}
          position={codeWindow.position}
          size={codeWindow.size}
          zIndex={codeWindow.zIndex}
          languageColor={langConfig.borderColor}
          isDragging={false}
          showPreview={showPreview}
          previewKey={previewKey}
          onEdit={handleEditClick}
          onDelete={handleDelete}
          onTogglePreview={togglePreview}
          onMouseDown={() => {}}
          onTouchStart={() => {}}
          onResize={handleWidgetResize}
          onPositionChange={handleWidgetPositionChange}
          onBringToFront={handleWidgetBringToFront}
          onCodeChange={handleLocalCodeChange}
        />

        <FuturisticBottomEditor
          isOpen={bottomEditorOpen}
          onClose={handleCloseBottomEditor}
          title={codeWindow.title}
          language={codeWindow.language}
          code={localCode}
          onChange={handleLocalCodeChange}
          onRun={handleRunCode}
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
        onEdit={handleEditClick}
        onMaximize={toggleMaximize}
        isMaximized={isMaximized}
        onMouseDown={() => {}}
        onTouchStart={() => {}}
      />

      {/* Content */}
      <div className="flex flex-col h-full">
        <div className={`flex-1 ${showPreview ? 'h-1/2' : 'h-full'}`}>
          <CodeEditor
            language={codeWindow.language}
            code={localCode}
            onChange={handleLocalCodeChange}
          />
        </div>
        
        {showPreview && langConfig.previewable && (
          <div className="h-1/2 border-t border-gray-200">
            <CodePreview
              key={previewKey}
              language={codeWindow.language}
              code={localCode}
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

      {/* Futuristic Bottom Editor for desktop mode */}
      <FuturisticBottomEditor
        isOpen={bottomEditorOpen}
        onClose={handleCloseBottomEditor}
        title={codeWindow.title}
        language={codeWindow.language}
        code={localCode}
        onChange={handleLocalCodeChange}
        onRun={handleRunCode}
      />
    </div>
  );
});

CodeWindow.displayName = 'CodeWindow';

export default CodeWindow;
