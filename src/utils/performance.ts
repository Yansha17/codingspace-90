
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

// Fast throttle for drag operations - fires every 8ms for 120fps
export const throttleFast = (func: (...args: any[]) => void, delay: number = 8) => {
  let lastCall = 0;
  
  return (...args: any[]) => {
    const now = Date.now();
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

// Hook for optimized drag handlers - uses fast throttling
export const useOptimizedDragHandler = (handler: (...args: any[]) => void, deps: any[]) => {
  const throttledHandler = useMemo(() => throttleFast(handler, 8), deps);
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

// Add haptic feedback for mobile devices
export const triggerHapticFeedback = (type: 'light' | 'medium' | 'heavy' = 'light') => {
  if ('vibrate' in navigator) {
    const patterns = {
      light: [30],
      medium: [50],
      heavy: [100]
    };
    navigator.vibrate(patterns[type]);
  }
};

// Passive event listener options
export const passiveEventOptions = { passive: true };
export const nonPassiveEventOptions = { passive: false };

// Transform optimization utilities
export const optimizeTransform = (element: HTMLElement, x: number, y: number) => {
  element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
};

export const optimizeResize = (element: HTMLElement, width: number, height: number) => {
  element.style.width = `${width}px`;
  element.style.height = `${height}px`;
};
