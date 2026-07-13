export function toBase64(str: string) { return Buffer.from(str, 'utf8').toString('base64'); }
export function fromBase64(b64: string) { return Buffer.from(b64, 'base64').toString('utf8'); }

export function encodeUrl(str: string) { return encodeURIComponent(str); }
export function decodeUrl(str: string) { return decodeURIComponent(str); }

export function textToHex(str: string) { return Buffer.from(str).toString('hex'); }

// Base64 format validation logic
