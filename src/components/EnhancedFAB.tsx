
import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EnhancedFABProps {
  onCreateWindow: (language: string) => void;
}

// Updated language colors to match the design in the image
const LANGUAGES = {
  html: { name: 'HTML', color: '#E34F26', icon: '🌐', textColor: 'white' },
  css: { name: 'CSS', color: '#1572B6', icon: '🎨', textColor: 'white' },
  javascript: { name: 'JavaScript', color: '#F7DF1E', icon: '⚡', textColor: 'black' },
  react: { name: 'React', color: '#61DAFB', icon: '⚛️', textColor: 'black' },
  vue: { name: 'Vue', color: '#4FC08D', icon: '💚', textColor: 'white' },
  python: { name: 'Python', color: '#3776AB', icon: '🐍', textColor: 'white' },
  java: { name: 'Java', color: '#007396', icon: '☕', textColor: 'white' },
  cpp: { name: 'C++', color: '#00599C', icon: '⚙️', textColor: 'white' },
  php: { name: 'PHP', color: '#777BB4', icon: '🐘', textColor: 'white' },
  swift: { name: 'Swift', color: '#FA7343', icon: '🦉', textColor: 'white' },
  go: { name: 'Go', color: '#00ADD8', icon: '🐹', textColor: 'white' },
  rust: { name: 'Rust', color: '#000000', icon: '🦀', textColor: 'white' },
  sql: { name: 'SQL', color: '#336791', icon: '🗃️', textColor: 'white' }
};

const EnhancedFAB: React.FC<EnhancedFABProps> = ({ onCreateWindow }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleLanguageSelect = (languageKey: string) => {
    console.log(`Creating window for language: ${languageKey}`);
    // Call the parent's function to create the window
    if (onCreateWindow) {
      onCreateWindow(languageKey);
    }
    setIsExpanded(false);
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('FAB toggle clicked, isExpanded:', !isExpanded);
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Backdrop */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm -z-10"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Language Pills */}
      <div className={`absolute bottom-20 right-0 transition-all duration-300 ease-out ${
        isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
      }`}>
        <div className="flex flex-col gap-3 items-end">
          {Object.entries(LANGUAGES).map(([key, lang], index) => (
            <div
              key={key}
              className="transform transition-all duration-300 ease-out"
              style={{
                transitionDelay: isExpanded ? `${index * 50}ms` : '0ms'
              }}
            >
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log(`Language button clicked: ${key}`);
                  handleLanguageSelect(key);
                }}
                className="h-12 px-4 rounded-full shadow-lg border-2 border-white/20 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:shadow-xl"
                style={{
                  backgroundColor: lang.color,
                  color: lang.textColor,
                  transform: isExpanded ? 'translateX(0)' : 'translateX(60px)'
                }}
              >
                <span className="mr-2 text-lg">{lang.icon}</span>
                <span className="font-medium">{lang.name}</span>
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Main FAB Button */}
      <Button
        onClick={handleToggle}
        className={`w-16 h-16 rounded-full shadow-2xl transition-all duration-300 ease-out border-4 border-white/20 backdrop-blur-sm touch-manipulation ${
          isExpanded 
            ? 'bg-red-500 hover:bg-red-600 rotate-45 scale-110' 
            : 'bg-gradient-to-br from-blue-500 via-purple-600 to-blue-700 hover:from-blue-600 hover:via-purple-700 hover:to-blue-800 hover:scale-110'
        }`}
        style={{
          background: isExpanded ? '#EF4444' : 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #1D4ED8 100%)'
        }}
      >
        <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-0' : 'rotate-0'}`}>
          {isExpanded ? (
            <X className="w-7 h-7 text-white" />
          ) : (
            <Plus className="w-7 h-7 text-white" />
          )}
        </div>
      </Button>

      {/* Pulse animation when not expanded */}
      {!isExpanded && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 via-purple-600 to-blue-700 animate-ping opacity-20" />
      )}
    </div>
  );
};

export default EnhancedFAB;
