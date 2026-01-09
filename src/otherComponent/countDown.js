import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  AbsoluteFill,
  interpolate,
} from "remotion";

// ========== CẤU HÌNH MÀU SẮC ==========
const COLOR_THEMES = {
  red: {
    ring: "#FF0050",
    gradient: "linear-gradient(135deg, #FF0050, #FF7A00, #FFD600)",
    glow: "rgba(255, 0, 80, 0.8)",
    stroke: "#C70039",
  },
  blue: {
    ring: "#00A8FF",
    gradient: "linear-gradient(135deg, #00A8FF, #0077FF, #4D94FF)",
    glow: "rgba(0, 168, 255, 0.8)",
    stroke: "#0056B3",
  },
  green: {
    ring: "#00FF88",
    gradient: "linear-gradient(135deg, #00FF88, #00CC66, #00AA44)",
    glow: "rgba(0, 255, 136, 0.8)",
    stroke: "#008844",
  },
  purple: {
    ring: "#B833FF",
    gradient: "linear-gradient(135deg, #B833FF, #8800FF, #DD00FF)",
    glow: "rgba(184, 51, 255, 0.8)",
    stroke: "#6600AA",
  },
  orange: {
    ring: "#FF6B00",
    gradient: "linear-gradient(135deg, #FF6B00, #FF9500, #FFBB00)",
    glow: "rgba(255, 107, 0, 0.8)",
    stroke: "#CC5500",
  },
};

function CountDown({
  startFrame = 30,
  endFrame = 90,
  CountDownFrom = 3,
  styleCss = {},
  zIndex = 100,
  colorTheme = "green", // ✅ CHỌN MÀU TẠI ĐÂY: "red", "blue", "green", "purple", "orange"
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Lấy màu sắc theo theme
  const colors = COLOR_THEMES[colorTheme] || COLOR_THEMES.red;

  // Tính số frames cho mỗi số đếm
  const totalFrames = endFrame - startFrame;
  const framesPerNumber = totalFrames / CountDownFrom;

  // Tính số hiện tại dựa trên frame
  const relativeFrame = frame - startFrame;
  const currentNumberIndex = Math.floor(relativeFrame / framesPerNumber);
  const currentNumber = CountDownFrom - currentNumberIndex;

  // Frame trong chu kỳ của số hiện tại (0 -> framesPerNumber)
  const frameInCycle = relativeFrame % framesPerNumber;

  // Animation: scale từ lớn xuống nhỏ rồi biến mất
  const scale = interpolate(
    frameInCycle,
    [0, framesPerNumber * 0.2, framesPerNumber * 0.8, framesPerNumber],
    [0.5, 1.2, 1, 0.8],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  // Opacity: fade in và fade out
  const opacity = interpolate(
    frameInCycle,
    [0, framesPerNumber * 0.1, framesPerNumber * 0.7, framesPerNumber],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  // Ring animation (vòng tròn mở rộng)
  const ringScale = interpolate(frameInCycle, [0, framesPerNumber], [0.8, 2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const ringOpacity = interpolate(
    frameInCycle,
    [0, framesPerNumber * 0.3, framesPerNumber],
    [0.6, 0.4, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  return (
    <Sequence from={startFrame} durationInFrames={totalFrames}>
      <AbsoluteFill style={{ zIndex }}>
        <AbsoluteFill
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "transparent",
            ...styleCss,
          }}
        >
          {currentNumber > 0 && currentNumber <= CountDownFrom && (
            <div
              style={{
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* Ring animation - vòng tròn ngoài */}
              <div
                style={{
                  position: "absolute",
                  width: "300px",
                  height: "300px",
                  borderRadius: "50%",
                  border: `8px solid ${colors.ring}`,
                  transform: `scale(${ringScale})`,
                  opacity: ringOpacity,
                  boxShadow: `0 0 40px ${colors.glow.replace("0.8", "0.6")}`,
                }}
              />

              {/* ✅ VIỀN ĐẬM - Outline layer */}
              <div
                style={{
                  position: "absolute",
                  fontSize: "200px",
                  fontWeight: "900",
                  color: colors.stroke,
                  transform: `scale(${scale})`,
                  opacity: opacity,
                  fontFamily: "Arial Black, sans-serif",
                  letterSpacing: "-5px",
                  zIndex: 1,
                  WebkitTextStroke: "12px " + colors.stroke, // Viền đậm 12px
                  textStroke: "12px " + colors.stroke,
                }}
              >
                {currentNumber}
              </div>

              {/* Số đếm ngược - Main text */}
              <div
                style={{
                  fontSize: "200px",
                  fontWeight: "900",
                  color: "#FFFFFF",
                  transform: `scale(${scale})`,
                  opacity: opacity,
                  textShadow: `
                    0 0 30px ${colors.glow},
                    0 0 50px ${colors.glow.replace("0.8", "0.6")},
                    0 0 70px ${colors.glow.replace("0.8", "0.4")},
                    0 6px 12px rgba(0, 0, 0, 0.7)
                  `,
                  background: colors.gradient,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  fontFamily: "Arial Black, sans-serif",
                  letterSpacing: "-5px",
                  position: "relative",
                  zIndex: 3,
                  WebkitTextStroke: "2px rgba(255, 255, 255, 0.3)", // Viền trắng mỏng
                }}
              >
                {currentNumber}
              </div>

              {/* Shadow layer để tăng độ nổi */}
              <div
                style={{
                  position: "absolute",
                  fontSize: "200px",
                  fontWeight: "900",
                  color: "#000000",
                  transform: `scale(${scale}) translate(6px, 6px)`,
                  opacity: opacity * 0.4,
                  fontFamily: "Arial Black, sans-serif",
                  letterSpacing: "-5px",
                  zIndex: 0,
                  filter: "blur(10px)",
                }}
              >
                {currentNumber}
              </div>
            </div>
          )}
        </AbsoluteFill>
      </AbsoluteFill>
    </Sequence>
  );
}

export default CountDown;
