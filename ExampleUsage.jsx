/**
 * File ví dụ để demo cách sử dụng cấu trúc mới
 */
import React from "react";
import { Composition } from "remotion";
import { VideoTemplate } from "./R_A001V";

// ==================== DATA MẪU ====================
export const exampleVideoData = [
  {
    stt: 1,
    id: 1,
    code: "YTETV_001",
    data: [
      {
        text: "Mười dấu hiệu thận bạn đang có vấn đề!",
        code: "YTETV_001",
        textView: "Mười dấu hiệu thận bạn đang có vấn đề!",
        typingtext: "yes",
        typingSound: "yes",
        img: "YTE_001.jpg",
        timePlus: 2,
        duration: null,
      },
      {
        text: "1. Ngủ ngáy to và kéo dài",
        code: "YTETV_002",
        textView: "1. Ngủ ngáy to và kéo dài",
        typingtext: "yes",
        typingSound: "no",
        img: "YTE_002.jpg",
        timePlus: 0,
        duration: null,
      },
      {
        text: "Khi thận hoạt động kém, cơ thể dễ tích nước...",
        code: "YTETV_003",
        textView: null,
        typingtext: "yes",
        typingSound: "no",
        img: "YTE_002.jpg", // Cùng ảnh với item trước - sẽ được merge
        timePlus: 0,
        duration: null,
      },
    ],
  },
];

// ==================== COMPOSITIONS ====================
export const RemotionRoot = () => {
  return (
    <>
      {/* Composition 1: Video với animation "all" (rotate qua tất cả animations) */}
      <Composition
        id="VideoWithAllAnimations"
        component={VideoTemplate}
        durationInFrames={3000}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          item: exampleVideoData[0],
          duration: 3000,
        }}
      />

      {/* Composition 2: Video chỉ dùng Ken Burns effect */}
      <Composition
        id="VideoWithKenBurns"
        component={(props) => (
          <VideoTemplateWithCustomAnimation 
            {...props} 
            animationType="kenBurns" 
          />
        )}
        durationInFrames={3000}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          item: exampleVideoData[0],
          duration: 3000,
        }}
      />

      {/* Composition 3: Video với custom styling */}
      <Composition
        id="VideoWithCustomStyle"
        component={(props) => (
          <VideoTemplateWithCustomStyle {...props} />
        )}
        durationInFrames={3000}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          item: exampleVideoData[0],
          duration: 3000,
        }}
      />
    </>
  );
};

// ==================== CUSTOM TEMPLATES ====================

/**
 * Template với custom animation type
 */
