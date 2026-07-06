import React from 'react';
import { Cpu } from 'lucide-react';
import { HistoricalMove, MoveIconMap } from '@/types/chess';

interface NotationMatrixProps {
  detailedHistory: HistoricalMove[];
}

export default function NotationMatrix({ detailedHistory }: NotationMatrixProps) {
  // Pair white and black moves
  const pairedTurns = detailedHistory.reduce((acc: any[], move, index) => {
    if (index % 2 === 0) {
      acc.push({ white: move, black: null });
    } else {
      acc[acc.length - 1].black = move;
    }
    return acc;
  }, []);

  return (
    <div className="bg-[#1c1c1e] p-6 rounded-md border border-neutral-800 flex flex-col h-[340px]">
      <span className="text-xs font-semibold tracking-widest text-neutral-400 uppercase border-b border-neutral-800 pb-3 mb-4 flex items-center gap-2">
        <Cpu className="w-3.5 h-3.5 text-neutral-500" />
        Sequential Review Matrix
      </span>
      <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
        {pairedTurns.length === 0 ? (
          <div className="text-neutral-600 italic text-center pt-24 font-mono text-xs">Execute legal board maneuvers to generate analytical history logs.</div>
        ) : (
          <div className="space-y-1">
            {pairedTurns.map((turn, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 text-xs font-mono py-1.5 border-b border-neutral-900/50 items-center">
                <div className="col-span-2 text-neutral-600 font-medium">{index + 1}.</div>
                
                {/* White Move */}
                <div className="col-span-5 flex items-center justify-between pr-2 border-r border-neutral-800/60">
                  <span className="text-neutral-200 font-medium">{turn.white.san}</span>
                  {turn.white.classification.isSignificant && (
                    <span className={`p-0.5 rounded-sm ${turn.white.classification.colorClass}`}>
                      {MoveIconMap[turn.white.classification.id]}
                    </span>
                  )}
                </div>
                
                {/* Black Move */}
                <div className="col-span-5 flex items-center justify-between pl-2">
                  {turn.black ? (
                    <>
                      <span className="text-neutral-300">{turn.black.san}</span>
                      {turn.black.classification.isSignificant && (
                        <span className={`p-0.5 rounded-sm ${turn.black.classification.colorClass}`}>
                          {MoveIconMap[turn.black.classification.id]}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-neutral-700">...</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}