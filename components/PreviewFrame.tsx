
import React from 'react';

interface PreviewFrameProps {
  html: string;
}

const PreviewFrame: React.FC<PreviewFrameProps> = ({ html }) => {
  if (!html) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 bg-slate-900/50 border-2 border-dashed border-slate-700 rounded-xl">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <p>Your application will appear here</p>
      </div>
    );
  }

  return (
    <iframe
      title="App Preview"
      srcDoc={html}
      sandbox="allow-scripts allow-modals allow-forms allow-popups"
      className="w-full h-full border-0 bg-white rounded-xl shadow-2xl"
    />
  );
};

export default PreviewFrame;
