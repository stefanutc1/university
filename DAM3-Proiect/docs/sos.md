# Emergency SOS Mode Specification

## 1. Design & Activation

The SOS mode is designed for critical situations where standard cellular coverage or internet is absent (e.g. natural disasters, remote expeditions, search and rescue).

- **Deliberate Activation**: Prevent accidental triggering via a dedicated UI confirmation workflow.
- **Location Integration**: Queries onboard GPS via CoreLocation (iOS) and FusedLocationProviderClient (Android).

---

## 2. Beacon Propagation

1. **Broadcast Envelope**: Constructed with `isBroadcast = true` and `HopLimit = 12`.
2. **Relay Strategy**: All receiving nodes within radio range register the alert and re-broadcast it to their respective neighbors, regardless of whether they have an established conversation with the sender.
3. **Location Privacy**: SOS packets only broadcast coordinates if the user explicitly arms the distress signal with location permissions granted. Coordinates can be targeted to rescue teams using ephemeral public keys or broadcasted in standard rescue JSON format.
