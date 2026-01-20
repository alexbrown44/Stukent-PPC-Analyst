
import React, { useState } from 'react';
import { AnalysisStep, AnalysisState } from './types';
import Header from './components/Header';
import StepIndicator from './components/StepIndicator';
import FileUploader from './components/FileUploader';
import AnalysisDisplay from './components/AnalysisDisplay';
import { analyzeKeywords, conductDeepDive, cleanupScrapedData } from './services/geminiService';
import { jsPDF } from 'jspdf';

const App: React.FC = () => {
  const [state, setState] = useState<AnalysisState>({
    step: AnalysisStep.KEYWORD_UPLOAD,
    keywordData: null,
    cleanedCSV: null,
    keywordAnalysis: null,
    adCopy: null,
    landingPage: null,
    finalReport: null,
    isProcessing: false,
  });

  const handleKeywordUpload = async (content: string) => {
    setState(prev => ({ ...prev, isProcessing: true, keywordData: content }));
    try {
      const cleaned = await cleanupScrapedData(content);
      setState(prev => ({
        ...prev,
        step: AnalysisStep.DATA_CLEANUP,
        cleanedCSV: cleaned,
        isProcessing: false
      }));
    } catch (error) {
      console.error(error);
      setState(prev => ({ ...prev, isProcessing: false }));
      alert("Error processing raw data. Please ensure it contains keyword metrics.");
    }
  };

  const approveAndAnalyze = async () => {
    if (!state.cleanedCSV) return;
    setState(prev => ({ ...prev, isProcessing: true }));
    try {
      const analysis = await analyzeKeywords(state.cleanedCSV);
      setState(prev => ({
        ...prev,
        step: AnalysisStep.KEYWORD_ANALYSIS,
        keywordAnalysis: analysis,
        isProcessing: false
      }));
    } catch (error) {
      console.error(error);
      setState(prev => ({ ...prev, isProcessing: false }));
      alert("Error analyzing the structured data.");
    }
  };

  const proceedToAdCopy = () => {
    setState(prev => ({ ...prev, step: AnalysisStep.AD_COPY_REQUEST }));
  };

  const handleAdCopyUpload = (content: string) => {
    setState(prev => ({
      ...prev,
      adCopy: content,
      step: AnalysisStep.LANDING_PAGE_REQUEST
    }));
  };

  const handleLandingPageUpload = async (content: string) => {
    setState(prev => ({ ...prev, isProcessing: true, landingPage: content }));
    try {
      const report = await conductDeepDive({
        keywords: state.cleanedCSV || state.keywordData || "",
        adCopy: state.adCopy || "",
        landingPage: content
      });
      setState(prev => ({
        ...prev,
        step: AnalysisStep.FINAL_DEEP_DIVE,
        finalReport: report,
        isProcessing: false
      }));
    } catch (error) {
      console.error(error);
      setState(prev => ({ ...prev, isProcessing: false }));
      alert("Error generating final report.");
    }
  };

  const handleDownloadPDF = () => {
    if (!state.finalReport) return;
    
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
      putOnlyUsedFonts: true
    });

    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const contentWidth = pageWidth - (margin * 2);
    let y = 30;

    // Helper for multi-page text
    const addText = (text: string, fontSize: number = 10, isBold: boolean = false) => {
      doc.setFont('helvetica', isBold ? 'bold' : 'normal');
      doc.setFontSize(fontSize);
      const lines = doc.splitTextToSize(text, contentWidth);
      
      lines.forEach((line: string) => {
        if (y > 275) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, margin, y);
        y += (fontSize * 0.5) + 2;
      });
    };

    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('Paid Search Audit Report', margin, y);
    y += 10;
    
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, margin, y);
    doc.setTextColor(0);
    y += 15;

    // Process report text
    const sections = state.finalReport.split('\n');
    sections.forEach(section => {
      if (section.startsWith('# ')) {
        y += 5;
        addText(section.replace('# ', ''), 16, true);
        y += 2;
      } else if (section.startsWith('## ')) {
        y += 4;
        addText(section.replace('## ', ''), 14, true);
        y += 2;
      } else if (section.startsWith('### ')) {
        y += 3;
        addText(section.replace('### ', ''), 12, true);
        y += 1;
      } else if (section.trim()) {
        addText(section, 10, false);
      } else {
        y += 5;
      }
    });

    doc.save('paid_search_audit_report.pdf');
  };

  const reset = () => {
    setState({
      step: AnalysisStep.KEYWORD_UPLOAD,
      keywordData: null,
      cleanedCSV: null,
      keywordAnalysis: null,
      adCopy: null,
      landingPage: null,
      finalReport: null,
      isProcessing: false,
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
      <div className="no-print">
        <Header onReset={reset} />
      </div>
      
      <main className="mt-8 space-y-8">
        <div className="no-print">
          <StepIndicator currentStep={state.step} />
        </div>

        {/* Global Context Banner */}
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3 items-start shadow-sm no-print">
          <svg className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-amber-800">
            <p className="font-semibold mb-1">Analyst Constraints Check:</p>
            <ul className="list-disc ml-4 space-y-1 opacity-90">
              <li>Keywords are <span className="font-bold underline decoration-amber-400">Exact Match only</span>.</li>
              <li>Budget is shared at the <span className="font-bold underline decoration-amber-400">campaign level</span>.</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 transition-all duration-300">
          {state.step === AnalysisStep.KEYWORD_UPLOAD && (
            <div className="space-y-4">
              <div className="prose prose-slate">
                <h2 className="text-2xl font-bold text-slate-800">Step 1: Upload Keyword Data</h2>
                <p className="text-slate-600">
                  Upload your keyword export or paste <span className="italic">scraped data</span> from your ad interface.
                  Gemini will sanitize it into a structured CSV for your approval.
                </p>
              </div>
              <FileUploader 
                onUpload={handleKeywordUpload} 
                isProcessing={state.isProcessing}
                placeholder="Paste messy/scraped data here (e.g. from an ad platform dashboard)..." 
              />
            </div>
          )}

          {state.step === AnalysisStep.DATA_CLEANUP && (
            <div className="space-y-6">
              <div className="prose prose-slate">
                <h2 className="text-2xl font-bold text-slate-800">Review & Approve CSV Structure</h2>
                <p className="text-slate-600">
                  Gemini has processed your input. Please review the structured data before we proceed with the performance analysis.
                </p>
              </div>
              
              <div className="bg-slate-900 rounded-xl p-6 overflow-hidden">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Structured CSV Preview</span>
                </div>
                <div className="max-h-64 overflow-auto scrollbar-thin scrollbar-thumb-slate-700">
                  <pre className="text-sm font-mono text-emerald-400 whitespace-pre">
                    {state.cleanedCSV}
                  </pre>
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-end gap-4 no-print">
                <button 
                  onClick={reset}
                  className="px-6 py-3 border border-slate-200 text-slate-600 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
                >
                  Edit Input Data
                </button>
                <button 
                  onClick={approveAndAnalyze}
                  disabled={state.isProcessing}
                  className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center gap-2"
                >
                  {state.isProcessing ? (
                     <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                     </svg>
                  ) : 'Approve & Analyze →'}
                </button>
              </div>
            </div>
          )}

          {state.step === AnalysisStep.KEYWORD_ANALYSIS && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-800">Step 2: Keyword Performance Audit</h2>
              <AnalysisDisplay content={state.keywordAnalysis || ""} />
              <div className="flex justify-end pt-4 no-print">
                <button 
                  onClick={proceedToAdCopy}
                  className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200"
                >
                  Proceed to Ad Copy Audit →
                </button>
              </div>
            </div>
          )}

          {state.step === AnalysisStep.AD_COPY_REQUEST && (
            <div className="space-y-4">
              <div className="prose prose-slate">
                <h2 className="text-2xl font-bold text-slate-800">Step 3: Current Ad Copy Audit</h2>
                <p className="text-slate-600">
                  Provide the headlines and descriptions currently running in this ad group.
                </p>
              </div>
              <FileUploader 
                onUpload={handleAdCopyUpload} 
                isProcessing={false}
                label="Ad Copy Content"
                placeholder="Headlines: \n - Headline 1... \n Descriptions: \n - Description 1..." 
              />
            </div>
          )}

          {state.step === AnalysisStep.LANDING_PAGE_REQUEST && (
            <div className="space-y-4">
              <div className="prose prose-slate">
                <h2 className="text-2xl font-bold text-slate-800">Step 4: Landing Page Consistency</h2>
                <p className="text-slate-600">
                  Paste the product description from your landing page to analyze search-to-page alignment.
                </p>
              </div>
              <FileUploader 
                onUpload={handleLandingPageUpload} 
                isProcessing={state.isProcessing}
                label="Landing Page Product Description"
                placeholder="Paste the primary landing page content here..." 
              />
            </div>
          )}

          {state.step === AnalysisStep.FINAL_DEEP_DIVE && (
            <div className="space-y-6">
              <div className="flex items-center justify-between no-print">
                <h2 className="text-2xl font-bold text-slate-800">Step 5: Full-Funnel Optimization Plan</h2>
                <button 
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold text-sm hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-100"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download PDF Report
                </button>
              </div>
              <AnalysisDisplay content={state.finalReport || ""} />
              <div className="flex justify-center border-t pt-8 no-print">
                <button 
                  onClick={reset}
                  className="px-8 py-3 border-2 border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-colors"
                >
                  Start New Audit
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="mt-12 text-center text-slate-400 text-sm pb-8 no-print">
        Paid Search Performance Analyst AI &bull; Built with Gemini 3 Pro
      </footer>
    </div>
  );
};

export default App;
