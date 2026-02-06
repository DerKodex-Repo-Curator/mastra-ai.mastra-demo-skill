---
name: mastra-demo:compose
description: Build Remotion composition with calculated durations
argument-hint: "[--project <path>]"
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - Task
---

<objective>
Generate the DemoVideo.tsx composition with correct segment durations based on audio files.
</objective>

<context>
Arguments: $ARGUMENTS

Parse flags:
- `--project <path>` - Project directory (default: current)
</context>

<process>

1. **Find project**
   - Check for DEMO_SCRIPT.md in current directory or --project path
   - Error if not found

2. **Read state file**
   ```bash
   cat .mastra-demo-state.json
   ```
   Verify all segments have audio generated.

3. **Parse DEMO_SCRIPT.md**
   Extract:
   - Settings (fps)
   - Title (text, subtitle, duration)
   - Segments (in order)
   - Outro (heading, command, links, duration)

4. **Calculate durations from audio files**
   ```bash
   for f in public/*.mp3; do
     name=$(basename "$f" .mp3)
     duration=$(ffprobe -v quiet -show_entries format=duration -of csv=p=0 "$f")
     echo "$name: $duration"
   done
   ```

   For each segment:
   - Get audio duration
   - Add 0.5s buffer for breathing room
   - Convert to frames: `durationInFrames = (seconds + 0.5) * fps`

5. **Generate src/DemoVideo.tsx**
   Read the template structure and update with actual values:

   ```tsx
   import { Sequence } from "remotion";
   import { TransitionSeries, linearTiming } from "@remotion/transitions";
   import { fade } from "@remotion/transitions/fade";
   import { TitleScene } from "./scenes/TitleScene";
   import { DemoGifScene } from "./scenes/DemoGifScene";
   import { OutroScene } from "./scenes/OutroScene";

   const FPS = <fps>;

   const TITLE_CONFIG = {
     title: "<title.text>",
     subtitle: "<title.subtitle>",
     durationInSeconds: <title.duration>,
     audioFile: "title.mp3", // or undefined
   };

   const SEGMENTS = [
     {
       id: "<segment-id>",
       gifFile: "<segment-id>.gif",
       audioFile: "<segment-id>.mp3",
       durationInSeconds: <calculated-duration>,
       browserUrl: "<segment.url>",
     },
     // ... all segments
   ];

   const OUTRO_CONFIG = {
     heading: "<outro.heading>",
     command: "<outro.command>",
     links: [<outro.links>],
     durationInSeconds: <outro.duration>,
     audioFile: "outro.mp3", // or undefined
   };

   const TRANSITION_FRAMES = 15;

   export function calculateTotalDuration(fps: number = FPS): number {
     const titleFrames = TITLE_CONFIG.durationInSeconds * fps;
     const segmentFrames = SEGMENTS.reduce(
       (sum, seg) => sum + seg.durationInSeconds * fps,
       0
     );
     const outroFrames = OUTRO_CONFIG.durationInSeconds * fps;
     const transitionCount = SEGMENTS.length + 1;
     const transitionOverlap = transitionCount * TRANSITION_FRAMES;
     return titleFrames + segmentFrames + outroFrames - transitionOverlap;
   }

   export const DemoVideo: React.FC = () => {
     return (
       <TransitionSeries>
         <TransitionSeries.Sequence
           durationInFrames={TITLE_CONFIG.durationInSeconds * FPS}
         >
           <TitleScene
             title={TITLE_CONFIG.title}
             subtitle={TITLE_CONFIG.subtitle}
             audioFile={TITLE_CONFIG.audioFile}
           />
         </TransitionSeries.Sequence>

         <TransitionSeries.Transition
           presentation={fade()}
           timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
         />

         {SEGMENTS.map((segment) => (
           <>
             <TransitionSeries.Sequence
               key={segment.id}
               durationInFrames={segment.durationInSeconds * FPS}
             >
               <DemoGifScene
                 gifSrc={segment.gifFile}
                 audioFile={segment.audioFile}
                 browserUrl={segment.browserUrl}
               />
             </TransitionSeries.Sequence>

             <TransitionSeries.Transition
               presentation={fade()}
               timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
             />
           </>
         ))}

         <TransitionSeries.Sequence
           durationInFrames={OUTRO_CONFIG.durationInSeconds * FPS}
         >
           <OutroScene
             heading={OUTRO_CONFIG.heading}
             command={OUTRO_CONFIG.command}
             links={OUTRO_CONFIG.links}
             audioFile={OUTRO_CONFIG.audioFile}
           />
         </TransitionSeries.Sequence>
       </TransitionSeries>
     );
   };
   ```

6. **Update src/Root.tsx**
   Ensure the DemoVideo composition has correct total duration:
   ```tsx
   const totalDuration = calculateTotalDuration(FPS);

   <Composition
     id="DemoVideo"
     component={DemoVideo}
     durationInFrames={totalDuration}
     fps={FPS}
     width={1920}
     height={1080}
   />
   ```

7. **Update state**
   ```json
   {
     "composed": true,
     "totalDuration": <total-seconds>
   }
   ```

8. **Report results**
   ```
   Composition built!

   DemoVideo.tsx updated with:
   - Title: <title.text> (<duration>s)
   - <N> segments totaling <total>s
   - Outro: <duration>s
   - Total duration: <total>s (<frames> frames @ <fps>fps)

   Preview: npm run dev
   Render: /mastra-demo:render
   ```

</process>

<duration_calculation>
For accurate video timing:

1. **Audio duration** - Primary source of truth
   ```bash
   ffprobe -v quiet -show_entries format=duration -of csv=p=0 file.mp3
   ```

2. **Buffer** - Add 0.5s after audio for breathing room

3. **Frame calculation**
   ```
   frames = Math.ceil((audioSeconds + 0.5) * fps)
   ```

4. **Transition overlap**
   Transitions overlap adjacent sequences, so total is:
   ```
   total = sum(sequences) - (transitionCount * transitionFrames)
   ```
</duration_calculation>

<success_criteria>
- [ ] All segments have audio files
- [ ] Durations calculated from audio
- [ ] DemoVideo.tsx updated
- [ ] Root.tsx updated with total duration
- [ ] State file updated
- [ ] User can preview with `npm run dev`
</success_criteria>
