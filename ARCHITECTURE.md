# Architecture Documentation

Tài liệu kiến trúc chi tiết về cách hệ thống hoạt động.

## 🏗️ Tổng quan kiến trúc

```
┌─────────────────────────────────────────────────────────────┐
│                      R_A001V.jsx                            │
│                   (Main Template)                           │
│  - Render layout                                            │
│  - Gọi SequentialMediaRenderer                              │
│  - Quản lý background music/video                           │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│            SequentialMediaRenderer                          │
│               (Core Component)                              │
│  - Orchestrates toàn bộ quá trình                          │
│  - Sử dụng hooks để manage state                           │
│  - Tính toán frame timing                                  │
│  - Merge images trùng                                      │
│  - Render audio + images                                   │
└────┬────────────┬────────────┬──────────────┬──────────────┘
     │            │            │              │
     ▼            ▼            ▼              ▼
 ┌────────┐  ┌────────┐  ┌─────────┐  ┌──────────────┐
 │ Hooks  │  │ Utils  │  │ Loaders │  │  Renderers   │
 └────────┘  └────────┘  └─────────┘  └──────────────┘
```

## 📊 Data Flow

### Phase 1: Initialization & Loading

```
User Data (videoData)
    │
    ▼
SequentialMediaRenderer
    │
    ├─> useAudioDurations hook
    │   └─> AudioDurationLoader components
    │       └─> Load audio metadata
    │           └─> Callback: handleDurationLoad(index, duration)
    │
    └─> useImagePreloader hook
        └─> ImagePreloader components
            └─> Preload images
                └─> Callback: handleImageLoad(index)
```

### Phase 2: Frame Calculation

```
Durations loaded + Images loaded
    │
    ▼
calculateFrameRanges(items, durations, fps)
    │
    ├─> Lặp qua từng item
    │   ├─> Tính duration:
    │   │   - Nếu có item.duration: duration * fps
    │   │   - Nếu có item.timePlus: audioDuration + (timePlus * fps)
    │   │   - Mặc định: audioDuration
    │   │
    │   └─> Tạo frame object:
    │       {
    │         startFrame: accumulatedFrames,
    │         endFrame: accumulatedFrames + duration,
    │         duration: duration,
    │         index: i,
    │         item: item,
    │         audioPath: getAudioPath(item),
    │         imgPath: getImagePath(item),
    │         soundSource: item.code
    │       }
    │
    └─> Return array of frame objects
```

### Phase 3: Image Merging

```
Frame objects with imgPath
    │
    ▼
mergeConsecutiveImages(frames, fps)
    │
    ├─> Lặp qua frames
    │   │
    │   ├─> Nếu imgPath khác với group hiện tại:
    │   │   └─> Tạo group mới
    │   │
    │   └─> Nếu imgPath giống group hiện tại:
    │       └─> Extend endFrame của group
    │
    └─> Return merged image groups
        [
          {
            imgPath: "path/to/image.jpg",
            startFrame: 0,
            endFrame: 180,
            firstIndex: 0,
            audioSegments: [
              { soundSource: "AUDIO_001", startFrame: 0, endFrame: 90 },
              { soundSource: "AUDIO_002", startFrame: 90, endFrame: 180 }
            ]
          }
        ]
```

### Phase 4: Rendering

```
Current Frame = X
    │
    ├─> Render Audio
    │   └─> Lặp qua audioFrames
    │       └─> Nếu X trong [startFrame, endFrame):
    │           └─> Render <SoundPlayer />
    │
    └─> Render Images
        └─> Lặp qua mergedImageFrames
            └─> Nếu X trong [startFrame, endFrame):
                └─> Render <ImageWithAnimation />
                    └─> Calculate animation progress
                        └─> Apply animation style
```

## 🔄 Component Lifecycle

### SequentialMediaRenderer Lifecycle

