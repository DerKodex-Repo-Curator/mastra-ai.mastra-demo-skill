# Audio Generation Reference

This document describes ElevenLabs integration patterns for voiceover generation.

## Overview

The mastra-demo skill uses ElevenLabs API to generate professional voiceovers for demo videos.

## API Setup

### API Key

Store in `.env`:
```
ELEVENLABS_API_KEY=sk_xxxxx
```

### Available Voices

Get list of available voices:
```javascript
const response = await fetch('https://api.elevenlabs.io/v1/voices', {
  headers: {
    'xi-api-key': API_KEY
  }
});
const { voices } = await response.json();
```

### Recommended Voices

For demo narration (professional, clear):
- **Daniel** - Steady broadcaster voice
- **Brian** - Deep, resonant
- **George** - British, authoritative
- **Chris** - American, friendly

Free tier only has access to premade voices.

## Text-to-Speech API

### Request

```javascript
const response = await fetch(
  `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
  {
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': API_KEY
    },
    body: JSON.stringify({
      text: 'Your voiceover text here',
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.0,
        use_speaker_boost: true
      }
    })
  }
);

const audioBuffer = await response.arrayBuffer();
fs.writeFileSync('output.mp3', Buffer.from(audioBuffer));
```

### Voice Settings

| Setting | Range | Description |
|---------|-------|-------------|
| `stability` | 0-1 | Higher = more consistent, lower = more expressive |
| `similarity_boost` | 0-1 | Higher = closer to original voice |
| `style` | 0-1 | Style exaggeration (v2 model only) |
| `use_speaker_boost` | bool | Enhance voice clarity |

**Recommended for demos:**
- `stability: 0.5` - Balanced
- `similarity_boost: 0.75` - Natural sound
- `style: 0.0` - No exaggeration
- `use_speaker_boost: true` - Clear audio

### Models

| Model | ID | Description |
|-------|-----|-------------|
| Multilingual v2 | `eleven_multilingual_v2` | Best quality, supports 29 languages |
| Turbo v2.5 | `eleven_turbo_v2_5` | Faster, English optimized |
| Monolingual v1 | `eleven_monolingual_v1` | Legacy, English only |

Use `eleven_multilingual_v2` for best quality.

## Audio Duration

Get audio duration with ffprobe:
```bash
ffprobe -v quiet -show_entries format=duration -of csv=p=0 audio.mp3
```

Returns duration in seconds (e.g., `14.523`).

## generate-audio.cjs Template

```javascript
const fs = require('fs');
const path = require('path');

// Load API key from environment
require('dotenv').config();
const API_KEY = process.env.ELEVENLABS_API_KEY;

if (!API_KEY) {
  console.error('Error: ELEVENLABS_API_KEY not found in .env');
  process.exit(1);
}

// Read segments from DEMO_SCRIPT.md or define inline
const segments = [
  {
    id: 'segment-01-login',
    text: 'Your voiceover text here...'
  },
  // ... more segments
];

const outputDir = path.join(__dirname, 'public');

async function getVoices() {
  const response = await fetch('https://api.elevenlabs.io/v1/voices', {
    headers: { 'xi-api-key': API_KEY }
  });
  return response.json();
}

async function generateAudio(text, voiceId, filename) {
  console.log(`Generating: ${filename}...`);

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': API_KEY
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true
        }
      })
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API error: ${response.status} - ${error}`);
  }

  const buffer = await response.arrayBuffer();
  fs.writeFileSync(filename, Buffer.from(buffer));
  console.log(`  Saved: ${filename}`);
}

async function main() {
  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Get available voices
  console.log('Fetching voices...\n');
  const { voices } = await getVoices();

  // Find preferred voice
  const premade = voices.filter(v => v.category === 'premade');
  const preferred = ['Daniel', 'Brian', 'George', 'Chris'];
  let voice = premade.find(v =>
    preferred.some(p => v.name.startsWith(p))
  ) || premade[0];

  if (!voice) {
    throw new Error('No suitable voice found');
  }

  console.log(`Using voice: ${voice.name}\n`);

  // Generate audio for each segment
  for (const segment of segments) {
    const filename = path.join(outputDir, `${segment.id}.mp3`);
    await generateAudio(segment.text, voice.voice_id, filename);
    // Rate limit delay
    await new Promise(r => setTimeout(r, 500));
  }

  console.log('\nDone! Audio files in:', outputDir);
}

main().catch(console.error);
```

## Narrative Flow Preservation

### Consistency

Use the SAME voice settings for ALL segments:
- Same voice ID
- Same stability/similarity settings
- Same model

### Generation Order

Generate segments in sequence order:
1. Title voiceover (if any)
2. Segment 1, 2, 3... in order
3. Outro voiceover (if any)

### Preview

Concatenate all audio to hear the full narrative:
```bash
# Create file list
ls -1 public/*.mp3 | sort > /tmp/audio-list.txt

# Convert to ffmpeg format
sed 's/^/file /' /tmp/audio-list.txt > /tmp/concat.txt

# Concatenate
ffmpeg -f concat -safe 0 -i /tmp/concat.txt -c copy /tmp/preview.mp3

# Play (macOS)
afplay /tmp/preview.mp3
```

Or with a single command:
```bash
ffmpeg -f concat -i <(for f in $(ls -1 public/*.mp3 | sort); do echo "file '$f'"; done) -c copy /tmp/preview.mp3 && afplay /tmp/preview.mp3
```

## Error Handling

### Rate Limiting

ElevenLabs has rate limits. Add delays between requests:
```javascript
await new Promise(r => setTimeout(r, 500)); // 500ms delay
```

### API Errors

Common errors:
- `401 Unauthorized`: Invalid API key
- `422 Unprocessable Entity`: Invalid voice ID or parameters
- `429 Too Many Requests`: Rate limited, add delays

### Quota

Free tier has limited characters per month. Check usage:
```javascript
const response = await fetch('https://api.elevenlabs.io/v1/user', {
  headers: { 'xi-api-key': API_KEY }
});
const { subscription } = await response.json();
console.log('Characters remaining:',
  subscription.character_limit - subscription.character_count
);
```

## Best Practices

### Text Preparation

- Remove markdown formatting
- Expand abbreviations ("RBAC" → "Role-Based Access Control" first time)
- Add punctuation for natural pauses
- Keep sentences concise

### Pronunciation

For technical terms, spell phonetically if needed:
- "nginx" → "engine-x"
- "API" → "A P I" (or leave as-is, usually works)

### Pacing

Use punctuation to control pacing:
- Period for full stop
- Comma for brief pause
- Ellipsis for longer pause
- Em-dash for emphasis pause

Example:
```
"This is Mastra Studio... with authentication enabled.
Notice the sign-in prompt. Let's authenticate — using WorkOS."
```
