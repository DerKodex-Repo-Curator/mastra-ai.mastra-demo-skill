import { Composition, Folder } from "remotion";
import { DemoVideo, calculateTotalDuration } from "./DemoVideo";
import { TitleScene } from "./scenes/TitleScene";
import { DemoGifScene } from "./scenes/DemoGifScene";
import { OutroScene } from "./scenes/OutroScene";

// Video configuration
const FPS = 30;
const WIDTH = 1920;
const HEIGHT = 1080;

export const RemotionRoot = () => {
  // Calculate total duration from DemoVideo configuration
  const totalDuration = calculateTotalDuration(FPS);

  return (
    <>
      {/* Main composition - the full demo video */}
      <Composition
        id="DemoVideo"
        component={DemoVideo}
        durationInFrames={totalDuration}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />

      {/* Individual scenes for preview/debugging */}
      <Folder name="Scenes">
        <Composition
          id="TitleScene"
          component={TitleScene}
          durationInFrames={5 * FPS}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
          defaultProps={{
            title: "Demo Title",
            subtitle: "Demo Subtitle",
          }}
        />

        <Composition
          id="DemoGifScene"
          component={DemoGifScene}
          durationInFrames={10 * FPS}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
          defaultProps={{
            gifSrc: "segment-01.gif",
            browserUrl: "localhost:4111",
          }}
        />

        <Composition
          id="OutroScene"
          component={OutroScene}
          durationInFrames={5 * FPS}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
          defaultProps={{
            heading: "Get Started Today",
            command: "npx create-mastra@latest",
            links: ["mastra.ai/docs"],
          }}
        />
      </Folder>
    </>
  );
};
