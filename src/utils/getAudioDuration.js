// utils/getAudioDuration.js
import { staticFile } from "remotion";

export const getAudioPath = (e) => {
  if (!e || !e.code) return null;
  if (e.code.includes("_")) {
    const AAA = e.code.split("_")[0];
    return `audio/${AAA}/${e.code}.mp3`;
  } else {
    return `audio/khac/${e.code}.mp3`;
  }
};

export const getAudioDuration = (audioPath) => {
  return new Promise((resolve) => {
    try {
      const audio = new Audio();
      audio.src = staticFile(audioPath);

      const timeout = setTimeout(() => {
        console.warn("Timeout loading audio: " + audioPath);
        resolve(6); // fallback after 5 seconds
      }, 5000);

      audio.addEventListener("loadedmetadata", () => {
        clearTimeout(timeout);
        const duration = audio.duration || 6;
        resolve(duration);
      });

      audio.addEventListener("error", (e) => {
        clearTimeout(timeout);
        console.warn("Error loading audio: " + audioPath, e);
        resolve(6); // fallback 6 seconds
      });

      audio.load();
    } catch (error) {
      console.error("Exception loading audio: " + audioPath, error);
      resolve(6); // fallback
    }
  });
};

export const calculateTotalAudioDuration = async (items, fps) => {
  if (!items || items.length === 0) {
    return 420; // fallback 14 seconds at 30fps
  }

  let totalDuration = 0;

  for (const item of items) {
    const audioPath = getAudioPath(item);
    if (audioPath) {
      const duration = await getAudioDuration(audioPath);
      totalDuration += duration;
    }
  }

  const totalFrames = Math.ceil(totalDuration * fps);

  // Ensure we return a valid number
  if (isNaN(totalFrames) || totalFrames <= 0) {
    console.warn("Invalid totalFrames calculated, using fallback");
    return 420;
  }

  return totalFrames;
};
