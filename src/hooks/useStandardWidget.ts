
import { useState, useRef, useCallback, useEffect } from 'react';
import { CodeWindowType } from '@/types/CodeWindow';
import { 
  useOptimizedDragHandler, 
  useDebouncedCallback, 
  triggerHapticFeedback,
  optimizeTransform 
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
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
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
      setIsDragging(false);
      setIsResizing(false);
    }
  }, [window.id]);

  // Enhanced drag start with proper offset calculation
  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    actions.onBringToFront(window.id);
    triggerHapticFeedback('light');
    
    setIsDragging(true);
    
    // Calculate offset from click point within the element
    const rect = elementRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: clientX - rect.left,
        y: clientY - rect.top
      });
    }
  }, [window.id, actions.onBringToFront]);

  // Enhanced resize start
  const handleResizeStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsResizing(true);
    triggerHapticFeedback('medium');
  }, []);

  // Ultra-optimized drag handler with proper offset maintenance
  const handleDragMove = useOptimizedDragHandler((e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    
    e.preventDefault();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    // Calculate new position maintaining the drag offset
    const newX = Math.max(0, Math.min(
      globalThis.window.innerWidth - 120, 
      clientX - dragOffset.x
    ));
    const newY = Math.max(60, Math.min(
      globalThis.window.innerHeight - 120, 
      clientY - dragOffset.y
    ));
    
    // Immediate visual feedback with hardware acceleration
    if (elementRef.current) {
      optimizeTransform(elementRef.current, newX, newY);
    }
    
    // Update state immediately for smooth feedback
    actions.onUpdate(window.id, {
      position: { x: newX, y: newY }
    });
  }, [isDragging, dragOffset, window.id, actions.onUpdate]);

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

  // End drag/resize
  const handleEnd = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    
    // Reset will-change for performance
    if (elementRef.current) {
      elementRef.current.style.willChange = 'auto';
    }
  }, []);

  // Global event listeners with passive optimization
  useEffect(() => {
    if (isDragging || isResizing) {
      const options = { passive: false };
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleEnd, { passive: true });
      document.addEventListener('touchmove', handleDragMove, options);
      document.addEventListener('touchend', handleEnd, { passive: true });
      
      return () => {
        document.removeEventListener('mousemove', handleDragMove);
        document.removeEventListener('mouseup', handleEnd);
        document.removeEventListener('touchmove', handleDragMove);
        document.removeEventListener('touchend', handleEnd);
      };
    }
  }, [isDragging, isResizing, handleDragMove, handleEnd]);

  // Standard widget actions with faster feedback
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
    isDragging,
    isResizing,
    isMaximized,
    showPreview,
    previewKey,
    
    // Refs
    elementRef,
    
    // Handlers
    handleDragStart,
    handleResizeStart,
    toggleMaximize,
    togglePreview,
    handleEdit,
    handleDelete,
    handleCodeChange,
    
    // Computed styles with hardware acceleration
    dragStyles: {
      cursor: isDragging ? 'grabbing' : 'grab',
      transform: isDragging ? 'scale(1.02)' : 'scale(1)',
      boxShadow: isDragging 
        ? '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 20px rgba(16, 185, 129, 0.3)' 
        : '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
      zIndex: isDragging ? 9999 : window.zIndex,
      transition: isDragging ? 'none' : 'all 0.15s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      willChange: isDragging || isResizing ? 'transform' : 'auto',
      backfaceVisibility: 'hidden' as const,
      perspective: '1000px'
    }
  };
};
