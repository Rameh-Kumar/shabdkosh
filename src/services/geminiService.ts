const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Only log whether the API key is available, not its value
console.log('Gemini API Key available:', !!GEMINI_API_KEY);

// Test function to verify API key is working
export const testGeminiApiKey = async (): Promise<boolean> => {
  try {
    if (!GEMINI_API_KEY) {
      console.error('Gemini API key is missing');
      return false;
    }
    
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: 'Hello, please respond with the word "working" if you can see this message.'
          }]
        }]
      })
    });
    
    if (!response.ok) {
      console.error('Gemini API test failed with status:', response.status);
      return false;
    }
    
    console.log('Gemini API connection test successful');
    return true;
  } catch (error) {
    console.error('Gemini API test error:', error);
    return false;
  }
};

interface GeminiResponse {
  candidates?: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
  error?: {
    message: string;
  };
}

export interface MeaningDetail {
  meaning: string;
  example?: string;
  usage?: string;
  register?: string;
  synonyms?: string[];
  antonyms?: string[];
}

export interface DefinitionGroup {
  partOfSpeech: string;
  meanings: MeaningDetail[];
}

export interface ParseResult {
  definitions: DefinitionGroup[];
  examples: string[];
  synonyms: string[];
  antonyms: string[];
  etymology: string;
}

export const getWordDefinition = async (word: string): Promise<string> => {
  const prompt = `
You are a dictionary API. For the word "${word}", respond in this exact format:

DEFINITIONS
• [noun] 1. First noun definition
  - Example: "Example sentence for first noun definition."
  - Usage: formal
  - Register: standard
  - Synonyms: synonym1, synonym2
  - Antonyms: antonym1, antonym2
• [noun] 2. Second noun definition
  - Example: "Example sentence for second noun definition."
  - Usage: informal
  - Register: colloquial
  - Synonyms: synonym3, synonym4
  - Antonyms: antonym3, antonym4
• [verb] 1. First verb definition
  - Example: "Example sentence for first verb definition."
  - Usage: standard
  - Register: formal
  - Synonyms: synonym5, synonym6
  - Antonyms: antonym5, antonym6

EXAMPLES
• "Complete example sentence one."
• "Complete example sentence two."

SYNONYMS
• synonym1, synonym2, synonym3, synonym4, synonym5, synonym6

ANTONYMS
• antonym1, antonym2, antonym3, antonym4, antonym5, antonym6

ETYMOLOGY
Origin: Word origin
Development: Historical development
Current: Current usage

Respond using exactly this format. Each definition must:
1. Start with a bullet point (•)
2. Include part of speech in square brackets
3. Include a numbered definition
4. Include all subfields (Example, Usage, Register, Synonyms, Antonyms)
If any field is not available, write "None" for that field.
Do not add any extra text or skip any sections.`;

  try {
    if (!GEMINI_API_KEY) {
      console.error('Gemini API key is missing. Please check your .env file and ensure VITE_GEMINI_API_KEY is set.');
      throw new Error('Gemini API key is not configured');
    }
    
    console.log(`Fetching definition for word: ${word}`);

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_NONE"
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Gemini API HTTP error:', response.status, errorData);
      throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
    }
    
    console.log('Received response from Gemini API');

    const data: GeminiResponse = await response.json();
    
    if (data.error) {
      console.error('Gemini API error:', data.error);
      throw new Error(data.error.message || 'Failed to get definition from Gemini');
    }

    const definition = data.candidates?.[0]?.content.parts[0].text;
    if (!definition || typeof definition !== 'string') {
      console.error('Invalid Gemini API response format:', data);
      throw new Error('Invalid response format from Gemini API');
    }
    
    console.log('Successfully parsed Gemini response');

    // Verify that the response contains the required sections
    const requiredSections = ['DEFINITIONS', 'EXAMPLES', 'SYNONYMS', 'ANTONYMS', 'ETYMOLOGY'];
    const missingSection = requiredSections.find(section => !definition.includes(section));
    if (missingSection) {
      throw new Error(`Invalid response format: Missing ${missingSection} section`);
    }

    return definition;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
};

