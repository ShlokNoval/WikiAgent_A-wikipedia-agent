import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// SECURITY-006: Validate API Key
if (!process.env.GEMINI_API_KEY) {
  throw new Error(
    'GEMINI_API_KEY environment variable is not set. ' +
    'Please create a .env.local file with your API key. ' +
    'See .env.example for details.'
  );
}

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash',
});
