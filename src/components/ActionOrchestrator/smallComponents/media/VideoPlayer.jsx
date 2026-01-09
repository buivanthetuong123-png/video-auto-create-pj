import React from "react";
import {
  Video,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
  Sequence,
  AbsoluteFill,
  interpolate,
} from "remotion";
import { getVideoPath as getVideoPathUtil } from "../../../A_saveOld/utils/pathResolver";

/**
 * Component phát video với zoom animation
 */
const VideoPlayer = ({
  startFrame = 30,
  endFrame = 90,
  sound = true,
  videoSource,
  volume = 1,
  zoom = 1,
  loop = false,
  zIndex = 0,
}) => {
  const frame = useCurrentFrame();

  // Lấy đường dẫn video
  const videoPath = getVideoPathUtil(videoSource);

  if (!videoPath) {
    return null;
  }

  // Tính toán scale để zoom từ giữa
  const scale = interpolate(frame, [startFrame, endFrame], [1, zoom], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ zIndex }}>
      <Sequence from={startFrame} durationInFrames={endFrame - startFrame}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "transparent",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              transform: `scale(${scale})`,
              transformOrigin: "center center",
            }}
          >
            <Video
              src={staticFile(videoPath)}
              volume={sound ? volume : 0}
              muted={!sound}
              loop={loop}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default VideoPlayer;
