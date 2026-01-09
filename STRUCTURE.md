src/
│
├── 📄 R_A001V.jsx                          [50 lines]
│   └── Main video template component
│       - Sử dụng SequentialMediaRenderer
│       - Render background music/video
│       - Define video layout và styling
│
├── 📄 index.js                              [100 lines]
│   └── Central exports cho tất cả modules
│       - Export utilities
│       - Export hooks
│       - Export components
│       - Type definitions (JSDoc)
│
├── 📁 utils/                                [4 files]
│   │
│   ├── 📄 pathResolver.js                   [50 lines]
│   │   └── Resolve đường dẫn cho media files
│   │       - getAudioPath(item)
│   │       - getImagePath(item)
│   │       - getVideoPath(videoSource)
│   │
│   ├── 📄 frameCalculator.js                [80 lines]
│   │   └── Tính toán frame timing
│   │       - calculateFrameRanges(items, durations, fps)
│   │       - getTotalDuration(frames)
│   │       - getFrameAtTime(frames, currentFrame)
│   │
│   ├── 📄 imageFrameMerger.js               [70 lines]
│   │   └── Merge ảnh trùng liên tiếp
│   │       - mergeConsecutiveImages(frames, fps)
│   │       - isFrameInImageRange(imageGroup, currentFrame)
│   │
│   └── 📄 getColorFromID.js                 [30 lines]
│       └── Generate background color từ ID
│           - getBackgroundForId(id)
│
├── 📁 hooks/                                [2 files]
│   │
│   ├── 📄 useAudioDurations.js              [40 lines]
│   │   └── Custom hook quản lý audio durations
│   │       - State: durations, loadingCount
│   │       - Methods: handleDurationLoad, reset
│   │       - Computed: isAllLoaded
│   │
│   └── 📄 useImagePreloader.js              [40 lines]
│       └── Custom hook quản lý image preloading
│           - State: imagesLoaded, imageLoadCount
│           - Methods: handleImageLoad, reset
│           - Computed: isAllLoaded
│
├── 📁 components/
│   │
│   ├── 📁 core/                             [3 files]
│   │   │
│   │   ├── 📄 SequentialMediaRenderer.jsx  [180 lines]
│   │   │   └── Component chính orchestrate toàn bộ
│   │   │       - Load resources (audio + images)
│   │   │       - Calculate frame ranges
│   │   │       - Merge consecutive images
│   │   │       - Render audio và images theo sequence
│   │   │       - Props: items, volume, scaleImg, cssDiv, cssImg, animationType
│   │   │
│   │   ├── 📄 AudioDurationLoader.jsx       [50 lines]
│   │   │   └── Load audio duration metadata
│   │   │       - Không render UI
│   │   │       - Callback khi load xong
│   │   │       - Error handling
│   │   │
│   │   └── 📄 ImagePreloader.jsx            [45 lines]
│   │       └── Preload images
│   │           - Không render UI
│   │           - Callback khi load xong
│   │           - Handle cached images
│   │
│   ├── 📁 media/                            [4 files]
│   │   │
│   │   ├── 📄 ImageWithAnimation.jsx        [200 lines]
│   │   │   └── Hiển thị ảnh với animation
│   │   │       - 8+ animation types
│   │   │       - Fade in/out
│   │   │       - Spring animations
│   │   │       - Custom CSS support
│   │   │       - Error handling
│   │   │
│   │   ├── 📄 SoundPlayer.jsx               [50 lines]
│   │   │   └── Phát audio segment
│   │   │       - Auto-resolve audio path
│   │   │       - Volume control
│   │   │       - Sound on/off toggle
│   │   │
│   │   ├── 📄 VideoPlayer.jsx               [80 lines]
│   │   │   └── Phát video với effects
│   │   │       - Zoom animation
│   │   │       - Loop support
│   │   │       - Volume control
│   │   │       - Z-index layering
│   │   │
│   │   └── 📄 BackgroundSoundPlayer.jsx     [30 lines]
│   │       └── Phát nhạc nền
│   │           - Loop by default
│   │           - Lower volume
│   │           - Simple interface
│   │
│   └── 📁 text/                             [1 file]
│       │
│       └── 📄 TypingText.jsx                [180 lines]
│           └── Text với typing effect
│               - Multiple text types
│               - Typing animation
│               - Sound effects
│               - IPA character highlighting
│               - Custom styling per type
│
├── 📄 ExampleUsage.jsx                      [300 lines]
│   └── Comprehensive examples
│       - Basic usage examples
│       - Custom compositions
│       - Different animation configs
│       - Multiple media combinations
│       - Using hooks directly
│
├── 📄 README.md                             [400 lines]
│   └── Main documentation
│       - Overview
│       - Installation
│       - Usage guide
│       - Component API
│       - Examples
│       - Troubleshooting
│
├── 📄 MIGRATION_GUIDE.md                    [600 lines]
│   └── Upgrade guide from v1 to v2
│       - Comparison
│       - Step-by-step migration
│       - Breaking changes
│       - Common issues
│       - Testing checklist
│
├── 📄 ARCHITECTURE.md                       [700 lines]
│   └── System design documentation
│       - Architecture overview
│       - Data flow diagrams
│       - Component lifecycle
│       - Animation system
│       - Performance optimizations
│       - Best practices
│
├── 📄 CHANGELOG.md                          [300 lines]
│   └── Version history
│       - All versions
│       - Breaking changes
│       - Migration paths
│       - Future plans
│
└── 📄 STRUCTURE.md                          [This file]
    └── File structure overview
        - Complete tree
        - File descriptions
        - Line counts
        - Relationships