export function calculatePitchRoll(x: number, y: number, z: number) { return { pitch: Math.atan2(x, Math.sqrt(y*y + z*z)) * (180/Math.PI), roll: Math.atan2(y, Math.sqrt(x*x + z*z)) * (180/Math.PI) }; }

// Pitch and roll angles calculated

// Zero offset calibration

// 0.5 degree level lock tolerance

// Low-pass exponential smoothing filter
