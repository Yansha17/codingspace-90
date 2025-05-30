
import React from 'react';
import { X, Play, Eye, EyeOff, Edit3, Maximize2, Minimize2 } from 'lucide-react';
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
  isMaximized?: boolean;
  onRun: () => void;
  onTogglePreview: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onMaximize?: () => void;
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
  isMaximized = false,
  onRun,
  onTogglePreview,
  onDelete,
  onEdit,
  onMaximize,
  onMouseDown,
  onTouchStart
}) => {
  // Enhanced preview capability check
  const previewableLanguages = ['html', 'css', 'javascript', 'react'];
  const enhancedCanPreview = canPreview || previewableLanguages.includes(language.toLowerCase());

  return (
    <div 
      className="flex items-center justify-between p-3 border-b border-gray-200 bg-gradient-to-r from-white to-gray-50 cursor-move active:cursor-grabbing select-none"
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      style={{ touchAction: 'none' }}
    >
      <div className="flex items-center gap-3">
        <div 
          className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm"
          style={{ backgroundColor: langColor }}
        >
          {langIcon}
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 text-sm">{title}</h3>
          <p className="text-xs text-gray-500 capitalize">{language}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        {canRun && (
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onRun();
            }}
            className="h-7 px-2 hover:bg-green-100 text-green-600"
          >
            <Play className="w-3 h-3" />
          </Button>
        )}
        
        {enhancedCanPreview && (
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onTogglePreview();
            }}
            className="h-7 px-2 hover:bg-blue-100 text-blue-600"
          >
            {showPreview ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
          </Button>
        )}
        
        {isMobile && (
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="h-7 px-2 hover:bg-purple-100 text-purple-600"
          >
            <Edit3 className="w-3 h-3" />
          </Button>
        )}

        {onMaximize && (
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onMaximize();
            }}
            className="h-7 px-2 hover:bg-gray-100 text-gray-600"
          >
            {isMaximized ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
          </Button>
        )}
        
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="h-7 px-2 hover:bg-red-100 text-red-600"
        >
          <X className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
};

export default WindowHeader;
