
```

---

## 📄 7. README.txt (Documentation)
```
╔══════════════════════════════════════════════════════════════════╗
║          ACTION ORCHESTRATOR - HƯỚNG DẪN SỬ DỤNG                 ║
╚══════════════════════════════════════════════════════════════════╝

📋 MỤC LỤC
═══════════════════════════════════════════════════════════════════
1. GIỚI THIỆU
2. CẤU TRÚC THƯ MỤC
3. CÁCH SỬ DỤNG CƠ BẢN
4. CÁC LOẠI ACTION
   4.1. typingText
   4.2. countdown
   4.3. fadeIn / fadeOut
   4.4. zoom
   4.5. slide
   4.6. static
   4.7. actionCssClass / actionCssId
5. CSS OVERRIDES VÀ STYLING
6. TIMELINE VÀ FRAME CONTROL
7. THÊM ACTION MỚI
8. TROUBLESHOOTING

═══════════════════════════════════════════════════════════════════
1. GIỚI THIỆU
═══════════════════════════════════════════════════════════════════

ActionOrchestrator là file trung gian điều hành tất cả các actions
trong video Remotion. Thay vì truyền từng prop riêng lẻ, hệ thống
sử dụng data object thống nhất để dễ mở rộng.

Ưu điểm:
✅ Dễ thêm key mới mà không cần sửa file trung gian
✅ Code gọn gàng, dễ bảo trì
✅ Mỗi action là 1 file riêng, dễ debug
✅ CSS overrides tích lũy theo timeline

═══════════════════════════════════════════════════════════════════
2. CẤU TRÚC THƯ MỤC
═══════════════════════════════════════════════════════════════════

src/Components/ActionOrchestrator/
├── ActionOrchestrator.jsx       // File trung gian chính
├── README.txt                   // File này
├── actions/                     // Các action components
│   ├── TypingTextAction.jsx
│   ├── CountdownAction.jsx
│   ├── FadeInAction.jsx
│   ├── FadeOutAction.jsx
│   ├── ZoomAction.jsx
│   ├── SlideAction.jsx
│   └── StaticAction.jsx
├── utils/                       // Utilities
│   ├── cssOverrideManager.js   // Xử lý CSS
│   └── actionRegistry.js       // Registry mapping
└── components/                  // Shared components
    └── CountDown.jsx

═══════════════════════════════════════════════════════════════════
3. CÁCH SỬ DỤNG CƠ BẢN
═══════════════════════════════════════════════════════════════════

import ActionOrchestrator from "./Components/ActionOrchestrator/ActionOrchestrator";

const codeFrame = [
  {
    startFrame: 0,
    endFrame: 90,
    text: "Hello World",
    styleCss: { fontSize: "60px" },
    action: {
      cmd: "typingText",
      sound: true,
      typingSpeed: "auto"
    }
  }
];

<ActionOrchestrator codeFrame={codeFrame} textEnd="The End" />

═══════════════════════════════════════════════════════════════════
4. CÁC LOẠI ACTION
═══════════════════════════════════════════════════════════════════

────────────────────────────────────────────────────────────────────
4.1. typingText - Typing Animation
────────────────────────────────────────────────────────────────────

✅ VÍ DỤ 1: Typing text đơn giản
─────────────────────────────────
{
  startFrame: 0,
  endFrame: 90,
  text: "Hello World!",
  action: {
    cmd: "typingText",
    sound: true,           // Bật âm thanh typing
    noTyping: false,       // false = có hiệu ứng typing
    typingSpeed: "auto"    // "auto" | "slow" | "fast"
  }
}

✅ VÍ DỤ 2: Custom text trong action
─────────────────────────────────────
{
  startFrame: 0,
  endFrame: 90,
  action: {
    cmd: "typingText",
    text: "This text overrides item.text",  // ✅ Ưu tiên
    styleCss: {
      fontSize: "72px",
      color: "#FF0050"
    },
    sound: false
  }
}

