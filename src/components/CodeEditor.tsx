
import React, { useRef, useEffect, useState, memo } from 'react';
import { getLanguageComment } from '@/config/languages';
import { useDebouncedCallback } from '@/utils/performance';

interface CodeEditorProps {
  language: string;
  code: string;
  onChange: (code: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = memo(({ language, code, onChange }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [lineNumbers, setLineNumbers] = useState<number[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [localCode, setLocalCode] = useState(code);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setLocalCode(code);
  }, [code]);

  useEffect(() => {
    const lines = localCode.split('\n');
    setLineNumbers(Array.from({ length: lines.length }, (_, i) => i + 1));
  }, [localCode]);

  const debouncedOnChange = useDebouncedCallback((newCode: string) => {
    onChange(newCode);
  }, 100, [onChange]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setLocalCode(newCode);
    debouncedOnChange(newCode);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      const newValue = localCode.substring(0, start) + '  ' + localCode.substring(end);
      setLocalCode(newValue);
      onChange(newValue);
      
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
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
        value={localCode}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={getLanguageComment(language)}
        className={`absolute inset-0 ${isMobile ? 'pl-4' : 'pl-14'} pr-4 py-2 bg-transparent text-white font-mono resize-none outline-none`}
        style={{
          lineHeight: '1.5',
          tabSize: 2,
          fontSize: isMobile ? '16px' : '14px',
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
  );
});

CodeEditor.displayName = 'CodeEditor';

export default CodeEditor;
