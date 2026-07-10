export const cleanupScrapedData = async (rawInput: string): Promise<string> => {
  try {
    const response = await fetch("/api/gemini/cleanup-scraped-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rawInput }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || "Failed to cleanup scraped data");
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error("Client Error (cleanupScrapedData):", error);
    throw error;
  }
};

export const analyzeKeywords = async (keywordData: string): Promise<string> => {
  try {
    const response = await fetch("/api/gemini/analyze-keywords", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ keywordData }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || "Failed to analyze keywords");
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error("Client Error (analyzeKeywords):", error);
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
    const response = await fetch("/api/gemini/conduct-deep-dive", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ keywords, adCopy, landingPage }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || "Failed to conduct deep dive");
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error("Client Error (conductDeepDive):", error);
    throw error;
  }
};