const VideoTemplateWithCustomAnimation = ({ item, duration, animationType }) => {
  return (
    <div
      style={{
        position: "relative",
        width: "1080px",
        height: "1920px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <SequentialMediaRenderer
        items={item.data}
        volume={2}
        scaleImg={1}
        animationType={animationType}
      />
    </div>
  );
};

/**
 * Template với custom styling cho images
 */
const VideoTemplateWithCustomStyle = ({ item, duration }) => {
  return (
    <div
      style={{
        position: "relative",
        width: "1080px",
        height: "1920px",
        background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      }}
    >
      <SequentialMediaRenderer
        items={item.data}
        volume={2}
        scaleImg={0.8}
        cssDiv={{
          // Custom styling cho container
          width: "800px",
          height: "800px",
          borderRadius: "50%", // Circular images!
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
        }}
        cssImg={{
          // Custom styling cho image
          filter: "brightness(1.1) contrast(1.1)",
        }}
        animationType="zoomIn"
      />
    </div>
  );
};

// ==================== CÁC VÍ DỤ SỬ DỤNG RIÊNG LẺ ====================

/**
 * Example 1: Chỉ sử dụng SequentialMediaRenderer
 */
export const Example1_BasicRenderer = () => {
  const { useCurrentFrame } = require("remotion");
  const frame = useCurrentFrame();
  
  return (
    <div style={{ width: 1080, height: 1920, background: "#000" }}>
      <SequentialMediaRenderer
        items={exampleVideoData[0].data}
        volume={1}
        scaleImg={1}
        animationType="kenBurns"
      />
    </div>
  );
};

/**
 * Example 2: Kết hợp nhiều media components
 */
export const Example2_MultipleMedias = () => {
  const { Sequence } = require("remotion");
  const BackgroundSoundPlayer = require("./components/media/BackgroundSoundPlayer").default;
  const VideoPlayer = require("./components/media/VideoPlayer").default;
  const SequentialMediaRenderer = require("./components/core/SequentialMediaRenderer").default;
  
  return (
    <div style={{ width: 1080, height: 1920, background: "#1a1a1a" }}>
      {/* Background music */}
      <BackgroundSoundPlayer 
        startFrame={0} 
        soundSource="MyBackgroundMusic" 
        volume={0.2}
      />
      
      {/* Background video */}
      <Sequence from={0}>
        <VideoPlayer
          startFrame={0}
          endFrame={3000}
          videoSource="background-video"
          zoom={1.1}
          sound={false}
          loop={true}
        />
      </Sequence>
      
      {/* Main content */}
      <SequentialMediaRenderer
        items={exampleVideoData[0].data}
        volume={2}
        scaleImg={1.2}
        animationType="all"
      />
    </div>
  );
};

/**
 * Example 3: Custom animation cho từng image
 */
export const Example3_CustomPerImage = () => {
  const ImageWithAnimation = require("./components/media/ImageWithAnimation").default;
  const { useCurrentFrame } = require("remotion");
  const frame = useCurrentFrame();
  
  const images = [
    { path: "assets/YTE/YTE_001.jpg", start: 0, end: 90, anim: "kenBurns" },
    { path: "assets/YTE/YTE_002.jpg", start: 90, end: 180, anim: "zoomIn" },
    { path: "assets/YTE/YTE_003.jpg", start: 180, end: 270, anim: "slideUp" },
  ];
  
  return (
    <div style={{ width: 1080, height: 1920, background: "#fff" }}>
      {images.map((img, i) => {
        const isVisible = frame >= img.start && frame < img.end;
        if (!isVisible) return null;
        
        return (
          <ImageWithAnimation
            key={i}
            imgPath={img.path}
            startFrame={img.start}
            endFrame={img.end}
            index={i}
            animationType={img.anim}
          />
        );
      })}
    </div>
  );
};

/**
 * Example 4: Sử dụng hooks riêng lẻ
 */
export const Example4_UsingHooks = () => {
  const { useState, useEffect } = require("react");
  const { useAudioDurations } = require("./hooks/useAudioDurations");
  const { useImagePreloader } = require("./hooks/useImagePreloader");
  const { calculateFrameRanges } = require("./utils/frameCalculator");
  
  const items = exampleVideoData[0].data;
  
  // Sử dụng hooks
  const { durations, handleDurationLoad, isAllLoaded: audioDurationsLoaded } = 
    useAudioDurations(items.length);
  const { handleImageLoad, isAllLoaded: imagesLoaded } = 
    useImagePreloader(items.length);
  
  const [frameRanges, setFrameRanges] = useState([]);
  
  useEffect(() => {
    if (audioDurationsLoaded && imagesLoaded) {
      const frames = calculateFrameRanges(items, durations, 30);
      setFrameRanges(frames);
      console.log("Frame ranges calculated:", frames);
    }
  }, [audioDurationsLoaded, imagesLoaded, durations, items]);
  
  return (
    <div style={{ padding: 20, color: "#fff", background: "#000" }}>
      <h2>Frame Ranges Debug View</h2>
      <p>Audio Loaded: {audioDurationsLoaded ? "✓" : "Loading..."}</p>
      <p>Images Loaded: {imagesLoaded ? "✓" : "Loading..."}</p>
      <pre>{JSON.stringify(frameRanges, null, 2)}</pre>
    </div>
  );
};

export default RemotionRoot;