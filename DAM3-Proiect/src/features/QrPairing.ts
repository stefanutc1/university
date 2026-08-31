import { CryptoEngine } from '../crypto/CryptoEngine';

export interface QrPairingPayload {
  v: number; // version
  name: string;
  pk: string; // Ed25519 signing public key hex
  apk: string; // X25519 agreement public key hex
  ip?: string;
  ts: number;
}

/**
 * Pairing Instant prin Scanare QR Code
 * Schimbul de chei publice si initierea conexiunii directe printr-o singura
 * scanare a ecranului celuilalt utilizator.
 */
export class QrPairing {
  private static instance: QrPairing;
  private crypto = CryptoEngine.getInstance();

  public static getInstance(): QrPairing {
    if (!QrPairing.instance) {
      QrPairing.instance = new QrPairing();
    }
    return QrPairing.instance;
  }

  /**
   * Genereaza payload-ul complet de imperechere pentru afisare in codul QR.
   */
  public generateMyQrPayload(deviceName: string, localIp?: string): string {
    const payload: QrPairingPayload = {
      v: 1,
      name: deviceName,
      pk: this.crypto.publicKeyHex,
      apk: this.crypto.agreementPublicKeyHex,
      ip: localIp,
      ts: Date.now(),
    };
    return JSON.stringify(payload);
  }

  /**
   * Parseaza si valideaza datele obtinute din scanarea codului QR al altui dispozitiv.
   */
  public parseScannedQr(rawString: string): QrPairingPayload {
    try {
      const data: QrPairingPayload = JSON.parse(rawString);
      if (!data.pk || !data.apk || data.pk.length !== 64 || data.apk.length !== 64) {
        throw new Error('Chei criptografice invalide in codul QR');
      }
      return data;
    } catch (e: any) {
      throw new Error('Format QR invalid: ' + e.message);
    }
  }
}