✅ VÍ DỤ 3: Với âm thanh riêng
──────────────────────────────
{
  startFrame: 0,
  endFrame: 120,
  text: "Listen to this!",
  action: {
    cmd: "typingText",
    sound: true,
    otherSoundList: [
      {
        startFrame: 30,
        soundSource: "VocabDaily_hello",
        volume: 1
      }
    ]
  }
}

KEYS CÓ THỂ DÙNG:
─────────────────
- text: string               // Text hiển thị (override item.text)
- styleCss: object           // CSS inline cho action
- sound: boolean             // Bật/tắt âm typing
- noTyping: boolean          // true = hiện toàn bộ text ngay
- typingSpeed: string        // "auto" | "slow" | "fast"
- otherSoundList: array      // Danh sách âm thanh riêng

────────────────────────────────────────────────────────────────────
4.2. countdown - Countdown Timer
────────────────────────────────────────────────────────────────────

✅ VÍ DỤ 1: Countdown cơ bản (3-2-1)
────────────────────────────────────
{
  startFrame: 0,
  endFrame: 90,
  text: null,                // Không cần text
  action: {
    cmd: "countdown",
    countDownFrom: 3,        // Đếm từ 3
    colorTheme: "red",       // "red" | "blue" | "green" | "purple" | "orange"
    zIndex: 100
  }
}

✅ VÍ DỤ 2: Countdown 5 giây với theme xanh
───────────────────────────────────────────
{
  startFrame: 60,
  endFrame: 210,            // 150 frames = 5 giây @ 30fps
  action: {
    cmd: "countdown",
    countDownFrom: 5,
    colorTheme: "green",
    styleCss: {
      fontSize: "300px"     // Custom size
    }
  }
}

KEYS CÓ THỂ DÙNG:
─────────────────
- countDownFrom: number      // Số bắt đầu đếm
- colorTheme: string         // Màu sắc theme
- zIndex: number             // Z-index layer
- styleCss: object           // CSS override

────────────────────────────────────────────────────────────────────
4.3. fadeIn / fadeOut - Fade Effects
────────────────────────────────────────────────────────────────────

✅ VÍ DỤ 1: Fade In trong 1 giây
────────────────────────────────
{
  startFrame: 0,
  endFrame: 90,
  text: "Fade in slowly...",
  action: {
    cmd: "fadeIn",
    fadeDuration: 30,        // 30 frames = 1 giây @ 30fps
    styleCss: {
      fontSize: "48px"
    }
  }
}

✅ VÍ DỤ 2: Fade Out ở cuối
───────────────────────────
{
  startFrame: 60,
  endFrame: 150,
  text: "Disappearing...",
  action: {
    cmd: "fadeOut",
    fadeDuration: 30
  }
}

KEYS CÓ THỂ DÙNG:
─────────────────
- text: string               // Text hiển thị
- fadeDuration: number       // Thời gian fade (frames)
- styleCss: object           // CSS inline

────────────────────────────────────────────────────────────────────
4.4. zoom - Zoom Animation
────────────────────────────────────────────────────────────────────

✅ VÍ DỤ: Zoom in/out liên tục
──────────────────────────────
{
  startFrame: 0,
  endFrame: 120,
  text: "Zoom effect!",
  action: {
    cmd: "zoom",
    zoomAmount: 0.3,         // 30% scale variation
    styleCss: {
      fontSize: "64px"
    }
  }
}

KEYS CÓ THỂ DÙNG:
─────────────────
- text: string               // Text hiển thị
- zoomAmount: number         // Mức độ zoom (0.1 - 1.0)
- styleCss: object           // CSS inline

────────────────────────────────────────────────────────────────────
4.5. slide - Slide In Animation
────────────────────────────────────────────────────────────────────

✅ VÍ DỤ 1: Slide từ trái
──────────────────────────
{
  startFrame: 0,
  endFrame: 90,
  text: "Sliding in!",
  action: {
    cmd: "slide",
    direction: "left",       // "left" | "right" | "top" | "bottom"
    slideDuration: 30
  }
}

✅ VÍ DỤ 2: Slide từ trên xuống
───────────────────────────────
{
  startFrame: 30,
  endFrame: 90,
  text: "Coming from top!",
  action: {
    cmd: "slide",
    direction: "top",
    slideDuration: 20
  }
}

