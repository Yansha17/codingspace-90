
import React, { useRef, useState, useEffect, useCallback, memo } from 'react';
import MobileCodeEditor from './MobileCodeEditor';
import EnhancedMobileWidgetHeader from './EnhancedMobileWidgetHeader';
import MobileWidgetContent from './MobileWidgetContent';
import EnhancedMobileResizeHandle from './EnhancedMobileResizeHandle';
import { getLanguageConfig } from '@/config/languages';
import { optimizeTransform } from '@/utils/performance';

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
  isDragging,
  showPreview = false,
  previewKey = 0,
  onEdit,
  onDelete,
  onDuplicate,
  onSaveToLibrary,
  onTogglePreview,
  onMouseDown,
  onTouchStart,
  onResize
}) => {
  const [localShowPreview, setLocalShowPreview] = useState(showPreview);
  const [localPreviewKey, setLocalPreviewKey] = useState(previewKey);
  const [isMaximized, setIsMaximized] = useState(false);
  const [previousSize, setPreviousSize] = useState({ width: 0, height: 0 });
  const [previousPosition, setPreviousPosition] = useState({ x: 0, y: 0 });
  const widgetRef = useRef<HTMLDivElement>(null);

  const langConfig = getLanguageConfig(title);

  // Sync with parent state
  useEffect(() => {
    setLocalShowPreview(showPreview);
  }, [showPreview]);

  useEffect(() => {
    setLocalPreviewKey(previewKey);
  }, [previewKey]);

  // Optimize drag performance with immediate transform updates
  useEffect(() => {
    if (widgetRef.current && isDragging) {
      optimizeTransform(widgetRef.current, position.x, position.y, 1.01);
    } else if (widgetRef.current) {
      widgetRef.current.style.transform = 'scale(1)';
      widgetRef.current.style.willChange = 'auto';
    }
  }, [position.x, position.y, isDragging]);

  const handleWidgetMouseDown = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    
    // Check if the click is on the header area for dragging
    const headerElement = target.closest('[data-widget-header]');
    const isButton = target.closest('button');
    const isResizeHandle = target.closest('[data-resize-handle]');
    
    // Only allow dragging from the header area and not from buttons or resize handle
    if (!headerElement || isButton || isResizeHandle) {
      return;
    }
    
    e.preventDefault();
    e.stopPropagation();
    onMouseDown(e);
  }, [onMouseDown]);

  const handleWidgetTouchStart = useCallback((e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    
    // Check if the touch is on the header area for dragging
    const headerElement = target.closest('[data-widget-header]');
    const isButton = target.closest('button');
    const isResizeHandle = target.closest('[data-resize-handle]');
    
    // Only allow dragging from the header area and not from buttons or resize handle
    if (!headerElement || isButton || isResizeHandle) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    onTouchStart(e);
  }, [onTouchStart]);

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
      setIsMaximized(false);
    } else {
      setPreviousSize(size);
      setPreviousPosition(position);
      
      const newSize = { 
        width: window.innerWidth - 40, 
        height: window.innerHeight - 120 
      };
      onResize(newSize);
      setIsMaximized(true);
    }
  }, [isMaximized, size, position, onResize, previousSize]);

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
    <div
      ref={widgetRef}
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
        boxShadow: isDragging 
          ? '0 20px 40px -8px rgba(0, 0, 0, 0.4), 0 0 15px rgba(16, 185, 129, 0.2)' 
          : '0 15px 20px -5px rgba(0, 0, 0, 0.25)',
        transition: isDragging ? 'none' : 'box-shadow 0.1s ease-out, border-color 0.1s ease-out',
        backfaceVisibility: 'hidden',
        perspective: '1000px',
        willChange: isDragging ? 'transform' : 'auto'
      }}
      onMouseDown={handleWidgetMouseDown}
      onTouchStart={handleWidgetTouchStart}
    >
      <div data-widget-header>
        <EnhancedMobileWidgetHeader
          title={title}
          langName={langName}
          isMaximized={isMaximized}
          showPreview={currentShowPreview}
          previewKey={currentPreviewKey}
          onEdit={onEdit}
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
  );
});

MobileWidget.displayName = 'MobileWidget';

export default MobileWidget;
