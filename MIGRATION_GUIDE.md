# Migration Guide - Từ Code Cũ sang Cấu Trúc Mới

Hướng dẫn chi tiết để chuyển đổi từ code cũ (monolithic) sang cấu trúc module mới.

## 📊 So sánh cấu trúc

### ❌ Code cũ (Monolithic)
```
src/
├── R_A001V.jsx (1 file lớn ~500 dòng)
├── ulti/
│   └── getColorFromID.js
└── smallComponent/
    ├── soundPlay.js
    ├── backgroundSoundPlay.js
    ├── videoPlay.js
    └── showText.js
```

### ✅ Code mới (Modular)
```
src/
├── R_A001V.jsx (file chính, gọn gàng ~50 dòng)
├── index.js (central exports)
├── utils/ (4 files)
│   ├── frameCalculator.js
│   ├── pathResolver.js
│   ├── imageFrameMerger.js
│   └── getColorFromID.js
├── hooks/ (2 files)
│   ├── useAudioDurations.js
│   └── useImagePreloader.js
└── components/
    ├── core/ (3 files)
    ├── media/ (4 files)
    └── text/ (1 file)
```

## 🔄 Migration Steps

### Step 1: Backup code cũ
```bash
# Backup toàn bộ src folder
cp -r src src_backup
```

### Step 2: Tạo cấu trúc thư mục mới
```bash
cd src
mkdir -p utils hooks components/{core,media,text}
```

### Step 3: Di chuyển và refactor components

#### 3.1. SoundPlay → SoundPlayer
**Trước:**
```jsx
// smallComponent/soundPlay.js
function SoundPlay({ startFrame, endFrame, sound, soundSource, volume }) {
  const getAudioPath = () => {
    // Logic nội bộ
  };
  // ...
}
```

**Sau:**
```jsx
// components/media/SoundPlayer.jsx
import { getAudioPath } from "../../utils/pathResolver";

function SoundPlayer({ startFrame, endFrame, sound, soundSource, volume }) {
  const audioPath = getAudioPath({ code: soundSource });
  // ...
}
```

#### 3.2. Component trong R_A001V.jsx → Tách ra

**Trước (trong R_A001V.jsx):**
```jsx
const ImageWithAnimation = ({ imgPath, startFrame, ... }) => {
  // 100+ dòng code
};

const AudioDurationLoaderV2 = ({ audioPath, ... }) => {
  // 30+ dòng code
};

const ImagePreloader = ({ imgPath, ... }) => {
  // 20+ dòng code
};

const SequentialSounds = ({ items, ... }) => {
  // 200+ dòng code
};
```

**Sau (tách thành files riêng):**
```jsx
// components/media/ImageWithAnimation.jsx
export default ImageWithAnimation;

// components/core/AudioDurationLoader.jsx
export default AudioDurationLoader;

// components/core/ImagePreloader.jsx
export default ImagePreloader;

// components/core/SequentialMediaRenderer.jsx
export default SequentialMediaRenderer;
```

### Step 4: Refactor R_A001V.jsx

**Trước (~500 dòng):**
```jsx
import React, { useState, useEffect } from "react";
import { ... } from "remotion";

// Nhiều components lồng nhau
const ImageWithAnimation = () => { ... };
const AudioDurationLoaderV2 = () => { ... };
const ImagePreloader = () => { ... };
const SequentialSounds = () => { ... };

export const VideoTemplate = ({ item, duration }) => {
  // Logic phức tạp
  return (
    <div>
      <SequentialSounds items={item.data} ... />
      {/* More components */}
    </div>
  );
};
```

**Sau (~50 dòng):**
```jsx
import React from "react";
import { useCurrentFrame, useVideoConfig, Sequence } from "remotion";
import { getBackgroundForId } from "./utils/getColorFromID";
import BackgroundSoundPlayer from "./components/media/BackgroundSoundPlayer";
import VideoPlayer from "./components/media/VideoPlayer";
import SequentialMediaRenderer from "./components/core/SequentialMediaRenderer";

export const VideoTemplate = ({ item, duration }) => {
  return (
    <div style={{ ... }}>
      <BackgroundSoundPlayer ... />
      <SequentialMediaRenderer items={item.data} ... />
      <Sequence from={0}>
        <VideoPlayer ... />
      </Sequence>
    </div>
  );
};
```

### Step 5: Update imports trong toàn bộ project

**Trước:**
```jsx
import SoundPlay from "./smallComponent/soundPlay";
import BackgroundSoundPlay from "./smallComponent/backgroundSoundPlay";
import VideoPlay from "./smallComponent/videoPlay";
import TypingText from "./smallComponent/showText";
```

**Sau (option 1 - import trực tiếp):**
```jsx
import SoundPlayer from "./components/media/SoundPlayer";
import BackgroundSoundPlayer from "./components/media/BackgroundSoundPlayer";
import VideoPlayer from "./components/media/VideoPlayer";
import TypingText from "./components/text/TypingText";
```

**Sau (option 2 - import từ index):**
```jsx
import {
  SoundPlayer,
  BackgroundSoundPlayer,
  VideoPlayer,
  TypingText
} from "./index";
```

### Step 6: Testing

#### Test 1: Render basic video
```jsx
import { VideoTemplate } from "./R_A001V";

const testData = {
  id: 1,
  data: [
    {
      code: "TEST_001",
      img: "test.jpg",
      timePlus: 2,
    }
  ]
};

<VideoTemplate item={testData} duration={300} />
```

