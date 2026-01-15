# Audio Transcript Generation

Generate spoken-word scripts for each slide, optimized for text-to-speech synthesis (ElevenLabs, AWS Polly, etc.) or human voice-over recording.

---

## Writing for Spoken Word

### Key Differences from Written Text

| Written (Slides) | Spoken (Transcript) |
|------------------|---------------------|
| Sentence fragments OK | Complete sentences required |
| Bullet points | Flowing narrative |
| Dense, scannable | Linear, sequential |
| Reader controls pace | Speaker controls pace |
| Visual hierarchy guides | Vocal emphasis guides |

### Core Principles

1. **Write for the ear, not the eye**: Use conversational rhythm. Read it aloudâ€”if you stumble, rewrite it.

2. **One idea per breath**: Break complex sentences into digestible chunks. Average sentence length: 12-18 words.

3. **Signpost transitions**: Use verbal cues that written text doesn't need:
   - "Here's the thing..."
   - "Now, consider this..."
   - "But here's where it gets interesting..."
   - "The real question is..."

4. **Translate visual elements to verbal**: Describe what the audience is seeing:
   - "On the left, you'll see..." â†’ "Think about where you were six months ago..."
   - Three cards â†’ "There are three pillars to this..."
   - Contrast layout â†’ "On one hand... on the other..."

5. **Add breathing room**: Include natural pauses. Don't pack too much into one slide's script.

---

## Transcript Structure

For each slide, generate:

```
===========================================
SLIDE [NUMBER]: [SLIDE TITLE]
===========================================
Duration: [estimated seconds]
Tone: [delivery guidance]
-------------------------------------------

[TRANSCRIPT TEXT]

-------------------------------------------
```

---

## Timing Guidelines

| Slide Type | Target Duration | Word Count (approx) |
|------------|-----------------|---------------------|
| Title | 10-15 sec | 25-40 words |
| Section Divider | 15-20 sec | 40-55 words |
| Content (Standard) | 30-45 sec | 80-120 words |
| Content (Dense) | 45-60 sec | 120-160 words |
| Framework/Pillars | 50-70 sec | 130-180 words |
| Closing/CTA | 20-30 sec | 55-80 words |

**Total presentation target**: 5-8 minutes for 10-12 slides

---

## Tone & Delivery Markers

Include delivery guidance for each slide:

```
Tone Options:
- "Authoritative, measured" â€” for establishing credibility
- "Urgent, leaning in" â€” for problem/risk slides
- "Conversational, relatable" â€” for shared frustrations
- "Confident, resolute" â€” for solution/framework slides
- "Provocative, challenging" â€” for closing/CTA
- "Warm, conspiratorial" â€” for insider insights

Pace Markers:
- [pause] â€” 0.5-1 second pause
- [long pause] â€” 1.5-2 second pause  
- [emphasis: WORD] â€” stress this word
- [slower] â€” reduce pace for important point
- [faster] â€” increase pace for lists or buildup
```

---

## TTS Optimization

### For ElevenLabs and similar services:

1. **Punctuation controls pacing**:
   - Commas = brief pause
   - Periods = full stop
   - Em-dashes = dramatic pause
   - Ellipses (...) = trailing off / suspense

2. **Avoid TTS pitfalls**:
   - Spell out numbers under 10: "three pillars" not "3 pillars"
   - Avoid abbreviations: "versus" not "vs."
   - Spell out acronyms on first use or use phonetic: "M-C-P" not "MCP"
   - Use hyphens for compound modifiers read as units: "board-level" 

3. **SSML hints** (optional, for advanced TTS control):
   ```xml
   <break time="500ms"/> <!-- explicit pause -->
   <emphasis level="strong">control</emphasis> <!-- stress word -->
   <prosody rate="slow">This is the key point.</prosody> <!-- pace change -->
   ```

4. **Sentence rhythm**: Vary sentence length. Follow a long sentence with a short one. Creates natural cadence.

---

## Transcript Writing Patterns

