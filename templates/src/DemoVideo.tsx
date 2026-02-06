import { Sequence } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { TitleScene } from "./scenes/TitleScene";
import { DemoGifScene } from "./scenes/DemoGifScene";
import { OutroScene } from "./scenes/OutroScene";

// ============================================================
// CONFIGURE YOUR DEMO VIDEO HERE
// ============================================================
// Update these values based on your DEMO_SCRIPT.md and generated
// audio files. Use ffprobe to get audio durations:
//   ffprobe -v quiet -show_entries format=duration -of csv=p=0 file.mp3
// ============================================================

const FPS = 30;

// Title scene configuration
const TITLE_CONFIG = {
  title: "Your Demo Title",
  subtitle: "Your demo subtitle",
  durationInSeconds: 5,
  audioFile: "title.mp3", // Set to undefined if no audio
};

// Demo segments (update with your actual segments)
const SEGMENTS = [
  {
    id: "segment-01",
    gifFile: "segment-01.gif",
    audioFile: "segment-01.mp3",
    durationInSeconds: 10, // Calculated from audio duration + buffer
    browserUrl: "localhost:4111",
  },
  {
    id: "segment-02",
    gifFile: "segment-02.gif",
    audioFile: "segment-02.mp3",
    durationInSeconds: 12,
    browserUrl: "localhost:4111/agents",
  },
  // Add more segments as needed
];

// Outro configuration
const OUTRO_CONFIG = {
  heading: "Get Started Today",
  command: "npx create-mastra@latest",
  links: ["mastra.ai/docs", "github.com/mastra-ai/mastra"],
  durationInSeconds: 5,
  audioFile: "outro.mp3", // Set to undefined if no audio
};

// Transition duration in frames
const TRANSITION_FRAMES = 15;

// ============================================================

/**
 * Calculate total video duration in frames
 */
export function calculateTotalDuration(fps: number = FPS): number {
  const titleFrames = TITLE_CONFIG.durationInSeconds * fps;
  const segmentFrames = SEGMENTS.reduce(
    (sum, seg) => sum + seg.durationInSeconds * fps,
    0
  );
  const outroFrames = OUTRO_CONFIG.durationInSeconds * fps;

  // Account for transitions (they overlap)
  const transitionCount = SEGMENTS.length + 1; // Between title-segments and segments-outro
  const transitionOverlap = transitionCount * TRANSITION_FRAMES;

  return titleFrames + segmentFrames + outroFrames - transitionOverlap;
}

/**
 * Main demo video composition
 */
export const DemoVideo: React.FC = () => {
  return (
    <TransitionSeries>
      {/* Title Scene */}
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

      {/* Demo Segments */}
      {SEGMENTS.map((segment, index) => (
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

      {/* Outro Scene */}
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
