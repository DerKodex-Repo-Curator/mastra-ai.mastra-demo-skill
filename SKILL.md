---
name: mastra-demo
description: Create professional demo videos with browser automation (GIF recording), ElevenLabs voiceover generation, and Remotion video composition. Automates the full workflow from script to rendered video.
---

# Mastra Demo Skill

Create professional product demo videos by combining:
- **Browser automation** for GIF recording (via claude-in-chrome MCP)
- **ElevenLabs** voiceover generation
- **Remotion** video composition

## Commands

| Command | Purpose |
|---------|---------|
| `/mastra-demo:init <name>` | Create new demo project from templates |
| `/mastra-demo:script` | Generate or validate DEMO_SCRIPT.md |
| `/mastra-demo:record` | Record browser actions as GIFs |
| `/mastra-demo:audio` | Generate voiceovers via ElevenLabs |
| `/mastra-demo:compose` | Build Remotion composition |
| `/mastra-demo:render` | Export final video |
| `/mastra-demo:status` | Show progress and next steps |

## Quick Start

```bash
# 1. Create a new demo project
/mastra-demo:init my-awesome-demo

# 2. Edit DEMO_SCRIPT.md with your content (or generate interactively)
/mastra-demo:script

# 3. Record browser GIFs for each segment
/mastra-demo:record

# 4. Generate voiceovers
/mastra-demo:audio

# 5. Build the video composition
/mastra-demo:compose

# 6. Render the final video
/mastra-demo:render
```

## Prerequisites

- **claude-in-chrome MCP**: Browser automation extension for GIF recording
- **ElevenLabs API key**: For voiceover generation
- **Node.js 18+**: For Remotion
- **ffprobe**: For audio duration detection (comes with ffmpeg)

## Project Structure

Demo projects created by this skill have this structure:

```
my-demo/
├── .env                    # ELEVENLABS_API_KEY
├── .mastra-demo-state.json # Execution state
├── DEMO_SCRIPT.md          # Script with segments
├── package.json            # Remotion dependencies
├── public/                 # Assets (GIFs, audio)
│   ├── segment-01.gif
│   ├── segment-01.mp3
│   └── ...
├── out/                    # Rendered output
│   └── demo.mp4
└── src/
    ├── Root.tsx
    ├── DemoVideo.tsx
    └── scenes/
```

## Script Format

DEMO_SCRIPT.md defines your demo:

```markdown
# Demo: Feature Name

## Narrative
Write the full story as continuous prose first.
This ensures natural flow across segments.

## Settings
fps: 30
voice: Daniel

## Title
text: "Feature Name"
subtitle: "Tagline"
duration: 5s

## Segments

### segment-01-intro
url: http://localhost:4111
voiceover: |
  This is the opening narration that connects
  naturally to the narrative above.
actions:
  - navigate: http://localhost:4111
  - wait: 2s
  - find: "Sign In button"
  - click: found element

## Outro
heading: "Get Started"
command: "npx create-mastra@latest"
links:
  - mastra.ai/docs
```

## Narrative Flow

The key to great demos is **narrative flow**. Even though we record individual GIFs and audio segments, the voiceover must tell a cohesive story.

**Good transitions:**
- "Now that we're logged in..."
- "Here's where it gets interesting..."
- "Back in Mastra Studio, the difference is immediate..."

**Bad patterns:**
- Abrupt segment starts without context
- Bullet-point style narration
- No connection between segments

## Browser Actions

Available actions for recording:

| Action | Format | Example |
|--------|--------|---------|
| Navigate | `navigate: <url>` | `navigate: http://localhost:4111` |
| Wait | `wait: <time>` | `wait: 2s` |
| Find | `find: "<query>"` | `find: "Sign In button"` |
| Click | `click: <target>` | `click: found element` |
| Type | `type: "<text>"` | `type: "Hello world"` |
| Scroll | `scroll: <dir>` | `scroll: down` |

## Voice Settings

Recommended ElevenLabs settings for professional demos:
- **Voice**: Daniel, Brian, George, or Chris
- **Model**: eleven_multilingual_v2
- **Stability**: 0.5
- **Similarity boost**: 0.75

## References

For detailed documentation:
- `references/script-format-reference.md` - Complete DEMO_SCRIPT.md format
- `references/gif-recording-reference.md` - Browser automation patterns
- `references/audio-generation-reference.md` - ElevenLabs integration

## Templates

The `templates/` directory contains Remotion project files:
- React components for scenes (Title, DemoGif, Outro)
- Browser frame component
- Audio generation script
- Package configuration
