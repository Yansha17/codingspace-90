
import { useCallback, useRef, useMemo } from 'react';

// Ultra-fast throttle for drag operations - fires every 2ms for 500fps
export const throttleFast = (func: (...args: any[]) => void, delay: number = 2) => {
  let lastCall = 0;
  
  return (...args: any[]) => {
    const now = performance.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
};

// Immediate throttle using requestAnimationFrame for maximum performance
export const throttleRAF = (func: (...args: any[]) => void) => {
  let rafId: number | null = null;
  
  return (...args: any[]) => {
    if (rafId) return;
    
    rafId = requestAnimationFrame(() => {
      func(...args);
      rafId = null;
    });
  };
};

// Debounce function for resize operations
export const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Hook for ultra-optimized drag handlers - 500fps for ultra-smooth dragging
export const useOptimizedDragHandler = (handler: (...args: any[]) => void, deps: any[]) => {
  const throttledHandler = useMemo(() => throttleFast(handler, 2), deps);
  return useCallback(throttledHandler, [throttledHandler]);
};

// Hook for optimized event handlers
export const useOptimizedEventHandler = (handler: (...args: any[]) => void, deps: any[]) => {
  const throttledHandler = useMemo(() => throttleRAF(handler), deps);
  return useCallback(throttledHandler, [throttledHandler]);
};

// Hook for debounced operations
export const useDebouncedCallback = (callback: (...args: any[]) => void, delay: number, deps: any[]) => {
  const debouncedCallback = useMemo(() => debounce(callback, delay), deps);
  return useCallback(debouncedCallback, [debouncedCallback]);
};

// Enhanced haptic feedback for mobile devices
export const triggerHapticFeedback = (type: 'light' | 'medium' | 'heavy' = 'light') => {
  if ('vibrate' in navigator) {
    const patterns = {
      light: [10],
      medium: [25],
      heavy: [50]
    };
    navigator.vibrate(patterns[type]);
  }
  
  if ('hapticFeedback' in navigator) {
    (navigator as any).hapticFeedback?.(type);
  }
};

// Passive event listener options
export const passiveEventOptions = { passive: true };
export const nonPassiveEventOptions = { passive: false };

// Ultra-fast transform optimization with immediate hardware acceleration
export const optimizeTransform = (element: HTMLElement, x: number, y: number, scale: number = 1) => {
  element.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
  element.style.willChange = 'transform';
  element.style.backfaceVisibility = 'hidden';
  element.style.perspective = '1000px';
};

export const optimizeResize = (element: HTMLElement, width: number, height: number) => {
  element.style.width = `${width}px`;
  element.style.height = `${height}px`;
  element.style.willChange = 'width, height';
};

// Instant spring animation utilities for immediate feedback
export const createSpringAnimation = (element: HTMLElement, property: string, from: number, to: number, duration: number = 150) => {
  const start = performance.now();
  const diff = to - from;
  
  const animate = (currentTime: number) => {
    const elapsed = currentTime - start;
    const progress = Math.min(elapsed / duration, 1);
    
    // Fast spring easing function
    const easeOutBack = (t: number) => {
      const c1 = 1.70158;
      const c3 = c1 + 1;
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    };
    
    const easedProgress = easeOutBack(progress);
    const currentValue = from + (diff * easedProgress);
    
    (element.style as any)[property] = `${currentValue}px`;
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      element.style.willChange = 'auto';
    }
  };
  
  requestAnimationFrame(animate);
};

// Performance monitoring for drag operations
export const createPerformanceMonitor = () => {
  let frameCount = 0;
  let lastTime = performance.now();
  
  return {
    tick: () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        console.log(`Drag FPS: ${fps}`);
        frameCount = 0;
        lastTime = currentTime;
      }
    }
  };
};
