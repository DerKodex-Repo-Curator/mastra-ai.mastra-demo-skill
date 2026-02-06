---
name: mastra-demo:render
description: Export the final demo video
argument-hint: "[--composition <id>] [--output <path>] [--project <path>]"
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
  - Task
---

<objective>
Render the Remotion composition to a video file.
</objective>

<context>
Arguments: $ARGUMENTS

Parse flags:
- `--composition <id>` - Composition to render (default: DemoVideo)
- `--output <path>` - Output file path (default: out/demo.mp4)
- `--project <path>` - Project directory (default: current)
</context>

<process>

1. **Find project**
   - Check for package.json with remotion in current directory or --project path
   - Error if not found

2. **Verify composition exists**
   ```bash
   npx remotion compositions
   ```
   Check that target composition is listed.

3. **Verify prerequisites**
   - Check that compose was run (state.composed === true)
   - Check that all GIFs exist in public/
   - Check that all audio files exist in public/

4. **Run Remotion render**
   ```bash
   npx remotion render <composition> <output> \
     --log=verbose
   ```

   Default:
   ```bash
   npx remotion render DemoVideo out/demo.mp4 --log=verbose
   ```

5. **Monitor progress**
   Remotion outputs progress. Watch for:
   - Frame rendering progress
   - Encoding progress
   - Any errors

6. **Verify output**
   ```bash
   # Check file exists and get info
   ls -lh <output>

   # Get video duration
   ffprobe -v quiet -show_entries format=duration -of csv=p=0 <output>

   # Get video dimensions
   ffprobe -v quiet -select_streams v:0 -show_entries stream=width,height -of csv=p=0 <output>
   ```

7. **Update state**
   ```json
   {
     "rendered": true,
     "outputFile": "<output>",
     "outputSize": "<size>",
     "outputDuration": "<duration>"
   }
   ```

8. **Report results**
   ```
   Render complete!

   Output: <output>
   Size: <size>
   Duration: <duration>
   Resolution: <width>x<height>

   Play: open <output>  # macOS
   ```

</process>

<render_options>
Additional Remotion render options:

```bash
# Different codec
npx remotion render DemoVideo out/demo.webm --codec=vp8

# Higher quality (slower)
npx remotion render DemoVideo out/demo.mp4 --crf=18

# GIF output
npx remotion render DemoVideo out/demo.gif

# Specific frame range (for testing)
npx remotion render DemoVideo out/test.mp4 --frames=0-90
```
</render_options>

<troubleshooting>
**"Composition not found"**
- Run `/mastra-demo:compose` first
- Check Root.tsx has the composition registered

**"File not found" for GIF/audio**
- Verify files exist in public/
- Check filenames match DemoVideo.tsx

**Render crashes**
- Check memory usage (large GIFs can cause issues)
- Try rendering a smaller frame range first
- Check Remotion logs for specific errors

**Output too large**
- Increase CRF value (lower quality)
- Reduce resolution
- Use more efficient codec (h265)
</troubleshooting>

<success_criteria>
- [ ] Composition verified
- [ ] All assets present
- [ ] Render completed without errors
- [ ] Output file created
- [ ] File info reported to user
</success_criteria>
