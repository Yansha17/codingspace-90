
import React, { useState, useEffect, useRef } from 'react';
import { Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EnhancedFABProps {
  onCreateWindow: (language: string) => void;
}

const LANGUAGES = {
  html: { name: 'HTML', color: '#E34F26', icon: '🌐', textColor: 'white', category: 'web' },
  css: { name: 'CSS', color: '#1572B6', icon: '🎨', textColor: 'white', category: 'web' },
  javascript: { name: 'JavaScript', color: '#F7DF1E', icon: '⚡', textColor: 'black', category: 'web' },
  react: { name: 'React', color: '#61DAFB', icon: '⚛️', textColor: 'black', category: 'web' },
  vue: { name: 'Vue', color: '#4FC08D', icon: '💚', textColor: 'white', category: 'web' },
  python: { name: 'Python', color: '#3776AB', icon: '🐍', textColor: 'white', category: 'backend' },
  java: { name: 'Java', color: '#007396', icon: '☕', textColor: 'white', category: 'backend' },
  cpp: { name: 'C++', color: '#00599C', icon: '⚙️', textColor: 'white', category: 'system' },
  php: { name: 'PHP', color: '#777BB4', icon: '🐘', textColor: 'white', category: 'backend' },
  swift: { name: 'Swift', color: '#FA7343', icon: '🦉', textColor: 'white', category: 'mobile' },
  go: { name: 'Go', color: '#00ADD8', icon: '🐹', textColor: 'white', category: 'backend' },
  rust: { name: 'Rust', color: '#000000', icon: '🦀', textColor: 'white', category: 'system' },
  sql: { name: 'SQL', color: '#336791', icon: '🗃️', textColor: 'white', category: 'database' }
};

const CATEGORIES = {
  web: { name: 'Web', color: '#3B82F6' },
  backend: { name: 'Backend', color: '#10B981' },
  mobile: { name: 'Mobile', color: '#F59E0B' },
  system: { name: 'System', color: '#EF4444' },
  database: { name: 'Database', color: '#8B5CF6' }
};

const EnhancedFAB: React.FC<EnhancedFABProps> = ({ onCreateWindow }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [currentCategory, setCurrentCategory] = useState<string>('web');
  const [scrollPosition, setScrollPosition] = useState(0);
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
    if (!isExpanded) {
      setScrollPosition(0);
    }
  };

  const scrollToCategory = (direction: 'left' | 'right') => {
    const categories = Object.keys(CATEGORIES);
    const currentIndex = categories.indexOf(currentCategory);
    
    if (direction === 'left' && currentIndex > 0) {
      setCurrentCategory(categories[currentIndex - 1]);
    } else if (direction === 'right' && currentIndex < categories.length - 1) {
      setCurrentCategory(categories[currentIndex + 1]);
    }
  };

  const getCurrentLanguages = () => {
    return Object.entries(LANGUAGES).filter(([_, lang]) => lang.category === currentCategory);
  };

  const canScrollLeft = Object.keys(CATEGORIES).indexOf(currentCategory) > 0;
  const canScrollRight = Object.keys(CATEGORIES).indexOf(currentCategory) < Object.keys(CATEGORIES).length - 1;

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

      {/* Language Carousel */}
      <div style={{
        position: 'absolute',
        bottom: '80px',
        right: '0px',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: isExpanded ? 1 : 0,
        transform: isExpanded ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)',
        pointerEvents: isExpanded ? 'auto' : 'none',
        width: '300px'
      }}>
        {/* Category Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px',
          padding: '0 8px'
        }}>
          <Button
            onClick={() => scrollToCategory('left')}
            disabled={!canScrollLeft}
            className="h-8 w-8 rounded-full shadow-lg backdrop-blur-sm"
            style={{
              backgroundColor: canScrollLeft ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.5)',
              opacity: canScrollLeft ? 1 : 0.5
            }}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <div style={{
            background: CATEGORIES[currentCategory].color,
            color: 'white',
            padding: '6px 16px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '600',
            textAlign: 'center',
            minWidth: '100px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}>
            {CATEGORIES[currentCategory].name}
          </div>

          <Button
            onClick={() => scrollToCategory('right')}
            disabled={!canScrollRight}
            className="h-8 w-8 rounded-full shadow-lg backdrop-blur-sm"
            style={{
              backgroundColor: canScrollRight ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.5)',
              opacity: canScrollRight ? 1 : 0.5
            }}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Language Pills */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          alignItems: 'flex-end'
        }}>
          {getCurrentLanguages().map(([key, lang], index) => (
            <div
              key={key}
              style={{
                transform: `translateX(${isExpanded ? '0' : '60px'})`,
                transition: `all 0.4s cubic-bezier(0.4, 0, 0.2, 1)`,
                transitionDelay: isExpanded ? `${index * 80}ms` : '0ms'
              }}
            >
              <Button
                onClick={() => {
                  console.log(`FAB: Language pill clicked: ${key}`);
                  handleLanguageSelect(key);
                }}
                className="h-12 px-4 rounded-full shadow-lg border-2 border-white/20 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:shadow-xl hover:border-white/40"
                style={{
                  backgroundColor: lang.color,
                  color: lang.textColor,
                  minWidth: '140px',
                  fontWeight: '500'
                }}
              >
                <span className="mr-3 text-lg">{lang.icon}</span>
                <span>{lang.name}</span>
              </Button>
            </div>
          ))}
        </div>

        {/* Category Indicators */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '6px',
          marginTop: '12px'
        }}>
          {Object.keys(CATEGORIES).map((category) => (
            <div
              key={category}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: category === currentCategory ? CATEGORIES[category].color : 'rgba(255, 255, 255, 0.4)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onClick={() => setCurrentCategory(category)}
            />
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
