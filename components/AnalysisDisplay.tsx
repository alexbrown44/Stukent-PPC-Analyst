
import React from 'react';

interface AnalysisDisplayProps {
  content: string;
}

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ content }) => {
  // Simple markdown renderer for headers, lists, and bold text
  const formatContent = (text: string) => {
    return text.split('\n').map((line, i) => {
      // Headers
      if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-bold text-slate-800 mt-6 mb-3">{line.replace('### ', '')}</h3>;
      if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold text-slate-900 mt-8 mb-4 border-b pb-2">{line.replace('## ', '')}</h2>;
      if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-black text-slate-900 mt-10 mb-6">{line.replace('# ', '')}</h1>;
      
      // Unordered lists
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        return (
          <li key={i} className="ml-6 list-disc text-slate-700 my-1 leading-relaxed">
             {line.trim().substring(2)}
          </li>
        );
      }

      // Performance Score block
      if (line.toLowerCase().includes('overall performance score') || line.toLowerCase().includes('score:')) {
        return (
          <div key={i} className="bg-indigo-50 border-2 border-indigo-100 rounded-2xl p-6 my-8 text-indigo-900 shadow-sm">
             <div className="font-bold uppercase text-xs tracking-widest text-indigo-500 mb-2">Audit Summary Score</div>
             <p className="text-lg leading-relaxed">{line}</p>
          </div>
        );
      }

      // Category styling (e.g., High-performing, Underperforming)
      if (line.includes(': ')) {
        const [label, ...rest] = line.split(': ');
        return (
          <p key={i} className="text-slate-700 my-2 leading-relaxed">
            <span className="font-bold text-slate-900">{label}:</span> {rest.join(': ')}
          </p>
        );
      }

      // Regular text
      return line.trim() === '' ? <div key={i} className="h-4" /> : <p key={i} className="text-slate-700 my-2 leading-relaxed">{line}</p>;
    });
  };

  return (
    <div className="analysis-content animate-fade-in">
      {formatContent(content)}
    </div>
  );
};

export default AnalysisDisplay;
