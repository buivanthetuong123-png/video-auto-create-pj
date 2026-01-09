// src/Components/ActionOrchestrator/actions/CountdownAction.jsx

import React from "react";
import CountDown from "../smallComponents/CountDown"; // ← Check path này
import { mergeStyles } from "../utils/cssOverrideManager";

function CountdownAction({ data }) {
  const {
    action,
    item,
    actionStartFrame,
    actionEndFrame,
    cssOverrides,
    className,
    id,
  } = data;

  return (
    <CountDown
      startFrame={actionStartFrame}
      endFrame={actionEndFrame}
      CountDownFrom={action.countDownFrom || 3}
      styleCss={mergeStyles(action, item, {}, className, id, cssOverrides)}
      zIndex={action.zIndex || 100}
      colorTheme={action.colorTheme || "green"}
      className={className}
      id={id}
    />
  );
}

export default CountdownAction;
