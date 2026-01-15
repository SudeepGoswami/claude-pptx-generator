import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import TurndownService from 'turndown';
import { logger } from '../utils/logger.js';

const turndown = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced'
});

// Custom turndown rules for better markdown
turndown.addRule('removeScripts', {
  filter: ['script', 'style', 'nav', 'footer', 'aside'],
  replacement: () => ''
});

export async function fetchContent(source, sourceType) {
  if (sourceType === 'markdown') {
    logger.info('Using provided markdown content');
    return source;
  }

  if (sourceType === 'url') {
    return await fetchUrl(source);
  }

  throw new Error(`Unknown source type: ${sourceType}`);
}

async function fetchUrl(url) {
  logger.info(`Fetching URL: ${url}`);

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; PPTXGenerator/1.0)',
      'Accept': 'text/html,application/xhtml+xml'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  logger.debug(`Fetched ${html.length} bytes from URL`);

  // Parse HTML and extract main content
  const dom = new JSDOM(html, { url });
  const reader = new Readability(dom.window.document);
  const article = reader.parse();

  if (!article || !article.content) {
    throw new Error('Could not extract article content from URL');
  }

  logger.info(`Extracted article: "${article.title}"`);

  // Convert HTML to markdown
  const markdown = turndown.turndown(article.content);

  // Add title as H1 if not already present
  const content = markdown.startsWith('#')
    ? markdown
    : `# ${article.title}\n\n${markdown}`;

  logger.debug(`Converted to ${content.length} chars of markdown`);

  return content;
}
