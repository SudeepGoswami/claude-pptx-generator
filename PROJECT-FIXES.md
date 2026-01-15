# Project Fixes & Requirements


## CRITICAL: Logo Conversion Required

The logo files (`logowhite.png`, `logoblack.png`) are **JPEGs disguised as PNGs** with white backgrounds. They will NOT render correctly on dark slides.

### Before generating any slides, run this conversion:

```bash
# Convert black logo to white logo with transparent background
convert /mnt/project/logoblack.png -fuzz 20% -transparent white -negate logowhite.png

# Verify it's a proper PNG with alpha channel
file logowhite.png
# Should show: PNG image data, ... gray+alpha or RGBA
```

**Do NOT use the original logowhite.png from the project directly.**

---

## CRITICAL: Use CSS Framework Classes for Equal-Height Cards

The html2pptx converter has a built-in CSS framework. **You MUST use these classes** instead of raw inline flex styles for cards to have equal heights.

### âŒ WRONG (cards will have unequal heights):
```html
<div style="display: flex; flex-direction: row; align-items: stretch; flex: 1;">
  <div style="flex: 1; display: flex; flex-direction: column;">
    ...
  </div>
</div>
```

### âœ… CORRECT (cards will have equal heights):
```html
<div class="fill-height row items-fill-width" style="padding: 16px 24px; gap: 14px;">
  <div class="col" style="background: ...; border-radius: 12px; padding: 20px;">
    ...
  </div>
</div>
```

### Key CSS Framework Classes to Use:

| Class | Purpose |
|-------|---------|
| `col` | Flex column container |
| `row` | Flex row container |
| `fill-height` | Expand to fill available height |
| `fill-width` | Expand to fill available width |
| `items-fill-width` | All children expand horizontally (equal widths) |
| `items-fill-height` | All children expand vertically |
| `fit` | Fixed size, don't expand |
| `center` | Center content |

### Three-Card Slide Pattern:

```html
<body class="col" style="width: 960px; height: 540px; position: relative; background: #050A22;">
  <!-- Logo -->
  <img src="logowhite.png" style="position: absolute; top: 24px; right: 24px; height: 22px;">
  
  <!-- Title (fixed height) -->
  <div class="fit" style="padding: 24px 24px 0 24px;">
    <h1 style="...">Title</h1>
    <p style="margin: 8px 0 0 0;">Subtitle</p>
  </div>
  
  <!-- Cards (expand to fill) -->
  <div class="fill-height row items-fill-width" style="padding: 16px 24px; gap: 14px;">
    
    <!-- Card 1 -->
    <div class="col" style="background: ...; border-radius: 12px; padding: 20px; border-left: 5px solid #COLOR;">
      <p style="...">01</p>
      <p style="...">Card Title</p>
      <p class="fit" style="...">Body text</p>
      <div class="fill-height"></div>  <!-- SPACER pushes highlight to bottom -->
      <div style="background: rgba(...); padding: 12px; border-radius: 8px;">
        <p style="...">Highlight text</p>
      </div>
    </div>
    
    <!-- Card 2 (same structure) -->
    <div class="col" style="...">...</div>
    
    <!-- Card 3 (same structure) -->
    <div class="col" style="...">...</div>
    
  </div>
  
  <!-- Footer (fixed height) -->
  <div class="fit" style="padding: 8px 24px 48px 24px;">
    <p style="...">Footer text</p>
  </div>
</body>
```

### Critical Elements:

1. **Body**: `class="col"` for vertical flex layout
2. **Title section**: `class="fit"` to prevent expansion
3. **Cards container**: `class="fill-height row items-fill-width"`
4. **Each card**: `class="col"` for internal flex column
5. **Body text in card**: `class="fit"` to not expand
6. **Spacer div**: `class="fill-height"` to push highlight box down
7. **Footer**: `class="fit"` to prevent expansion

---

## Title/Subtitle Spacing

Don't let title and subtitle overlap. Use proper margin:

```html
<div class="fit" style="padding: 24px 24px 0 24px;">
  <h1 style="font-size: 28px; margin: 0; line-height: 1.2;">Title Text</h1>
  <p style="font-size: 14px; margin: 8px 0 0 0;">Subtitle text</p>  <!-- margin-top: 8px -->
</div>
```

---

## Bottom Margin Requirements

