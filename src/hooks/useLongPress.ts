
import { useCallback, useRef, useState, useEffect } from 'react';

interface LongPressOptions {
  delay?: number;
  onLongPress: () => void;
  onLongPressStart?: () => void;
  onLongPressEnd?: () => void;
}

export const useLongPress = ({ delay = 500, onLongPress, onLongPressStart, onLongPressEnd }: LongPressOptions) => {
  const [isLongPressing, setIsLongPressing] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressRef = useRef(false);
  const startPositionRef = useRef<{ x: number; y: number } | null>(null);

  const start = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Store the initial position to detect movement
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    startPositionRef.current = { x: clientX, y: clientY };

    isLongPressRef.current = false;
    setIsLongPressing(true);
    onLongPressStart?.();

    timeoutRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      onLongPress();
      setIsLongPressing(false);
    }, delay);
  }, [delay, onLongPress, onLongPressStart]);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsLongPressing(false);
    startPositionRef.current = null;
    onLongPressEnd?.();
  }, [onLongPressEnd]);

  const end = useCallback(() => {
    cancel();
  }, [cancel]);

  const handleMove = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    if (!startPositionRef.current || !isLongPressing) return;

    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    
    const deltaX = Math.abs(clientX - startPositionRef.current.x);
    const deltaY = Math.abs(clientY - startPositionRef.current.y);
    
    // If the user moves more than 10px, cancel the long press
    if (deltaX > 10 || deltaY > 10) {
      cancel();
    }
  }, [isLongPressing, cancel]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    isLongPressing,
    isLongPress: isLongPressRef.current,
    handlers: {
      onMouseDown: start,
      onMouseUp: end,
      onMouseLeave: cancel,
      onMouseMove: handleMove,
      onTouchStart: start,
      onTouchEnd: end,
      onTouchMove: handleMove,
    },
  };
};
