import React from 'react';
import { MessageSquare, Sparkles, Loader2 } from 'lucide-react';
import { HistoricalMove } from '@/types/chess';

interface AiCoachPanelProps {
  lastMove: HistoricalMove | null;
  explanation: string | null;
  isLoading: boolean;
  onExplainRequest: () => void;
}

export default function AiCoachPanel({ lastMove, explanation, isLoading, onExplainRequest }: AiCoachPanelProps) {
  return (
    <div className="bg-[#1c1c1e] p-6 rounded-md border border-neutral-800 flex flex-col min-h-[180px]">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
        <span className="text-xs font-semibold tracking-widest text-neutral-400 uppercase flex items-center gap-2">
          <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
          Groq AI Coach
        </span>
        
        {/* Only show the button if there is a move to explain and we aren't already loading */}
        {lastMove && !isLoading && (
          <button 
            onClick={onExplainRequest}
            className="text-[10px] bg-sky-500/10 text-sky-400 px-2.5 py-1 rounded-sm tracking-wider uppercase border border-sky-500/20 hover:bg-sky-500/20 transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3 h-3" />
            Explain Last Move
          </button>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-center">
        {!lastMove ? (
          <p className="text-neutral-600 italic text-center font-mono text-xs">Waiting for a move to analyze...</p>
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center space-y-3 text-sky-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-[10px] tracking-widest uppercase font-mono text-neutral-500">Consulting LLaMA 3...</span>
          </div>
        ) : explanation ? (
          <div className="text-sm text-neutral-300 leading-relaxed font-light border-l-2 border-sky-500/30 pl-4 py-1">
            {explanation}
          </div>
        ) : (
          <p className="text-neutral-500 text-sm font-light text-center">
            You played <span className="text-white font-mono">{lastMove.san}</span>. Click the button above for a strategic breakdown.
          </p>
        )}
      </div>
    </div>
  );
}