
export enum AnalysisStep {
  KEYWORD_UPLOAD = 1,
  DATA_CLEANUP = 1.5,
  KEYWORD_ANALYSIS = 2,
  AD_COPY_REQUEST = 3,
  LANDING_PAGE_REQUEST = 4,
  FINAL_DEEP_DIVE = 5
}

export interface KeywordData {
  Keyword: string;
  Impressions: number;
  Clicks: number;
  CTR: number;
  Conversions: number;
  CVR: number;
  CPC: number;
  Cost: number;
  Revenue?: number;
  Profit?: number;
}

export interface AdCopyData {
  headlines: string[];
  descriptions: string[];
}

export interface AnalysisState {
  step: AnalysisStep;
  keywordData: string | null;
  cleanedCSV: string | null;
  keywordAnalysis: string | null;
  adCopy: string | null;
  landingPage: string | null;
  finalReport: string | null;
  isProcessing: boolean;
}
