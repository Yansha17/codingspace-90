
import React, { useRef, useEffect, useState } from 'react';

interface CodeEditorProps {
  language: string;
  code: string;
  onChange: (code: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ language, code, onChange }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [lineNumbers, setLineNumbers] = useState<number[]>([]);

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
      default:
        return '// Code here...';
    }
  };

  return (
    <div className="relative h-full bg-gray-900 text-white">
      {/* Line Numbers */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gray-800 border-r border-gray-700 flex flex-col text-xs text-gray-400 font-mono">
        {lineNumbers.map((lineNum) => (
          <div key={lineNum} className="px-2 py-0.5 text-right">
            {lineNum}
          </div>
        ))}
      </div>

      {/* Code Textarea */}
      <textarea
        ref={textareaRef}
        value={code}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={getLanguageComment()}
        className="absolute inset-0 pl-14 pr-4 py-2 bg-transparent text-white font-mono text-sm resize-none outline-none"
        style={{
          lineHeight: '1.5',
          tabSize: 2
        }}
        spellCheck={false}
      />
    </div>
  );
};

export default CodeEditor;
