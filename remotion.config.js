import { Config } from "@remotion/cli/config";

// ✅ Cấu hình mặc định cho 2K
Config.setVideoImageFormat("jpeg");
Config.setPixelFormat("yuv420p");
Config.setCodec("h264");
Config.setCrf(18); // Chất lượng cao cho 2K

// ✅ Cấu hình performance cho 2K render
Config.setConcurrency(1); // Giảm concurrency vì 2K tốn RAM
Config.setChromiumOpenGlRenderer("egl"); // Tăng performance GPU

// ✅ Override mặc định nếu cần
Config.overrideWebpackConfig((config) => {
  return {
    ...config,
    // Tối ưu cho 2K rendering
    resolve: {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
      },
    },
  };
});

// ✅ Cấu hình image format (format mới)
Config.setVideoImageFormat("jpeg"); // Cho video frames
Config.setStillImageFormat("png"); // Cho still images

// ✅ Cấu hình entry point (sửa đường dẫn cho đúng)
// Config.setEntryPoint("./src/index.ts"); // Nếu có file này
// Config.setEntryPoint("./src/RemotionVideo.js"); // Hoặc file JS
// Config.setEntryPoint("./src/index.js"); // Hoặc entry point khác
