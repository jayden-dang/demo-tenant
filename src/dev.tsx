/**
 * Development entry point for local testing
 *
 * This file is used only during development with Vite.
 * It simulates the sandbox environment for testing the miniapp locally.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import miniapp from './index';

// Mock the sandbox bridge for local development
const mockSandboxBridge = {
  getEditorContent: async () => {
    return `function hello() {\n  console.log("Hello, World!");\n}\n\nhello();`;
  },
  onEditorChange: (callback: (content: string) => void) => {
    // Simulate periodic content changes
    const interval = setInterval(() => {
      const content = `// Updated at ${new Date().toLocaleTimeString()}\nfunction hello() {\n  console.log("Hello!");\n}`;
      callback(content);
    }, 5000);
    return () => clearInterval(interval);
  },
  useMiniAppContext: () => ({
    type: 'projects' as const,
    projectId: 'mock-project-id',
    workspaceId: 'mock-workspace-id',
  }),
  emit: (messageType: string, payload: unknown) => {
    console.log('[Mock Bridge] Emit:', messageType, payload);
  },
  subscribe: (messageType: string, handler: (payload: unknown) => void) => {
    console.log('[Mock Bridge] Subscribe:', messageType);
    // Mock response for testing
    setTimeout(() => {
      if (messageType === 'learn.content.response') {
        handler({
          lessonId: 'mock-lesson',
          title: 'Introduction to React',
          content: '# Welcome\n\nThis is a mock lesson for testing.',
          paneConfigs: [],
        });
      }
    }, 1000);
    return () => console.log('[Mock Bridge] Unsubscribe:', messageType);
  },
};

// Set up mock window globals
declare global {
  interface Window {
    React: typeof React;
    __sandboxBridge: typeof mockSandboxBridge;
  }
}

window.React = React;
window.__sandboxBridge = mockSandboxBridge;

// Render the miniapp
const root = document.getElementById('root');
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <miniapp.component />
    </React.StrictMode>
  );
}

console.log('🎨 Development mode - Miniapp loaded with mock sandbox bridge');
console.log('📦 Manifest:', miniapp.manifest);
