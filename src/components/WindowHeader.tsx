
import React from 'react';
import { X, Play, Eye, Code as CodeIcon, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WindowHeaderProps {
  title: string;
  language: string;
  langColor: string;
  langIcon: string;
  isMobile: boolean;
  showPreview: boolean;
  canRun: boolean;
  canPreview: boolean;
  onRun: () => void;
  onTogglePreview: () => void;
  onDelete: () => void;
  onEdit?: () => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onTouchStart: (e: React.TouchEvent) => void;
}

const WindowHeader: React.FC<WindowHeaderProps> = ({
  title,
  language,
  langColor,
  langIcon,
  isMobile,
  showPreview,
  canRun,
  canPreview,
  onRun,
  onTogglePreview,
  onDelete,
  onEdit,
  onMouseDown,
  onTouchStart
}) => {
  return (
    <div
      className="bg-white/90 backdrop-blur-sm border-b border-gray-200 p-3 flex items-center justify-between cursor-move touch-none"
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="flex gap-1">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <span className="text-sm font-medium text-gray-700 truncate">{title}</span>
        <span 
          className={`text-xs px-2 py-1 rounded text-white ${isMobile ? 'hidden' : ''}`}
          style={{ backgroundColor: langColor }}
        >
          {langIcon}
        </span>
      </div>
      
      <div className="flex items-center gap-1 flex-shrink-0">
        {onEdit && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onEdit}
            className={`${isMobile ? 'h-8 w-8' : 'h-6 w-6'} p-0 hover:bg-blue-100 touch-manipulation`}
          >
            <Edit className={`${isMobile ? 'w-4 h-4' : 'w-3 h-3'} text-blue-600`} />
          </Button>
        )}
        
        {canRun && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onRun}
            className={`${isMobile ? 'h-8 w-8' : 'h-6 w-6'} p-0 hover:bg-green-100 touch-manipulation`}
          >
            <Play className={`${isMobile ? 'w-4 h-4' : 'w-3 h-3'} text-green-600`} />
          </Button>
        )}
        
        {canPreview && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onTogglePreview}
            className={`${isMobile ? 'h-8 w-8' : 'h-6 w-6'} p-0 hover:bg-blue-100 touch-manipulation`}
          >
            {showPreview ? (
              <CodeIcon className={`${isMobile ? 'w-4 h-4' : 'w-3 h-3'} text-blue-600`} />
            ) : (
              <Eye className={`${isMobile ? 'w-4 h-4' : 'w-3 h-3'} text-blue-600`} />
            )}
          </Button>
        )}
        
        <Button
          size="sm"
          variant="ghost"
          onClick={onDelete}
          className={`${isMobile ? 'h-8 w-8' : 'h-6 w-6'} p-0 hover:bg-red-100 touch-manipulation`}
        >
          <X className={`${isMobile ? 'w-4 h-4' : 'w-3 h-3'} text-red-600`} />
        </Button>
      </div>
    </div>
  );
};

export default WindowHeader;
