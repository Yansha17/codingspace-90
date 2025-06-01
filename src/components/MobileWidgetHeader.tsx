
import React, { memo, useCallback } from 'react';
import { X, Edit3, Eye, Play, Code2 } from 'lucide-react';
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
  showPreview,
  onEdit,
  onDelete,
  onTogglePreview,
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
        {/* Preview Toggle - Available for all languages */}
        <Button
          size="sm"
          variant="ghost"
          onClick={handleTogglePreview}
          onTouchStart={handleTogglePreview}
          className={`h-6 w-6 p-0 rounded-md z-20 relative touch-manipulation transition-all duration-200 ${
            showPreview 
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
              : 'bg-purple-600 hover:bg-purple-700 text-white'
          }`}
          style={{ touchAction: 'manipulation' }}
        >
          {showPreview ? (
            <Eye className="w-3 h-3" />
          ) : (
            <Code2 className="w-3 h-3" />
          )}
        </Button>
        
        {/* Run Button - Show for executable languages */}
        {(langConfig.runnable || langConfig.previewable) && (
          <Button
            size="sm"
            variant="ghost"
            onClick={handleRun}
            onTouchStart={handleRun}
            className="h-6 w-6 p-0 bg-green-600 hover:bg-green-700 text-white rounded-md z-20 relative touch-manipulation transition-all duration-200"
            style={{ touchAction: 'manipulation' }}
          >
            <Play className="w-3 h-3" />
          </Button>
        )}
        
        {/* Edit Button */}
        <Button
          size="sm"
          variant="ghost"
          onClick={handleEdit}
          onTouchStart={handleEdit}
          className="h-6 w-6 p-0 bg-blue-600 hover:bg-blue-700 text-white rounded-md z-20 relative touch-manipulation transition-all duration-200"
          style={{ touchAction: 'manipulation' }}
        >
          <Edit3 className="w-3 h-3" />
        </Button>
        
        {/* Delete Button */}
        <Button
          size="sm"
          variant="ghost"
          onClick={handleDelete}
          onTouchStart={handleDelete}
          className="h-6 w-6 p-0 bg-red-600 hover:bg-red-700 text-white rounded-md z-20 relative touch-manipulation transition-all duration-200"
        >
          <X className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
});

MobileWidgetHeader.displayName = 'MobileWidgetHeader';

export default MobileWidgetHeader;
