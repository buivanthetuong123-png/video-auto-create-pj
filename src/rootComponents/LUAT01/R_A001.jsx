// RemotionVideo.jsx
import React from "react";
import { Composition, staticFile } from "remotion";
import { VideoTemplate } from "./R_A001V";
import { videoData01 } from "./data_luat";

let videoData = videoData01;
if (!videoData01[0].id) {
  let temVideoData = [];
  videoData01.forEach((e, i) => {
    temVideoData.push({ id: i + 1, data: e });
  });
  videoData = temVideoData;
}

const getAudioPath = (code) => {
  if (!code) return null;
  if (code.includes("_")) {
    const prefix = code.split("_")[0];
    return `audio/${prefix}/${code}.mp3`;
  } else {
    return `audio/khac/${code}.mp3`;
  }
};

const loadAudioDurationWithFetch = async (audioSrc) => {
  try {
    const response = await fetch(audioSrc);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const arrayBuffer = await response.arrayBuffer();

    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    await audioContext.close();

    return audioBuffer.duration;
  } catch (error) {
    console.error("Error loading audio:", error);
    throw error;
  }
};

export const RemotionVideo = () => {
  return (
    <>
      {videoData.map((item, i) => (
        <Composition
          key={i + ""}
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
            // ===== IMPORTANT: CHECK IF THIS RUNS =====
            console.log("========================================");
            console.log("🚀 calculateMetadata STARTED for video:", props.id);
            console.log("Number of audio items:", props.item.data.length);
            console.log("========================================");

            let totalDurationInSeconds = 0;
            let successCount = 0;
            let failCount = 0;

            for (let index = 0; index < props.item.data.length; index++) {
              const dataItem = props.item.data[index];

              if (dataItem.code) {
                const audioPath = getAudioPath(dataItem.code);
                console.log(
                  `[${index + 1}/${props.item.data.length}] Processing: ${dataItem.code}`,
                );

                if (audioPath) {
                  try {
                    const audioSrc = staticFile(audioPath);
                    console.log(`  → Audio URL: ${audioSrc}`);

                    const duration = await loadAudioDurationWithFetch(audioSrc);

                    totalDurationInSeconds += duration;
                    successCount++;
                    console.log(
                      `  ✓ Duration: ${duration.toFixed(2)}s (Total so far: ${totalDurationInSeconds.toFixed(2)}s)`,
                    );
                  } catch (error) {
                    failCount++;
                    console.error(
                      `  ✗ Error loading ${dataItem.code}:`,
                      error.message,
                    );
                    totalDurationInSeconds += 6;
                    console.log(`  → Using fallback 6s`);
                  }
                } else {
                  console.warn(`  ⚠️  No audio path for ${dataItem.code}`);
                }
              }
            }

            const totalFrames = Math.ceil(totalDurationInSeconds * 30);

            console.log("========================================");
            console.log(`✅ CALCULATION COMPLETE for video ${props.id}`);
            console.log(`   Success: ${successCount}, Failed: ${failCount}`);
            console.log(
              `   Total Duration: ${totalDurationInSeconds.toFixed(2)}s`,
            );
            console.log(`   Total Frames: ${totalFrames} (at ${30} fps)`);
            console.log("========================================\n");

            // Ensure valid return
            const finalFrames = totalFrames > 0 ? totalFrames + 240 : 420;

            return {
              durationInFrames: finalFrames,
              props: {
                ...props,
                duration: finalFrames, // Bổ sung duration tổng vào props
              },
            };
          }}
        />
      ))}
    </>
  );
};
