/** Returns the platform CSPRNG when the runtime exposes one. */
function webCrypto(): Crypto | undefined {
  return typeof globalThis.crypto === 'undefined' ? undefined : globalThis.crypto;
}

/** UUID v4, using the platform CSPRNG when available. */
export function uuid(): string {
  const source = webCrypto();

  if (source && typeof source.randomUUID === 'function') {
    return source.randomUUID();
  }

  const bytes = new Uint8Array(16);
  if (source && typeof source.getRandomValues === 'function') {
    source.getRandomValues(bytes);
  } else {
    // Non-secure fallback for exotic runtimes; ids here are not security tokens.
    for (let i = 0; i < bytes.length; i += 1) bytes[i] = Math.floor(Math.random() * 256);
  }

  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = [...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

const REFERENCE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function randomToken(length: number): string {
  let out = '';
  for (let i = 0; i < length; i += 1) {
    out += REFERENCE_ALPHABET[Math.floor(Math.random() * REFERENCE_ALPHABET.length)];
  }
  return out;
}

/** Human-readable order reference, e.g. VC-8F3K2Q. */
export function orderReference(): string {
  return `VC-${randomToken(6)}`;
}

export function ticketReference(): string {
  return `TCK-${randomToken(5)}`;
}
