import React, { useState, useCallback, useEffect } from 'react';
import { CodeWindowType } from '@/types/CodeWindow';
import { useIsMobile } from '@/hooks/use-mobile';
import { getLanguageConfig } from '@/config/languages';
import MobileWidget from '@/components/MobileWidget';
import EnhancedFAB from '@/components/EnhancedFAB';
import CanvasBackground from '@/components/CanvasBackground';
import StartupWelcomeMessage from '@/components/StartupWelcomeMessage';
import TopNavigation from '@/components/TopNavigation';
import MobileNavigationDrawer from '@/components/MobileNavigationDrawer';
import Library from '@/components/Library';
import Settings from '@/components/Settings';
import FloatingCodeEditor from '@/components/FloatingCodeEditor';
import { ThemeProvider } from '@/contexts/ThemeContext';

type ViewState = 'dashboard' | 'library' | 'settings';

const IndexContent = () => {
  const [windows, setWindows] = useState<CodeWindowType[]>([]);
  const [editingWindowId, setEditingWindowId] = useState<string | null>(null);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
  const [showNavigationDrawer, setShowNavigationDrawer] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
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
    // Close editor if deleting the currently edited window
    if (editingWindowId === id) {
      setEditingWindowId(null);
    }
  }, [editingWindowId]);

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
    setEditingWindowId(null);
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

  const handleCodeChange = useCallback((newCode: string) => {
    if (editingWindowId) {
      updateWindow(editingWindowId, { code: newCode });
    }
  }, [editingWindowId, updateWindow]);

  const handleCreateWidget = useCallback(() => {
    addNewWindow('javascript');
  }, [addNewWindow]);

  const handleNavigateToDashboard = useCallback(() => {
    setCurrentView('dashboard');
    setShowNavigationDrawer(false);
  }, []);

  const handleOpenLibrary = useCallback(() => {
    setCurrentView('library');
    setShowNavigationDrawer(false);
  }, []);

  const handleOpenSettings = useCallback(() => {
    setCurrentView('settings');
    setShowNavigationDrawer(false);
  }, []);

  const handleOpenNavigationDrawer = useCallback(() => {
    setShowNavigationDrawer(true);
  }, []);

  const handleClosePanels = useCallback(() => {
    setCurrentView('dashboard');
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
      
      console.log('Saved to library:', newSnippet.title);
    }
  }, [windows]);

  const handleCreateFromLibraryItem = useCallback((item: any) => {
    const newWindow: CodeWindowType = {
      id: `window-${Date.now()}`,
      title: item.title,
      language: item.language,
      code: item.code,
      position: { x: 50, y: 100 },
      size: { width: 320, height: 240 },
      zIndex: windows.length + 1
    };
    setWindows(prevWindows => [...prevWindows, newWindow]);
    setCurrentView('dashboard');
  }, [windows.length]);

  // Enhanced position change handler
  const handleWidgetPositionChange = useCallback((windowId: string) => (position: { x: number; y: number }) => {
    updateWindow(windowId, { position });
  }, [updateWindow]);

  // Enhanced bring to front handler
  const handleWidgetBringToFront = useCallback((windowId: string) => () => {
    bringToFront(windowId);
  }, [bringToFront]);

  // Get currently editing window
  const editingWindow = editingWindowId ? windows.find(w => w.id === editingWindowId) : null;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 overflow-hidden relative transition-colors duration-200">
      <CanvasBackground />
      
      {/* Top Navigation */}
      <TopNavigation 
        onCreateWidget={handleCreateWidget}
        onOpenLibrary={handleOpenNavigationDrawer}
        onOpenSettings={handleOpenSettings}
        widgetCount={windows.length}
      />
      
      {/* Mobile Navigation Drawer */}
      <MobileNavigationDrawer
        isOpen={showNavigationDrawer}
        onClose={() => setShowNavigationDrawer(false)}
        onNavigateToDashboard={handleNavigateToDashboard}
        onOpenLibrary={handleOpenLibrary}
        onOpenSettings={handleOpenSettings}
        widgetCount={windows.length}
        onCreateWidget={handleCreateWidget}
        onClearAllWidgets={clearAllWidgets}
      />

      {/* Conditional Content Based on Current View */}
      {currentView === 'dashboard' && (
        <>
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
                onMouseDown={() => {}}
                onTouchStart={() => {}}
                onResize={newSize => updateWindow(window.id, { size: newSize })}
                onPositionChange={handleWidgetPositionChange(window.id)}
                onBringToFront={handleWidgetBringToFront(window.id)}
              />
            ))}
          </div>

          <EnhancedFAB onCreateWindow={addNewWindow} />
        </>
      )}

      {/* Library View */}
      {currentView === 'library' && (
        <div className="fixed inset-0 z-40 bg-background pt-16">
          <Library
            onClose={handleClosePanels}
            onCreateFromLibrary={handleCreateFromLibraryItem}
          />
        </div>
      )}

      {/* Settings View */}
      {currentView === 'settings' && (
        <div className="fixed inset-0 z-40 bg-background pt-16">
          <Settings
            onClose={handleClosePanels}
          />
        </div>
      )}

      {/* Floating Code Editor */}
      {editingWindow && (
        <FloatingCodeEditor
          isOpen={!!editingWindowId}
          onClose={handleCloseEditor}
          title={editingWindow.title}
          language={editingWindow.language}
          code={editingWindow.code}
          onChange={handleCodeChange}
        />
      )}
    </div>
  );
};

const Index = () => {
  return (
    <ThemeProvider>
      <IndexContent />
    </ThemeProvider>
  );
};

export default Index;
