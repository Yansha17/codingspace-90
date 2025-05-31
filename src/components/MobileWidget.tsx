import React, { useRef, useState, useEffect, useCallback, memo } from 'react';
import FloatingWidgetEditor from './FloatingWidgetEditor';
import EnhancedMobileWidgetHeader from './EnhancedMobileWidgetHeader';
import MobileWidgetContent from './MobileWidgetContent';
import EnhancedMobileResizeHandle from './EnhancedMobileResizeHandle';
import { getLanguageConfig } from '@/config/languages';
import { useUltraSmoothDrag } from '@/hooks/useUltraSmoothDrag';

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

  const langConfig = getLanguageConfig(title);

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

  // Update widget position via CSS transform for immediate feedback
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
    if (onCodeChange) {
      onCodeChange(newCode);
    }
  }, [onCodeChange]);

  const handleHeaderMouseDown = useCallback((e: React.MouseEvent) => {
    console.log('Header mouse down triggered');
    e.preventDefault();
    e.stopPropagation();
    startDrag(e);
  }, [startDrag]);

  const handleHeaderTouchStart = useCallback((e: React.TouchEvent) => {
    console.log('Header touch start triggered');
    e.preventDefault();
    e.stopPropagation();
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
    console.log(`Running ${langName} code:`, code);
    if (langConfig.previewable) {
      handleTogglePreview();
    }
  }, [langName, code, langConfig.previewable, handleTogglePreview]);

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
          ...dragStyles
        }}
      >
        <div 
          data-widget-header
          onMouseDown={handleHeaderMouseDown}
          onTouchStart={handleHeaderTouchStart}
          className="cursor-grab active:cursor-grabbing"
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
        </div>

        <MobileWidgetContent
          title={title}
          langName={langName}
          code={code}
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

      <FloatingWidgetEditor
        isOpen={isEditorOpen}
        onClose={handleCloseEditor}
        title={title}
        language={langName}
        code={code}
        onChange={handleCodeChange}
        onDelete={onDelete}
        onRun={handleRun}
      />
    </>
  );
});

MobileWidget.displayName = 'MobileWidget';

export default MobileWidget;
