// src/Components/ActionOrchestrator/smallComponents/media/VideoView.jsx
import React, { useState, useEffect } from "react";
import {
  Html5Video,
  staticFile,
  continueRender,
  delayRender,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  useAnimations,
  getAnimationStyle,
} from "../../utils/animations/animationResolver.js";

const VideoView = ({
  video,
  frame,
  styCss = {},
  startFrame = 0,
  endFrame = 300,
  videoSize = "1800px",
  data = {},
  dataAction = {},
  sound = true,
  volume = 1,
  loop = false,
  playbackRate = 1,
  ...props
}) => {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [loadedVideoSrc, setLoadedVideoSrc] = useState(null);
  const [handle] = useState(() => delayRender("Loading video"));

  // ⭐ Lấy id/class từ dataAction hoặc data
  const elementId = dataAction.id || data.id;
  const elementClass = dataAction.className || data.className;

  // ⭐ Lấy animations từ data
  const animations = dataAction.animations || data.animations || [];
  const animationStyles = useAnimations(animations);

  // Get video path
  const getVideoPath = (videoName) => {
    if (!videoName) return null;
    if (videoName.includes("_")) {
      const prefix = videoName.split("_")[0];
      return `video/${prefix}/${videoName}`;
    }
    return `video/${videoName}`;
  };

  const videoPath = getVideoPath(video);

  // Pre-load video
  useEffect(() => {
    if (!videoPath) {
      setVideoLoaded(true);
      continueRender(handle);
      return;
    }

    const videoElement = document.createElement("video");
    videoElement.src = staticFile(videoPath);

    videoElement.onloadedmetadata = () => {
      console.log(`✅ Video loaded: ${videoPath}`);
      setLoadedVideoSrc(videoElement.src);
      setVideoLoaded(true);
      continueRender(handle);
    };

    videoElement.onerror = () => {
      console.warn(`⚠️ Failed to load video: ${videoPath}`);
      setVideoLoaded(true);
      continueRender(handle);
    };

    return () => {
      videoElement.onloadedmetadata = null;
      videoElement.onerror = null;
    };
  }, [videoPath, handle]);

  // Visibility checks
  if (frame < startFrame || frame > endFrame) return null;
  if (!videoLoaded || !videoPath || !loadedVideoSrc) return null;

  // ⭐ BUILD SELECTORS
  const containerSelector = elementId ? `#${elementId}` : null;
  const videoSelector = elementId ? `#${elementId}-video` : null;

  // ⭐ CONTAINER STYLE - styleCss + animation
  const containerStyle = containerSelector
    ? getAnimationStyle(animationStyles, containerSelector, styCss)
    : styCss;

  // ⭐ VIDEO STYLE - default + animation
  const videoStyle = videoSelector
    ? getAnimationStyle(animationStyles, videoSelector, {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block",
      })
    : {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block",
      };

  // Debug
  if (currentFrame % 60 === 0 && elementId) {
    console.log(`🎬 VideoView [${elementId}] - Frame ${currentFrame}`, {
      containerSelector,
      videoSelector,
      hasContainerAnimation: !!animationStyles[containerSelector],
      hasVideoAnimation: !!animationStyles[videoSelector],
    });
  }

  return (
    <div id={elementId} className={elementClass} style={containerStyle}>
      <Html5Video
        id={elementId ? `${elementId}-video` : undefined}
        src={loadedVideoSrc}
        volume={sound ? volume : 0}
        muted={!sound}
        loop={loop}
        playbackRate={playbackRate}
        style={videoStyle}
        onError={(err) => {
          if (process.env.NODE_ENV === "development") {
            console.warn(`Video playback error [${video}]:`, err.message);
          }
        }}
      />
    </div>
  );
};

export default VideoView;
