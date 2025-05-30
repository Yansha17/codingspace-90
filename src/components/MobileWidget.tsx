
import React, { useRef, useState, useEffect, useCallback, memo } from 'react';
import MobileCodeEditor from './MobileCodeEditor';
import MobileWidgetHeader from './MobileWidgetHeader';
import MobileWidgetContent from './MobileWidgetContent';
import MobileWidgetResizeHandle from './MobileWidgetResizeHandle';
import MobileWidgetDragIndicator from './MobileWidgetDragIndicator';
import { getLanguageConfig } from '@/config/languages';

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
  isMaximized?: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePreview?: () => void;
  onMaximize?: () => void;
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
  isMaximized = false,
  onEdit,
  onDelete,
  onTogglePreview,
  onMaximize,
  onMouseDown,
  onTouchStart,
  onResize
}) => {
  const [localShowPreview, setLocalShowPreview] = useState(showPreview);
  const [localPreviewKey, setLocalPreviewKey] = useState(previewKey);
  const widgetRef = useRef<HTMLDivElement>(null);

  const langConfig = getLanguageConfig(title);

  // Sync with parent state
  useEffect(() => {
    setLocalShowPreview(showPreview);
  }, [showPreview]);

  useEffect(() => {
    setLocalPreviewKey(previewKey);
  }, [previewKey]);

  const handleWidgetMouseDown = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('[data-resize-handle]')) {
      return;
    }
    
    e.preventDefault();
    e.stopPropagation();
    onMouseDown(e);
  }, [onMouseDown]);

  const handleWidgetTouchStart = useCallback((e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('[data-resize-handle]')) {
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

  const handleRun = useCallback(() => {
    console.log(`Running ${langName} code:`, code);
    if (langConfig.previewable) {
      handleTogglePreview();
    }
  }, [langName, code, langConfig.previewable, handleTogglePreview]);

  const currentShowPreview = onTogglePreview ? showPreview : localShowPreview;
  const currentPreviewKey = previewKey || localPreviewKey;

  return (
    <>
      <div
        ref={widgetRef}
        className={`absolute rounded-xl shadow-2xl border overflow-hidden select-none will-change-transform ${
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
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 20px rgba(16, 185, 129, 0.3)' 
            : '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
          transform: isDragging ? 'scale(1.02)' : 'scale(1)',
          transition: isDragging ? 'none' : 'all 0.15s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
          backfaceVisibility: 'hidden',
          perspective: '1000px'
        }}
        onMouseDown={handleWidgetMouseDown}
        onTouchStart={handleWidgetTouchStart}
      >
        <MobileWidgetDragIndicator isDragging={isDragging} />

        <MobileWidgetHeader
          title={title}
          langName={langName}
          isMaximized={isMaximized}
          showPreview={currentShowPreview}
          previewKey={currentPreviewKey}
          onEdit={onEdit}
          onDelete={onDelete}
          onTogglePreview={handleTogglePreview}
          onMaximize={onMaximize}
          onRun={handleRun}
        />

        <MobileWidgetContent
          title={title}
          langName={langName}
          code={code}
          size={size}
          showPreview={currentShowPreview}
          previewKey={currentPreviewKey}
        />

        <MobileWidgetResizeHandle
          onResize={onResize}
          currentSize={size}
        />
      </div>
    </>
  );
});

MobileWidget.displayName = 'MobileWidget';

export default MobileWidget;
