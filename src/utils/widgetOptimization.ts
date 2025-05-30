
// Widget-specific performance optimizations

export const createWidgetTransform = (x: number, y: number, scale: number = 1) => {
  return `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
};

export const optimizeWidgetElement = (element: HTMLElement) => {
  element.style.willChange = 'transform';
  element.style.backfaceVisibility = 'hidden';
  element.style.perspective = '1000px';
  element.style.transform = element.style.transform || 'translate3d(0, 0, 0)';
};

export const resetWidgetOptimization = (element: HTMLElement) => {
  element.style.willChange = 'auto';
};

// Smooth resize animation for widgets
export const animateWidgetResize = (
  element: HTMLElement, 
  targetWidth: number, 
  targetHeight: number, 
  duration: number = 200
) => {
  const startWidth = element.offsetWidth;
  const startHeight = element.offsetHeight;
  const startTime = performance.now();
  
  const animate = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Smooth easing function
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    
    const currentWidth = startWidth + (targetWidth - startWidth) * easeOutQuart;
    const currentHeight = startHeight + (targetHeight - startHeight) * easeOutQuart;
    
    element.style.width = `${currentWidth}px`;
    element.style.height = `${currentHeight}px`;
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      resetWidgetOptimization(element);
    }
  };
  
  optimizeWidgetElement(element);
  requestAnimationFrame(animate);
};

// Enhanced haptic feedback patterns
export const widgetHapticFeedback = {
  dragStart: () => triggerHapticFeedback('light'),
  resizeStart: () => triggerHapticFeedback('medium'),
  maximize: () => triggerHapticFeedback('heavy'),
  delete: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 30, 50]); // Custom pattern for delete
    }
  }
};

// Performance monitoring for widgets
export const createWidgetPerformanceMonitor = () => {
  let frameCount = 0;
  let lastTime = performance.now();
  let isMonitoring = false;
  
  return {
    start: () => {
      isMonitoring = true;
      frameCount = 0;
      lastTime = performance.now();
    },
    tick: () => {
      if (!isMonitoring) return;
      
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        console.log(`Widget FPS: ${fps}`);
        frameCount = 0;
        lastTime = currentTime;
      }
    },
    stop: () => {
      isMonitoring = false;
    }
  };
};

// Memory-efficient event handler cache
const eventHandlerCache = new WeakMap();

export const getCachedEventHandler = (element: HTMLElement, eventType: string, handler: Function) => {
  let cache = eventHandlerCache.get(element);
  if (!cache) {
    cache = new Map();
    eventHandlerCache.set(element, cache);
  }
  
  const key = `${eventType}_${handler.name}`;
  if (!cache.has(key)) {
    cache.set(key, handler);
  }
  
  return cache.get(key);
};

// Import haptic feedback from main utils
const triggerHapticFeedback = (type: 'light' | 'medium' | 'heavy' = 'light') => {
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
