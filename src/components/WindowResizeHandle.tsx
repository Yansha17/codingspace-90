
import React from 'react';
import { GripHorizontal } from 'lucide-react';

interface WindowResizeHandleProps {
  isMobile: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onTouchStart: (e: React.TouchEvent) => void;
}

const WindowResizeHandle: React.FC<WindowResizeHandleProps> = ({
  isMobile,
  onMouseDown,
  onTouchStart
}) => {
  return (
    <div
      className={`absolute bottom-0 right-0 ${isMobile ? 'w-8 h-8' : 'w-4 h-4'} cursor-se-resize touch-manipulation`}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
    >
      <GripHorizontal className={`${isMobile ? 'w-6 h-6' : 'w-3 h-3'} text-gray-400 transform rotate-45 absolute bottom-1 right-1`} />
    </div>
  );
};

export default WindowResizeHandle;
