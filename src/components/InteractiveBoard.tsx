import React from 'react';
import { Chessboard } from 'react-chessboard';
import { Square } from 'chess.js';
import { HistoricalMove, MoveIconMap } from '@/types/chess';

interface InteractiveBoardProps {
  gamePosition: string;
  onPieceDrop: (sourceSquare: string, targetSquare: string) => boolean;
  onSquareClick: (square: Square) => void;
  optionSquares: Record<string, React.CSSProperties>;
  lastMove: HistoricalMove | null;
}

export default function InteractiveBoard({ 
  gamePosition, 
  onPieceDrop, 
  onSquareClick, 
  optionSquares, 
  lastMove 
}: InteractiveBoardProps) {
  
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  return (
    <div className="lg:col-span-7 bg-[#1c1c1e] p-6 rounded-md border border-neutral-800 shadow-2xl flex justify-center items-center relative">
      <div className="w-full max-w-[520px] aspect-square rounded-sm overflow-hidden border border-neutral-950 shadow-inner relative">
        <Chessboard 
          position={gamePosition} 
          onPieceDrop={onPieceDrop}
          onSquareClick={onSquareClick}
          customSquareStyles={optionSquares}
          boardOrientation="white"
          customDarkSquareStyle={{ backgroundColor: '#2b2b2e' }}
          customLightSquareStyle={{ backgroundColor: '#e2e2e6' }}
        />
        
        {/* Transparent Overlay Grid for Badges */}
        <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 pointer-events-none">
          {ranks.map((rank) => (
            files.map((file) => {
              const squareName = `${file}${rank}`;
              const isTargetSquare = lastMove?.to === squareName;
              const showBadge = isTargetSquare && lastMove?.classification.isSignificant;
              
              return (
                <div key={squareName} className="relative w-full h-full">
                  {showBadge && (
                    <div className={`absolute -top-2 -right-2 z-50 p-1 rounded-full bg-[#1c1c1e] border border-neutral-800 shadow-xl ${lastMove.classification.colorClass}`}>
                      {MoveIconMap[lastMove.classification.id]}
                    </div>
                  )}
                </div>
              );
            })
          ))}
        </div>
      </div>
    </div>
  );
}