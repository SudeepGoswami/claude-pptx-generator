import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { logger } from '../utils/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROMPTS_DIR = path.join(__dirname, '../../..');

function loadPrompt(filename) {
  const filepath = path.join(PROMPTS_DIR, filename);
  try {
    const content = fs.readFileSync(filepath, 'utf-8');
    logger.debug(`Loaded prompt: ${filename}`);
    return content;
  } catch (error) {
    logger.error(`Failed to load prompt: ${filename}`, { error: error.message });
    throw new Error(`Failed to load prompt: ${filename}`);
  }
}

function loadHtmlTemplate(filename) {
  const filepath = path.join(PROMPTS_DIR, filename);
  try {
    return fs.readFileSync(filepath, 'utf-8');
  } catch (error) {
    logger.warn(`Template not found: ${filename}`);
    return null;
  }
}

// Load all prompts
export const prompts = {
  master: loadPrompt('MASTER-PROMPT.md'),
  contentAnalysis: loadPrompt('content-analysis.md'),
  narrativeEngineering: loadPrompt('narrative-engineering.md'),
  slideGeneration: loadPrompt('slide-generation.md'),
  projectFixes: loadPrompt('PROJECT-FIXES.md'),
  brandGuidelines: loadPrompt('brand-guidelines.md')
};

// Load brand config
export const brandConfig = JSON.parse(
  fs.readFileSync(path.join(PROMPTS_DIR, 'brand.config.json'), 'utf-8')
);

// Load HTML templates
export const templates = {
  title: loadHtmlTemplate('title.html'),
  threeCards: loadHtmlTemplate('three-cards.html'),
  comparison: loadHtmlTemplate('comparison.html'),
  grid2x2: loadHtmlTemplate('grid-2x2.html'),
  architecture: loadHtmlTemplate('architecture.html'),
  cta: loadHtmlTemplate('cta.html')
};

// Load CSS
export const brandCss = fs.readFileSync(
  path.join(PROMPTS_DIR, 'traefik.css'),
  'utf-8'
);

logger.info('Prompts and templates loaded successfully');
