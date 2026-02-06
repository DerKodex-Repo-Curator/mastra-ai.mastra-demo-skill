---
name: mastra-demo:init
description: Create a new demo video project from templates
argument-hint: "<project-name>"
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
  - AskUserQuestion
  - Task
---

<objective>
Create a new demo video project with all Remotion templates and configuration.
</objective>

<context>
Project name: $ARGUMENTS

Templates location: .claude/skills/mastra-demo/templates/
</context>

<process>

1. **Validate arguments**
   - If no project name provided, ask user
   - Validate name is a valid directory name

2. **Check prerequisites**
   ```bash
   node --version  # Should be 18+
   ffprobe -version  # For audio duration
   ```

3. **Verify browser automation available**
   Call `tabs_context_mcp` to check claude-in-chrome is working.
   If fails, warn user but continue (they can record later).

4. **Create project directory**
   ```bash
   mkdir -p <project-name>/public <project-name>/out <project-name>/src/scenes <project-name>/src/components
   ```

5. **Copy template files**
   Read each template from `.claude/skills/mastra-demo/templates/` and write to project:
   - `package.json`
   - `tsconfig.json`
   - `remotion.config.ts`
   - `generate-audio.cjs`
   - `src/Root.tsx`
   - `src/DemoVideo.tsx`
   - `src/scenes/DemoGifScene.tsx`
   - `src/scenes/TitleScene.tsx`
   - `src/scenes/OutroScene.tsx`
   - `src/components/BrowserFrame.tsx`

6. **Get ElevenLabs API key**
   Ask user for their API key:
   ```
   AskUserQuestion: "Enter your ElevenLabs API key for voiceover generation"
   ```

   Create `.env`:
   ```
   ELEVENLABS_API_KEY=<key>
   ```

7. **Create empty DEMO_SCRIPT.md**
   ```markdown
   # Demo: [Your Feature]

   ## Narrative

   [Write your full story here as continuous prose...]

   ## Settings

   fps: 30
   voice: Daniel
   width: 1920
   height: 1080

   ## Title

   text: "[Your Title]"
   subtitle: "[Your Subtitle]"
   duration: 5s

   ## Segments

   ### segment-01-intro

   url: http://localhost:4111
   voiceover: |
     [Your voiceover text...]
   actions:
     - navigate: http://localhost:4111
     - wait: 2s

   ## Outro

   heading: "Get Started"
   command: "npx create-mastra@latest"
   links:
     - mastra.ai/docs
   duration: 5s
   ```

8. **Create initial state file**
   `.mastra-demo-state.json`:
   ```json
   {
     "projectName": "<project-name>",
     "createdAt": "<timestamp>",
     "settings": {
       "fps": 30,
       "width": 1920,
       "height": 1080,
       "voice": "Daniel"
     },
     "segments": {},
     "composed": false,
     "rendered": false
   }
   ```

9. **Install dependencies**
   ```bash
   cd <project-name> && npm install
   ```

10. **Report success**
    ```
    Demo project created: <project-name>/

    Next steps:
    1. Edit DEMO_SCRIPT.md with your demo content
    2. Run /mastra-demo:record to capture GIFs
    3. Run /mastra-demo:audio to generate voiceovers
    4. Run /mastra-demo:compose to build the video
    5. Run /mastra-demo:render to export

    Preview anytime: cd <project-name> && npm run dev
    ```

</process>

<success_criteria>
- [ ] Project directory created
- [ ] All template files copied
- [ ] .env file created with API key
- [ ] DEMO_SCRIPT.md created with template
- [ ] .mastra-demo-state.json initialized
- [ ] npm install completed
- [ ] User informed of next steps
</success_criteria>
