
import React, { useState } from 'react';
import { Save, Download, Upload, Palette, Code, Database, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useLibrary } from '@/hooks/useLibrary';

interface SettingsProps {
  onClose?: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onClose }) => {
  const { categories, saveCategories } = useLibrary();
  const [activeTab, setActiveTab] = useState('library');

  const tabs = [
    { id: 'library', label: 'Library', icon: Database },
    { id: 'display', label: 'Display', icon: Palette },
    { id: 'widgets', label: 'Widgets', icon: Code },
    { id: 'performance', label: 'Performance', icon: Zap }
  ];

  const exportData = () => {
    const data = {
      library: localStorage.getItem('coding-playground-library'),
      categories: localStorage.getItem('coding-playground-categories'),
      settings: localStorage.getItem('coding-playground-settings')
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'coding-playground-backup.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.library) localStorage.setItem('coding-playground-library', data.library);
        if (data.categories) localStorage.setItem('coding-playground-categories', data.categories);
        if (data.settings) localStorage.setItem('coding-playground-settings', data.settings);
        
        alert('Data imported successfully! Please refresh the page.');
      } catch (error) {
        alert('Failed to import data. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-sm text-gray-500">Customize your coding playground experience</p>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 border-r border-gray-200 p-4">
          <nav className="space-y-2">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === tab.id 
                      ? 'bg-blue-100 text-blue-700 font-medium' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-auto">
          {activeTab === 'library' && <LibrarySettings />}
          {activeTab === 'display' && <DisplaySettings />}
          {activeTab === 'widgets' && <WidgetSettings />}
          {activeTab === 'performance' && <PerformanceSettings />}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button onClick={exportData} variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Data
          </Button>
          <div>
            <input
              type="file"
              accept=".json"
              onChange={importData}
              className="hidden"
              id="import-file"
            />
            <Label htmlFor="import-file" className="cursor-pointer">
              <Button variant="outline" className="flex items-center gap-2" asChild>
                <span>
                  <Upload className="w-4 h-4" />
                  Import Data
                </span>
              </Button>
            </Label>
          </div>
        </div>
        <Button onClick={onClose}>Close</Button>
      </div>
    </div>
  );
};

const LibrarySettings = () => (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-semibold mb-4">Library Preferences</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">Auto-save to library</Label>
            <p className="text-xs text-gray-500">Automatically save code when creating widgets</p>
          </div>
          <Switch />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">Default category</Label>
            <p className="text-xs text-gray-500">Category for new saved snippets</p>
          </div>
          <select className="px-3 py-1 border border-gray-300 rounded-md text-sm">
            <option>Snippets</option>
            <option>Web Development</option>
            <option>Mobile Apps</option>
          </select>
        </div>
      </div>
    </div>
  </div>
);

const DisplaySettings = () => (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-semibold mb-4">Display Preferences</h3>
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium mb-2 block">Font Size</Label>
          <select className="px-3 py-2 border border-gray-300 rounded-md">
            <option>Small</option>
            <option>Medium</option>
            <option>Large</option>
          </select>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">Dark mode</Label>
            <p className="text-xs text-gray-500">Use dark theme for code editors</p>
          </div>
          <Switch />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">Syntax highlighting</Label>
            <p className="text-xs text-gray-500">Enable syntax highlighting in code previews</p>
          </div>
          <Switch defaultChecked />
        </div>
      </div>
    </div>
  </div>
);

const WidgetSettings = () => (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-semibold mb-4">Widget Behavior</h3>
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium mb-2 block">Default Widget Size</Label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-gray-500">Width</Label>
              <Input type="number" defaultValue="400" className="mt-1" />
            </div>
            <div>
              <Label className="text-xs text-gray-500">Height</Label>
              <Input type="number" defaultValue="300" className="mt-1" />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">Auto-arrange widgets</Label>
            <p className="text-xs text-gray-500">Automatically organize widgets to prevent overlap</p>
          </div>
          <Switch />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">Show code preview by default</Label>
            <p className="text-xs text-gray-500">Display code preview in new widgets</p>
          </div>
          <Switch defaultChecked />
        </div>
      </div>
    </div>
  </div>
);

const PerformanceSettings = () => (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-semibold mb-4">Performance Options</h3>
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium mb-2 block">Maximum Widgets</Label>
          <Input type="number" defaultValue="20" />
          <p className="text-xs text-gray-500 mt-1">Limit the number of widgets that can be open at once</p>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">Auto-cleanup on exit</Label>
            <p className="text-xs text-gray-500">Clear temporary data when closing the app</p>
          </div>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">Hardware acceleration</Label>
            <p className="text-xs text-gray-500">Use GPU acceleration for animations</p>
          </div>
          <Switch defaultChecked />
        </div>
      </div>
    </div>
  </div>
);

export default Settings;
