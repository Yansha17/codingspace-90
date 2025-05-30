import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Plus, Play, Code, Smartphone, Monitor, Menu, ChevronDown, X, Eye, Move, Home, BarChart3, Database } from 'lucide-react';
import { SettingsIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CodeWindow from '@/components/CodeWindow';
import CanvasBackground from '@/components/CanvasBackground';
import NewWindowDialog from '@/components/NewWindowDialog';
import EnhancedFAB from '@/components/EnhancedFAB';
import Library from '@/components/Library';
import Settings from '@/components/Settings';
import BottomEditor from '@/components/BottomEditor';
import { CodeWindowType } from '@/types/CodeWindow';
import { LibraryItem } from '@/types/Library';
import { useLibrary } from '@/hooks/useLibrary';

const LANGUAGES = {
  javascript: { name: 'JavaScript', color: '#F7DF1E', icon: '⚡' },
  python: { name: 'Python', color: '#3776AB', icon: '🐍' },
  html: { name: 'HTML', color: '#E34F26', icon: '🌐' },
  css: { name: 'CSS', color: '#1572B6', icon: '🎨' },
  react: { name: 'React', color: '#61DAFB', icon: '⚛️' },
  vue: { name: 'Vue', color: '#4FC08D', icon: '💚' },
  java: { name: 'Java', color: '#007396', icon: '☕' },
  cpp: { name: 'C++', color: '#00599C', icon: '⚙️' },
  php: { name: 'PHP', color: '#777BB4', icon: '🐘' },
  swift: { name: 'Swift', color: '#FA7343', icon: '🦉' },
  go: { name: 'Go', color: '#00ADD8', icon: '🐹' },
  rust: { name: 'Rust', color: '#000000', icon: '🦀' },
  sql: { name: 'SQL', color: '#336791', icon: '🗃️' }
};

const MenuDropdown = ({ title, items, onItemClick, isOpen, onToggle }) => (
  <div className="relative">
    <button
      onClick={onToggle}
      className="px-3 py-2 text-sm hover:bg-gray-100 rounded flex items-center gap-1 touch-manipulation min-h-[44px]"
    >
      {title}
      <ChevronDown size={12} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
    </button>
    {isOpen && (
      <div className="absolute top-full left-0 bg-white border border-gray-200 rounded-lg shadow-xl py-2 z-50 min-w-[180px] max-h-80 overflow-y-auto">
        {items.map((item, index) => (
          <button
            key={index}
            onClick={() => { onItemClick(item); onToggle(); }}
            className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100 touch-manipulation min-h-[44px] flex items-center"
          >
            {item.icon && <span className="mr-3 text-lg">{item.icon}</span>}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    )}
  </div>
);

const HamburgerMenu = ({ isOpen, onToggle, onItemClick }) => (
  <div className="relative">
    <Button
      onClick={onToggle}
      variant="ghost"
      size="sm"
      className="p-2 hover:bg-gray-100 touch-manipulation min-h-[44px]"
    >
      <Menu className="w-5 h-5" />
    </Button>
    {isOpen && (
      <div className="absolute top-full left-0 bg-white border border-gray-200 rounded-lg shadow-xl py-2 z-50 min-w-[200px]">
        <button
          onClick={() => onItemClick('dashboard')}
          className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100 touch-manipulation min-h-[44px] flex items-center gap-3"
        >
          <BarChart3 className="w-4 h-4" />
          <span>Dashboard</span>
        </button>
        <button
          onClick={() => onItemClick('library')}
          className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100 touch-manipulation min-h-[44px] flex items-center gap-3"
        >
          <Database className="w-4 h-4" />
          <span>Library</span>
        </button>
        <button
          onClick={() => onItemClick('settings')}
          className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100 touch-manipulation min-h-[44px] flex items-center gap-3"
        >
          <SettingsIcon className="w-4 h-4" />
          <span>Settings</span>
        </button>
      </div>
    )}
  </div>
);

const Index = () => {
  const [windows, setWindows] = useState<CodeWindowType[]>([]);
  const [isNewWindowOpen, setIsNewWindowOpen] = useState(false);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [canvasScale, setCanvasScale] = useState(1);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [highestZIndex, setHighestZIndex] = useState(3);
  const [nextId, setNextId] = useState(1);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [hamburgerMenuOpen, setHamburgerMenuOpen] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [editingWindow, setEditingWindow] = useState<CodeWindowType | null>(null);
  
  const { addItem } = useLibrary();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Prevent zoom on iOS
  useEffect(() => {
    if (isMobile) {
      const meta = document.querySelector('meta[name="viewport"]');
      if (meta) {
        meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
      }
    }
  }, [isMobile]);

  const updateWindow = useCallback((id: string, updates: Partial<CodeWindowType>) => {
    setWindows(prev => {
      const updatedWindows = prev.map(window => 
        window.id === id ? { ...window, ...updates } : window
      );
      
      // If we're editing a window and it's being updated, sync the changes
      if (editingWindow && editingWindow.id === id) {
        setEditingWindow(updatedWindows.find(w => w.id === id) || null);
      }
      
      return updatedWindows;
    });
  }, [editingWindow]);

  const bringToFront = useCallback((id: string) => {
    const newZIndex = highestZIndex + 1;
    setHighestZIndex(newZIndex);
    updateWindow(id, { zIndex: newZIndex });
  }, [highestZIndex, updateWindow]);

  const deleteWindow = useCallback((id: string) => {
    // If this is the window being edited, close the editor
    if (editingWindow && editingWindow.id === id) {
      setEditingWindow(null);
    }
    
    setWindows(prev => prev.filter(window => window.id !== id));
  }, [editingWindow]);

  const getDefaultCode = (language: string) => {
    const examples = {
      javascript: 'const greeting = "Hello World!";\nconsole.log(greeting);\n\nconst numbers = [1, 2, 3, 4, 5];\nconst sum = numbers.reduce((a, b) => a + b, 0);\nconsole.log(`Sum: ${sum}`);',
      python: 'print("Hello from Python!")\n\nnumbers = [1, 2, 3, 4, 5]\nsum_result = sum(numbers)\nprint(f"Sum: {sum_result}")',
      html: '<!DOCTYPE html>\n<html>\n<head>\n  <title>Mobile Page</title>\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n</head>\n<body style="font-family: Arial; padding: 20px; text-align: center;">\n  <h1 style="color: #E34F26;">Hello HTML!</h1>\n  <p>Mobile-optimized content</p>\n  <button onclick="alert(\'Hello!\')" style="padding: 10px 20px; font-size: 16px;">Tap Me</button>\n</body>\n</html>',
      css: '.mobile-container {\n  padding: 20px;\n  background: linear-gradient(45deg, #1572B6, #33A9DC);\n  border-radius: 15px;\n  color: white;\n  text-align: center;\n  transition: transform 0.3s ease;\n  touch-action: manipulation;\n}\n\n.mobile-container:active {\n  transform: scale(0.98);\n}\n\n@media (max-width: 768px) {\n  .mobile-container {\n    font-size: 18px;\n    padding: 15px;\n  }\n}',
      react: 'function MobileApp() {\n  const [count, setCount] = useState(0);\n  \n  return (\n    <div style={{\n      padding: "20px",\n      textAlign: "center",\n      fontFamily: "Arial"\n    }}>\n      <h1>Mobile React App</h1>\n      <p style={{ fontSize: "18px" }}>Count: {count}</p>\n      <button \n        onClick={() => setCount(count + 1)}\n        style={{\n          padding: "12px 24px",\n          fontSize: "16px",\n          minHeight: "44px",\n          touchAction: "manipulation"\n        }}\n      >\n        Tap to Increment\n      </button>\n    </div>\n  );\n}',
      vue: 'const app = new Vue({\n  el: "#app",\n  data: {\n    message: "Hello Vue!"\n  }\n});',
      java: 'public class MobileHello {\n    public static void main(String[] args) {\n        System.out.println("Hello from Java on Mobile!");\n        \n        int[] numbers = {1, 2, 3, 4, 5};\n        int sum = 0;\n        for (int num : numbers) {\n            sum += num;\n        }\n        System.out.println("Sum: " + sum);\n    }\n}',
      cpp: '#include <iostream>\n#include <vector>\n\nint main() {\n    std::cout << "Hello from C++ Mobile!" << std::endl;\n    \n    std::vector<int> numbers = {1, 2, 3, 4, 5};\n    int sum = 0;\n    for (int num : numbers) {\n        sum += num;\n    }\n    \n    std::cout << "Sum: " << sum << std::endl;\n    return 0;\n}',
      php: '<?php\necho "Hello from PHP Mobile!\\n";\n\n$numbers = [1, 2, 3, 4, 5];\n$sum = array_sum($numbers);\n\necho "Sum: " . $sum . "\\n";\n?>',
      swift: 'import UIKit\n\nclass MobileViewController: UIViewController {\n    override func viewDidLoad() {\n        super.viewDidLoad()\n        \n        print("Hello from Swift!")\n        \n        let numbers = [1, 2, 3, 4, 5]\n        let sum = numbers.reduce(0, +)\n        print("Sum: \\(sum)")\n    }\n}',
      go: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello from Go Mobile!")\n    \n    numbers := []int{1, 2, 3, 4, 5}\n    sum := 0\n    for _, num := range numbers {\n        sum += num\n    }\n    \n    fmt.Printf("Sum: %d\\n", sum)\n}',
      rust: 'fn main() {\n    println!("Hello from Rust Mobile!");\n    \n    let numbers = vec![1, 2, 3, 4, 5];\n    let sum: i32 = numbers.iter().sum();\n    \n    println!("Sum: {}", sum);\n}',
      sql: 'SELECT "Hello from SQL Mobile!" as greeting;\n\nCREATE TABLE mobile_data (\n    id INTEGER PRIMARY KEY,\n    value INTEGER\n);\n\nINSERT INTO mobile_data VALUES \n(1, 10), (2, 20), (3, 30);\n\nSELECT SUM(value) as total \nFROM mobile_data;'
    };
    return examples[language] || `// ${LANGUAGES[language]?.name || language} code here`;
  };

  const addNewWindow = useCallback((language: string, isWidget: boolean = false) => {
    console.log(`Adding new window for language: ${language}, isWidget: ${isWidget}`);
    const lang = LANGUAGES[language] || { name: language, color: '#666', icon: '📄' };
    
    const newWindow: CodeWindowType = {
      id: nextId.toString(),
      title: lang.name,
      language,
      code: getDefaultCode(language),
      position: { 
        x: Math.random() * (isMobile ? 50 : 200) + 20, 
        y: Math.random() * (isMobile ? 100 : 150) + 80 
      },
      size: { 
        width: isWidget && isMobile ? 180 : (isMobile ? Math.min(350, globalThis.window.innerWidth - 40) : 400), 
        height: isWidget && isMobile ? 160 : (isMobile ? 300 : 350)
      },
      zIndex: highestZIndex + 1
    };

    setWindows(prev => [...prev, newWindow]);
    setNextId(prev => prev + 1);
    setHighestZIndex(prev => prev + 1);
    setIsNewWindowOpen(false);
  }, [highestZIndex, nextId, isMobile]);

  const createFromLibraryItem = useCallback((item: LibraryItem) => {
    const lang = LANGUAGES[item.language] || { name: item.language, color: '#666', icon: '📄' };
    
    const newWindow: CodeWindowType = {
      id: nextId.toString(),
      title: item.title,
      language: item.language,
      code: item.code,
      position: { 
        x: Math.random() * (isMobile ? 50 : 200) + 20, 
        y: Math.random() * (isMobile ? 100 : 150) + 80 
      },
      size: { 
        width: isMobile ? Math.min(350, globalThis.window.innerWidth - 40) : 400, 
        height: isMobile ? 300 : 350
      },
      zIndex: highestZIndex + 1
    };

    setWindows(prev => [...prev, newWindow]);
    setNextId(prev => prev + 1);
    setHighestZIndex(prev => prev + 1);
    setShowLibrary(false);
  }, [highestZIndex, nextId, isMobile]);

  const saveToLibrary = useCallback((windowId: string) => {
    const window = windows.find(w => w.id === windowId);
    if (window) {
      addItem({
        title: window.title,
        language: window.language,
        code: window.code,
        category: 'snippets',
        tags: [window.language],
        description: `Saved from ${window.title} widget`
      });
    }
  }, [windows, addItem]);

  const handleCanvasClick = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (e.target === e.currentTarget) {
      setActiveDropdown(null);
      setHamburgerMenuOpen(false);
    }
  }, []);

  const handleCanvasTouch = useCallback((e: React.TouchEvent) => {
    if (e.target === e.currentTarget && isMobile) {
      setActiveDropdown(null);
      setHamburgerMenuOpen(false);
    }
  }, [isMobile]);

  const toggleDropdown = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const handleHamburgerMenuClick = (item: string) => {
    console.log(`${item} clicked`);
    setHamburgerMenuOpen(false);
    
    if (item === 'library') {
      setShowLibrary(true);
    } else if (item === 'settings') {
      setShowSettings(true);
    } else if (item === 'dashboard') {
      // Return to dashboard - close all modals
      setShowLibrary(false);
      setShowSettings(false);
      setEditingWindow(null);
    }
  };

  const handleEditWindow = (id: string) => {
    const windowToEdit = windows.find(w => w.id === id);
    if (windowToEdit) {
      setEditingWindow(windowToEdit);
    }
  };

  const handleBottomEditorCodeChange = (code: string) => {
    if (editingWindow) {
      updateWindow(editingWindow.id, { code });
    }
  };

  const fileMenuItems = [
    { label: 'New Project', icon: '📁', action: () => setWindows([]) },
    { label: 'Clear Canvas', icon: '🗑️', action: () => setWindows([]) }
  ];

  const languageMenuItems = Object.entries(LANGUAGES).map(([key, lang]) => ({
    label: lang.name,
    icon: lang.icon,
    action: () => addNewWindow(key)
  }));

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-50 relative">
      {/* Mobile-Optimized Header */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200">
        {isMobile ? (
          // Mobile Menu
          <div className="px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HamburgerMenu
                  isOpen={hamburgerMenuOpen}
                  onToggle={() => setHamburgerMenuOpen(!hamburgerMenuOpen)}
                  onItemClick={handleHamburgerMenuClick}
                />
                <Code className="w-6 h-6 text-blue-600" />
                <h1 className="text-lg font-bold text-gray-900">Code Studio</h1>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">
                  {windows.length} window{windows.length !== 1 ? 's' : ''}
                </span>
                <MenuDropdown
                  title="+"
                  items={languageMenuItems}
                  onItemClick={(item) => item.action()}
                  isOpen={activeDropdown === 'new'}
                  onToggle={() => toggleDropdown('new')}
                />
                <MenuDropdown
                  title="⚙️"
                  items={fileMenuItems}
                  onItemClick={(item) => item.action()}
                  isOpen={activeDropdown === 'settings'}
                  onToggle={() => toggleDropdown('settings')}
                />
              </div>
            </div>
          </div>
        ) : (
          // Desktop Menu
          <div className="px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <HamburgerMenu
                    isOpen={hamburgerMenuOpen}
                    onToggle={() => setHamburgerMenuOpen(!hamburgerMenuOpen)}
                    onItemClick={handleHamburgerMenuClick}
                  />
                  <Code className="w-6 h-6 text-blue-600" />
                  <h1 className="text-xl font-bold text-gray-900">Interactive Coding Playground</h1>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Monitor className="w-4 h-4" />
                  <span>Desktop View</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => setIsNewWindowOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
                >
                  <Plus className="w-4 h-4" />
                  New Window
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Canvas */}
      <div 
        ref={canvasRef}
        className={`absolute inset-0 ${isMobile ? 'pt-16' : 'pt-20'} ${editingWindow ? 'pb-[40vh]' : ''}`}
        style={{
          transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px) scale(${canvasScale})`,
          transformOrigin: '0 0',
          touchAction: 'pan-x pan-y'
        }}
        onClick={handleCanvasClick}
        onTouchStart={handleCanvasTouch}
      >
        <CanvasBackground />
        
        {/* Code Windows */}
        {windows.map((window) => (
          <CodeWindow
            key={window.id}
            window={window}
            onUpdate={updateWindow}
            onBringToFront={bringToFront}
            onDelete={deleteWindow}
            onEdit={handleEditWindow}
          />
        ))}
      </div>

      {/* Mobile Welcome State */}
      {windows.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-gray-500 max-w-md p-8">
            <div className="text-6xl mb-6">📱</div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              {isMobile ? 'Mobile Code Studio' : 'Interactive Coding Playground'}
            </h2>
            <p className="text-lg mb-8">
              {isMobile 
                ? 'Tap the + button to create your first code widget' 
                : 'Create windows to start coding in any language'
              }
            </p>
            <div className="text-sm text-gray-400">
              {isMobile 
                ? 'Create widgets • Drag to move • Tap Edit to code'
                : 'Click "New Window" in the menu bar to get started'
              }
            </div>
          </div>
        </div>
      )}

      {/* Mobile indicator */}
      {isMobile && !editingWindow && (
        <div className="absolute bottom-20 left-4 right-4 bg-blue-600 text-white p-3 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4" />
            <span className="text-sm font-medium">Touch-optimized coding widgets</span>
          </div>
        </div>
      )}

      {/* Enhanced FAB replaces MobileFloatingMenu */}
      {isMobile && !editingWindow && (
        <EnhancedFAB onCreateWindow={(lang) => addNewWindow(lang, true)} />
      )}

      {/* Bottom Editor Panel */}
      {editingWindow && (
        <BottomEditor
          isOpen={!!editingWindow}
          onClose={() => setEditingWindow(null)}
          title={editingWindow.title}
          language={editingWindow.language}
          code={editingWindow.code}
          onChange={handleBottomEditorCodeChange}
          onRun={() => {
            if (['html', 'css', 'javascript'].includes(editingWindow.language)) {
              const windowIndex = windows.findIndex(w => w.id === editingWindow.id);
              if (windowIndex >= 0) {
                const updatedWindow = { ...windows[windowIndex], showPreview: true };
                // Toggle preview for this window
                updateWindow(editingWindow.id, { showPreview: true });
                setEditingWindow(updatedWindow);
              }
            }
          }}
        />
      )}

      {/* Library Modal */}
      {showLibrary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-6xl h-[80vh] overflow-hidden">
            <Library 
              onCreateFromLibrary={createFromLibraryItem}
              onClose={() => setShowLibrary(false)}
            />
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl h-[80vh] overflow-hidden">
            <Settings onClose={() => setShowSettings(false)} />
          </div>
        </div>
      )}

      {/* New Window Dialog (Desktop) */}
      {!isMobile && (
        <NewWindowDialog
          isOpen={isNewWindowOpen}
          onClose={() => setIsNewWindowOpen(false)}
          onCreateWindow={addNewWindow}
        />
      )}
    </div>
  );
};

export default Index;
