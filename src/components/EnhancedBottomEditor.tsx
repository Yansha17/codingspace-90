
import React, { useState, useRef, useEffect, memo } from 'react';
import { X, Code, Eye, Play, ChevronUp, ChevronDown, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CodeEditor from './CodeEditor';
import CodePreview from './CodePreview';
import { getLanguageConfig, getLanguageComment } from '@/config/languages';
import { triggerHapticFeedback, useOptimizedEventHandler } from '@/utils/performance';

interface EnhancedBottomEditorProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  language: string;
  code: string;
  onChange: (code: string) => void;
  onRun?: () => void;
}

const EnhancedBottomEditor: React.FC<EnhancedBottomEditorProps> = memo(({
  isOpen,
  onClose,
  title,
  language,
  code,
  onChange,
  onRun
}) => {
  const [view, setView] = useState<'code' | 'preview' | 'split'>('code');
  const [height, setHeight] = useState(30); // vh units
  const [isResizing, setIsResizing] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const resizeStartRef = useRef<{ y: number; height: number } | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const langConfig = getLanguageConfig(language);
  const IconComponent = langConfig.icon;

  const handleResizeStart = useOptimizedEventHandler((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setIsResizing(true);
    resizeStartRef.current = { y: clientY, height };
    triggerHapticFeedback('light');
  }, [height]);

  const handleResizeMove = useOptimizedEventHandler((e: MouseEvent | TouchEvent) => {
    if (!isResizing || !resizeStartRef.current) return;
    
    e.preventDefault();
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const deltaY = resizeStartRef.current.y - clientY;
    const viewportHeight = window.innerHeight;
    const newHeight = Math.max(20, Math.min(80, resizeStartRef.current.height + (deltaY / viewportHeight) * 100));
    
    setHeight(newHeight);
  }, [isResizing]);

  const handleResizeEnd = useOptimizedEventHandler(() => {
    setIsResizing(false);
    resizeStartRef.current = null;
  }, []);

  useEffect(() => {
    if (isResizing) {
      const options = { passive: false };
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);
      document.addEventListener('touchmove', handleResizeMove, options);
      document.addEventListener('touchend', handleResizeEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('mouseup', handleResizeEnd);
        document.removeEventListener('touchmove', handleResizeMove);
        document.removeEventListener('touchend', handleResizeEnd);
      };
    }
  }, [isResizing, handleResizeMove, handleResizeEnd]);

  const handleToggleMaximize = useOptimizedEventHandler(() => {
    setIsMaximized(!isMaximized);
    setHeight(isMaximized ? 30 : 90);
    triggerHapticFeedback('medium');
  }, [isMaximized]);

  const handleViewChange = useOptimizedEventHandler((newView: 'code' | 'preview' | 'split') => {
    setView(newView);
    if (newView === 'preview' || newView === 'split') {
      setPreviewKey(prev => prev + 1);
    }
    triggerHapticFeedback('light');
  }, []);

  const handleRun = useOptimizedEventHandler(() => {
    triggerHapticFeedback('medium');
    if (onRun) {
      onRun();
    }
    if (langConfig.previewable) {
      setView('preview');
      setPreviewKey(prev => prev + 1);
    }
  }, [onRun, langConfig.previewable]);

  const handleClose = useOptimizedEventHandler(() => {
    triggerHapticFeedback('light');
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  const currentHeight = isMaximized ? '90vh' : `${height}vh`;

  return (
    <div 
      ref={editorRef}
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-40 flex flex-col" 
      style={{ height: currentHeight, transition: 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
    >
      {/* Resize Handle */}
      <div
        className={`h-2 bg-gray-100 border-b border-gray-200 cursor-ns-resize flex items-center justify-center hover:bg-gray-200 transition-colors ${
          isResizing ? 'bg-blue-100' : ''
        }`}
        onMouseDown={handleResizeStart}
        onTouchStart={handleResizeStart}
        style={{ touchAction: 'none' }}
      >
        <div className="w-12 h-1 bg-gray-400 rounded-full"></div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 p-3 bg-gray-50 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg ${langConfig.bgColor} flex items-center justify-center text-white shadow-sm`}>
            <IconComponent className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              Editing: <span className="text-blue-600">{title}</span>
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <div className="bg-gray-200 px-2 py-0.5 rounded text-xs font-medium">{language}</div>
              <div className="text-xs text-gray-500">{code.split('\n').length} lines</div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* View Toggle Buttons */}
          <div className="flex items-center bg-gray-200 rounded-lg p-1">
            <Button
              size="sm"
              variant={view === 'code' ? 'default' : 'ghost'}
              onClick={() => handleViewChange('code')}
              className="gap-1 h-8"
            >
              <Code className="w-4 h-4" />
              Code
            </Button>
            {langConfig.previewable && (
              <>
                <Button
                  size="sm"
                  variant={view === 'split' ? 'default' : 'ghost'}
                  onClick={() => handleViewChange('split')}
                  className="gap-1 h-8"
                >
                  <Maximize2 className="w-4 h-4" />
                  Split
                </Button>
                <Button
                  size="sm"
                  variant={view === 'preview' ? 'default' : 'ghost'}
                  onClick={() => handleViewChange('preview')}
                  className="gap-1 h-8"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </Button>
              </>
            )}
          </div>
          
          {/* Action Buttons */}
          {langConfig.runnable && (
            <Button
              size="sm"
              onClick={handleRun}
              className="bg-green-600 hover:bg-green-700 gap-1 h-8"
            >
              <Play className="w-4 h-4" />
              Run
            </Button>
          )}
          
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={handleToggleMaximize} 
            className="p-2 h-8 w-8"
          >
            {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
          
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={handleClose} 
            className="p-2 h-8 w-8"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Editor/Preview Content */}
      <div className="flex-1 overflow-hidden">
        {view === 'code' ? (
          <div className="h-full">
            <CodeEditor
              language={language}
              code={code}
              onChange={onChange}
            />
          </div>
        ) : view === 'preview' ? (
          <div className="h-full">
            <CodePreview
              key={previewKey}
              language={language}
              code={code}
            />
          </div>
        ) : (
          <div className="h-full flex">
            <div className="w-1/2 h-full border-r border-gray-200">
              <CodeEditor
                language={language}
                code={code}
                onChange={onChange}
              />
            </div>
            <div className="w-1/2 h-full">
              <CodePreview
                key={previewKey}
                language={language}
                code={code}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

EnhancedBottomEditor.displayName = 'EnhancedBottomEditor';

export default EnhancedBottomEditor;
