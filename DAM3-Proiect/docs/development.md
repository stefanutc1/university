# Development & Setup Instructions — React Native

## 1. Prerequisites

- **Node.js**: >= 18.0.0
- **Package Manager**: npm or yarn
- **Python**: 3.9+ (for simulation test suite)
- **Mobile Environment**:
  - Android Studio with Android SDK 34 and JDK 17
  - Xcode 15+ (macOS for iOS target)
  - Physical devices recommended for BLE / Wi-Fi direct radio validation

---

## 2. Quickstart

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run automated unit tests:
   ```bash
   npm test
   ```

3. Run deterministic multi-hop mesh simulation:
   ```bash
   npm run simulate
   ```

4. Launch React Native Metro bundler:
   ```bash
   npm start
   ```

5. Run on Android / iOS:
   ```bash
   npm run android
   # or
   npm run ios
   ```