export const parseGeminiResponse = (response: string): ParseResult => {
  const lines = response.split('\n');
  const result: ParseResult = {
    definitions: [],
    examples: [],
    synonyms: [],
    antonyms: [],
    etymology: ''
  };
  let currentSection = '';
  let etymologyParts: string[] = [];
  let currentPOS = '';
  let currentMeanings: MeaningDetail[] = [];
  let lastMeaning: MeaningDetail | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Handle section headers
    if (/^DEFINITIONS/i.test(trimmed)) {
      currentSection = 'definitions';
      continue;
    }
    if (/^EXAMPLES/i.test(trimmed)) {
      if (lastMeaning) {
        currentMeanings.push(lastMeaning);
        lastMeaning = null;
      }
      if (currentPOS && currentMeanings.length) {
        result.definitions.push({ partOfSpeech: currentPOS, meanings: currentMeanings });
        currentMeanings = [];
      }
      currentSection = 'examples';
      continue;
    }
    if (/^SYNONYMS/i.test(trimmed)) {
      if (lastMeaning) {
        currentMeanings.push(lastMeaning);
        lastMeaning = null;
      }
      if (currentPOS && currentMeanings.length) {
        result.definitions.push({ partOfSpeech: currentPOS, meanings: currentMeanings });
        currentMeanings = [];
      }
      currentSection = 'synonyms';
      continue;
    }
    if (/^ANTONYMS/i.test(trimmed)) {
      currentSection = 'antonyms';
      continue;
    }
    if (/^ETYMOLOGY/i.test(trimmed)) {
      currentSection = 'etymology';
      continue;
    }

    switch (currentSection) {
      case 'definitions': {
        // Handle main definition lines
        const bulletWithPOS = trimmed.match(/^• \[([^\]]+)\]\s*(\d+)\.\s*(.+)$/);
        if (bulletWithPOS) {
          if (lastMeaning) {
            currentMeanings.push(lastMeaning);
          }
          const [, pos, , meaning] = bulletWithPOS;
          if (currentPOS && currentPOS !== pos && currentMeanings.length) {
            result.definitions.push({ partOfSpeech: currentPOS, meanings: currentMeanings });
            currentMeanings = [];
          }
          currentPOS = pos;
          lastMeaning = { meaning };
          continue;
        }

        // Handle subfields
        if (lastMeaning) {
          const exampleMatch = trimmed.match(/^-\s*Example:\s*"(.+)"$/);
          if (exampleMatch) {
            lastMeaning.example = exampleMatch[1];
            continue;
          }

          const usageMatch = trimmed.match(/^-\s*Usage:\s*(.+)$/);
          if (usageMatch) {
            const usage = usageMatch[1];
            lastMeaning.usage = usage !== 'None' ? usage : undefined;
            continue;
          }

          const registerMatch = trimmed.match(/^-\s*Register:\s*(.+)$/);
          if (registerMatch) {
            const register = registerMatch[1];
            lastMeaning.register = register !== 'None' ? register : undefined;
            continue;
          }

          const synonymsMatch = trimmed.match(/^-\s*Synonyms:\s*(.+)$/);
          if (synonymsMatch) {
            const syns = synonymsMatch[1]
              .split(',')
              .map(s => s.trim())
              .filter(s => s && s !== 'None');
            if (syns.length) lastMeaning.synonyms = syns;
            continue;
          }

          const antonymsMatch = trimmed.match(/^-\s*Antonyms:\s*(.+)$/);
          if (antonymsMatch) {
            const ants = antonymsMatch[1]
              .split(',')
              .map(a => a.trim())
              .filter(a => a && a !== 'None');
            if (ants.length) lastMeaning.antonyms = ants;
            continue;
          }
        }
        break;
      }
      case 'examples': {
        if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
          const example = trimmed
            .replace(/^[•-]\s*/, '')
            .replace(/["']/g, '')
            .trim();
          if (example) result.examples.push(example);
        }
        break;
      }
      case 'synonyms': {
        if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
          const words = trimmed
            .replace(/^[•-]\s*/, '')
            .split(',')
            .map(word => word.trim())
            .filter(word => word && word.length > 1);
          result.synonyms.push(...words);
        }
        break;
      }
      case 'antonyms': {
        if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
          const words = trimmed
            .replace(/^[•-]\s*/, '')
            .split(',')
            .map(word => word.trim())
            .filter(word => word && word.length > 1);
          result.antonyms.push(...words);
        }
        break;
      }
      case 'etymology': {
        etymologyParts.push(trimmed);
        break;
      }
    }
  }

  // Handle any remaining definitions
  if (lastMeaning) {
    currentMeanings.push(lastMeaning);
  }
  if (currentPOS && currentMeanings.length) {
    result.definitions.push({ partOfSpeech: currentPOS, meanings: currentMeanings });
  }

  // Clean up and deduplicate results
  result.definitions = result.definitions.filter(d => d.meanings && d.meanings.length > 0);
  result.examples = [...new Set(result.examples)].filter(e => e && e.length > 1);
  result.synonyms = [...new Set(result.synonyms)].filter(s => s && s.length > 1);
  result.antonyms = [...new Set(result.antonyms)].filter(a => a && a.length > 1);
  result.etymology = etymologyParts.join(' ').trim();

  // Add fallback messages if sections are empty
  if (result.definitions.length === 0) {
    result.definitions.push({
      partOfSpeech: 'unknown',
      meanings: [{ meaning: 'No definition found. Please try another word or check your spelling.' }]
    });
  }
  if (result.examples.length === 0) {
    result.examples.push('No examples available for this word.');
  }
  // Don't add fallback text for synonyms and antonyms when empty
  // This allows the UI to hide these sections completely
  result.synonyms = result.synonyms.filter(s => s.toLowerCase() !== 'none');
  result.antonyms = result.antonyms.filter(a => a.toLowerCase() !== 'none');
  
  // Ensure arrays are empty if they only contained 'none' values
  if (result.synonyms.length === 0) result.synonyms = [];
  if (result.antonyms.length === 0) result.antonyms = [];
  
  if (!result.etymology) {
    result.etymology = 'Etymology information is not available for this word.';
  }

  return result;
}