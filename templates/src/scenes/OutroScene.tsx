import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
} from "remotion";
import { Audio } from "@remotion/media";

type OutroSceneProps = {
  heading: string;
  command?: string;
  links?: string[];
  audioFile?: string;
};

/**
 * OutroScene - Closing card with CTA
 *
 * Usage:
 *   <OutroScene
 *     heading="Get Started Today"
 *     command="npx create-mastra@latest"
 *     links={["mastra.ai/docs", "github.com/mastra-ai/mastra"]}
 *     audioFile="outro.mp3"
 *   />
 */
export const OutroScene: React.FC<OutroSceneProps> = ({
  heading,
  command,
  links = [],
  audioFile,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const mainProgress = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  const opacity = interpolate(mainProgress, [0, 1], [0, 1]);
  const scale = interpolate(mainProgress, [0, 1], [0.9, 1]);

  const detailsOpacity = interpolate(frame, [0.5 * fps, 1 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0a",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Audio */}
      {audioFile && <Audio src={staticFile(audioFile)} />}

      {/* Background gradient */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background:
            "radial-gradient(ellipse at center, #1a1a2e 0%, #0a0a0a 70%)",
        }}
      />

      {/* Decorative circle */}
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          border: "1px solid rgba(139, 92, 246, 0.1)",
          opacity,
        }}
      />

      {/* Main content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 1,
          opacity,
          transform: `scale(${scale})`,
        }}
      >
        {/* Logo */}
        <svg width="80" height="80" viewBox="0 0 120 120" style={{ marginBottom: 30 }}>
          <defs>
            <linearGradient id="outroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>
          <rect
            x="10"
            y="10"
            width="100"
            height="100"
            rx="20"
            fill="url(#outroGradient)"
          />
          <path
            d="M40 60 L55 75 L80 45"
            stroke="white"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>

        {/* Heading */}
        <h2
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: "white",
            fontFamily: "system-ui, sans-serif",
            margin: 0,
            marginBottom: 16,
          }}
        >
          {heading}
        </h2>

        {/* CLI Command */}
        {command && (
          <div
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              padding: "16px 32px",
              borderRadius: 12,
              fontFamily: "monospace",
              fontSize: 28,
              color: "#4ade80",
              opacity: detailsOpacity,
              marginBottom: 24,
            }}
          >
            {command}
          </div>
        )}

        {/* Links */}
        {links.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: 32,
              fontSize: 20,
              color: "#888",
              fontFamily: "system-ui, sans-serif",
              opacity: detailsOpacity,
            }}
          >
            {links.map((link, index) => (
              <>
                {index > 0 && <span style={{ color: "#444" }}>|</span>}
                <span key={link}>{link}</span>
              </>
            ))}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
