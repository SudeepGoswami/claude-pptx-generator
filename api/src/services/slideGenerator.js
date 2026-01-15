import fs from 'fs';
import path from 'path';
import { logger } from '../utils/logger.js';

export async function saveSlides(slidesData, outputDir) {
  logger.info(`Saving ${slidesData.slides.length} slides to ${outputDir}`);

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const savedFiles = [];

  for (const slide of slidesData.slides) {
    const filename = slide.filename || `slide${String(slide.slideNumber).padStart(2, '0')}.html`;
    const filepath = path.join(outputDir, filename);

    // Ensure HTML has proper structure
    const html = ensureHtmlStructure(slide.html);

    fs.writeFileSync(filepath, html, 'utf-8');
    savedFiles.push(filepath);
    logger.debug(`Saved slide: ${filename}`);
  }

  logger.info(`Saved ${savedFiles.length} HTML slides`);
  return savedFiles;
}

function ensureHtmlStructure(html) {
  // If already a complete document, return as-is
  if (html.includes('<!DOCTYPE') || html.includes('<html')) {
    return html;
  }

  // Wrap in basic HTML structure
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 960px;
      height: 540px;
      font-family: 'Rubik', Arial, sans-serif;
      background: #050A22;
      color: #FFFFFF;
      overflow: hidden;
    }
  </style>
</head>
<body>
${html}
</body>
</html>`;
}
