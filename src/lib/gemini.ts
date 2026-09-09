import { GoogleGenAI } from '@google/genai';

export function getResolvedGeminiKey(userProvidedKey?: string): string | null {
  if (userProvidedKey && userProvidedKey.trim()) {
    return userProvidedKey.trim();
  }
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('zeroprep_gemini_key') || localStorage.getItem('parakeet_gemini_key');
      if (stored && stored.trim()) {
        return stored.trim();
      }
    } catch {}
  }
  if (process.env.NEXT_PUBLIC_GEMINI_API_KEY && process.env.NEXT_PUBLIC_GEMINI_API_KEY.trim()) {
    return process.env.NEXT_PUBLIC_GEMINI_API_KEY.trim();
  }
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim()) {
    return process.env.GEMINI_API_KEY.trim();
  }
  return null;
}

export function getGeminiClient(userProvidedKey?: string) {
  const apiKey = getResolvedGeminiKey(userProvidedKey);
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY_MISSING');
  }
  return new GoogleGenAI({ apiKey });
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  image?: string;
}

export async function askGemini(
  query: string,
  base64Image?: string,
  apiKey?: string,
  modelName: string = process.env.NEXT_PUBLIC_GEMINI_MODEL || 'gemini-3.5-flash-lite',
  onChunk?: (streamedText: string) => void
): Promise<string> {
  const resolvedKey = getResolvedGeminiKey(apiKey);

  if (!resolvedKey) {
    throw new Error('Please configure your Gemini API Key in HUD Settings.');
  }

  const ai = new GoogleGenAI({ apiKey: resolvedKey });
  // Fast low-latency candidate models
  const candidateModels = [
    modelName,
    'gemini-3.5-flash-lite',
    'gemini-3.5-flash',
    'gemini-3.6-flash'
  ].filter((m, idx, arr) => Boolean(m) && arr.indexOf(m) === idx);

  let lastErr: any = null;

  for (const mod of candidateModels) {
    try {
      const contents: any[] = [];

      if (base64Image) {
        let cleanData = base64Image;
        let mimeType = 'image/png';
        if (base64Image.includes(';base64,')) {
          const parts = base64Image.split(';base64,');
          mimeType = parts[0].replace('data:', '') || 'image/png';
          cleanData = parts[1];
        }
        contents.push({ inlineData: { mimeType, data: cleanData } });
      }

      contents.push({
        text: query
      });

      // Try fast streaming first for instant time-to-first-token
      try {
        const streamResponse = await ai.models.generateContentStream({
          model: mod,
          contents,
          config: {
            systemInstruction: 'You are an ultra-fast, expert AI technical copilot for live interviews and coding. Provide direct, highly accurate, and concise answers. If asked for code, provide clean, optimal code with time/space complexity. Avoid filler phrases and get straight to the solution.',
            maxOutputTokens: 1500,
            temperature: 0.2
          }
        });

        let accumulated = '';
        for await (const chunk of streamResponse) {
          const textChunk = chunk.text || '';
          accumulated += textChunk;
          if (onChunk && accumulated) {
            onChunk(accumulated);
          }
        }

        if (accumulated.trim()) {
          return accumulated.trim();
        }
      } catch (streamErr: any) {
        // Fallback to standard generateContent if stream fails
        console.warn(`[ZeroPrep] Stream failed for ${mod}, attempting non-stream:`, streamErr?.message || streamErr);
        const response = await ai.models.generateContent({
          model: mod,
          contents,
          config: {
            systemInstruction: 'You are an ultra-fast, expert AI technical copilot. Provide direct, accurate, and concise answers.',
            maxOutputTokens: 1500,
            temperature: 0.2
          }
        });

        const text = response.text || '';
        if (text.trim()) {
          if (onChunk) onChunk(text.trim());
          return text.trim();
        }
      }
    } catch (err: any) {
      lastErr = err;
      console.warn(`[ZeroPrep] Model ${mod} failed, trying next fallback:`, err?.message || err);
    }
  }

  throw lastErr || new Error('Failed to generate response. Please verify your Gemini API key.');
}

export interface AnalysisResult {
  rawText: string;
  bugError?: string;
  optimalApproach?: string;
  correctCode?: string;
  language?: string;
}

export async function analyzeScreenAndCode(
  base64Image: string,
  transcriptContext: string,
  apiKey?: string,
  modelName: string = process.env.NEXT_PUBLIC_GEMINI_MODEL || 'gemini-3.5-flash'
): Promise<AnalysisResult> {
  const text = await askGemini(
    `Analyze this screen and provide optimal solution / answers: ${transcriptContext}`,
    base64Image,
    apiKey,
    modelName
  );
  return {
    rawText: text,
    optimalApproach: text,
    bugError: text.includes('error') || text.includes('bug') ? text.slice(0, 120) : undefined
  };
}
