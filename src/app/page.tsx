'use client';

import React, { useState, useEffect } from 'react';
import { Chess, Square } from 'chess.js';
import { engineInstance } from '@/lib/chessEngine';
import { RotateCcw } from 'lucide-react';

// Import our new modules
import { HistoricalMove } from '@/types/chess';
import InteractiveBoard from '@/components/InteractiveBoard';
import LiveMetrics from '@/components/LiveMetrics';
import NotationMatrix from '@/components/NotationMatrix';

export default function Home() {
  const [game, setGame] = useState<Chess>(new Chess());
  const [gamePosition, setGamePosition] = useState<string>(game.fen());
  
  const [currentEval, setCurrentEval] = useState<string>('0.00');
  const [bestMove, setBestMove] = useState<string>('-');
  const [isEngineThinking, setIsEngineThinking] = useState<boolean>(false);
  
  const [detailedHistory, setDetailedHistory] = useState<HistoricalMove[]>([]);
  const [lastEvalScore, setLastEvalScore] = useState<number>(0.00);

  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [optionSquares, setOptionSquares] = useState<Record<string, React.CSSProperties>>({});

  useEffect(() => {
    engineInstance.init();
  }, []);

  const classifyMoveQuality = (currentScore: number, previousScore: number, turn: 'w' | 'b') => {
    const delta = turn === 'w' ? (currentScore - previousScore) : (previousScore - currentScore);

    if (delta >= 0.2) return { id: 'great', colorClass: 'text-sky-400 bg-sky-500/10', isSignificant: true };
    if (delta >= -0.2) return { id: 'best', colorClass: 'text-emerald-400 bg-emerald-500/10', isSignificant: true };
    if (delta >= -0.5) return { id: 'excellent', colorClass: 'text-green-500 bg-green-500/10', isSignificant: true };
    if (delta >= -0.9) return { id: 'inaccuracy', colorClass: 'text-yellow-500 bg-yellow-500/10', isSignificant: true };
    if (delta >= -1.9) return { id: 'mistake', colorClass: 'text-orange-500 bg-orange-500/10', isSignificant: true };
    if (delta < -1.9) return { id: 'blunder', colorClass: 'text-rose-500 bg-rose-500/10', isSignificant: true };
    
    return { id: 'standard', colorClass: 'text-neutral-500', isSignificant: false };
  };

  const analyzeCurrentPosition = (fenString: string, lastAppliedMove: any) => {
    setIsEngineThinking(true);
    engineInstance.evaluatePosition(
      fenString,
      12,
      (rawEvalLine) => {
        if (rawEvalLine.includes('score cp')) {
          const parts = rawEvalLine.split(' ');
          const scoreIndex = parts.indexOf('cp');
          if (scoreIndex !== -1 && parts[scoreIndex + 1]) {
            const rawScore = parseInt(parts[scoreIndex + 1]) / 100;
            const formattedScore = game.turn() === 'w' ? rawScore.toFixed(2) : `-${rawScore.toFixed(2)}`;
            setCurrentEval(formattedScore);

            if (rawEvalLine.includes('nodes') && lastAppliedMove) {
              const quality = classifyMoveQuality(rawScore, lastEvalScore, lastAppliedMove.color);
              setLastEvalScore(rawScore);
              
              setDetailedHistory((prev) => {
                if (prev.length > 0 && prev[prev.length - 1].san === lastAppliedMove.san && prev[prev.length - 1].color === lastAppliedMove.color) {
                  return prev;
                }
                return [
                  ...prev,
                  {
                    san: lastAppliedMove.san,
                    from: lastAppliedMove.from,
                    to: lastAppliedMove.to,
                    color: lastAppliedMove.color,
                    evaluation: formattedScore,
                    classification: quality,
                  },
                ];
              });
            }
          }
        }
      },
      (suggestedMove) => {
        setBestMove(suggestedMove);
        setIsEngineThinking(false);
      }
    );
  };

  const getMoveOptions = (square: Square) => {
    const moves = game.moves({ square, verbose: true });
    if (moves.length === 0) {
      setOptionSquares({});
      return false;
    }

    const newSquares: Record<string, React.CSSProperties> = {};
    moves.forEach((move) => {
      const isCapture = game.get(move.to as Square) !== null || (move.flags && move.flags.includes('e'));
      newSquares[move.to] = {
        background: isCapture
          ? 'radial-gradient(circle, transparent 35%, rgba(0,0,0,0.3) 36%, rgba(0,0,0,0.3) 45%, transparent 46%)'
          : 'radial-gradient(circle, rgba(0,0,0,0.25) 20%, transparent 21%)',
      };
    });

    newSquares[square] = { background: 'rgba(255, 255, 255, 0.15)' };
    setOptionSquares(newSquares);
    return true;
  };

  function onSquareClick(square: Square) {
    if (!selectedSquare) {
      const hasMoves = getMoveOptions(square);
      if (hasMoves) setSelectedSquare(square);
    } else {
      if (selectedSquare === square) {
        setSelectedSquare(null);
        setOptionSquares({});
        return;
      }
      const moveSuccess = makeAMove({ from: selectedSquare, to: square, promotion: 'q' });
      if (!moveSuccess) {
        const hasMoves = getMoveOptions(square);
        if (hasMoves) {
          setSelectedSquare(square);
        } else {
          setSelectedSquare(null);
          setOptionSquares({});
        }
      } else {
        setSelectedSquare(null);
        setOptionSquares({});
      }
    }
  }

  function makeAMove(moveObj: any) {
    try {
      const newGame = new Chess(game.fen());
      const result = newGame.move(moveObj);
      if (result) {
        setGame(newGame);
        setGamePosition(newGame.fen());
        analyzeCurrentPosition(newGame.fen(), result);
        return true;
      }
    } catch (error) {
      return false;
    }
    return false;
  }

  function onDrop(sourceSquare: string, targetSquare: string) {
    const move = makeAMove({ from: sourceSquare, to: targetSquare, promotion: 'q' });
    if (move) {
      setSelectedSquare(null);
      setOptionSquares({});
    }
    return move;
  }

  function resetGame() {
    engineInstance.stop();
    const freshGame = new Chess();
    setGame(freshGame);
    setGamePosition(freshGame.fen());
    setDetailedHistory([]);
    setOptionSquares({});
    setSelectedSquare(null);
    setCurrentEval('0.00');
    setLastEvalScore(0.00);
    setBestMove('-');
    setIsEngineThinking(false);
  }

  return (
    <main className="min-h-screen bg-[#121212] text-[#f5f5f7] p-6 md:p-12 flex flex-col items-center justify-center font-sans antialiased">
      <header className="w-full max-w-6xl mb-12 flex flex-col md:flex-row items-start md:items-center justify-between border-b border-neutral-800 pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-light tracking-tight uppercase">Nexus Chess Studio</h1>
          <p className="text-neutral-500 text-sm mt-1 tracking-wide">AI-Driven Game Forensic Layer</p>
        </div>
        <button 
          onClick={resetGame}
          className="mt-4 md:mt-0 px-4 py-2 bg-neutral-900 border border-neutral-800 text-xs font-medium tracking-widest uppercase hover:bg-neutral-800 transition-colors flex items-center gap-2 rounded-sm"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Position
        </button>
      </header>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <InteractiveBoard 
          gamePosition={gamePosition}
          onPieceDrop={onDrop}
          onSquareClick={onSquareClick}
          optionSquares={optionSquares}
          lastMove={detailedHistory.length > 0 ? detailedHistory[detailedHistory.length - 1] : null}
        />
        
        <div className="lg:col-span-5 grid grid-cols-1 gap-6">
          <LiveMetrics 
            currentEval={currentEval}
            bestMove={bestMove}
            isEngineThinking={isEngineThinking}
          />
          <NotationMatrix detailedHistory={detailedHistory} />
        </div>
      </div>
    </main>
  );
}