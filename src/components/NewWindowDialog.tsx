
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Code, Globe, Palette, FileCode, Coffee, Zap } from 'lucide-react';

interface NewWindowDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateWindow: (language: string) => void;
}

const NewWindowDialog: React.FC<NewWindowDialogProps> = ({
  isOpen,
  onClose,
  onCreateWindow
}) => {
  const languages = [
    {
      id: 'javascript',
      name: 'JavaScript',
      description: 'Dynamic web programming',
      icon: Code,
      color: 'bg-orange-100 border-orange-300 hover:bg-orange-200',
      iconColor: 'text-orange-600'
    },
    {
      id: 'html',
      name: 'HTML',
      description: 'Web page structure',
      icon: Globe,
      color: 'bg-blue-100 border-blue-300 hover:bg-blue-200',
      iconColor: 'text-blue-600'
    },
    {
      id: 'css',
      name: 'CSS',
      description: 'Styling and design',
      icon: Palette,
      color: 'bg-purple-100 border-purple-300 hover:bg-purple-200',
      iconColor: 'text-purple-600'
    },
    {
      id: 'python',
      name: 'Python',
      description: 'Versatile programming',
      icon: FileCode,
      color: 'bg-green-100 border-green-300 hover:bg-green-200',
      iconColor: 'text-green-600'
    },
    {
      id: 'java',
      name: 'Java',
      description: 'Enterprise development',
      icon: Coffee,
      color: 'bg-red-100 border-red-300 hover:bg-red-200',
      iconColor: 'text-red-600'
    },
    {
      id: 'cpp',
      name: 'C++',
      description: 'Systems programming',
      icon: Zap,
      color: 'bg-indigo-100 border-indigo-300 hover:bg-indigo-200',
      iconColor: 'text-indigo-600'
    }
  ];

  const handleLanguageSelect = (languageId: string) => {
    onCreateWindow(languageId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Create New Code Window</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {languages.map((lang) => {
            const IconComponent = lang.icon;
            return (
              <Button
                key={lang.id}
                variant="outline"
                className={`h-24 flex flex-col items-center justify-center gap-2 ${lang.color} transition-all duration-200`}
                onClick={() => handleLanguageSelect(lang.id)}
              >
                <IconComponent className={`w-6 h-6 ${lang.iconColor}`} />
                <div className="text-center">
                  <div className="font-medium text-gray-900">{lang.name}</div>
                  <div className="text-xs text-gray-600">{lang.description}</div>
                </div>
              </Button>
            );
          })}
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Select a programming language to create a new floating code window
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewWindowDialog;
