export class ChessEngine {
  constructor() {
    this.stockfish = null;
    this.isReady = false;
    this.callbacks = {};
  }

  init() {
    if (typeof window !== 'undefined' && !this.stockfish) {
      // This will now correctly load /public/stockfish.js from the browser
      this.stockfish = new Worker('/stockfish.js');
      
      this.stockfish.onmessage = (event) => {
        const line = event.data;
        
        if (line === 'readyok') {
          this.isReady = true;
          console.log('Stockfish engine initialized successfully.');
        }

        if (typeof this.callbacks.onEval === 'function') {
          if (line.includes('info depth') && line.includes('score')) {
            this.callbacks.onEval(line);
          }
        }
        
        if (line.includes('bestmove')) {
          if (typeof this.callbacks.onBestMove === 'function') {
            this.callbacks.onBestMove(line.split(' ')[1]);
          }
        }
      };

      this.stockfish.postMessage('uci');
      // We removed the "Threads" option because we are using the single-threaded build
      this.stockfish.postMessage('setoption name Hash value 32');
      this.stockfish.postMessage('isready');
    }
  }

  evaluatePosition(fen, depth = 12, onEval, onBestMove) {
    if (!this.isReady) {
      console.warn('Engine not ready yet.');
      return;
    }
    
    this.callbacks.onEval = onEval;
    this.callbacks.onBestMove = onBestMove;

    this.stockfish.postMessage('ucinewgame');
    this.stockfish.postMessage(`position fen ${fen}`);
    // Using depth 12 for fast browser-side calculations
    this.stockfish.postMessage(`go depth ${depth}`);
  }

  stop() {
    if (this.stockfish) {
      this.stockfish.postMessage('stop');
    }
  }
}

export const engineInstance = new ChessEngine();