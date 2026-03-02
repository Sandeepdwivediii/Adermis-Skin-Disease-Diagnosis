'use client';

import React, { createContext, useContext, useState } from 'react';

export interface SkinConcernInput {
  image: File | null;
  imagePreview: string | null;
}

export interface AnalysisPrediction {
  condition: string;
  confidence: number;
}

export interface AnalysisResult {
  predictions: AnalysisPrediction[];
  top_condition: string;
  description: string;
  severity: string;
  recommendations: string[];
  disclaimer: string;
  follow_up_questions: string[];
  scan_id: string;
  [key: string]: any; // allow extra fields from backend
}

interface SkinAnalysisContextType {
  input: SkinConcernInput;
  setInput: React.Dispatch<React.SetStateAction<SkinConcernInput>>;
  result: AnalysisResult | null;
  setResult: React.Dispatch<React.SetStateAction<AnalysisResult | null>>;
  analyzing: boolean;
  setAnalyzing: React.Dispatch<React.SetStateAction<boolean>>;
}

const SkinAnalysisContext = createContext<SkinAnalysisContextType | undefined>(undefined);

export function SkinAnalysisProvider({ children }: { children: React.ReactNode }) {
  const [input, setInput] = useState<SkinConcernInput>({ image: null, imagePreview: null });
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  return (
    <SkinAnalysisContext.Provider value={{ input, setInput, result, setResult, analyzing, setAnalyzing }}>
      {children}
    </SkinAnalysisContext.Provider>
  );
}

export function useSkinAnalysis() {
  const context = useContext(SkinAnalysisContext);
  if (!context) throw new Error('useSkinAnalysis must be used within SkinAnalysisProvider');
  return context;
}
