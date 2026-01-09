// R_A001V.jsx
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
import TextView from "../../smallComponent/textByID_FlexWithAction";
import ImageView from "../../smallComponent/imgViewByCodeFrame_KHUNGHINH";

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
        // ✨ THÊM: Kiểm tra timeFixed trước
        let duration;
        let soundDuration;

        if (e.timeFixed && e.timeFixed > 0) {
          // Nếu có timeFixed, dùng timeFixed
          duration = e.timeFixed * 30;
          soundDuration = duration; // SoundPlay cũng dùng timeFixed
        } else if (e.duration) {
          // Nếu có duration thủ công
          duration = e.duration * 30;
          soundDuration = duration;
        } else {
          // Fallback
          duration = 180;
          soundDuration = duration;
        }

        const imgPath = getImagePath(e);

        tempCodeFrame.push({
          ...e,
          startFrame: accumulatedFrames,
          endFrame: accumulatedFrames + duration,
          soundEndFrame: accumulatedFrames + soundDuration, // ✨ THÊM
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

        // ✨ THÊM: Logic xử lý timeFixed
        let duration;
        let soundDuration;

        if (e.timeFixed && e.timeFixed > 0) {
          // Nếu có timeFixed, dùng timeFixed
          duration = e.timeFixed * 30;
          // SoundPlay tối đa bằng timeFixed
          soundDuration = Math.min(audioDuration, e.timeFixed * 30);
        } else if (e.duration) {
          // Nếu có duration thủ công
          duration = e.duration * 30;
          soundDuration = audioDuration;
        } else {
          // Logic cũ: audio duration + timePlus
          duration = audioDuration + (e.timePlus || 0) * 30;
          soundDuration = audioDuration;
        }

        const imgPath = getImagePath(e);

        tempCodeFrame.push({
          ...e,
          startFrame: accumulatedFrames,
          endFrame: accumulatedFrames + duration, // TextView dùng duration đầy đủ
          soundEndFrame: accumulatedFrames + soundDuration, // ✨ THÊM: SoundPlay dùng soundDuration
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
              volume={2}
            />
          ))}
        </>
      )}
    </>
  );
};

export const VideoTemplate = ({ item, duration }) => {
  const [codeFrame, setCodeFrame] = useState([]);
  const [imgFrame, setImgFrame] = useState([]);
  const [isDataReady, setIsDataReady] = useState(false);

  const handleDataReady = (codeFrameData, imgFrameData) => {
    setCodeFrame(codeFrameData);
    setImgFrame(imgFrameData);
    setIsDataReady(true);
  };

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
      <FrameCalculator
        items={item.data}
        volume={2}
        onDataReady={handleDataReady}
      />

      <Sequence from={0}>
        <div
          style={{
            position: "absolute",
            top: "1780px",
            bottom: "0px",
            left: "0px",
            right: "0px",
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
            <div className="col-12">
              {isDataReady && <ImageView codeFrame={imgFrame} />}
              {isDataReady && (
                <TextView
                  codeFrame={codeFrame}
                  textEnd={
                    "     Trắc nghiệm kiến thức về Phòng chữa bệnh cơ xương khớp    "
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
