
import React, { useRef, useEffect, memo } from 'react';

interface CodePreviewMiniProps {
  code: string;
  language: string;
  maxLines?: number;
}

const CodePreviewMini: React.FC<CodePreviewMiniProps> = memo(({ 
  code, 
  language, 
  maxLines = 3 
}) => {
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
      const htmlContent = code.trim();
      if (htmlContent.toLowerCase().includes('<!doctype html') || htmlContent.toLowerCase().includes('<html')) {
        doc.write(htmlContent);
      } else {
        doc.write(`
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { 
                font-family: Arial, sans-serif; 
                margin: 8px; 
                padding: 0; 
                line-height: 1.4;
                font-size: 12px;
                zoom: 0.8;
              }
              * { box-sizing: border-box; }
            </style>
          </head>
          <body>
            ${htmlContent}
          </body>
          </html>
        `);
      }
    } else if (language.toLowerCase() === 'css') {
      // For CSS, create a mini demo
      doc.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 4px; 
              padding: 0;
              font-size: 10px;
              zoom: 0.7;
            }
            .demo { margin: 2px 0; }
            /* User CSS */
            ${code}
          </style>
        </head>
        <body>
          <div class="demo">
            <div class="box" style="width: 40px; height: 20px; background: #ddd; margin: 2px;">Box</div>
            <button class="btn button">Button</button>
            <p class="text">Sample text</p>
          </div>
        </body>
        </html>
      `);
    } else if (language.toLowerCase() === 'javascript' || language.toLowerCase() === 'js') {
      // For JavaScript, show console output in mini format
      doc.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { 
              font-family: 'Courier New', monospace; 
              margin: 0; 
              padding: 4px;
              background: #1a1a1a; 
              color: #00ff00;
              font-size: 10px;
              overflow: hidden;
            }
            .output { 
              background: #000; 
              padding: 4px; 
              border-radius: 2px; 
              height: 100%;
              overflow-y: auto;
            }
            .line { margin: 1px 0; }
          </style>
        </head>
        <body>
          <div id="output" class="output">Running...</div>
          <script>
            const output = document.getElementById('output');
            output.innerHTML = '';
            
            // Override console
            const log = (...args) => {
              const line = document.createElement('div');
              line.className = 'line';
              line.textContent = '> ' + args.join(' ');
              output.appendChild(line);
            };
            
            console.log = log;
            console.error = log;
            console.warn = log;
            
            try {
              ${code || 'console.log("No code");'}
            } catch (error) {
              log('Error: ' + error.message);
            }
            
            if (output.innerHTML === '') {
              log('Code executed (no output)');
            }
          </script>
        </body>
        </html>
      `);
    } else {
      // For other languages, show formatted code
      const lines = code.split('\n').slice(0, maxLines);
      const hasMoreLines = code.split('\n').length > maxLines;
      
      doc.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { 
              font-family: 'Courier New', monospace; 
              margin: 0; 
              padding: 4px;
              background: #1a1a1a; 
              color: #e0e0e0;
              font-size: 9px;
              line-height: 1.2;
              overflow: hidden;
            }
            .line { margin: 1px 0; white-space: pre; }
            .line-num { color: #666; margin-right: 4px; }
            .more { color: #888; text-align: center; margin-top: 2px; }
          </style>
        </head>
        <body>
          ${lines.map((line, i) => `<div class="line"><span class="line-num">${i + 1}</span>${line || ' '}</div>`).join('')}
          ${hasMoreLines ? '<div class="more">...</div>' : ''}
        </body>
        </html>
      `);
    }
    
    doc.close();
  }, [language, code, maxLines]);

  if (!code.trim()) {
    return (
      <div className="text-xs text-gray-500 font-mono p-2 bg-gray-900 text-gray-400 rounded h-full flex items-center justify-center">
        <span className="opacity-60">No code to preview</span>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-900 rounded overflow-hidden">
      <iframe
        ref={iframeRef}
        className="w-full h-full border-0"
        sandbox="allow-scripts allow-same-origin"
        title="Mini Code Preview"
      />
    </div>
  );
});

CodePreviewMini.displayName = 'CodePreviewMini';

export default CodePreviewMini;
