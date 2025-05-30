
import React, { memo, useCallback } from 'react';
import { X, Edit3, Eye, Play, Maximize2, Minimize2, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getLanguageConfig } from '@/config/languages';

interface MobileWidgetHeaderProps {
  title: string;
  langName: string;
  isMaximized: boolean;
  showPreview: boolean;
  previewKey: number;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePreview?: () => void;
  onMaximize?: () => void;
  onRun: () => void;
}

const MobileWidgetHeader: React.FC<MobileWidgetHeaderProps> = memo(({
  title,
  langName,
  isMaximized,
  showPreview,
  onEdit,
  onDelete,
  onTogglePreview,
  onMaximize,
  onRun
}) => {
  const langConfig = getLanguageConfig(title);
  const IconComponent = langConfig.icon;

  const handleEdit = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit();
  }, [onEdit]);

  const handleDelete = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete();
  }, [onDelete]);

  const handleTogglePreview = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onTogglePreview) {
      onTogglePreview();
    }
  }, [onTogglePreview]);

  const handleMaximize = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onMaximize) {
      onMaximize();
    }
  }, [onMaximize]);

  const handleRun = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onRun();
  }, [onRun]);

  return (
    <div className="bg-slate-700/90 backdrop-blur-sm border-b border-slate-600 p-3 flex items-center justify-between">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className={`w-8 h-8 rounded-lg ${langConfig.bgColor} flex items-center justify-center text-white shadow-lg`}>
          <IconComponent className="w-4 h-4" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-semibold text-white truncate">{title}</span>
          <span className="text-xs text-slate-400">{langName}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        {/* Run Button - Show for runnable languages */}
        {langConfig.runnable && (
          <Button
            size="sm"
            variant="ghost"
            onClick={handleRun}
            onTouchStart={handleRun}
            className="h-8 w-8 p-0 hover:bg-green-600 rounded-lg z-20 relative touch-manipulation"
            style={{ touchAction: 'manipulation' }}
          >
            <Play className="w-4 h-4 text-green-400 hover:text-white" />
          </Button>
        )}
        
        {/* Preview Button - Show for previewable languages */}
        {langConfig.previewable && (
          <Button
            size="sm"
            variant="ghost"
            onClick={handleTogglePreview}
            onTouchStart={handleTogglePreview}
            className="h-8 w-8 p-0 hover:bg-emerald-600 rounded-lg z-20 relative touch-manipulation"
            style={{ touchAction: 'manipulation' }}
          >
            {showPreview ? (
              <EyeOff className="w-4 h-4 text-emerald-300 hover:text-white" />
            ) : (
              <Eye className="w-4 h-4 text-emerald-400 hover:text-white" />
            )}
          </Button>
        )}
        
        {/* Maximize/Minimize Button */}
        {onMaximize && (
          <Button
            size="sm"
            variant="ghost"
            onClick={handleMaximize}
            onTouchStart={handleMaximize}
            className="h-8 w-8 p-0 hover:bg-purple-600 rounded-lg z-20 relative touch-manipulation"
            style={{ touchAction: 'manipulation' }}
          >
            {isMaximized ? (
              <Minimize2 className="w-4 h-4 text-purple-400 hover:text-white" />
            ) : (
              <Maximize2 className="w-4 h-4 text-purple-400 hover:text-white" />
            )}
          </Button>
        )}
        
        {/* Edit Button */}
        <Button
          size="sm"
          variant="ghost"
          onClick={handleEdit}
          onTouchStart={handleEdit}
          className="h-8 w-8 p-0 hover:bg-blue-600 rounded-lg z-20 relative touch-manipulation"
          style={{ touchAction: 'manipulation' }}
        >
          <Edit3 className="w-4 h-4 text-blue-400 hover:text-white" />
        </Button>
        
        {/* Delete Button */}
        <Button
          size="sm"
          variant="ghost"
          onClick={handleDelete}
          onTouchStart={handleDelete}
          className="h-8 w-8 p-0 hover:bg-red-600 rounded-lg z-20 relative touch-manipulation"
          style={{ touchAction: 'manipulation' }}
        >
          <X className="w-4 h-4 text-red-400 hover:text-white" />
        </Button>
      </div>
    </div>
  );
});

MobileWidgetHeader.displayName = 'MobileWidgetHeader';

export default MobileWidgetHeader;
