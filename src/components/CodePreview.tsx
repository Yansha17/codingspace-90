
import React, { useEffect, useRef } from 'react';

interface CodePreviewProps {
  language: string;
  code: string;
}

const CodePreview: React.FC<CodePreviewProps> = ({ language, code }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!iframeRef.current) return;

    const iframe = iframeRef.current;
    const doc = iframe.contentDocument;
    
    if (!doc) return;

    if (language === 'html') {
      doc.open();
      doc.write(code);
      doc.close();
    } else if (language === 'css') {
      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <style>${code}</style>
        </head>
        <body>
          <h1>CSS Preview</h1>
          <p>This paragraph is styled with your CSS.</p>
          <button>Sample Button</button>
          <div style="width: 100px; height: 100px; background: #f0f0f0; margin: 10px 0;">Sample Box</div>
        </body>
        </html>
      `);
      doc.close();
    } else if (language === 'javascript') {
      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .console { background: #f5f5f5; padding: 10px; border-radius: 4px; margin-top: 10px; font-family: monospace; }
          </style>
        </head>
        <body>
          <h3>JavaScript Output</h3>
          <div id="output" class="console"></div>
          <script>
            const originalLog = console.log;
            const outputDiv = document.getElementById('output');
            
            console.log = function(...args) {
              originalLog.apply(console, args);
              outputDiv.innerHTML += args.join(' ') + '<br>';
            };
            
            try {
              ${code}
            } catch (error) {
              outputDiv.innerHTML += '<span style="color: red;">Error: ' + error.message + '</span><br>';
            }
          </script>
        </body>
        </html>
      `);
      doc.close();
    }
  }, [language, code]);

  return (
    <div className="h-full bg-white">
      <div className="h-6 bg-gray-100 border-b border-gray-200 flex items-center px-3">
        <span className="text-xs text-gray-600 font-medium">Live Preview</span>
      </div>
      <iframe
        ref={iframeRef}
        className="w-full h-full border-0"
        sandbox="allow-scripts"
        title="Code Preview"
      />
    </div>
  );
};

export default CodePreview;