The html2pptx converter requires **minimum 48px padding at the bottom** (0.5" in PowerPoint). Always use:

```html
<div class="fit" style="padding: 8px 24px 48px 24px;">
  <!-- Footer content -->
</div>
```

---

## Comparison/Two-Column Slides

For equal-height side-by-side columns:

```html
<div class="fill-height row items-fill-width" style="padding: 16px 24px; gap: 20px;">
  <!-- Left column -->
  <div class="col" style="background: ...; border-radius: 12px; padding: 24px; border-left: 5px solid #COLOR;">
    <p>Label</p>
    <p>Main content</p>
    <div class="fill-height"></div>
    <div style="...">Highlight box</div>
  </div>
  
  <!-- Right column (same structure) -->
  <div class="col" style="...">...</div>
</div>
```

---

## Architecture/Connected Components Slides

Same pattern with `gap: 0` for connected look:

```html
<div class="fill-height row items-fill-width" style="padding: 12px 24px; gap: 0;">
  <div class="col" style="border-radius: 12px 0 0 12px; ...">Component 1</div>
  <div class="col" style="...">Component 2</div>
  <div class="col" style="border-radius: 0 12px 12px 0; ...">Component 3</div>
</div>
```

---

## Quick Checklist Before Generating

- [ ] Convert logo to proper transparent PNG
- [ ] Use `class="col"` on body
- [ ] Use `class="fill-height row items-fill-width"` on card containers
- [ ] Use `class="col"` on each card
- [ ] Use `class="fill-height"` spacer div inside cards (before highlight box)
- [ ] Use `class="fit"` on title and footer sections
- [ ] Ensure 48px bottom padding on footer
- [ ] Ensure 8px+ margin between title and subtitle


## CRITICAL: Title/Subtitle Text Overlap Prevention

The html2pptx converter positions each text element independently. When titles wrap,
subtitles DO NOT move down automatically. This causes overlaps.

### RULE: Never let titles auto-wrap

**Pattern 1: Single-line titles (BEST)**
- Keep titles under 45 characters
- Use `white-space: nowrap` to enforce

**Pattern 2: Explicit multi-line titles**
```html
<div style="margin-bottom: 16px;">
  <p style="font-size: 28px; font-weight: 700; margin: 0; line-height: 1.2;">First Line</p>
  <p style="font-size: 28px; font-weight: 700; margin: 0; line-height: 1.2;">Second Line</p>
</div>
<p style="font-size: 14px; margin: 0;">Subtitle with 16px+ gap above</p>
```

### RULE: Content containers need explicit top offset

Cards and content must start well below the title zone:
- Single-line title: `padding-top: 80px`
- Two-line title: `padding-top: 120px`

### ANTI-PATTERN (NEVER DO THIS)
```html
<h1>Long Title That Might Wrap Automatically</h1>
<p>Subtitle will overlap!</p>
```

# Presentation Fixes Guide

Fixes and best practices for html2pptx slide generation. Add these rules to your workflow to prevent common issues.

---

## 0. Equal-Height Cards (MOST CRITICAL - THE NON-OBVIOUS BUG)

### The Non-Obvious Problem

**CSS flexbox stretching is IGNORED by html2pptx.** This is the bug that keeps coming back.

The converter:
1. Renders HTML in a headless browser (Playwright)
2. Calls `getBoundingClientRect()` on each element
3. Creates PPTX shapes based on **CONTENT-BASED sizes**, NOT flex-stretched sizes

**These CSS approaches DO NOT work:**
- `align-items: stretch`
- `items-fill-height` class
- `self-stretch` class
- `height: 100%` on children

**Why it APPEARS to work sometimes:** When card content happens to be similar length, cards naturally render at similar heights by coincidence. When you change content, the bug reappears.

### The ONLY Reliable Solution

**Use absolute positioning with explicit pixel heights:**

```html
<div style="position: relative; height: 280px;">
  <div style="position: absolute; top: 0; left: 0; width: calc(50% - 10px); height: 280px;">Card 1</div>
  <div style="position: absolute; top: 0; right: 0; width: calc(50% - 10px); height: 280px;">Card 2</div>
</div>
```

This forces identical heights regardless of content.

### Pattern: Absolute Positioning (Recommended)

```html
<!-- Container with relative positioning -->
<div style="position: relative; margin: 8px 24px; height: 260px;">
  
  <!-- Card 1 - absolute positioned -->
  <div style="position: absolute; top: 0; left: 0; width: calc(50% - 10px); height: 260px; 
              background: ...; border-radius: 12px; padding: 20px; 
              display: flex; flex-direction: column; box-sizing: border-box;">
    <!-- Card content -->
    <p>Title</p>
    <p>Body</p>
    <div style="flex: 1;"></div>  <!-- Spacer -->
    <div>Highlight box</div>
  </div>
  
  <!-- Card 2 - absolute positioned with same height -->
  <div style="position: absolute; top: 0; right: 0; width: calc(50% - 10px); height: 260px;
              background: ...; border-radius: 12px; padding: 20px;
              display: flex; flex-direction: column; box-sizing: border-box;">
    <!-- Card content -->
  </div>
</div>
```

### Pattern: Three Cards with Absolute Positioning

```html
<div style="position: relative; margin: 14px 24px; height: 280px;">
  <div style="position: absolute; top: 0; left: 0; width: calc(33.33% - 10px); height: 280px; ...">Card 1</div>
  <div style="position: absolute; top: 0; left: calc(33.33% + 5px); width: calc(33.33% - 10px); height: 280px; ...">Card 2</div>
  <div style="position: absolute; top: 0; right: 0; width: calc(33.33% - 10px); height: 280px; ...">Card 3</div>
</div>
```

### Why CSS Framework Classes Don't Work

The html2pptx converter:
1. Renders HTML in a headless browser (Playwright)
2. Uses `getBoundingClientRect()` to capture element sizes
3. Creates PowerPoint shapes based on those sizes

The problem: The converter captures the **content-based** size of each card, not the **flex-stretched** size. Even if CSS makes cards visually equal in the browser, the converter reads each card's natural content height.

### Quick Reference: Heights by Slide Type

| Card Count | Recommended Height |
|------------|-------------------|
| 2 cards | 260-280px |
| 3 cards | 280-300px |
| 4 cards (grid) | 180-200px per row |
| 5 cards | 280-300px |

---

## 1. Single-Line Titles (CRITICAL)

### Problem
The html2pptx converter creates independent text boxes for each HTML element. When titles wrap to multiple lines, subsequent elements (subtitles, content) overlap because their Y-position is calculated based on single-line height.

### Solution
**Never let titles auto-wrap.** Keep titles short enough to fit on one line, or reduce font size.

### Title Length Guidelines

| Font Size | Max Characters (approx) |
|-----------|------------------------|
| 52px | ~30 characters |
| 44px | ~38 characters |
| 36px | ~45 characters |
| 32px | ~50 characters |
| 28px | ~60 characters |

### Examples

```html
<!-- âŒ BAD: Title will wrap and overlap subtitle -->
<p style="font-size: 52px;">The Application Intelligence Layer</p>
<p style="font-size: 18px;">Subtitle gets overlapped</p>

<!-- âœ… GOOD: Smaller font fits on one line -->
<p style="font-size: 44px;">The Application Intelligence Layer</p>
<p style="font-size: 18px; margin-top: 24px;">Subtitle has clear spacing</p>

<!-- âœ… GOOD: Shorter title at larger size -->
<p style="font-size: 52px;">Application Intelligence</p>
<p style="font-size: 18px; margin-top: 24px;">Subtitle has clear spacing</p>
```

### Title Sizing Reference

| Slide Type | Recommended Font Size | Notes |
|------------|----------------------|-------|
| Title slide (hero) | 44-48px | Keep under 35 chars |
| Content slide headline | 28-32px | Keep under 55 chars |
| Section label | 12-14px | Uppercase, letter-spacing |

---

## 2. CSS Framework Classes (REQUIRED)

### Problem
Raw inline flex styles don't work reliably for equal-height cards. The html2pptx converter has a built-in CSS framework that must be used.

### Required Classes

| Class | Purpose |
|-------|---------|
| `col` | Flex column container |
| `row` | Flex row container |
| `fill-height` | Expand to fill available height |
| `fill-width` | Expand to fill available width |
| `items-fill-width` | All children expand equally (equal widths) |
| `items-fill-height` | All children expand equally (equal heights) |
| `fit` | Fixed size, don't expand |
| `center` | Center content |

### Correct Structure Pattern

```html
<body class="col" style="width: 960px; height: 540px; position: relative; background: #050A22;">
  <!-- Logo (absolute positioned) -->
  <img src="logowhite.png" style="position: absolute; top: 24px; right: 24px; height: 22px;">
  
  <!-- Title section (fixed height) -->
  <div class="fit" style="padding: 56px 24px 0 24px;">
    <p style="font-size: 28px; margin: 0;">Title Here</p>
    <p style="font-size: 14px; margin: 10px 0 0 0;">Subtitle here</p>
  </div>
  
  <!-- Cards section (expands to fill) -->
  <div class="fill-height row items-fill-width" style="padding: 14px 24px; gap: 14px;">
    
    <!-- Each card -->
    <div class="col" style="background: ...; border-radius: 12px; padding: 20px;">
      <p style="...">Card Title</p>
      <p class="fit" style="...">Body text (fixed)</p>
      <div class="fill-height"></div>  <!-- SPACER - pushes highlight to bottom -->
      <div style="background: rgba(...); padding: 12px; border-radius: 8px;">
        <p style="...">Highlight text</p>
      </div>
    </div>
    
    <!-- More cards with same structure -->
  </div>
  
  <!-- Footer section (fixed height) -->
  <div class="fit" style="padding: 8px 24px 48px 24px;">
    <p style="...">Footer text</p>
  </div>
</body>
```

### Key Points

1. **Body**: Always `class="col"`
2. **Title/Footer sections**: Always `class="fit"`
3. **Card container**: Always `class="fill-height row items-fill-width"`
4. **Each card**: Always `class="col"`
5. **Spacer inside cards**: `<div class="fill-height"></div>` before highlight box

---

## 3. Logo Conversion (REQUIRED)

### Problem
Logo files (`logowhite.png`, `logoblack.png`) may be JPEGs disguised as PNGs with white backgrounds. They will NOT render correctly on dark slides.

### Solution
Convert to proper transparent PNG before generating slides:

```bash
# Convert black logo to white logo with transparent background
convert /mnt/project/logoblack.png -fuzz 20% -transparent white -negate logowhite.png

# Verify it's a proper PNG with alpha channel
file logowhite.png
# Should show: PNG image data, ... gray+alpha or RGBA
```

### Logo Placement

```html
<img src="logowhite.png" style="position: absolute; top: 24px; right: 24px; height: 22px;">
```

---

## 4. Spacing Rules

### Title Zone
- Start content at `padding-top: 56px` to clear logo
- Gap between title and subtitle: `margin-top: 10px`
- Gap between subtitle and content: handled by section padding

### Bottom Safe Zone
- Minimum `48px` padding at bottom (0.5" in PowerPoint)
- Footer sections: `padding: 8px 24px 48px 24px`

### Side Margins
- Minimum `24px` on both sides
- Content should never touch edges

### Card Spacing
- Gap between cards: `14px` for 3+ cards, `20px` for 2 cards
- Internal card padding: `16-20px`

---

## 5. Text Wrapping Prevention

### Problem
Labels and short text can break mid-word in narrow containers.

### Solution
Use explicit non-breaking or keep labels short.

```html
<!-- For category labels that shouldn't wrap -->
<p style="font-size: 11px; white-space: nowrap;">FINANCE</p>

<!-- Note: white-space: nowrap doesn't always work in PPTX -->
<!-- Better solution: keep labels under 12 characters -->
```

### Label Length Guidelines

| Container Width | Max Label Length |
|-----------------|------------------|
| 5-column layout | 10-12 chars |
| 3-column layout | 15-18 chars |
| 2-column layout | 20-25 chars |

---

## 6. Vendor Logos (When Network Restricted)

### Problem
External logo downloads may be blocked by network restrictions.

### Solution
Use text badges with brand colors:

```html
<!-- GARTNER badge -->
<div style="display: inline-block; background: #004990; padding: 5px 10px; border-radius: 4px;">
  <p style="font-size: 10px; color: #FFFFFF; margin: 0; font-weight: 700; letter-spacing: 1px;">GARTNER</p>
</div>

<!-- FORRESTER badge -->
<div style="display: inline-block; background: #00594C; padding: 5px 10px; border-radius: 4px;">
  <p style="font-size: 10px; color: #FFFFFF; margin: 0; font-weight: 700; letter-spacing: 1px;">FORRESTER</p>
</div>
```

### Alternative: Pre-download logos locally
```bash
curl -o gartner.svg "https://cdn.worldvectorlogo.com/logos/gartner.svg"
convert -background none -density 300 gartner.svg -resize 80x gartner.png
```

---

## 7. Quick Checklist

Before generating PPTX:

- [ ] All titles fit on one line (check character count)
- [ ] Logo converted to transparent PNG
- [ ] Body uses `class="col"`
- [ ] Card containers use `class="fill-height row items-fill-width"`
- [ ] Each card uses `class="col"`
- [ ] Spacer `<div class="fill-height"></div>` inside cards before highlight box
- [ ] Title/footer sections use `class="fit"`
- [ ] Bottom padding is 48px minimum
- [ ] Title starts at 56px from top (clears logo)
- [ ] Gap between title and subtitle (10px margin-top on subtitle)
- [ ] Labels are short enough for container width

---

## 8. Common Patterns

### Three-Card Slide

```html
<body class="col" style="width: 960px; height: 540px; background: #050A22;">
  <img src="logowhite.png" style="position: absolute; top: 24px; right: 24px; height: 22px;">
  
  <div class="fit" style="padding: 56px 24px 0 24px;">
    <p style="font-size: 28px; color: #FFFFFF; font-weight: 700; margin: 0;">Title On One Line</p>
    <p style="font-size: 14px; color: #EEFF41; margin: 10px 0 0 0;">Subtitle text</p>
  </div>
  
  <div class="fill-height row items-fill-width" style="padding: 14px 24px; gap: 14px;">
    <div class="col" style="background: linear-gradient(180deg, #12162A 0%, #0a0e1a 100%); border-radius: 12px; padding: 20px; border-left: 5px solid #ABE338;">
      <p style="font-size: 52px; color: #ABE338; opacity: 0.25; margin: 0; font-weight: 700;">01</p>
      <p style="font-size: 18px; color: #FFFFFF; margin: 4px 0 12px 0; font-weight: 700;">Card Title</p>
      <p class="fit" style="font-size: 13px; color: #F8F8F2; margin: 0; line-height: 1.6;">Body text here.</p>
      <div class="fill-height"></div>
      <div style="background: rgba(171,227,56,0.15); padding: 12px; border-radius: 8px;">
        <p style="font-size: 12px; color: #ABE338; margin: 0; font-weight: 600;">Highlight</p>
      </div>
    </div>
    <!-- Card 2 and 3 same structure -->
  </div>
  
  <div class="fit" style="padding: 8px 24px 48px 24px; text-align: center;">
    <p style="font-size: 15px; color: #EEFF41; margin: 0; font-weight: 600;">Footer tagline</p>
  </div>
</body>
```

### 2x2 Grid Slide

```html
<div class="fill-height" style="padding: 12px 24px; display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 10px;">
  <div style="background: ...; border-radius: 10px; padding: 14px; border-left: 4px solid #COLOR;">
    <!-- Cell content -->
  </div>
  <!-- 3 more cells -->
</div>
```

### CTA Slide (Centered)

```html
<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; width: 100%; padding: 0 60px;">
  <p style="font-size: 14px; color: #BB64F9; text-transform: uppercase; letter-spacing: 3px;">SECTION LABEL</p>
  <p style="font-size: 36px; color: #FFFFFF; font-weight: 700; margin: 24px 0;">Main Question Here?</p>
  <!-- CTA box -->
</div>
```

---

## 9. Anti-Patterns to Avoid

```html
<!-- âŒ Never use raw flex without framework classes -->
<div style="display: flex; flex-direction: row; align-items: stretch;">

<!-- âŒ Never let titles auto-wrap -->
<p style="font-size: 52px;">Very Long Title That Will Definitely Wrap To Multiple Lines</p>

<!-- âŒ Never skip the spacer in cards -->
<div class="col">
  <p>Title</p>
  <p>Body</p>
  <div>Highlight</div>  <!-- Will be in middle, not bottom -->
</div>

<!-- âŒ Never use insufficient bottom padding -->
<div style="padding: 8px 24px 20px 24px;">  <!-- 20px is too small -->

<!-- âŒ Never start title at top without clearing logo -->
<div style="padding: 24px;">  <!-- Title will overlap logo -->
```

---

## 10. Testing

After generating PPTX, convert to images and verify:

```bash
# Convert to PDF
soffice --headless --convert-to pdf presentation.pptx

# Convert to images
pdftoppm -jpeg -r 150 presentation.pdf slide

# Create montage for quick review
montage slide-*.jpg -tile 3x4 -geometry 300x169+5+5 review.jpg
```

Check for:
- All titles on one line
- No text overlaps
- Cards same height
- Logo visible and not overlapped
- Content not touching bottom edge