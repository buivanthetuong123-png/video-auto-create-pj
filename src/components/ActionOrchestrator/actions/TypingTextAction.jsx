// src/Components/ActionOrchestrator/actions/TypingTextAction.jsx

import React from "react";
import TypingText from "../smallComponents/text/TypingText";
import { mergeStyles } from "../utils/cssOverrideManager";

/**
 * 📝 TYPING TEXT ACTION
 *
 * Hiển thị text với typing animation
 */
function TypingTextAction({ data }) {
  const {
    action,
    item,
    frame,
    actionStartFrame,
    actionEndFrame,
    cssOverrides,
    defaultTextStyle,
    className,
    id,
  } = data;

  const hasText = item.text && item.text.trim() !== "";

  return (
    <TypingText
      text={
        action.text
          ? [{ text: action.text, type: "normal" }]
          : hasText
            ? [{ text: item.text, type: "normal" }]
            : [{ text: "", type: "normal" }]
      }
      frame={frame}
      styCss={mergeStyles(
        action,
        item,
        defaultTextStyle,
        className,
        id,
        cssOverrides,
      )}
      startFrame={actionStartFrame}
      endFrame={actionEndFrame}
      sound={action.sound !== false}
      noTyping={action.noTyping || false}
      typingSpeed={action.typingSpeed || "auto"}
      otherSoundList={action.otherSoundList || []}
      className={className}
      id={id}
    />
  );
}

export default TypingTextAction;
