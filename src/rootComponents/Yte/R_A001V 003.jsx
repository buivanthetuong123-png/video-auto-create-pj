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

// Component hiển thị hình ảnh với hiệu ứng động
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

  // Tính frame tương đối từ startFrame
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
      damping: 100,
      stiffness: 200,
      mass: 0.5,
    },
  });

  // Fade in/out - chỉ ở đầu và cuối của chuỗi ảnh
  const fadeInDuration = 15;
  const fadeOutDuration = 15;
  const opacity = interpolate(
    relativeFrame,
    [0, fadeInDuration, totalDuration - fadeOutDuration, totalDuration],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Các hiệu ứng khác nhau cho ẢNH (không bao gồm scale)
  const getImageAnimationStyle = () => {
    switch (animationType) {
      case "kenBurns":
        // Ken Burns effect: zoom từ 1 -> 1.2 và pan nhẹ
        const kenBurnsScale = interpolate(progress, [0, 1], [1, 1.2]);
        const translateX = interpolate(progress, [0, 1], [0, -30]);
        const translateY = interpolate(progress, [0, 1], [0, -20]);
        return {
          transform: `scale(${kenBurnsScale}) translate(${translateX}px, ${translateY}px)`,
        };

      case "zoomIn":
        // Zoom in từ nhỏ -> bình thường
        const zoomInScale = interpolate(springProgress, [0, 1], [0.8, 1]);
        return {
          transform: `scale(${zoomInScale})`,
        };

      case "zoomOut":
        // Zoom out từ lớn -> bình thường
        const zoomOutScale = interpolate(springProgress, [0, 1], [1.3, 1]);
        return {
          transform: `scale(${zoomOutScale})`,
        };

      case "slideIn":
        // Slide in từ bên phải
        const slideX = interpolate(springProgress, [0, 1], [100, 0]);
        return {
          transform: `translateX(${slideX}px)`,
        };

      case "parallax":
        // Parallax effect với rotation nhẹ
        const parallaxY = Math.sin(progress * Math.PI * 2) * 20;
        const rotation = Math.sin(progress * Math.PI) * 3;
        return {
          transform: `translateY(${parallaxY}px) rotate(${rotation}deg)`,
        };

      case "rotate":
        // Rotation nhẹ với zoom
        const rotateScale = interpolate(progress, [0, 1], [1, 1.15]);
        const rotateAngle = interpolate(progress, [0, 1], [0, 5]);
        return {
          transform: `scale(${rotateScale}) rotate(${rotateAngle}deg)`,
        };

      case "slideUp":
        // Slide up từ dưới lên
        const slideUpY = interpolate(springProgress, [0, 1], [80, 0]);
        return {
          transform: `translateY(${slideUpY}px)`,
        };

      case "fade":
        // Chỉ fade, không có transform
        return {
          transform: `scale(1)`,
        };

      default:
        return {
          transform: `scale(1)`,
        };
    }
  };

  if (imageError) {
    console.error(`Image error for ${imgPath}`);
    return null;
  }

  // Default width và height
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
        overflow: "hidden",
        borderRadius: "24px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        zIndex: 100,
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: "center center",
        // CSS để cải thiện chất lượng khi scale
        imageRendering: "high-quality",
        WebkitFontSmoothing: "antialiased",
        backfaceVisibility: "hidden",
        ...cssDiv, // CSS tùy chỉnh cho DIV container (width, height, etc.)
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
          transition: "transform 0.1s ease-out",
          // CSS để giữ chất lượng ảnh tốt nhất
          imageRendering: "-webkit-optimize-contrast",
          backfaceVisibility: "hidden",
          transform: "translateZ(0)", // Hardware acceleration
          ...getImageAnimationStyle(),
          ...cssImg, // CSS tùy chỉnh cho ẢNH
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

// Component load duration
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

  // Hàm merge các ảnh trùng liên tiếp
  const mergeConsecutiveImages = (frames) => {
    if (frames.length === 0) return [];

    const merged = [];
    let currentGroup = null;

    frames.forEach((frame, index) => {
      // Bỏ qua nếu không có ảnh
      if (!frame.imgPath) {
        return;
      }

      // Nếu chưa có group hoặc ảnh khác với group hiện tại
      if (!currentGroup || currentGroup.imgPath !== frame.imgPath) {
        // Lưu group cũ nếu có
        if (currentGroup) {
          merged.push(currentGroup);
        }
        // Tạo group mới
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
        // Ảnh trùng với group hiện tại - extend endFrame
        currentGroup.endFrame = frame.endFrame;
        currentGroup.audioSegments.push({
          soundSource: frame.soundSource,
          startFrame: frame.startFrame,
          endFrame: frame.endFrame,
        });
      }
    });

    // Đừng quên group cuối cùng
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

      // Merge các ảnh trùng liên tiếp
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

  // Danh sách các hiệu ứng để rotation khi animationType="all"
  const animationTypes = [
    "kenBurns",
    "zoomIn",
    "zoomOut",
    "slideIn",
    "parallax",
    "rotate",
    "slideUp",
  ];

  // Hàm lấy animation type cho từng ảnh
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
          {/* Render sounds cho mỗi audio segment */}
          {audioFrames.map((frame, i) => (
            <SoundPlay
              key={"sound-" + i}
              startFrame={frame.startFrame}
              endFrame={frame.endFrame}
              soundSource={frame.soundSource}
              volume={volume}
            />
          ))}

          {/* Render merged images - mỗi ảnh chỉ render 1 lần cho toàn bộ khoảng thời gian */}
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
        scaleImg={1} // Scale = 1 để không bị rỗ, dùng cssDiv để thay đổi kích thước
        cssDiv={{
          transform: "translateX(-330px) translateY(-380px)",
          width: "1200px", // Tùy chỉnh width của container
          height: "1200px", // Tùy chỉnh height của container
          borderRadius: "32px",
          boxShadow: "0 12px 48px rgba(0, 0, 0, 0.4)",
        }}
        cssImg={
          {
            // CSS cho ảnh bên trong (nếu cần)
          }
        }
        animationType="all"
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
