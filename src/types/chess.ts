import React from 'react';
import { 
  Sparkles, Star, ThumbsUp, HelpCircle, AlertCircle, XCircle 
} from 'lucide-react';

export interface MoveClassification {
  id: string;
  colorClass: string;
  isSignificant: boolean;
}

export interface HistoricalMove {
  san: string;
  from: string;
  to: string;
  color: 'w' | 'b';
  evaluation: string;
  classification: MoveClassification;
}

export const MoveIconMap: Record<string, React.ReactNode> = {
  great: React.createElement(Sparkles, { className: "w-3.5 h-3.5" }),
  best: React.createElement(Star, { className: "w-3.5 h-3.5" }),
  excellent: React.createElement(ThumbsUp, { className: "w-3.5 h-3.5" }),
  inaccuracy: React.createElement(HelpCircle, { className: "w-3.5 h-3.5" }),
  mistake: React.createElement(AlertCircle, { className: "w-3.5 h-3.5" }),
  blunder: React.createElement(XCircle, { className: "w-3.5 h-3.5" }),
  standard: null,
};