KEYS CÓ THỂ DÙNG:
─────────────────
- text: string               // Text hiển thị
- direction: string          // Hướng slide
- slideDuration: number      // Thời gian slide (frames)
- styleCss: object           // CSS inline

────────────────────────────────────────────────────────────────────
4.6. static - Static Display
────────────────────────────────────────────────────────────────────

✅ VÍ DỤ: Hiển thị tĩnh không animation
────────────────────────────────────────
{
  startFrame: 0,
  endFrame: 60,
  text: "Static text",
  action: {
    cmd: "static",
    styleCss: {
      fontSize: "48px",
      color: "#FFD700"
    }
  }
}

────────────────────────────────────────────────────────────────────
4.7. actionCssClass / actionCssId - CSS Overrides
────────────────────────────────────────────────────────────────────

✅ VÍ DỤ 1: Ẩn element theo ID
──────────────────────────────
{
  startFrame: 90,
  endFrame: 90,
  action: {
    cmd: "actionCssId",
    toID: "textA001",        // Target ID
    cssMode: "replace",      // "replace" | "add"
    css: {
      display: "none"        // Ẩn element
    }
  }
}

✅ VÍ DỤ 2: Đổi màu theo Class
──────────────────────────────
{
  startFrame: 60,
  endFrame: 60,
  action: {
    cmd: "actionCssClass",
    toClass: "highlight",    // Target class
    cssMode: "add",          // Merge với CSS hiện tại
    css: {
      color: "#FF0050",
      fontWeight: "bold"
    }
  }
}

✅ VÍ DỤ 3: Kết hợp với ClassMark/IDMark
────────────────────────────────────────
// Bước 1: Đánh dấu element
{
  startFrame: 0,
  endFrame: 120,
  text: "Target element",
  ClassMark: "myElement",    // ✅ Đánh dấu class
  IDMark: "element001",      // ✅ Đánh dấu ID
  action: {
    cmd: "typingText"
  }
}

// Bước 2: Thay đổi CSS sau đó
{
  startFrame: 90,
  endFrame: 90,
  action: {
    cmd: "actionCssId",
    toID: "element001",      // ✅ Target ID đã đánh dấu
    css: {
      transform: "scale(1.5)",
      color: "#00FF00"
    }
  }
}

KEYS CÓ THỂ DÙNG:
─────────────────
- toID: string               // Target element ID
- toClass: string            // Target element class
- cssMode: string            // "replace" | "add"
- css: object                // CSS properties

LƯU Ý QUAN TRỌNG:
─────────────────
- actionCssClass/actionCssId KHÔNG render element
- Chỉ thay đổi CSS của elements khác
- CSS overrides tích lũy theo timeline
- Action sau ghi đè action trước

═══════════════════════════════════════════════════════════════════
5. CSS OVERRIDES VÀ STYLING
═══════════════════════════════════════════════════════════════════

THỨ TỰ ƯU TIÊN CSS (từ thấp đến cao):
──────────────────────────────────────
1. defaultTextStyle            (Từ ActionOrchestrator)
2. item.styleCss               (CSS ở cấp item)
3. action.styleCss             (CSS ở cấp action)
4. action.css                  (Inline CSS trong action)
5. CSS Override by Class       (Từ actionCssClass)
6. CSS Override by ID          (Từ actionCssId) ← CAO NHẤT

✅ VÍ DỤ: Styling đa cấp
────────────────────────
{
  startFrame: 0,
  endFrame: 120,
  text: "Styled text",
  styleCss: {                // Item-level CSS
    fontSize: "48px",
    color: "white"
  },
  ClassMark: "textBox",      // Đánh dấu để override sau
  action: {
    cmd: "typingText",
    styleCss: {              // Action-level CSS (ghi đè item)
      fontSize: "64px",      // ✅ Override
      fontWeight: "bold"     // ✅ Thêm mới
    }
  }
}

// CSS Override sau đó
{
  startFrame: 60,
  endFrame: 60,
  action: {
    cmd: "actionCssClass",
    toClass: "textBox",
    css: {
      color: "#FF0050",      // ✅ Override màu
      fontSize: "80px"       // ✅ Override size lần nữa
    }
  }
}

