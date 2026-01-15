# Video Production & Speaker Notes

Generate speaker notes for PPTX embedding and video cue sheets for production.

---

## Embedded Speaker Notes

Speaker notes are embedded directly into each slide of the PPTX file. These serve dual purposes:
- **Live presentation**: Teleprompter/confidence monitor content for the presenter
- **Documentation**: Permanent record of intended messaging per slide

### Speaker Note Format

```
[DURATION: XX seconds]

[Full transcript for this slide]

---
KEY POINTS:
â€¢ [Bullet 1]
â€¢ [Bullet 2]
â€¢ [Bullet 3]

TRANSITION: [How to bridge to next slide]
```

### Technical Implementation

In the generation script, add notes to each slide:

```javascript
const { slide } = await html2pptx("slide01.html", pptx);
slide.addNotes(`[DURATION: 12 seconds]

AI Sovereignty. Why control is your ultimate operating leverage.

This isn't about compliance checkboxes. It's about strategic positioning in an industry that's moving faster than your governance can keep up.

---
KEY POINTS:
â€¢ Frame sovereignty as strategic advantage, not compliance burden
â€¢ Set expectation: this will challenge assumptions

TRANSITION: Lead into the "conversation flip" observation`);
```

---

## Video Cue Sheet

For video production (combining slides with audio narration), generate a timestamped cue sheet.

### Format

```markdown
# Video Cue Sheet: [Presentation Title]

**Total Runtime:** [MM:SS]
**Audio File:** [filename.mp3]
**Resolution:** 1920x1080 (16:9)

---

| Timecode | Slide | Duration | Transition | Notes |
|----------|-------|----------|------------|-------|
| 00:00:00 | 1 | 12s | Fade In (1s) | Title slide - hold for opening |
| 00:00:12 | 2 | 28s | Cut | First content slide |
| 00:00:40 | 3 | 40s | Cut | Problem establishment |
| ... | ... | ... | ... | ... |

---

## Transition Guide

- **Fade In**: Use for opening title (1 second)
- **Cut**: Standard transition between content slides
- **Fade to Black**: Use before section dividers (0.5 second)
- **Fade from Black**: Use after section dividers (0.5 second)  
- **Fade Out**: Use for closing slide (1.5 seconds)

---

## Audio Sync Markers

For precise alignment, key phrases that should align with slide transitions:

| Timecode | Slide Transition | Audio Cue (first words on new slide) |
|----------|------------------|--------------------------------------|
| 00:00:12 | 1 â†’ 2 | "Six months ago..." |
| 00:00:40 | 2 â†’ 3 | "Here's the uncomfortable truth..." |
| ... | ... | ... |
```

---

## Video Production Workflow

### Option A: Manual Video Editing (Premiere, DaVinci, Final Cut)

1. Generate audio from `transcript-plain.txt` using ElevenLabs
2. Export slides as images: 
   ```bash
   soffice --headless --convert-to pdf presentation.pptx
   pdftoppm -png -r 300 presentation.pdf slide
   ```
3. Import images and audio into video editor
4. Use `video-cuesheet.md` timecodes to align slide transitions with audio

### Option B: Automated Video Generation (FFmpeg)

```bash
# Create video from slides with specific durations
ffmpeg -loop 1 -t 12 -i slide-01.png \
       -loop 1 -t 28 -i slide-02.png \
       -loop 1 -t 40 -i slide-03.png \
       ... \
       -filter_complex "[0:v][1:v][2:v]...concat=n=12:v=1:a=0" \
       -c:v libx264 -pix_fmt yuv420p slides.mp4

# Combine with audio
ffmpeg -i slides.mp4 -i narration.mp3 \
       -c:v copy -c:a aac -shortest \
       final-presentation.mp4
```

### Option C: Programmatic Generation Script

Generate a complete FFmpeg command from the cue sheet:

```javascript
// generate-video-script.js
const cues = [
  { slide: 1, duration: 12, transition: 'fade' },
  { slide: 2, duration: 28, transition: 'cut' },
  // ...
];

let filterComplex = '';
let inputs = '';

cues.forEach((cue, i) => {
  inputs += `-loop 1 -t ${cue.duration} -i slide-${String(cue.slide).padStart(2, '0')}.png `;
  filterComplex += `[${i}:v]`;
});

filterComplex += `concat=n=${cues.length}:v=1:a=0[outv]`;

console.log(`ffmpeg ${inputs} -filter_complex "${filterComplex}" -map "[outv]" -c:v libx264 -pix_fmt yuv420p slides.mp4`);
```

---

## FFmpeg Commands

### Simple Concatenation (No Transitions)

