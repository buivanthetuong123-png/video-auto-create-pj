// Mp4PlaySmall.js
import React from "react";
import {
  Video,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  AbsoluteFill,
  interpolate,
} from "remotion";

function VideoSmallPlay({
  startFrame = 30,
  endFrame = 90,
  sound = true,
  preloadedVideoSrc,
  volume = 1,
  zoom = 1,
  loop = false,
  zIndex = 0,
  startVideo = null,
  endAt = null,
  fadeInDuration = 5,
  fadeOutDuration = 5,
}) {
  const frame = useCurrentFrame();

  const scale = interpolate(frame, [startFrame, endFrame], [1, zoom], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const totalDuration = endFrame - startFrame;
  const relativeFrame = frame - startFrame;

  const opacity = interpolate(
    relativeFrame,
    [
      0,
      fadeInDuration,
      totalDuration - fadeOutDuration > fadeInDuration
        ? totalDuration - fadeOutDuration
        : fadeInDuration + 1,
      totalDuration,
    ],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  const videoProps = {
    src: preloadedVideoSrc,
    volume: sound ? volume : 0,
    muted: !sound,
    loop: loop,
    style: {
      width: "400px",
      height: "700px",
      objectFit: "cover",
      borderRadius: "50%",
      transform: "translateX(-400px) translateY(700px)",
      // border: "1px solid black", 
    },
  };

  if (startVideo !== null && startVideo !== undefined && startVideo >= 0) {
    videoProps.startFrom = startVideo;
  }

  if (endAt !== null && endAt !== undefined && endAt > 0) {
    videoProps.endAt = endAt;
  }

  return (
    <AbsoluteFill style={{ zIndex }}>
      {preloadedVideoSrc ? (
        <Sequence
          from={startFrame}
          durationInFrames={
            endFrame > startFrame > 0 ? endFrame - startFrame : 0
          }
        >
          <AbsoluteFill
            style={{
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "transparent",
              opacity: opacity,
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
                borderRadius: "50%",
              }}
            >
              <Video {...videoProps} />
            </div>
          </AbsoluteFill>
        </Sequence>
      ) : null}
    </AbsoluteFill>
  );
}

export default VideoSmallPlay;
