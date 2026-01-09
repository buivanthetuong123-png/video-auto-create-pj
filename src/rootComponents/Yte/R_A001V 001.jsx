import React, { useState, useEffect } from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  staticFile,
  Sequence,
  continueRender,
  delayRender,
} from "remotion";
import { getBackgroundForId } from "../../ulti/getColorFromID";
import SoundPlay from "../../smallComponent/soundPlay";
import BackgroundSoundPlay from "../../smallComponent/backgroundSoundPlay";
import VideoPlay from "../../smallComponent/videoPlay";
// Component load duration với error handling
const AudioDurationLoaderV2 = ({ audioPath, onDurationLoad, index }) => {
  const { fps } = useVideoConfig();

  useEffect(() => {
    if (!audioPath) return;

    const audio = document.createElement("audio");
    audio.src = staticFile(audioPath);
    audio.preload = "metadata";

    const handleLoadedMetadata = () => {
      const durationInFrames = Math.ceil(audio.duration * fps);
      onDurationLoad(index, durationInFrames);
    };

    const handleError = () => {
      console.warn(`Failed to load audio: ${audioPath}`);
      onDurationLoad(index, 180);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("error", handleError);
      audio.remove();
    };
  }, [audioPath, index, onDurationLoad, fps]);

  return null;
};

// Component chính
const SequentialSounds = ({ items, volume = 2 }) => {
  const { fps } = useVideoConfig();
  const [audioFrames, setAudioFrames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [handle] = useState(() => delayRender("Loading audio durations"));
  const [durations, setDurations] = useState({});
  const [loadingCount, setLoadingCount] = useState(0);

  const getAudioPath = (e) => {
    if (!e.code) return null;
    if (e.code.includes("_")) {
      const AAA = e.code.split("_")[0];
      return `audio/${AAA}/${e.code}.mp3`;
    } else {
      return `audio/khac/${e.code}.mp3`;
    }
  };

  const handleDurationLoad = React.useCallback((index, durationInFrames) => {
    setDurations((prev) => ({
      ...prev,
      [index]: durationInFrames,
    }));
    setLoadingCount((prev) => prev + 1);
  }, []);

  const validItemsCount = items.filter((e) => getAudioPath(e) !== null).length;

  useEffect(() => {
    if (validItemsCount === 0 && isLoading) {
      setIsLoading(false);
      continueRender(handle);
      return;
    }

    if (loadingCount >= validItemsCount && validItemsCount > 0 && isLoading) {
      let accumulatedFrames = 0;
      const frames = [];

      items.forEach((e, i) => {
        const audioPath = getAudioPath(e);
        if (!audioPath) return;

        const duration = durations[i] || 180;
        frames.push({
          startFrame: accumulatedFrames,
          endFrame: accumulatedFrames + duration,
          soundSource: e.code,
          audioPath: audioPath,
          index: i,
          duration: duration,
        });
        accumulatedFrames += duration;
      });

      setAudioFrames(frames);
      setIsLoading(false);
      continueRender(handle);
    }
  }, [loadingCount, validItemsCount, durations, items, handle, isLoading]);

  return (
    <>
      {isLoading &&
        items.map((e, i) => {
          const audioPath = getAudioPath(e);
          return audioPath ? (
            <AudioDurationLoaderV2
              key={"loader-" + i}
              audioPath={audioPath}
              onDurationLoad={handleDurationLoad}
              index={i}
            />
          ) : null;
        })}

      {!isLoading &&
        audioFrames.map((frame, i) => (
          <SoundPlay
            key={"sound-" + i}
            startFrame={frame.startFrame}
            endFrame={frame.endFrame}
            soundSource={frame.soundSource}
            volume={volume}
          />
        ))}
    </>
  );
};

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
      <BackgroundSoundPlay startFrame={0} soundSource={"ShirfineMp3"} />
      <SequentialSounds items={item.data} volume={2} />
      <Sequence from={0}>
        <VideoPlay
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
