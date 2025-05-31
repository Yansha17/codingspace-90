
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Save, Monitor, Moon, Sun, Smartphone, Globe, Palette } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface SettingsProps {
  onClose?: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('general');
  const { theme, setTheme } = useTheme();
  
  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between bg-background">
        <h2 className="text-2xl font-bold text-foreground">Settings</h2>
        {onClose && (
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="p-2 hover:bg-accent"
          >
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>
      
      {/* Settings Content */}
      <div className="flex-1 flex overflow-hidden">
        <div className="w-56 border-r border-border p-4 bg-muted/30">
          <nav className="space-y-1">
            <Button 
              variant={activeTab === 'general' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('general')}
              className="w-full justify-start gap-2"
            >
              <Monitor className="w-4 h-4" />
              General
            </Button>
            <Button 
              variant={activeTab === 'appearance' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('appearance')}
              className="w-full justify-start gap-2"
            >
              <Palette className="w-4 h-4" />
              Appearance
            </Button>
            <Button 
              variant={activeTab === 'editor' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('editor')}
              className="w-full justify-start gap-2"
            >
              <Globe className="w-4 h-4" />
              Editor
            </Button>
          </nav>
        </div>
        <div className="flex-1 p-6 overflow-y-auto bg-background">
          <h3 className="text-lg font-medium mb-4 text-foreground">
            {activeTab === 'general' && 'General Settings'}
            {activeTab === 'appearance' && 'Appearance Settings'}
            {activeTab === 'editor' && 'Editor Settings'}
          </h3>
          
          {/* Settings content based on active tab */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-foreground">App Name</label>
                <input
                  type="text"
                  className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  defaultValue="Code Studio"
                />
              </div>
              
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-foreground">Default Language</label>
                <select className="px-3 py-2 border border-border rounded-md bg-background text-foreground">
                  <option>JavaScript</option>
                  <option>HTML</option>
                  <option>CSS</option>
                  <option>Python</option>
                </select>
              </div>
            </div>
          )}
          
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div className="flex flex-col gap-4">
                <label className="text-sm font-medium text-foreground">Theme</label>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => setTheme('light')}
                    variant={theme === 'light' ? 'default' : 'outline'}
                    className="flex flex-col gap-2 h-auto p-4"
                  >
                    <Sun className="w-5 h-5" />
                    <span>Light</span>
                  </Button>
                  <Button 
                    onClick={() => setTheme('dark')}
                    variant={theme === 'dark' ? 'default' : 'outline'}
                    className="flex flex-col gap-2 h-auto p-4"
                  >
                    <Moon className="w-5 h-5" />
                    <span>Dark</span>
                  </Button>
                  <Button 
                    variant="outline"
                    className="flex flex-col gap-2 h-auto p-4"
                  >
                    <Smartphone className="w-5 h-5" />
                    <span>System</span>
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'editor' && (
            <div className="space-y-6">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-foreground">Font Size</label>
                <select className="px-3 py-2 border border-border rounded-md bg-background text-foreground">
                  <option>Small</option>
                  <option>Medium</option>
                  <option>Large</option>
                </select>
              </div>
              
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-foreground">Tab Width</label>
                <select className="px-3 py-2 border border-border rounded-md bg-background text-foreground">
                  <option>2 spaces</option>
                  <option>4 spaces</option>
                  <option>8 spaces</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <div className="p-4 border-t border-border flex justify-end bg-background">
        <Button className="gap-2">
          <Save className="w-4 h-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default Settings;
