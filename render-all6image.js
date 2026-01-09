const { execSync } = require("child_process");
const { videoData } = require("./src/data");
const fs = require("fs");
const path = require("path");

// ✅ Cấu hình độ phân giải Full HD Portrait
const VIDEO_CONFIG = {
  width: 1080,
  height: 1920, // Portrait orientation
  fps: 30,
  codec: "h264",
  crf: 18, // Chất lượng cao (18-23 là tốt)
  pixelFormat: "yuv420p",
};

// ✅ Cấu hình still images với nhiều frame
let STILL_CONFIG;

// 🔧 THAY ĐỔI CẤU HÌNH RENDER TẠI ĐÂY
const RENDER_SETTINGS = {
  // 🎬 Video settings
  enableVideo: false, // true/false - Có render video không?
  videoQuality: "high", // "low" | "medium" | "high" | "ultra"

  // 🖼️ Still settings
  enableStill: true, // true/false - Có render still không?
  stillFormat: "png", // "png" | "jpeg"
  stillFrames: [0, 30, 60, 90, 120, 150], // 6 frame cần capture

  // 📊 Advanced settings
  overwriteExisting: false, // Ghi đè file cũ hay không?
  showDetailedProgress: true, // Hiển thị tiến trình chi tiết
};

// ✅ Render modes
const RENDER_MODE = {
  VIDEO_ONLY: "video",
  STILL_ONLY: "still",
  BOTH: "both",
};

// 🎯 Auto-detect mode dựa trên enable flags
const currentMode = (() => {
  if (RENDER_SETTINGS.enableVideo && RENDER_SETTINGS.enableStill)
    return RENDER_MODE.BOTH;
  if (RENDER_SETTINGS.enableVideo) return RENDER_MODE.VIDEO_ONLY;
  if (RENDER_SETTINGS.enableStill) return RENDER_MODE.STILL_ONLY;
  throw new Error("❌ Phải enable ít nhất một trong video hoặc still!");
})();

// 🎨 Dynamic video quality settings
const getVideoQuality = (quality) => {
  const qualityMap = {
    low: { crf: 28, preset: "fast" },
    medium: { crf: 23, preset: "medium" },
    high: { crf: 18, preset: "slow" },
    ultra: { crf: 15, preset: "veryslow" },
  };
  return qualityMap[quality] || qualityMap.high;
};

// ✅ Initialize STILL_CONFIG after RENDER_SETTINGS is defined
STILL_CONFIG = {
  width: VIDEO_CONFIG.width,
  height: VIDEO_CONFIG.height,
  format: RENDER_SETTINGS.stillFormat,
  quality: 95,
  frames: RENDER_SETTINGS.stillFrames,
};

// Tạo thư mục outputs
const renderDir = "./renders";
const stillDir = "./renders/stills";

function createDirectories() {
  if (!fs.existsSync(renderDir)) {
    fs.mkdirSync(renderDir);
    console.log(`📁 Created directory: ${renderDir}`);
  }
  if (
    (currentMode === RENDER_MODE.STILL_ONLY ||
      currentMode === RENDER_MODE.BOTH) &&
    !fs.existsSync(stillDir)
  ) {
    fs.mkdirSync(stillDir, { recursive: true });
    console.log(`📁 Created directory: ${stillDir}`);
  }
}

