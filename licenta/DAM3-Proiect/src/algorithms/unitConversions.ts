// Unit Conversions Engine (Length, Weight, Volume, Temperature)

export type UnitCategory = 'length' | 'weight' | 'volume' | 'temperature';

export interface ConversionFactor {
  name: string;
  symbol: string;
  ratioToBase: number; // Multiply by this to get base unit
}

export const CONVERSION_CATEGORIES: Record<UnitCategory, { baseUnit: string; units: Record<string, ConversionFactor> }> = {
  length: {
    baseUnit: 'm',
    units: {
      m: { name: 'Metri', symbol: 'm', ratioToBase: 1 },
      km: { name: 'Kilometri', symbol: 'km', ratioToBase: 1000 },
      cm: { name: 'Centimetri', symbol: 'cm', ratioToBase: 0.01 },
      mm: { name: 'Milimetri', symbol: 'mm', ratioToBase: 0.001 },
      in: { name: 'Inci (Inch)', symbol: 'in', ratioToBase: 0.0254 },
      ft: { name: 'Picioare (Feet)', symbol: 'ft', ratioToBase: 0.3048 },
      yd: { name: 'Iarzi (Yards)', symbol: 'yd', ratioToBase: 0.9144 },
      mi: { name: 'Mile', symbol: 'mi', ratioToBase: 1609.344 },
      nmi: { name: 'Mile Nautice', symbol: 'nmi', ratioToBase: 1852 },
    },
  },
  weight: {
    baseUnit: 'kg',
    units: {
      kg: { name: 'Kilograme', symbol: 'kg', ratioToBase: 1 },
      g: { name: 'Grame', symbol: 'g', ratioToBase: 0.001 },
      mg: { name: 'Miligrame', symbol: 'mg', ratioToBase: 0.000001 },
      lb: { name: 'Livre (Pounds)', symbol: 'lb', ratioToBase: 0.45359237 },
      oz: { name: 'Uncii (Ounces)', symbol: 'oz', ratioToBase: 0.028349523125 },
      t: { name: 'Tone Metrice', symbol: 't', ratioToBase: 1000 },
      st: { name: 'Stone (UK)', symbol: 'st', ratioToBase: 6.35029318 },
    },
  },
  volume: {
    baseUnit: 'L',
    units: {
      L: { name: 'Litri', symbol: 'L', ratioToBase: 1 },
      mL: { name: 'Mililitri', symbol: 'mL', ratioToBase: 0.001 },
      m3: { name: 'Metri Cubi', symbol: 'm³', ratioToBase: 1000 },
      gal: { name: 'Galoane (US)', symbol: 'gal', ratioToBase: 3.785411784 },
      fl_oz: { name: 'Uncii Fluide (US)', symbol: 'fl oz', ratioToBase: 0.0295735295625 },
      cup: { name: 'Cesti (Cups US)', symbol: 'cup', ratioToBase: 0.24 },
    },
  },
  temperature: {
    baseUnit: 'C',
    units: {
      C: { name: 'Celsius', symbol: '°C', ratioToBase: 1 },
      F: { name: 'Fahrenheit', symbol: '°F', ratioToBase: 1 },
      K: { name: 'Kelvin', symbol: 'K', ratioToBase: 1 },
    },
  },
};

export function convertUnit(
  val: number,
  fromUnit: string,
  toUnit: string,
  category: UnitCategory
): { result: number; formula: string } {
  if (isNaN(val)) return { result: 0, formula: 'Valoare invalida' };
  if (fromUnit === toUnit) return { result: val, formula: `${val} ${fromUnit} = ${val} ${toUnit}` };

  if (category === 'temperature') {
    let tempInC = val;
    if (fromUnit === 'F') tempInC = (val - 32) * (5 / 9);
    else if (fromUnit === 'K') tempInC = val - 273.15;

    let targetVal = tempInC;
    if (toUnit === 'F') targetVal = tempInC * (9 / 5) + 32;
    else if (toUnit === 'K') targetVal = tempInC + 273.15;

    const rounded = Math.round(targetVal * 10000) / 10000;
    return {
      result: rounded,
      formula: `${val}°${fromUnit} -> ${rounded}°${toUnit}`,
    };
  }

  const catData = CONVERSION_CATEGORIES[category];
  const fromFactor = catData.units[fromUnit];
  const toFactor = catData.units[toUnit];

  if (!fromFactor || !toFactor) {
    throw new Error(`Unitate necunoscuta: ${fromUnit} sau ${toUnit}`);
  }

  // Convert to base unit then to target
  const valueInBase = val * fromFactor.ratioToBase;
  const finalValue = valueInBase / toFactor.ratioToBase;
  const rounded = Math.round(finalValue * 1000000) / 1000000;

  return {
    result: rounded,
    formula: `${val} ${fromFactor.symbol} * (${fromFactor.ratioToBase} / ${toFactor.ratioToBase}) = ${rounded} ${toFactor.symbol}`,
  };
}

// Weight & mass conversion factors verified

// Volume units verified

// Temperature Celsius/Fahrenheit/Kelvin equations

// Mathematical step-by-step formula generation
