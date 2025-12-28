import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { VALUES_BY_ID } from '@/lib/data/values';
import { DOMAINS_BY_ID } from '@/lib/data/domains';
import { getFallbackTagline } from '@/lib/data/fallbackTaglines';
import { getValuesContext, getSortingContext } from '@/lib/ai/valuesDomainMap';

const client = new Anthropic();

// Simple in-memory rate limiting
// For production, use Redis or similar persistent store
const RATE_LIMIT = 10; // requests per minute per IP
const RATE_WINDOW_MS = 60000; // 1 minute
const rateLimitMap = new Map<string, number[]>();

function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  return 'unknown';
}

function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const requests = rateLimitMap.get(ip) || [];

  // Filter to only recent requests within the window
  const recentRequests = requests.filter(t => now - t < RATE_WINDOW_MS);

  if (recentRequests.length >= RATE_LIMIT) {
    const oldestRequest = Math.min(...recentRequests);
    const resetIn = Math.ceil((oldestRequest + RATE_WINDOW_MS - now) / 1000);
    return { allowed: false, remaining: 0, resetIn };
  }

  // Add current request
  recentRequests.push(now);
  rateLimitMap.set(ip, recentRequests);

  return {
    allowed: true,
    remaining: RATE_LIMIT - recentRequests.length,
    resetIn: Math.ceil(RATE_WINDOW_MS / 1000)
  };
}

// Cleanup old entries periodically to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  const entries = Array.from(rateLimitMap.entries());
  for (const [ip, requests] of entries) {
    const recentRequests = requests.filter(t => now - t < RATE_WINDOW_MS);
    if (recentRequests.length === 0) {
      rateLimitMap.delete(ip);
    } else {
      rateLimitMap.set(ip, recentRequests);
    }
  }
}, RATE_WINDOW_MS);

interface ValueDefinition {
  tagline: string;
  definition?: string;
  behavioralAnchors?: string[];
  userEdited: boolean;
}

interface RequestBody {
  sessionId: string;
  rankedValues: string[];
  transcript: string;
  sortedValues: {
    very: string[];
    somewhat: string[];
    less: string[];
  };
}

// Tool definitions for structured output
const tools: Anthropic.Tool[] = [
  {
    name: 'generate_value_definition',
    description: 'Create a personalized value definition with tagline and behavioral anchors',
    input_schema: {
      type: 'object' as const,
      properties: {
        value_id: {
          type: 'string',
          description: 'The ID of the value being defined',
        },
        tagline: {
          type: 'string',
          description: '3-6 memorable words that capture the essence of this value for this person',
        },
        definition: {
          type: 'string',
          description: '3-4 sentences explaining what this value means. Include three critical elements: (1) what this value looks like in daily life, (2) how it guides decision-making, (3) how it shapes relationships with others.',
        },
        behavioral_anchors: {
          type: 'array',
          items: { type: 'string' },
          minItems: 3,
          maxItems: 5,
          description: '3-5 practical decision-making questions. Format: "When [situation], ask: [question]?"',
        },
      },
      required: ['value_id', 'tagline', 'definition', 'behavioral_anchors'],
    },
  },
];

function buildSystemPrompt(): string {
  return `You are a values articulation specialist helping people discover and express their personal values.

PRINCIPLES:
1. PRESERVE VOICE: When the user provides a transcript, incorporate their actual phrases and language. Echo back their authentic voice.

2. THREE CRITICAL ELEMENTS: Every definition must address:
   - How this value shows up in daily life
   - How it guides decision-making
   - How it shapes relationships with others

3. BEHAVIORAL ANCHORS: Generate 3-5 practical questions they can ask themselves when making decisions. Format: "When [situation], ask: [question]?"

4. SECOND PERSON: Write in second person ("You..." / "For you..."). Make it personal and direct.

5. RELATIONAL: For values #2 and #3, consider how they relate to and complement the #1 value.

EXAMPLE ANCHORS:
- "When pressure mounts, ask: Can I look at myself in the mirror afterward?"
- "Before committing, ask: Does this honor what I truly value?"
- "When faced with shortcuts, ask: Would the person I want to be take this path?"
- "In conflict, ask: Am I responding with the care this person deserves?"
- "When making trade-offs, ask: What would I regret not prioritizing?"

Use the generate_value_definition tool for EACH of the top 3 values. Call the tool 3 times total.`;
}

