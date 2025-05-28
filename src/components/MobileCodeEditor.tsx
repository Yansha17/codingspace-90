
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, Play, Eye, Code as CodeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import CodePreview from './CodePreview';

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
  const [showPreview, setShowPreview] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    if (['html', 'css', 'javascript'].includes(language)) {
      setShowPreview(true);
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

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="bottom" 
        className={`${isExpanded ? 'h-[90vh]' : 'h-[50vh]'} rounded-t-2xl transition-all duration-300`}
      >
        <SheetHeader className="flex flex-row items-center justify-between pb-4">
          <SheetTitle className="text-lg">{title}</SheetTitle>
          <div className="flex items-center gap-2">
            {['javascript', 'python', 'html', 'css'].includes(language) && (
              <Button
                size="sm"
                variant="ghost"
                onClick={handleRunCode}
                className="h-8 w-8 p-0 hover:bg-green-100"
              >
                <Play className="w-4 h-4 text-green-600" />
              </Button>
            )}
            
            {['html', 'css', 'javascript'].includes(language) && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowPreview(!showPreview)}
                className="h-8 w-8 p-0 hover:bg-blue-100"
              >
                {showPreview ? (
                  <CodeIcon className="w-4 h-4 text-blue-600" />
                ) : (
                  <Eye className="w-4 h-4 text-blue-600" />
                )}
              </Button>
            )}
            
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 w-8 p-0"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronUp className="w-4 h-4" />
              )}
            </Button>
          </div>
        </SheetHeader>
        
        <div className="flex flex-col h-full">
          <div className={`${showPreview ? 'h-1/2' : 'h-full'} flex-1`}>
            <div className="relative h-full bg-gray-900 rounded-lg overflow-hidden">
              <textarea
                ref={textareaRef}
                value={code}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder={getLanguageComment()}
                className="absolute inset-0 pl-4 pr-4 py-2 bg-transparent text-white font-mono resize-none outline-none text-base"
                style={{
                  lineHeight: '1.5',
                  tabSize: 2,
                  fontSize: '16px', // Prevent zoom on iOS
                  WebkitAppearance: 'none',
                  borderRadius: 0
                }}
                spellCheck={false}
                autoCapitalize="off"
                autoCorrect="off"
                autoComplete="off"
                data-gramm="false"
              />
            </div>
          </div>
          
          {showPreview && ['html', 'css', 'javascript'].includes(language) && (
            <div className="h-1/2 border-t border-gray-200 mt-2">
              <CodePreview language={language} code={code} />
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileCodeEditor;
