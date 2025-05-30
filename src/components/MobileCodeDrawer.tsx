
import React, { useState, useRef, useEffect } from 'react';
import { X, Code, Eye, Play, ChevronUp, ChevronDown, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import CodeEditor from './CodeEditor';
import CodePreview from './CodePreview';
import { getLanguageConfig } from '@/config/languages';
import { triggerHapticFeedback } from '@/utils/performance';

interface MobileCodeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  language: string;
  code: string;
  onChange: (code: string) => void;
  onRun?: () => void;
}

const MobileCodeDrawer: React.FC<MobileCodeDrawerProps> = ({
  isOpen,
  onClose,
  title,
  language,
  code,
  onChange,
  onRun
}) => {
  const [view, setView] = useState<'code' | 'preview' | 'split'>('code');
  const [height, setHeight] = useState(60); // percentage of screen height
  const [isResizing, setIsResizing] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const resizeStartRef = useRef<{ y: number; height: number } | null>(null);

  const langConfig = getLanguageConfig(language);
  const IconComponent = langConfig.icon;

  const handleResizeStart = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setIsResizing(true);
    resizeStartRef.current = { y: clientY, height };
    triggerHapticFeedback('light');
  };

  const handleResizeMove = (e: TouchEvent | MouseEvent) => {
    if (!isResizing || !resizeStartRef.current) return;
    
    e.preventDefault();
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const deltaY = resizeStartRef.current.y - clientY;
    const viewportHeight = window.innerHeight;
    const newHeight = Math.max(30, Math.min(90, resizeStartRef.current.height + (deltaY / viewportHeight) * 100));
    
    setHeight(newHeight);
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
    resizeStartRef.current = null;
  };

  useEffect(() => {
    if (isResizing) {
      const options = { passive: false };
      document.addEventListener('touchmove', handleResizeMove, options);
      document.addEventListener('touchend', handleResizeEnd);
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);
      
      return () => {
        document.removeEventListener('touchmove', handleResizeMove);
        document.removeEventListener('touchend', handleResizeEnd);
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('mouseup', handleResizeEnd);
      };
    }
  }, [isResizing]);

  const handleViewChange = (newView: 'code' | 'preview' | 'split') => {
    setView(newView);
    if (newView === 'preview' || newView === 'split') {
      setPreviewKey(prev => prev + 1);
    }
    triggerHapticFeedback('light');
  };

  const handleRun = () => {
    triggerHapticFeedback('medium');
    if (onRun) {
      onRun();
    }
    if (langConfig.previewable) {
      setView('preview');
      setPreviewKey(prev => prev + 1);
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent 
        className="h-auto max-h-[90vh] rounded-t-2xl"
        style={{ height: `${height}vh` }}
      >
        {/* Resize Handle */}
        <div
          className={`h-3 bg-gray-100 border-b border-gray-200 cursor-ns-resize flex items-center justify-center hover:bg-gray-200 transition-colors ${
            isResizing ? 'bg-blue-100' : ''
          }`}
          onTouchStart={handleResizeStart}
          onMouseDown={handleResizeStart}
          style={{ touchAction: 'none' }}
        >
          <div className="w-12 h-1 bg-gray-400 rounded-full"></div>
        </div>

        <DrawerHeader className="flex flex-row items-center justify-between p-4 pb-2 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg ${langConfig.bgColor} flex items-center justify-center text-white shadow-sm`}>
              <IconComponent className="w-4 h-4" />
            </div>
            <div>
              <DrawerTitle className="text-lg">{title}</DrawerTitle>
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
                className="gap-1 h-8 text-xs"
              >
                <Code className="w-3 h-3" />
                Code
              </Button>
              {langConfig.previewable && (
                <>
                  <Button
                    size="sm"
                    variant={view === 'split' ? 'default' : 'ghost'}
                    onClick={() => handleViewChange('split')}
                    className="gap-1 h-8 text-xs"
                  >
                    <Maximize2 className="w-3 h-3" />
                    Split
                  </Button>
                  <Button
                    size="sm"
                    variant={view === 'preview' ? 'default' : 'ghost'}
                    onClick={() => handleViewChange('preview')}
                    className="gap-1 h-8 text-xs"
                  >
                    <Eye className="w-3 h-3" />
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
                className="bg-green-600 hover:bg-green-700 gap-1 h-8 text-xs"
              >
                <Play className="w-3 h-3" />
                Run
              </Button>
            )}
            
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={onClose} 
              className="p-2 h-8 w-8"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DrawerHeader>
        
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
            <div className="h-full flex flex-col">
              <div className="h-1/2 border-b border-gray-200">
                <CodeEditor
                  language={language}
                  code={code}
                  onChange={onChange}
                />
              </div>
              <div className="h-1/2">
                <CodePreview
                  key={previewKey}
                  language={language}
                  code={code}
                />
              </div>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileCodeDrawer;
