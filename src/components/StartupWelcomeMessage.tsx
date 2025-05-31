
import React, { memo, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Code, Smartphone } from 'lucide-react';

interface StartupWelcomeMessageProps {
  onDismiss: () => void;
}

const StartupWelcomeMessage: React.FC<StartupWelcomeMessageProps> = memo(({ onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animate in after a short delay
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 300);
  };

  return (
    <div 
      className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ pointerEvents: isVisible ? 'auto' : 'none' }}
    >
      <div 
        className={`bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-600 transition-all duration-500 ${
          isVisible ? 'scale-100 translate-y-0' : 'scale-90 translate-y-8'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white">Touch-Optimized Coding</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-700"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="space-y-4 mb-6">
          <p className="text-slate-300 text-sm leading-relaxed">
            Welcome! This interface is optimized for touch devices. You can:
          </p>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-slate-300 text-sm">Drag widgets around the screen</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-slate-300 text-sm">Resize widgets using the handle in the bottom-right</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-slate-300 text-sm">Tap the + button to create new code widgets</p>
            </div>
          </div>
        </div>
        
        <Button
          onClick={handleDismiss}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium"
        >
          <Code className="w-4 h-4 mr-2" />
          Start Coding
        </Button>
      </div>
    </div>
  );
});

StartupWelcomeMessage.displayName = 'StartupWelcomeMessage';

export default StartupWelcomeMessage;