```bash
ffmpeg \
  -loop 1 -t 12 -i slide-01.png \
  -loop 1 -t 28 -i slide-02.png \
  -loop 1 -t 40 -i slide-03.png \
  -loop 1 -t 18 -i slide-04.png \
  -loop 1 -t 35 -i slide-05.png \
  -loop 1 -t 38 -i slide-06.png \
  -loop 1 -t 32 -i slide-07.png \
  -loop 1 -t 55 -i slide-08.png \
  -loop 1 -t 45 -i slide-09.png \
  -filter_complex "[0:v][1:v][2:v][3:v][4:v][5:v][6:v][7:v][8:v]concat=n=9:v=1:a=0[outv]" \
  -map "[outv]" \
  -c:v libx264 -pix_fmt yuv420p \
  slides-only.mp4
```

### With Fade Transitions

```bash
ffmpeg \
  -loop 1 -t 13 -i slide-01.png \
  -loop 1 -t 28 -i slide-02.png \
  -loop 1 -t 40 -i slide-03.png \
  ... \
  -filter_complex "
    [0:v]fade=t=in:st=0:d=1[v0];
    [v0][1:v]xfade=transition=fade:duration=0.5:offset=12[v1];
    [v1][2:v]xfade=transition=fade:duration=0.5:offset=39.5[v2];
    ...
    [v8]fade=t=out:st=300:d=1.5[outv]
  " \
  -map "[outv]" \
  -c:v libx264 -pix_fmt yuv420p \
  slides-with-fades.mp4
```

### Combine with Audio

```bash
ffmpeg \
  -i slides-only.mp4 \
  -i narration.mp3 \
  -c:v copy -c:a aac \
  -shortest \
  final-presentation.mp4
```

---

## Platform-Specific Exports

### LinkedIn (Native Video)
```bash
# 1920x1080, H.264, <5GB, max 10 min
ffmpeg -i final-presentation.mp4 \
  -c:v libx264 -preset slow -crf 23 \
  -c:a aac -b:a 128k \
  -movflags +faststart \
  presentation-linkedin.mp4
```

### Twitter/X
```bash
# 1280x720, max 2:20, <512MB
ffmpeg -i final-presentation.mp4 \
  -t 140 \
  -vf scale=1280:720 \
  -c:v libx264 -preset slow -crf 25 \
  -c:a aac -b:a 96k \
  presentation-twitter-excerpt.mp4
```

### YouTube (High Quality)
```bash
# 1920x1080 or 4K, high bitrate
ffmpeg -i final-presentation.mp4 \
  -c:v libx264 -preset slow -crf 18 \
  -c:a aac -b:a 192k \
  -movflags +faststart \
  presentation-youtube.mp4
```

---

## Aspect Ratios & Export Settings

| Platform | Aspect Ratio | Resolution | Notes |
|----------|--------------|------------|-------|
| Standard HD | 16:9 | 1920x1080 | Default, works everywhere |
| 4K | 16:9 | 3840x2160 | For high-quality distribution |
| LinkedIn Native | 16:9 | 1920x1080 | Max 10 min, <5GB |
| LinkedIn Square | 1:1 | 1080x1080 | Better mobile engagement |
| Twitter/X | 16:9 | 1280x720 | Max 2:20, <512MB |
| Instagram Reels | 9:16 | 1080x1920 | Vertical, max 90s |
| YouTube | 16:9 | 1920x1080+ | No practical limits |

**For slide export at different aspect ratios:**

The default 960x540 HTML slides scale cleanly to:
- 1920x1080 (2x)
- 2880x1620 (3x)
- 3840x2160 (4x)

Use `-r 300` or higher with pdftoppm for crisp 4K output.

---

## YouTube Chaptering

Include chapter markers in the description:

```
00:00 Introduction
00:12 The Conversation Has Flipped
00:40 AI Sprawl Is Already Here
01:20 The Three Sovereignty Myths
01:38 Myth 1: Data Residency
02:13 Myth 2: Hybrid Cloud
02:51 Myth 3: Managed Sovereignty
03:23 What True Sovereignty Requires
04:18 The Agentic AI Threat
05:03 Triple Gate Architecture
05:45 Sovereignty as Leverage
06:23 The Strategic Choice
```

---

## Quality Checklist

Before publishing, verify:

- [ ] Audio and slides are in sync at all transition points
- [ ] No audio pops or clicks at transitions
- [ ] Text is readable at target resolution
- [ ] Fade transitions are smooth (no jarring cuts where fades expected)
- [ ] Final fade out completes cleanly
- [ ] Total runtime matches expected
- [ ] File size appropriate for target platform