//imgViewByCodeFrame.js
import React, { useState, useEffect } from "react";
import {
  useCurrentFrame,
  staticFile,
  continueRender,
  delayRender,
} from "remotion";

function ImageView({
  codeFrame = [],
  imgSize = "800px",
  width = "100%",
  height = "100%",
}) {
  const frame = useCurrentFrame();
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadedImages, setLoadedImages] = useState({});
  const [handle] = useState(() => delayRender("Loading images"));

  // Pre-load tất cả hình ảnh
  useEffect(() => {
    const uniqueImagePaths = [
      ...new Set(
        codeFrame.filter((item) => item.imgPath).map((item) => item.imgPath),
      ),
    ];

    if (uniqueImagePaths.length === 0) {
      setImagesLoaded(true);
      continueRender(handle);
      return;
    }

    let loadedCount = 0;
    const imageCache = {};

    uniqueImagePaths.forEach((imgPath) => {
      const img = new Image();
      img.src = staticFile(imgPath);

      img.onload = () => {
        imageCache[imgPath] = img.src;
        loadedCount++;
        console.log(
          `✅ Loaded image ${loadedCount}/${uniqueImagePaths.length}: ${imgPath}`,
        );

        if (loadedCount === uniqueImagePaths.length) {
          console.log("🎉 All images preloaded successfully!");
          setLoadedImages(imageCache);
          setImagesLoaded(true);
          continueRender(handle);
        }
      };

      img.onerror = () => {
        console.warn(`⚠️ Failed to load image: ${imgPath}`);
        imageCache[imgPath] = null;
        loadedCount++;

        if (loadedCount === uniqueImagePaths.length) {
          setLoadedImages(imageCache);
          setImagesLoaded(true);
          continueRender(handle);
        }
      };
    });
  }, [codeFrame, handle]);

  const currentItem = codeFrame.find(
    (item) => frame >= item.startFrame && frame < item.endFrame,
  );

  if (!imagesLoaded || !currentItem) {
    return null;
  }

  if (!currentItem.imgPath) {
    return null;
  }

  if (!loadedImages[currentItem.imgPath]) {
    return (
      <div
        style={{
          width,
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: "24px",
        }}
      >
        Image not found
      </div>
    );
  }

  return (
    <div
      style={{
        width,
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {/* Outer glow background */}
      <div
        style={{
          position: "absolute",
          width: `calc(${imgSize} + 60px)`,
          height: `calc(${imgSize} + 60px)`,
          background:
            "radial-gradient(ellipse, rgba(255, 215, 0, 0.25), transparent 70%)",
          borderRadius: "40px",
          filter: "blur(30px)",
        }}
      />

      {/* Main image container */}
      <div
        style={{
          position: "relative",
          width: imgSize,
          height: imgSize,
        }}
      >
        {/* Gradient border frame */}
        <div
          style={{
            position: "absolute",
            inset: "-5px",
            background:
              "linear-gradient(135deg, #FFD700, #FF6B00, #FF1744, #FFD700)",
            borderRadius: "35px",
            padding: "5px",
            boxShadow: `
              0 0 30px rgba(255, 215, 0, 0.6),
              0 0 60px rgba(255, 107, 0, 0.4),
              0 20px 80px rgba(0, 0, 0, 0.9)
            `,
          }}
        >
          {/* Inner shadow layer */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              background: "#000",
              borderRadius: "30px",
              padding: "8px",
              boxShadow: "inset 0 0 40px rgba(255, 215, 0, 0.15)",
            }}
          >
            {/* Image wrapper */}
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "25px",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <img
                src={loadedImages[currentItem.imgPath]}
                alt={currentItem.code || "Image"}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />

              {/* Inner glow overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(circle at center, transparent 40%, rgba(0, 0, 0, 0.3) 100%)",
                  pointerEvents: "none",
                }}
              />
            </div>
          </div>
        </div>

        {/* Corner decorations */}
        {[
          { top: "-8px", left: "-8px", rotate: "0deg" },
          { top: "-8px", right: "-8px", rotate: "90deg" },
          { bottom: "-8px", right: "-8px", rotate: "180deg" },
          { bottom: "-8px", left: "-8px", rotate: "270deg" },
        ].map((pos, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              ...pos,
              width: "80px",
              height: "80px",
              borderTop: "4px solid rgba(255, 215, 0, 0.8)",
              borderLeft: "4px solid rgba(255, 215, 0, 0.8)",
              borderRadius: "12px 0 0 0",
              transform: `rotate(${pos.rotate})`,
              boxShadow: "0 0 15px rgba(255, 215, 0, 0.5)",
              zIndex: 10,
            }}
          />
        ))}

        {/* Center accent points */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "-15px",
            transform: "translateY(-50%)",
            width: "8px",
            height: "60px",
            background:
              "linear-gradient(180deg, transparent, #FFD700, transparent)",
            borderRadius: "10px",
            boxShadow: "0 0 20px rgba(255, 215, 0, 0.8)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            right: "-15px",
            transform: "translateY(-50%)",
            width: "8px",
            height: "60px",
            background:
              "linear-gradient(180deg, transparent, #FFD700, transparent)",
            borderRadius: "10px",
            boxShadow: "0 0 20px rgba(255, 215, 0, 0.8)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "-15px",
            transform: "translateX(-50%)",
            width: "60px",
            height: "8px",
            background:
              "linear-gradient(90deg, transparent, #FFD700, transparent)",
            borderRadius: "10px",
            boxShadow: "0 0 20px rgba(255, 215, 0, 0.8)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: "-15px",
            transform: "translateX(-50%)",
            width: "60px",
            height: "8px",
            background:
              "linear-gradient(90deg, transparent, #FFD700, transparent)",
            borderRadius: "10px",
            boxShadow: "0 0 20px rgba(255, 215, 0, 0.8)",
          }}
        />

        {/* Small corner dots */}
        {[
          { top: "20px", left: "20px" },
          { top: "20px", right: "20px" },
          { bottom: "20px", right: "20px" },
          { bottom: "20px", left: "20px" },
        ].map((pos, i) => (
          <div
            key={`dot-${i}`}
            style={{
              position: "absolute",
              ...pos,
              width: "12px",
              height: "12px",
              background: "radial-gradient(circle, #FFD700, #FF6B00)",
              borderRadius: "50%",
              boxShadow:
                "0 0 15px rgba(255, 215, 0, 0.9), inset 0 0 5px rgba(255, 255, 255, 0.5)",
              border: "2px solid rgba(255, 255, 255, 0.3)",
              zIndex: 10,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default ImageView;
