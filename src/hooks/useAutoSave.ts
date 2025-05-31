
import { useEffect, useRef } from 'react';
import { useDebouncedCallback } from '@/utils/performance';

interface UseAutoSaveProps {
  value: string;
  onSave: (value: string) => void;
  delay?: number;
}

export const useAutoSave = ({ value, onSave, delay = 500 }: UseAutoSaveProps) => {
  const previousValueRef = useRef(value);
  const isInitialRender = useRef(true);

  const debouncedSave = useDebouncedCallback((newValue: string) => {
    if (newValue !== previousValueRef.current && !isInitialRender.current) {
      onSave(newValue);
      previousValueRef.current = newValue;
      console.log('Auto-saved code changes');
    }
  }, delay, [onSave]);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      previousValueRef.current = value;
      return;
    }

    debouncedSave(value);
  }, [value, debouncedSave]);

  useEffect(() => {
    previousValueRef.current = value;
  }, [value]);

  return {
    isSaving: false // Could be enhanced to show saving state
  };
};
