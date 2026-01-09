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

// Component hiển thị hình ảnh với hiệu ứng di chuyển BÊN TRONG div
const ImageWithAnimation = ({
  imgPath,
  startFrame,
  endFrame,
  duration,
  index,
  scale = 1,
  cssDiv = {},
  cssImg = {},
  animationType = "kenBurns",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [imageError, setImageError] = useState(false);

  const relativeFrame = frame - startFrame;
  const totalDuration = endFrame - startFrame;

  // Animation progress (0 -> 1)
  const progress = interpolate(relativeFrame, [0, totalDuration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Spring animation cho smooth motion
  const springProgress = spring({
    frame: relativeFrame,
    fps,
    config: {
      damping: 60,
      stiffness: 280,
      mass: 0.4,
      overshootClamping: false,
    },
  });

  // Fade in/out nhanh
  const fadeInDuration = 8;
  const fadeOutDuration = 8;

  const opacity = interpolate(
    relativeFrame,
    [0, fadeInDuration, totalDuration - fadeOutDuration, totalDuration],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // HIỆU ỨNG DI CHUYỂN CỦA HÌNH ẢNH BÊN TRONG DIV
  const getImageAnimationStyle = () => {
    switch (animationType) {
      case "panLeft":
        // Di chuyển từ PHẢI sang TRÁI
        const panLeftX = interpolate(progress, [0, 1], [20, -20]); // %
        const panLeftScale = interpolate(progress, [0, 1], [1.3, 1.4]);
        return {
          transform: `translate(${panLeftX}%, 0) scale(${panLeftScale})`,
        };

      case "panRight":
        // Di chuyển từ TRÁI sang PHẢI
        const panRightX = interpolate(progress, [0, 1], [-20, 20]);
        const panRightScale = interpolate(progress, [0, 1], [1.3, 1.4]);
        return {
          transform: `translate(${panRightX}%, 0) scale(${panRightScale})`,
        };

      case "panUp":
        // Di chuyển từ DƯỚI lên TRÊN
        const panUpY = interpolate(progress, [0, 1], [20, -20]);
        const panUpScale = interpolate(progress, [0, 1], [1.3, 1.4]);
        return {
          transform: `translate(0, ${panUpY}%) scale(${panUpScale})`,
        };

      case "panDown":
        // Di chuyển từ TRÊN xuống DƯỚI
        const panDownY = interpolate(progress, [0, 1], [-20, 20]);
        const panDownScale = interpolate(progress, [0, 1], [1.3, 1.4]);
        return {
          transform: `translate(0, ${panDownY}%) scale(${panDownScale})`,
        };

      case "kenBurns":
        // Ken Burns: Zoom + Pan chéo
        const kbScale = interpolate(progress, [0, 1], [1.2, 1.6]);
        const kbX = interpolate(progress, [0, 1], [10, -10]);
        const kbY = interpolate(progress, [0, 1], [5, -5]);
        return {
          transform: `translate(${kbX}%, ${kbY}%) scale(${kbScale})`,
        };

      case "zoomInPanLeft":
        // Zoom vào + Di chuyển sang trái
        const zipScale = interpolate(springProgress, [0, 1], [1, 1.6]);
        const zipX = interpolate(springProgress, [0, 1], [15, -15]);
        return {
          transform: `translateX(${zipX}%) scale(${zipScale})`,
        };

      case "zoomInPanRight":
        // Zoom vào + Di chuyển sang phải
        const ziprScale = interpolate(springProgress, [0, 1], [1, 1.6]);
        const ziprX = interpolate(springProgress, [0, 1], [-15, 15]);
        return {
          transform: `translateX(${ziprX}%) scale(${ziprScale})`,
        };

      case "zoomOutPanLeft":
        // Zoom ra + Di chuyển sang trái
        const zoplScale = interpolate(springProgress, [0, 1], [2, 1.2]);
        const zoplX = interpolate(springProgress, [0, 1], [10, -15]);
        return {
          transform: `translateX(${zoplX}%) scale(${zoplScale})`,
        };

      case "zoomOutPanRight":
        // Zoom ra + Di chuyển sang phải
        const zoprScale = interpolate(springProgress, [0, 1], [2, 1.2]);
        const zoprX = interpolate(springProgress, [0, 1], [-10, 15]);
        return {
          transform: `translateX(${zoprX}%) scale(${zoprScale})`,
        };

      case "diagonalTopLeft":
        // Di chuyển chéo từ dưới phải lên trên trái
        const dtlScale = interpolate(progress, [0, 1], [1.3, 1.5]);
        const dtlX = interpolate(progress, [0, 1], [15, -15]);
        const dtlY = interpolate(progress, [0, 1], [15, -15]);
        return {
          transform: `translate(${dtlX}%, ${dtlY}%) scale(${dtlScale})`,
        };

      case "diagonalTopRight":
        // Di chuyển chéo từ dưới trái lên trên phải
        const dtrScale = interpolate(progress, [0, 1], [1.3, 1.5]);
        const dtrX = interpolate(progress, [0, 1], [-15, 15]);
        const dtrY = interpolate(progress, [0, 1], [15, -15]);
        return {
          transform: `translate(${dtrX}%, ${dtrY}%) scale(${dtrScale})`,
        };

      case "diagonalBottomLeft":
        // Di chuyển chéo từ trên phải xuống dưới trái
        const dblScale = interpolate(progress, [0, 1], [1.3, 1.5]);
        const dblX = interpolate(progress, [0, 1], [15, -15]);
        const dblY = interpolate(progress, [0, 1], [-15, 15]);
        return {
          transform: `translate(${dblX}%, ${dblY}%) scale(${dblScale})`,
        };

      case "diagonalBottomRight":
        // Di chuyển chéo từ trên trái xuống dưới phải
        const dbrScale = interpolate(progress, [0, 1], [1.3, 1.5]);
        const dbrX = interpolate(progress, [0, 1], [-15, 15]);
        const dbrY = interpolate(progress, [0, 1], [-15, 15]);
        return {
          transform: `translate(${dbrX}%, ${dbrY}%) scale(${dbrScale})`,
        };

      case "rotatePanLeft":
        // Xoay + Di chuyển sang trái
        const rplScale = interpolate(progress, [0, 1], [1.2, 1.5]);
        const rplX = interpolate(progress, [0, 1], [10, -15]);
        const rplRotate = interpolate(progress, [0, 1], [-3, 5]);
        return {
          transform: `translateX(${rplX}%) scale(${rplScale}) rotate(${rplRotate}deg)`,
        };

      case "rotatePanRight":
        // Xoay + Di chuyển sang phải
        const rprScale = interpolate(progress, [0, 1], [1.2, 1.5]);
        const rprX = interpolate(progress, [0, 1], [-10, 15]);
        const rprRotate = interpolate(progress, [0, 1], [3, -5]);
        return {
          transform: `translateX(${rprX}%) scale(${rprScale}) rotate(${rprRotate}deg)`,
        };

      case "rotateZoomIn":
        // Xoay + Zoom vào
        const rziScale = interpolate(springProgress, [0, 1], [1, 1.7]);
        const rziRotate = interpolate(progress, [0, 1], [0, 15]);
        const rziX = interpolate(progress, [0, 1], [0, -8]);
        const rziY = interpolate(progress, [0, 1], [0, -8]);
        return {
          transform: `translate(${rziX}%, ${rziY}%) scale(${rziScale}) rotate(${rziRotate}deg)`,
        };

      case "rotateZoomOut":
        // Xoay + Zoom ra
        const rzoScale = interpolate(springProgress, [0, 1], [2, 1.2]);
        const rzoRotate = interpolate(progress, [0, 1], [-15, 0]);
        const rzoX = interpolate(progress, [0, 1], [-5, 5]);
        const rzoY = interpolate(progress, [0, 1], [-5, 5]);
        return {
          transform: `translate(${rzoX}%, ${rzoY}%) scale(${rzoScale}) rotate(${rzoRotate}deg)`,
        };

      case "circularPan":
        // Di chuyển theo vòng tròn
        const cpAngle = progress * Math.PI * 2;
        const cpRadius = 15; // Bán kính % di chuyển
        const cpX = Math.sin(cpAngle) * cpRadius;
        const cpY = Math.cos(cpAngle) * cpRadius;
        const cpScale = interpolate(progress, [0, 0.5, 1], [1.3, 1.5, 1.3]);
        return {
          transform: `translate(${cpX}%, ${cpY}%) scale(${cpScale})`,
        };

      case "swingPan":
        // Lắc qua lắc lại như con lắc
        const swingAngle = Math.sin(progress * Math.PI * 3) * 15;
        const swingScale = interpolate(progress, [0, 1], [1.2, 1.4]);
        return {
          transform: `translateX(${swingAngle}%) scale(${swingScale})`,
        };

      case "pulsePan":
        // Nhịp đập + Di chuyển
        const pulseScale = 1.3 + Math.sin(progress * Math.PI * 4) * 0.15;
        const pulseX = interpolate(progress, [0, 1], [10, -10]);
        const pulseY = interpolate(progress, [0, 1], [5, -5]);
        return {
          transform: `translate(${pulseX}%, ${pulseY}%) scale(${pulseScale})`,
        };

      case "wavePan":
        // Di chuyển theo sóng
        const waveX = Math.sin(progress * Math.PI * 2) * 15;
        const waveY = interpolate(progress, [0, 1], [10, -10]);
        const waveScale = interpolate(progress, [0, 1], [1.3, 1.5]);
        return {
          transform: `translate(${waveX}%, ${waveY}%) scale(${waveScale})`,
        };

      case "spiralZoom":
        // Xoay vòng + Zoom
        const spiralScale = interpolate(springProgress, [0, 1], [1, 1.8]);
        const spiralRotate = interpolate(progress, [0, 1], [0, 360]);
        const spiralRadius = interpolate(progress, [0, 1], [0, 10]);
        const spiralX = Math.sin(progress * Math.PI * 4) * spiralRadius;
        const spiralY = Math.cos(progress * Math.PI * 4) * spiralRadius;
        return {
          transform: `translate(${spiralX}%, ${spiralY}%) scale(${spiralScale}) rotate(${spiralRotate}deg)`,
        };

      case "explodePan":
        // Phát nổ từ trung tâm
        const explodeScale = interpolate(springProgress, [0, 1], [0.3, 1.5]);
        const explodeRotate = interpolate(springProgress, [0, 1], [-180, 0]);
        const explodeX = interpolate(springProgress, [0, 1], [0, -5]);
        const explodeY = interpolate(springProgress, [0, 1], [0, -5]);
        return {
          transform: `translate(${explodeX}%, ${explodeY}%) scale(${explodeScale}) rotate(${explodeRotate}deg)`,
        };

      case "static":
        // Không di chuyển, chỉ hiển thị
        return {
          transform: `scale(1.3)`,
        };

      default:
        return {
          transform: `scale(1.3)`,
        };
    }
  };

  if (imageError) {
    console.error(`Image error for ${imgPath}`);
    return null;
  }

  const defaultWidth = 600;
  const defaultHeight = 600;

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        width: `${defaultWidth}px`,
        height: `${defaultHeight}px`,
        marginTop: `${-defaultHeight / 2}px`,
        marginLeft: `${-defaultWidth / 2}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden", // Quan trọng: ẩn phần ảnh thừa ra ngoài
        borderRadius: "24px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        zIndex: 100,
        opacity,
        transform: `scale(${scale})`, // Scale cho CONTAINER
        transformOrigin: "center center",
        imageRendering: "high-quality",
        WebkitFontSmoothing: "antialiased",
        backfaceVisibility: "hidden",
        ...cssDiv,
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
          // Ảnh LỚN HƠN container để có thể di chuyển
          width: "140%", // Ảnh rộng hơn 40% so với container
          height: "140%", // Ảnh cao hơn 40% so với container
          minWidth: "140%",
          minHeight: "140%",
          objectFit: "cover",
          display: "block",
          transition: "transform 0.05s ease-out",
          imageRendering: "-webkit-optimize-contrast",
          backfaceVisibility: "hidden",
          willChange: "transform",
          // Transform cho HÌNH ẢNH - DI CHUYỂN BÊN TRONG DIV
          ...getImageAnimationStyle(),
          ...cssImg,
        }}
      />
    </div>
  );
};

// Component preload images (giữ nguyên)
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
      onImageLoad(index);
    };
    img.addEventListener("load", handleLoad);
    img.addEventListener("error", handleError);
    img.src = fullPath;
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

// Component load duration (giữ nguyên)
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
const SequentialSounds = ({
  items,
  volume = 2,
  scaleImg = 1,
  cssDiv = {},
  cssImg = {},
  animationType = "kenBurns",
}) => {
  const { fps } = useVideoConfig();
  const currentFrame = useCurrentFrame();
  const [audioFrames, setAudioFrames] = useState([]);
  const [mergedImageFrames, setMergedImageFrames] = useState([]);
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

  const mergeConsecutiveImages = (frames) => {
    if (frames.length === 0) return [];
    const merged = [];
    let currentGroup = null;

    frames.forEach((frame, index) => {
      if (!frame.imgPath) {
        return;
      }

      if (!currentGroup || currentGroup.imgPath !== frame.imgPath) {
        if (currentGroup) {
          merged.push(currentGroup);
        }
        currentGroup = {
          imgPath: frame.imgPath,
          startFrame: frame.startFrame,
          endFrame: frame.endFrame,
          firstIndex: index,
          audioSegments: [
            {
              soundSource: frame.soundSource,
              startFrame: frame.startFrame,
              endFrame: frame.endFrame,
            },
          ],
        };
      } else {
        currentGroup.endFrame = frame.endFrame;
        currentGroup.audioSegments.push({
          soundSource: frame.soundSource,
          startFrame: frame.startFrame,
          endFrame: frame.endFrame,
        });
      }
    });

    if (currentGroup) {
      merged.push(currentGroup);
    }

    console.log("📸 Merged image frames:");
    merged.forEach((group, i) => {
      const duration = group.endFrame - group.startFrame;
      console.log(
        `  ${i}: ${group.imgPath} | Frames ${group.startFrame}-${group.endFrame} (${duration}f = ${(duration / fps).toFixed(1)}s) | ${group.audioSegments.length} audio segments`,
      );
    });

    return merged;
  };

  useEffect(() => {
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
      const merged = mergeConsecutiveImages(frames);
      setMergedImageFrames(merged);
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
    fps,
  ]);

  // DANH SÁCH HIỆU ỨNG DI CHUYỂN
  const animationTypes = [
    "panLeft", // Di chuyển sang trái
    "panRight", // Di chuyển sang phải
    "panUp", // Di chuyển lên trên
    "panDown", // Di chuyển xuống dưới
    "kenBurns", // Zoom + Pan chéo
    "zoomInPanLeft", // Zoom vào + trái
    "zoomInPanRight", // Zoom vào + phải
    "zoomOutPanLeft", // Zoom ra + trái
    "zoomOutPanRight", // Zoom ra + phải
    "diagonalTopLeft", // Chéo trên trái
    "diagonalTopRight", // Chéo trên phải
    "diagonalBottomLeft", // Chéo dưới trái
    "diagonalBottomRight", // Chéo dưới phải
    "rotatePanLeft", // Xoay + trái
    "rotatePanRight", // Xoay + phải
    "rotateZoomIn", // Xoay + zoom vào
    "rotateZoomOut", // Xoay + zoom ra
    "circularPan", // Di chuyển vòng tròn
    "swingPan", // Lắc qua lắc lại
    "pulsePan", // Nhịp đập
    "wavePan", // Sóng
    "spiralZoom", // Xoáy vòng
    "explodePan", // Phát nổ
  ];

  const getAnimationTypeForIndex = (index) => {
    if (animationType === "all") {
      return animationTypes[index % animationTypes.length];
    }
    return animationType;
  };

  return (
    <>
      {isLoading && (
        <>
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
          {audioFrames.map((frame, i) => (
            <SoundPlay
              key={"sound-" + i}
              startFrame={frame.startFrame}
              endFrame={frame.endFrame}
              soundSource={frame.soundSource}
              volume={volume}
            />
          ))}

          {mergedImageFrames.map((imageGroup, i) => {
            const isInRange =
              currentFrame >= imageGroup.startFrame &&
              currentFrame < imageGroup.endFrame;
            if (!isInRange) return null;

            const currentAnimationType = getAnimationTypeForIndex(
              imageGroup.firstIndex,
            );
            const totalDuration = imageGroup.endFrame - imageGroup.startFrame;

            return (
              <ImageWithAnimation
                key={"img-merged-" + i}
                imgPath={imageGroup.imgPath}
                startFrame={imageGroup.startFrame}
                endFrame={imageGroup.endFrame}
                duration={totalDuration}
                index={imageGroup.firstIndex}
                scale={scaleImg}
                cssDiv={cssDiv}
                cssImg={cssImg}
                animationType={currentAnimationType}
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

      <SequentialSounds
        items={item.data}
        volume={2}
        scaleImg={1}
        cssDiv={{
          transform: "translateX(-330px) translateY(-380px)",
          width: "1200px",
          height: "1200px",
          borderRadius: "50%",
          boxShadow: "0 12px 48px rgba(0, 0, 0, 0.4)",
        }}
        cssImg={{}}
        animationType="all" // Sử dụng tất cả hiệu ứng
      />

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
