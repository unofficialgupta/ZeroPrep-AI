import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { analyzeScreenAndCode, getResolvedGeminiKey } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { apiKey, ping, base64Image, transcriptContext, model } = body;

    const resolvedKey = apiKey || getResolvedGeminiKey();

    if (!resolvedKey) {
      return NextResponse.json(
        { error: 'Gemini API key is required.' },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({ apiKey: resolvedKey });

    // 1. Quick test ping validation
    if (ping) {
      const modelToUse = model || process.env.GEMINI_MODEL || 'gemini-2.5-flash';
      const testRes = await ai.models.generateContent({
        model: modelToUse,
        contents: [{ text: 'Ping test. Reply with: PONG' }],
      });

      return NextResponse.json({
        success: true,
        message: 'Gemini API key is valid and connected!',
        model: modelToUse,
        response: testRes.text,
      });
    }

    // 2. Multimodal screen & code analysis
    if (base64Image) {
      const analysis = await analyzeScreenAndCode(
        base64Image,
        transcriptContext || '',
        resolvedKey,
        model || process.env.GEMINI_MODEL || 'gemini-2.5-flash'
      );
      return NextResponse.json({ success: true, analysis });
    }

    return NextResponse.json({ success: true, status: 'ready' });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Gemini API Route Error:', error);
    return NextResponse.json(
      {
        error: error.message || 'Failed to communicate with Gemini API',
        details: String(err)
      },
      { status: 500 }
    );
  }
}
