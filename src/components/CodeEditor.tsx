
import React, { useRef, useEffect, useState } from 'react';

interface CodeEditorProps {
  language: string;
  code: string;
  onChange: (code: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ language, code, onChange }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [lineNumbers, setLineNumbers] = useState<number[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const lines = code.split('\n');
    setLineNumbers(Array.from({ length: lines.length }, (_, i) => i + 1));
  }, [code]);

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
    <div className="relative h-full bg-gray-900 text-white">
      {/* Line Numbers - Hidden on very small mobile screens */}
      {!isMobile && (
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gray-800 border-r border-gray-700 flex flex-col text-xs text-gray-400 font-mono z-10">
          {lineNumbers.map((lineNum) => (
            <div key={lineNum} className="px-2 py-0.5 text-right" style={{ lineHeight: '1.5' }}>
              {lineNum}
            </div>
          ))}
        </div>
      )}

      {/* Code Textarea */}
      <textarea
        ref={textareaRef}
        value={code}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={getLanguageComment()}
        className={`absolute inset-0 ${isMobile ? 'pl-4' : 'pl-14'} pr-4 py-2 bg-transparent text-white font-mono resize-none outline-none`}
        style={{
          lineHeight: '1.5',
          tabSize: 2,
          fontSize: isMobile ? '16px' : '14px', // Prevent zoom on iOS
          WebkitAppearance: 'none', // Remove iOS styling
          borderRadius: 0 // Remove iOS border radius
        }}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        autoComplete="off"
        data-gramm="false" // Disable Grammarly
      />
    </div>
  );
};

export default CodeEditor;
