
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, Play, Eye, Code as CodeIcon, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import CodePreview from './CodePreview';
import { getLanguageConfig } from '@/config/languages';

interface MobileCodeEditorProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  language: string;
  code: string;
  onChange: (code: string) => void;
}

const MobileCodeEditor: React.FC<MobileCodeEditorProps> = ({
  isOpen,
  onClose,
  title,
  language,
  code,
  onChange
}) => {
  const [view, setView] = useState<'code' | 'preview' | 'split'>('code');
  const [isExpanded, setIsExpanded] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const langConfig = getLanguageConfig(language);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
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
  };

  const handleRunCode = () => {
    console.log(`Running ${language} code:`, code);
    if (langConfig.previewable) {
      setView('preview');
      setPreviewKey(prev => prev + 1);
    }
  };

  const handleViewChange = (newView: 'code' | 'preview' | 'split') => {
    setView(newView);
    if ((newView === 'preview' || newView === 'split') && langConfig.previewable) {
      setPreviewKey(prev => prev + 1);
    }
  };

  const getLanguageComment = () => {
    switch (language) {
      case 'javascript':
        return '// JavaScript code here...';
      case 'html':
        return '<!-- HTML markup here -->';
      case 'css':
        return '/* CSS styles here */';
      case 'python':
        return '# Python code here...';
      case 'java':
        return '// Java code here...';
      case 'cpp':
        return '// C++ code here...';
      case 'react':
        return '// React component here...';
      case 'php':
        return '<?php // PHP code here... ?>';
      case 'swift':
        return '// Swift code here...';
      case 'go':
        return '// Go code here...';
      case 'rust':
        return '// Rust code here...';
      case 'sql':
        return '-- SQL queries here...';
      default:
        return '// Code here...';
    }
  };

  // Auto-expand when opened
  useEffect(() => {
    if (isOpen) {
      setIsExpanded(true);
    }
  }, [isOpen]);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="bottom" 
        className={`${isExpanded ? 'h-[95vh]' : 'h-[60vh]'} rounded-t-2xl transition-all duration-300 p-0`}
      >
        <div className="flex flex-col h-full">
          <SheetHeader className="flex flex-row items-center justify-between p-4 pb-2 border-b border-gray-200">
            <SheetTitle className="text-lg">{title}</SheetTitle>
            <div className="flex items-center gap-2">
              {/* View Toggle Buttons - Always show for all languages */}
              <div className="flex items-center bg-gray-200 rounded-lg p-1">
                <Button
                  size="sm"
                  variant={view === 'code' ? 'default' : 'ghost'}
                  onClick={() => handleViewChange('code')}
                  className="h-8 px-3 rounded-md transition-all duration-200"
                >
                  <CodeIcon className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant={view === 'split' ? 'default' : 'ghost'}
                  onClick={() => handleViewChange('split')}
                  className="h-8 px-3 rounded-md transition-all duration-200"
                  disabled={!langConfig.previewable}
                >
                  <Maximize2 className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant={view === 'preview' ? 'default' : 'ghost'}
                  onClick={() => handleViewChange('preview')}
                  className="h-8 px-3 rounded-md transition-all duration-200"
                  disabled={!langConfig.previewable}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Run Button */}
              {langConfig.runnable && (
                <Button
                  size="sm"
                  onClick={handleRunCode}
                  className="h-8 px-4 bg-green-600 hover:bg-green-700 touch-manipulation"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Run
                </Button>
              )}
              
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-8 w-8 p-0 touch-manipulation"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronUp className="w-4 h-4" />
                )}
              </Button>
            </div>
          </SheetHeader>
          
          <div className="flex flex-col h-full overflow-hidden">
            {view === 'code' ? (
              <div className="h-full">
                <div className="relative h-full bg-gray-900 rounded-none overflow-hidden">
                  <textarea
                    ref={textareaRef}
                    value={code}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder={getLanguageComment()}
                    className="absolute inset-0 w-full h-full pl-4 pr-4 py-3 bg-transparent text-white font-mono resize-none outline-none text-base border-none"
                    style={{
                      lineHeight: '1.5',
                      tabSize: 2,
                      fontSize: '16px',
                      WebkitAppearance: 'none',
                      borderRadius: 0,
                      minHeight: '100%'
                    }}
                    spellCheck={false}
                    autoCapitalize="off"
                    autoCorrect="off"
                    autoComplete="off"
                    data-gramm="false"
                  />
                </div>
              </div>
            ) : view === 'preview' ? (
              <div className="h-full">
                {langConfig.previewable ? (
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
                  <div className="relative h-full bg-gray-900 rounded-none overflow-hidden">
                    <textarea
                      ref={textareaRef}
                      value={code}
                      onChange={handleChange}
                      onKeyDown={handleKeyDown}
                      placeholder={getLanguageComment()}
                      className="absolute inset-0 w-full h-full pl-4 pr-4 py-3 bg-transparent text-white font-mono resize-none outline-none text-base border-none"
                      style={{
                        lineHeight: '1.5',
                        tabSize: 2,
                        fontSize: '16px',
                        WebkitAppearance: 'none',
                        borderRadius: 0,
                        minHeight: '100%'
                      }}
                      spellCheck={false}
                      autoCapitalize="off"
                      autoCorrect="off"
                      autoComplete="off"
                      data-gramm="false"
                    />
                  </div>
                </div>
                <div className="w-1/2 h-full">
                  {langConfig.previewable ? (
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
      </SheetContent>
    </Sheet>
  );
};

export default MobileCodeEditor;
