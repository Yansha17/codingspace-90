
import { useCallback, useRef, useMemo } from 'react';

// Ultra-fast throttle for drag operations - fires every frame for 60fps
export const throttleFast = (func: (...args: any[]) => void, delay: number = 16) => {
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

// Hook for ultra-optimized drag handlers - 60fps for ultra-smooth dragging
export const useOptimizedDragHandler = (handler: (...args: any[]) => void, deps: any[]) => {
  const throttledHandler = useMemo(() => throttleRAF(handler), deps);
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
  // Use translate3d for hardware acceleration
  element.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
  element.style.willChange = 'transform';
  element.style.backfaceVisibility = 'hidden';
  element.style.perspective = '1000px';
  // Force layer creation for better performance
  element.style.zIndex = element.style.zIndex || '0';
};

export const optimizeResize = (element: HTMLElement, width: number, height: number) => {
  element.style.width = `${width}px`;
  element.style.height = `${height}px`;
  element.style.willChange = 'width, height, transform';
};

// Smooth linear animation utilities for fluid interactions
export const createSmoothAnimation = (element: HTMLElement, property: string, from: number, to: number, duration: number = 100) => {
  const start = performance.now();
  const diff = to - from;
  
  const animate = (currentTime: number) => {
    const elapsed = currentTime - start;
    const progress = Math.min(elapsed / duration, 1);
    
    // Smooth easing function for natural movement
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const currentValue = from + (diff * easeOutQuart);
    
    (element.style as any)[property] = `${currentValue}px`;
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      element.style.willChange = 'auto';
    }
  };
  
  element.style.willChange = property;
  requestAnimationFrame(animate);
};

// Spring animation with bounce effect for enhanced user experience
export const createSpringAnimation = (element: HTMLElement, property: string, from: number, to: number, duration: number = 400) => {
  const start = performance.now();
  const diff = to - from;
  
  const animate = (currentTime: number) => {
    const elapsed = currentTime - start;
    const progress = Math.min(elapsed / duration, 1);
    
    // Spring easing function with slight bounce
    const easeOutBack = (t: number): number => {
      const c1 = 1.70158;
      const c3 = c1 + 1;
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    };
    
    const currentValue = from + (diff * easeOutBack(progress));
    
    (element.style as any)[property] = `${currentValue}px`;
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      element.style.willChange = 'auto';
    }
  };
  
  element.style.willChange = property;
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

// Batch DOM updates for better performance
export const batchDOMUpdates = (updates: (() => void)[]) => {
  requestAnimationFrame(() => {
    updates.forEach(update => update());
  });
};

// Optimize element for animations
export const prepareElementForAnimation = (element: HTMLElement) => {
  element.style.willChange = 'transform';
  element.style.backfaceVisibility = 'hidden';
  element.style.perspective = '1000px';
  element.style.transformStyle = 'preserve-3d';
};

// Reset element after animation
export const resetElementAfterAnimation = (element: HTMLElement) => {
  element.style.willChange = 'auto';
  element.style.backfaceVisibility = 'visible';
  element.style.perspective = 'none';
  element.style.transformStyle = 'flat';
};
