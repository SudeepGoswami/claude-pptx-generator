# Slide Generation Prompt

Use this prompt to generate the actual HTML slide files from your headlines and brand kit.

---

## Prompt

```
Generate HTML slides for this presentation.

## Headlines
[PASTE HEADLINES FROM PHASE 2]

## Brand Kit
Location: /path/to/brand-kits/traefik/
- Colors: [reference brand.config.json]
- Logo: logo-white.png

## Technical Requirements

### Canvas
- Width: 960px
- Height: 540px
- Aspect: 16:9

### Margins
- Sides: 24px minimum
- Bottom: 48px minimum (critical for PPTX)

### Logo Placement
```html
<img src="logo-white.png" style="position: absolute; top: 24px; right: 24px; height: 22px;">
```

### Text Wrapping
ALL text must be in <p>, <h1>-<h6>, <ul>, or <ol> tags.
NEVER put bare text in a <div>.

### Borders
Borders ONLY on <div> elements, never on text elements.

---

## Slide Templates to Use

### Title Slide (Slide 1)
- Centered layout
- Gradient accent bar
- Large title, subtitle in highlight color
- Audience badges at bottom
- Corner gradient accents
- Bottom gradient bar

### Comparison Slide (Slide 2, etc.)
- Two columns: before/after
- Arrow between columns
- Bottom callout bar

### Three-Card Slide (Slide 5, etc.)
- Header with subtitle
- Three equal columns with numbers
- Each card: title, body, highlight box
- Footer tagline

### 2x2 Grid Slide (Slide 3, etc.)
- Four quadrants
- Icon + title + body per cell
- Consistent accent color

### Architecture Slide (Slide 7, etc.)
- Three connected components
- Color-coded (purple, green, blue)
- Bottom callout bar

### CTA Slide (Slide 9)
- Section label
- Main question
- Answer box with border
- URL with decorative elements
- Corner accents, bottom bar

---

## Design Patterns for Polish

### Card with Highlight Box
```html
<div style="flex: 1; background: linear-gradient(180deg, #12162A 0%, #0a0e1a 100%); 
            border-radius: 12px; padding: 20px; border-left: 5px solid #ABE338; 
            display: flex; flex-direction: column;">
  <p style="font-size: 52px; color: #ABE338; margin: 0; font-weight: 700; opacity: 0.25;">01</p>
  <p style="font-size: 18px; color: #FFFFFF; margin: 4px 0 12px 0; font-weight: 700;">Title</p>
  <p style="font-size: 13px; color: #F8F8F2; margin: 0; line-height: 1.6; flex: 1;">Body text</p>
  <div style="background: rgba(171,227,56,0.15); padding: 12px; border-radius: 8px; margin-top: 12px;">
    <p style="font-size: 12px; color: #ABE338; margin: 0; font-weight: 600;">Highlight text</p>
  </div>
</div>
```

### Icon Badge Header
```html
<div style="display: flex; align-items: center; gap: 10px; margin-bottom: 14px;">
  <div style="width: 36px; height: 36px; background: rgba(187,100,249,0.2); 
              border-radius: 8px; display: flex; align-items: center; justify-content: center;">
    <p style="font-size: 18px; margin: 0;">ðŸ’ª</p>
  </div>
  <p style="font-size: 14px; color: #BB64F9; margin: 0; font-weight: 700; 
            text-transform: uppercase; letter-spacing: 1px;">TITLE</p>
</div>
```

### Bottom Callout Bar
```html
<div style="background: linear-gradient(90deg, rgba(245,171,53,0.15), rgba(245,171,53,0.05)); 
            border-radius: 10px; padding: 16px 20px; border-left: 4px solid #F5AB35;">
  <p style="font-size: 15px; color: #F5AB35; margin: 0 0 6px 0; font-weight: 600;">Headline</p>
  <p style="font-size: 12px; color: #F8F8F2; margin: 0;">Supporting text</p>
</div>
```

---

## Output

Generate complete HTML files:
- slide01.html (Title)
- slide02.html (Hook)
- slide03.html (Problem)
- slide04.html (False Solutions)
- slide05.html (True Solution)
- slide06.html (New Threat)
- slide07.html (Architecture)
- slide08.html (Benefits)
- slide09.html (CTA)

Each file should be a complete, valid HTML document that passes html2pptx validation.
```

---

## Validation Checklist

Before generating PPTX, verify each slide:
- [ ] Has logo in top-right
- [ ] All text is wrapped in tags
- [ ] No borders on text elements
- [ ] Bottom padding â‰¥ 48px
- [ ] Side padding â‰¥ 24px
- [ ] Cards fill vertical space
- [ ] Colors match brand kit