import { registerRoot } from "remotion";
import { RemotionVideo } from "./RemotionRoot"; // ✅ Import từ file trung gian
import "bootstrap/dist/css/bootstrap.min.css";

/**
 * Central export file cho tất cả utilities và components
 * Sử dụng file này để import dễ dàng hơn:
 *
 * import { SequentialMediaRenderer, getAudioPath, useAudioDurations } from './index';
 */

// ==================== UTILITIES ====================
// export { getAudioPath, getImagePath, getVideoPath } from "./utils/pathResolver";
// export {
//   calculateFrameRanges,
//   getTotalDuration,
//   getFrameAtTime,
// } from "./utils/frameCalculator";
// export {
//   mergeConsecutiveImages,
//   isFrameInImageRange,
// } from "./utils/imageFrameMerger";
// export { getBackgroundForId } from "./utils/getColorFromID";

// ==================== HOOKS ====================
// export { useAudioDurations } from "./hooks/useAudioDurations";
// export { useImagePreloader } from "./hooks/useImagePreloader";

// ==================== CORE COMPONENTS ====================
// export { default as SequentialMediaRenderer } from "./components/core/SequentialMediaRenderer";
// export { default as AudioDurationLoader } from "./components/core/AudioDurationLoader";
// export { default as ImagePreloader } from "./components/core/ImagePreloader";

// ==================== MEDIA COMPONENTS ====================
// export { default as ImageWithAnimation } from "./components/media/ImageWithAnimation";
// export { default as SoundPlayer } from "./components/media/SoundPlayer";
// export { default as VideoPlayer } from "./components/media/VideoPlayer";
// export { default as BackgroundSoundPlayer } from "./components/media/BackgroundSoundplayer";

// // ==================== TEXT COMPONENTS ====================
// export { default as TypingText } from "./components/text/TypingText";

// // ==================== MAIN TEMPLATE ====================
// export { VideoTemplate } from "./rootComponents/LUAT01/R_A001V";

// ==================== TYPE DEFINITIONS (JSDoc) ====================
/**
 * @typedef {Object} DataItem
 * @property {string} text - Nội dung text
 * @property {string} code - Code để tìm audio file
 * @property {string|null} textView - Text hiển thị trên màn hình
 * @property {string} typingtext - "yes" hoặc "no"
 * @property {string} typingSound - "yes" hoặc "no"
 * @property {string} img - Tên file ảnh
 * @property {number} timePlus - Thêm thời gian (giây)
 * @property {number|null} duration - Duration cố định (giây)
 */

/**
 * @typedef {Object} VideoData
 * @property {number} stt - Số thứ tự
 * @property {number} id - ID
 * @property {string} code - Code chung
 * @property {DataItem[]} data - Array các data items
 */

/**
 * @typedef {Object} FrameRange
 * @property {number} startFrame - Frame bắt đầu
 * @property {number} endFrame - Frame kết thúc
 * @property {number} duration - Độ dài (frames)
 * @property {number} index - Index trong array
 * @property {DataItem} item - Data item gốc
 * @property {string|null} audioPath - Đường dẫn audio
 * @property {string|null} imgPath - Đường dẫn image
 * @property {string} soundSource - Source code cho audio
 */

/**
 * @typedef {Object} MergedImageGroup
 * @property {string} imgPath - Đường dẫn image
 * @property {number} startFrame - Frame bắt đầu
 * @property {number} endFrame - Frame kết thúc
 * @property {number} firstIndex - Index của item đầu tiên
 * @property {Array<{soundSource: string, startFrame: number, endFrame: number}>} audioSegments - Các audio segments trong group
 */

/**
 * Animation types có sẵn
 * @typedef {"kenBurns"|"zoomIn"|"zoomOut"|"slideIn"|"parallax"|"rotate"|"slideUp"|"fade"|"all"} AnimationType
 */

registerRoot(RemotionVideo);
