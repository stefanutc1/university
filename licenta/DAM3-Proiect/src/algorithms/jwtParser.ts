// JSON Web Token Parser and Expiry Evaluator

export interface JwtInspection {
  isValidFormat: boolean;
  header: Record<string, any> | null;
  payload: Record<string, any> | null;
  algorithm: string;
  isExpired: boolean;
  expiresInSeconds: number | null;
  issuedAt: string | null;
  expiresAt: string | null;
  rawHeader: string;
  rawPayload: string;
  signature: string;
}

export function parseBase64Url(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  if (typeof atob !== 'undefined') {
    return decodeURIComponent(escape(atob(base64)));
  }
  return Buffer.from(base64, 'base64').toString('utf8');
}

export function inspectJwt(token: string): JwtInspection {
  const parts = token.trim().split('.');
  if (parts.length !== 3) {
    return {
      isValidFormat: false,
      header: null,
      payload: null,
      algorithm: 'N/A',
      isExpired: false,
      expiresInSeconds: null,
      issuedAt: null,
      expiresAt: null,
      rawHeader: '',
      rawPayload: '',
      signature: '',
    };
  }

  try {
    const rawHeader = parseBase64Url(parts[0]);
    const rawPayload = parseBase64Url(parts[1]);
    const header = JSON.parse(rawHeader);
    const payload = JSON.parse(rawPayload);

    const nowSeconds = Math.floor(Date.now() / 1000);
    let isExpired = false;
    let expiresInSeconds: number | null = null;
    let expiresAt: string | null = null;
    let issuedAt: string | null = null;

    if (payload.exp && typeof payload.exp === 'number') {
      isExpired = nowSeconds >= payload.exp;
      expiresInSeconds = payload.exp - nowSeconds;
      expiresAt = new Date(payload.exp * 1000).toISOString();
    }

    if (payload.iat && typeof payload.iat === 'number') {
      issuedAt = new Date(payload.iat * 1000).toISOString();
    }

    return {
      isValidFormat: true,
      header,
      payload,
      algorithm: header.alg || 'none',
      isExpired,
      expiresInSeconds,
      issuedAt,
      expiresAt,
      rawHeader,
      rawPayload,
      signature: parts[2],
    };
  } catch (err) {
    return {
      isValidFormat: false,
      header: null,
      payload: null,
      algorithm: 'ERROR',
      isExpired: false,
      expiresInSeconds: null,
      issuedAt: null,
      expiresAt: null,
      rawHeader: '',
      rawPayload: '',
      signature: '',
    };
  }
}

// Header alg and claims parsed
