import { AbsoluteFill, Sequence, staticFile, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { Gif } from "@remotion/gif";
import { BrowserFrame } from "../components/BrowserFrame";

type GifSegment = {
  src: string;
  durationInFrames: number;
  browserUrl?: string;
};

type DemoGifSceneProps = {
  // Single GIF mode
  gifSrc?: string;
  browserUrl?: string;
  // Multi-GIF mode (for complex sequences)
  gifSegments?: GifSegment[];
  // Audio file
  audioFile?: string;
  // Legacy: multiple audio segments
  audioSegments?: { file: string; durationInFrames: number }[];
};

/**
 * DemoGifScene - Displays a GIF within a browser frame with audio
 *
 * Usage:
 *   <DemoGifScene
 *     gifSrc="segment-01.gif"
 *     audioFile="segment-01.mp3"
 *     browserUrl="localhost:4111/agents"
 *   />
 *
 * For multiple GIFs in sequence:
 *   <DemoGifScene
 *     gifSegments={[
 *       { src: "step1.gif", durationInFrames: 90, browserUrl: "localhost:4111" },
 *       { src: "step2.gif", durationInFrames: 120, browserUrl: "localhost:4111/agents" },
 *     ]}
 *     audioFile="segment.mp3"
 *   />
 */
export const DemoGifScene: React.FC<DemoGifSceneProps> = ({
  gifSrc,
  browserUrl = "localhost:4111",
  gifSegments,
  audioFile,
  audioSegments,
}) => {
  const { durationInFrames } = useVideoConfig();

  // Multi-GIF mode: calculate start frames for each GIF segment
  const gifsWithStartFrames = gifSegments
    ? (() => {
        let currentFrame = 0;
        return gifSegments.map((segment) => {
          const startFrame = currentFrame;
          currentFrame += segment.durationInFrames;
          return { ...segment, startFrame };
        });
      })()
    : null;

  // Legacy audio segments mode
  const audioWithStartFrames = audioSegments
    ? (() => {
        let currentFrame = 0;
        return audioSegments.map((segment) => {
          const startFrame = currentFrame;
          currentFrame += segment.durationInFrames;
          return { ...segment, startFrame };
        });
      })()
    : null;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#1a1a2e",
        justifyContent: "center",
        alignItems: "center",
        padding: 40,
      }}
    >
      {/* Subtle background gradient */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background:
            "radial-gradient(ellipse at top left, rgba(139, 92, 246, 0.05) 0%, transparent 50%)",
        }}
      />

      {/* Browser frame with GIF(s) */}
      {gifsWithStartFrames ? (
        /* Multi-GIF mode */
        gifsWithStartFrames.map((segment, index) => (
          <Sequence
            key={index}
            from={segment.startFrame}
            durationInFrames={segment.durationInFrames}
          >
            <AbsoluteFill
              style={{
                justifyContent: "center",
                alignItems: "center",
                padding: 40,
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  maxWidth: 1840,
                  maxHeight: 1000,
                }}
              >
                <BrowserFrame url={segment.browserUrl || browserUrl}>
                  <Gif
                    src={staticFile(segment.src)}
                    loopBehavior="pause-after-finish"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </BrowserFrame>
              </div>
            </AbsoluteFill>
          </Sequence>
        ))
      ) : (
        /* Single GIF mode */
        <div
          style={{
            width: "100%",
            height: "100%",
            maxWidth: 1840,
            maxHeight: 1000,
          }}
        >
          <BrowserFrame url={browserUrl}>
            <Gif
              src={staticFile(gifSrc!)}
              loopBehavior="pause-after-finish"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </BrowserFrame>
        </div>
      )}

      {/* Single audio file mode */}
      {audioFile && <Audio src={staticFile(audioFile)} />}

      {/* Legacy: Audio segments played in sequence */}
      {audioWithStartFrames &&
        audioWithStartFrames.map((segment, index) => (
          <Sequence
            key={index}
            from={segment.startFrame}
            durationInFrames={segment.durationInFrames}
          >
            <Audio src={staticFile(segment.file)} />
          </Sequence>
        ))}
    </AbsoluteFill>
  );
};