═══════════════════════════════════════════════════════════════════
6. TIMELINE VÀ FRAME CONTROL
═══════════════════════════════════════════════════════════════════

MỖI ACTION CÓ CÁC FRAME CONTROLS:
──────────────────────────────────
- ToEndFrame: boolean          // Kéo dài đến cuối video
- ChangeStartFrame: number     // Offset từ item.startFrame
- ChangeEndFrame: number       // Offset từ item.endFrame

✅ VÍ DỤ 1: Action kéo dài đến hết video
────────────────────────────────────────
{
  startFrame: 60,
  endFrame: 120,              // Item kết thúc frame 120
  action: {
    cmd: "static",
    ToEndFrame: true,         // ✅ Nhưng action chạy đến hết
    text: "Always visible"
  }
}

✅ VÍ DỤ 2: Delay action start
──────────────────────────────
{
  startFrame: 0,
  endFrame: 90,
  action: {
    cmd: "fadeIn",
    ChangeStartFrame: 30,     // ✅ Bắt đầu sau item 30 frames (frame 30)
    text: "Delayed start"
  }
}

✅ VÍ DỤ 3: Kết thúc sớm
────────────────────────
{
  startFrame: 0,
  endFrame: 120,
  action: {
    cmd: "typingText",
    ChangeEndFrame: -30,      // ✅ Kết thúc sớm 30 frames (frame 90)
    text: "Early end"
  }
}

═══════════════════════════════════════════════════════════════════
7. THÊM ACTION MỚI
═══════════════════════════════════════════════════════════════════

BƯỚC 1: Tạo Action Component
─────────────────────────────
// src/Components/ActionOrchestrator/actions/MyNewAction.jsx

import React from "react";
import { mergeStyles } from "../utils/cssOverrideManager";

function MyNewAction({ data }) {
  const {
    action,
    item,
    frame,
    actionStartFrame,
    actionEndFrame,
    cssOverrides,
    defaultTextStyle,
    className,
    id,
  } = data;

  // ✅ Implement logic của bạn ở đây
  
  return (
    <div
      className={className}
      id={id}
      style={mergeStyles(action, item, defaultTextStyle, className, id, cssOverrides)}
    >
      {action.text || item.text}
    </div>
  );
}

export default MyNewAction;

BƯỚC 2: Đăng ký trong actionRegistry.js
────────────────────────────────────────
import MyNewAction from "../actions/MyNewAction";

export const ACTION_REGISTRY = {
  // ... existing actions
  myNewCmd: MyNewAction,  // ✅ Thêm vào đây
};

BƯỚC 3: Sử dụng
───────────────
{
  startFrame: 0,
  endFrame: 90,
  action: {
    cmd: "myNewCmd",      // ✅ Sử dụng ngay
    text: "New action!",
    // ... custom keys của bạn
  }
}

═══════════════════════════════════════════════════════════════════
8. TROUBLESHOOTING
═══════════════════════════════════════════════════════════════════

❌ LỖI: "Unknown action cmd"
─────────────────────────────
→ Check actionRegistry.js đã import và đăng ký chưa
→ Kiểm tra typo trong action.cmd

❌ LỖI: CSS không apply
────────────────────────
→ Check thứ tự ưu tiên CSS (ID > Class > action.css)
→ Kiểm tra ClassMark/IDMark đã đúng chưa
→ Log cssOverrides để debug

❌ LỖI: Action không hiển thị
──────────────────────────────
→ Check frame range (startFrame < endFrame)
→ Kiểm tra ToEndFrame/ChangeStartFrame logic
→ Console.log activeActions để debug

❌ LỖI: Render nhiều actions cùng lúc
──────────────────────────────────────
→ Đây là tính năng, không phải bug!
→ Dùng zIndex để control layer order
→ Dùng CSS overrides để ẩn/hiện elements

═══════════════════════════════════════════════════════════════════

📞 HỖ TRỢ:
- Check console logs để debug
- Xem ví dụ trong các action files
- Test với simple cases trước

═══════════════════════════════════════════════════════════════════