
import React, { useState, useRef, useCallback } from 'react';
import { Plus, Play, Code, Smartphone, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CodeWindow from '@/components/CodeWindow';
import CanvasBackground from '@/components/CanvasBackground';
import NewWindowDialog from '@/components/NewWindowDialog';
import { CodeWindowType } from '@/types/CodeWindow';

const Index = () => {
  const [windows, setWindows] = useState<CodeWindowType[]>([
    {
      id: '1',
      title: 'JavaScript',
      language: 'javascript',
      code: 'const message = "Hello, World!";\nconsole.log(message);\n\n// Try writing some JavaScript!\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n\ngreet("Developer");',
      position: { x: 100, y: 100 },
      size: { width: 400, height: 300 },
      zIndex: 1
    },
    {
      id: '2',
      title: 'HTML',
      language: 'html',
      code: '<!DOCTYPE html>\n<html>\n<head>\n  <title>My Page</title>\n</head>\n<body>\n  <h1>Welcome to the Playground!</h1>\n  <p>This is a live HTML preview.</p>\n  <button onclick="alert(\'Hello!\')">Click me</button>\n</body>\n</html>',
      position: { x: 520, y: 100 },
      size: { width: 400, height: 300 },
      zIndex: 2
    },
    {
      id: '3',
      title: 'Python',
      language: 'python',
      code: '# Python in the browser!\nimport math\n\ndef fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)\n\nprint("Fibonacci sequence:")\nfor i in range(8):\n    print(f"F({i}) = {fibonacci(i)}")',
      position: { x: 300, y: 420 },
      size: { width: 400, height: 300 },
      zIndex: 3
    }
  ]);

  const [isNewWindowOpen, setIsNewWindowOpen] = useState(false);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [canvasScale, setCanvasScale] = useState(1);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [highestZIndex, setHighestZIndex] = useState(3);

  const updateWindow = useCallback((id: string, updates: Partial<CodeWindowType>) => {
    setWindows(prev => prev.map(window => 
      window.id === id ? { ...window, ...updates } : window
    ));
  }, []);

  const bringToFront = useCallback((id: string) => {
    const newZIndex = highestZIndex + 1;
    setHighestZIndex(newZIndex);
    updateWindow(id, { zIndex: newZIndex });
  }, [highestZIndex, updateWindow]);

  const deleteWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(window => window.id !== id));
  }, []);

  const addNewWindow = useCallback((language: string) => {
    const defaultCode = {
      javascript: '// New JavaScript window\nconsole.log("Hello from JavaScript!");',
      html: '<!DOCTYPE html>\n<html>\n<head>\n  <title>New Page</title>\n</head>\n<body>\n  <h1>New HTML Window</h1>\n</body>\n</html>',
      css: '/* New CSS window */\nbody {\n  font-family: Arial, sans-serif;\n  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n}',
      python: '# New Python window\nprint("Hello from Python!")',
      java: '// New Java window\npublic class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello from Java!");\n  }\n}',
      cpp: '// New C++ window\n#include <iostream>\nusing namespace std;\n\nint main() {\n  cout << "Hello from C++!" << endl;\n  return 0;\n}'
    };

    const newWindow: CodeWindowType = {
      id: Date.now().toString(),
      title: language.charAt(0).toUpperCase() + language.slice(1),
      language,
      code: defaultCode[language as keyof typeof defaultCode] || '// New code window',
      position: { 
        x: Math.random() * 300 + 100, 
        y: Math.random() * 200 + 100 
      },
      size: { width: 400, height: 300 },
      zIndex: highestZIndex + 1
    };

    setWindows(prev => [...prev, newWindow]);
    setHighestZIndex(prev => prev + 1);
    setIsNewWindowOpen(false);
  }, [highestZIndex]);

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-50 relative">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Code className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Interactive Coding Playground</h1>
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
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

      {/* Canvas */}
      <div 
        ref={canvasRef}
        className="absolute inset-0 pt-16"
        style={{
          transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px) scale(${canvasScale})`,
          transformOrigin: '0 0'
        }}
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
          />
        ))}
      </div>

      {/* Mobile indicator */}
      <div className="md:hidden absolute bottom-4 left-4 right-4 bg-blue-600 text-white p-3 rounded-lg shadow-lg">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4" />
          <span className="text-sm font-medium">Touch optimized for mobile</span>
        </div>
      </div>

      {/* New Window Dialog */}
      <NewWindowDialog
        isOpen={isNewWindowOpen}
        onClose={() => setIsNewWindowOpen(false)}
        onCreateWindow={addNewWindow}
      />
    </div>
  );
};

export default Index;
