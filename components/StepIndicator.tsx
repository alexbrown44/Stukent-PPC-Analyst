
import React from 'react';
import { AnalysisStep } from '../types';

interface StepIndicatorProps {
  currentStep: AnalysisStep;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const steps = [
    { id: 1, label: 'Upload' },
    { id: 1.5, label: 'Sanitize' },
    { id: 2, label: 'Analysis' },
    { id: 3, label: 'Ad Copy' },
    { id: 4, label: 'LP Data' },
    { id: 5, label: 'Report' },
  ];

  return (
    <div className="relative">
      <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 z-0"></div>
      <div className="relative z-10 flex justify-between items-center">
        {steps.map((step) => (
          <div key={step.id} className="flex flex-col items-center gap-2">
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                currentStep >= step.id 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-110' 
                  : 'bg-white border-2 border-slate-200 text-slate-400'
              }`}
            >
              {step.id === 1.5 ? '...' : Math.floor(step.id)}
            </div>
            <span className={`text-[10px] md:text-xs font-semibold uppercase tracking-tight ${
              currentStep === step.id ? 'text-indigo-600' : 'text-slate-400'
            }`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;
