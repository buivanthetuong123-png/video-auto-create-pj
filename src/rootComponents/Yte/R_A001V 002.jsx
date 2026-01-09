import React, { useState, useEffect } from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  staticFile,
  Sequence,
  continueRender,
  delayRender,
  interpolate,
  spring,
  Img,
} from "remotion";
import { getBackgroundForId } from "../../ulti/getColorFromID";
import SoundPlay from "../../smallComponent/soundPlay";
import BackgroundSoundPlay from "../../smallComponent/backgroundSoundPlay";
import VideoPlay from "../../smallComponent/videoPlay";

// Component hiển thị hình ảnh TĨNH (để debug)
const ImageWithAnimation = ({ imgPath, startFrame, duration, index }) => {
  const frame = useCurrentFrame();
  const [imageError, setImageError] = useState(false);

  // Debug log
  console.log(`[Frame ${frame}] Rendering image ${index}: ${imgPath}`);

  if (imageError) {
    console.error(`Image error for ${imgPath}`);
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        width: "600px",
        height: "600px",
        marginTop: "-300px", // Center vertically
        marginLeft: "-300px", // Center horizontally
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        borderRadius: "24px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        zIndex: 100, // Tăng z-index cao hơn
        backgroundColor: "rgba(255, 255, 255, 0.1)", // Debug: thấy được container
      }}
    >
      <Img
        src={staticFile(imgPath)}
        onError={(e) => {
          console.error(`Failed to render image: ${imgPath}`, e);
          setImageError(true);
        }}
        onLoad={() => {
          console.log(`✓ Image rendered successfully: ${imgPath}`);
        }}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />
    </div>
  );
};

// Component preload images
const ImagePreloader = ({ imgPath, onImageLoad, index }) => {
  useEffect(() => {
    if (!imgPath) {
      onImageLoad(index);
      return;
    }

    const img = new Image();
    const fullPath = staticFile(imgPath);

    const handleLoad = () => {
      console.log(`✓ Image loaded: ${imgPath}`);
      onImageLoad(index);
    };

    const handleError = () => {
      console.warn(`✗ Failed to load image: ${imgPath}`);
      onImageLoad(index); // Continue anyway
    };

    img.addEventListener("load", handleLoad);
    img.addEventListener("error", handleError);
    img.src = fullPath;

    // If image is already cached
    if (img.complete) {
      handleLoad();
    }

    return () => {
      img.removeEventListener("load", handleLoad);
      img.removeEventListener("error", handleError);
    };
  }, [imgPath, index, onImageLoad]);

  return null;
};

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
  const currentFrame = useCurrentFrame(); // Lấy ở đây
  const [audioFrames, setAudioFrames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [handle] = useState(() =>
    delayRender("Loading audio durations and images"),
  );
  const [durations, setDurations] = useState({});
  const [loadingCount, setLoadingCount] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState({});
  const [imageLoadCount, setImageLoadCount] = useState(0);

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

  const handleImageLoad = React.useCallback((index) => {
    setImagesLoaded((prev) => ({
      ...prev,
      [index]: true,
    }));
    setImageLoadCount((prev) => prev + 1);
  }, []);

  const validItemsCount = items.filter((e) => getAudioPath(e) !== null).length;
  const totalImagesCount = items.filter((e) => getImagePath(e) !== null).length;

  useEffect(() => {
    // Check if all audio and images are loaded
    const audioReady = validItemsCount === 0 || loadingCount >= validItemsCount;
    const imagesReady =
      totalImagesCount === 0 || imageLoadCount >= totalImagesCount;

    if (audioReady && imagesReady && isLoading) {
      console.log("========================================");
      console.log("✅ All resources loaded!");
      console.log(`   Audio files: ${loadingCount}/${validItemsCount}`);
      console.log(`   Images: ${imageLoadCount}/${totalImagesCount}`);
      console.log("========================================");

      let accumulatedFrames = 0;
      const frames = [];
      items.forEach((e, i) => {
        const audioPath = getAudioPath(e);
        if (!audioPath) return;
        const duration = durations[i] || 180;
        const imgPath = getImagePath(e);

        frames.push({
          startFrame: accumulatedFrames,
          endFrame: accumulatedFrames + duration,
          soundSource: e.code,
          audioPath: audioPath,
          imgPath: imgPath,
          index: i,
          duration: duration,
        });
        accumulatedFrames += duration;
      });
      setAudioFrames(frames);
      setIsLoading(false);
      continueRender(handle);
    }
  }, [
    loadingCount,
    validItemsCount,
    imageLoadCount,
    totalImagesCount,
    durations,
    items,
    handle,
    isLoading,
  ]);

  return (
    <>
      {isLoading && (
        <>
          {/* Load audio durations */}
          {items.map((e, i) => {
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

          {/* Preload images */}
          {items.map((e, i) => {
            const imgPath = getImagePath(e);
            return imgPath ? (
              <ImagePreloader
                key={"img-loader-" + i}
                imgPath={imgPath}
                onImageLoad={handleImageLoad}
                index={i}
              />
            ) : null;
          })}
        </>
      )}

      {!isLoading && (
        <>
          {/* Render sounds */}
          {audioFrames.map((frame, i) => (
            <SoundPlay
              key={"sound-" + i}
              startFrame={frame.startFrame}
              endFrame={frame.endFrame}
              soundSource={frame.soundSource}
              volume={volume}
            />
          ))}

          {/* TEST: Render images TRỰC TIẾP không qua Sequence */}
          {audioFrames.map((frameData, i) => {
            const isInRange =
              currentFrame >= frameData.startFrame &&
              currentFrame < frameData.endFrame;

            if (frameData.imgPath && isInRange) {
              console.log(
                `🖼️ [Frame ${currentFrame}] Showing image ${i}: ${frameData.imgPath}`,
              );
            }

            if (!frameData.imgPath || !isInRange) return null;

            return (
              <ImageWithAnimation
                key={"img-direct-" + i}
                imgPath={frameData.imgPath}
                startFrame={frameData.startFrame}
                duration={frameData.duration}
                index={i}
              />
            );
          })}
        </>
      )}
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
      <SequentialSounds items={item.data} volume={2} scaleImg={2} cssimg={{}} />
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
