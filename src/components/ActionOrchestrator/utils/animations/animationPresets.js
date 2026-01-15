// src/utils/animations/animationPresets.js
import {
  interpolateStyles,
  makeTransform,
  scale,
  translateX,
  translateY,
} from "@remotion/animation-utils";

/**
 * 🎨 KHO ANIMATION PRESETS
 * Mỗi preset return function nhận (currentFrame, duration, options)
 */

export const AnimationPresets = {
  // ⭐ PAN (qua trái-phải)
  pan: (currentFrame, duration, options = {}) => {
    const { panAmount = 5, loop = true } = options;
    const loopFrame = loop ? currentFrame % duration : currentFrame;
    const panOffset = (panAmount / 100) * 1920;

    return interpolateStyles(
      loopFrame,
      [0, duration / 3, (duration * 2) / 3, duration],
      [
        { transform: makeTransform([translateX(0)]) },
        { transform: makeTransform([translateX(-panOffset)]) },
        { transform: makeTransform([translateX(panOffset)]) },
        { transform: makeTransform([translateX(0)]) },
      ],
    );
  },

  // ⭐ ZOOM (phóng to-thu nhỏ)
  zoom: (currentFrame, duration, options = {}) => {
    const { zoomMin = 1.0, zoomMax = 1.2, loop = true } = options;
    const loopFrame = loop ? currentFrame % duration : currentFrame;

    return interpolateStyles(
      loopFrame,
      [0, duration / 2, duration],
      [
        { transform: makeTransform([scale(zoomMin)]) },
        { transform: makeTransform([scale(zoomMax)]) },
        { transform: makeTransform([scale(zoomMin)]) },
      ],
    );
  },

  // ⭐ BREATHING (scale nhẹ nhàng)
  breathing: (currentFrame, duration, options = {}) => {
    const { breathingMin = 0.98, breathingMax = 1.02, loop = true } = options;
    const loopFrame = loop ? currentFrame % duration : currentFrame;

    return interpolateStyles(
      loopFrame,
      [0, duration / 2, duration],
      [
        { transform: makeTransform([scale(breathingMin)]) },
        { transform: makeTransform([scale(breathingMax)]) },
        { transform: makeTransform([scale(breathingMin)]) },
      ],
    );
  },

  // ⭐ FADE IN
  fadeIn: (currentFrame, duration, options = {}) => {
    const { startOpacity = 0, endOpacity = 1 } = options;

    return interpolateStyles(
      currentFrame,
      [0, duration],
      [{ opacity: startOpacity }, { opacity: endOpacity }],
    );
  },

  // ⭐ SLIDE IN (từ bất kỳ hướng nào)
  slideIn: (currentFrame, duration, options = {}) => {
    const { direction = "left", distance = 100 } = options;

    const transforms = {
      left: [translateX(-distance), translateX(0)],
      right: [translateX(distance), translateX(0)],
      top: [translateY(-distance), translateY(0)],
      bottom: [translateY(distance), translateY(0)],
    };

    return interpolateStyles(
      currentFrame,
      [0, duration],
      [
        { transform: makeTransform([transforms[direction][0]]) },
        { transform: makeTransform([transforms[direction][1]]) },
      ],
    );
  },

  // ⭐ KEN BURNS (zoom + pan kết hợp)
  kenBurns: (currentFrame, duration, options = {}) => {
    const {
      startScale = 1.0,
      endScale = 1.3,
      startX = 0,
      endX = -50,
      loop = true,
    } = options;
    const loopFrame = loop ? currentFrame % duration : currentFrame;

    return interpolateStyles(
      loopFrame,
      [0, duration],
      [
        { transform: makeTransform([scale(startScale), translateX(startX)]) },
        { transform: makeTransform([scale(endScale), translateX(endX)]) },
      ],
    );
  },

  // ⭐ PARALLAX (nhiều layers khác tốc độ)
  parallax: (currentFrame, duration, options = {}) => {
    const { speed = 1, direction = "horizontal" } = options;
    const offset = currentFrame * speed;

    if (direction === "horizontal") {
      return { transform: makeTransform([translateX(-offset)]) };
    } else {
      return { transform: makeTransform([translateY(-offset)]) };
    }
  },
};

/**
 * 🎯 COMBINE nhiều animations
 */
export function combineAnimations(animations) {
  const combined = {};

  animations.forEach((anim) => {
    Object.keys(anim).forEach((key) => {
      if (key === "transform") {
        // Merge transforms
        combined.transform = combined.transform
          ? `${combined.transform} ${anim.transform}`
          : anim.transform;
      } else {
        // Override other properties
        combined[key] = anim[key];
      }
    });
  });

  return combined;
}
