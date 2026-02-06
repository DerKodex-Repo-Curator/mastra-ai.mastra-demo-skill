# DEMO_SCRIPT.md Format Reference

This document defines the format for demo scripts used by the mastra-demo skill.

## Complete Example

```markdown
# Demo: Auth & RBAC

## Narrative

This is Mastra Studio with authentication enabled. Notice the sign-in prompt at
the top of the page. Let's authenticate using WorkOS, which gives us enterprise
SSO with support for Google, Microsoft, Okta, and more.

After signing in through the SSO flow, we're redirected back to Mastra Studio,
now authenticated as an admin. As an admin, I have full access - I can open any
agent, send messages, and get responses. The execute permission lets me interact
freely with all agents and workflows.

Now here's where it gets interesting. In the WorkOS dashboard, I'll change my
role from Admin to Viewer. Viewers can read, but they can't execute.

Back in Mastra Studio, the difference is immediate. The message input is now
disabled. It says I don't have permission to execute agents. I can still see
the agent and previous conversations, but I cannot send new messages. The RBAC
system enforces this at the API level.

That's Mastra Auth. Enterprise SSO, role-based permissions, and real-time
enforcement. Change a role in WorkOS, and Mastra responds instantly.

## Settings

fps: 30
voice: Daniel
width: 1920
height: 1080

## Title

text: "Auth & RBAC"
subtitle: "Secure your Mastra applications"
duration: 5s

## Segments

### segment-01-login

url: http://localhost:4111
voiceover: |
  This is Mastra Studio with authentication enabled. Notice the sign-in
  prompt. Let's authenticate using WorkOS, which gives us enterprise SSO.
actions:
  - navigate: http://localhost:4111
  - wait: 2s
  - find: "Sign In button"
  - click: found element
  - wait: 3s

### segment-02-sso-flow

url: https://authkit.workos.com
voiceover: |
  WorkOS provides enterprise SSO with Google, Microsoft, Okta, and more.
  After signing in, we're redirected back to Mastra Studio.
actions:
  - wait: 1s
  - find: "Continue with Google button"
  - click: found element
  - wait: 5s

### segment-03-admin-demo

url: http://localhost:4111/agents
voiceover: |
  Now that we're logged in as an admin, we have full access. Watch as I
  send a message to the agent.
actions:
  - find: "agent card"
  - click: found element
  - wait: 2s
  - find: "message input"
  - type: "Hello, can you help me with something?"
  - find: "send button"
  - click: found element
  - wait: 3s

### segment-04-change-role

url: https://app.workos.com/users
voiceover: |
  Here's where it gets interesting. In the WorkOS dashboard, I'll change
  my role from Admin to Viewer. Viewers can read, but they can't execute.
actions:
  - navigate: https://app.workos.com/users
  - wait: 2s
  - find: "user row"
  - click: found element
  - wait: 1s
  - find: "role dropdown"
  - click: found element
  - find: "Viewer option"
  - click: found element
  - wait: 2s

### segment-05-permission-denied

url: http://localhost:4111/agents
voiceover: |
  Back in Mastra Studio, the difference is immediate. The message input
  is now disabled. The RBAC system enforces permissions at the API level.
actions:
  - navigate: http://localhost:4111/agents
  - wait: 2s
  - find: "agent card"
  - click: found element
  - wait: 2s
  - scroll: down

## Outro

heading: "Get Started Today"
command: "npx create-mastra@latest"
links:
  - mastra.ai/docs/auth
  - github.com/mastra-ai/mastra
duration: 5s
```

## Section Reference

### Narrative Section

**Required**: Yes

The full story written as continuous prose. This is the source of truth for
the voiceover content. Segments derive their voiceovers from this narrative.

Guidelines:
- Write 2-3 paragraphs
- Tell a cohesive story
- Include natural transitions
- Focus on the value proposition

### Settings Section

**Required**: No (has defaults)

| Setting | Default | Description |
|---------|---------|-------------|
| `fps` | 30 | Frames per second |
| `voice` | Daniel | ElevenLabs voice name |
| `width` | 1920 | Video width in pixels |
| `height` | 1080 | Video height in pixels |

### Title Section

**Required**: No (can be omitted for no title)

| Field | Required | Description |
|-------|----------|-------------|
| `text` | Yes | Main title text |
| `subtitle` | No | Subtitle/tagline |
| `duration` | No | Duration (default: 5s) |
| `audioFile` | No | Custom audio file path |

### Segments Section

**Required**: Yes (at least one segment)

Each segment is a subsection with format `### segment-<id>`:

| Field | Required | Description |
|-------|----------|-------------|
| `url` | Yes | Starting URL for the segment |
| `voiceover` | Yes | Narration text (multiline with `\|`) |
| `actions` | Yes | List of browser actions |

#### Action Types

| Action | Format | Description |
|--------|--------|-------------|
| `navigate` | `navigate: <url>` | Go to URL |
| `wait` | `wait: <time>` | Wait (e.g., "2s", "500ms") |
| `find` | `find: "<query>"` | Find element by description |
| `click` | `click: "<element>"` | Click element |
| `type` | `type: "<text>"` | Type text |
| `scroll` | `scroll: <direction>` | Scroll (up/down/left/right) |
| `screenshot` | `screenshot` | Take a screenshot |

### Outro Section

**Required**: No (can be omitted for no outro)

| Field | Required | Description |
|-------|----------|-------------|
| `heading` | Yes | Main CTA heading |
| `command` | No | CLI command to display |
| `links` | No | List of URLs to display |
| `duration` | No | Duration (default: 5s) |
| `audioFile` | No | Custom audio file path |

## Naming Conventions

### Segment IDs

Use descriptive, kebab-case IDs:
- `segment-01-login`
- `segment-02-admin-demo`
- `segment-03-change-role`

The number prefix ensures ordering. The suffix describes the content.

### Generated Files

For segment `segment-01-login`:
- GIF: `public/segment-01-login.gif`
- Audio: `public/segment-01-login.mp3`

## Validation Rules

When validating a DEMO_SCRIPT.md file:

1. **Narrative exists**: The `## Narrative` section must be present
2. **Segments have voiceovers**: Each segment must have a `voiceover` field
3. **Voiceovers match narrative**: Content should derive from the narrative
4. **Transitions are smooth**: Segments should connect naturally
5. **Actions are valid**: All actions must be recognized types
6. **URLs are valid**: All URLs should be well-formed

## Transition Phrases

Good transitions between segments:

| Starting | Examples |
|----------|----------|
| After login | "Now that we're logged in..." |
| Showing result | "Notice how..." |
| Changing context | "Here's where it gets interesting..." |
| Returning | "Back in [location], the difference is immediate..." |
| Demonstrating | "Watch as I..." |
| Explaining | "The [feature] ensures that..." |
| Concluding | "That's [feature] - [summary]." |
