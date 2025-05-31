
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

interface FuturisticBottomEditorProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  language: string;
  code: string;
  onChange: (code: string) => void;
  onRun?: () => void;
}

const FuturisticBottomEditor: React.FC<FuturisticBottomEditorProps> = memo(({
  isOpen,
  onClose,
  title,
  language,
  code,
  onChange,
  onRun
}) => {
  const [view, setView] = useState<'code' | 'preview' | 'split'>('code');
  const [height, setHeight] = useState(60); // Start with larger height
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

  // Initialize with better default height when opened
  useEffect(() => {
    if (isOpen && !isMaximized) {
      setHeight(60); // Better default height
    }
  }, [isOpen, isMaximized]);

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
    const newHeight = Math.max(30, Math.min(90, resizeStartRef.current.height + (deltaY / viewportHeight) * 100));
    
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
    const targetHeight = newMaximized ? 95 : 60;
    
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

  const currentHeight = isMaximized ? '95vh' : `${height}vh`;

  return (
    <div 
      ref={editorRef}
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-50 flex flex-col will-change-transform" 
      style={{ 
        height: currentHeight, 
        transition: 'height 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        backdropFilter: 'blur(10px)',
        background: 'rgba(255, 255, 255, 0.95)',
        maxHeight: '95vh'
      }}
    >
      {/* Enhanced Resize Handle - Always visible */}
      <div
        className={`h-3 bg-gradient-to-r from-gray-100 to-gray-200 border-b border-gray-200 cursor-ns-resize flex items-center justify-center hover:bg-gradient-to-r hover:from-blue-100 hover:to-blue-200 transition-all duration-200 flex-shrink-0 ${
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

      {/* Enhanced Header - Fixed position, always visible */}
      <div className="flex items-center justify-between border-b border-gray-200 p-3 bg-gradient-to-r from-gray-50 to-white flex-shrink-0 min-h-[60px]">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className={`w-8 h-8 rounded-xl ${langConfig.bgColor} flex items-center justify-center text-white shadow-lg transition-transform duration-200 hover:scale-105 flex-shrink-0`}>
            <IconComponent className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-gray-900 text-sm truncate">
              Editing: <span className="text-blue-600">{title}</span>
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <div className="bg-gradient-to-r from-gray-200 to-gray-300 px-2 py-0.5 rounded-full text-xs font-medium">{language}</div>
              <div className="text-xs text-gray-500">{code.split('\n').length} lines</div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Enhanced View Toggle Buttons */}
          <div className="flex items-center bg-gray-200 dark:bg-gray-700 rounded-lg p-0.5 shadow-inner">
            <Button
              size="sm"
              variant={view === 'code' ? 'default' : 'ghost'}
              onClick={() => handleViewChange('code')}
              className="h-7 px-2 text-xs rounded-md transition-all duration-200"
            >
              <Code className="w-3 h-3" />
            </Button>
            {enhancedCanPreview && (
              <>
                <Button
                  size="sm"
                  variant={view === 'split' ? 'default' : 'ghost'}
                  onClick={() => handleViewChange('split')}
                  className="h-7 px-2 text-xs rounded-md transition-all duration-200"
                >
                  <Maximize2 className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant={view === 'preview' ? 'default' : 'ghost'}
                  onClick={() => handleViewChange('preview')}
                  className="h-7 px-2 text-xs rounded-md transition-all duration-200"
                >
                  <Eye className="w-3 h-3" />
                </Button>
              </>
            )}
          </div>
          
          {/* Enhanced Action Buttons */}
          {enhancedCanRun && (
            <Button
              size="sm"
              onClick={handleRun}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 h-7 px-2 text-xs shadow-lg transition-all duration-200"
            >
              <Play className="w-3 h-3 mr-1" />
              Run
            </Button>
          )}
          
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={handleToggleMaximize} 
            className="p-1 h-7 w-7 hover:bg-gray-100 rounded-md transition-all duration-200"
          >
            {isMaximized ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
          </Button>
          
          {/* Always visible close button */}
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={handleClose} 
            className="p-1 h-7 w-7 hover:bg-red-100 text-red-600 rounded-md transition-all duration-200 flex-shrink-0"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>
      
      {/* Enhanced Editor/Preview Content - Scrollable */}
      <div className="flex-1 overflow-hidden bg-gray-50 min-h-0">
        {view === 'code' ? (
          <div className="h-full overflow-hidden">
            <CodeEditor
              language={language}
              code={code}
              onChange={onChange}
            />
          </div>
        ) : view === 'preview' ? (
          <div className="h-full overflow-hidden">
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
          <div className="h-full flex overflow-hidden">
            <div className="w-1/2 h-full border-r border-gray-200 overflow-hidden">
              <CodeEditor
                language={language}
                code={code}
                onChange={onChange}
              />
            </div>
            <div className="w-1/2 h-full overflow-hidden">
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

FuturisticBottomEditor.displayName = 'FuturisticBottomEditor';

export default FuturisticBottomEditor;
