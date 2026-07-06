// Define types for our callbacks to ensure TypeScript safety
type EvalCallback = (line: string) => void;
type BestMoveCallback = (move: string) => void;

export class ChessEngine {
  private stockfish: Worker | null = null;
  private isReady: boolean = false;
  private onEvalCallback: EvalCallback | null = null;
  private onBestMoveCallback: BestMoveCallback | null = null;

  /**
   * Initializes the Stockfish Web Worker in the browser context.
   * Safe to call multiple times; it will enforce a singleton pattern.
   */
  public init(): void {
    // Web Workers only exist in the client browser, not during Next.js SSR server rendering
    if (typeof window === 'undefined' || this.stockfish) return;

    try {
      // Point directly to the renamed file in your public/ folder
      this.stockfish = new Worker('/stockfish.js');

      this.stockfish.onmessage = (event: MessageEvent) => {
        const line: string = event.data;

        // Stockfish flags readiness with this exact string string
        if (line === 'readyok') {
          this.isReady = true;
          console.log('Stockfish Engine loaded and ready.');
        }

        // Parse evaluation metrics
        if (this.onEvalCallback && line.includes('info depth') && line.includes('score')) {
          this.onEvalCallback(line);
        }

        // Parse final suggested best move
        if (this.onBestMoveCallback && line.includes('bestmove')) {
          const components = line.split(' ');
          if (components[1]) {
            this.onBestMoveCallback(components[1]);
          }
        }
      };

      // Set up Universal Chess Interface (UCI) state
      this.stockfish.postMessage('uci');
      this.stockfish.postMessage('setoption name Hash value 32'); // Allocates 32MB RAM allocation
      this.stockfish.postMessage('isready');
    } catch (error) {
      console.error('Failed to initialize the Stockfish Worker:', error);
    }
  }

  /**
   * Starts non-blocking analysis on an active chess position string.
   */
  public evaluatePosition(
    fen: string,
    depth: number = 12,
    onEval: EvalCallback,
    onBestMove: BestMoveCallback
  ): void {
    if (!this.isReady || !this.stockfish) {
      console.warn('Engine calculation requested before engine was ready.');
      return;
    }

    this.onEvalCallback = onEval;
    this.onBestMoveCallback = onBestMove;

    this.stockfish.postMessage('ucinewgame');
    this.stockfish.postMessage(`position fen ${fen}`);
    this.stockfish.postMessage(`go depth ${depth}`);
  }

  /**
   * Instructs the engine to instantly halt ongoing engine searches.
   */
  public stop(): void {
    if (this.stockfish) {
      this.stockfish.postMessage('stop');
    }
  }
}

export const engineInstance = new ChessEngine();