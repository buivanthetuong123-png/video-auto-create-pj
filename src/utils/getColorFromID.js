// 🎨 Dynamic Background Gradient Generator
// Tạo 100 gradient background khác nhau cho id từ 1-100

/**
 * Tạo màu HSL từ id
 * @param {number} id - ID từ 1-100
 * @param {number} offset - Offset để tạo màu thứ 2
 * @returns {string} CSS color
 */
function getColorFromId(id, offset = 0) {
  // Sử dụng golden ratio để phân bố màu đều
  const goldenRatio = 0.618033988749;
  const hue = ((id + offset) * goldenRatio * 360) % 360;
  const saturation = 65 + (id % 30); // 65-95%
  const lightness = 45 + (id % 20); // 45-65%

  return `hsl(${Math.round(hue)}, ${saturation}%, ${lightness}%)`;
}

/**
 * Tạo gradient background từ id
 * @param {number} id - ID từ 1-100
 * @returns {string} CSS gradient
 */
function generateGradientFromId(id) {
  // Đảm bảo id trong khoảng 1-100
  const normalizedId = ((id - 1) % 100) + 1;

  // Tạo 2 màu khác nhau
  const color1 = getColorFromId(normalizedId, 0);
  const color2 = getColorFromId(normalizedId, 37); // Offset 37 để tạo sự khác biệt

  // Tạo góc gradient đa dạng
  const angles = [45, 90, 135, 180, 225, 270, 315, 0];
  const angle = angles[normalizedId % angles.length];

  return `linear-gradient(${angle}deg, ${color1} 0%, ${color2} 100%)`;
}

/**
 * Tạo tất cả 100 gradient (để preview)
 * @returns {Array} Mảng 100 gradient
 */
function generateAllGradients() {
  const gradients = [];
  for (let i = 1; i <= 100; i++) {
    gradients.push({
      id: i,
      gradient: generateGradientFromId(i),
    });
  }
  return gradients;
}

/**
 * Alternative: Sử dụng palette màu có sẵn
 */
const GRADIENT_PRESETS = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", // Blue Purple
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", // Pink Red
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", // Blue Cyan
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)", // Green Mint
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)", // Pink Yellow
  "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)", // Mint Pink
  "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)", // Coral Pink
  "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)", // Peach
  "linear-gradient(135deg, #ff8a80 0%, #ea4c89 100%)", // Red Pink
  "linear-gradient(135deg, #8fd3f4 0%, #84fab0 100%)", // Blue Green
  "linear-gradient(135deg, #b721ff 0%, #21d4fd 100%)", // Purple Blue
  "linear-gradient(135deg, #f6d365 0%, #fda085 100%)", // Yellow Orange
  "linear-gradient(135deg, #96fbc4 0%, #f9f586 100%)", // Green Yellow
  "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)", // Pink Blue
  "linear-gradient(135deg, #fdbb2d 0%, #22c1c3 100%)", // Orange Teal
  "linear-gradient(135deg, #e0c3fc 0%, #9bb5ff 100%)", // Lavender Blue
  "linear-gradient(135deg, #cd9cf2 0%, #f6f3ff 100%)", // Purple White
  "linear-gradient(135deg, #fe6b8b 0%, #ff8e53 100%)", // Pink Orange
  "linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%)", // Green Mint
  "linear-gradient(135deg, #667db6 0%, #0082c8 100%)", // Blue
];

/**
 * Lấy gradient theo preset (cycle through 20 gradients)
 * @param {number} id - ID từ 1-100
 * @returns {string} CSS gradient
 */
function getPresetGradient(id) {
  const normalizedId = (id - 1) % GRADIENT_PRESETS.length;
  return GRADIENT_PRESETS[normalizedId];
}

/**
 * Mix cả hai approach - preset + dynamic
 * @param {number} id - ID từ 1-100
 * @returns {string} CSS gradient
 */
function getMixedGradient(id) {
  // 50% dùng preset, 50% dùng dynamic
  if (id <= 50) {
    return getPresetGradient(id);
  } else {
    return generateGradientFromId(id);
  }
}

// 🚀 MAIN FUNCTION để sử dụng trong code
/**
 * Lấy background gradient cho một ID cụ thể
 * @param {number} id - ID từ 1-100
 * @returns {string} CSS gradient string
 */
function getBackgroundForId(id) {
  // Chọn một trong ba cách:
  // return getPresetGradient(id);       // Dùng preset
  return generateGradientFromId(id); // Dùng dynamic
  // return getMixedGradient(id);        // Dùng mix
}

// ✅ Test function
console.log("Testing gradients for first 10 IDs:");
for (let i = 1; i <= 10; i++) {
  console.log(`ID ${i}: ${getBackgroundForId(i)}`);
}

// 📤 Export for use
module.exports = {
  getBackgroundForId,
  generateGradientFromId,
  getPresetGradient,
  getMixedGradient,
  generateAllGradients,
};

// 🎨 Example usage in your component:
/*
// Import function
const { getBackgroundForId } = require('./gradient-generator');

// In your React component or CSS generation:
const backgroundStyle = {
  background: getBackgroundForId(props.id) // props.id từ 1-100
};

// Or directly in CSS:
const cssString = `
  .background-${id} {
    background: ${getBackgroundForId(id)};
  }
`;
*/
