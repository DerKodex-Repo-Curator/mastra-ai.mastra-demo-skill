/**
 * Audio Generation Script for Mastra Demo Videos
 *
 * Usage:
 *   node generate-audio.cjs
 *
 * Requires:
 *   - ELEVENLABS_API_KEY in .env file
 *   - segments array defined below (or parsed from DEMO_SCRIPT.md)
 */

const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const API_KEY = process.env.ELEVENLABS_API_KEY;

if (!API_KEY) {
  console.error('Error: ELEVENLABS_API_KEY not found in .env');
  console.error('Please add your ElevenLabs API key to .env file:');
  console.error('  ELEVENLABS_API_KEY=sk_xxxxx');
  process.exit(1);
}

// ============================================================
// CONFIGURE YOUR SEGMENTS HERE
// ============================================================
// Each segment should have:
//   - id: unique identifier (used for filename)
//   - text: voiceover text
//
// These should match your DEMO_SCRIPT.md segments.
// ============================================================

const segments = [
  {
    id: 'title',
    text: 'Welcome to your demo.'
  },
  {
    id: 'segment-01',
    text: 'Replace this with your first segment voiceover text.'
  },
  {
    id: 'segment-02',
    text: 'Replace this with your second segment voiceover text.'
  },
  {
    id: 'outro',
    text: 'Get started today.'
  }
];

// ============================================================

const outputDir = path.join(__dirname, 'public');

// Preferred voice names (in order of preference)
const PREFERRED_VOICES = ['Daniel', 'Brian', 'George', 'Chris', 'Eric'];

async function getVoices() {
  const response = await fetch('https://api.elevenlabs.io/v1/voices', {
    headers: {
      'xi-api-key': API_KEY
    }
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to fetch voices: ${response.status} - ${error}`);
  }

  return response.json();
}

async function generateAudio(text, voiceId, filename) {
  console.log(`Generating: ${path.basename(filename)}...`);

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
        text: text,
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
  console.log(`  Saved: ${path.basename(filename)}`);
}

async function main() {
  console.log('Mastra Demo Audio Generator\n');

  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Get available voices
  console.log('Fetching available voices...');
  const voicesData = await getVoices();

  // Find a good premade voice (free tier only has premade voices)
  const premadeVoices = voicesData.voices?.filter(v => v.category === 'premade') || [];

  let voice = premadeVoices.find(v =>
    PREFERRED_VOICES.some(pv => v.name.startsWith(pv))
  );

  if (!voice && premadeVoices.length > 0) {
    voice = premadeVoices[0];
  }

  if (!voice) {
    console.log('Available voices:', JSON.stringify(voicesData, null, 2));
    throw new Error('No premade voices available');
  }

  console.log(`Using voice: ${voice.name} (${voice.voice_id})\n`);

  // Generate audio for each segment
  let totalCharacters = 0;
  for (const segment of segments) {
    const filename = path.join(outputDir, `${segment.id}.mp3`);
    await generateAudio(segment.text, voice.voice_id, filename);
    totalCharacters += segment.text.length;

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`\nTotal characters used: ${totalCharacters}`);
  console.log(`Audio files generated in: ${outputDir}`);

  // Create a manifest file for reference
  const manifest = segments.map(s => ({
    id: s.id,
    file: `${s.id}.mp3`,
    text: s.text,
    characters: s.text.length
  }));

  const manifestPath = path.join(outputDir, 'audio-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`Manifest created: ${path.basename(manifestPath)}`);

  // Reminder about durations
  console.log('\nNext step: Get audio durations with ffprobe:');
  console.log('  ffprobe -v quiet -show_entries format=duration -of csv=p=0 public/<file>.mp3');
}

main().catch(error => {
  console.error('\nError:', error.message);
  process.exit(1);
});
