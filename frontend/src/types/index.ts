export type Intent = {
  label: string;
  confidence: number;
  category: string;
  reasoning: string;
};

export type AnalyzeResponse = {
  intents: Intent[];
};



