
import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { X, Maximize2, Minimize2, Play, Eye, Code as CodeIcon, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CodePreview from './CodePreview';
import { getLanguageConfig } from '@/config/languages';
import { optimizeTransform, triggerHapticFeedback } from '@/utils/performance';

interface FloatingWidgetEditorProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  language: string;
  code: string;
  onChange: (code: string) => void;
  onDelete: () => void;
  onRun?: () => void;
}

const FloatingWidgetEditor: React.FC<FloatingWidgetEditorProps> = memo(({
  isOpen,
  onClose,
  title,
  language,
  code,
  onChange,
  onDelete,
  onRun
}) => {
  const [view, setView] = useState<'code' | 'preview' | 'split'>('code');
  const [isMaximized, setIsMaximized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: window.innerHeight - 400 });
  const [size, setSize] = useState({ width: window.innerWidth - 40, height: 350 });
  const [previewKey, setPreviewKey] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const langConfig = getLanguageConfig(language);

  // Initialize position when opened
  useEffect(() => {
    if (isOpen && !isMaximized) {
      setPosition({ x: 20, y: Math.max(100, window.innerHeight - 400) });
      setSize({ width: window.innerWidth - 40, height: 350 });
    }
  }, [isOpen, isMaximized]);

  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (isMaximized) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragging(true);
    triggerHapticFeedback('light');
  }, [isMaximized]);

  const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging || isMaximized) return;
    
    e.preventDefault();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const newX = Math.max(0, Math.min(window.innerWidth - size.width, clientX - size.width / 2));
    const newY = Math.max(60, Math.min(window.innerHeight - size.height, clientY - 30));
    
    setPosition({ x: newX, y: newY });
    
    if (containerRef.current) {
      optimizeTransform(containerRef.current, newX, newY);
    }
  }, [isDragging, isMaximized, size]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    if (containerRef.current) {
      containerRef.current.style.willChange = 'auto';
    }
  }, []);

  // Global event listeners
  useEffect(() => {
    if (isDragging) {
      const options = { passive: false };
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
      document.addEventListener('touchmove', handleDragMove, options);
      document.addEventListener('touchend', handleDragEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleDragMove);
        document.removeEventListener('mouseup', handleDragEnd);
        document.removeEventListener('touchmove', handleDragMove);
        document.removeEventListener('touchend', handleDragEnd);
      };
    }
  }, [isDragging, handleDragMove, handleDragEnd]);

  const handleMaximize = useCallback(() => {
    setIsMaximized(!isMaximized);
    triggerHapticFeedback('medium');
    
    if (!isMaximized) {
      setPosition({ x: 0, y: 60 });
      setSize({ width: window.innerWidth, height: window.innerHeight - 60 });
    } else {
      setPosition({ x: 20, y: Math.max(100, window.innerHeight - 400) });
      setSize({ width: window.innerWidth - 40, height: 350 });
    }
  }, [isMaximized]);

  const handleCodeChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  const handleRunCode = useCallback(() => {
    console.log(`Running ${language} code:`, code);
    if (onRun) {
      onRun();
    }
    if (langConfig.previewable) {
      setView('preview');
      setPreviewKey(prev => prev + 1);
    }
  }, [language, code, langConfig.previewable, onRun]);

  const handleViewChange = useCallback((newView: 'code' | 'preview' | 'split') => {
    setView(newView);
    if ((newView === 'preview' || newView === 'split') && langConfig.previewable) {
      setPreviewKey(prev => prev + 1);
    }
  }, [langConfig.previewable]);

  const handleDelete = useCallback(() => {
    triggerHapticFeedback('heavy');
    onDelete();
    onClose();
  }, [onDelete, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      className={`fixed z-50 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden ${
        isDragging ? 'cursor-grabbing' : ''
      }`}
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        transform: isDragging ? 'scale(1.02)' : 'scale(1)',
        transition: isDragging ? 'none' : 'transform 0.2s ease-out',
        willChange: isDragging ? 'transform' : 'auto',
        backfaceVisibility: 'hidden',
        perspective: '1000px',
        boxShadow: isDragging 
          ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' 
          : '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
      }}
    >
      {/* Header with drag handle */}
      <div 
        className={`flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-600 ${
          !isMaximized ? 'cursor-grab active:cursor-grabbing' : ''
        }`}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
      >
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-gray-400 rounded-full"></div>
          <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
          <span className={`px-2 py-1 rounded text-xs font-medium ${langConfig.color} bg-opacity-20`}>
            {language}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
            <Button
              size="sm"
              variant={view === 'code' ? 'default' : 'ghost'}
              onClick={() => handleViewChange('code')}
              className="h-8 px-3"
            >
              <CodeIcon className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={view === 'split' ? 'default' : 'ghost'}
              onClick={() => handleViewChange('split')}
              className="h-8 px-3"
              disabled={!langConfig.previewable}
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={view === 'preview' ? 'default' : 'ghost'}
              onClick={() => handleViewChange('preview')}
              className="h-8 px-3"
              disabled={!langConfig.previewable}
            >
              <Eye className="w-4 h-4" />
            </Button>
          </div>

          {/* Action Buttons */}
          {langConfig.runnable && (
            <Button size="sm" onClick={handleRunCode} className="h-8 px-3 bg-green-600 hover:bg-green-700">
              <Play className="w-4 h-4 mr-1" />
              Run
            </Button>
          )}

          <Button size="sm" variant="destructive" onClick={handleDelete} className="h-8 px-3">
            <Trash2 className="w-4 h-4" />
          </Button>

          {/* Window Controls */}
          <Button size="sm" variant="ghost" onClick={handleMaximize} className="h-8 w-8 p-0">
            {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
          <Button size="sm" variant="ghost" onClick={onClose} className="h-8 w-8 p-0">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col h-full">
        {view === 'code' ? (
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={code}
              onChange={handleCodeChange}
              placeholder={`// ${language} code here...`}
              className="absolute inset-0 w-full h-full p-4 bg-gray-900 text-white font-mono resize-none outline-none border-none"
              style={{
                lineHeight: '1.5',
                tabSize: 2,
                fontSize: '14px',
              }}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              autoComplete="off"
            />
          </div>
        ) : view === 'preview' ? (
          <div className="flex-1">
            {langConfig.previewable ? (
              <CodePreview key={previewKey} language={language} code={code} />
            ) : (
              <div className="h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                <p className="text-gray-600 dark:text-gray-400">Preview not available for {language}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex">
            <div className="w-1/2 relative border-r border-gray-200 dark:border-gray-700">
              <textarea
                value={code}
                onChange={handleCodeChange}
                placeholder={`// ${language} code here...`}
                className="absolute inset-0 w-full h-full p-4 bg-gray-900 text-white font-mono resize-none outline-none border-none"
                style={{
                  lineHeight: '1.5',
                  tabSize: 2,
                  fontSize: '14px',
                }}
                spellCheck={false}
                autoCapitalize="off"
                autoCorrect="off"
                autoComplete="off"
              />
            </div>
            <div className="w-1/2">
              {langConfig.previewable ? (
                <CodePreview key={previewKey} language={language} code={code} />
              ) : (
                <div className="h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Preview not available</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

FloatingWidgetEditor.displayName = 'FloatingWidgetEditor';

export default FloatingWidgetEditor;
