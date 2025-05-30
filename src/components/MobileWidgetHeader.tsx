
import React, { memo, useCallback } from 'react';
import { X, Edit3, Eye, Play, Maximize2, Minimize2, EyeOff, Code2 } from 'lucide-react';
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
    <div className="bg-slate-700/90 backdrop-blur-sm border-b border-slate-600 p-2 flex items-center justify-between">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className={`w-6 h-6 rounded-lg ${langConfig.bgColor} flex items-center justify-center text-white shadow-lg`}>
          <IconComponent className="w-3 h-3" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-semibold text-white truncate">{title}</span>
          <span className="text-xs text-slate-400">{langName}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        {/* Preview Toggle - Show for previewable languages */}
        {langConfig.previewable && (
          <Button
            size="sm"
            variant="ghost"
            onClick={handleTogglePreview}
            onTouchStart={handleTogglePreview}
            className={`h-6 w-6 p-0 rounded-md z-20 relative touch-manipulation transition-all duration-200 ${
              showPreview 
                ? 'bg-emerald-600 hover:bg-emerald-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
            style={{ touchAction: 'manipulation' }}
          >
            {showPreview ? (
              <Eye className="w-3 h-3 text-white" />
            ) : (
              <Code2 className="w-3 h-3 text-white" />
            )}
          </Button>
        )}
        
        {/* Run Button - Show for runnable languages that aren't previewable */}
        {langConfig.runnable && !langConfig.previewable && (
          <Button
            size="sm"
            variant="ghost"
            onClick={handleRun}
            onTouchStart={handleRun}
            className="h-6 w-6 p-0 hover:bg-green-600 rounded-md z-20 relative touch-manipulation transition-all duration-200"
            style={{ touchAction: 'manipulation' }}
          >
            <Play className="w-3 h-3 text-green-400 hover:text-white" />
          </Button>
        )}
        
        {/* Maximize/Minimize Button */}
        {onMaximize && (
          <Button
            size="sm"
            variant="ghost"
            onClick={handleMaximize}
            onTouchStart={handleMaximize}
            className="h-6 w-6 p-0 hover:bg-purple-600 rounded-md z-20 relative touch-manipulation transition-all duration-200"
            style={{ touchAction: 'manipulation' }}
          >
            {isMaximized ? (
              <Minimize2 className="w-3 h-3 text-purple-400 hover:text-white" />
            ) : (
              <Maximize2 className="w-3 h-3 text-purple-400 hover:text-white" />
            )}
          </Button>
        )}
        
        {/* Edit Button */}
        <Button
          size="sm"
          variant="ghost"
          onClick={handleEdit}
          onTouchStart={handleEdit}
          className="h-6 w-6 p-0 hover:bg-blue-600 rounded-md z-20 relative touch-manipulation transition-all duration-200"
          style={{ touchAction: 'manipulation' }}
        >
          <Edit3 className="w-3 h-3 text-blue-400 hover:text-white" />
        </Button>
        
        {/* Delete Button */}
        <Button
          size="sm"
          variant="ghost"
          onClick={handleDelete}
          onTouchStart={handleDelete}
          className="h-6 w-6 p-0 hover:bg-red-600 rounded-md z-20 relative touch-manipulation transition-all duration-200"
          style={{ touchAction: 'manipulation' }}
        >
          <X className="w-3 h-3 text-red-400 hover:text-white" />
        </Button>
      </div>
    </div>
  );
});

MobileWidgetHeader.displayName = 'MobileWidgetHeader';

export default MobileWidgetHeader;
