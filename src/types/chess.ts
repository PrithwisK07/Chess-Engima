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

// Updated with punchier, neon-like colors for dark mode
export const MoveIconMap: Record<string, React.ReactNode> = {
  great: React.createElement(Sparkles, { className: "w-4 h-4 text-cyan-400" }),
  best: React.createElement(Star, { className: "w-4 h-4 text-green-400" }),
  excellent: React.createElement(ThumbsUp, { className: "w-4 h-4 text-emerald-500" }),
  inaccuracy: React.createElement(HelpCircle, { className: "w-4 h-4 text-yellow-400" }),
  mistake: React.createElement(AlertCircle, { className: "w-4 h-4 text-orange-400" }),
  blunder: React.createElement(XCircle, { className: "w-4 h-4 text-red-500" }),
  standard: null,
};