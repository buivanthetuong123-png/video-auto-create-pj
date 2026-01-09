/**
 * Utility functions để resolve đường dẫn cho audio và image files
 */

/**
 * Lấy đường dẫn audio từ code
 * @param {Object} item - Item có thuộc tính code
 * @returns {string|null} - Đường dẫn audio hoặc null
 */
export const getAudioPath = (item) => {
  if (!item || !item.code) return null;
  
  if (item.code.includes("_")) {
    const prefix = item.code.split("_")[0];
    return `audio/${prefix}/${item.code}.mp3`;
  } else {
    return `audio/khac/${item.code}.mp3`;
  }
};

/**
 * Lấy đường dẫn image từ img property
 * @param {Object} item - Item có thuộc tính img
 * @returns {string|null} - Đường dẫn image hoặc null
 */
export const getImagePath = (item) => {
  if (!item || !item.img) return null;
  
  if (item.img.includes("_")) {
    const prefix = item.img.split("_")[0];
    return `assets/${prefix}/${item.img}`;
  } else {
    return `assets/khac/${item.img}`;
  }
};

/**
 * Lấy đường dẫn video từ videoSource
 * @param {string} videoSource - Tên video source
 * @returns {string|null} - Đường dẫn video hoặc null
 */
export const getVideoPath = (videoSource) => {
  if (!videoSource) return null;
  return `audio/mp4/${videoSource}.mp4`;
};