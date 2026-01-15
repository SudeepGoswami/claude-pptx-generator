# Brand Extraction Prompt

Use this prompt to extract a complete brand kit from existing presentations.

---

## Prompt

```
Analyze the attached presentation(s) and extract a complete brand kit.

## Instructions

1. **Extract the PPTX files**
   - Unzip to access /ppt/slides/*.xml and /ppt/media/*
   - Parse slide XML for color values, fonts, and styles

2. **Analyze Color Palette**
   Identify and categorize all colors:
   
   ### Backgrounds
   - Primary slide background: #______
   - Card/surface background: #______
   - Code block background: #______
   
   ### Accents
   - Primary accent: #______ (most prominent brand color)
   - Secondary accent: #______ (highlights, emphasis)
   - Tertiary accent: #______ (supporting elements)
   
   ### Text
   - Primary text: #______
   - Secondary text: #______
   - Muted/caption text: #______
   
   ### Semantic
   - Success/positive: #______
   - Warning/caution: #______
   - Error/danger: #______
   - Info/link: #______
   
   ### Borders
   - Default border: #______
   - Subtle border: #______

3. **Analyze Typography**
   
   ### Fonts
   - Display/headline font: ______
   - Body font: ______
   - Code/monospace font: ______
   
   ### Size Scale
   | Level | Size | Weight | Usage |
   |-------|------|--------|-------|
   | Hero | __px | ___ | Title slides |
   | H1 | __px | ___ | Slide headlines |
   | H2 | __px | ___ | Card titles |
   | Body | __px | ___ | Content |
   | Small | __px | ___ | Captions |

4. **Analyze Components**
   
   ### Cards
   - Background: ______
   - Border: ______
   - Border radius: ______
   - Padding: ______
   - Shadow: ______
   
   ### Code Blocks
   - Background: ______
   - Border: ______
   - Font: ______
   
   ### Badges/Tags
   - Style patterns observed: ______
   
   ### Buttons/CTAs
   - Style patterns observed: ______

5. **Logo Analysis**
   - Location in media folder: ______
   - Typical placement: ______
   - Size: ______

6. **Layout Patterns**
   - Common structures observed: ______
   - Spacing conventions: ______
   - Margin patterns: ______

---

## Output Format

### brand.config.json
```json
{
  "brand": {
    "name": "Brand Name",
    "tagline": "Tagline"
  },
  "palette": {
    "dark": {
      "surface": {
        "primary": "#______",
        "secondary": "#______",
        "tertiary": "#______"
      },
      "text": {
        "primary": "#______",
        "secondary": "#______",
        "muted": "#______"
      },
      "accent": {
        "primary": "#______",
        "secondary": "#______",
        "tertiary": "#______"
      },
      "semantic": {
        "success": "#______",
        "warning": "#______",
        "error": "#______",
        "info": "#______"
      },
      "border": {
        "default": "#______",
        "subtle": "#______"
      }
    }
  },
  "typography": {
    "fonts": {
      "display": "______",
      "body": "______",
      "code": "______"
    },
    "scale": {
      "hero": { "size": "__px", "weight": "___", "lineHeight": "_" },
      "h1": { "size": "__px", "weight": "___", "lineHeight": "_" },
      "h2": { "size": "__px", "weight": "___", "lineHeight": "_" },
      "body": { "size": "__px", "weight": "___", "lineHeight": "_" },
      "small": { "size": "__px", "weight": "___", "lineHeight": "_" }
    }
  },
  "components": {
    "card": {
      "background": "#______",
      "borderRadius": "__px",
      "padding": "__px",
      "borderLeft": "Xpx solid #______"
    },
    "codeBlock": {
      "background": "#______",
      "border": "1px solid #______",
      "borderRadius": "__px"
    }
  },
  "logo": {
    "file": "logo-white.png",
    "height": "__px",
    "position": "top-right"
  }
}
```

### CSS Variables
```css
:root {
  /* Backgrounds */
  --bg-primary: #______;
  --bg-card: #______;
  --bg-code: #______;
  
  /* Accents */
  --accent-primary: #______;
  --accent-secondary: #______;
  --accent-tertiary: #______;
  
  /* Text */
  --text-primary: #______;
  --text-secondary: #______;
  --text-muted: #______;
  
  /* Semantic */
  --success: #______;
  --warning: #______;
  --error: #______;
  --info: #______;
  
  /* Typography */
  --font-display: '______', sans-serif;
  --font-body: '______', sans-serif;
  --font-code: '______', monospace;
}
```
```

---

## Tips for Extraction

1. **Look for consistency** - The most-used colors are the core palette
2. **Check gradients** - Often reveal secondary colors
3. **Note opacity patterns** - rgba values indicate highlight styles
4. **Find the logo** - Usually in /ppt/media/ as PNG
5. **Examine multiple slides** - Ensure you capture all patterns