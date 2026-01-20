
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_PROMPT_ANALYST = `You are a world-class Paid Search Performance Analyst.
Your goal is to provide deep insights into PPC campaigns, identifying efficiency and growth opportunities.

CRITICAL CONSTRAINTS TO ACKNOWLEDGE IN FEEDBACK:
1. MATCH TYPES: Only 'Exact Match' is used. No other match types are available for optimization.
2. BUDGET CONTROL: Budget is controlled exclusively at the campaign level. 
3. CAMPAIGN STRUCTURE: Campaigns often contain multiple ad groups, meaning budget is shared. Recommendations must consider that shifts in one ad group impact the availability of funds for others in the same campaign.

Benchmarks: Average CTR: 4%, Average Conversion Rate (CVR): 5%.
Always respect budget constraints.
Provide clear, structured categorization: High-performing, Average-performing, and Underperforming keywords.
Always explain the "Why" behind your categorizations based on the metrics.`;

export const cleanupScrapedData = async (rawInput: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `The following text is potentially messy or scraped keyword data from a PPC interface. 
      Please extract and convert it into a valid, comprehensive CSV format.
      
      CORE COLUMNS: Keyword, Impressions, Clicks, CTR, Conversions, CVR, CPC, Cost.
      EXTENDED COLUMNS: You MUST also include any other relevant data present in the input, such as Revenue, Profit, ROAS, Impression Share, or any other performance metrics found. 
      
      INSTRUCTIONS:
      1. If core columns are missing but can be calculated (e.g., Cost = Clicks * CPC), please calculate them.
      2. DO NOT exclude any data columns that were present in the original input. 
      3. If a value is missing, use "0" or "N/A".
      
      DATA:
      ${rawInput}
      
      OUTPUT: Return ONLY the raw CSV content. No markdown code blocks, no preamble.`,
      config: {
        systemInstruction: "You are a data formatting specialist. Your output is always strictly raw CSV text representing all provided data in a structured way.",
      },
    });

    return response.text.trim();
  } catch (error) {
    console.error("Gemini Error (cleanupScrapedData):", error);
    throw error;
  }
};

export const analyzeKeywords = async (keywordData: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Perform Step 1: Keyword Performance Analysis.
      
      DATA:
      ${keywordData}
      
      INSTRUCTIONS:
      1. Analyze the uploaded data for metrics like Impressions, CTR, Clicks, Conversions, CVR, Cost, and CPC, plus any available Revenue or Profit data.
      2. Categorize into High, Average, and Underperforming keywords using the benchmarks (4% CTR, 5% CVR).
      3. Factor in budget efficiency and overall ROI.
      4. NOTE THE CONSTRAINTS: Explicitly mention that these keywords are treated as Exact Match only and that budget adjustments are limited by campaign-level controls.
      5. Summarize clearly.
      
      Format as clean markdown.`,
      config: {
        systemInstruction: SYSTEM_PROMPT_ANALYST,
        thinkingConfig: { thinkingBudget: 2000 }
      },
    });

    return response.text || "Analysis failed to generate.";
  } catch (error) {
    console.error("Gemini Error (analyzeKeywords):", error);
    throw error;
  }
};

export const conductDeepDive = async ({ 
  keywords, 
  adCopy, 
  landingPage 
}: { 
  keywords: string; 
  adCopy: string; 
  landingPage: string;
}): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Perform Step 4 (Holistic Performance Deep Dive) and Step 5 (Optimization Recommendations).
      
      KEYWORD DATA ANALYSIS:
      ${keywords}
      
      AD COPY:
      ${adCopy}
      
      LANDING PAGE CONTENT:
      ${landingPage}
      
      INSTRUCTIONS:
      1. CONDUCT FULL-FUNNEL ANALYSIS: Search Intent -> Keywords -> Ad Messaging -> Landing Page content alignment.
      2. Identify profitable conversions vs wasteful spend.
      3. IDENTIFY GAPS: Where does the messaging fail to match the user intent?
      4. RECOMMENDATIONS:
         - Keyword Actions (Pause/Delete, Lower/Increase Bids, Priority ROI focus).
         - Ad Copy: Improvement tips + 1 revised draft optimized for high-performing keywords.
         - Landing Page: Messaging improvements + 1 revised product description (MAX 90 WORDS).
      5. STRATEGIC CONTEXT: In your feedback, explicitly note that because all keywords are Exact Match, performance depends entirely on the specific intent of these terms. Also, acknowledge that budget control is at the campaign level (potentially shared with other ad groups), so bid adjustments must be strategic.
      6. SUMMARY: 1-paragraph overall performance summary including a score from 1-10.
      
      Formatting: Use clear headings and bullet points.`,
      config: {
        systemInstruction: SYSTEM_PROMPT_ANALYST,
        thinkingConfig: { thinkingBudget: 4000 }
      },
    });

    return response.text || "Final report failed to generate.";
  } catch (error) {
    console.error("Gemini Error (conductDeepDive):", error);
    throw error;
  }
};
