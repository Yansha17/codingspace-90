
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
  
  const elementRef = useRef<HTMLDivElement>(null);
  const currentPositionRef = useRef({ x: 0, y: 0 });

  const startDrag = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    setIsDragging(true);
    triggerHapticFeedback('light');
    
    const rect = elementRef.current?.getBoundingClientRect();
    if (rect) {
      // Calculate offset from touch/click point to element center for better feel
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      setDragOffset({
        x: clientX - centerX,
        y: clientY - centerY
      });
      
      currentPositionRef.current = { x: rect.left, y: rect.top };
    }
    
    onDragStart?.();
  }, [onDragStart]);

  const updateDrag = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    
    e.preventDefault();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    // Calculate position with element centered on finger/cursor
    let newX = clientX - dragOffset.x - elementWidth / 2;
    let newY = clientY - dragOffset.y - elementHeight / 2;
    
    // Constrain to screen bounds if enabled
    if (constrainToScreen) {
      newX = Math.max(0, Math.min(window.innerWidth - elementWidth, newX));
      newY = Math.max(60, Math.min(window.innerHeight - elementHeight, newY));
    }
    
    currentPositionRef.current = { x: newX, y: newY };
    
    // Immediate visual feedback with hardware acceleration
    if (elementRef.current) {
      optimizeTransform(elementRef.current, newX, newY, 1.02);
    }
    
    // Update parent component immediately
    onPositionChange({ x: Math.round(newX), y: Math.round(newY) });
  }, [isDragging, dragOffset, constrainToScreen, elementWidth, elementHeight, onPositionChange]);

  const endDrag = useCallback(() => {
    setIsDragging(false);
    onDragEnd?.();
    
    // Reset transform scale
    if (elementRef.current) {
      const pos = currentPositionRef.current;
      optimizeTransform(elementRef.current, pos.x, pos.y, 1);
      elementRef.current.style.willChange = 'auto';
    }
  }, [onDragEnd]);

  // Global event listeners with immediate response
  useEffect(() => {
    if (isDragging) {
      const options = { passive: false };
      document.addEventListener('mousemove', updateDrag);
      document.addEventListener('mouseup', endDrag);
      document.addEventListener('touchmove', updateDrag, options);
      document.addEventListener('touchend', endDrag);
      
      return () => {
        document.removeEventListener('mousemove', updateDrag);
        document.removeEventListener('mouseup', endDrag);
        document.removeEventListener('touchmove', updateDrag);
        document.removeEventListener('touchend', endDrag);
      };
    }
  }, [isDragging, updateDrag, endDrag]);

  return {
    elementRef,
    isDragging,
    startDrag,
    dragStyles: {
      cursor: isDragging ? 'grabbing' : 'grab',
      transform: isDragging ? 'scale(1.02)' : 'scale(1)',
      boxShadow: isDragging 
        ? '0 20px 40px -8px rgba(0, 0, 0, 0.4), 0 0 15px rgba(16, 185, 129, 0.2)' 
        : '0 15px 20px -5px rgba(0, 0, 0, 0.25)',
      transition: isDragging ? 'none' : 'all 0.1s ease-out',
      willChange: isDragging ? 'transform' : 'auto',
      backfaceVisibility: 'hidden' as const,
      perspective: '1000px',
      touchAction: 'none'
    }
  };
};