#### Test 2: Kiểm tra console logs
```
✓ Audio duration loaded: audio/TEST/TEST_001.mp3 = 180 frames
✓ Image loaded: assets/test/test.jpg
✅ All resources loaded!
📸 Merged image frames:
  0: assets/test/test.jpg | Frames 0-180 (180f = 6.0s) | 1 audio segments
```

#### Test 3: Kiểm tra animations
```jsx
// Test từng loại animation
const animations = [
  "kenBurns", "zoomIn", "zoomOut", 
  "slideIn", "parallax", "rotate", 
  "slideUp", "fade", "all"
];

animations.forEach(anim => {
  render(<SequentialMediaRenderer animationType={anim} />);
});
```

## 🎯 Breaking Changes

### 1. Component names đã đổi

| Tên cũ | Tên mới |
|--------|---------|
| `SoundPlay` | `SoundPlayer` |
| `BackgroundSoundPlay` | `BackgroundSoundPlayer` |
| `VideoPlay` | `VideoPlayer` |
| `TypingText` | `TypingText` (không đổi) |
| `SequentialSounds` | `SequentialMediaRenderer` |

### 2. Props đã đổi

**SequentialSounds → SequentialMediaRenderer:**
- ✅ Giữ nguyên: `items`, `volume`, `scaleImg`, `cssDiv`, `cssImg`, `animationType`
- ❌ Không còn: Internal state management (được chuyển vào hooks)

### 3. Internal functions → Utilities

Functions đã được extract ra:

```jsx
// ❌ Trước: Functions nội bộ trong component
const getAudioPath = (e) => { ... }
const getImagePath = (e) => { ... }

// ✅ Sau: Import từ utilities
import { getAudioPath, getImagePath } from "./utils/pathResolver";
```

### 4. State management → Custom Hooks

```jsx
// ❌ Trước: useState trực tiếp
const [durations, setDurations] = useState({});
const [loadingCount, setLoadingCount] = useState(0);

// ✅ Sau: Sử dụng custom hook
const { durations, loadingCount, handleDurationLoad } = useAudioDurations(totalCount);
```

## 📝 Checklist Migration

- [ ] Backup code cũ
- [ ] Tạo cấu trúc thư mục mới
- [ ] Copy và refactor utilities
- [ ] Tạo custom hooks
- [ ] Tách components ra files riêng
- [ ] Refactor R_A001V.jsx
- [ ] Update tất cả imports
- [ ] Test rendering
- [ ] Test animations
- [ ] Test audio/video playback
- [ ] Kiểm tra console logs
- [ ] Verify performance (không chậm hơn)
- [ ] Update documentation

## 🚀 Advantages của cấu trúc mới

### 1. **Dễ maintain**
- Mỗi file có trách nhiệm rõ ràng
- Dễ tìm và sửa bugs
- Code ngắn gọn hơn (~50-100 dòng/file)

### 2. **Dễ test**
- Test từng utility function riêng
- Test từng component độc lập
- Mock dependencies dễ dàng

### 3. **Dễ mở rộng**
- Thêm animation mới: chỉ sửa ImageWithAnimation.jsx
- Thêm media type mới: tạo component mới trong media/
- Thêm utility mới: tạo file mới trong utils/

### 4. **Reusable**
- Components có thể dùng ở nhiều nơi
- Utilities có thể dùng cho nhiều projects
- Hooks có thể share giữa các components

### 5. **Better performance**
- Code splitting tốt hơn
- Tree shaking hiệu quả hơn
- Import chỉ những gì cần dùng

## 🔧 Common Issues & Solutions

### Issue 1: Import errors
**Problem:** `Cannot find module './utils/pathResolver'`

**Solution:**
```bash
# Kiểm tra file có tồn tại
ls -la src/utils/pathResolver.js

# Kiểm tra đường dẫn tương đối
# Nếu import từ components/core/, dùng: "../../utils/pathResolver"
```

### Issue 2: Component không render
**Problem:** Component render nhưng không hiển thị gì

**Solution:**
```jsx
// Kiểm tra console logs
console.log("Frame ranges:", frameRanges);
console.log("Current frame:", currentFrame);

// Verify paths
console.log("Audio path:", getAudioPath(item));
console.log("Image path:", getImagePath(item));
```

### Issue 3: Animation không hoạt động
**Problem:** Images không có animation

**Solution:**
```jsx
// Kiểm tra animationType prop
<SequentialMediaRenderer animationType="kenBurns" /> // ✅ Correct
<SequentialMediaRenderer animationType="invalid" />  // ❌ Wrong

// Verify trong ImageWithAnimation
console.log("Animation type:", animationType);
console.log("Progress:", progress);
```

## 📚 Additional Resources

- [README.md](./README.md) - Hướng dẫn sử dụng chi tiết
- [ExampleUsage.jsx](./ExampleUsage.jsx) - Các ví dụ sử dụng
- [Remotion Docs](https://www.remotion.dev/docs) - Tài liệu Remotion

## 💡 Tips

1. **Migrate từng bước nhỏ**: Đừng migrate tất cả cùng lúc
2. **Test sau mỗi bước**: Đảm bảo mọi thứ hoạt động trước khi tiếp tục
3. **Giữ code cũ**: Backup để tham khảo khi cần
4. **Sử dụng TypeScript**: Nếu muốn, thêm `.d.ts` files cho type safety
5. **Document changes**: Ghi chú lại những thay đổi đã làm

## 🎉 Kết luận

Sau khi migrate, bạn sẽ có:
- ✅ Code gọn gàng, dễ đọc hơn
- ✅ Cấu trúc rõ ràng, dễ maintain
- ✅ Components reusable
- ✅ Performance tốt hơn
- ✅ Dễ mở rộng trong tương lai

Chúc bạn migrate thành công! 🚀