// src/Components/ActionOrchestrator/actions/VideoViewAction.jsx
import React from "react";
import VideoView from "../smallComponents/media/VideoView.jsx";
import { mergeStyles } from "../utils/cssOverrideManager.js";

/**
 * 🎬 VIDEO VIEW ACTION
 * Hiển thị video với styling tùy chỉnh
 */
function VideoViewAction({ data }) {
  const {
    action,
    item,
    frame,
    actionStartFrame,
    actionEndFrame,
    cssOverrides,
    defaultTextStyle,
    className,
    id,
  } = data;

  // ✅ Lấy video từ action hoặc item hoặc data
  const video = action.video || item.video || data.video;
  if (!video) return null;

  // ✅ Merge styles
  const mergedStyle = mergeStyles(
    action,
    item,
    defaultTextStyle,
    className,
    id,
    cssOverrides,
  );

  return (
    <VideoView
      video={video}
      frame={frame}
      styCss={mergedStyle}
      startFrame={actionStartFrame}
      endFrame={actionEndFrame}
      videoSize={action.videoSize || data.videoSize || "1800px"}
      sound={action.sound !== false}
      volume={action.volume || 1}
      loop={action.loop || false}
      playbackRate={action.playbackRate || 1}
      data={data}
      dataAction={action}
    />
  );
}

export default VideoViewAction;
export { VideoViewAction };
