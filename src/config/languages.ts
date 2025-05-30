import { 
  Globe, 
  Palette, 
  Zap, 
  Atom, 
  Heart, 
  Code, 
  Coffee, 
  Settings, 
  Smartphone, 
  Rabbit, 
  Wrench, 
  Database 
} from 'lucide-react';

export interface LanguageConfig {
  name: string;
  color: string;
  bgColor: string;
  textColor: string;
  icon: typeof Globe;
  borderColor: string;
  previewable: boolean;
  runnable: boolean;
}

export const LANGUAGE_CONFIG: Record<string, LanguageConfig> = {
  html: {
    name: 'HTML',
    color: '#E34F26',
    bgColor: 'bg-orange-500',
    textColor: 'white',
    icon: Globe,
    borderColor: 'border-orange-400 bg-orange-50',
    previewable: true,
    runnable: true
  },
  css: {
    name: 'CSS',
    color: '#1572B6',
    bgColor: 'bg-blue-500',
    textColor: 'white',
    icon: Palette,
    borderColor: 'border-blue-400 bg-blue-50',
    previewable: true,
    runnable: true
  },
  javascript: {
    name: 'JavaScript',
    color: '#F7DF1E',
    bgColor: 'bg-yellow-500',
    textColor: 'black',
    icon: Zap,
    borderColor: 'border-yellow-400 bg-yellow-50',
    previewable: true,
    runnable: true
  },
  react: {
    name: 'React',
    color: '#61DAFB',
    bgColor: 'bg-cyan-500',
    textColor: 'black',
    icon: Atom,
    borderColor: 'border-cyan-400 bg-cyan-50',
    previewable: true,
    runnable: true
  },
  vue: {
    name: 'Vue',
    color: '#4FC08D',
    bgColor: 'bg-green-500',
    textColor: 'white',
    icon: Heart,
    borderColor: 'border-green-400 bg-green-50',
    previewable: false,
    runnable: false
  },
  python: {
    name: 'Python',
    color: '#3776AB',
    bgColor: 'bg-blue-600',
    textColor: 'white',
    icon: Code,
    borderColor: 'border-blue-600 bg-blue-50',
    previewable: false,
    runnable: true
  },
  java: {
    name: 'Java',
    color: '#007396',
    bgColor: 'bg-blue-700',
    textColor: 'white',
    icon: Coffee,
    borderColor: 'border-blue-700 bg-blue-50',
    previewable: false,
    runnable: false
  },
  cpp: {
    name: 'C++',
    color: '#00599C',
    bgColor: 'bg-blue-800',
    textColor: 'white',
    icon: Settings,
    borderColor: 'border-blue-800 bg-blue-50',
    previewable: false,
    runnable: false
  },
  php: {
    name: 'PHP',
    color: '#777BB4',
    bgColor: 'bg-purple-500',
    textColor: 'white',
    icon: Code,
    borderColor: 'border-purple-500 bg-purple-50',
    previewable: false,
    runnable: false
  },
  swift: {
    name: 'Swift',
    color: '#FA7343',
    bgColor: 'bg-orange-500',
    textColor: 'white',
    icon: Smartphone,
    borderColor: 'border-orange-500 bg-orange-50',
    previewable: false,
    runnable: false
  },
  go: {
    name: 'Go',
    color: '#00ADD8',
    bgColor: 'bg-cyan-600',
    textColor: 'white',
    icon: Rabbit,
    borderColor: 'border-cyan-500 bg-cyan-50',
    previewable: false,
    runnable: false
  },
  rust: {
    name: 'Rust',
    color: '#000000',
    bgColor: 'bg-gray-800',
    textColor: 'white',
    icon: Wrench,
    borderColor: 'border-gray-800 bg-gray-50',
    previewable: false,
    runnable: false
  },
  sql: {
    name: 'SQL',
    color: '#336791',
    bgColor: 'bg-blue-700',
    textColor: 'white',
    icon: Database,
    borderColor: 'border-blue-700 bg-blue-50',
    previewable: false,
    runnable: false
  }
};

export const getLanguageConfig = (language: string): LanguageConfig => {
  return LANGUAGE_CONFIG[language.toLowerCase()] || {
    name: language,
    color: '#6B7280',
    bgColor: 'bg-gray-600',
    textColor: 'white',
    icon: Code,
    borderColor: 'border-gray-400 bg-gray-50',
    previewable: false,
    runnable: false
  };
};

export const getLanguageComment = (language: string): string => {
  switch (language.toLowerCase()) {
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
