# Traefik Brand Kit

Design system extracted from official Traefik Labs presentations.

## Quick Reference

### Primary Colors
| Name | Hex | Usage |
|------|-----|-------|
| Deep Navy | `#050A22` | Primary background |
| Card BG | `#12162A` | Card/surface backgrounds |
| Code BG | `#000D24` | Code blocks, terminal |

### Accent Colors
| Name | Hex | Usage |
|------|-----|-------|
| Purple | `#BB64F9` | Primary accent, borders, trust |
| Yellow | `#EEFF41` | Highlights, emphasis, CTAs |
| Lime | `#ABE338` | Success, positive, code strings |
| Orange | `#F5AB35` | Warning, caution, secondary |
| Red | `#9B3D3D` | Error, danger, negative |
| Blue | `#4285F4` | Info, links, tertiary accent |

### Text Colors
| Name | Hex | Usage |
|------|-----|-------|
| Primary | `#FFFFFF` | Headlines, important text |
| Secondary | `#F8F8F2` | Body text |
| Muted | `#78909C` | Captions, timestamps |

### Typography
- **Display/Headlines**: Rubik (fallback: Arial)
- **Body**: Rubik (fallback: Arial)  
- **Code**: Consolas (fallback: monospace)

### Size Scale
| Level | Size | Usage |
|-------|------|-------|
| Hero | 48-58px | Title slides |
| H1 | 32px | Slide headlines |
| H2 | 18-20px | Card titles |
| Body | 13-14px | Body text |
| Small | 11-12px | Captions, labels |

## Component Styles

### Cards
```css
background: linear-gradient(180deg, #12162A 0%, #0a0e1a 100%);
border-radius: 12px;
padding: 20px;
border-left: 5px solid [accent-color];
```

### Highlight Boxes
```css
background: rgba([accent-rgb], 0.15);
padding: 12px;
border-radius: 8px;
```

### Code Blocks
```css
background: #000D24;
border: 1px solid #595959;
border-radius: 10px;
font-family: Consolas, monospace;
```

### Icon Badges
```css
width: 36px;
height: 36px;
background: rgba([accent-rgb], 0.2);
border-radius: 8px;
display: flex;
align-items: center;
justify-content: center;
```

## Logo Usage

### Placement
- Position: Top-right corner
- Top offset: 24px
- Right offset: 24px
- Height: 22px

### Code
```html
<img src="logowhite.png" 
     style="position: absolute; top: 24px; right: 24px; height: 22px;">
```

## Files Included

- `brand.config.json` - Complete design tokens
- `traefik.css` - CSS variables
- `logowhite.png` - White logo for dark backgrounds
- `logodark.png` - Dark logo for light backgrounds

## Gradient Patterns

### Card Background
```css
background: linear-gradient(180deg, #12162A 0%, #0a0e1a 100%);
```

### Purple Accent Card
```css
background: linear-gradient(180deg, #1a1040 0%, #12162A 100%);
```

### Green Accent Card
```css
background: linear-gradient(180deg, #0a1a0a 0%, #12162A 100%);
```

### Warning Card
```css
background: linear-gradient(180deg, #1a0a0a 0%, #12162A 100%);
```

### Corner Accents (Title/CTA slides)
```css
/* Top-left */
background: linear-gradient(135deg, rgba(187,100,249,0.12) 0%, transparent 70%);

/* Bottom-right */
background: linear-gradient(315deg, rgba(238,255,65,0.08) 0%, transparent 70%);
```

### Bottom Bars
```css
/* Gradient bar */
background: linear-gradient(90deg, #BB64F9, #EEFF41, #ABE338, #BB64F9);
height: 4px;

/* Solid purple fade */
background: linear-gradient(90deg, #BB64F9, transparent);
height: 3px;