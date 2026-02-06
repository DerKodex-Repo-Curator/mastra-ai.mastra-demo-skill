# GIF Recording Reference

This document describes browser automation patterns for recording demo GIFs using claude-in-chrome.

## Overview

The mastra-demo skill uses the claude-in-chrome MCP server to:
1. Control a Chrome browser
2. Execute scripted actions
3. Record the session as a GIF

## Setup Sequence

Every recording session starts with this setup:

```
1. tabs_context_mcp
   - Get current browser context
   - Verify MCP is connected

2. tabs_create_mcp
   - Create a new tab for recording
   - Returns tabId for subsequent calls

3. resize_window
   - Set window to 1920x1080
   - Ensures consistent recording dimensions

4. navigate
   - Go to the starting URL
   - Wait for page load
```

## Recording Workflow

### Start Recording

```
gif_creator action="start_recording" tabId=<tabId>
```

Immediately after starting:

```
computer action="screenshot" tabId=<tabId>
```

This captures the initial frame.

### Execute Actions

Execute each action from the script. Take screenshots after significant actions to ensure they're captured in the GIF.

### Stop Recording

```
computer action="screenshot" tabId=<tabId>  # Final frame
gif_creator action="stop_recording" tabId=<tabId>
```

### Export GIF

```
gif_creator action="export" tabId=<tabId> filename="segment-01-login.gif" download=true
```

The GIF is downloaded to the user's downloads folder.

## Action Mapping

### Navigate

Script:
```yaml
actions:
  - navigate: http://localhost:4111/agents
```

MCP call:
```
navigate url="http://localhost:4111/agents" tabId=<tabId>
```

### Wait

Script:
```yaml
actions:
  - wait: 2s
```

MCP call:
```
computer action="wait" duration=2 tabId=<tabId>
```

### Find Element

Script:
```yaml
actions:
  - find: "Sign In button"
```

MCP call:
```
find query="Sign In button" tabId=<tabId>
```

Returns element reference (e.g., `ref_1`).

### Click

Script:
```yaml
actions:
  - click: "Sign In button"
```

MCP calls:
```
find query="Sign In button" tabId=<tabId>
# Returns ref_1

computer action="left_click" ref="ref_1" tabId=<tabId>
```

Or with coordinates:
```
computer action="left_click" coordinate=[500, 300] tabId=<tabId>
```

### Type

Script:
```yaml
actions:
  - type: "Hello, can you help me?"
```

For input fields, use form_input:
```
form_input ref="ref_1" value="Hello, can you help me?" tabId=<tabId>
```

For general typing:
```
computer action="type" text="Hello, can you help me?" tabId=<tabId>
```

### Scroll

Script:
```yaml
actions:
  - scroll: down
```

MCP call:
```
computer action="scroll" scroll_direction="down" scroll_amount=3 tabId=<tabId>
```

### Screenshot

Script:
```yaml
actions:
  - screenshot
```

MCP call:
```
computer action="screenshot" tabId=<tabId>
```

## Best Practices

### Timing

- Add waits after navigation for page load
- Add short waits (0.5-1s) after clicks for UI updates
- Add waits before significant actions to give viewers time to see the state

### Screenshots

Take extra screenshots:
- After page loads
- Before clicking (show hover state if relevant)
- After UI changes
- At the end of each logical step

### Element Finding

Prefer descriptive queries:
- "Sign In button" over "button"
- "message input field" over "input"
- "first agent card" over "card"

If find fails, try:
1. More specific query
2. Read page to understand structure
3. Use coordinates as fallback

### Error Handling

If an action fails:
1. Take a screenshot to capture current state
2. Try alternative approach (different query, coordinates)
3. If persistent, stop recording and report issue

## Example Recording Sequence

```javascript
// Setup
await tabs_context_mcp();
const { tabId } = await tabs_create_mcp();
await resize_window({ width: 1920, height: 1080, tabId });

// Navigate to start
await navigate({ url: "http://localhost:4111", tabId });
await computer({ action: "wait", duration: 2, tabId });

// Start recording
await gif_creator({ action: "start_recording", tabId });
await computer({ action: "screenshot", tabId });

// Execute actions
const signInBtn = await find({ query: "Sign In button", tabId });
await computer({ action: "left_click", ref: signInBtn.ref, tabId });
await computer({ action: "wait", duration: 3, tabId });
await computer({ action: "screenshot", tabId });

// SSO flow
await computer({ action: "wait", duration: 2, tabId });
const googleBtn = await find({ query: "Continue with Google", tabId });
await computer({ action: "left_click", ref: googleBtn.ref, tabId });
await computer({ action: "wait", duration: 5, tabId });
await computer({ action: "screenshot", tabId });

// Stop recording
await gif_creator({ action: "stop_recording", tabId });
await gif_creator({
  action: "export",
  tabId,
  filename: "segment-01-login.gif",
  download: true
});
```

## GIF Export Options

```
gif_creator action="export" tabId=<tabId>
  filename="recording.gif"     # Output filename
  download=true                # Download to user's folder

  # Optional enhancement options:
  options={
    showClickIndicators: true,   # Orange circles at click locations
    showDragPaths: true,         # Red arrows for drags
    showActionLabels: true,      # Black labels describing actions
    showProgressBar: true,       # Orange progress bar at bottom
    showWatermark: true,         # Claude logo watermark
    quality: 10                  # 1-30, lower = better quality
  }
```

## Troubleshooting

### GIF not recording actions

- Ensure screenshots are taken after each action
- Check that wait times are sufficient
- Verify the tab hasn't closed or navigated away

### Element not found

- Read the page structure first
- Try more specific or different queries
- Check for iframes or shadow DOM
- Use coordinates as fallback

### Recording too fast/slow

- Adjust wait times in script
- Add more intermediate screenshots
- Use longer waits before important actions

### GIF too large

- Reduce quality setting
- Split into multiple segments
- Reduce resolution (not recommended)
