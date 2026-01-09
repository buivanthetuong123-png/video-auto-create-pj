import React from "react";
import { Audio, staticFile, Sequence } from "remotion";
import { getAudioPath as getAudioPathUtil } from "../../../../utils/pathResolver";

/**
 * Component phát âm thanh cho một segment cụ thể
 */
const SoundPlayer = ({
  startFrame = 30,
  endFrame = 90,
  sound = true,
  soundSource,
  volume = 1,
}) => {
  // Lấy đường dẫn audio
  const getAudioPath = () => {
    if (!soundSource) return null;

    // Nếu soundSource là object có code
    if (typeof soundSource === "object" && soundSource.code) {
      return getAudioPathUtil(soundSource);
    }

    // Nếu soundSource là string
    if (soundSource.includes("_")) {
      const prefix = soundSource.split("_")[0];
      return `audio/${prefix}/${soundSource}.mp3`;
    } else {
      return `audio/Khac/${soundSource}.mp3`;
    }
  };

  const audioPath = getAudioPath();

  if (!audioPath || !sound) {
    return null;
  }

  return (
    <div style={{ display: "none" }}>
      <Sequence from={startFrame} durationInFrames={endFrame - startFrame}>
        <Audio src={staticFile(audioPath)} volume={volume} />
      </Sequence>
    </div>
  );
};

export default SoundPlayer;
