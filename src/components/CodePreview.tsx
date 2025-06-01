
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
      // For HTML, render the code directly with proper interactive capabilities
      const htmlContent = code.trim();
      if (htmlContent.toLowerCase().includes('<!doctype html') || htmlContent.toLowerCase().includes('<html')) {
        // Full HTML document
        doc.write(htmlContent);
      } else {
        // HTML fragment - wrap it properly with interactive support
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
              * { box-sizing: border-box; }
              button {
                cursor: pointer;
                border: 1px solid #ddd;
                background: #f8f9fa;
                padding: 8px 16px;
                border-radius: 4px;
                margin: 4px;
              }
              button:hover {
                background: #e9ecef;
              }
              input, select, textarea {
                border: 1px solid #ddd;
                padding: 8px;
                margin: 4px;
                border-radius: 4px;
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
      // Enhanced CSS preview with more diverse elements
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
            /* Default styling for demo elements */
            .demo-section { margin: 20px 0; padding: 15px; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .demo-section h3 { margin-top: 0; color: #333; }
            /* User CSS */
            ${code}
          </style>
        </head>
        <body>
          <div class="demo-section">
            <h3>Text Elements</h3>
            <h1 class="heading title">Main Heading</h1>
            <h2 class="subheading">Subheading</h2>
            <p class="text content">This is a sample paragraph to demonstrate your CSS styling. You can style this text with classes like .text, .content, or p selector.</p>
            <p class="description">Another paragraph with different content for styling variety.</p>
            <a href="#" class="link">Sample Link</a>
          </div>

          <div class="demo-section">
            <h3>Interactive Elements</h3>
            <button class="btn button primary">Primary Button</button>
            <button class="btn button secondary">Secondary Button</button>
            <input type="text" class="input" placeholder="Text input field" />
            <select class="select dropdown">
              <option>Option 1</option>
              <option>Option 2</option>
              <option>Option 3</option>
            </select>
          </div>

          <div class="demo-section">
            <h3>Layout Elements</h3>
            <div class="container box card">
              <h4 class="card-title">Card Title</h4>
              <p class="card-content">This is content inside a container that you can style with classes like .container, .box, .card</p>
            </div>
            <div class="flex-container">
              <div class="item flex-item">Flex Item 1</div>
              <div class="item flex-item">Flex Item 2</div>
              <div class="item flex-item">Flex Item 3</div>
            </div>
          </div>

          <div class="demo-section">
            <h3>Lists and Navigation</h3>
            <ul class="list nav-list">
              <li class="list-item nav-item"><a href="#" class="nav-link">Home</a></li>
              <li class="list-item nav-item"><a href="#" class="nav-link">About</a></li>
              <li class="list-item nav-item"><a href="#" class="nav-link">Contact</a></li>
            </ul>
          </div>

          <div class="demo-section">
            <h3>Form Elements</h3>
            <form class="form">
              <div class="form-group">
                <label class="label">Name:</label>
                <input type="text" class="input form-input" placeholder="Enter your name" />
              </div>
              <div class="form-group">
                <label class="label">Message:</label>
                <textarea class="textarea" placeholder="Enter your message" rows="3"></textarea>
              </div>
              <button type="submit" class="btn submit-btn">Submit</button>
            </form>
          </div>
        </body>
        </html>
      `);
    } else if (language.toLowerCase() === 'javascript' || language.toLowerCase() === 'js') {
      // Enhanced JavaScript execution environment
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
              max-height: 300px;
              overflow-y: auto;
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
              min-height: 100px;
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
            .error-status { background: #fecaca; color: #dc2626; }
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
            <div id="content"></div>
          </div>

          <script>
            const consoleDiv = document.getElementById('console');
            const statusDiv = document.querySelector('.status');
            
            // Clear console
            consoleDiv.innerHTML = '';
            statusDiv.textContent = 'Executing...';
            statusDiv.className = 'status running';
            
            // Enhanced console override system
            const originalConsole = {
              log: console.log,
              error: console.error,
              warn: console.warn,
              info: console.info,
              dir: console.dir,
              table: console.table
            };
            
            function appendToConsole(message, className = 'log') {
              const line = document.createElement('div');
              line.className = 'output-line ' + className;
              line.textContent = '> ' + message;
              consoleDiv.appendChild(line);
              consoleDiv.scrollTop = consoleDiv.scrollHeight;
            }
            
            // Override all console methods
            console.log = function(...args) {
              originalConsole.log.apply(console, args);
              appendToConsole(args.map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
              ).join(' '), 'log');
            };
            
            console.error = function(...args) {
              originalConsole.error.apply(console, args);
              appendToConsole('ERROR: ' + args.map(arg => String(arg)).join(' '), 'error');
            };
            
            console.warn = function(...args) {
              originalConsole.warn.apply(console, args);
              appendToConsole('WARNING: ' + args.map(arg => String(arg)).join(' '), 'warn');
            };
            
            console.info = function(...args) {
              originalConsole.info.apply(console, args);
              appendToConsole('INFO: ' + args.map(arg => String(arg)).join(' '), 'info');
            };
            
            console.dir = function(obj) {
              originalConsole.dir.apply(console, arguments);
              try {
                appendToConsole(JSON.stringify(obj, null, 2), 'info');
              } catch(e) {
                appendToConsole(String(obj), 'info');
              }
            };
            
            console.table = function(data) {
              originalConsole.table.apply(console, arguments);
              try {
                appendToConsole('TABLE: ' + JSON.stringify(data, null, 2), 'info');
              } catch(e) {
                appendToConsole('TABLE: ' + String(data), 'info');
              }
            };
            
            // Helper functions for DOM manipulation
            function display(content, elementId = 'output') {
              const element = document.getElementById(elementId);
              if (element) {
                if (typeof content === 'object') {
                  element.innerHTML = '<pre>' + JSON.stringify(content, null, 2) + '</pre>';
                } else {
                  element.innerHTML = content;
                }
              }
            }
            
            function createElement(tag, attributes = {}, content = '') {
              const element = document.createElement(tag);
              Object.keys(attributes).forEach(key => {
                element.setAttribute(key, attributes[key]);
              });
              element.innerHTML = content;
              return element;
            }
            
            function appendElement(parentId, element) {
              const parent = document.getElementById(parentId);
              if (parent && element) {
                parent.appendChild(element);
              }
            }
            
            // Make helper functions available globally
            window.display = display;
            window.createElement = createElement;
            window.appendElement = appendElement;
            
            // Enhanced async support
            const executeCode = async () => {
              try {
                // Execute user code with async support
                const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
                const userCode = \`${code || 'console.log("No JavaScript code provided");'}\`;
                
                const asyncWrapper = new AsyncFunction(userCode);
                await asyncWrapper();
                
                statusDiv.textContent = 'Execution completed';
                statusDiv.className = 'status ready';
                
                if (consoleDiv.innerHTML.trim() === '') {
                  appendToConsole('Code executed successfully (no output)', 'info');
                }
                
              } catch (error) {
                console.error(error.message);
                statusDiv.textContent = 'Execution failed';
                statusDiv.className = 'status error-status';
                console.error('Error details: ' + error.stack);
              }
            };
            
            executeCode();
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
          sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups"
          title="Code Preview"
        />
      </div>
    </div>
  );
};

export default CodePreview;
