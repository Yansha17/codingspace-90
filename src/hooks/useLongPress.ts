
import { useCallback, useRef, useState, useEffect } from 'react';

interface LongPressOptions {
  delay?: number;
  onLongPress: () => void;
  onLongPressStart?: () => void;
  onLongPressEnd?: () => void;
}

export const useLongPress = ({ delay = 750, onLongPress, onLongPressStart, onLongPressEnd }: LongPressOptions) => {
  const [isLongPressing, setIsLongPressing] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressRef = useRef(false);

  const start = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    isLongPressRef.current = false;
    setIsLongPressing(true);
    onLongPressStart?.();

    timeoutRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      onLongPress();
    }, delay);
  }, [delay, onLongPress, onLongPressStart]);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsLongPressing(false);
    onLongPressEnd?.();
  }, [onLongPressEnd]);

  const end = useCallback(() => {
    cancel();
  }, [cancel]);

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
      onTouchStart: start,
      onTouchEnd: end,
    },
  };
};
