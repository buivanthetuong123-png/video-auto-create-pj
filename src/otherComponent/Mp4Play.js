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

function VideoPlay({
  startFrame = 30,
  endFrame = 90,
  sound = true,
  videoSource,
  preloadedVideoSrc, // ✨ Video đã được preload
  volume = 1,
  zoom = 1, // Zoom bao nhiêu lần (1 = không zoom, 1.5 = zoom 1.5 lần, etc.)
  loop = false, // Có lặp lại video hay không
  zIndex = 0, // Layer của video (số càng lớn càng nằm trên)
}) {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // ✨ Ưu tiên dùng preloadedVideoSrc, fallback về videoSource
  const videoPath = React.useMemo(() => {
    // Nếu có preloadedVideoSrc thì dùng luôn
    if (preloadedVideoSrc) {
      return preloadedVideoSrc;
    }

    // Fallback: tạo path từ videoSource
    if (!videoSource) return null;
    return staticFile(`audio/mp4/${videoSource}.mp4`);
  }, [preloadedVideoSrc, videoSource]);

  // Tính toán scale để zoom từ giữa và zoom đều ra
  const scale = interpolate(
    frame,
    [startFrame, endFrame],
    [1, zoom], // Zoom từ 1 (kích thước gốc) đến giá trị zoom
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  return (
    <AbsoluteFill style={{ zIndex }}>
      {videoPath ? (
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
                transform: `scale(${scale})`, // Zoom từ giữa
                transformOrigin: "center center", // Luôn zoom từ giữa
              }}
            >
              <Video
                src={videoPath} // ✨ Dùng trực tiếp videoPath (đã là URL hoặc staticFile)
                volume={sound ? volume : 0} // Bật/tắt tiếng
                muted={!sound} // Muted nếu sound = false
                loop={loop} // Lặp lại video nếu ngắn hơn
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          </AbsoluteFill>
        </Sequence>
      ) : null}
    </AbsoluteFill>
  );
}

export default VideoPlay;
