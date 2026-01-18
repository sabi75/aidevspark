
import React, { useState } from 'react';
import { GeneratedCode } from '../types';

interface CodeEditorProps {
  code: GeneratedCode | null;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code }) => {
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');

  if (!code) {
    return (
      <div className="h-full flex items-center justify-center text-slate-500 bg-slate-900/50 rounded-xl">
        <p>No code generated yet</p>
      </div>
    );
  }

  const getCode = () => {
    switch (activeTab) {
      case 'html': return code.html;
      case 'css': return code.css || '/* No custom CSS */';
      case 'js': return code.js || '// No interactive logic';
      default: return '';
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getCode());
    alert('Code copied to clipboard!');
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-xl overflow-hidden border border-slate-700">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
        <div className="flex gap-2">
          {(['html', 'css', 'js'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 text-xs font-medium rounded-md uppercase transition-colors ${
                activeTab === tab ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <button 
          onClick={copyToClipboard}
          className="text-slate-400 hover:text-white p-1 rounded transition-colors"
          title="Copy Code"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
          </svg>
        </button>
      </div>
      <div className="flex-1 p-4 overflow-auto fira-code text-sm">
        <pre className="text-indigo-300">
          <code>{getCode()}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodeEditor;