function renderVideo(item) {
  // Kiểm tra file tồn tại
  const videoPath = `${renderDir}/${item.id}.mp4`;
  if (!RENDER_SETTINGS.overwriteExisting && fs.existsSync(videoPath)) {
    console.log(`   ⏭️  Video already exists, skipping...`);
    const stats = fs.statSync(videoPath);
    const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(1);
    return { success: true, size: fileSizeMB, type: "video", skipped: true };
  }

  const quality = getVideoQuality(RENDER_SETTINGS.videoQuality);
  const cmd =
    `npx remotion render ${item.id} ${videoPath} ` +
    `--width=${VIDEO_CONFIG.width} ` +
    `--height=${VIDEO_CONFIG.height} ` +
    `--fps=${VIDEO_CONFIG.fps} ` +
    `--codec=${VIDEO_CONFIG.codec} ` +
    `--crf=${quality.crf} ` +
    `--pixel-format=${VIDEO_CONFIG.pixelFormat} ` +
    `--serve-url=out`;

  execSync(cmd, {
    stdio: RENDER_SETTINGS.showDetailedProgress ? "inherit" : "pipe",
  });

  // Kiểm tra file video
  if (fs.existsSync(videoPath)) {
    const stats = fs.statSync(videoPath);
    const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(1);
    return { success: true, size: fileSizeMB, type: "video", skipped: false };
  }
  return { success: false, type: "video", skipped: false };
}

function renderMultipleStills(item) {
  let totalSize = 0;
  let successCount = 0;

  console.log(
    `   🖼️  Rendering ${STILL_CONFIG.frames.length} still images at frames: [${STILL_CONFIG.frames.join(", ")}]`,
  );

  for (const frame of STILL_CONFIG.frames) {
    const stillPath = `${stillDir}/${item.id}_frame${frame.toString().padStart(3, "0")}.${STILL_CONFIG.format}`;

    console.log(`      🎯 Processing frame ${frame}...`);

    // Kiểm tra file tồn tại
    if (!RENDER_SETTINGS.overwriteExisting && fs.existsSync(stillPath)) {
      console.log(`      ⏭️  Frame ${frame} already exists, skipping...`);
      const stats = fs.statSync(stillPath);
      const fileSizeMB = stats.size / (1024 * 1024);
      totalSize += fileSizeMB;
      successCount++;
      continue;
    }

    try {
      let cmd =
        `npx remotion still ${item.id} ${stillPath} ` +
        `--width=${STILL_CONFIG.width} ` +
        `--height=${STILL_CONFIG.height} ` +
        `--frame=${frame} ` +
        `--serve-url=out`;

      // Thêm quality nếu là JPEG
      if (STILL_CONFIG.format === "jpeg") {
        cmd += ` --quality=${STILL_CONFIG.quality}`;
      }

      console.log(`      📝 Command: ${cmd}`);

      execSync(cmd, {
        stdio: RENDER_SETTINGS.showDetailedProgress ? "inherit" : "pipe",
      });

      // Kiểm tra file still
      if (fs.existsSync(stillPath)) {
        const stats = fs.statSync(stillPath);
        const fileSizeMB = stats.size / (1024 * 1024);
        totalSize += fileSizeMB;
        successCount++;
        console.log(
          `      ✅ Frame ${frame}: ${fileSizeMB.toFixed(2)}MB - ${stillPath}`,
        );
      } else {
        console.log(
          `      ❌ Frame ${frame}: Failed to create file at ${stillPath}`,
        );
      }
    } catch (error) {
      console.log(`      ❌ Frame ${frame}: Error - ${error.message}`);
      console.log(
        `      🔍 Command was: npx remotion still ${item.id} ${stillPath} --frame=${frame}`,
      );
    }
  }

  console.log(
    `   📊 Rendered ${successCount}/${STILL_CONFIG.frames.length} frames successfully`,
  );

  return {
    success: successCount > 0,
    size: totalSize.toFixed(2),
    type: "stills",
    skipped: false,
    frameCount: successCount,
    totalFrames: STILL_CONFIG.frames.length,
  };
}

