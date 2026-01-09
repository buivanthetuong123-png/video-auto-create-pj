// R_A001V.jsx
import React, { useState, useEffect, useRef } from "react";
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
import VideoPlay from "../../smallComponent/Mp4Play";
import VideoSmallPlay from "../../smallComponent/Mp4PlaySmall";
import TextView from "../../smallComponent/textByID";
import ImageView from "../../smallComponent/imgViewByCodeFrame";
import ImageViewList from "../../smallComponent/imgViewListByCodeFrame";

const AudioDurationLoader = ({ audioPath, onDurationLoad, index }) => {
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

const FrameCalculator = ({ items, volume = 2, onDataReady }) => {
  const { fps } = useVideoConfig();
  const [codeFrame, setCodeFrame] = useState([]);
  const [imgFrame, setImgFrame] = useState([]);
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

  const getImagePath = (e) => {
    if (!e.img) return null;
    if (e.img.includes("_")) {
      const prefix = e.img.split("_")[0];
      return `assets/${prefix}/${e.img}`;
    } else {
      return `assets/khac/${e.img}`;
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
    if (validItemsCount === 0) {
      let accumulatedFrames = 0;
      const tempCodeFrame = [];
      const tempImgFrame = [];

      items.forEach((e, i) => {
        const duration = e.duration ? e.duration * 30 : 180;
        const imgPath = getImagePath(e);

        tempCodeFrame.push({
          ...e,
          startFrame: accumulatedFrames,
          endFrame: accumulatedFrames + duration,
          duration: duration,
        });

        if (imgPath) {
          tempImgFrame.push({
            startFrame: accumulatedFrames,
            endFrame: accumulatedFrames + duration,
            imgPath: imgPath,
            index: i,
          });
        }

        accumulatedFrames += duration;
      });

      const mergedImgFrame = [];
      let currentGroup = null;

      tempImgFrame.forEach((frame) => {
        if (!currentGroup || currentGroup.imgPath !== frame.imgPath) {
          if (currentGroup) {
            mergedImgFrame.push(currentGroup);
          }
          currentGroup = {
            imgPath: frame.imgPath,
            startFrame: frame.startFrame,
            endFrame: frame.endFrame,
            index: frame.index,
          };
        } else {
          currentGroup.endFrame = frame.endFrame;
        }
      });

      if (currentGroup) {
        mergedImgFrame.push(currentGroup);
      }

      setCodeFrame(tempCodeFrame);
      setImgFrame(mergedImgFrame);
      setIsLoading(false);
      continueRender(handle);

      if (onDataReady) {
        onDataReady(tempCodeFrame, mergedImgFrame);
      }
    }
  }, [validItemsCount, items, handle, fps, onDataReady]);

  useEffect(() => {
    if (validItemsCount > 0 && loadingCount >= validItemsCount && isLoading) {
      let accumulatedFrames = 0;
      const tempCodeFrame = [];
      const tempImgFrame = [];

      items.forEach((e, i) => {
        const audioPath = getAudioPath(e);
        if (!audioPath) return;

        const audioDuration = durations[i] || 180;
        const duration = e.duration
          ? e.duration * 30
          : audioDuration + (e.timePlus || 0) * 30;
        const imgPath = getImagePath(e);

        tempCodeFrame.push({
          ...e,
          startFrame: accumulatedFrames,
          endFrame: accumulatedFrames + duration,
          duration: duration,
        });

        if (imgPath) {
          tempImgFrame.push({
            startFrame: accumulatedFrames,
            endFrame: accumulatedFrames + duration,
            imgPath: imgPath,
            index: i,
          });
        }

        accumulatedFrames += duration;
      });

      const mergedImgFrame = [];
      let currentGroup = null;

      tempImgFrame.forEach((frame) => {
        if (!currentGroup || currentGroup.imgPath !== frame.imgPath) {
          if (currentGroup) {
            mergedImgFrame.push(currentGroup);
          }
          currentGroup = {
            imgPath: frame.imgPath,
            startFrame: frame.startFrame,
            endFrame: frame.endFrame,
            index: frame.index,
          };
        } else {
          currentGroup.endFrame = frame.endFrame;
        }
      });

      if (currentGroup) {
        mergedImgFrame.push(currentGroup);
      }

      setCodeFrame(tempCodeFrame);
      setImgFrame(mergedImgFrame);
      setIsLoading(false);
      continueRender(handle);

      if (onDataReady) {
        onDataReady(tempCodeFrame, mergedImgFrame);
      }
    }
  }, [
    loadingCount,
    validItemsCount,
    durations,
    items,
    handle,
    isLoading,
    fps,
    onDataReady,
  ]);

  return (
    <>
      {isLoading && validItemsCount > 0 && (
        <>
          {items.map((e, i) => {
            const audioPath = getAudioPath(e);
            return audioPath ? (
              <AudioDurationLoader
                key={"loader-" + i}
                audioPath={audioPath}
                onDurationLoad={handleDurationLoad}
                index={i}
              />
            ) : null;
          })}
        </>
      )}
      {!isLoading && (
        <>
          {codeFrame.map((e, i) => (
            <SoundPlay
              key={"sound-" + i}
              startFrame={e.startFrame}
              endFrame={e.endFrame}
              soundSource={e.code}
              volume={volume}
            />
          ))}
        </>
      )}
    </>
  );
};

export const VideoTemplate = ({ item, duration }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const [codeFrame, setCodeFrame] = useState([]);
  const [imgFrame, setImgFrame] = useState([]);
  const [isDataReady, setIsDataReady] = useState(false);
  const [loadedVideoSrc, setLoadedVideoSrc] = useState(null);
  const [videoHandle] = useState(() => delayRender("Loading video"));

  const handleDataReady = (codeFrameData, imgFrameData) => {
    setCodeFrame(codeFrameData);
    setImgFrame(imgFrameData);
    setIsDataReady(true);
  };

  const videoSegments = React.useMemo(
    () =>
      generateVideoSegments(duration, [
        [0, 54],
        [182, 687],
      ]),
    [duration],
  );

  useEffect(() => {
    const videoPath = staticFile("audio/mp4/ytemp4.mp4");
    const video = document.createElement("video");
    video.src = videoPath;
    video.preload = "metadata";

    const handleLoadedMetadata = () => {
      setLoadedVideoSrc(videoPath);
      continueRender(videoHandle);
    };

    const handleError = () => {
      console.warn("Failed to preload video");
      setLoadedVideoSrc(videoPath);
      continueRender(videoHandle);
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("error", handleError);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("error", handleError);
      video.remove();
    };
  }, [videoHandle]);

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
      <BackgroundSoundPlay startFrame={0} soundSource={"Shiverr"} />
      <FrameCalculator
        items={item.data}
        volume={2}
        onDataReady={handleDataReady}
      />

      <Sequence from={0}>
        {loadedVideoSrc && (
          <>
            <VideoPlay
              startFrame={0}
              endFrame={duration}
              preloadedVideoSrc={loadedVideoSrc}
              zoom={1}
              zIndex={0}
              loop={true}
              sound={false}
            />
            {videoSegments.map((e, i) => (
              <VideoSmallPlay
                key={`video-small-${i}`}
                startFrame={e.startFrame}
                endFrame={e.endFrame}
                preloadedVideoSrc={loadedVideoSrc}
                zoom={1}
                zIndex={10}
                loop={false}
                sound={false}
                startVideo={e.timeSet[0]}
                endAt={e.timeSet[1]}
              />
            ))}
          </>
        )}
        <div
          style={{
            position: "absolute",
            top: "100px",
            bottom: "100px",
            left: "40px",
            right: "40px",
            // marginTop: "100px",
            // marginLeft: "40px",
            // width: "1000px",
            // height: "1700px",
            backgroundColor: "black",
            opacity: "0.9",
            borderRadius: "30px",
            padding: "20px",
          }}
        ></div>

        <div
          style={{
            position: "absolute",
            top: "1780px",
            bottom: "0px",
            left: "0px",
            right: "0px",
            // marginTop: "100px",
            // marginLeft: "40px",
            // width: "1000px",
            // height: "1700px",
            backgroundColor: "black",
            padding: "20px",
            zIndex: "11",
          }}
        ></div>

        <div
          style={{
            position: "absolute",
            top: "100px",
            bottom: "100px",
            left: "40px",
            right: "40px",
            // marginTop: "100px",
            // marginLeft: "40px",
            // width: "1000px",
            // height: "1700px",
            // backgroundColor: "transparent",
            // opacity: "0.9",
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
              <div style={{ height: "100px" }}></div>
              {isDataReady && <ImageViewList codeFrame={imgFrame} />}
            </div>
            <div className="col-10">
              {isDataReady && <ImageView codeFrame={imgFrame} />}
              {isDataReady && (
                <TextView
                  codeFrame={codeFrame}
                  textEnd={
                    "     ____ Bác sĩ  ____                Chuyên Khoa II PHẠM THẾ HIỂN"
                  }
                />
              )}
            </div>
          </div>
        </div>
      </Sequence>
    </div>
  );
};

function generateVideoSegments(
  duration = 2000,
  timeSet = [
    [0, 54],
    [182, 687],
  ],
) {
  const result = [];
  let startFrameBegin = 0;
  let timeSetIndex = 0;

  while (startFrameBegin < duration) {
    const currentTimeSet = timeSet[timeSetIndex % timeSet.length];
    const segmentDuration = currentTimeSet[1] - currentTimeSet[0];
    const endFrame = Math.min(startFrameBegin + segmentDuration, duration);

    result.push({
      startFrame: startFrameBegin,
      endFrame: endFrame,
      timeSet: currentTimeSet,
    });

    startFrameBegin = endFrame;
    timeSetIndex++;

    if (startFrameBegin >= duration) {
      break;
    }
  }

  return result;
}
