
import React from 'react';

interface CodePreviewMiniProps {
  code: string;
  language: string;
  maxLines?: number;
}

const CodePreviewMini: React.FC<CodePreviewMiniProps> = ({ 
  code, 
  language, 
  maxLines = 3 
}) => {
  const lines = code.split('\n').slice(0, maxLines);
  const hasMoreLines = code.split('\n').length > maxLines;

  const getLanguageComment = () => {
    switch (language) {
      case 'javascript':
        return '// JavaScript';
      case 'html':
        return '<!-- HTML -->';
      case 'css':
        return '/* CSS */';
      case 'python':
        return '# Python';
      case 'java':
        return '// Java';
      case 'cpp':
        return '// C++';
      case 'react':
        return '// React';
      case 'php':
        return '<?php';
      case 'swift':
        return '// Swift';
      case 'go':
        return '// Go';
      case 'rust':
        return '// Rust';
      case 'sql':
        return '-- SQL';
      default:
        return '// Code';
    }
  };

  if (!code.trim()) {
    return (
      <div className="text-xs text-gray-500 font-mono p-2 bg-gray-900 text-gray-400 rounded">
        {getLanguageComment()}
        <br />
        <span className="opacity-60">Click Edit to start coding...</span>
      </div>
    );
  }

  return (
    <div className="text-xs font-mono p-2 bg-gray-900 text-gray-100 rounded overflow-hidden">
      {lines.map((line, index) => (
        <div key={index} className="truncate leading-tight">
          <span className="text-gray-500 mr-2">{index + 1}</span>
          <span className="text-gray-100">
            {line || ' '}
          </span>
        </div>
      ))}
      {hasMoreLines && (
        <div className="text-gray-500 text-center mt-1">...</div>
      )}
    </div>
  );
};

export default CodePreviewMini;
