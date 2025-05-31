
import React, { useState, useRef, useEffect } from 'react';
import { X, Code, Eye, Play, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import CodeEditor from './CodeEditor';
import CodePreview from './CodePreview';
import { getLanguageConfig } from '@/config/languages';

interface FuturisticBottomEditorProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  language: string;
  code: string;
  onChange: (code: string) => void;
  onRun?: () => void;
}

const FuturisticBottomEditor: React.FC<FuturisticBottomEditorProps> = ({
  isOpen,
  onClose,
  title,
  language,
  code,
  onChange,
  onRun
}) => {
  const [view, setView] = useState<'code' | 'preview'>('code');
  const [isExpanded, setIsExpanded] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const langConfig = getLanguageConfig(language);
  const IconComponent = langConfig.icon;

  const handleChange = (newCode: string) => {
    onChange(newCode);
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
    if (onRun) {
      onRun();
    }
  };

  const handleViewToggle = (checked: boolean) => {
    setView(checked ? 'preview' : 'code');
    if (checked && langConfig.previewable) {
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

  if (!isOpen) return null;

  return (
    <div className={`fixed bottom-4 left-4 right-4 z-50 transition-all duration-300 ${
      isExpanded ? 'h-[85vh]' : 'h-[60vh]'
    }`}>
      <div className="h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-slate-700/50 backdrop-blur-xl overflow-hidden">
        {/* Futuristic Header */}
        <div className="bg-gradient-to-r from-slate-800/90 to-slate-700/90 backdrop-blur-sm border-b border-slate-600/50 p-4">
          <div className="flex items-center justify-between">
            {/* Title Section */}
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-xl ${langConfig.bgColor} flex items-center justify-center text-white shadow-lg`}>
                <IconComponent className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">{title}</h3>
                <p className="text-slate-400 text-sm">{language}</p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              {/* Code/Preview Switch */}
              {langConfig.previewable && (
                <div className="flex items-center gap-2 bg-slate-700/50 rounded-lg p-2">
                  <Code className="w-4 h-4 text-slate-300" />
                  <Switch
                    checked={view === 'preview'}
                    onCheckedChange={handleViewToggle}
                    className="data-[state=checked]:bg-emerald-600 data-[state=unchecked]:bg-blue-600"
                  />
                  <Eye className="w-4 h-4 text-slate-300" />
                </div>
              )}

              {/* Run Button */}
              {langConfig.runnable && (
                <Button
                  onClick={handleRunCode}
                  className="bg-green-600 hover:bg-green-700 text-white rounded-lg h-10 px-4 shadow-lg transition-all duration-200"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Run
                </Button>
              )}

              {/* Expand Button */}
              <Button
                variant="ghost"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-10 w-10 p-0 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200"
              >
                {isExpanded ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </Button>

              {/* Close Button */}
              <Button
                variant="ghost"
                onClick={onClose}
                className="h-10 w-10 p-0 text-slate-300 hover:text-white hover:bg-red-600/20 rounded-lg transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Editor Content */}
        <div className="h-full overflow-hidden">
          {view === 'code' ? (
            <div className="h-full">
              <CodeEditor
                language={language}
                code={code}
                onChange={handleChange}
              />
            </div>
          ) : (
            <div className="h-full">
              {langConfig.previewable ? (
                <CodePreview
                  key={previewKey}
                  language={language}
                  code={code}
                />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-slate-400 mb-2">
                      <Eye className="w-12 h-12 mx-auto" />
                    </div>
                    <p className="text-slate-300">Preview not available for {language}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FuturisticBottomEditor;
