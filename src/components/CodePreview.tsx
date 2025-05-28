
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

    // Clear previous content
    doc.open();
    
    if (language === 'html') {
      doc.write(code || '<!DOCTYPE html><html><body><p>No HTML content to display</p></body></html>');
    } else if (language === 'css') {
      doc.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { 
              font-family: Arial, sans-serif; 
              padding: 20px; 
              margin: 0;
              line-height: 1.6;
            }
            ${code}
          </style>
        </head>
        <body>
          <h1>CSS Preview</h1>
          <p>This paragraph is styled with your CSS.</p>
          <button class="btn">Sample Button</button>
          <div class="sample-box" style="width: 100px; height: 100px; background: #f0f0f0; margin: 10px 0; border: 1px solid #ddd;">Sample Box</div>
          <ul>
            <li>List item 1</li>
            <li>List item 2</li>
            <li>List item 3</li>
          </ul>
        </body>
        </html>
      `);
    } else if (language === 'javascript') {
      doc.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { 
              font-family: Arial, sans-serif; 
              padding: 20px; 
              margin: 0;
              line-height: 1.6;
            }
            .console { 
              background: #f8f9fa; 
              padding: 15px; 
              border-radius: 6px; 
              margin: 15px 0; 
              font-family: 'Courier New', monospace; 
              border: 1px solid #e9ecef;
              min-height: 100px;
              white-space: pre-wrap;
            }
            .error { color: #dc3545; }
            .success { color: #28a745; }
          </style>
        </head>
        <body>
          <h3>JavaScript Output</h3>
          <div id="output" class="console">Ready to run JavaScript...</div>
          <script>
            const originalLog = console.log;
            const originalError = console.error;
            const outputDiv = document.getElementById('output');
            
            // Clear output
            outputDiv.innerHTML = '';
            
            console.log = function(...args) {
              originalLog.apply(console, args);
              outputDiv.innerHTML += '<span class="success">' + args.join(' ') + '</span>\\n';
            };
            
            console.error = function(...args) {
              originalError.apply(console, args);
              outputDiv.innerHTML += '<span class="error">Error: ' + args.join(' ') + '</span>\\n';
            };
            
            try {
              ${code || 'console.log("No JavaScript code to execute");'}
            } catch (error) {
              outputDiv.innerHTML += '<span class="error">Error: ' + error.message + '</span>\\n';
            }
          </script>
        </body>
        </html>
      `);
    }
    
    doc.close();
  }, [language, code]);

  return (
    <div className="h-full bg-white flex flex-col">
      <div className="h-8 bg-gray-100 border-b border-gray-200 flex items-center px-3 flex-shrink-0">
        <span className="text-xs text-gray-600 font-medium">Live Preview</span>
      </div>
      <div className="flex-1 overflow-hidden">
        <iframe
          ref={iframeRef}
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin"
          title="Code Preview"
        />
      </div>
    </div>
  );
};

export default CodePreview;
