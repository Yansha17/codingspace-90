
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
  const rafIdRef = useRef<number | null>(null);
  const currentPositionRef = useRef({ x: 0, y: 0 });
  const targetPositionRef = useRef({ x: 0, y: 0 });

  // Ultra-smooth animation loop using RAF
  const animateToTarget = useCallback(() => {
    const current = currentPositionRef.current;
    const target = targetPositionRef.current;
    
    // Smooth interpolation for ultra-fluid movement
    const ease = 0.8;
    const newX = current.x + (target.x - current.x) * ease;
    const newY = current.y + (target.y - current.y) * ease;
    
    currentPositionRef.current = { x: newX, y: newY };
    
    // Apply transform with hardware acceleration
    if (elementRef.current) {
      optimizeTransform(elementRef.current, newX, newY, isDragging ? 1.01 : 1);
    }
    
    // Update parent component
    onPositionChange({ x: Math.round(newX), y: Math.round(newY) });
    
    // Continue animation if still dragging or not at target
    const distance = Math.abs(target.x - newX) + Math.abs(target.y - newY);
    if (isDragging || distance > 0.1) {
      rafIdRef.current = requestAnimationFrame(animateToTarget);
    } else {
      rafIdRef.current = null;
      if (elementRef.current) {
        elementRef.current.style.willChange = 'auto';
      }
    }
  }, [isDragging, onPositionChange]);

  const startDrag = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    setIsDragging(true);
    triggerHapticFeedback('light');
    
    const rect = elementRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: clientX - rect.left,
        y: clientY - rect.top
      });
      
      currentPositionRef.current = { x: rect.left, y: rect.top };
      targetPositionRef.current = { x: rect.left, y: rect.top };
    }
    
    onDragStart?.();
    
    // Start animation loop
    if (!rafIdRef.current) {
      rafIdRef.current = requestAnimationFrame(animateToTarget);
    }
  }, [onDragStart, animateToTarget]);

  const updateDrag = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    
    e.preventDefault();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    let newX = clientX - dragOffset.x;
    let newY = clientY - dragOffset.y;
    
    // Constrain to screen bounds if enabled
    if (constrainToScreen) {
      newX = Math.max(0, Math.min(window.innerWidth - elementWidth, newX));
      newY = Math.max(60, Math.min(window.innerHeight - elementHeight, newY));
    }
    
    // Update target position for smooth interpolation
    targetPositionRef.current = { x: newX, y: newY };
  }, [isDragging, dragOffset, constrainToScreen, elementWidth, elementHeight]);

  const endDrag = useCallback(() => {
    setIsDragging(false);
    onDragEnd?.();
    
    // Allow animation to complete smoothly
    if (!rafIdRef.current) {
      rafIdRef.current = requestAnimationFrame(animateToTarget);
    }
  }, [onDragEnd, animateToTarget]);

  // Global event listeners
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

  // Cleanup RAF on unmount
  useEffect(() => {
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  return {
    elementRef,
    isDragging,
    startDrag,
    dragStyles: {
      cursor: isDragging ? 'grabbing' : 'grab',
      transform: isDragging ? 'scale(1.01)' : 'scale(1)',
      boxShadow: isDragging 
        ? '0 20px 40px -8px rgba(0, 0, 0, 0.4), 0 0 15px rgba(16, 185, 129, 0.2)' 
        : '0 15px 20px -5px rgba(0, 0, 0, 0.25)',
      transition: isDragging ? 'none' : 'all 0.1s ease-out',
      willChange: isDragging ? 'transform' : 'auto',
      backfaceVisibility: 'hidden' as const,
      perspective: '1000px'
    }
  };
};