function buildUserPrompt(
  rankedValues: string[],
  transcript: string,
  sortedValues: { very: string[]; somewhat: string[]; less: string[] }
): string {
  const top3 = rankedValues.slice(0, 3);
  const top3Context = top3
    .map((id, i) => {
      const value = VALUES_BY_ID[id];
      if (!value) return null;
      const domain = DOMAINS_BY_ID[value.domainId];
      return `#${i + 1}: ${value.name} (${domain?.name || 'Unknown'}) - ${value.cardText}`;
    })
    .filter(Boolean)
    .join('\n');

  const sortingContext = getSortingContext(sortedValues);
  const veryImportantContext = getValuesContext(sortedValues.very);

  let prompt = `TASK: Generate personalized definitions for this person's top 3 values.

TOP 3 RANKED VALUES:
${top3Context}

${sortingContext}

FULL "VERY IMPORTANT" LIST:
${veryImportantContext}
`;

  if (transcript && transcript.trim().length > 0) {
    prompt += `

USER'S VOICE TRANSCRIPT (about their top 3 values):
"${transcript}"

IMPORTANT: Parse the transcript for mentions of each value. Incorporate their actual language where appropriate. They may have discussed:
- ${VALUES_BY_ID[top3[0]]?.name} (#1)
- ${VALUES_BY_ID[top3[1]]?.name} (#2)
- ${VALUES_BY_ID[top3[2]]?.name} (#3)

Preserve their authentic voice in each definition.`;
  } else {
    prompt += `

NOTE: The user did not provide a voice transcript. Generate thoughtful definitions based on the sorting data and value descriptions.`;
  }

  prompt += `

Now generate definitions for all 3 values using the generate_value_definition tool. Call it once for each value.`;

  return prompt;
}

function generateFallbackDefinitions(rankedValues: string[]): Record<string, ValueDefinition> {
  const definitions: Record<string, ValueDefinition> = {};
  const top3 = rankedValues.slice(0, 3);

  for (const id of top3) {
    const value = VALUES_BY_ID[id];
    if (!value) continue;

    definitions[id] = {
      tagline: getFallbackTagline(value.name),
      definition: `${value.name} represents ${value.cardText.toLowerCase()}. This value guides how you approach decisions and relationships. When you honor this value, you feel aligned with your authentic self.`,
      behavioralAnchors: [
        `When making important decisions, ask: Does this align with ${value.name.toLowerCase()}?`,
        `In moments of doubt, ask: What would honoring ${value.name.toLowerCase()} look like here?`,
        `Before committing, ask: Will this choice reflect my commitment to ${value.name.toLowerCase()}?`,
      ],
      userEdited: false,
    };
  }

  return definitions;
}

export async function POST(request: Request) {
  try {
    // Check rate limit
    const clientIP = getClientIP(request);
    const rateLimit = checkRateLimit(clientIP);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded. Please try again later.',
          retryAfter: rateLimit.resetIn
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.resetIn),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(rateLimit.resetIn),
          }
        }
      );
    }

    const body: RequestBody = await request.json();
    const { rankedValues, transcript, sortedValues } = body;

    if (!rankedValues || rankedValues.length === 0) {
      return NextResponse.json(
        { error: 'No ranked values provided' },
        { status: 400 }
      );
    }

    // Check for API key
    if (!process.env.ANTHROPIC_API_KEY) {
      console.warn('No ANTHROPIC_API_KEY found, using fallback definitions');
      return NextResponse.json({
        definitions: generateFallbackDefinitions(rankedValues),
        fallback: true,
      });
    }

    // Call Anthropic API with tools
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      tools,
      system: buildSystemPrompt(),
      messages: [
        {
          role: 'user',
          content: buildUserPrompt(rankedValues, transcript, sortedValues),
        },
      ],
    });

    // Extract tool_use blocks from response
    const definitions: Record<string, ValueDefinition> = {};
    const toolUseBlocks = response.content.filter(
      (block): block is Anthropic.ToolUseBlock => block.type === 'tool_use'
    );

    for (const block of toolUseBlocks) {
      if (block.name === 'generate_value_definition') {
        const input = block.input as {
          value_id: string;
          tagline: string;
          definition: string;
          behavioral_anchors: string[];
        };

        definitions[input.value_id] = {
          tagline: input.tagline,
          definition: input.definition,
          behavioralAnchors: input.behavioral_anchors,
          userEdited: false,
        };
      }
    }

    // Ensure we have definitions for all top 3
    const top3 = rankedValues.slice(0, 3);
    for (const id of top3) {
      if (!definitions[id]) {
        const value = VALUES_BY_ID[id];
        if (value) {
          definitions[id] = {
            tagline: getFallbackTagline(value.name),
            definition: `${value.name} represents ${value.cardText.toLowerCase()}. This value guides how you approach decisions and relationships. When you honor this value, you feel aligned with your authentic self.`,
            behavioralAnchors: [
              `When making important decisions, ask: Does this align with ${value.name.toLowerCase()}?`,
              `In moments of doubt, ask: What would honoring ${value.name.toLowerCase()} look like here?`,
              `Before committing, ask: Will this choice reflect my commitment to ${value.name.toLowerCase()}?`,
            ],
            userEdited: false,
          };
        }
      }
    }

    return NextResponse.json({ definitions });
  } catch (error) {
    console.error('AI generation error:', error);

    // Return fallback on error
    try {
      const body: RequestBody = await request.clone().json();
      return NextResponse.json({
        definitions: generateFallbackDefinitions(body.rankedValues || []),
        fallback: true,
        error: 'AI generation failed, using fallback definitions',
      });
    } catch {
      return NextResponse.json(
        { error: 'Failed to generate definitions' },
        { status: 500 }
      );
    }
  }
}