```
1. Mount
   └─> Initialize state
       - isLoading = true
       - audioFrames = []
       - mergedImageFrames = []
       - delayRender()

2. Render (Loading Phase)
   └─> Render loaders
       - AudioDurationLoader for each item
       - ImagePreloader for each item

3. Loading Complete
   └─> useEffect triggered when:
       - audioDurationsLoaded = true
       - imagesLoaded = true
   └─> Calculate frames
       - calculateFrameRanges()
       - mergeConsecutiveImages()
   └─> Update state
       - audioFrames = calculated frames
       - mergedImageFrames = merged groups
       - isLoading = false
       - continueRender()

4. Render (Playback Phase)
   └─> Render media
       - SoundPlayer for each audio segment
       - ImageWithAnimation for visible images
```

## 🎨 Animation System

### Animation Flow

```
ImageWithAnimation Component
    │
    ├─> Calculate timing
    │   - relativeFrame = currentFrame - startFrame
    │   - totalDuration = endFrame - startFrame
    │   - progress = relativeFrame / totalDuration (0 to 1)
    │
    ├─> Calculate spring animation
    │   - springProgress = spring({frame, fps, config})
    │
    ├─> Calculate opacity (fade in/out)
    │   - fadeInDuration = 15 frames
    │   - fadeOutDuration = 15 frames
    │   - opacity = interpolate(...)
    │
    └─> Get animation style
        - Based on animationType
        - Return transform CSS
        - Apply to image element
```

### Animation Types Details

#### 1. Ken Burns
```javascript
kenBurnsScale = interpolate(progress, [0, 1], [1, 1.2])
translateX = interpolate(progress, [0, 1], [0, -30])
translateY = interpolate(progress, [0, 1], [0, -20])
transform = `scale(${kenBurnsScale}) translate(${translateX}px, ${translateY}px)`
```

#### 2. Zoom In
```javascript
zoomInScale = interpolate(springProgress, [0, 1], [0.8, 1])
transform = `scale(${zoomInScale})`
```

#### 3. Parallax
```javascript
parallaxY = Math.sin(progress * Math.PI * 2) * 20
rotation = Math.sin(progress * Math.PI) * 3
transform = `translateY(${parallaxY}px) rotate(${rotation}deg)`
```

## 🔧 Utility Functions

### pathResolver.js

```javascript
getAudioPath(item)
    │
    ├─> Kiểm tra item.code có "_" không?
    │   │
    │   ├─> YES: Extract prefix
    │   │   └─> Return `audio/${prefix}/${code}.mp3`
    │   │
    │   └─> NO:
    │       └─> Return `audio/khac/${code}.mp3`
```

### frameCalculator.js

```javascript
calculateFrameRanges(items, durations, fps)
    │
    └─> For each item:
        │
        ├─> Get duration:
        │   - Priority 1: item.duration * fps
        │   - Priority 2: durations[i] + (item.timePlus * fps)
        │   - Priority 3: durations[i] or default (6 * fps)
        │
        ├─> Create frame object
        │
        └─> Accumulate frames
            accumulatedFrames += durationInFrames
```

## 🎣 Hooks System

### useAudioDurations

```javascript
State:
  - durations: { [index]: durationInFrames }
  - loadingCount: number

Methods:
  - handleDurationLoad(index, frames)
      └─> Update durations[index]
      └─> Increment loadingCount
  
  - reset()
      └─> Clear all state

Computed:
  - isAllLoaded = loadingCount >= totalCount
```

### useImagePreloader

```javascript
State:
  - imagesLoaded: { [index]: boolean }
  - imageLoadCount: number

Methods:
  - handleImageLoad(index)
      └─> Set imagesLoaded[index] = true
      └─> Increment imageLoadCount
  
  - reset()
      └─> Clear all state

Computed:
  - isAllLoaded = imageLoadCount >= totalCount
```

## 📦 Component Composition

### Example: Full Video Composition

```
VideoTemplate
├── Background Music
│   └── <BackgroundSoundPlayer />
│
├── Main Content
│   └── <SequentialMediaRenderer>
│       ├── Phase 1: Loading
│       │   ├── <AudioDurationLoader /> x N
│       │   └── <ImagePreloader /> x N
│       │
│       └── Phase 2: Rendering
│           ├── <SoundPlayer /> x N
│           └── <ImageWithAnimation /> x M
│
└── Background Video
    └── <Sequence>
        └── <VideoPlayer />
```

