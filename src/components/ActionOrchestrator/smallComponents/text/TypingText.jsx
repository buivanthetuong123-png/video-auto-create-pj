import React from "react";
import { Audio, staticFile, Sequence } from "remotion";
import typingSound from "../../../../assets/soundDefault/TypingSoundCapcut.mp3";
import SoundPlayer from "../media/SoundPlayer";

/**
 * Component hiển thị text với typing animation
 */
const TypingText = ({
  text = [{ text: "I love you!", type: "normal" }],
  frame,
  styCss = {},
  startFrame = 30,
  endFrame = 90,
  sound = true,
  noTyping = false,
  otherSoundList = [],
  fps = 30,
}) => {
  const typingDuration = 3; // 3 giây
  const typingFrames = typingDuration * fps;

  if (frame < startFrame || frame > endFrame) return null;

  // Tạo chuỗi kết hợp từ array (chỉ tính text, không tính type02)
  const combinedText = text
    .map((item) => (item.type === "type02" ? "" : item.text))
    .join("");

  // Tính progress
  const progress = noTyping
    ? 1
    : Math.min((frame - startFrame) / typingFrames, 1);
  const visibleChars = Math.floor(progress * combinedText.length);

  // Tạo array để lưu thông tin về từng phần text
  let textSegments = [];
  let currentPosition = 0;

  text.forEach((item, index) => {
    if (item.type === "type02") {
      if (noTyping || visibleChars >= currentPosition) {
        textSegments.push({
          text: "",
          type: item.type,
          key: index,
        });
      }
    } else {
      const segmentLength = item.text.length;
      const segmentStart = currentPosition;

      let displayText = "";
      if (noTyping) {
        displayText = item.text;
      } else if (visibleChars > segmentStart) {
        const charsToShow = Math.min(
          visibleChars - segmentStart,
          segmentLength,
        );
        displayText = item.text.slice(0, charsToShow);
      }

      if (displayText.length > 0) {
        textSegments.push({
          text: displayText,
          type: item.type,
          key: index,
        });
      }

      currentPosition += segmentLength;
    }
  });

  // Function để lấy style dựa trên type
  const getStyleByType = (type) => {
    switch (type) {
      case "type01":
        return {
          fontWeight: "bold",
          fontStyle: "italic",
          color: "blue",
        };
      case "typered":
        return {
          fontWeight: "bold",
          fontStyle: "italic",
          color: "red",
        };
      case "typeIPA":
        return {
          fontWeight: "bold",
        };
      case "normal":
      default:
        return {};
    }
  };

  // Function để highlight các ký tự IPA
  const highlightIPAChars = (text) => {
    const ipaChars = [
      "U",
      "u",
      "E",
      "e",
      "O",
      "o",
      "A",
      "a",
      "I",
      "i",
      "Ơ",
      "Ờ",
      "ờ",
      "ơ",
    ];
    const parts = [];
    let currentText = "";

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (ipaChars.includes(char)) {
        if (currentText) {
          parts.push({ text: currentText, highlight: false });
          currentText = "";
        }
        parts.push({ text: char, highlight: true });
      } else {
        currentText += char;
      }
    }

    if (currentText) {
      parts.push({ text: currentText, highlight: false });
    }

    return parts;
  };

  return (
    <div style={styCss}>
      {textSegments.map((segment) => (
        <React.Fragment key={segment.key}>
          {segment.type === "type02" ? (
            <hr />
          ) : (
            <span style={getStyleByType(segment.type)}>
              {segment.type === "typeIPA"
                ? highlightIPAChars(segment.text).map((part, partIndex) => (
                    <span
                      key={`${segment.key}-${partIndex}`}
                      style={{
                        ...getStyleByType(segment.type),
                        color: part.highlight ? "red" : "inherit",
                      }}
                    >
                      {part.text}
                    </span>
                  ))
                : segment.text}
            </span>
          )}
        </React.Fragment>
      ))}

      {/* Typing sound */}
      {sound && !noTyping ? (
        <Sequence from={startFrame}>
          <Audio src={typingSound} />
        </Sequence>
      ) : null}

      {/* Other sounds */}
      {otherSoundList.length > 0
        ? otherSoundList.map((e, i) => (
            <SoundPlayer
              key={i}
              startFrame={e.startFrame ? e.startFrame + startFrame : startFrame}
              endFrame={e.endFrame ? e.endFrame + startFrame : endFrame}
              sound={e.sound !== undefined ? e.sound : true}
              soundSource={e.soundSource}
              volume={e.volume || 1}
            />
          ))
        : null}
    </div>
  );
};

export default TypingText;
