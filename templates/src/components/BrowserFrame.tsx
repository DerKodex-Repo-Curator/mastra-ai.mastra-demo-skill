import { ReactNode } from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";

type BrowserFrameProps = {
  url: string;
  children: ReactNode;
  animateIn?: boolean;
};

/**
 * BrowserFrame - Wraps content in a macOS-style browser chrome
 *
 * Usage:
 *   <BrowserFrame url="localhost:4111/agents">
 *     <Gif src={staticFile("demo.gif")} />
 *   </BrowserFrame>
 */
export const BrowserFrame: React.FC<BrowserFrameProps> = ({
  url,
  children,
  animateIn = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = animateIn
    ? interpolate(frame, [0, 0.5 * fps], [0.95, 1], {
        extrapolateRight: "clamp",
      })
    : 1;

  const opacity = animateIn
    ? interpolate(frame, [0, 0.3 * fps], [0, 1], {
        extrapolateRight: "clamp",
      })
    : 1;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        transform: `scale(${scale})`,
        opacity,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Browser Chrome */}
      <div
        style={{
          height: 48,
          backgroundColor: "#2d2d2d",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          gap: 12,
          flexShrink: 0,
        }}
      >
        {/* Traffic lights */}
        <div style={{ display: "flex", gap: 8 }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: "#ff5f56",
            }}
          />
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: "#ffbd2e",
            }}
          />
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: "#27ca40",
            }}
          />
        </div>

        {/* URL bar */}
        <div
          style={{
            flex: 1,
            height: 28,
            backgroundColor: "#1a1a1a",
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            paddingLeft: 12,
            fontSize: 14,
            color: "#888",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          {/* Security indicator */}
          <span style={{ color: "#4ade80", marginRight: 4 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
            </svg>
          </span>
          {url}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        {children}
      </div>
    </div>
  );
};
