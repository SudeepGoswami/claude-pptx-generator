# Claude PPTX Generator

A documentation-driven system for generating professional PowerPoint presentations using Claude Projects. Simply provide a blog post URL or markdown file, and Claude will transform it into a polished, brand-compliant presentation with optional audio transcripts and video assets.

## How It Works

This repository contains all the files needed for a Claude Project that can:

1. **Analyze content** from blogs, documents, or markdown files
2. **Engineer narratives** with assertion-based headlines
3. **Generate HTML slides** following strict design principles
4. **Convert to PPTX** using the html2pptx library
5. **Create audio transcripts** optimized for TTS
6. **Produce video assets** with speaker notes and cue sheets

## Quick Start

### Setup in Claude Projects

1. Create a new [Claude Project](https://claude.ai)
2. Upload all files from this repository to the project's knowledge base
3. Start a conversation and provide a blog URL or paste markdown content
4. Claude will follow the 9-phase workflow automatically

### Example Prompt

```
Transform this blog post into a professional presentation:
https://example.com/blog/my-article

Use the Traefik brand kit.
```

## Project Structure

```
├── SYSTEM-PROMPT.md          # Entry point - tells Claude what to read first
├── MASTER-PROMPT.md          # Complete 9-phase workflow protocol
├── PROJECT-FIXES.md          # Critical technical constraints
│
├── Phase Templates
│   ├── content-analysis.md       # Phase 1: Content extraction
│   ├── narrative-engineering.md  # Phase 2: Headline transformation
│   ├── slide-generation.md       # Phase 5: HTML creation rules
│   ├── audio-transcript.md       # Phase 8: TTS optimization
│   ├── video-production.md       # Phase 9: Video workflows
│   └── brand-extraction.md       # Creating new brand kits
│
├── Brand Kit
│   ├── brand-guidelines.md       # Color, typography, component reference
│   ├── brand.config.json         # Complete design tokens
│   ├── traefik.css               # CSS variables
│   ├── logowhite.png             # Logo for dark backgrounds
│   └── logoblack.png             # Logo for light backgrounds
│
└── HTML Templates (960x540px, 16:9)
    ├── title.html                # Opening slides
    ├── three-cards.html          # 3-column layouts
    ├── comparison.html           # Before/After layouts
    ├── grid-2x2.html             # 4-quadrant layouts
    ├── architecture.html         # Connected components
    └── cta.html                  # Call-to-action closing
```

## The 9-Phase Workflow

| Phase | Description | Output |
|-------|-------------|--------|
| 1. Content Analysis | Extract thesis, key points, data | Structured content brief |
| 2. Narrative Engineering | Transform to assertion headlines | Headline list |
| 3. Brand Kit Selection | Load design tokens and assets | Design system ready |
| 4. Slide Architecture | Map content to visual layouts | Slide structure plan |
| 5. HTML Slide Creation | Generate valid HTML slides | slide01.html, slide02.html... |
| 6. PPTX Generation | Convert HTML to PowerPoint | presentation.pptx |
| 7. Visual Validation | Review and fix rendering issues | Validated PPTX |
| 8. Audio Transcript | Generate TTS-optimized scripts | transcript.md |
| 9. Video Production | Create speaker notes & cue sheets | Video-ready assets |

## Key Design Principles

- **Content-first**: Headlines drive layout, not templates
- **Assertions over descriptions**: "Most API Gateways Fail at Scale" not "About Our Product"
- **60-30-10 color rule**: 60% background, 30% secondary, 10% accents
- **Technical constraints**: 24px side margins, 48px bottom, logo top-right

## HTML Template Guidelines

Templates demonstrate design patterns but aren't rigid constraints. When content needs a custom layout, create it using the same principles:

- **Canvas**: 960x540px (16:9 aspect ratio)
- **Body text**: Minimum 18px
- **Headlines**: Minimum 32px
- **Margins**: 24px sides, 48px bottom minimum
- **Logo**: Top-right, 22px height

## Creating Custom Brand Kits

Use `brand-extraction.md` to extract a new brand kit from existing presentations:

1. Analyze color palette (backgrounds, accents, text)
2. Document typography (fonts, sizes, weights)
3. Capture component patterns (cards, code blocks, badges)
4. Export as `brand.config.json` and CSS file

## Requirements

When using this in Claude Projects:
- Claude will use the bundled `html2pptx` library for PPTX generation
- For local development, install `pptxgenjs` via npm
- Video production requires FFmpeg for final assembly

## License

MIT

## Contributing

Contributions welcome! Please read the existing documentation to understand the design system before making changes.
