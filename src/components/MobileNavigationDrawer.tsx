
import React, { useState } from 'react';
import { X, Home, BookOpen, Settings, FileText, Download, Upload, HelpCircle, Palette, Code, Monitor, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Separator } from '@/components/ui/separator';

interface MobileNavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLibrary: () => void;
  onOpenSettings: () => void;
  widgetCount: number;
  onCreateWidget: () => void;
  onClearAllWidgets?: () => void;
}

const MobileNavigationDrawer: React.FC<MobileNavigationDrawerProps> = ({
  isOpen,
  onClose,
  onOpenLibrary,
  onOpenSettings,
  widgetCount,
  onCreateWidget,
  onClearAllWidgets
}) => {
  const menuSections = [
    {
      title: 'Dashboard',
      icon: Home,
      items: [
        { label: `${widgetCount} Widgets Active`, action: () => {}, icon: Monitor },
        { label: 'New Widget', action: () => { onCreateWidget(); onClose(); }, icon: Code },
        { label: 'Clear All', action: () => { onClearAllWidgets?.(); onClose(); }, icon: X, destructive: true }
      ]
    },
    {
      title: 'Library',
      icon: BookOpen,
      items: [
        { label: 'Code Snippets', action: () => { onOpenLibrary(); onClose(); }, icon: FileText },
        { label: 'Import Project', action: () => {}, icon: Upload },
        { label: 'Export Project', action: () => {}, icon: Download }
      ]
    },
    {
      title: 'Settings',
      icon: Settings,
      items: [
        { label: 'App Settings', action: () => { onOpenSettings(); onClose(); }, icon: Settings },
        { label: 'Theme', action: () => {}, icon: Palette },
        { label: 'Device View', action: () => {}, icon: Smartphone }
      ]
    },
    {
      title: 'Help',
      icon: HelpCircle,
      items: [
        { label: 'Tutorials', action: () => {}, icon: HelpCircle },
        { label: 'Keyboard Shortcuts', action: () => {}, icon: Code }
      ]
    }
  ];

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="h-[85vh] max-h-[85vh]">
        <DrawerHeader className="flex flex-row items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">{"</>"}</span>
            </div>
            <DrawerTitle className="text-xl font-bold">Code Studio</DrawerTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {menuSections.map((section, sectionIndex) => (
            <div key={section.title}>
              <div className="flex items-center gap-2 mb-3">
                <section.icon className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-lg text-gray-900">{section.title}</h3>
              </div>
              
              <div className="space-y-2">
                {section.items.map((item, itemIndex) => (
                  <Button
                    key={itemIndex}
                    variant="ghost"
                    className={`w-full justify-start gap-3 h-12 text-left ${
                      item.destructive ? 'text-red-600 hover:text-red-700 hover:bg-red-50' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={item.action}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Button>
                ))}
              </div>
              
              {sectionIndex < menuSections.length - 1 && <Separator className="mt-4" />}
            </div>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileNavigationDrawer;