### Opening Hook (Title Slide)
```
Don't start with "Welcome to this presentation about..."

Instead, start with tension:
"Six months ago, every boardroom was asking the same question: How do we adopt AI? [pause] Today? The conversation has completely flipped."
```

### Transitioning Between Slides
```
Avoid: "Moving on to the next slide..."
Avoid: "Now let's talk about..."

Instead, use content bridges:
"And that brings us to the real danger..."
"So if that's the myth, what's the reality?"
"But here's what most people miss..."
"Now, knowing all this, what do you actually do?"
```

### Framework/Pillar Slides
```
Structure: Setup â†’ Walk through each â†’ Reinforce

"True sovereignty isn't a single checkbox. It requires three thingsâ€”and if you're missing any one of them, you're exposed.

First: Architectural Control. [pause] Can you run your entire AI stackâ€”gateway, models, safety systemsâ€”in your own environment? No required external connections. If you pull the network cable, does the system keep working?

Second: Portable Governance. Your policies and security controls need to follow your workload. The same rules should apply whether you're in the public cloud, on-prem, or in an air-gapped bunker. Governance as codeâ€”not buttons in a console you can't export.

Thirdâ€”and this is the litmus testâ€”Escape Velocity. [pause] Can you leave? If a vendor changes terms or a geopolitical event makes your setup risky, can you migrate your stack without rewriting it?

You own it. You control it. You can move it. That's sovereignty."
```

### Closing/CTA
```
End with a question or challenge, not a summary:

"So here's the strategic choice in front of you: [pause] Are you building on infrastructure that gives you options? Or are you making decisions right nowâ€”todayâ€”that eliminate sovereignty as a possibility later?

You can innovate fast and maintain control. [pause] But you have to architect for it now."

[long pause]

"That's what we're building at Traefik Labs."
```

---

## Voice Casting Guidance

### For ElevenLabs or voice talent selection:

| Presentation Tone | Voice Characteristics |
|-------------------|----------------------|
| Enterprise/Executive | Male or female, 35-50 age range, measured pace, authoritative without being stiff, American or British neutral accent |
| Technical/Developer | Slightly faster pace, precise diction, comfortable with technical terms, enthusiastic but not salesy |
| Startup/Pitch | Energetic, confident, conversational, younger feel, builds momentum |
| Thought Leadership | Warm, wise, reflective pace, draws you in, NPR-podcast quality |

### ElevenLabs recommended voices (as of late 2024):
- "Adam" â€” Deep, authoritative, great for enterprise content
- "Rachel" â€” Clear, professional, versatile
- "Antoni" â€” Warm, engaging, good for conversational
- "Domi" â€” Confident, younger energy

### Settings recommendations:
- Stability: 0.50-0.65 (too high = robotic, too low = erratic)
- Clarity + Similarity Enhancement: 0.75+
- Style Exaggeration: 0.0-0.3 (keep low for professional content)

---

## Output File Formats

### transcript-full.md (annotated version)
```markdown
# Presentation Transcript: [Title]

Total Duration: ~[X] minutes
Voice Recommendation: [guidance]

---

## Slide 1: [Title]
**Duration:** 12 seconds | **Tone:** Authoritative, measured

[Transcript text with [pause] markers and delivery notes]

---

## Slide 2: [Title]
...
```

### transcript-plain.txt (TTS-ready)
```
[Clean transcript text only, one slide per paragraph, separated by blank lines. 
No markers, no annotations. Punctuation used for pacing.]
```

### transcript-ssml.xml (optional, for advanced TTS)
```xml
<?xml version="1.0" encoding="UTF-8"?>
<speak version="1.1" xmlns="http://www.w3.org/2001/10/synthesis">
  
  <!-- Slide 1 -->
  <p>
    <s>Six months ago, every boardroom was asking the same question: How do we adopt AI?</s>
    <break time="500ms"/>
    <s>Today? <emphasis level="strong">The conversation has completely flipped.</emphasis></s>
  </p>
  
  <!-- Slide 2 -->
  ...
  
</speak>
```