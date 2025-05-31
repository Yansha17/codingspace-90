
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
      // Calculate offset from touch/click point to element's top-left corner
      // This prevents jumping and maintains exact finger-to-element relationship
      setDragOffset({
        x: clientX - rect.left,
        y: clientY - rect.top
      });
      
      // Store the current position for reference
      currentPositionRef.current = { x: rect.left, y: rect.top };
    }
    
    onDragStart?.();
  }, [onDragStart]);

  const updateDrag = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    
    e.preventDefault();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    // Calculate new position maintaining exact offset from touch point
    let newX = clientX - dragOffset.x;
    let newY = clientY - dragOffset.y;
    
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
    
    // Update parent component with exact position
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

  // Optimized event listeners with proper passive handling
  useEffect(() => {
    if (isDragging) {
      // Use non-passive for touchmove to allow preventDefault
      const touchOptions = { passive: false };
      const mouseOptions = { passive: true };
      
      document.addEventListener('mousemove', updateDrag, mouseOptions);
      document.addEventListener('mouseup', endDrag, mouseOptions);
      document.addEventListener('touchmove', updateDrag, touchOptions);
      document.addEventListener('touchend', endDrag, mouseOptions);
      
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
