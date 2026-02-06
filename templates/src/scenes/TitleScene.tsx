import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
} from "remotion";
import { Audio } from "@remotion/media";

type TitleSceneProps = {
  title: string;
  subtitle?: string;
  audioFile?: string;
};

/**
 * TitleScene - Opening title card with animated text
 *
 * Usage:
 *   <TitleScene
 *     title="Auth & RBAC"
 *     subtitle="Secure your Mastra applications"
 *     audioFile="title.mp3"
 *   />
 */
export const TitleScene: React.FC<TitleSceneProps> = ({
  title,
  subtitle,
  audioFile,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo animation
  const logoScale = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  // Title fade in
  const titleOpacity = interpolate(frame, [0.5 * fps, 1.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const titleY = interpolate(frame, [0.5 * fps, 1.5 * fps], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtitle fade in
  const subtitleOpacity = interpolate(frame, [1 * fps, 2 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Decorative line animation
  const lineWidth = interpolate(frame, [1.5 * fps, 2.5 * fps], [0, 400], {
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

      {/* Animated circles in background */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          border: "1px solid rgba(139, 92, 246, 0.1)",
          transform: `scale(${logoScale})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          borderRadius: "50%",
          border: "1px solid rgba(139, 92, 246, 0.05)",
          transform: `scale(${logoScale})`,
        }}
      />

      {/* Main content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 1,
        }}
      >
        {/* Logo/Icon */}
        <div
          style={{
            transform: `scale(${logoScale})`,
            marginBottom: 40,
          }}
        >
          <svg width="120" height="120" viewBox="0 0 120 120">
            <defs>
              <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
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
              fill="url(#logoGradient)"
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
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "white",
            fontFamily: "system-ui, sans-serif",
            margin: 0,
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            letterSpacing: -2,
          }}
        >
          {title}
        </h1>

        {/* Decorative line */}
        <div
          style={{
            width: lineWidth,
            height: 4,
            background: "linear-gradient(90deg, #8B5CF6, #EC4899)",
            borderRadius: 2,
            marginTop: 20,
            marginBottom: 20,
          }}
        />

        {/* Subtitle */}
        {subtitle && (
          <p
            style={{
              fontSize: 32,
              color: "rgba(255, 255, 255, 0.7)",
              fontFamily: "system-ui, sans-serif",
              margin: 0,
              opacity: subtitleOpacity,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </AbsoluteFill>
  );
};
