import React from "react";
import { Audio, staticFile, Sequence } from "remotion";

function BackgroundSoundPlayer({
  startFrame = 30,
  sound = true,
  soundSource, // Sửa typo: soundSoure -> soundSource
}) {
  return (
    <div style={{ display: "none" }}>
      {" "}
      {/* Sửa: "hidden" -> "none" */}
      {soundSource && sound ? ( // Thêm điều kiện sound
        <Sequence from={startFrame}>
          <Audio
            src={staticFile(`backgroundSound/${soundSource}.mp3`)}
            volume={0.5}
          />
        </Sequence>
      ) : null}
    </div>
  );
}

export default BackgroundSoundPlayer;
