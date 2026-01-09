// src/Components/ActionOrchestrator/ActionOrchestrator.jsx
import React from "react";
import { useCurrentFrame } from "remotion";
import { calculateCssOverrides } from "./utils/cssOverrideManager";
import { ACTION_REGISTRY } from "./utils/actionRegistry";

/**
 * 🎯 ACTION ORCHESTRATOR - File trung gian điều hành các actions
 *
 * Chức năng:
 * - Quản lý timeline và frame calculations
 * - Tìm các actions đang active
 * - Tính toán CSS overrides tích lũy
 * - Render actions thông qua registry
 */
function ActionOrchestrator({ codeFrame = [], textEnd }) {
  const frame = useCurrentFrame();

  // ✅ Tính toán toEndFrame
  const toEndFrame = React.useMemo(() => {
    if (codeFrame.length === 0) return 0;
    return Math.max(...codeFrame.map((item) => item.endFrame));
  }, [codeFrame]);

  // ✅ Tìm currentItem (fallback logic)
  const currentItem = React.useMemo(() => {
    return codeFrame.find(
      (item) => frame >= item.startFrame && frame < item.endFrame,
    );
  }, [codeFrame, frame]);

  // ✅ Tìm TẤT CẢ actions đang active
  const activeActions = React.useMemo(() => {
    const allActiveActions = [];

    codeFrame.forEach((item, itemIndex) => {
      const actions = Array.isArray(item.actions)
        ? item.actions
        : item.action
          ? [item.action]
          : [];

      actions.forEach((action, actionIndex) => {
        if (!action || !action.cmd) return;

        // Tính toán frame range
        let actionStartFrame = item.startFrame;
        let actionEndFrame = item.endFrame;

        if (action.ToEndFrame === true) {
          actionEndFrame = toEndFrame;
          if (typeof action.ChangeStartFrame === "number") {
            actionStartFrame = item.startFrame + action.ChangeStartFrame;
          }
        } else {
          if (typeof action.ChangeStartFrame === "number") {
            actionStartFrame = item.startFrame + action.ChangeStartFrame;
          }
          if (typeof action.ChangeEndFrame === "number") {
            actionEndFrame = item.endFrame + action.ChangeEndFrame;
          }
        }

        // Check active
        if (frame >= actionStartFrame && frame <= actionEndFrame) {
          allActiveActions.push({
            action,
            item,
            itemIndex,
            actionIndex,
            actionStartFrame,
            actionEndFrame,
          });
        }
      });
    });

    return allActiveActions;
  }, [codeFrame, frame, toEndFrame]);

  // ✅ Tính toán CSS Overrides tích lũy
  const cssOverrides = React.useMemo(() => {
    return calculateCssOverrides(codeFrame, frame, toEndFrame);
  }, [codeFrame, frame, toEndFrame]);

  // ✅ Default styles
  const defaultTextStyle = {
    padding: "20px",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: "15px",
    color: "white",
    fontSize: "48px",
    fontWeight: "600",
    border: "2px solid rgba(255, 255, 255, 0.3)",
    textAlign: "center",
    lineHeight: "1.5",
    minHeight: "100px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    maxHeight: "280px",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  const endingTextStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    padding: "50px 70px",
    background:
      "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
    borderRadius: "24px",
    border: "3px solid rgba(255, 255, 255, 0.3)",
    boxShadow:
      "0 25px 80px rgba(102, 126, 234, 0.4), 0 10px 40px rgba(118, 75, 162, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(10px)",
    color: "#ffffff",
    fontSize: "72px",
    fontWeight: "900",
    textAlign: "center",
    lineHeight: "1.2",
    letterSpacing: "-1px",
    maxWidth: "90%",
    minWidth: "80%",
    textShadow:
      "0 4px 30px rgba(0, 0, 0, 0.5), 0 2px 10px rgba(102, 126, 234, 0.8), 0 0 60px rgba(240, 147, 251, 0.4)",
  };

  // ✅ Function render action thông qua registry
  const renderAction = (activeActionData) => {
    const {
      action,
      item,
      itemIndex,
      actionIndex,
      actionStartFrame,
      actionEndFrame,
    } = activeActionData;

    // Lấy ActionComponent từ registry
    const ActionComponent = ACTION_REGISTRY[action.cmd];

    if (!ActionComponent) {
      console.warn(
        `[ActionOrchestrator] ⚠️ Unknown action cmd: "${action.cmd}"`,
      );
      return null;
    }

    // ✅ Chuẩn bị data object thống nhất
    const actionData = {
      // Core data
      action,
      item,
      frame,

      // Frame timing
      actionStartFrame,
      actionEndFrame,
      toEndFrame,

      // Styling
      cssOverrides,
      defaultTextStyle,

      // Identifiers
      itemIndex,
      actionIndex,

      // Class & ID marks
      className: item.ClassMark,
      id: item.IDMark,
    };

    // ✅ Render component với data object
    return (
      <ActionComponent
        key={`${action.cmd}-${itemIndex}-${actionIndex}`}
        data={actionData}
      />
    );
  };

  // ✅ Render content
  const renderContent = () => {
    if (activeActions.length > 0) {
      return (
        <>
          {activeActions.map((activeActionData) =>
            renderAction(activeActionData),
          )}
        </>
      );
    }

    if (currentItem) {
      const hasText = currentItem.text && currentItem.text.trim() !== "";
      if (hasText) {
        return (
          <div style={currentItem.styleCss || defaultTextStyle}>
            {currentItem.text}
          </div>
        );
      }
    }

    return <div style={endingTextStyle}>{textEnd}</div>;
  };

  return <>{renderContent()}</>;
}

export default ActionOrchestrator;
