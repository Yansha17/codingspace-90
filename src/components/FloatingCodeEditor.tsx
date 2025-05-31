
import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { X, Maximize2, Minimize2, GripHorizontal, Play, Eye, Code as CodeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CodePreview from './CodePreview';
import { getLanguageConfig } from '@/config/languages';
import { optimizeTransform, triggerHapticFeedback } from '@/utils/performance';

interface FloatingCodeEditorProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  language: string;
  code: string;
  onChange: (code: string) => void;
}

const FloatingCodeEditor: React.FC<FloatingCodeEditorProps> = memo(({
  isOpen,
  onClose,
  title,
  language,
  code,
  onChange
}) => {
  const [view, setView] = useState<'code' | 'preview' | 'split'>('code');
  const [isMaximized, setIsMaximized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: window.innerHeight - 400 });
  const [size, setSize] = useState({ width: window.innerWidth - 40, height: 350 });
  const [previewKey, setPreviewKey] = useState(0);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const resizeStartRef = useRef<{ x: number; y: number; width: number; height: number } | null>(null);

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
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    setIsDragging(true);
    triggerHapticFeedback('light');
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: clientX - rect.left,
        y: clientY - rect.top
      });
    }
  }, [isMaximized]);

  const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging || isMaximized) return;
    
    e.preventDefault();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const newX = Math.max(0, Math.min(window.innerWidth - size.width, clientX - dragOffset.x));
    const newY = Math.max(60, Math.min(window.innerHeight - size.height, clientY - dragOffset.y));
    
    setPosition({ x: newX, y: newY });
    
    if (containerRef.current) {
      optimizeTransform(containerRef.current, newX, newY);
    }
  }, [isDragging, isMaximized, size, dragOffset]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    if (containerRef.current) {
      containerRef.current.style.willChange = 'auto';
    }
  }, []);

  const handleResizeStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (isMaximized) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    setIsResizing(true);
    triggerHapticFeedback('medium');
    
    resizeStartRef.current = {
      x: clientX,
      y: clientY,
      width: size.width,
      height: size.height
    };
  }, [isMaximized, size]);

  const handleResizeMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isResizing || !resizeStartRef.current || isMaximized) return;
    
    e.preventDefault();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const deltaX = clientX - resizeStartRef.current.x;
    const deltaY = resizeStartRef.current.y - clientY; // Inverted for bottom resize
    
    const newWidth = Math.max(300, Math.min(window.innerWidth - position.x, resizeStartRef.current.width + deltaX));
    const newHeight = Math.max(200, Math.min(window.innerHeight - position.y, resizeStartRef.current.height + deltaY));
    
    setSize({ width: newWidth, height: newHeight });
  }, [isResizing, position, isMaximized]);

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
    resizeStartRef.current = null;
  }, []);

  // Global event listeners
  useEffect(() => {
    if (isDragging || isResizing) {
      const options = { passive: false };
      document.addEventListener('mousemove', isDragging ? handleDragMove : handleResizeMove);
      document.addEventListener('mouseup', isDragging ? handleDragEnd : handleResizeEnd);
      document.addEventListener('touchmove', isDragging ? handleDragMove : handleResizeMove, options);
      document.addEventListener('touchend', isDragging ? handleDragEnd : handleResizeEnd);
      
      return () => {
        document.removeEventListener('mousemove', isDragging ? handleDragMove : handleResizeMove);
        document.removeEventListener('mouseup', isDragging ? handleDragEnd : handleResizeEnd);
        document.removeEventListener('touchmove', isDragging ? handleDragMove : handleResizeMove);
        document.removeEventListener('touchend', isDragging ? handleDragEnd : handleResizeEnd);
      };
    }
  }, [isDragging, isResizing, handleDragMove, handleDragEnd, handleResizeMove, handleResizeEnd]);

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

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      const newValue = code.substring(0, start) + '  ' + code.substring(end);
      onChange(newValue);
      
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  }, [code, onChange]);

  const handleRunCode = useCallback(() => {
    console.log(`Running ${language} code:`, code);
    if (langConfig.previewable) {
      setView('preview');
      setPreviewKey(prev => prev + 1);
    }
  }, [language, code, langConfig.previewable]);

  const handleViewChange = useCallback((newView: 'code' | 'preview' | 'split') => {
    setView(newView);
    if ((newView === 'preview' || newView === 'split') && langConfig.previewable) {
      setPreviewKey(prev => prev + 1);
    }
  }, [langConfig.previewable]);

  const getLanguageComment = () => {
    switch (language) {
      case 'javascript': return '// JavaScript code here...';
      case 'html': return '<!-- HTML markup here -->';
      case 'css': return '/* CSS styles here */';
      case 'python': return '# Python code here...';
      case 'java': return '// Java code here...';
      case 'cpp': return '// C++ code here...';
      case 'react': return '// React component here...';
      case 'php': return '<?php // PHP code here... ?>';
      case 'swift': return '// Swift code here...';
      case 'go': return '// Go code here...';
      case 'rust': return '// Rust code here...';
      case 'sql': return '-- SQL queries here...';
      default: return '// Code here...';
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      className={`fixed z-50 bg-white dark:bg-gray-900 rounded-t-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden ${
        isDragging ? 'cursor-grabbing' : ''
      }`}
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        transform: isDragging ? 'scale(1.01)' : 'scale(1)',
        transition: isDragging ? 'none' : 'transform 0.1s ease-out',
        willChange: isDragging || isResizing ? 'transform' : 'auto',
        backfaceVisibility: 'hidden',
        perspective: '1000px'
      }}
    >
      {/* Header with drag handle */}
      <div 
        className={`flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 ${
          !isMaximized ? 'cursor-grab' : ''
        }`}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
      >
        <div className="flex items-center gap-3">
          <GripHorizontal className="w-5 h-5 text-gray-400" />
          <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
        </div>
        
        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
            <Button
              size="sm"
              variant={view === 'code' ? 'default' : 'ghost'}
              onClick={() => handleViewChange('code')}
              className="h-7 px-2"
            >
              <CodeIcon className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={view === 'split' ? 'default' : 'ghost'}
              onClick={() => handleViewChange('split')}
              className="h-7 px-2"
              disabled={!langConfig.previewable}
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={view === 'preview' ? 'default' : 'ghost'}
              onClick={() => handleViewChange('preview')}
              className="h-7 px-2"
              disabled={!langConfig.previewable}
            >
              <Eye className="w-4 h-4" />
            </Button>
          </div>

          {/* Run Button */}
          {langConfig.runnable && (
            <Button size="sm" onClick={handleRunCode} className="h-7 px-3 bg-green-600 hover:bg-green-700">
              <Play className="w-4 h-4 mr-1" />
              Run
            </Button>
          )}

          {/* Window Controls */}
          <Button size="sm" variant="ghost" onClick={handleMaximize} className="h-7 w-7 p-0">
            {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
          <Button size="sm" variant="ghost" onClick={onClose} className="h-7 w-7 p-0">
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
              onKeyDown={handleKeyDown}
              placeholder={getLanguageComment()}
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
                onKeyDown={handleKeyDown}
                placeholder={getLanguageComment()}
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

      {/* Resize Handle */}
      {!isMaximized && (
        <div
          className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-2 cursor-ns-resize bg-gray-300 dark:bg-gray-600 rounded-b-full hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
          onMouseDown={handleResizeStart}
          onTouchStart={handleResizeStart}
        />
      )}
    </div>
  );
});

FloatingCodeEditor.displayName = 'FloatingCodeEditor';

export default FloatingCodeEditor;
