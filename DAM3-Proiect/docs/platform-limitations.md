# Mobile Operating System Constraints & Limitations

## 1. Background Execution & Radio Throttle

### 1.1 iOS Background Limitations
- **CoreBluetooth Background Modes**: When an iOS app enters the background, CoreBluetooth scanning with `CBCentralManagerScanOptionAllowDuplicatesKey: true` is throttled by iOS power management.
- **Peripheral Advertising**: In the background, peripheral advertisement data is placed in a special "overflow area" and local device name is hidden. Connecting centrals must explicitly scan for the exact service UUID `0000FE60-0000-1000-8000-00805F9B34FB`.
- **MultipeerConnectivity**: Suspended shortly after backgrounding unless an active audio/location background capability is maintained.

### 1.2 Android Battery Optimization & Doze Mode
- **Doze Mode**: Android restricts network access and defers background jobs. The application uses a Foreground Service with type `connectedDevice` to sustain mesh relaying when operating as an active relay station.
- **BLE Scan Throttling**: Android limits BLE scans to at most 5 times within 30 seconds for background apps. Adaptive burst scanning is implemented to respect this limit.

## 2. Hardware Variations
- Different Android chipsets feature varying maximum BLE connections (typically 4 to 7 concurrent peripheral connections). The router adapts by round-robining transmissions across available neighbors.
