# Mastra Demo Skill

An [Agent Skill](https://agentskills.io) for creating professional product demo videos with browser automation, voiceover generation, and video composition.

## Features

- **Browser Automation**: Record browser interactions as GIFs using claude-in-chrome
- **Voiceover Generation**: Generate professional narration via ElevenLabs
- **Video Composition**: Compose videos with Remotion (React-based video framework)
- **Narrative Flow**: Script-first approach ensures cohesive storytelling

## Installation

### Claude Code Plugin

```bash
claude plugins add github:mastra-ai/mastra-demo-skill
```

### Manual Installation

Copy to your project's `.claude/skills/` directory:

```bash
git clone https://github.com/mastra-ai/mastra-demo-skill.git .claude/skills/mastra-demo
```

## Prerequisites

- [claude-in-chrome](https://github.com/anthropics/claude-in-chrome) MCP extension
- [ElevenLabs](https://elevenlabs.io) API key
- Node.js 18+
- ffmpeg/ffprobe

## Usage

### 1. Initialize a Project

```
/mastra-demo:init my-demo
```

Creates a new demo project with Remotion templates.

### 2. Write Your Script

```
/mastra-demo:script
```

Interactively generate a DEMO_SCRIPT.md with:
- Full narrative (continuous story)
- Segments with voiceovers
- Browser actions to record

### 3. Record GIFs

```
/mastra-demo:record
```

Records browser interactions for each segment.

### 4. Generate Audio

```
/mastra-demo:audio
```

Generates voiceover audio via ElevenLabs.

### 5. Compose Video

```
/mastra-demo:compose
```

Builds the Remotion composition with correct durations.

### 6. Render

```
/mastra-demo:render
```

Exports the final video to `out/demo.mp4`.

## Commands

| Command | Description |
|---------|-------------|
| `/mastra-demo:init <name>` | Create new demo project |
| `/mastra-demo:script` | Generate/validate script |
| `/mastra-demo:record [--segment <id>]` | Record browser GIFs |
| `/mastra-demo:audio [--segment <id>]` | Generate voiceovers |
| `/mastra-demo:compose` | Build video composition |
| `/mastra-demo:render` | Export final video |
| `/mastra-demo:status` | Show progress |

## Script Format

```markdown
# Demo: Feature Name

## Narrative
Write the full story as continuous prose...

## Settings
fps: 30
voice: Daniel

## Segments

### segment-01-intro
url: http://localhost:4111
voiceover: |
  Your narration text...
actions:
  - navigate: http://localhost:4111
  - wait: 2s
  - click: "Sign In button"

## Outro
heading: "Get Started"
command: "npx create-mastra@latest"
```

See [references/script-format-reference.md](references/script-format-reference.md) for complete format.

## Structure

```
mastra-demo-skill/
├── SKILL.md                 # Main skill definition
├── commands/                # Slash command definitions
│   ├── init.md
│   ├── script.md
│   ├── record.md
│   ├── audio.md
│   ├── compose.md
│   ├── render.md
│   └── status.md
├── references/              # Detailed documentation
│   ├── script-format-reference.md
│   ├── gif-recording-reference.md
│   └── audio-generation-reference.md
└── templates/               # Remotion project templates
    ├── package.json
    ├── src/
    │   ├── Root.tsx
    │   ├── DemoVideo.tsx
    │   └── scenes/
    └── generate-audio.cjs
```

## License

MIT

## Contributing

Contributions welcome! Please read the [Agent Skills Specification](https://agentskills.io/specification) for format guidelines.
