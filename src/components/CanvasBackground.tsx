
import React from 'react';

const CanvasBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none bg-white dark:bg-slate-900">
      {/* Grid Pattern */}
      <svg width="100%" height="100%" className="absolute inset-0">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.3"
              className="text-gray-300 dark:text-gray-600"
            />
          </pattern>
          <pattern id="smallGrid" width="8" height="8" patternUnits="userSpaceOnUse">
            <path
              d="M 8 0 L 0 0 0 8"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              opacity="0.4"
              className="text-gray-200 dark:text-gray-700"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#smallGrid)" />
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30 dark:from-blue-950/30 dark:via-transparent dark:to-purple-950/30" />
    </div>
  );
};

export default CanvasBackground;
