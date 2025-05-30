
import React, { useState, useRef, useEffect, memo } from 'react';
import { X, Code, Eye, Play, ChevronUp, ChevronDown, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CodeEditor from './CodeEditor';
import CodePreview from './CodePreview';
import { getLanguageConfig, getLanguageComment } from '@/config/languages';
import { 
  triggerHapticFeedback, 
  useOptimizedEventHandler,
  createSpringAnimation 
} from '@/utils/performance';

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

  // Enhanced preview capability check
  const previewableLanguages = ['html', 'css', 'javascript', 'react'];
  const enhancedCanPreview = langConfig.previewable || previewableLanguages.includes(language.toLowerCase());

  // Enhanced run capability check
  const runnableLanguages = ['javascript', 'python', 'html', 'css'];
  const enhancedCanRun = langConfig.runnable || runnableLanguages.includes(language.toLowerCase());

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
    const newMaximized = !isMaximized;
    const targetHeight = newMaximized ? 90 : 30;
    
    setIsMaximized(newMaximized);
    
    // Smooth spring animation for height change
    if (editorRef.current) {
      createSpringAnimation(editorRef.current, 'height', height, targetHeight, 400);
    }
    
    setHeight(targetHeight);
    triggerHapticFeedback('medium');
  }, [isMaximized, height]);

  const handleViewChange = useOptimizedEventHandler((newView: 'code' | 'preview' | 'split') => {
    setView(newView);
    if ((newView === 'preview' || newView === 'split') && enhancedCanPreview) {
      setPreviewKey(prev => prev + 1);
    }
    triggerHapticFeedback('light');
  }, [enhancedCanPreview]);

  const handleRun = useOptimizedEventHandler(() => {
    triggerHapticFeedback('medium');
    if (onRun) {
      onRun();
    }
    if (enhancedCanPreview) {
      setView('preview');
      setPreviewKey(prev => prev + 1);
    }
  }, [onRun, enhancedCanPreview]);

  const handleClose = useOptimizedEventHandler(() => {
    triggerHapticFeedback('light');
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  const currentHeight = isMaximized ? '90vh' : `${height}vh`;

  return (
    <div 
      ref={editorRef}
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-40 flex flex-col will-change-transform" 
      style={{ 
        height: currentHeight, 
        transition: 'height 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        backdropFilter: 'blur(10px)',
        background: 'rgba(255, 255, 255, 0.95)'
      }}
    >
      {/* Enhanced Resize Handle */}
      <div
        className={`h-3 bg-gradient-to-r from-gray-100 to-gray-200 border-b border-gray-200 cursor-ns-resize flex items-center justify-center hover:bg-gradient-to-r hover:from-blue-100 hover:to-blue-200 transition-all duration-200 ${
          isResizing ? 'bg-gradient-to-r from-blue-100 to-blue-200' : ''
        }`}
        onMouseDown={handleResizeStart}
        onTouchStart={handleResizeStart}
        style={{ touchAction: 'none' }}
      >
        <div className={`w-12 h-1.5 rounded-full transition-all duration-200 ${
          isResizing ? 'bg-blue-500' : 'bg-gray-400 hover:bg-blue-400'
        }`}></div>
      </div>

      {/* Enhanced Header */}
      <div className="flex items-center justify-between border-b border-gray-200 p-4 bg-gradient-to-r from-gray-50 to-white flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-xl ${langConfig.bgColor} flex items-center justify-center text-white shadow-lg transition-transform duration-200 hover:scale-105`}>
            <IconComponent className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">
              Editing: <span className="text-blue-600">{title}</span>
            </h3>
            <div className="flex items-center gap-3 mt-1">
              <div className="bg-gradient-to-r from-gray-200 to-gray-300 px-3 py-1 rounded-full text-sm font-semibold">{language}</div>
              <div className="text-sm text-gray-500">{code.split('\n').length} lines</div>
              <div className="text-sm text-gray-500">{code.length} chars</div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Enhanced View Toggle Buttons */}
          <div className="flex items-center bg-gray-200 rounded-xl p-1 shadow-inner">
            <Button
              size="sm"
              variant={view === 'code' ? 'default' : 'ghost'}
              onClick={() => handleViewChange('code')}
              className="gap-2 h-9 px-4 rounded-lg transition-all duration-200 hover:scale-105"
            >
              <Code className="w-4 h-4" />
              Code
            </Button>
            {enhancedCanPreview && (
              <>
                <Button
                  size="sm"
                  variant={view === 'split' ? 'default' : 'ghost'}
                  onClick={() => handleViewChange('split')}
                  className="gap-2 h-9 px-4 rounded-lg transition-all duration-200 hover:scale-105"
                >
                  <Maximize2 className="w-4 h-4" />
                  Split
                </Button>
                <Button
                  size="sm"
                  variant={view === 'preview' ? 'default' : 'ghost'}
                  onClick={() => handleViewChange('preview')}
                  className="gap-2 h-9 px-4 rounded-lg transition-all duration-200 hover:scale-105"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </Button>
              </>
            )}
          </div>
          
          {/* Enhanced Action Buttons */}
          {enhancedCanRun && (
            <Button
              size="sm"
              onClick={handleRun}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 gap-2 h-9 px-4 shadow-lg transition-all duration-200 hover:scale-105"
            >
              <Play className="w-4 h-4" />
              Run
            </Button>
          )}
          
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={handleToggleMaximize} 
            className="p-2 h-9 w-9 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-105"
          >
            {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
          
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={handleClose} 
            className="p-2 h-9 w-9 hover:bg-red-100 text-red-600 rounded-lg transition-all duration-200 hover:scale-105"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Enhanced Editor/Preview Content */}
      <div className="flex-1 overflow-hidden bg-gray-50">
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
            {enhancedCanPreview ? (
              <CodePreview
                key={previewKey}
                language={language}
                code={code}
              />
            ) : (
              <div className="h-full flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <div className="text-gray-400 mb-2">
                    <Eye className="w-12 h-12 mx-auto" />
                  </div>
                  <p className="text-gray-600">Preview not available for {language}</p>
                </div>
              </div>
            )}
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
              {enhancedCanPreview ? (
                <CodePreview
                  key={previewKey}
                  language={language}
                  code={code}
                />
              ) : (
                <div className="h-full flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <div className="text-gray-400 mb-2">
                      <Eye className="w-8 h-8 mx-auto" />
                    </div>
                    <p className="text-gray-600 text-sm">Preview not available</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

EnhancedBottomEditor.displayName = 'EnhancedBottomEditor';

export default EnhancedBottomEditor;