## 🎯 Performance Optimizations

### 1. Image Merging
```
Before merging:
  - 3 components for same image
  - 3 render cycles
  - 3 animation calculations

After merging:
  - 1 component for same image
  - 1 render cycle
  - 1 animation calculation
  
Performance gain: ~3x
```

### 2. Conditional Rendering
```javascript
// Only render when in visible range
const isInRange = currentFrame >= startFrame && currentFrame < endFrame;
if (!isInRange) return null;

// Benefit: Không render components không cần thiết
```

### 3. Preloading Strategy
```
Load all resources first
    ↓
Calculate frames once
    ↓
Render efficiently
    ↓
No runtime loading delays
```

## 🔐 Type Safety (với JSDoc)

```javascript
/**
 * @typedef {Object} DataItem
 * @property {string} text
 * @property {string} code
 * ...
 */

/**
 * @param {DataItem[]} items
 * @param {Object} durations
 * @param {number} fps
 * @returns {FrameRange[]}
 */
export const calculateFrameRanges = (items, durations, fps) => {
  // Implementation with type hints
};
```

## 🧪 Testing Strategy

### Unit Tests
```
utils/
  ├─ pathResolver.test.js
  │   └─ Test getAudioPath with various inputs
  ├─ frameCalculator.test.js
  │   └─ Test frame calculations
  └─ imageFrameMerger.test.js
      └─ Test merging logic
```

### Integration Tests
```
components/
  └─ SequentialMediaRenderer.test.jsx
      ├─ Test loading phase
      ├─ Test frame calculation
      ├─ Test rendering
      └─ Test with various data inputs
```

### E2E Tests
```
Full video rendering:
  1. Provide test data
  2. Render VideoTemplate
  3. Verify:
     - Audio plays at correct times
     - Images display correctly
     - Animations work
     - No console errors
```

## 📈 Scalability

### Adding New Features

#### 1. New Animation Type
```
1. Edit: components/media/ImageWithAnimation.jsx
2. Add new case in getImageAnimationStyle()
3. No other files need changes
```

#### 2. New Media Type (e.g., SVG)
```
1. Create: components/media/SVGPlayer.jsx
2. Add to: components/core/SequentialMediaRenderer.jsx
3. Update: utils/pathResolver.js (optional)
```

#### 3. New Utility Function
```
1. Create: utils/myNewUtil.js
2. Export in: src/index.js
3. Import where needed
```

## 🎓 Best Practices

### 1. Separation of Concerns
- Utils: Pure functions, no side effects
- Hooks: State management only
- Components: Rendering logic only

### 2. Single Responsibility
- Each file has one clear purpose
- Easy to understand and modify
- Reduces coupling

### 3. Composition over Inheritance
- Build complex components from simple ones
- Reuse through props and composition
- More flexible and maintainable

### 4. Explicit Dependencies
- Import exactly what you need
- Makes dependencies clear
- Easier to track and refactor

## 🔍 Debugging Tips

### 1. Console Logs Strategy
```javascript
// In SequentialMediaRenderer
console.log("========================================");
console.log("✅ All resources loaded!");
console.log(`   Audio files: ${loadingCount}/${validItemsCount}`);
console.log(`   Images: ${imageLoadCount}/${totalImagesCount}`);
console.log("========================================");

// In ImageFrameMerger
console.log("📸 Merged image frames:");
merged.forEach((group, i) => {
  console.log(`  ${i}: ${group.imgPath} | ...`);
});
```

### 2. React DevTools
- Inspect component hierarchy
- Check props and state
- Profile render performance

### 3. Remotion Player
- Use Remotion Studio for debugging
- Inspect frame by frame
- Check timing issues

## 📚 Further Reading

- [Remotion Best Practices](https://www.remotion.dev/docs/best-practices)
- [React Composition Patterns](https://reactjs.org/docs/composition-vs-inheritance.html)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)