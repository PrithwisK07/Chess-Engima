import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// Initialize the Groq client. It automatically picks up the GROQ_API_KEY from .env.local
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fen, move, previousEval, currentEval, bestMove } = body;

    // Validate that we received the necessary data
    if (!fen || !move || !currentEval) {
      return NextResponse.json({ error: 'Missing required chess data.' }, { status: 400 });
    }

    // Construct a highly specific prompt to prevent the LLM from hallucinating chess moves.
    // We force it to rely strictly on the Stockfish data we provide.
    const systemPrompt = `
      You are an expert chess coach helping a 1000-rated beginner. 
      You are concise, encouraging, but direct. 
      Never invent chess variations. Only explain the data provided.
      Keep your response to a maximum of 3 short sentences.
    `;

    const userPrompt = `
      The board state (FEN) is: ${fen}
      The user just played: ${move}
      Before this move, the engine evaluation was: ${previousEval}.
      After this move, the evaluation is: ${currentEval}.
      Stockfish says the best move was actually: ${bestMove}.
      
      Explain to the user why their move changed the evaluation, and briefly explain the strategic idea behind Stockfish's suggested best move.
    `;

    // Using LLaMA 3 8B on Groq for blazing fast, cheap text generation
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      model: 'openai/gpt-oss-120b',
    });

    const explanation = chatCompletion.choices[0]?.message?.content || "I couldn't analyze that move.";

    return NextResponse.json({ explanation });

  } catch (error) {
    console.error('Groq API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate explanation from AI coach.' },
      { status: 500 }
    );
  }
}