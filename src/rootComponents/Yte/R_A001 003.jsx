// RemotionVideo.jsx
import React from "react";
import { Composition, staticFile } from "remotion";
import { VideoTemplate } from "./R_A001V";
import { videoData } from "./data_yte";

const getAudioPath = (code) => {
  if (!code) return null;
  if (code.includes("_")) {
    const prefix = code.split("_")[0];
    return `audio/${prefix}/${code}.mp3`;
  }
  return `audio/khac/${code}.mp3`;
};

const getImagePath = (img) => {
  if (!img) return null;
  if (img.includes("_")) {
    const prefix = img.split("_")[0];
    return `assets/${prefix}/${img}`;
  }
  return `assets/khac/${img}`;
};

const loadAudioDurationWithFetch = async (audioSrc) => {
  try {
    const response = await fetch(audioSrc);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    await audioContext.close();
    return audioBuffer.duration;
  } catch (error) {
    console.error("Error loading audio:", error);
    return 6;
  }
};

// ✨ HELPER: Generate video segments (pure function)
const generateVideoSegments = (duration, timeSet = [[0, 54], [182, 687]]) => {
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
};

// ✨ HELPER: Verify video exists (không preload nhưng check path)
const verifyVideoPath = async (videoPath) => {
  try {
    const response = await fetch(videoPath, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.warn(`Video verification failed: ${videoPath}`, error);
    return false; // Fallback: assume exists
  }
};

export const RemotionVideo = () => {
  return (
    <>
      {videoData.map((item, i) => (
        <Composition
          key={i}
          id={item.id + ""}
          component={VideoTemplate}
          durationInFrames={420}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{
            id: item.id + "",
            item: item,
          }}
          calculateMetadata={async ({ props, fps }) => {
            console.log("🚀 calculateMetadata STARTED for video:", props.id);
            
            // ===== BƯỚC 1: LOAD TẤT CẢ AUDIO DURATIONS =====
            const audioDurations = [];
            let totalDurationInSeconds = 0;
            
            for (let index = 0; index < props.item.data.length; index++) {
              const dataItem = props.item.data[index];
              
              if (dataItem.code) {
                const audioPath = getAudioPath(dataItem.code);
                
                if (audioPath) {
                  const audioSrc = staticFile(audioPath);
                  const duration = await loadAudioDurationWithFetch(audioSrc);
                  
                  audioDurations.push({
                    index,
                    code: dataItem.code,
                    duration,
                  });
                  
                  totalDurationInSeconds += duration;
                  console.log(`✓ [${index + 1}] ${dataItem.code}: ${duration.toFixed(2)}s`);
                }
              }
            }

            // ===== BƯỚC 2: TÍNH CODEFRAME VÀ IMGFRAME =====
            let accumulatedFrames = 0;
            const codeFrame = [];
            const imgFrame = [];

            props.item.data.forEach((e, i) => {
              const audioPath = getAudioPath(e.code);
              
              if (!audioPath) return;

              const audioDurationData = audioDurations.find(d => d.code === e.code);
              const audioDurationInSeconds = audioDurationData?.duration || 6;
              const audioDurationInFrames = Math.ceil(audioDurationInSeconds * fps);
              
              const duration = e.duration 
                ? e.duration * fps 
                : audioDurationInFrames + (e.timePlus || 0) * fps;

              codeFrame.push({
                ...e,
                startFrame: accumulatedFrames,
                endFrame: accumulatedFrames + duration,
                duration: duration,
              });

              const imgPath = getImagePath(e.img);
              if (imgPath) {
                imgFrame.push({
                  startFrame: accumulatedFrames,
                  endFrame: accumulatedFrames + duration,
                  imgPath: imgPath,
                  index: i,
                });
              }

              accumulatedFrames += duration;
            });

            // ===== BƯỚC 3: MERGE IMGFRAME =====
            const mergedImgFrame = [];
            let currentGroup = null;

            imgFrame.forEach((frame) => {
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

            // ===== BƯỚC 4: TÍNH TỔNG FRAMES =====
            const totalFrames = accumulatedFrames + 120;

            // ===== ✨ BƯỚC 5: VERIFY VIDEO PATH =====
            const videoPath = staticFile("audio/mp4/ytemp4.mp4");
            const videoExists = await verifyVideoPath(videoPath);
            
            if (!videoExists) {
              console.warn("⚠️ Video path may not exist:", videoPath);
            } else {
              console.log("✓ Video verified:", videoPath);
            }

            // ===== ✨ BƯỚC 6: GENERATE VIDEO SEGMENTS =====
            const videoSegments = generateVideoSegments(totalFrames, [
              [0, 54],
              [182, 687],
            ]);

            console.log("========================================");
            console.log(`✅ CALCULATION COMPLETE for video ${props.id}`);
            console.log(`   Total Duration: ${totalDurationInSeconds.toFixed(2)}s`);
            console.log(`   Total Frames: ${totalFrames} (at ${fps} fps)`);
            console.log(`   CodeFrame items: ${codeFrame.length}`);
            console.log(`   ImgFrame items: ${mergedImgFrame.length}`);
            console.log(`   Video segments: ${videoSegments.length}`);
            console.log("========================================\n");

            return {
              durationInFrames: totalFrames,
              props: {
                ...props,
                duration: totalFrames,
                codeFrame,
                imgFrame: mergedImgFrame,
                videoPath, // ✨ PASS VIDEO PATH
                videoSegments, // ✨ PASS VIDEO SEGMENTS
              },
            };
          }}
        />
      ))}
    </>
  );
};