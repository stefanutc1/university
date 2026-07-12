export function toBase64(str: string) { return Buffer.from(str, 'utf8').toString('base64'); }
export function fromBase64(b64: string) { return Buffer.from(b64, 'base64').toString('utf8'); }
