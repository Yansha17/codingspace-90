
import { useState, useRef, useCallback, useEffect } from 'react';
import { optimizeTransform, triggerHapticFeedback } from '@/utils/performance';

export interface UseSmoothDragProps {
  onPositionChange: (position: { x: number; y: number }) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  constrainToScreen?: boolean;
  elementWidth?: number;
  elementHeight?: number;
}

export const useUltraSmoothDrag = ({
  onPositionChange,
  onDragStart,
  onDragEnd,
  constrainToScreen = true,
  elementWidth = 120,
  elementHeight = 120
}: UseSmoothDragProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragStarted, setDragStarted] = useState(false);
  
  const elementRef = useRef<HTMLDivElement>(null);
  const currentPositionRef = useRef({ x: 0, y: 0 });
  const dragStartTimeRef = useRef(0);
  const initialTouchRef = useRef({ x: 0, y: 0 });
  const rafIdRef = useRef<number | null>(null);

  const DRAG_THRESHOLD = 8; // Minimum distance to start drag
  const DRAG_DELAY = 150; // Minimum time before drag starts (ms)

  const startDrag = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    // Don't start drag if clicking on interactive elements
    const target = e.target as HTMLElement;
    const isInteractiveElement = target.closest('button') || 
                                target.closest('[data-radix-switch-root]') || 
                                target.closest('[role="switch"]') ||
                                target.closest('.switch-container') ||
                                target.closest('[data-resize-handle]');
    
    if (isInteractiveElement) {
      console.log('Drag blocked - interactive element detected');
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    console.log('Drag start initiated at:', clientX, clientY);
    
    dragStartTimeRef.current = Date.now();
    initialTouchRef.current = { x: clientX, y: clientY };
    setDragStarted(false);
    
    const rect = elementRef.current?.getBoundingClientRect();
    if (rect) {
      // Use element center for more natural dragging feel
      const centerOffsetX = elementWidth / 2;
      const centerOffsetY = elementHeight / 2;
      
      setDragOffset({
        x: centerOffsetX,
        y: centerOffsetY
      });
      
      currentPositionRef.current = { x: rect.left, y: rect.top };
    }
  }, [elementWidth, elementHeight]);

  const updateDrag = useCallback((e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const deltaX = clientX - initialTouchRef.current.x;
    const deltaY = clientY - initialTouchRef.current.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const timeElapsed = Date.now() - dragStartTimeRef.current;
    
    // Only start actual dragging if threshold is met
    if (!dragStarted && (distance > DRAG_THRESHOLD || timeElapsed > DRAG_DELAY)) {
      console.log('Drag threshold met, starting drag');
      setIsDragging(true);
      setDragStarted(true);
      triggerHapticFeedback('light');
      onDragStart?.();
    }
    
    if (!dragStarted) return;
    
    // Calculate new position with center-based offset
    let newX = clientX - dragOffset.x;
    let newY = clientY - dragOffset.y;
    
    // Constrain to screen bounds if enabled
    if (constrainToScreen) {
      newX = Math.max(0, Math.min(window.innerWidth - elementWidth, newX));
      newY = Math.max(60, Math.min(window.innerHeight - elementHeight, newY));
    }
    
    currentPositionRef.current = { x: newX, y: newY };
    
    // Cancel previous frame
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }
    
    // Smooth visual feedback with requestAnimationFrame
    rafIdRef.current = requestAnimationFrame(() => {
      if (elementRef.current && dragStarted) {
        optimizeTransform(elementRef.current, newX, newY, 1.01);
      }
    });
    
    // Update parent component with exact position
    onPositionChange({ x: Math.round(newX), y: Math.round(newY) });
  }, [dragStarted, dragOffset, constrainToScreen, elementWidth, elementHeight, onPositionChange, onDragStart]);

  const endDrag = useCallback(() => {
    console.log('Drag ended');
    setIsDragging(false);
    setDragStarted(false);
    onDragEnd?.();
    
    // Cancel any pending animation frame
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    
    // Reset transform scale and cleanup
    if (elementRef.current) {
      const pos = currentPositionRef.current;
      optimizeTransform(elementRef.current, pos.x, pos.y, 1);
      elementRef.current.style.willChange = 'auto';
    }
  }, [onDragEnd]);

  // Optimized event listeners with proper passive handling
  useEffect(() => {
    if (isDragging || dragStartTimeRef.current > 0) {
      // Use non-passive for touchmove to allow preventDefault
      const touchOptions = { passive: false };
      const mouseOptions = { passive: false };
      
      document.addEventListener('mousemove', updateDrag, mouseOptions);
      document.addEventListener('mouseup', endDrag, { passive: true });
      document.addEventListener('touchmove', updateDrag, touchOptions);
      document.addEventListener('touchend', endDrag, { passive: true });
      document.addEventListener('touchcancel', endDrag, { passive: true });
      
      return () => {
        document.removeEventListener('mousemove', updateDrag);
        document.removeEventListener('mouseup', endDrag);
        document.removeEventListener('touchmove', updateDrag);
        document.removeEventListener('touchend', endDrag);
        document.removeEventListener('touchcancel', endDrag);
        
        // Reset state on cleanup
        if (rafIdRef.current) {
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
        }
        dragStartTimeRef.current = 0;
      };
    }
  }, [isDragging, updateDrag, endDrag]);

  return {
    elementRef,
    isDragging: dragStarted, // Only report as dragging when actually dragging
    startDrag,
    dragStyles: {
      cursor: dragStarted ? 'grabbing' : 'grab',
      transform: dragStarted ? 'scale(1.01)' : 'scale(1)',
      boxShadow: dragStarted 
        ? '0 20px 40px -8px rgba(0, 0, 0, 0.4), 0 0 15px rgba(16, 185, 129, 0.2)' 
        : '0 15px 20px -5px rgba(0, 0, 0, 0.25)',
      transition: dragStarted ? 'none' : 'all 0.2s ease-out',
      willChange: dragStarted ? 'transform' : 'auto',
      backfaceVisibility: 'hidden' as const,
      perspective: '1000px',
      touchAction: 'none',
      userSelect: 'none' as const
    }
  };
};
