import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { VALUES_BY_ID } from '@/lib/data/values';
import { DOMAINS_BY_ID } from '@/lib/data/domains';
import { getFallbackTagline } from '@/lib/data/fallbackTaglines';
import { getValuesContext, getSortingContext } from '@/lib/ai/valuesDomainMap';

const client = new Anthropic();

interface ValueDefinition {
  tagline: string;
  definition?: string;
  behavioralAnchor?: string;
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
    description: 'Create a personalized value definition with tagline and behavioral anchor',
    input_schema: {
      type: 'object' as const,
      properties: {
        value_id: {
          type: 'string',
          description: 'The ID of the value being defined',
        },
        tagline: {
          type: 'string',
          description: '2-5 memorable words that capture the essence of this value for this person',
        },
        definition: {
          type: 'string',
          description: '2-3 sentences in second person that explain what this value means to them specifically',
        },
        behavioral_anchor: {
          type: 'string',
          description: 'A practical decision-making question: "When X, ask: Y?"',
        },
      },
      required: ['value_id', 'tagline', 'definition', 'behavioral_anchor'],
    },
  },
];

function buildSystemPrompt(): string {
  return `You are a values articulation specialist. Your role is to help people discover and articulate their personal values in a way that's meaningful and actionable.

PRINCIPLES:
1. PRESERVE VOICE: When the user provides a transcript about their #1 value, use their actual phrases and language when powerful. Echo back their authentic voice.

2. BEHAVIORAL: Every value definition must include a behavioral anchor - a practical question they can ask themselves when making decisions. Format: "When [situation], ask: [question]?"

3. SECOND PERSON: Write definitions in second person ("You define..." / "For you..."). Make it personal and direct.

4. RELATIONAL: For values #2 and #3, consider how they relate to and complement the #1 value.

5. CONCISE: Taglines should be 2-5 words. Definitions should be 2-3 sentences max.

EXAMPLE BEHAVIORAL ANCHORS:
- "When pressure mounts, ask: Can I look at myself in the mirror afterward?"
- "Before committing, ask: Does this honor what I truly value?"
- "When faced with shortcuts, ask: Would the person I want to be take this path?"
- "In conflict, ask: Am I responding with the care this person deserves?"

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

USER'S VOICE TRANSCRIPT (about their #1 value, ${VALUES_BY_ID[top3[0]]?.name}):
"${transcript}"

IMPORTANT: For the #1 value, incorporate their actual language and phrases where appropriate. Preserve their authentic voice.`;
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
      definition: `${value.name} represents ${value.cardText.toLowerCase()}. This value guides how you approach decisions and relationships.`,
      behavioralAnchor: `When making important decisions, ask: Does this align with ${value.name.toLowerCase()}?`,
      userEdited: false,
    };
  }

  return definitions;
}

export async function POST(request: Request) {
  try {
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
          behavioral_anchor: string;
        };

        definitions[input.value_id] = {
          tagline: input.tagline,
          definition: input.definition,
          behavioralAnchor: input.behavioral_anchor,
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
            definition: `${value.name} represents ${value.cardText.toLowerCase()}. This value guides how you approach decisions and relationships.`,
            behavioralAnchor: `When making important decisions, ask: Does this align with ${value.name.toLowerCase()}?`,
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
