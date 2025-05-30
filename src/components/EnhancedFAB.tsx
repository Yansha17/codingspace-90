
import React, { useState, useEffect, useRef } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EnhancedFABProps {
  onCreateWindow: (language: string) => void;
}

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('EnhancedFAB mounted, onCreateWindow:', typeof onCreateWindow, onCreateWindow);
    setIsVisible(true);
  }, [onCreateWindow]);

  const handleLanguageSelect = (languageKey: string) => {
    console.log(`FAB: Creating window for language: ${languageKey}`);
    
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

      {/* Vertical Language List */}
      <div style={{
        position: 'absolute',
        bottom: '80px',
        right: '8px',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: isExpanded ? 1 : 0,
        transform: isExpanded ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)',
        pointerEvents: isExpanded ? 'auto' : 'none',
        maxHeight: '60vh',
        overflowY: 'auto',
        width: '200px'
      }}>
        <div 
          ref={scrollContainerRef}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            alignItems: 'stretch',
            paddingBottom: '8px'
          }}
        >
          {Object.entries(LANGUAGES).reverse().map(([key, lang], index) => (
            <div
              key={key}
              style={{
                transform: `translateY(${isExpanded ? '0' : '20px'})`,
                opacity: isExpanded ? 1 : 0,
                transition: `all 0.4s cubic-bezier(0.4, 0, 0.2, 1)`,
                transitionDelay: isExpanded ? `${index * 40}ms` : '0ms'
              }}
            >
              <Button
                onClick={() => {
                  console.log(`FAB: Language pill clicked: ${key}`);
                  handleLanguageSelect(key);
                }}
                className="w-full h-12 px-4 rounded-xl shadow-lg border-2 border-white/20 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:shadow-xl hover:border-white/40 text-left justify-start"
                style={{
                  backgroundColor: lang.color,
                  color: lang.textColor,
                  fontWeight: '500'
                }}
              >
                <span className="mr-3 text-lg">{lang.icon}</span>
                <span>{lang.name}</span>
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
