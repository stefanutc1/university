import nacl from 'tweetnacl';
import { decodeUTF8, encodeUTF8, encodeBase64, decodeBase64 } from 'tweetnacl-util';

export class CryptoEngine {
  private static instance: CryptoEngine;

  private boxKeyPair: nacl.BoxKeyPair;
  private signKeyPair: nacl.SignKeyPair;

  private constructor() {
    // Generate sovereign cryptographic keypairs on-device
    this.boxKeyPair = nacl.box.keyPair();
    this.signKeyPair = nacl.sign.keyPair();
  }

  public static getInstance(): CryptoEngine {
    if (!CryptoEngine.instance) {
      CryptoEngine.instance = new CryptoEngine();
    }
    return CryptoEngine.instance;
  }

  public get publicKeyHex(): string {
    return this.uint8ArrayToHex(this.signKeyPair.publicKey);
  }

  public get agreementPublicKeyHex(): string {
    return this.uint8ArrayToHex(this.boxKeyPair.publicKey);
  }

  public get shortIdentifier(): string {
    return this.publicKeyHex.substring(0, 8);
  }

  // --- End-to-End Authenticated Encryption (Curve25519 / XSalsa20-Poly1305) ---

  public encrypt(plaintext: string, recipientAgreementPubkeyHex: string): {
    ciphertextHex: string;
    nonceHex: string;
    authTagHex: string;
  } {
    const recipientPubkey = this.hexToUint8Array(recipientAgreementPubkeyHex);
    const nonce = nacl.randomBytes(nacl.box.nonceLength);
    const messageUint8 = decodeUTF8(plaintext);

    const encrypted = nacl.box(messageUint8, nonce, recipientPubkey, this.boxKeyPair.secretKey);
    if (!encrypted) {
      throw new Error('Encryption failed');
    }

    // nacl.box includes Poly1305 tag within the boxed message
    const authTag = encrypted.subarray(0, 16);
    const ciphertext = encrypted.subarray(16);

    return {
      ciphertextHex: this.uint8ArrayToHex(ciphertext),
      nonceHex: this.uint8ArrayToHex(nonce),
      authTagHex: this.uint8ArrayToHex(authTag),
    };
  }

  public decrypt(
    ciphertextHex: string,
    nonceHex: string,
    authTagHex: string,
    senderAgreementPubkeyHex: string
  ): string {
    const senderPubkey = this.hexToUint8Array(senderAgreementPubkeyHex);
    const nonce = this.hexToUint8Array(nonceHex);
    const ciphertext = this.hexToUint8Array(ciphertextHex);
    const authTag = this.hexToUint8Array(authTagHex);

    const fullBoxed = new Uint8Array(authTag.length + ciphertext.length);
    fullBoxed.set(authTag, 0);
    fullBoxed.set(ciphertext, authTag.length);

    const decrypted = nacl.box.open(fullBoxed, nonce, senderPubkey, this.boxKeyPair.secretKey);
    if (!decrypted) {
      throw new Error('Cryptographic verification / decryption failed (MAC mismatch or tampered data)');
    }

    return encodeUTF8(decrypted);
  }

  // --- Digital Signatures (Ed25519) ---

  public sign(dataHex: string): string {
    const data = this.hexToUint8Array(dataHex);
    const signature = nacl.sign.detached(data, this.signKeyPair.secretKey);
    return this.uint8ArrayToHex(signature);
  }

  public verify(dataHex: string, signatureHex: string, signerPubkeyHex: string): boolean {
    try {
      const data = this.hexToUint8Array(dataHex);
      const signature = this.hexToUint8Array(signatureHex);
      const signerPubkey = this.hexToUint8Array(signerPubkeyHex);
      return nacl.sign.detached.verify(data, signature, signerPubkey);
    } catch {
      return false;
    }
  }

  // --- Hex Utility Functions ---

  public uint8ArrayToHex(arr: Uint8Array): string {
    return Array.from(arr)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  public hexToUint8Array(hex: string): Uint8Array {
    const cleanHex = hex.trim();
    const len = cleanHex.length;
    const result = new Uint8Array(len / 2);
    for (let i = 0; i < len; i += 2) {
      result[i / 2] = parseInt(cleanHex.substring(i, i + 2), 16);
    }
    return result;
  }
}
