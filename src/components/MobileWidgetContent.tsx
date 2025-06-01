
import React, { memo, useState, useEffect } from 'react';
import CodePreviewMini from './CodePreviewMini';
import { getLanguageConfig } from '@/config/languages';

interface MobileWidgetContentProps {
  title: string;
  langName: string;
  code: string;
  size: { width: number; height: number };
  showPreview: boolean;
  previewKey: number;
}

const MobileWidgetContent: React.FC<MobileWidgetContentProps> = memo(({
  title,
  langName,
  code,
  size,
  showPreview,
  previewKey
}) => {
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const langConfig = getLanguageConfig(title);
  const IconComponent = langConfig.icon;
  const lineCount = code.split('\n').length;
  const isLargeWidget = size.width > 200 && size.height > 180;
  const hasCode = code.trim().length > 0;

  // Handle preview loading state
  useEffect(() => {
    if (showPreview && hasCode) {
      setIsPreviewLoading(true);
      const timer = setTimeout(() => {
        setIsPreviewLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [showPreview, previewKey, code]);

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex-1 p-4 overflow-hidden">
        {showPreview && hasCode ? (
          <div className="h-full bg-slate-800 rounded-lg overflow-hidden relative">
            {isPreviewLoading && (
              <div className="absolute inset-0 bg-slate-800/80 backdrop-blur-sm flex items-center justify-center z-10">
                <div className="flex items-center gap-2 text-white text-xs">
                  <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Loading preview...</span>
                </div>
              </div>
            )}
            <CodePreviewMini 
              key={previewKey}
              code={code} 
              language={title.toLowerCase()} 
              maxLines={Math.floor((size.height - 120) / 16)}
            />
          </div>
        ) : showPreview && !hasCode ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-slate-400 text-center">
              <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center mb-3">
                <IconComponent className="w-6 h-6" />
              </div>
              <span className="text-sm">No code to preview</span>
              <p className="text-xs mt-1 opacity-70">Add some {title} code to see the preview</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <div className={`w-16 h-16 rounded-2xl ${langConfig.bgColor} flex items-center justify-center text-white text-2xl mb-3 shadow-xl`}>
              <IconComponent className="w-8 h-8" />
            </div>
            <span className="text-lg font-bold text-white text-center mb-2 pointer-events-none">
              {title}
            </span>
            <span className="text-sm text-slate-400 text-center mb-2 pointer-events-none">
              {langName}
            </span>
            <div className="bg-slate-700 px-3 py-1 rounded-full">
              <span className="text-xs text-slate-300 pointer-events-none">
                {hasCode ? `${lineCount} lines` : 'No code'}
              </span>
            </div>
            {hasCode && !showPreview && (
              <div className="mt-2 text-xs text-slate-500 text-center opacity-70">
                Click the eye icon to preview
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

MobileWidgetContent.displayName = 'MobileWidgetContent';

export default MobileWidgetContent;
