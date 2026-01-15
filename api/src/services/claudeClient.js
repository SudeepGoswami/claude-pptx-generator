import Anthropic from '@anthropic-ai/sdk';
import { prompts, brandConfig, templates, brandCss } from '../prompts/index.js';
import { logger } from '../utils/logger.js';

const client = new Anthropic();

const MODEL = 'claude-sonnet-4-20250514';

// Build system prompt with all context
function buildSystemPrompt() {
  return `You are an expert presentation designer. You will help create professional presentations.

## Critical Technical Constraints
${prompts.projectFixes}

## Brand Guidelines
${prompts.brandGuidelines}

## Brand Design Tokens
\`\`\`json
${JSON.stringify(brandConfig, null, 2)}
\`\`\`

## Available HTML Templates for Reference
These templates demonstrate design patterns. Use them as reference for styling:

### Title Slide Template
\`\`\`html
${templates.title}
\`\`\`

### Three Cards Template
\`\`\`html
${templates.threeCards}
\`\`\`

### Comparison Template
\`\`\`html
${templates.comparison}
\`\`\`

### CTA Template
\`\`\`html
${templates.cta}
\`\`\`

## CSS Variables
\`\`\`css
${brandCss}
\`\`\`
`;
}

export async function analyzeContent(markdown) {
  logger.info('Starting content analysis');

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 4096,
    system: `${prompts.contentAnalysis}

Analyze the provided content and extract:
1. Core thesis (1 sentence)
2. 5-7 key points with supporting evidence
3. Quotable lines for headlines
4. Data points and statistics
5. Narrative arc (problem → solution → proof)
6. Gaps or weaknesses

Return your analysis as structured JSON.`,
    messages: [
      {
        role: 'user',
        content: `Analyze this content for presentation creation:\n\n${markdown}`
      }
    ]
  });

  const text = response.content[0].text;
  logger.debug('Content analysis complete');

  // Try to parse as JSON, or return as text
  try {
    return JSON.parse(text);
  } catch {
    return { rawAnalysis: text };
  }
}

export async function engineerNarrative(analysis) {
  logger.info('Starting narrative engineering');

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 4096,
    system: `${prompts.narrativeEngineering}

Transform the content analysis into assertion-based headlines.
Headlines should be provocative claims, not descriptions.

Bad: "About Our Product"
Good: "Most API Gateways Fail at Scale"

Return a JSON object with:
{
  "title": "Main presentation title",
  "subtitle": "Supporting tagline",
  "slides": [
    {
      "slideNumber": 1,
      "type": "title|hook|problem|solution|architecture|proof|benefits|cta",
      "headline": "Assertion-based headline",
      "subheadline": "Supporting text",
      "keyPoints": ["point1", "point2", "point3"],
      "layoutSuggestion": "title|three-cards|comparison|grid-2x2|architecture|cta"
    }
  ]
}`,
    messages: [
      {
        role: 'user',
        content: `Create headlines from this analysis:\n\n${JSON.stringify(analysis, null, 2)}`
      }
    ]
  });

  const text = response.content[0].text;
  logger.debug('Narrative engineering complete');

  try {
    // Find JSON in the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(text);
  } catch {
    throw new Error('Failed to parse narrative response as JSON');
  }
}

export async function generateSlides(narrative) {
  logger.info('Starting slide generation');

  const systemPrompt = buildSystemPrompt();

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 16000,
    system: `${systemPrompt}

${prompts.slideGeneration}

Generate HTML slides based on the narrative structure provided.

IMPORTANT RULES:
- Canvas size: 960x540px (16:9)
- Side margins: 24px minimum
- Bottom margin: 48px minimum
- Logo placement: top-right, 24px from edges, 22px height
- All text in proper tags (p, h1-h6, ul, ol)
- No bare text in divs
- Use the brand colors and styling from the templates

Return a JSON object:
{
  "slides": [
    {
      "slideNumber": 1,
      "filename": "slide01.html",
      "html": "<full HTML content>"
    }
  ]
}`,
    messages: [
      {
        role: 'user',
        content: `Generate HTML slides for this presentation:\n\n${JSON.stringify(narrative, null, 2)}`
      }
    ]
  });

  const text = response.content[0].text;
  logger.debug('Slide generation complete');

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(text);
  } catch (error) {
    logger.error('Failed to parse slides response', { error: error.message });
    throw new Error('Failed to parse slide generation response as JSON');
  }
}
