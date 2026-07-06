import React from 'react';
import { Activity } from 'lucide-react';

interface LiveMetricsProps {
  currentEval: string;
  bestMove: string;
  isEngineThinking: boolean;
}

export default function LiveMetrics({ currentEval, bestMove, isEngineThinking }: LiveMetricsProps) {
  return (
    <div className="bg-[#1c1c1e] p-6 rounded-md border border-neutral-800 flex flex-col min-h-[140px]">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
        <span className="text-xs font-semibold tracking-widest text-neutral-400 uppercase flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-neutral-500" />
          Live Analysis Engine
        </span>
        {isEngineThinking && (
          <span className="text-[10px] bg-neutral-800 px-2 py-0.5 rounded-sm tracking-wider uppercase border border-neutral-700 animate-pulse text-neutral-300">
            Thinking
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="text-[11px] text-neutral-500 tracking-wider block uppercase">Evaluation Score</span>
          <div className="text-3xl font-mono mt-1 font-light tracking-tight">{currentEval}</div>
        </div>
        <div>
          <span className="text-[11px] text-neutral-500 tracking-wider block uppercase">Engine Line</span>
          <div className="text-3xl font-mono mt-1 font-light tracking-tight text-neutral-400 uppercase">{bestMove}</div>
        </div>
      </div>
    </div>
  );
}