
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Save, Monitor, Moon, Sun, Smartphone, Globe, Palette } from 'lucide-react';

interface SettingsProps {
  onClose?: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('general');
  
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        {onClose && (
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="p-2 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>
      
      {/* Settings Content */}
      <div className="flex-1 flex overflow-hidden">
        <div className="w-56 border-r border-gray-200 p-4">
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
        <div className="flex-1 p-6 overflow-y-auto">
          <h3 className="text-lg font-medium mb-4">
            {activeTab === 'general' && 'General Settings'}
            {activeTab === 'appearance' && 'Appearance Settings'}
            {activeTab === 'editor' && 'Editor Settings'}
          </h3>
          
          {/* Settings content based on active tab */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">App Name</label>
                <input
                  type="text"
                  className="px-3 py-2 border border-gray-300 rounded-md"
                  defaultValue="Code Studio"
                />
              </div>
              
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Default Language</label>
                <select className="px-3 py-2 border border-gray-300 rounded-md">
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
                <label className="text-sm font-medium">Theme</label>
                <div className="flex gap-2">
                  <Button className="flex flex-col gap-2 h-auto p-4 bg-white border border-gray-300 hover:bg-gray-50 text-gray-900">
                    <Sun className="w-5 h-5" />
                    <span>Light</span>
                  </Button>
                  <Button className="flex flex-col gap-2 h-auto p-4 bg-gray-900 text-white hover:bg-gray-800">
                    <Moon className="w-5 h-5" />
                    <span>Dark</span>
                  </Button>
                  <Button className="flex flex-col gap-2 h-auto p-4 bg-white border border-gray-300 hover:bg-gray-50 text-gray-900">
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
                <label className="text-sm font-medium">Font Size</label>
                <select className="px-3 py-2 border border-gray-300 rounded-md">
                  <option>Small</option>
                  <option>Medium</option>
                  <option>Large</option>
                </select>
              </div>
              
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Tab Width</label>
                <select className="px-3 py-2 border border-gray-300 rounded-md">
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
      <div className="p-4 border-t border-gray-200 flex justify-end">
        <Button className="gap-2">
          <Save className="w-4 h-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default Settings;
