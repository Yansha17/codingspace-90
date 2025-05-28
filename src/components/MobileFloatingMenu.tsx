
import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface MobileFloatingMenuProps {
  onCreateWindow: (language: string) => void;
}

const LANGUAGES = {
  javascript: { name: 'JavaScript', color: '#F7DF1E', icon: '🟨' },
  python: { name: 'Python', color: '#3776AB', icon: '🐍' },
  html: { name: 'HTML', color: '#E34F26', icon: '🌐' },
  css: { name: 'CSS', color: '#1572B6', icon: '🎨' },
  react: { name: 'React', color: '#61DAFB', icon: '⚛️' },
  java: { name: 'Java', color: '#007396', icon: '☕' },
  cpp: { name: 'C++', color: '#00599C', icon: '⚙️' },
  php: { name: 'PHP', color: '#777BB4', icon: '🐘' },
  swift: { name: 'Swift', color: '#FA7343', icon: '🦉' },
  go: { name: 'Go', color: '#00ADD8', icon: '🐹' },
  rust: { name: 'Rust', color: '#000000', icon: '🦀' },
  sql: { name: 'SQL', color: '#336791', icon: '🗃️' }
};

const MobileFloatingMenu: React.FC<MobileFloatingMenuProps> = ({ onCreateWindow }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageSelect = (languageKey: string) => {
    onCreateWindow(languageKey);
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg z-50 p-0"
          onClick={() => setIsOpen(true)}
        >
          <Plus className="w-6 h-6 text-white" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[60vh] rounded-t-2xl">
        <SheetHeader className="text-center pb-4">
          <SheetTitle className="text-xl">Create New Code Widget</SheetTitle>
        </SheetHeader>
        <div className="grid grid-cols-2 gap-4 overflow-y-auto max-h-[40vh]">
          {Object.entries(LANGUAGES).map(([key, lang]) => (
            <Button
              key={key}
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2 border-2 hover:border-blue-500 transition-all"
              onClick={() => handleLanguageSelect(key)}
            >
              <span className="text-2xl">{lang.icon}</span>
              <span className="text-sm font-medium">{lang.name}</span>
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileFloatingMenu;
