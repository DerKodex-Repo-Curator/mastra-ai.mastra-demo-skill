---
name: mastra-demo:record
description: Record browser actions as GIFs for demo segments
argument-hint: "[--segment <id>] [--project <path>]"
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - Task
  - AskUserQuestion
  - mcp__claude-in-chrome__tabs_context_mcp
  - mcp__claude-in-chrome__tabs_create_mcp
  - mcp__claude-in-chrome__resize_window
  - mcp__claude-in-chrome__navigate
  - mcp__claude-in-chrome__computer
  - mcp__claude-in-chrome__find
  - mcp__claude-in-chrome__form_input
  - mcp__claude-in-chrome__gif_creator
  - mcp__claude-in-chrome__read_page
---

<objective>
Record browser interactions as GIF files for demo video segments.
</objective>

<context>
Arguments: $ARGUMENTS

Parse flags:
- `--segment <id>` - Record specific segment only
- `--project <path>` - Project directory (default: current)
</context>

<process>

1. **Find project**
   - Check for DEMO_SCRIPT.md in current directory or --project path
   - Error if not found

2. **Parse DEMO_SCRIPT.md**
   - Extract all segments with their URLs and actions
   - If --segment specified, filter to just that segment

3. **Read current state**
   ```bash
   cat .mastra-demo-state.json
   ```
   - Identify which segments already have GIFs recorded

4. **For each segment to record:**

   a. **Setup browser**
      ```
      tabs_context_mcp
      tabs_create_mcp → get tabId
      resize_window width=1920 height=1080 tabId=<tabId>
      ```

   b. **Navigate to start URL**
      ```
      navigate url=<segment.url> tabId=<tabId>
      computer action="wait" duration=2 tabId=<tabId>
      ```

   c. **Start recording**
      ```
      gif_creator action="start_recording" tabId=<tabId>
      computer action="screenshot" tabId=<tabId>
      ```

   d. **Execute segment actions**
      For each action in segment.actions:

      - `navigate: <url>`
        ```
        navigate url=<url> tabId=<tabId>
        computer action="wait" duration=2 tabId=<tabId>
        ```

      - `wait: <time>`
        ```
        computer action="wait" duration=<seconds> tabId=<tabId>
        ```

      - `find: "<query>"`
        ```
        find query="<query>" tabId=<tabId>
        ```
        Store returned ref for subsequent click.

      - `click: <target>`
        If target is "found element", use last ref.
        Otherwise find first:
        ```
        find query="<target>" tabId=<tabId>
        computer action="left_click" ref=<ref> tabId=<tabId>
        computer action="wait" duration=1 tabId=<tabId>
        ```

      - `type: "<text>"`
        ```
        computer action="type" text="<text>" tabId=<tabId>
        ```

      - `scroll: <direction>`
        ```
        computer action="scroll" scroll_direction="<direction>" tabId=<tabId>
        ```

      Take screenshot after significant actions.

   e. **Stop recording and export**
      ```
      computer action="screenshot" tabId=<tabId>
      gif_creator action="stop_recording" tabId=<tabId>
      gif_creator action="export" tabId=<tabId> filename="<segment-id>.gif" download=true
      ```

   f. **Handle GIF file**
      The GIF downloads to user's Downloads folder.
      ```
      Ask user: "Move the downloaded <segment-id>.gif to <project>/public/"
      ```
      Or if Downloads path known:
      ```bash
      mv ~/Downloads/<segment-id>.gif public/
      ```

   g. **Update state**
      Update `.mastra-demo-state.json`:
      ```json
      {
        "segments": {
          "<segment-id>": {
            "gifRecorded": true,
            "gifFile": "<segment-id>.gif"
          }
        }
      }
      ```

5. **Report results**
   ```
   Recording complete!

   Recorded:
   - segment-01-intro.gif (15.2s)
   - segment-02-demo.gif (22.1s)

   GIFs saved to: public/

   Next: /mastra-demo:audio to generate voiceovers
   ```

</process>

<error_handling>
If element not found:
1. Take screenshot to see current state
2. Try alternative query
3. If still failing, ask user for help

If browser disconnects:
1. Report which segment failed
2. State is saved - user can retry just that segment
</error_handling>

<success_criteria>
- [ ] Browser automation connected
- [ ] All target segments recorded
- [ ] GIFs exported to public/
- [ ] State file updated
- [ ] User informed of results
</success_criteria>
