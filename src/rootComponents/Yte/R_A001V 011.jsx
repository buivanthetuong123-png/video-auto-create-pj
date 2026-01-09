// R_A001V.jsx - ĐƠN GIẢN HÓA TỐI ĐA
import React, { useState, useEffect } from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  continueRender,
  delayRender,
} from "remotion";
import { getBackgroundForId } from "../../ulti/getColorFromID";
import SoundPlay from "../../smallComponent/soundPlay";
import BackgroundSoundPlay from "../../smallComponent/backgroundSoundPlay";
import VideoPlay from "../../smallComponent/Mp4Play";
import VideoSmallPlay from "../../smallComponent/Mp4PlaySmall";
import TextView from "../../smallComponent/textByID";
import ImageView from "../../smallComponent/imgViewByCodeFrame";
import ImageViewList from "../../smallComponent/imgViewListByCodeFrame";

export const VideoTemplate = ({
  item,
  duration,
  codeFrame = [],
  imgFrame = [],
  videoPath, // ✨ NHẬN VIDEO PATH TỪ PROPS
  videoSegments = [], // ✨ NHẬN VIDEO SEGMENTS TỪ PROPS
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const [loadedVideoSrc, setLoadedVideoSrc] = useState(null);
  const [videoHandle] = useState(() => delayRender("Loading video"));

  // ✨ PRELOAD VIDEO - ĐƠN GIẢN HƠN NHIỀU
  useEffect(() => {
    if (!videoPath) {
      console.warn("No video path provided");
      continueRender(videoHandle);
      return;
    }

    // Tạo video element để preload
    const video = document.createElement("video");
    video.src = videoPath;
    video.preload = "auto"; // Changed from "metadata" to "auto" for better preloading

    const handleCanPlay = () => {
      console.log("✓ Video ready:", videoPath);
      setLoadedVideoSrc(videoPath);
      continueRender(videoHandle);
    };

    const handleError = (e) => {
      console.warn("⚠️ Video load error:", e);
      // Vẫn set path để video có thể stream
      setLoadedVideoSrc(videoPath);
      continueRender(videoHandle);
    };

    // ✨ SỬ DỤNG "canplay" THAY VÌ "loadedmetadata" - PRELOAD TỐT HƠN
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("error", handleError);

    // Cleanup
    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("error", handleError);
      video.remove();
    };
  }, [videoPath, videoHandle]);

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
      <BackgroundSoundPlay startFrame={0} soundSource={"ShirfineMp3"} />

      {/* ✨ RENDER AUDIO TRỰC TIẾP */}
      {codeFrame.map((e, i) => (
        <SoundPlay
          key={"sound-" + i}
          startFrame={e.startFrame}
          endFrame={e.endFrame}
          soundSource={e.code}
          volume={2}
        />
      ))}

      <Sequence from={0}>
        {loadedVideoSrc && (
          <>
            {/* Main video */}
            <VideoPlay
              startFrame={0}
              endFrame={duration}
              preloadedVideoSrc={loadedVideoSrc}
              zoom={1}
              zIndex={0}
              loop={true}
              sound={false}
            />

            {/* ✨ SỬ DỤNG VIDEO SEGMENTS TỪ PROPS */}
            {videoSegments.map((segment, i) => (
              <VideoSmallPlay
                key={`video-small-${i}`}
                startFrame={segment.startFrame}
                endFrame={segment.endFrame}
                preloadedVideoSrc={loadedVideoSrc}
                zoom={1}
                zIndex={10}
                loop={false}
                sound={false}
                startVideo={segment.timeSet[0]}
                endAt={segment.timeSet[1]}
              />
            ))}
          </>
        )}

        {/* Background overlays */}
        <div
          style={{
            position: "absolute",
            top: "100px",
            bottom: "100px",
            left: "40px",
            right: "40px",
            backgroundColor: "black",
            opacity: "0.9",
            borderRadius: "30px",
            padding: "20px",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: "1780px",
            bottom: "100px",
            left: "100px",
            right: "500px",
            backgroundColor: "black",
            padding: "20px",
            zIndex: "11",
          }}
        />

        {/* Content area */}
        <div
          style={{
            position: "absolute",
            top: "100px",
            bottom: "100px",
            left: "40px",
            right: "40px",
            borderRadius: "30px",
            padding: "20px",
          }}
        >
          <div
            className="row"
            style={{
              height: "1200px",
              width: "100%",
            }}
          >
            <div className="col-2">
              <div style={{ height: "100px" }} />
              <ImageViewList codeFrame={imgFrame} />
            </div>
            <div className="col-10">
              <ImageView codeFrame={imgFrame} />
              <TextView
                codeFrame={codeFrame}
                textEnd="     ____ Bác sĩ  ____                Chuyên Khoa II PHẠM THẾ HIỂN"
              />
            </div>
          </div>
        </div>
      </Sequence>
    </div>
  );
};
