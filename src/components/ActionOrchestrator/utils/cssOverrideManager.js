// src/Components/ActionOrchestrator/utils/cssOverrideManager.js

/**
 * 🎨 CSS OVERRIDE MANAGER
 * Quản lý việc tính toán CSS overrides tích lũy theo timeline
 */

export function calculateCssOverrides(codeFrame, currentFrame, toEndFrame) {
  const overrides = {
    byId: {},
    byClass: {},
  };

  const executedCssActions = [];

  // Thu thập CSS actions đã chạy
  codeFrame.forEach((item, itemIndex) => {
    const actions = Array.isArray(item.actions)
      ? item.actions
      : item.action
        ? [item.action]
        : [];

    actions.forEach((action, actionIndex) => {
      if (
        !action ||
        !action.cmd ||
        (action.cmd !== "actionCssClass" && action.cmd !== "actionCssId")
      ) {
        return;
      }

      let actionStartFrame = item.startFrame;
      if (action.ToEndFrame === true) {
        if (typeof action.ChangeStartFrame === "number") {
          actionStartFrame = item.startFrame + action.ChangeStartFrame;
        }
      } else {
        if (typeof action.ChangeStartFrame === "number") {
          actionStartFrame = item.startFrame + action.ChangeStartFrame;
        }
      }

      if (currentFrame >= actionStartFrame) {
        executedCssActions.push({
          action,
          itemIndex,
          actionIndex,
          actionStartFrame,
        });
      }
    });
  });

  // Sắp xếp theo thời gian
  executedCssActions.sort((a, b) => {
    if (a.actionStartFrame !== b.actionStartFrame) {
      return a.actionStartFrame - b.actionStartFrame;
    }
    if (a.itemIndex !== b.itemIndex) {
      return a.itemIndex - b.itemIndex;
    }
    return a.actionIndex - b.actionIndex;
  });

  // Apply CSS
  executedCssActions.forEach(({ action }) => {
    const cssMode = action.cssMode || "replace";

    if (action.toID && action.css) {
      if (cssMode === "replace") {
        overrides.byId[action.toID] = { ...action.css };
      } else {
        overrides.byId[action.toID] = {
          ...(overrides.byId[action.toID] || {}),
          ...action.css,
        };
      }
    }

    if (action.toClass && action.css) {
      if (cssMode === "replace") {
        overrides.byClass[action.toClass] = { ...action.css };
      } else {
        overrides.byClass[action.toClass] = {
          ...(overrides.byClass[action.toClass] || {}),
          ...action.css,
        };
      }
    }
  });

  return overrides;
}

/**
 * Apply CSS overrides lên base style
 */
export function applyCssOverrides(baseStyle, className, id, cssOverrides) {
  let finalStyle = { ...baseStyle };

  if (className && cssOverrides.byClass[className]) {
    finalStyle = { ...finalStyle, ...cssOverrides.byClass[className] };
  }

  if (id && cssOverrides.byId[id]) {
    finalStyle = { ...finalStyle, ...cssOverrides.byId[id] };
  }

  return finalStyle;
}

/**
 * Merge styles: action.css → item.styleCss → CSS overrides
 */
export function mergeStyles(
  action,
  item,
  defaultStyle,
  className,
  id,
  cssOverrides,
) {
  let finalStyle = { ...(action.styleCss || item.styleCss || defaultStyle) };

  if (action.css) {
    finalStyle = { ...finalStyle, ...action.css };
  }

  finalStyle = applyCssOverrides(finalStyle, className, id, cssOverrides);

  return finalStyle;
}
