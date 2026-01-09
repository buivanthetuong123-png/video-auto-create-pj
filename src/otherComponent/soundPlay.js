import React from "react";
import {
  Audio,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
  Sequence,
  AbsoluteFill,
} from "remotion";

function SoundPlay({
  startFrame = 30,
  endFrame = 90,
  sound = true,
  soundSource,
  volume = 1,
}) {
  // Xác định đường dẫn audio dựa trên soundSource
  const getAudioPath = () => {
    if (!soundSource) return null;

    if (soundSource.includes("_")) {
      // Nếu có "_", split và lấy phần đầu tiên làm thư mục
      const AAA = soundSource.split("_")[0];
      return `audio/${AAA}/${soundSource}.mp3`;
    } else {
      // Nếu không có "_", đặt vào thư mục "khac"
      return `audio/Khac/${soundSource}.mp3`;
    }
  };

  const audioPath = getAudioPath();

  return (
    <div style={{ display: "none" }}>
      {audioPath && sound ? (
        <Sequence from={startFrame} durationInFrames={endFrame - startFrame}>
          <Audio src={staticFile(audioPath)} volume={volume} />
        </Sequence>
      ) : null}
    </div>
  );
}

export default SoundPlay;
