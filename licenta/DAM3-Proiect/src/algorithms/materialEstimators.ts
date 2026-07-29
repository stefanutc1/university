// Construction & Material Estimators

export interface ConcreteResult {
  volumeM3: number;
  cementBags25kg: number;
  cementBags40kg: number;
  sandM3: number;
  gravelM3: number;
  waterLiters: number;
}

export function estimateConcrete(lengthM: number, widthM: number, depthM: number): ConcreteResult {
  const volumeM3 = Math.round(lengthM * widthM * depthM * 100) / 100;
  const cementKg = volumeM3 * 350; // standard 350 kg/m3
  const cementBags25kg = Math.ceil(cementKg / 25);
  const cementBags40kg = Math.ceil(cementKg / 40);
  const sandM3 = Math.round(volumeM3 * 0.45 * 100) / 100;
  const gravelM3 = Math.round(volumeM3 * 0.8 * 100) / 100;
  const waterLiters = Math.round(volumeM3 * 175);

  return { volumeM3, cementBags25kg, cementBags40kg, sandM3, gravelM3, waterLiters };
}

export interface PaintResult {
  wallAreaM2: number;
  effectiveAreaM2: number;
  litersRequired: number;
  buckets5L: number;
  buckets10L: number;
}

export function estimatePaint(
  roomLengthM: number,
  roomWidthM: number,
  roomHeightM: number,
  coats = 2,
  coveragePerLiter = 10,
  openingsAreaM2 = 4
): PaintResult {
  const perimeter = 2 * (roomLengthM + roomWidthM);
  const grossWallArea = perimeter * roomHeightM;
  const wallAreaM2 = Math.max(0, Math.round((grossWallArea - openingsAreaM2) * 100) / 100);
  const effectiveAreaM2 = Math.round(wallAreaM2 * coats * 100) / 100;
  const litersRequired = Math.round((effectiveAreaM2 / coveragePerLiter) * 10) / 10;
  const buckets5L = Math.ceil(litersRequired / 5);
  const buckets10L = Math.ceil(litersRequired / 10);

  return { wallAreaM2, effectiveAreaM2, litersRequired, buckets5L, buckets10L };
}

export interface TileResult {
  floorAreaM2: number;
  tileAreaM2: number;
  rawTilesCount: number;
  totalTilesWithWaste: number;
  totalCoverageM2: number;
  boxesRequired: number; // based on 1.44 m2 per box typical
}

export function estimateTiles(
  floorAreaM2: number,
  tileWidthCm: number,
  tileHeightCm: number,
  wasteMarginPercent = 10,
  sqmPerBox = 1.44
): TileResult {
  const tileAreaM2 = (tileWidthCm / 100) * (tileHeightCm / 100);
  const rawTilesCount = Math.ceil(floorAreaM2 / tileAreaM2);
  const totalTilesWithWaste = Math.ceil(rawTilesCount * (1 + wasteMarginPercent / 100));
  const totalCoverageM2 = Math.round(totalTilesWithWaste * tileAreaM2 * 100) / 100;
  const boxesRequired = Math.ceil(totalCoverageM2 / sqmPerBox);

  return {
    floorAreaM2,
    tileAreaM2: Math.round(tileAreaM2 * 10000) / 10000,
    rawTilesCount,
    totalTilesWithWaste,
    totalCoverageM2,
    boxesRequired,
  };
}

// Sand and gravel proportions calculated

// Paint wall area and bucket estimation

// Window and door area deductions verified

// Tile flooring waste margin (10-15%)

// Box requirements calculated
