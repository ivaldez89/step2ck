import { NextRequest, NextResponse } from 'next/server';

// Provider configuration - Groq is FREE, others are paid
type AIProvider = 'groq' | 'anthropic' | 'openai';

interface ProviderConfig {
  name: string;
  apiUrl: string;
  model: string;
  getHeaders: (apiKey: string) => Record<string, string>;
  formatRequest: (prompt: string) => object;
  extractContent: (data: unknown) => string | null;
}

const PROVIDERS: Record<AIProvider, ProviderConfig> = {
  // GROQ - FREE! Uses Llama 3.3 70B
  groq: {
    name: 'Groq (Free)',
    apiUrl: 'https://api.groq.com/openai/v1/chat/completions',
    model: 'llama-3.3-70b-versatile',
    getHeaders: (apiKey) => ({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    }),
    formatRequest: (prompt) => ({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 4096,
      temperature: 0.7,
      messages: [
        {
          role: 'system',
          content: 'You are a medical education expert helping create high-quality flashcards for medical students preparing for USMLE Step 2 CK. Generate clear, accurate, and clinically relevant content.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
    extractContent: (data) => {
      const response = data as { choices?: Array<{ message?: { content?: string } }> };
      return response.choices?.[0]?.message?.content || null;
    },
  },

  // Anthropic - Paid but high quality
  anthropic: {
    name: 'Anthropic Claude',
    apiUrl: 'https://api.anthropic.com/v1/messages',
    model: 'claude-sonnet-4-20250514',
    getHeaders: (apiKey) => ({
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    }),
    formatRequest: (prompt) => ({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
    extractContent: (data) => {
      const response = data as { content?: Array<{ type: string; text?: string }> };
      const textContent = response.content?.find((block) => block.type === 'text');
      return textContent?.text || null;
    },
  },

  // OpenAI - Paid fallback
  openai: {
    name: 'OpenAI GPT-4',
    apiUrl: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4o-mini',
    getHeaders: (apiKey) => ({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    }),
    formatRequest: (prompt) => ({
      model: 'gpt-4o-mini',
      max_tokens: 4096,
      messages: [
        {
          role: 'system',
          content: 'You are a medical education expert helping create high-quality flashcards for medical students preparing for USMLE Step 2 CK.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
    extractContent: (data) => {
      const response = data as { choices?: Array<{ message?: { content?: string } }> };
      return response.choices?.[0]?.message?.content || null;
    },
  },
};

// Determine which provider to use based on available API keys
function getActiveProvider(): { provider: AIProvider; apiKey: string } | null {
  // Priority: Groq (free) > Anthropic > OpenAI
  const groqKey = process.env.GROQ_API_KEY;
  if (groqKey) {
    return { provider: 'groq', apiKey: groqKey };
  }

  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (anthropicKey) {
    return { provider: 'anthropic', apiKey: anthropicKey };
  }

  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey) {
    return { provider: 'openai', apiKey: openaiKey };
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const activeProvider = getActiveProvider();

    if (!activeProvider) {
      return NextResponse.json(
        {
          error: 'No AI provider configured. Add GROQ_API_KEY (free) or ANTHROPIC_API_KEY to your environment variables.',
          hint: 'Get a free Groq API key at https://console.groq.com',
        },
        { status: 500 }
      );
    }

    const { provider, apiKey } = activeProvider;
    const config = PROVIDERS[provider];

    console.log(`Using AI provider: ${config.name}`);

    const response = await fetch(config.apiUrl, {
      method: 'POST',
      headers: config.getHeaders(apiKey),
      body: JSON.stringify(config.formatRequest(prompt)),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`${config.name} API error:`, errorData);

      // If Groq fails (rate limit), try fallback
      if (provider === 'groq') {
        const fallbackKey = process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY;
        if (fallbackKey) {
          console.log('Groq rate limited, trying fallback provider...');
          // Could implement fallback logic here
        }
      }

      return NextResponse.json(
        {
          error: (errorData as { error?: { message?: string } }).error?.message || `Failed to generate cards using ${config.name}`,
          provider: config.name,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    const content = config.extractContent(data);

    if (!content) {
      return NextResponse.json(
        { error: 'No content in response' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      content,
      provider: config.name, // Let frontend know which provider was used
    });
  } catch (error) {
    console.error('Generate API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to check which provider is configured
export async function GET() {
  const activeProvider = getActiveProvider();

  if (!activeProvider) {
    return NextResponse.json({
      configured: false,
      provider: null,
      message: 'No AI provider configured. Add GROQ_API_KEY (free!) to enable AI generation.',
      setupUrl: 'https://console.groq.com',
    });
  }

  const config = PROVIDERS[activeProvider.provider];

  return NextResponse.json({
    configured: true,
    provider: config.name,
    model: config.model,
    isFree: activeProvider.provider === 'groq',
  });
}
