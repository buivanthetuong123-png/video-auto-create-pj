import React from "react";
import { useCurrentFrame, useVideoConfig, Sequence } from "remotion";
import { getBackgroundForId } from "../../utils/getColorFromID";
import BackgroundSoundPlayer from "../../components/media/BackgroundSoundplayer";
import VideoPlayer from "../../components/media/VideoPlayer";
import SequentialMediaRenderer from "../../components/core/SequentialMediaRenderer";

/**
 * Component template chính cho video
 * Sử dụng SequentialMediaRenderer để tự động quản lý audio và images
 */
export const VideoTemplate = ({ item, duration }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  return (
    <div
      style={{
        position: "relative",
        width: "1080px",
        height: "1920px",
        background: getBackgroundForId(item.id),
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
        boxSizing: "border-box",
        lineHeight: 1.4,
        overflow: "hidden",
      }}
    >
      {/* Background music */}
      <BackgroundSoundPlayer
        startFrame={0}
        soundSource="ShirfineMp3"
        volume={0.3}
      />

      {/* Sequential media renderer - tự động quản lý audio + images */}
      <SequentialMediaRenderer
        items={item.data}
        volume={2}
        scaleImg={1}
        cssDiv={{
          transform: "translateX(-330px) translateY(-380px)",
          width: "1200px",
          height: "1200px",
          borderRadius: "32px",
          boxShadow: "0 12px 48px rgba(0, 0, 0, 0.4)",
        }}
        cssImg={{}}
        animationType="all" // Có thể là: "kenBurns", "zoomIn", "zoomOut", "slideIn", "parallax", "rotate", "slideUp", "fade", hoặc "all"
      />

      {/* Background video */}
      <Sequence from={0}>
        <VideoPlayer
          startFrame={0}
          endFrame={duration}
          videoSource="ytemp4"
          zoom={1}
          zIndex={0}
          loop={true}
          sound={false}
        />
      </Sequence>
    </div>
  );
};

export default VideoTemplate;
