// src/Components/ActionOrchestrator/actions/FadeInAction.jsx

import React from "react";
import { mergeStyles } from "../utils/cssOverrideManager";

/**
 * 🌅 FADE IN ACTION
 *
 * Hiệu ứng fade in từ opacity 0 → 1
 */
function FadeInAction({ data }) {
  const {
    action,
    item,
    frame,
    actionStartFrame,
    cssOverrides,
    defaultTextStyle,
    className,
    id,
  } = data;

  const fadeProgress = Math.min(
    (frame - actionStartFrame) / (action.fadeDuration || 30),
    1,
  );

  return (
    <div
      className={className}
      id={id}
      style={{
        ...mergeStyles(
          action,
          item,
          defaultTextStyle,
          className,
          id,
          cssOverrides,
        ),
        opacity: fadeProgress,
      }}
    >
      {action.text || item.text}
    </div>
  );
}

export default FadeInAction;
