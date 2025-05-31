import React, { useState, useCallback, useEffect } from 'react';
import { CodeWindowType } from '@/types/CodeWindow';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileWidget from '@/components/MobileWidget';
import EnhancedFAB from '@/components/EnhancedFAB';
import CanvasBackground from '@/components/CanvasBackground';
import StartupWelcomeMessage from '@/components/StartupWelcomeMessage';
import TopNavigation from '@/components/TopNavigation';
import MobileNavigationDrawer from '@/components/MobileNavigationDrawer';
import Library from '@/components/Library';
import Settings from '@/components/Settings';

const Index = () => {
  const [windows, setWindows] = useState<CodeWindowType[]>([]);
  const [editingWindowId, setEditingWindowId] = useState<string | null>(null);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
  const [showNavigationDrawer, setShowNavigationDrawer] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const isMobile = useIsMobile();

  // Check if user has seen welcome message before
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcomeMessage');
    if (hasSeenWelcome) {
      setShowWelcomeMessage(false);
    }
  }, []);

  // Hide welcome message when first widget is created
  useEffect(() => {
    if (windows.length > 0 && showWelcomeMessage) {
      setShowWelcomeMessage(false);
      localStorage.setItem('hasSeenWelcomeMessage', 'true');
    }
  }, [windows.length, showWelcomeMessage]);

  const handleDismissWelcome = useCallback(() => {
    setShowWelcomeMessage(false);
    localStorage.setItem('hasSeenWelcomeMessage', 'true');
  }, []);

  const addNewWindow = useCallback((language: string) => {
    setWindows(prevWindows => {
      const newWindow: CodeWindowType = {
        id: `window-${Date.now()}`,
        title: language,
        language,
        code: '',
        position: { x: 50, y: 100 },
        size: { width: 320, height: 240 },
        zIndex: prevWindows.length + 1
      };
      return [...prevWindows, newWindow];
    });
  }, []);

  const updateWindow = useCallback((id: string, updates: Partial<CodeWindowType>) => {
    setWindows(prevWindows =>
      prevWindows.map(window =>
        window.id === id ? { ...window, ...updates } : window
      )
    );
  }, []);

  const deleteWindow = useCallback((id: string) => {
    setWindows(prevWindows => prevWindows.filter(window => window.id !== id));
  }, []);

  const duplicateWindow = useCallback((id: string) => {
    setWindows(prevWindows => {
      const windowToDuplicate = prevWindows.find(window => window.id === id);
      if (!windowToDuplicate) return prevWindows;

      const newWindow: CodeWindowType = {
        ...windowToDuplicate,
        id: `window-${Date.now()}`,
        position: { 
          x: windowToDuplicate.position.x + 20, 
          y: windowToDuplicate.position.y + 20 
        },
        zIndex: Math.max(...prevWindows.map(w => w.zIndex), 0) + 1
      };
      return [...prevWindows, newWindow];
    });
  }, []);

  const clearAllWidgets = useCallback(() => {
    setWindows([]);
  }, []);

  const bringToFront = useCallback((id: string) => {
    setWindows(prevWindows => {
      const windowToUpdate = prevWindows.find(window => window.id === id);
      if (!windowToUpdate) return prevWindows;

      const maxZIndex = Math.max(...prevWindows.map(window => window.zIndex), 0);
      if (windowToUpdate.zIndex === maxZIndex) return prevWindows;

      const updatedWindows = prevWindows.map(window => {
        if (window.id === id) {
          return { ...window, zIndex: maxZIndex + 1 };
        }
        return window;
      });
      return updatedWindows;
    });
  }, []);

  const handleEditWindow = useCallback((id: string) => {
    setEditingWindowId(id);
  }, []);

  const handleCloseEditor = useCallback(() => {
    setEditingWindowId(null);
  }, []);

  const handleCreateWidget = useCallback(() => {
    addNewWindow('javascript');
  }, [addNewWindow]);

  const handleOpenLibrary = useCallback(() => {
    setShowNavigationDrawer(false);
    setShowLibrary(true);
  }, []);

  const handleOpenSettings = useCallback(() => {
    setShowNavigationDrawer(false);
    setShowSettings(true);
  }, []);

  const handleOpenNavigationDrawer = useCallback(() => {
    setShowNavigationDrawer(true);
  }, []);

  const saveToLibrary = useCallback((id: string) => {
    const widget = windows.find(w => w.id === id);
    if (widget && widget.code.trim()) {
      const savedSnippets = JSON.parse(localStorage.getItem('codeSnippets') || '[]');
      const newSnippet = {
        id: Date.now().toString(),
        title: `${widget.language} snippet`,
        language: widget.language,
        code: widget.code,
        createdAt: new Date().toISOString()
      };
      savedSnippets.push(newSnippet);
      localStorage.setItem('codeSnippets', JSON.stringify(savedSnippets));
      
      // Show feedback (you could add a toast here)
      console.log('Saved to library:', newSnippet.title);
    }
  }, [windows]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 overflow-hidden relative">
      <CanvasBackground />
      
      {/* Top Navigation */}
      <TopNavigation 
        onCreateWidget={handleCreateWidget}
        onOpenLibrary={handleOpenNavigationDrawer}
        onOpenSettings={handleOpenSettings}
      />
      
      {/* Mobile Navigation Drawer */}
      <MobileNavigationDrawer
        isOpen={showNavigationDrawer}
        onClose={() => setShowNavigationDrawer(false)}
        onOpenLibrary={handleOpenLibrary}
        onOpenSettings={handleOpenSettings}
        widgetCount={windows.length}
        onCreateWidget={handleCreateWidget}
        onClearAllWidgets={clearAllWidgets}
      />

      {/* Library Component */}
      {showLibrary && (
        <Library
          onClose={() => setShowLibrary(false)}
          onCreateFromSnippet={addNewWindow}
        />
      )}

      {/* Settings Component */}
      {showSettings && (
        <Settings
          onClose={() => setShowSettings(false)}
        />
      )}
      
      {/* Show welcome message on startup */}
      {showWelcomeMessage && (
        <StartupWelcomeMessage onDismiss={handleDismissWelcome} />
      )}

      {/* Main content area with top padding for navigation */}
      <div className="pt-16">
        {windows.map(window => (
          <MobileWidget
            key={window.id}
            title={window.language}
            langIcon=""
            langName={window.language}
            code={window.code}
            position={window.position}
            size={window.size}
            zIndex={window.zIndex}
            languageColor=""
            isDragging={false}
            onEdit={() => handleEditWindow(window.id)}
            onDelete={() => deleteWindow(window.id)}
            onDuplicate={() => duplicateWindow(window.id)}
            onSaveToLibrary={() => saveToLibrary(window.id)}
            onMouseDown={e => {
              e.stopPropagation();
              bringToFront(window.id);
            }}
            onTouchStart={e => {
              e.stopPropagation();
              bringToFront(window.id);
            }}
            onResize={newSize => updateWindow(window.id, { size: newSize })}
          />
        ))}
      </div>

      <EnhancedFAB onCreateWindow={addNewWindow} />
    </div>
  );
};

export default Index;
