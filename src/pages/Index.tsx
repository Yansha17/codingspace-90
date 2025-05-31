import React, { useState, useCallback, useEffect } from 'react';
import { CodeWindowType } from '@/types/CodeWindow';
import { initialWindows } from '@/config/initial-windows';
import { useMobile } from '@/hooks/useMobile';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import CodeEditorDrawer from '@/components/CodeEditorDrawer';
import MobileWidget from '@/components/MobileWidget';
import EnhancedFAB from '@/components/EnhancedFAB';
import CanvasBackground from '@/components/CanvasBackground';
import StartupWelcomeMessage from '@/components/StartupWelcomeMessage';

interface IndexProps {}

const Index = () => {
  const [windows, setWindows] = useState<CodeWindowType[]>([]);
  const [editingWindowId, setEditingWindowId] = useState<string | null>(null);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
  const isMobile = useMobile();

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
        language,
        code: '',
        position: { x: 50, y: 50 },
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 overflow-hidden relative">
      <CanvasBackground />
      
      {/* Show welcome message on startup */}
      {showWelcomeMessage && !isMobile && (
        <StartupWelcomeMessage onDismiss={handleDismissWelcome} />
      )}
      
      {/* Mobile optimized message */}
      {showWelcomeMessage && isMobile && (
        <StartupWelcomeMessage onDismiss={handleDismissWelcome} />
      )}

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

      <EnhancedFAB onCreateWindow={addNewWindow} />

      <CodeEditorDrawer
        isOpen={editingWindowId !== null}
        onClose={handleCloseEditor}
        windowId={editingWindowId}
        windows={windows}
        onUpdateWindow={updateWindow}
      />
    </div>
  );
};

export default Index;
