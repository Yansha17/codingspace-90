
import React, { useRef, useState, useEffect, useCallback, memo } from 'react';
import FloatingWidgetEditor from './FloatingWidgetEditor';
import EnhancedMobileWidgetHeader from './EnhancedMobileWidgetHeader';
import MobileWidgetContent from './MobileWidgetContent';
import EnhancedMobileResizeHandle from './EnhancedMobileResizeHandle';
import FuturisticBottomEditor from './FuturisticBottomEditor';
import { getLanguageConfig } from '@/config/languages';
import { useUltraSmoothDrag } from '@/hooks/useUltraSmoothDrag';
import { useAutoSave } from '@/hooks/useAutoSave';

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
  showPreview?: boolean;
  previewKey?: number;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate?: () => void;
  onSaveToLibrary?: () => void;
  onTogglePreview?: () => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onResize: (size: { width: number; height: number }) => void;
  onPositionChange: (position: { x: number; y: number }) => void;
  onBringToFront: () => void;
  onCodeChange?: (code: string) => void;
}

const MobileWidget: React.FC<MobileWidgetProps> = memo(({
  title,
  langIcon,
  langName,
  code,
  position,
  size,
  zIndex,
  languageColor,
  showPreview = false,
  previewKey = 0,
  onEdit,
  onDelete,
  onDuplicate,
  onSaveToLibrary,
  onTogglePreview,
  onResize,
  onPositionChange,
  onBringToFront,
  onCodeChange
}) => {
  const [localShowPreview, setLocalShowPreview] = useState(showPreview);
  const [localPreviewKey, setLocalPreviewKey] = useState(previewKey);
  const [isMaximized, setIsMaximized] = useState(false);
  const [previousSize, setPreviousSize] = useState({ width: 0, height: 0 });
  const [previousPosition, setPreviousPosition] = useState({ x: 0, y: 0 });
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [localCode, setLocalCode] = useState(code);

  const langConfig = getLanguageConfig(title);

  // Auto-save functionality with improved debouncing
  useAutoSave({
    value: localCode,
    onSave: (newCode) => {
      if (onCodeChange && newCode !== code) {
        onCodeChange(newCode);
      }
    },
    delay: 150
  });

  // Ultra-smooth drag system
  const {
    elementRef,
    isDragging,
    startDrag,
    dragStyles
  } = useUltraSmoothDrag({
    onPositionChange,
    onDragStart: onBringToFront,
    elementWidth: size.width,
    elementHeight: size.height
  });

  // Sync with parent state
  useEffect(() => {
    setLocalShowPreview(showPreview);
  }, [showPreview]);

  useEffect(() => {
    setLocalPreviewKey(previewKey);
  }, [previewKey]);

  useEffect(() => {
    setLocalCode(code);
  }, [code]);

  // Update widget position via CSS for immediate feedback
  useEffect(() => {
    if (elementRef.current && !isDragging) {
      elementRef.current.style.left = `${position.x}px`;
      elementRef.current.style.top = `${position.y}px`;
    }
  }, [position.x, position.y, isDragging]);

  const handleEdit = useCallback(() => {
    setIsEditorOpen(true);
  }, []);

  const handleCloseEditor = useCallback(() => {
    setIsEditorOpen(false);
  }, []);

  const handleCodeChange = useCallback((newCode: string) => {
    setLocalCode(newCode);
  }, []);

  // Enhanced header interaction
  const handleHeaderInteraction = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const target = e.target as HTMLElement;
    
    // Check if the event comes from an interactive element
    const isInteractiveElement = target.closest('button') || 
                                target.closest('[data-radix-switch-root]') || 
                                target.closest('[role="switch"]') ||
                                target.closest('.switch-container') ||
                                target.closest('[data-resize-handle]');
    
    if (isInteractiveElement) {
      return;
    }

    // Start drag for any other interaction with the header
    startDrag(e);
  }, [startDrag]);

  const handleTogglePreview = useCallback(() => {
    if (onTogglePreview) {
      onTogglePreview();
    } else {
      setLocalShowPreview(!localShowPreview);
      setLocalPreviewKey(prev => prev + 1);
    }
  }, [localShowPreview, onTogglePreview]);

  const handleMaximize = useCallback(() => {
    if (isMaximized) {
      onResize(previousSize);
      onPositionChange(previousPosition);
      setIsMaximized(false);
    } else {
      setPreviousSize(size);
      setPreviousPosition(position);
      
      const newSize = { 
        width: window.innerWidth - 40, 
        height: window.innerHeight - 120 
      };
      const newPosition = { x: 20, y: 80 };
      
      onResize(newSize);
      onPositionChange(newPosition);
      setIsMaximized(true);
    }
  }, [isMaximized, size, position, onResize, onPositionChange, previousSize, previousPosition]);

  const handleRun = useCallback(() => {
    // For languages with preview capability, toggle to preview mode
    if (langConfig.previewable || ['html', 'css', 'javascript', 'js'].includes(title.toLowerCase())) {
      if (!localShowPreview) {
        handleTogglePreview();
      } else {
        // Refresh preview
        setLocalPreviewKey(prev => prev + 1);
      }
    } else {
      // For other languages, open the editor
      handleEdit();
    }
  }, [title, langConfig.previewable, localShowPreview, handleTogglePreview, handleEdit]);

  const handleResize = useCallback((newSize: { width: number; height: number }) => {
    onResize(newSize);
  }, [onResize]);

  const handlePinchZoom = useCallback((scale: number) => {
    const newWidth = Math.max(140, Math.min(window.innerWidth - 40, size.width * scale));
    const newHeight = Math.max(120, Math.min(window.innerHeight - 120, size.height * scale));
    onResize({ width: newWidth, height: newHeight });
  }, [size, onResize]);

  const currentShowPreview = onTogglePreview ? showPreview : localShowPreview;
  const currentPreviewKey = previewKey || localPreviewKey;

  return (
    <>
      <div
        ref={elementRef}
        className={`absolute rounded-xl shadow-2xl border overflow-hidden select-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        style={{
          left: position.x,
          top: position.y,
          width: Math.max(140, size.width),
          height: Math.max(120, size.height),
          zIndex: isDragging ? 9999 : zIndex,
          touchAction: 'none',
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          borderColor: isDragging ? '#10B981' : '#475569',
          userSelect: 'none',
          ...dragStyles
        }}
        onMouseDown={handleHeaderInteraction}
        onTouchStart={handleHeaderInteraction}
      >
        <EnhancedMobileWidgetHeader
          title={title}
          langName={langName}
          isMaximized={isMaximized}
          showPreview={currentShowPreview}
          previewKey={currentPreviewKey}
          onEdit={handleEdit}
          onDelete={onDelete}
          onTogglePreview={handleTogglePreview}
          onMaximize={handleMaximize}
          onRun={handleRun}
          onDuplicate={onDuplicate}
          onSaveToLibrary={onSaveToLibrary}
        />

        <MobileWidgetContent
          title={title}
          langName={langName}
          code={localCode}
          size={size}
          showPreview={currentShowPreview}
          previewKey={currentPreviewKey}
        />

        <EnhancedMobileResizeHandle
          onResize={handleResize}
          currentSize={size}
          onPinchZoom={handlePinchZoom}
        />
      </div>

      {/* Enhanced Bottom Editor */}
      <FuturisticBottomEditor
        isOpen={isEditorOpen}
        onClose={handleCloseEditor}
        title={title}
        language={langName}
        code={localCode}
        onChange={handleCodeChange}
        onRun={handleRun}
      />
    </>
  );
});

MobileWidget.displayName = 'MobileWidget';

export default MobileWidget;
