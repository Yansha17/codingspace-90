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
      // For HTML, render the code directly with interactive capability
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
                margin: 4px; 
                padding: 0; 
                line-height: 1.2;
                font-size: 11px;
                zoom: 0.8;
              }
              * { box-sizing: border-box; }
              button {
                cursor: pointer;
                border: 1px solid #ccc;
                background: #f0f0f0;
                padding: 4px 8px;
                border-radius: 3px;
                margin: 2px;
                font-size: 10px;
              }
              button:hover {
                background: #e0e0e0;
              }
              button:active {
                background: #d0d0d0;
              }
              input, select, textarea {
                border: 1px solid #ccc;
                padding: 3px;
                margin: 1px;
                border-radius: 2px;
                font-size: 10px;
              }
            </style>
          </head>
          <body>
            ${htmlContent}
          </body>
          </html>
        `);
      }
    } else if (language.toLowerCase() === 'css') {
      // Enhanced CSS mini preview
      doc.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 2px; 
              padding: 0;
              font-size: 9px;
              zoom: 0.7;
              line-height: 1.2;
            }
            .demo { margin: 1px 0; }
            .sample-box { 
              width: 30px; 
              height: 15px; 
              background: #ddd; 
              margin: 1px; 
              display: inline-block;
              border: 1px solid #ccc;
            }
            .sample-text { margin: 2px 0; }
            .sample-btn { 
              padding: 2px 4px; 
              background: #f0f0f0; 
              border: 1px solid #ccc; 
              cursor: pointer;
              font-size: 8px;
            }
            /* User CSS */
            ${code}
          </style>
        </head>
        <body>
          <div class="demo">
            <div class="box sample-box">Box</div>
            <button class="btn button sample-btn">Btn</button>
            <p class="text sample-text">Text</p>
            <div class="container card" style="border: 1px solid #eee; padding: 2px; margin: 1px;">
              <span class="content">Content</span>
            </div>
          </div>
        </body>
        </html>
      `);
    } else if (language.toLowerCase() === 'javascript' || language.toLowerCase() === 'js') {
      // Enhanced JavaScript mini execution with calculator
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
              padding: 2px;
              background: #1a1a1a; 
              color: #00ff00;
              font-size: 8px;
              overflow: hidden;
              line-height: 1.1;
            }
            .output { 
              background: #000; 
              padding: 2px; 
              border-radius: 1px; 
              height: 50%;
              overflow-y: auto;
              margin-bottom: 2px;
            }
            .interactive { 
              height: 50%;
              background: #2a2a2a; 
              padding: 2px;
              border-radius: 1px;
              overflow: hidden;
            }
            .line { margin: 0; font-size: 7px; }
            .error { color: #ff6b6b; }
            .warn { color: #feca57; }
            .info { color: #48cae4; }
            
            /* Mini Calculator */
            .calc {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 1px;
              height: 100%;
              font-size: 6px;
            }
            .calc-display {
              grid-column: span 4;
              background: #333;
              color: #0f0;
              text-align: right;
              padding: 1px;
              font-size: 7px;
              border: none;
            }
            .calc-btn {
              background: #444;
              color: #fff;
              border: none;
              font-size: 6px;
              cursor: pointer;
              padding: 1px;
            }
            .calc-btn:hover { background: #555; }
            .calc-btn.op { background: #666; }
            .calc-btn.eq { background: #4a4; }
            .calc-btn.clear { background: #a44; }
          </style>
        </head>
        <body>
          <div id="output" class="output">Running...</div>
          <div class="interactive">
            <div class="calc">
              <input class="calc-display display" readonly>
              <button class="calc-btn clear" data-value="C">C</button>
              <button class="calc-btn op" data-value="/">/</button>
              <button class="calc-btn op" data-value="*">×</button>
              <button class="calc-btn op" data-value="-">-</button>
              <button class="calc-btn btn" data-value="7">7</button>
              <button class="calc-btn btn" data-value="8">8</button>
              <button class="calc-btn btn" data-value="9">9</button>
              <button class="calc-btn op" data-value="+">+</button>
              <button class="calc-btn btn" data-value="4">4</button>
              <button class="calc-btn btn" data-value="5">5</button>
              <button class="calc-btn btn" data-value="6">6</button>
              <button class="calc-btn eq" data-value="=">=</button>
              <button class="calc-btn btn" data-value="1">1</button>
              <button class="calc-btn btn" data-value="2">2</button>
              <button class="calc-btn btn" data-value="3">3</button>
              <button class="calc-btn btn" data-value="0">0</button>
            </div>
          </div>
          <script>
            const output = document.getElementById('output');
            output.innerHTML = '';
            
            // Enhanced console for mini preview
            const log = (message, className = '') => {
              const line = document.createElement('div');
              line.className = 'line ' + className;
              line.textContent = '> ' + String(message);
              output.appendChild(line);
              output.scrollTop = output.scrollHeight;
            };
            
            console.log = (...args) => log(args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
            ).join(' '));
            console.error = (...args) => log('ERR: ' + args.join(' '), 'error');
            console.warn = (...args) => log('WARN: ' + args.join(' '), 'warn');
            console.info = (...args) => log('INFO: ' + args.join(' '), 'info');
            
            // Helper for DOM manipulation in mini view
            window.display = (content) => {
              const div = document.createElement('div');
              div.className = 'line';
              div.innerHTML = typeof content === 'object' ? JSON.stringify(content) : String(content);
              output.appendChild(div);
            };
            
            try {
              // Execute user code with enhanced error handling
              ${code || 'console.log("No JS code");'}
            } catch (error) {
              console.error(error.message);
            }
            
            if (output.innerHTML === '') {
              log('Executed (no output)', 'info');
            }
          </script>
        </body>
        </html>
      `);
    } else {
      // For other languages, show formatted code with better styling
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
              padding: 2px;
              background: #1a1a1a; 
              color: #e0e0e0;
              font-size: 8px;
              line-height: 1.1;
              overflow: hidden;
            }
            .line { margin: 0; white-space: pre; font-size: 8px; }
            .line-num { color: #666; margin-right: 4px; display: inline-block; width: 15px; text-align: right; }
            .more { color: #888; text-align: center; margin-top: 1px; font-size: 7px; }
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
        sandbox="allow-scripts allow-same-origin allow-forms allow-modals"
        title="Mini Code Preview"
      />
    </div>
  );
});

CodePreviewMini.displayName = 'CodePreviewMini';

export default CodePreviewMini;
