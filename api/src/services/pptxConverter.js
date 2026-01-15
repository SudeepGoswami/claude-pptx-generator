import PptxGenJS from 'pptxgenjs';
import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';
import { logger } from '../utils/logger.js';

// Brand colors
const COLORS = {
  bgPrimary: '050A22',
  bgCard: '12162A',
  textPrimary: 'FFFFFF',
  textSecondary: 'F8F8F2',
  textMuted: '78909C',
  accentPurple: 'BB64F9',
  accentYellow: 'EEFF41',
  accentLime: 'ABE338',
  accentOrange: 'F5AB35'
};

export async function convertToPptx(htmlFiles, outputPath, logoPath) {
  logger.info(`Converting ${htmlFiles.length} HTML files to PPTX`);

  const pptx = new PptxGenJS();

  // Set presentation properties
  pptx.layout = 'LAYOUT_16x9';
  pptx.title = 'Generated Presentation';
  pptx.author = 'PPTX Generator';

  // Define master slide
  pptx.defineSlideMaster({
    title: 'MAIN',
    background: { color: COLORS.bgPrimary }
  });

  // Process each HTML file
  for (const htmlFile of htmlFiles) {
    try {
      const html = fs.readFileSync(htmlFile, 'utf-8');
      const slide = pptx.addSlide({ masterName: 'MAIN' });

      // Parse HTML and extract content
      await parseHtmlToSlide(html, slide, logoPath);

      logger.debug(`Processed: ${path.basename(htmlFile)}`);
    } catch (error) {
      logger.error(`Failed to process ${htmlFile}`, { error: error.message });
    }
  }

  // Save the presentation
  await pptx.writeFile({ fileName: outputPath });
  logger.info(`PPTX saved: ${outputPath}`);

  return outputPath;
}

async function parseHtmlToSlide(html, slide, logoPath) {
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  const body = doc.body;

  // Add logo if available
  if (logoPath && fs.existsSync(logoPath)) {
    slide.addImage({
      path: logoPath,
      x: 8.8,
      y: 0.2,
      h: 0.3
    });
  }

  // Extract and add content
  let yPos = 0.8;

  // Find main headline (h1)
  const h1 = body.querySelector('h1');
  if (h1) {
    slide.addText(h1.textContent.trim(), {
      x: 0.5,
      y: yPos,
      w: 9,
      h: 0.6,
      fontSize: 32,
      bold: true,
      color: COLORS.textPrimary,
      fontFace: 'Arial'
    });
    yPos += 0.7;
  }

  // Find subtitle (h2 or first p after h1)
  const h2 = body.querySelector('h2');
  const subtitle = body.querySelector('h1 + p') || h2;
  if (subtitle && subtitle !== h1) {
    slide.addText(subtitle.textContent.trim(), {
      x: 0.5,
      y: yPos,
      w: 9,
      h: 0.4,
      fontSize: 18,
      color: COLORS.accentPurple,
      fontFace: 'Arial'
    });
    yPos += 0.5;
  }

  // Find cards/sections
  const cards = body.querySelectorAll('[style*="border-radius"], [style*="background"]');
  const cardContents = [];

  cards.forEach(card => {
    const title = card.querySelector('h2, h3, [style*="uppercase"]');
    const content = card.querySelector('p:not([style*="uppercase"])');

    if (title || content) {
      cardContents.push({
        title: title?.textContent?.trim() || '',
        content: content?.textContent?.trim() || ''
      });
    }
  });

  // Add cards as text boxes
  if (cardContents.length > 0) {
    const cardWidth = 9 / Math.min(cardContents.length, 3);
    cardContents.slice(0, 3).forEach((card, i) => {
      const xPos = 0.5 + (i * cardWidth);

      // Card background
      slide.addShape(pptx.ShapeType.rect, {
        x: xPos,
        y: yPos,
        w: cardWidth - 0.2,
        h: 2.5,
        fill: { color: COLORS.bgCard },
        line: { color: COLORS.accentPurple, width: 1, dashType: 'solid' }
      });

      // Card title
      if (card.title) {
        slide.addText(card.title, {
          x: xPos + 0.15,
          y: yPos + 0.15,
          w: cardWidth - 0.5,
          h: 0.4,
          fontSize: 14,
          bold: true,
          color: COLORS.accentPurple,
          fontFace: 'Arial'
        });
      }

      // Card content
      if (card.content) {
        slide.addText(card.content, {
          x: xPos + 0.15,
          y: yPos + 0.6,
          w: cardWidth - 0.5,
          h: 1.8,
          fontSize: 12,
          color: COLORS.textSecondary,
          fontFace: 'Arial',
          valign: 'top'
        });
      }
    });
  }

  // Find bullet points
  const lists = body.querySelectorAll('ul, ol');
  lists.forEach(list => {
    const items = list.querySelectorAll('li');
    const bulletText = Array.from(items)
      .map(li => `• ${li.textContent.trim()}`)
      .join('\n');

    if (bulletText && yPos < 4.5) {
      slide.addText(bulletText, {
        x: 0.5,
        y: yPos + 2.8,
        w: 9,
        h: 1.5,
        fontSize: 14,
        color: COLORS.textSecondary,
        fontFace: 'Arial',
        valign: 'top'
      });
    }
  });
}

// Helper to get the ShapeType
const pptx = new PptxGenJS();
export const ShapeType = pptx.ShapeType;
