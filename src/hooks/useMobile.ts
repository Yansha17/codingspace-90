
import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = 768;

export function useMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      const hasTouch = 'ontouchstart' in window;
      setIsMobile(width <= MOBILE_BREAKPOINT || hasTouch);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}
