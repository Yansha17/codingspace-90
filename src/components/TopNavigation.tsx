
import React from 'react';
import { Menu, Settings, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';

interface TopNavigationProps {
  onCreateWidget: () => void;
  onOpenLibrary?: () => void;
  onOpenSettings?: () => void;
}

const TopNavigation: React.FC<TopNavigationProps> = ({
  onCreateWidget,
  onOpenLibrary,
  onOpenSettings
}) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-slate-800/95 backdrop-blur-sm border-b border-slate-700 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left side - Logo and branding */}
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="ghost"
            onClick={onOpenLibrary}
            className="text-slate-300 hover:text-white hover:bg-slate-700"
          >
            <Menu className="w-4 h-4" />
          </Button>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">{"</>"}</span>
            </div>
            <div className="text-white">
              <h1 className="text-lg font-bold">Code</h1>
              <p className="text-xs text-slate-400 -mt-1">Studio</p>
            </div>
          </div>
          
          <div className="hidden sm:block text-slate-400 text-sm">
            Mobile Playground
          </div>
        </div>

        {/* Center - Widget counter - this will be dynamic based on actual widget count */}
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            Active Widgets
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          <Button
            size="sm"
            variant="ghost"
            onClick={onCreateWidget}
            className="text-slate-300 hover:text-white hover:bg-slate-700"
          >
            <Plus className="w-4 h-4" />
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={onOpenSettings}
            className="text-slate-300 hover:text-white hover:bg-slate-700"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TopNavigation;
