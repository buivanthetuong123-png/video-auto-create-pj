// src/utils/animations/animationResolver.js
import { useCurrentFrame } from "remotion";
import { AnimationPresets, combineAnimations } from "./animationPresets.js";

/**
 * 🎬 ANIMATION RESOLVER
 * Áp dụng animations cho elements dựa trên target selector (#id, .class)
 */

/**
 * Hook để resolve animations từ config
 * @param {Array} animationsConfig - Mảng config animations từ data
 * @returns {Object} - Object chứa styles cho từng target selector
 */
export function useAnimations(animationsConfig = []) {
  const currentFrame = useCurrentFrame();
  const animationStyles = {};

  if (!animationsConfig || animationsConfig.length === 0) {
    return animationStyles;
  }

  animationsConfig.forEach((animConfig) => {
    const {
      type,
      target, // ⭐ REQUIRED: "#IDvideo001", ".myClass", etc.
      duration = 300,
      startFrame = 0,
      endFrame = Infinity,
      ...options
    } = animConfig;

    // ⚠️ Bắt buộc phải có target
    if (!target) {
      console.warn("⚠️ Animation missing 'target' property:", animConfig);
      return;
    }

    // Kiểm tra frame range
    if (currentFrame < startFrame || currentFrame > endFrame) {
      return;
    }

    // Lấy animation function
    const animationFn = AnimationPresets[type];
    if (!animationFn) {
      console.warn(`⚠️ Animation type "${type}" not found`);
      return;
    }

    // Tính frame tương đối
    const relativeFrame = currentFrame - startFrame;

    // Apply animation
    const animStyle = animationFn(relativeFrame, duration, options);

    // Lưu vào target
    if (!animationStyles[target]) {
      animationStyles[target] = [];
    }
    animationStyles[target].push(animStyle);
  });

  // Combine animations cho mỗi target
  Object.keys(animationStyles).forEach((target) => {
    animationStyles[target] = combineAnimations(animationStyles[target]);
  });

  return animationStyles;
}

/**
 * Helper: Lấy style cho một target cụ thể
 * @param {Object} animationStyles - Styles từ useAnimations
 * @param {String} target - Selector (#id hoặc .class)
 * @param {Object} baseStyle - Style mặc định
 */
export function getAnimationStyle(animationStyles, target, baseStyle = {}) {
  const animStyle = animationStyles[target] || {};

  return {
    ...baseStyle,
    ...animStyle,
  };
}

/**
 * 🎯 Debug helper
 */
export function debugAnimations(animationStyles, currentFrame) {
  if (currentFrame % 60 === 0) {
    console.log("🎬 Active Animations:", {
      frame: currentFrame,
      targets: Object.keys(animationStyles),
      styles: animationStyles,
    });
  }
}
