📋 Cách sử dụng CountDown trong codeFrame:
// ✅ VÍ DỤ 1: Countdown đơn giản (3-2-1)
const codeFrame = [
  {
    startFrame: 0,
    endFrame: 90, // 3 giây với 30fps
    text: null, // Không cần text
    styleCss: {},
    action: {
      cmd: "countdown",
      countDownFrom: 3,
      colorTheme: "red", // red/blue/green/purple/orange
      zIndex: 100
    }
  }
];

// ✅ VÍ DỤ 2: Countdown với text phụ bên dưới
const codeFrame = [
  {
    startFrame: 0,
    endFrame: 90,
    text: "Get Ready!", // Text hiển thị dưới countdown
    styleCss: {},
    action: {
      cmd: "countdown",
      countDownFrom: 3,
      colorTheme: "blue",
      zIndex: 100
    }
  }
];

// ✅ VÍ DỤ 3: Countdown từ 5 (5-4-3-2-1)
const codeFrame = [
  {
    startFrame: 0,
    endFrame: 150, // 5 giây
    text: "Starting Soon...",
    styleCss: {},
    action: {
      cmd: "countdown",
      countDownFrom: 5,
      colorTheme: "purple",
      zIndex: 150,
      styleCss: {
        backgroundColor: "rgba(0, 0, 0, 0.5)" // Background tối
      }
    }
  }
];

// ✅ VÍ DỤ 4: Kết hợp countdown + TypingText sau đó
const codeFrame = [
  // Phase 1: Countdown
  {
    startFrame: 0,
    endFrame: 90,
    text: null,
    styleCss: {},
    action: {
      cmd: "countdown",
      countDownFrom: 3,
      colorTheme: "green"
    }
  },
  // Phase 2: TypingText sau countdown
  {
    startFrame: 90,
    endFrame: 180,
    text: "Let's learn English!",
    styleCss: {},
    action: {
      cmd: "typingText",
      sound: true,
      styleCss: {
        fontSize: "60px",
        color: "yellow"
      }
    }
  }
];

// ✅ VÍ DỤ 5: Countdown với custom background
const codeFrame = [
  {
    startFrame: 0,
    endFrame: 90,
    text: "",
    styleCss: {},
    action: {
      cmd: "countdown",
      countDownFrom: 3,
      colorTheme: "orange",
      zIndex: 200,
      styleCss: {
        background: "linear-gradient(135deg, #1e3c72, #2a5298)",
        backdropFilter: "blur(20px)"
      }
    }
  }
];

Để thêm action mới, chỉ cần thêm case trong switch:
case "fadeIn":
  const opacity = Math.min((frame - currentItem.startFrame) / 30, 1);
  return (
    <div style={{...action.styleCss, opacity}}>
      {currentItem.text}
    </div>
  );

case "zoom":
  const scale = 1 + Math.sin((frame - currentItem.startFrame) * 0.1) * 0.2;
  return (
    <div style={{...action.styleCss, transform: `scale(${scale})`}}>
      {currentItem.text}
    </div>
  );


  Ví dụ 3: Action chỉ để inject CSS
  {
  startFrame: 50,
  endFrame: 150,
  actions: [
    {
      cmd: "actionCssClass", // Action mới
      text: "Custom Styled Text",
      toClass: "custom-style",
      toID: "unique-element",
      css: {
        background: "linear-gradient(45deg, red, blue)",
        borderRadius: "20px",
        padding: "30px",
        fontSize: "72px"
      }
    }
  ]
}


Thêm action mới: actionCssClass và actionCssId để inject CSS vào elements
[
      {
        cmd: "typingText",
        text: "Hello World",
        ToEndFrame: true, // Sẽ kéo dài đến endFrame cuối cùng
        ClassMark: "my-custom-class", // Thêm class
        IDMark: "text-intro", // Thêm id
      },
      {
        cmd: "fadeIn",
        ChangeStartFrame: 10, // Bắt đầu muộn hơn 10 frames
        ChangeEndFrame: -20, // Kết thúc sớm hơn 20 frames
        ClassMark: "fade-animation",
      }
    ]
///////////////////
mode /add && replace
     {
          "cmd": "actionCssId",
          "toID": "A001",
          "cssMode": "replace",
          "css": {
            "display": "none"
          }
        }