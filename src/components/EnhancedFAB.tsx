
import React, { useState, useEffect } from 'react';
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
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    console.log('EnhancedFAB mounted, onCreateWindow:', typeof onCreateWindow, onCreateWindow);
    setIsVisible(true);
  }, [onCreateWindow]);

  const handleLanguageSelect = (languageKey: string) => {
    console.log(`FAB: Creating window for language: ${languageKey}`);
    console.log('FAB: onCreateWindow function type:', typeof onCreateWindow);
    console.log('FAB: onCreateWindow function:', onCreateWindow);
    
    // Call the parent's function to create the window
    if (onCreateWindow && typeof onCreateWindow === 'function') {
      try {
        onCreateWindow(languageKey);
        console.log('FAB: Successfully called onCreateWindow');
      } catch (error) {
        console.error('FAB: Error calling onCreateWindow:', error);
      }
    } else {
      console.error('FAB: onCreateWindow is not a function:', onCreateWindow);
    }
    setIsExpanded(false);
  };

  const handleToggle = () => {
    console.log('FAB: Toggle clicked, current isExpanded:', isExpanded);
    setIsExpanded(!isExpanded);
  };

  const handleLanguageClick = (key: string) => {
    console.log(`FAB: Language button clicked: ${key}`);
    handleLanguageSelect(key);
  };

  if (!isVisible) {
    console.log('FAB: Not visible, returning null');
    return null;
  }

  console.log('FAB: Rendering, isExpanded:', isExpanded);

  return (
    <div style={{
      position: 'fixed',
      bottom: '0px',
      right: '0px',
      zIndex: 99999,
      pointerEvents: 'auto'
    }}>
      {/* Backdrop */}
      {isExpanded && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(2px)',
            zIndex: -1
          }}
          onClick={() => {
            console.log('FAB: Backdrop clicked');
            setIsExpanded(false);
          }}
        />
      )}

      {/* Language Pills */}
      <div style={{
        position: 'absolute',
        bottom: '80px',
        right: '0px',
        transition: 'all 0.3s ease-out',
        opacity: isExpanded ? 1 : 0,
        transform: isExpanded ? 'translateY(0)' : 'translateY(32px)',
        pointerEvents: isExpanded ? 'auto' : 'none'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          alignItems: 'flex-end'
        }}>
          {Object.entries(LANGUAGES).map(([key, lang], index) => (
            <div
              key={key}
              style={{
                transform: `translateX(${isExpanded ? '0' : '60px'})`,
                transition: `all 0.3s ease-out`,
                transitionDelay: isExpanded ? `${index * 50}ms` : '0ms'
              }}
            >
              <Button
                onClick={() => {
                  console.log(`FAB: Language pill clicked: ${key}`);
                  handleLanguageClick(key);
                }}
                className="h-12 px-4 rounded-full shadow-lg border-2 border-white/20 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:shadow-xl"
                style={{
                  backgroundColor: lang.color,
                  color: lang.textColor,
                  minWidth: '120px'
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
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log('FAB: Main button clicked');
          handleToggle();
        }}
        className="w-16 h-16 rounded-full shadow-2xl transition-all duration-300 ease-out border-4 border-white/20 backdrop-blur-sm"
        style={{
          background: isExpanded 
            ? '#EF4444' 
            : 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #1D4ED8 100%)',
          transform: `rotate(${isExpanded ? '45deg' : '0deg'}) scale(${isExpanded ? '1.1' : '1'})`,
          zIndex: 100000
        }}
      >
        <div style={{
          transition: 'transform 0.3s ease-out',
          transform: `rotate(${isExpanded ? '-45deg' : '0deg'})`
        }}>
          {isExpanded ? (
            <X className="w-7 h-7 text-white" />
          ) : (
            <Plus className="w-7 h-7 text-white" />
          )}
        </div>
      </Button>

      {/* Pulse animation when not expanded */}
      {!isExpanded && (
        <div 
          className="absolute inset-0 rounded-full animate-ping opacity-20"
          style={{
            background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #1D4ED8 100%)',
            pointerEvents: 'none'
          }}
        />
      )}
    </div>
  );
};

export default EnhancedFAB;
