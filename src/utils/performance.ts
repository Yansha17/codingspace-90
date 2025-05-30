
import { useCallback, useRef, useMemo } from 'react';

// Throttle function using requestAnimationFrame for maximum performance
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

// Ultra-fast throttle for drag operations - fires every 4ms for 240fps
export const throttleFast = (func: (...args: any[]) => void, delay: number = 4) => {
  let lastCall = 0;
  
  return (...args: any[]) => {
    const now = performance.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
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

// Hook for optimized drag handlers - uses ultra-fast throttling for smooth 240fps dragging
export const useOptimizedDragHandler = (handler: (...args: any[]) => void, deps: any[]) => {
  const throttledHandler = useMemo(() => throttleFast(handler, 4), deps);
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
      light: [20],
      medium: [40],
      heavy: [80]
    };
    navigator.vibrate(patterns[type]);
  }
  
  // Additional haptic feedback for devices that support it
  if ('hapticFeedback' in navigator) {
    (navigator as any).hapticFeedback?.(type);
  }
};

// Passive event listener options
export const passiveEventOptions = { passive: true };
export const nonPassiveEventOptions = { passive: false };

// Enhanced transform optimization utilities with hardware acceleration
export const optimizeTransform = (element: HTMLElement, x: number, y: number, scale: number = 1) => {
  element.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
  element.style.willChange = 'transform';
};

export const optimizeResize = (element: HTMLElement, width: number, height: number) => {
  element.style.width = `${width}px`;
  element.style.height = `${height}px`;
  element.style.willChange = 'width, height';
};

// Spring animation utilities for bouncy effects
export const createSpringAnimation = (element: HTMLElement, property: string, from: number, to: number, duration: number = 300) => {
  const start = performance.now();
  const diff = to - from;
  
  const animate = (currentTime: number) => {
    const elapsed = currentTime - start;
    const progress = Math.min(elapsed / duration, 1);
    
    // Spring easing function for bouncy effect
    const easeOutBounce = (t: number) => {
      if (t < 1 / 2.75) {
        return 7.5625 * t * t;
      } else if (t < 2 / 2.75) {
        return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
      } else if (t < 2.5 / 2.75) {
        return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
      } else {
        return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
      }
    };
    
    const easedProgress = easeOutBounce(progress);
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
