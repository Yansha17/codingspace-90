
import { useState, useRef, useCallback, useEffect } from 'react';
import { 
  useOptimizedDragHandler, 
  useDebouncedCallback, 
  triggerHapticFeedback,
  optimizeTransform,
  optimizeResize
} from '@/utils/performance';

export interface UseOptimizedWidgetProps {
  id: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  onUpdate: (updates: any) => void;
  onBringToFront: () => void;
}

export const useOptimizedWidget = ({ 
  id, 
  position, 
  size, 
  onUpdate, 
  onBringToFront 
}: UseOptimizedWidgetProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [previousState, setPreviousState] = useState({ size, position });
  
  const elementRef = useRef<HTMLDivElement>(null);

  // Optimized drag handler
  const handleDragMove = useOptimizedDragHandler((e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    
    e.preventDefault();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const newX = Math.max(0, Math.min(window.innerWidth - 120, clientX - dragOffset.x));
    const newY = Math.max(60, Math.min(window.innerHeight - 120, clientY - dragOffset.y));
    
    // Immediate visual feedback
    if (elementRef.current) {
      optimizeTransform(elementRef.current, newX, newY);
    }
    
    onUpdate({ position: { x: newX, y: newY } });
  }, [isDragging, dragOffset, onUpdate]);

  // Optimized resize handler
  const handleResizeMove = useOptimizedDragHandler((e: MouseEvent | TouchEvent) => {
    if (!isResizing || !elementRef.current) return;
    
    e.preventDefault();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const rect = elementRef.current.getBoundingClientRect();
    const newWidth = Math.max(140, Math.min(window.innerWidth - rect.left, clientX - rect.left + 10));
    const newHeight = Math.max(120, Math.min(window.innerHeight - rect.top, clientY - rect.top + 10));
    
    // Direct DOM manipulation for smooth resizing
    optimizeResize(elementRef.current, newWidth, newHeight);
    
    onUpdate({ size: { width: newWidth, height: newHeight } });
  }, [isResizing, onUpdate]);

  // Start drag
  const startDrag = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    onBringToFront();
    triggerHapticFeedback('light');
    
    setIsDragging(true);
    
    const rect = elementRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: clientX - rect.left,
        y: clientY - rect.top
      });
    }
  }, [onBringToFront]);

  // Start resize
  const startResize = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsResizing(true);
    triggerHapticFeedback('medium');
  }, []);

  // End interaction
  const endInteraction = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    
    if (elementRef.current) {
      elementRef.current.style.willChange = 'auto';
    }
  }, []);

  // Toggle maximize
  const toggleMaximize = useCallback(() => {
    triggerHapticFeedback('medium');
    
    if (isMaximized) {
      onUpdate(previousState);
      setIsMaximized(false);
    } else {
      setPreviousState({ size, position });
      onUpdate({
        size: { 
          width: window.innerWidth - 40, 
          height: window.innerHeight - 120 
        },
        position: { x: 20, y: 80 }
      });
      setIsMaximized(true);
    }
  }, [isMaximized, size, position, previousState, onUpdate]);

  // Global event listeners
  useEffect(() => {
    if (isDragging || isResizing) {
      const options = { passive: false };
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', endInteraction, { passive: true });
      document.addEventListener('touchmove', handleDragMove, options);
      document.addEventListener('touchend', endInteraction, { passive: true });
      
      return () => {
        document.removeEventListener('mousemove', handleDragMove);
        document.removeEventListener('mouseup', endInteraction);
        document.removeEventListener('touchmove', handleDragMove);
        document.removeEventListener('touchend', endInteraction);
      };
    }
  }, [isDragging, isResizing, handleDragMove, endInteraction]);

  return {
    elementRef,
    isDragging,
    isResizing,
    isMaximized,
    startDrag,
    startResize,
    toggleMaximize,
    dragStyles: {
      cursor: isDragging ? 'grabbing' : 'grab',
      transform: isDragging ? 'scale(1.01)' : 'scale(1)',
      zIndex: isDragging ? 9999 : 'auto',
      transition: isDragging ? 'none' : 'all 0.1s ease-out',
      willChange: isDragging || isResizing ? 'transform' : 'auto'
    }
  };
};
