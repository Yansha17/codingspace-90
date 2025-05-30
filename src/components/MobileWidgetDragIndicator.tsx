
import React, { memo } from 'react';
import { Move } from 'lucide-react';

interface MobileWidgetDragIndicatorProps {
  isDragging: boolean;
}

const MobileWidgetDragIndicator: React.FC<MobileWidgetDragIndicatorProps> = memo(({ isDragging }) => {
  if (!isDragging) return null;

  return (
    <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-blue-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center z-10 pointer-events-none">
      <div className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2">
        <Move className="w-3 h-3" />
        Moving...
      </div>
    </div>
  );
});

MobileWidgetDragIndicator.displayName = 'MobileWidgetDragIndicator';

export default MobileWidgetDragIndicator;
