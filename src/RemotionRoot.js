/**
 * Dynamic root component loader
 * Loads the correct root component based on root-config.js
 */
const { root_JSX } = require("../root-config");

// Dynamic require based on config - NO fs/path validation
const rootModule = require(`./rootComponents/${root_JSX}/R_A001`);

// Re-export the RemotionVideo component
export const RemotionVideo = rootModule.RemotionVideo;

// Log để biết đang dùng project nào
console.log(`🎬 Loaded Remotion Root: ${root_JSX}`);
