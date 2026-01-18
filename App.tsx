
import React, { useState, useCallback, useRef } from 'react';
import { generateAppCode } from './services/geminiService';
import { AppStatus, BuildHistory, GeneratedCode } from './types';
import PreviewFrame from './components/PreviewFrame';
import CodeEditor from './components/CodeEditor';

const TEMPLATES = [
  {
    title: "SaaS Landing Page",
    icon: "🚀",
    prompt: "A high-conversion SaaS landing page for a cloud storage startup called 'Nebula'. Include a sticky glassmorphism header, a hero section with a 'Sign Up' button, a 3-tier pricing table with a monthly/yearly toggle, and a responsive FAQ section with accordions. Use a modern deep blue and purple color palette."
  },
  {
    title: "Analytics Dashboard",
    icon: "📊",
    prompt: "A professional financial analytics dashboard. Sidebar navigation with icons, top row showing 4 stat cards (Revenue, Users, Growth, Churn), a large main area with a simulated line chart for sales trends, and a 'Recent Transactions' table with status badges (Pending, Completed, Cancelled)."
  },
  {
    title: "Creative Portfolio",
    icon: "🎨",
    prompt: "A minimalist, dark-themed portfolio for a UI/UX designer. Full-screen hero with a bold headline and a smooth scroll-down indicator. A grid-based gallery of work with hover effects that show project titles. Include a footer with links to Dribbble, GitHub, and a simple 'Contact Me' button."
  },
  {
    title: "E-commerce Product",
    icon: "👟",
    prompt: "A modern product detail page for premium sneakers. Left side features a large image with thumbnail navigation. Right side contains product title, pricing, a star rating, color variant circles, a size selector dropdown, and an animated 'Add to Cart' button. Include a collapsible 'Product Details' section."
  },
  {
    title: "Task Kanban Board",
    icon: "📋",
    prompt: "A functional Kanban-style task management app. Three columns: 'To Do', 'In Progress', and 'Done'. Each column should contain task cards with titles, priority tags (Low, Medium, High), and due dates. Add a button at the top of each column to 'Add New Task' and a search bar in the header."
  }
];

const App: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [currentCode, setCurrentCode] = useState<GeneratedCode | null>(null);
  const [history, setHistory] = useState<BuildHistory[]>([]);
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleBuild = async () => {
    if (!prompt.trim()) return;

    setStatus(AppStatus.BUILDING);
    setError(null);

    try {
      const code = await generateAppCode(prompt);
      setCurrentCode(code);
      
      const newEntry: BuildHistory = {
        id: crypto.randomUUID(),
        prompt: prompt,
        timestamp: Date.now(),
        code: code,
      };

      setHistory(prev => [newEntry, ...prev.slice(0, 9)]);
      setStatus(AppStatus.SUCCESS);
      setViewMode('preview');
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setStatus(AppStatus.ERROR);
    }
  };

  const loadFromHistory = (item: BuildHistory) => {
    setPrompt(item.prompt);
    setCurrentCode(item.code);
    setViewMode('preview');
  };

  const applyTemplate = (templatePrompt: string) => {
    setPrompt(templatePrompt);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-200">
      {/* Header */}
      <header className="px-6 py-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">S</div>
          <h1 className="text-xl font-bold tracking-tight text-white">Spark<span className="text-indigo-400">Builder</span> AI</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-1 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Gemini 3 Pro Powered
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Panel: Controls */}
        <aside className="w-full lg:w-96 p-6 border-r border-slate-800 flex flex-col gap-6 bg-slate-900/20 overflow-y-auto">
          
          {/* Templates Section */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Quick Templates</h2>
            <div className="grid grid-cols-2 gap-2">
              {TEMPLATES.map((tmpl, idx) => (
                <button
                  key={idx}
                  onClick={() => applyTemplate(tmpl.prompt)}
                  className="flex flex-col items-center justify-center p-3 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 hover:border-indigo-500/50 transition-all text-center group"
                >
                  <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">{tmpl.icon}</span>
                  <span className="text-[10px] font-bold text-slate-400 group-hover:text-indigo-300">{tmpl.title}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-800/50">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Custom Prompt</h2>
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400">Describe your application</label>
              <textarea
                ref={textareaRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., A modern dashboard for a crypto portfolio with a dark theme and interactive charts..."
                className="w-full h-40 bg-slate-900 border border-slate-700 rounded-xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
                disabled={status === AppStatus.BUILDING}
              />
            </div>
            <button
              onClick={handleBuild}
              disabled={status === AppStatus.BUILDING || !prompt.trim()}
              className={`w-full py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                status === AppStatus.BUILDING
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'
              }`}
            >
              {status === AppStatus.BUILDING ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Building App...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  Generate App
                </>
              )}
            </button>
            {error && (
              <div className="p-3 bg-red-900/30 border border-red-800 rounded-lg text-xs text-red-400 flex gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col gap-4 overflow-hidden pt-4 border-t border-slate-800/50">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">History</h2>
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-800">
              {history.length === 0 ? (
                <p className="text-xs text-slate-600 italic">No builds yet.</p>
              ) : (
                history.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => loadFromHistory(item)}
                    className="w-full p-3 text-left bg-slate-900/50 border border-slate-800 rounded-xl hover:border-slate-600 transition-all group"
                  >
                    <p className="text-xs font-medium text-slate-300 line-clamp-2 mb-1 group-hover:text-white">{item.prompt}</p>
                    <span className="text-[10px] text-slate-600">{new Date(item.timestamp).toLocaleTimeString()}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </aside>

        {/* Right Panel: Viewport */}
        <section className="flex-1 flex flex-col p-6 bg-slate-950 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2 p-1 bg-slate-900 rounded-lg">
              <button
                onClick={() => setViewMode('preview')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'preview' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Preview
              </button>
              <button
                onClick={() => setViewMode('code')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'code' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Code
              </button>
            </div>
            {currentCode && (
              <div className="text-xs text-slate-500">
                Generated with AI Precision
              </div>
            )}
          </div>

          <div className="flex-1 relative bg-slate-900/40 rounded-2xl p-2 border border-slate-800/50 shadow-inner overflow-hidden">
            {viewMode === 'preview' ? (
              <PreviewFrame html={currentCode?.fullHtml || ''} />
            ) : (
              <CodeEditor code={currentCode} />
            )}
            
            {status === AppStatus.BUILDING && (
              <div className="absolute inset-0 z-10 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center">
                <div className="relative w-24 h-24 mb-6">
                  <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
                  <div className="absolute inset-4 bg-indigo-600/10 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Generating Masterpiece</h3>
                <p className="text-slate-400 max-w-xs text-center px-4">Our AI architect is drafting, styling, and scripting your application based on your description.</p>
                <div className="mt-8 flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"></div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Quick Tips */}
      <footer className="px-6 py-2 border-t border-slate-900 bg-slate-950 flex justify-center">
        <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">
          Design • Generate • Deploy
        </p>
      </footer>
    </div>
  );
};

export default App;
