import { NextRequest, NextResponse } from 'next/server';
import { fetchWeatherData } from '@/lib/weather-api';
import { GeoLocation } from '@/lib/types';
import { DEFAULT_CITY } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get('lat') || '');
  const lon = parseFloat(searchParams.get('lon') || '');
  const name = searchParams.get('name') || DEFAULT_CITY.name;
  const country = searchParams.get('country') || DEFAULT_CITY.country;

  const location: GeoLocation = {
    id: Date.now(),
    name,
    latitude: isNaN(lat) ? DEFAULT_CITY.latitude : lat,
    longitude: isNaN(lon) ? DEFAULT_CITY.longitude : lon,
    country,
  };

  try {
    const data = await fetchWeatherData(location);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to retrieve weather telemetry' },
      { status: 500 }
    );
  }
}
