
import React, { useState } from 'react';
import { X, Code, Eye, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CodeEditor from './CodeEditor';
import CodePreview from './CodePreview';

interface BottomEditorProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  language: string;
  code: string;
  onChange: (code: string) => void;
  onRun?: () => void;
}

const BottomEditor: React.FC<BottomEditorProps> = ({
  isOpen,
  onClose,
  title,
  language,
  code,
  onChange,
  onRun
}) => {
  const [view, setView] = useState<'code' | 'preview'>('code');
  const canPreview = ['html', 'css', 'javascript'].includes(language);
  
  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40" 
         style={{ height: '40vh' }}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 p-2">
        <div className="flex items-center gap-2">
          <h3 className="font-medium">
            Editing: <span className="text-blue-600">{title}</span>
          </h3>
          <div className="bg-gray-100 px-2 py-1 rounded text-xs">{language}</div>
        </div>
        
        <div className="flex items-center gap-2">
          {canPreview && (
            <>
              <Button
                size="sm"
                variant={view === 'code' ? 'default' : 'outline'}
                onClick={() => setView('code')}
                className="gap-1"
              >
                <Code className="w-4 h-4" />
                Code
              </Button>
              <Button
                size="sm"
                variant={view === 'preview' ? 'default' : 'outline'}
                onClick={() => setView('preview')}
                className="gap-1"
              >
                <Eye className="w-4 h-4" />
                Preview
              </Button>
            </>
          )}
          
          {onRun && (
            <Button
              size="sm"
              onClick={onRun}
              className="bg-green-600 hover:bg-green-700 gap-1"
            >
              <Play className="w-4 h-4" />
              Run
            </Button>
          )}
          
          <Button size="sm" variant="ghost" onClick={onClose} className="p-1">
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>
      
      {/* Editor/Preview Content */}
      <div className="h-full">
        {view === 'code' ? (
          <div className="h-full">
            <CodeEditor
              language={language}
              code={code}
              onChange={onChange}
            />
          </div>
        ) : (
          <div className="h-full">
            <CodePreview
              language={language}
              code={code}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BottomEditor;
