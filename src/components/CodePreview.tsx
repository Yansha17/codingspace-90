
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
    
    if (language.toLowerCase() === 'html') {
      // For HTML, render the code directly
      doc.write(code || '<!DOCTYPE html><html><body><p>No HTML content to display</p></body></html>');
    } else if (language.toLowerCase() === 'css') {
      // For CSS, create a demo page with the styles applied
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
          <div class="container">
            <p class="text">Sample text for styling</p>
          </div>
        </body>
        </html>
      `);
    } else if (language.toLowerCase() === 'javascript') {
      // For JavaScript, execute the code and show output
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
              background: #f8f9fa;
            }
            .console { 
              background: #ffffff; 
              padding: 15px; 
              border-radius: 8px; 
              margin: 15px 0; 
              font-family: 'Courier New', monospace; 
              border: 1px solid #e9ecef;
              min-height: 100px;
              white-space: pre-wrap;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .error { color: #dc3545; font-weight: bold; }
            .success { color: #28a745; }
            .info { color: #007bff; }
            h3 { color: #495057; margin-bottom: 10px; }
          </style>
        </head>
        <body>
          <h3>JavaScript Output</h3>
          <div id="output" class="console">Ready to execute JavaScript...</div>
          <div id="dom-content" style="margin-top: 20px; padding: 15px; background: white; border-radius: 8px; border: 1px solid #e9ecef;">
            <h4 style="margin-top: 0; color: #495057;">DOM Content Area</h4>
            <div id="render-area"></div>
          </div>
          <script>
            const originalLog = console.log;
            const originalError = console.error;
            const originalWarn = console.warn;
            const outputDiv = document.getElementById('output');
            const renderArea = document.getElementById('render-area');
            
            // Clear output
            outputDiv.innerHTML = '';
            
            console.log = function(...args) {
              originalLog.apply(console, args);
              outputDiv.innerHTML += '<span class="success">› ' + args.join(' ') + '</span>\\n';
            };
            
            console.error = function(...args) {
              originalError.apply(console, args);
              outputDiv.innerHTML += '<span class="error">✗ Error: ' + args.join(' ') + '</span>\\n';
            };
            
            console.warn = function(...args) {
              originalWarn.apply(console, args);
              outputDiv.innerHTML += '<span class="info">⚠ Warning: ' + args.join(' ') + '</span>\\n';
            };
            
            // Make document.getElementById available for the render area
            const originalGetElementById = document.getElementById;
            document.getElementById = function(id) {
              if (id === 'app' || id === 'root' || id === 'main') {
                return renderArea;
              }
              return originalGetElementById.call(document, id);
            };
            
            try {
              ${code || 'console.log("No JavaScript code to execute");'}
            } catch (error) {
              outputDiv.innerHTML += '<span class="error">✗ Runtime Error: ' + error.message + '</span>\\n';
              console.error('Stack trace:', error.stack);
            }
          </script>
        </body>
        </html>
      `);
    } else if (language.toLowerCase() === 'react' || language.toLowerCase() === 'jsx') {
      // For React/JSX, show a message about limitations
      doc.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { 
              font-family: Arial, sans-serif; 
              padding: 40px; 
              margin: 0;
              background: #f8f9fa;
              text-align: center;
            }
            .message {
              background: white;
              padding: 30px;
              border-radius: 12px;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
              max-width: 400px;
              margin: 0 auto;
            }
            .icon { font-size: 48px; margin-bottom: 20px; }
            .code-block {
              background: #f1f3f4;
              padding: 15px;
              border-radius: 8px;
              font-family: 'Courier New', monospace;
              text-align: left;
              margin-top: 20px;
              white-space: pre-wrap;
              font-size: 12px;
              max-height: 200px;
              overflow-y: auto;
            }
          </style>
        </head>
        <body>
          <div class="message">
            <div class="icon">⚛️</div>
            <h3>React/JSX Preview</h3>
            <p>React components require a build process to render. Your code structure:</p>
            <div class="code-block">${code.replace(/</g, '&lt;').replace(/>/g, '&gt;') || 'No React code provided'}</div>
          </div>
        </body>
        </html>
      `);
    } else {
      // For other languages, show the code in a formatted way
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
              background: #f8f9fa;
            }
            .code-display {
              background: #ffffff;
              padding: 20px;
              border-radius: 8px;
              border: 1px solid #e9ecef;
              font-family: 'Courier New', monospace;
              white-space: pre-wrap;
              overflow-x: auto;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .header {
              color: #495057;
              margin-bottom: 15px;
              font-family: Arial, sans-serif;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h3>${language.toUpperCase()} Code Preview</h3>
            <p>Preview not available for ${language}. Here's your formatted code:</p>
          </div>
          <div class="code-display">${code || `No ${language} code provided`}</div>
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
        <span className="text-xs text-gray-400 ml-2">({language})</span>
      </div>
      <div className="flex-1 overflow-hidden">
        <iframe
          ref={iframeRef}
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin allow-forms"
          title="Code Preview"
        />
      </div>
    </div>
  );
};

export default CodePreview;
