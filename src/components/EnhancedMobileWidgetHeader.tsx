
import React, { memo, useCallback } from 'react';
import { X, Edit3, Eye, Play, Code2, Copy, Maximize2, Save, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { getLanguageConfig } from '@/config/languages';
import { triggerHapticFeedback } from '@/utils/performance';

interface EnhancedMobileWidgetHeaderProps {
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
  onDuplicate?: () => void;
  onSaveToLibrary?: () => void;
}

const EnhancedMobileWidgetHeader: React.FC<EnhancedMobileWidgetHeaderProps> = memo(({
  title,
  langName,
  showPreview,
  onEdit,
  onDelete,
  onTogglePreview,
  onMaximize,
  onRun,
  onDuplicate,
  onSaveToLibrary
}) => {
  const langConfig = getLanguageConfig(title);
  const IconComponent = langConfig.icon;

  const handleEdit = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    triggerHapticFeedback('light');
    onEdit();
  }, [onEdit]);

  const handleDelete = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    triggerHapticFeedback('heavy');
    onDelete();
  }, [onDelete]);

  const handleTogglePreview = useCallback((checked: boolean) => {
    triggerHapticFeedback('light');
    if (onTogglePreview) {
      onTogglePreview();
    }
  }, [onTogglePreview]);

  const handleRun = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    triggerHapticFeedback('medium');
    onRun();
  }, [onRun]);

  const handleMaximize = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    triggerHapticFeedback('medium');
    if (onMaximize) {
      onMaximize();
    }
  }, [onMaximize]);

  const handleDuplicate = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    triggerHapticFeedback('light');
    if (onDuplicate) {
      onDuplicate();
    }
  }, [onDuplicate]);

  const handleSaveToLibrary = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    triggerHapticFeedback('light');
    if (onSaveToLibrary) {
      onSaveToLibrary();
    }
  }, [onSaveToLibrary]);

  return (
    <div className="bg-slate-700/95 backdrop-blur-sm border-b border-slate-600 p-3 flex items-center justify-between">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className={`w-6 h-6 rounded-lg ${langConfig.bgColor} flex items-center justify-center text-white shadow-lg`}>
          <IconComponent className="w-3 h-3" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-semibold text-white truncate">{title}</span>
          <span className="text-xs text-slate-400">{langName}</span>
        </div>
      </div>

      {/* Enhanced Code/Preview Toggle - Only show for previewable languages */}
      {langConfig.previewable && (
        <div 
          className="mx-3 flex items-center gap-2 bg-slate-800/80 backdrop-blur-sm rounded-xl p-2 border border-slate-600/50"
          style={{ 
            pointerEvents: 'auto',
            touchAction: 'manipulation',
            isolation: 'isolate'
          }}
          onTouchStart={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className={`flex items-center justify-center w-6 h-6 rounded-lg transition-all duration-200 ${
            !showPreview ? 'bg-blue-500 text-white' : 'text-slate-400'
          }`}>
            <Code2 className="w-3 h-3" />
          </div>
          
          <div className="relative">
            <Switch
              checked={showPreview}
              onCheckedChange={handleTogglePreview}
              className="data-[state=checked]:bg-emerald-600 data-[state=unchecked]:bg-blue-600 scale-90 shadow-lg border border-slate-500"
              style={{ 
                pointerEvents: 'auto',
                touchAction: 'manipulation',
                isolation: 'isolate'
              }}
            />
          </div>
          
          <div className={`flex items-center justify-center w-6 h-6 rounded-lg transition-all duration-200 ${
            showPreview ? 'bg-emerald-500 text-white' : 'text-slate-400'
          }`}>
            <Eye className="w-3 h-3" />
          </div>
        </div>
      )}
      
      <div className="flex items-center gap-1">
        {/* Run Button - Show for runnable languages that aren't previewable */}
        {langConfig.runnable && !langConfig.previewable && (
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

EnhancedMobileWidgetHeader.displayName = 'EnhancedMobileWidgetHeader';

export default EnhancedMobileWidgetHeader;
