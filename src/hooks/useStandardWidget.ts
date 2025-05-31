
import { useState, useRef, useCallback, useEffect } from 'react';
import { CodeWindowType } from '@/types/CodeWindow';
import { 
  useOptimizedDragHandler, 
  useDebouncedCallback, 
  triggerHapticFeedback
} from '@/utils/performance';

export interface StandardWidgetActions {
  onUpdate: (id: string, updates: Partial<CodeWindowType>) => void;
  onBringToFront: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (id: string) => void;
}

export interface UseStandardWidgetProps {
  window: CodeWindowType;
  actions: StandardWidgetActions;
  isMobile?: boolean;
}

export const useStandardWidget = ({ window, actions, isMobile = false }: UseStandardWidgetProps) => {
  // State management
  const [isResizing, setIsResizing] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const [previousSize, setPreviousSize] = useState({ width: 0, height: 0 });
  const [previousPosition, setPreviousPosition] = useState({ x: 0, y: 0 });
  
  // Refs
  const elementRef = useRef<HTMLDivElement>(null);
  const windowIdRef = useRef(window.id);

  // Reset state when window changes
  useEffect(() => {
    if (windowIdRef.current !== window.id) {
      windowIdRef.current = window.id;
      setIsMaximized(false);
      setShowPreview(false);
      setIsResizing(false);
    }
  }, [window.id]);

  // Enhanced resize start - only handles resizing, no dragging
  const handleResizeStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsResizing(true);
    triggerHapticFeedback('medium');
  }, []);

  // Ultra-optimized resize handler
  const handleResizeMove = useOptimizedDragHandler((e: MouseEvent | TouchEvent) => {
    if (!isResizing || !elementRef.current || isMaximized) return;
    
    e.preventDefault();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const rect = elementRef.current.getBoundingClientRect();
    const newWidth = Math.max(
      isMobile ? 140 : 300, 
      Math.min(globalThis.window.innerWidth - rect.left, clientX - rect.left + 10)
    );
    const newHeight = Math.max(
      120, 
      Math.min(globalThis.window.innerHeight - rect.top, clientY - rect.top + 10)
    );
    
    // Direct DOM manipulation for smooth resizing
    elementRef.current.style.width = `${newWidth}px`;
    elementRef.current.style.height = `${newHeight}px`;
    
    actions.onUpdate(window.id, {
      size: { width: newWidth, height: newHeight }
    });
  }, [isResizing, window.id, actions.onUpdate, isMobile, isMaximized]);

  // End resize
  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
    
    // Reset will-change for performance
    if (elementRef.current) {
      elementRef.current.style.willChange = 'auto';
    }
  }, []);

  // Global event listeners for resize only
  useEffect(() => {
    if (isResizing) {
      const options = { passive: false };
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd, { passive: true });
      document.addEventListener('touchmove', handleResizeMove, options);
      document.addEventListener('touchend', handleResizeEnd, { passive: true });
      
      return () => {
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('mouseup', handleResizeEnd);
        document.removeEventListener('touchmove', handleResizeMove);
        document.removeEventListener('touchend', handleResizeEnd);
      };
    }
  }, [isResizing, handleResizeMove, handleResizeEnd]);

  // Standard widget actions with smoother feedback
  const toggleMaximize = useCallback(() => {
    triggerHapticFeedback('medium');
    if (isMaximized) {
      actions.onUpdate(window.id, {
        size: previousSize,
        position: previousPosition
      });
      setIsMaximized(false);
    } else {
      setPreviousSize(window.size);
      setPreviousPosition(window.position);
      
      actions.onUpdate(window.id, {
        size: { 
          width: globalThis.window.innerWidth - 40, 
          height: globalThis.window.innerHeight - 120 
        },
        position: { x: 20, y: 80 }
      });
      setIsMaximized(true);
    }
  }, [isMaximized, window.id, window.size, window.position, actions.onUpdate, previousSize, previousPosition]);

  const togglePreview = useCallback(() => {
    setShowPreview(!showPreview);
    if (!showPreview) {
      setPreviewKey(prev => prev + 1);
    }
    triggerHapticFeedback('light');
  }, [showPreview]);

  const handleEdit = useCallback(() => {
    triggerHapticFeedback('medium');
    if (actions.onEdit) {
      actions.onEdit(window.id);
    }
  }, [window.id, actions.onEdit]);

  const handleDelete = useCallback(() => {
    triggerHapticFeedback('heavy');
    actions.onDelete(window.id);
  }, [window.id, actions.onDelete]);

  const handleCodeChange = useDebouncedCallback((newCode: string) => {
    actions.onUpdate(window.id, { code: newCode });
  }, 50, [window.id, actions.onUpdate]);

  return {
    // State
    isDragging: false, // Dragging is now handled by useUltraSmoothDrag
    isResizing,
    isMaximized,
    showPreview,
    previewKey,
    
    // Refs
    elementRef,
    
    // Handlers - removed drag handlers
    handleDragStart: () => {}, // Placeholder - actual dragging handled by useUltraSmoothDrag
    handleResizeStart,
    toggleMaximize,
    togglePreview,
    handleEdit,
    handleDelete,
    handleCodeChange,
    
    // Computed styles - simplified since no dragging here
    dragStyles: {
      boxShadow: '0 15px 20px -5px rgba(0, 0, 0, 0.25)',
      zIndex: window.zIndex,
      transition: 'all 0.1s ease-out',
      willChange: isResizing ? 'width, height' : 'auto',
      backfaceVisibility: 'hidden' as const,
      perspective: '1000px'
    }
  };
};
