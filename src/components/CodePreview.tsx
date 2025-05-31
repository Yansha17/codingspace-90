
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
      // For HTML, render the code directly with proper DOCTYPE and viewport
      const htmlContent = code.trim();
      if (htmlContent.toLowerCase().includes('<!doctype html') || htmlContent.toLowerCase().includes('<html')) {
        // Full HTML document
        doc.write(htmlContent);
      } else {
        // HTML fragment - wrap it properly
        doc.write(`
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>HTML Preview</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                margin: 0; 
                padding: 20px; 
                line-height: 1.6;
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
      // For CSS, create a demo page with the styles applied
      doc.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>CSS Preview</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              padding: 20px; 
              margin: 0;
              line-height: 1.6;
              background: #f8f9fa;
            }
            /* User CSS */
            ${code}
          </style>
        </head>
        <body>
          <div class="preview-container">
            <h1>CSS Preview</h1>
            <p class="text">This is a sample paragraph to demonstrate your CSS styling.</p>
            <button class="btn button">Sample Button</button>
            <div class="box sample-box" style="width: 100px; height: 100px; background: #e9ecef; margin: 15px 0; border: 1px solid #ddd; display: inline-block;">Box</div>
            <ul class="list">
              <li>List item 1</li>
              <li>List item 2</li>
              <li>List item 3</li>
            </ul>
            <div class="container card">
              <h3>Container Element</h3>
              <p class="content">This is content inside a container div that you can style.</p>
            </div>
            <form class="form">
              <input type="text" class="input" placeholder="Sample input field" style="margin: 5px; padding: 8px;">
              <textarea class="textarea" placeholder="Sample textarea" style="margin: 5px; padding: 8px; width: 200px; height: 60px;"></textarea>
            </form>
          </div>
        </body>
        </html>
      `);
    } else if (language.toLowerCase() === 'javascript' || language.toLowerCase() === 'js') {
      // For JavaScript, execute the code and show output
      doc.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>JavaScript Preview</title>
          <style>
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              padding: 20px; 
              margin: 0;
              background: #f8f9fa;
              color: #333;
            }
            .console-output { 
              background: #1e1e1e; 
              color: #ffffff;
              padding: 20px; 
              border-radius: 8px; 
              margin: 15px 0; 
              font-family: 'Courier New', Monaco, monospace; 
              font-size: 14px;
              border: 1px solid #333;
              min-height: 120px;
              white-space: pre-wrap;
              word-wrap: break-word;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            .output-line { margin: 2px 0; }
            .log { color: #4ade80; }
            .error { color: #f87171; font-weight: bold; }
            .warn { color: #fbbf24; }
            .info { color: #60a5fa; }
            .dom-content {
              background: white;
              padding: 20px;
              border-radius: 8px;
              margin: 15px 0;
              border: 1px solid #e5e7eb;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            h3 { color: #374151; margin-top: 0; }
            .status { 
              padding: 8px 12px; 
              border-radius: 4px; 
              margin: 10px 0; 
              font-size: 12px; 
              font-weight: bold; 
            }
            .ready { background: #dcfce7; color: #166534; }
            .running { background: #dbeafe; color: #1d4ed8; }
          </style>
        </head>
        <body>
          <h3>JavaScript Output</h3>
          <div class="status ready">Ready to execute...</div>
          <div id="console" class="console-output">Initializing JavaScript environment...\n</div>
          
          <div class="dom-content">
            <h4 style="margin-top: 0;">DOM Manipulation Area</h4>
            <div id="app"></div>
            <div id="root"></div>
            <div id="main"></div>
            <div id="output"></div>
            <div id="result"></div>
          </div>

          <script>
            const consoleDiv = document.getElementById('console');
            const statusDiv = document.querySelector('.status');
            
            // Clear console
            consoleDiv.innerHTML = '';
            statusDiv.textContent = 'Executing...';
            statusDiv.className = 'status running';
            
            // Override console methods
            const originalLog = console.log;
            const originalError = console.error;
            const originalWarn = console.warn;
            const originalInfo = console.info;
            
            function appendToConsole(message, className = 'log') {
              const line = document.createElement('div');
              line.className = 'output-line ' + className;
              line.textContent = '> ' + message;
              consoleDiv.appendChild(line);
              consoleDiv.scrollTop = consoleDiv.scrollHeight;
            }
            
            console.log = function(...args) {
              originalLog.apply(console, args);
              appendToConsole(args.join(' '), 'log');
            };
            
            console.error = function(...args) {
              originalError.apply(console, args);
              appendToConsole('ERROR: ' + args.join(' '), 'error');
            };
            
            console.warn = function(...args) {
              originalWarn.apply(console, args);
              appendToConsole('WARNING: ' + args.join(' '), 'warn');
            };
            
            console.info = function(...args) {
              originalInfo.apply(console, args);
              appendToConsole('INFO: ' + args.join(' '), 'info');
            };
            
            // Add some helpful functions
            function display(content) {
              const output = document.getElementById('output') || document.getElementById('app');
              if (output) {
                if (typeof content === 'object') {
                  output.innerHTML = '<pre>' + JSON.stringify(content, null, 2) + '</pre>';
                } else {
                  output.innerHTML = content;
                }
              }
            }
            
            // Make display function available globally
            window.display = display;
            
            try {
              // Execute user code
              ${code || 'console.log("No JavaScript code provided");'}
              
              statusDiv.textContent = 'Execution completed';
              statusDiv.className = 'status ready';
              
              if (consoleDiv.innerHTML.trim() === '') {
                appendToConsole('Code executed successfully (no output)', 'info');
              }
              
            } catch (error) {
              console.error(error.message);
              statusDiv.textContent = 'Execution failed';
              statusDiv.className = 'status error';
              console.error('Stack trace: ' + error.stack);
            }
          </script>
        </body>
        </html>
      `);
    } else if (language.toLowerCase() === 'react' || language.toLowerCase() === 'jsx') {
      // For React/JSX, show the code structure
      doc.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>React Preview</title>
          <style>
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              padding: 30px; 
              margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .container {
              background: white;
              padding: 40px;
              border-radius: 16px;
              box-shadow: 0 20px 40px rgba(0,0,0,0.1);
              max-width: 600px;
              width: 100%;
              text-align: center;
            }
            .react-icon { 
              font-size: 64px; 
              margin-bottom: 20px; 
              color: #61dafb;
            }
            .code-preview {
              background: #282c34;
              color: #abb2bf;
              padding: 20px;
              border-radius: 8px;
              font-family: 'Courier New', Monaco, monospace;
              text-align: left;
              margin-top: 20px;
              max-height: 300px;
              overflow-y: auto;
              font-size: 14px;
              line-height: 1.5;
            }
            h2 { color: #333; margin-bottom: 10px; }
            p { color: #666; line-height: 1.6; }
            .keyword { color: #c678dd; }
            .string { color: #98c379; }
            .component { color: #e06c75; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="react-icon">⚛️</div>
            <h2>React Component Structure</h2>
            <p>React components require a build process with Babel/JSX transformation to render in the browser.</p>
            <div class="code-preview">${code.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>').replace(/\s/g, '&nbsp;') || 'No React code provided'}</div>
            <p style="margin-top: 20px; font-size: 14px; color: #888;">
              To see this component rendered, you would need a React development environment.
            </p>
          </div>
        </body>
        </html>
      `);
    } else {
      // For other languages, show formatted code
      doc.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${language.toUpperCase()} Preview</title>
          <style>
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              padding: 30px; 
              margin: 0;
              background: #f8fafc;
              line-height: 1.6;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 2px solid #e2e8f0;
            }
            .header h2 {
              color: #2d3748;
              margin-bottom: 8px;
              font-size: 28px;
            }
            .language-badge {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 8px 16px;
              border-radius: 20px;
              font-size: 14px;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .code-container {
              background: #1a202c;
              border-radius: 12px;
              padding: 0;
              box-shadow: 0 10px 25px rgba(0,0,0,0.1);
              overflow: hidden;
            }
            .code-header {
              background: #2d3748;
              padding: 12px 20px;
              border-bottom: 1px solid #4a5568;
              font-size: 14px;
              color: #a0aec0;
              font-weight: 500;
            }
            .code-content {
              padding: 25px;
              color: #e2e8f0;
              font-family: 'Courier New', Monaco, 'Lucida Console', monospace;
              font-size: 14px;
              line-height: 1.8;
              white-space: pre-wrap;
              overflow-x: auto;
              max-height: 400px;
              overflow-y: auto;
            }
            .no-code {
              color: #718096;
              font-style: italic;
              text-align: center;
              padding: 40px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>${language.toUpperCase()} Code</h2>
            <div class="language-badge">${language}</div>
          </div>
          
          <div class="code-container">
            <div class="code-header">
              ${language.toLowerCase()}.${language === 'python' ? 'py' : language === 'javascript' ? 'js' : language.toLowerCase()}
            </div>
            <div class="code-content">
              ${code || `<div class="no-code">No ${language} code provided</div>`}
            </div>
          </div>
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
