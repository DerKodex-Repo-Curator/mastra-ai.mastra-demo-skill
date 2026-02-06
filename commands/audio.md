---
name: mastra-demo:audio
description: Generate voiceover audio using ElevenLabs
argument-hint: "[--segment <id>] [--preview] [--project <path>]"
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - Task
  - AskUserQuestion
  - WebFetch
---

<objective>
Generate voiceover audio files for demo segments using ElevenLabs API.
</objective>

<context>
Arguments: $ARGUMENTS

Parse flags:
- `--segment <id>` - Generate for specific segment only
- `--preview` - Concatenate and play all audio back-to-back
- `--project <path>` - Project directory (default: current)
</context>

<process>

1. **Find project**
   - Check for DEMO_SCRIPT.md in current directory or --project path
   - Error if not found

2. **Read API key**
   ```bash
   source .env && echo $ELEVENLABS_API_KEY
   ```
   Error if not set.

3. **If --preview mode:**
   Skip to step 7 (preview existing audio).

4. **Parse DEMO_SCRIPT.md**
   - Extract settings (voice preference)
   - Extract title voiceover (if any)
   - Extract all segment voiceovers
   - Extract outro voiceover (if any)
   - If --segment specified, filter to just that segment

5. **Get voice ID**
   ```bash
   curl -s "https://api.elevenlabs.io/v1/voices" \
     -H "xi-api-key: $ELEVENLABS_API_KEY" | \
     jq -r '.voices[] | select(.name | startswith("Daniel")) | .voice_id'
   ```
   Use voice from settings, fallback to Daniel.

6. **Generate audio for each segment:**

   For each voiceover text:

   a. **Call ElevenLabs API**
      ```bash
      curl -X POST "https://api.elevenlabs.io/v1/text-to-speech/<voice-id>" \
        -H "Accept: audio/mpeg" \
        -H "Content-Type: application/json" \
        -H "xi-api-key: $ELEVENLABS_API_KEY" \
        -d '{
          "text": "<voiceover-text>",
          "model_id": "eleven_multilingual_v2",
          "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.75,
            "style": 0.0,
            "use_speaker_boost": true
          }
        }' \
        --output public/<segment-id>.mp3
      ```

   b. **Get duration**
      ```bash
      ffprobe -v quiet -show_entries format=duration -of csv=p=0 public/<segment-id>.mp3
      ```

   c. **Update state**
      ```json
      {
        "segments": {
          "<segment-id>": {
            "audioGenerated": true,
            "audioFile": "<segment-id>.mp3",
            "audioDuration": <duration>
          }
        }
      }
      ```

   d. **Rate limit delay**
      ```bash
      sleep 0.5
      ```

7. **Preview mode (--preview)**
   Concatenate all audio and play:
   ```bash
   # Create concat list
   ls -1 public/*.mp3 | sort | while read f; do echo "file '$f'"; done > /tmp/concat.txt

   # Concatenate
   ffmpeg -y -f concat -safe 0 -i /tmp/concat.txt -c copy /tmp/demo-preview.mp3

   # Play (macOS)
   afplay /tmp/demo-preview.mp3
   ```

   Report total duration and ask for feedback.

8. **Report results**
   ```
   Audio generation complete!

   Generated:
   - title.mp3 (4.2s)
   - segment-01-intro.mp3 (12.5s)
   - segment-02-demo.mp3 (18.3s)
   - outro.mp3 (5.1s)

   Total duration: 40.1s

   Preview: /mastra-demo:audio --preview
   Next: /mastra-demo:compose to build the video
   ```

</process>

<voice_settings>
Recommended for professional demos:
- `stability: 0.5` - Balanced consistency
- `similarity_boost: 0.75` - Natural sound
- `style: 0.0` - No exaggeration
- `use_speaker_boost: true` - Clear audio

Preferred voices (in order):
1. Daniel - Steady broadcaster
2. Brian - Deep, resonant
3. George - British, authoritative
4. Chris - American, friendly
</voice_settings>

<narrative_validation>
Before generating, validate narrative flow:

1. Read all voiceovers in sequence
2. Check for smooth transitions
3. Flag segments that start abruptly
4. Warn if disconnected from narrative

Good transitions:
- "Now that we're logged in..."
- "Here's where it gets interesting..."
- "Back in Mastra Studio..."
</narrative_validation>

<success_criteria>
- [ ] API key loaded
- [ ] Voice ID resolved
- [ ] All voiceovers generated
- [ ] Durations captured
- [ ] State file updated
- [ ] Files saved to public/
</success_criteria>
