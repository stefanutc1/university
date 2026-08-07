export function calculateHeading(x: number, y: number) { let heading = Math.atan2(y, x) * (180 / Math.PI); return (heading + 360) % 360; }

// Azimuth 0-360 degrees

// Cardinal directions mapper