// ✅ Main render function
function renderItem(item, index) {
  console.log(`🎬 [${index + 1}/${videoData.length}] Processing: ${item.id}`);
  const results = [];
  const itemStartTime = Date.now();

  try {
    // Render video
    if (
      currentMode === RENDER_MODE.VIDEO_ONLY ||
      currentMode === RENDER_MODE.BOTH
    ) {
      console.log(`   📹 Rendering video...`);
      const videoResult = renderVideo(item);
      results.push(videoResult);
    }

    // Render multiple still images
    if (
      currentMode === RENDER_MODE.STILL_ONLY ||
      currentMode === RENDER_MODE.BOTH
    ) {
      const stillResult = renderMultipleStills(item);
      results.push(stillResult);
    }

    const renderTime = ((Date.now() - itemStartTime) / 1000).toFixed(1);

    // ✅ In kết quả
    const successResults = results.filter((r) => r.success);
    if (successResults.length > 0) {
      const sizeInfo = successResults
        .map((r) => {
          if (r.type === "stills") {
            return `${r.type}: ${r.size}MB (${r.frameCount}/${r.totalFrames} frames)`;
          }
          return `${r.type}: ${r.size}MB`;
        })
        .join(", ");
      console.log(`✅ Done: ${item.id} (${renderTime}s) - ${sizeInfo}\n`);
      return { success: true, results: successResults };
    } else {
      console.log(`❌ Failed: ${item.id}\n`);
      return { success: false, results: [] };
    }
  } catch (error) {
    console.error(`❌ Error processing ${item.id}:`, error.message);
    return { success: false, results: [] };
  }
}

// ✅ Main execution
createDirectories();

console.log(
  `🚀 Starting batch render in ${VIDEO_CONFIG.width}x${VIDEO_CONFIG.height} (Full HD Portrait)`,
);
console.log(
  `📊 Video: ${VIDEO_CONFIG.fps}fps, ${VIDEO_CONFIG.codec}, Quality: ${RENDER_SETTINGS.videoQuality}`,
);
console.log(`🔧 Mode: ${currentMode.toUpperCase()}`);
if (currentMode !== RENDER_MODE.VIDEO_ONLY) {
  console.log(
    `🖼️  Still: ${STILL_CONFIG.format.toUpperCase()}, Frames: [${STILL_CONFIG.frames.join(", ")}]`,
  );
}
console.log(
  `🔄 Overwrite existing: ${RENDER_SETTINGS.overwriteExisting ? "YES" : "NO"}`,
);
console.log("");

let successCount = 0;
let errorCount = 0;
const startTime = Date.now();

videoData.forEach((item, index) => {
  const result = renderItem(item, index);
  if (result.success) {
    successCount++;
  } else {
    errorCount++;
  }
});

// ✅ Báo cáo tổng kết
const totalTime = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
console.log(`\n🎯 RENDER COMPLETE`);
console.log(`✅ Success: ${successCount}`);
console.log(`❌ Errors: ${errorCount}`);
console.log(`⏱️  Total time: ${totalTime} minutes`);

// ✅ Tính tổng dung lượng cho videos
if (currentMode !== RENDER_MODE.STILL_ONLY && fs.existsSync(renderDir)) {
  const videoFiles = fs
    .readdirSync(renderDir)
    .filter((f) => f.endsWith(".mp4"));
  let totalVideoSize = 0;
  videoFiles.forEach((file) => {
    const stats = fs.statSync(path.join(renderDir, file));
    totalVideoSize += stats.size;
  });
  const totalVideoSizeMB = (totalVideoSize / (1024 * 1024)).toFixed(1);
  console.log(
    `📹 Videos: ${totalVideoSizeMB}MB (${videoFiles.length} files) - ${renderDir}`,
  );
}

// ✅ Tính tổng dung lượng cho stills với naming pattern mới
if (currentMode !== RENDER_MODE.VIDEO_ONLY && fs.existsSync(stillDir)) {
  const stillFiles = fs
    .readdirSync(stillDir)
    .filter(
      (f) => f.endsWith(".png") || f.endsWith(".jpeg") || f.endsWith(".jpg"),
    );
  let totalStillSize = 0;
  stillFiles.forEach((file) => {
    const stats = fs.statSync(path.join(stillDir, file));
    totalStillSize += stats.size;
  });
  const totalStillSizeMB = (totalStillSize / (1024 * 1024)).toFixed(1);
  console.log(
    `🖼️  Stills: ${totalStillSizeMB}MB (${stillFiles.length} files) - ${stillDir}`,
  );
}

console.log(`\n🎉 Batch render completed!`);
