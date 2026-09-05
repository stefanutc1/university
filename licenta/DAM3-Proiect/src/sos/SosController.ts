import { PermissionsAndroid, Platform } from 'react-native';

let Geolocation: any = null;
try {
  const mod = require('react-native-geolocation-service');
  Geolocation = mod?.default || mod;
} catch {
  Geolocation = null;
}
import { MeshRouter } from '../routing/MeshRouter';
import { SOSAlert } from '../types';

export class SosController {
  private static instance: SosController;

  private isArmed: boolean = false;
  private activeAlert: SOSAlert | null = null;
  private router = MeshRouter.getInstance();

  public static getInstance(): SosController {
    if (!SosController.instance) {
      SosController.instance = new SosController();
    }
    return SosController.instance;
  }

  public getArmedState(): boolean {
    return this.isArmed;
  }

  public getActiveAlert(): SOSAlert | null {
    return this.activeAlert;
  }

  public async triggerSos(note: string): Promise<SOSAlert> {
    this.isArmed = true;

    let latitude: number | null = null;
    let longitude: number | null = null;

    try {
      const position = await this.getCurrentLocation();
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
    } catch {
      // Fallback without coordinates if GPS unavailable offline
    }

    const alert = await this.router.broadcastSos(
      latitude,
      longitude,
      note.trim() || 'EMERGENCY: Urgent assistance needed'
    );
    this.activeAlert = alert;
    return alert;
  }

  public cancelSos(): void {
    this.isArmed = false;
    this.activeAlert = null;
  }

  private async getCurrentLocation(): Promise<Geolocation.GeoPosition> {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        throw new Error('Location permission denied');
      }
    }

    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (pos) => resolve(pos),
        (err) => reject(err),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 10000 }
      );
    });
  }
}
