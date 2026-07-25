# Privacy & Zero-Metadata Policy

## 1. Zero External Telemetry
- The Mesh Messenger does not integrate analytics frameworks (Firebase, Google Analytics, Sentry, Mixpanel).
- No network requests are made to the public Internet at any point during application execution.

## 2. No Identity Anchors
- The user is not prompted for phone numbers, email addresses, names, or device serial numbers.
- Device identity is represented solely by the raw cryptographic public key generated on first launch.

## 3. Location Protection
- GPS coordinates are queried ONLY when the user activates Emergency SOS mode.
- Non-emergency text messages never attach location telemetry.
