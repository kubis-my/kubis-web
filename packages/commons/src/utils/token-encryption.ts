/**
 * Token encryption utilities using Web Crypto API
 * Provides AES-GCM encryption for securing tokens in browser storage
 */

const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;

let encryptionKey: CryptoKey | null = null;

/**
 * Generate a new encryption key
 */
async function generateEncryptionKey(): Promise<CryptoKey> {
  return await crypto.subtle.generateKey(
    { name: ALGORITHM, length: KEY_LENGTH },
    true, // extractable
    ['encrypt', 'decrypt']
  );
}

/**
 * Initialize encryption by generating or loading the key
 * Key is stored in sessionStorage and memory for the session lifetime
 */
export async function initEncryption(): Promise<CryptoKey> {
  if (encryptionKey) return encryptionKey;

  // Try to load existing key from sessionStorage
  const stored = sessionStorage.getItem('_ek');
  if (stored) {
    try {
      const keyData = Uint8Array.from(atob(stored), c => c.charCodeAt(0));
      encryptionKey = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: ALGORITHM, length: KEY_LENGTH },
        true,
        ['encrypt', 'decrypt']
      );
      return encryptionKey;
    } catch {
      // If key loading fails, generate new one
      sessionStorage.removeItem('_ek');
    }
  }

  // Generate new key
  encryptionKey = await generateEncryptionKey();

  // Export and store in sessionStorage
  const exported = await crypto.subtle.exportKey('raw', encryptionKey);
  sessionStorage.setItem('_ek', btoa(String.fromCharCode(...new Uint8Array(exported))));

  return encryptionKey;
}

/**
 * Load encryption key from sessionStorage
 * Returns null if no key exists
 */
export async function loadEncryptionKey(): Promise<CryptoKey | null> {
  if (encryptionKey) return encryptionKey;

  const stored = sessionStorage.getItem('_ek');
  if (!stored) return null;

  try {
    const keyData = Uint8Array.from(atob(stored), c => c.charCodeAt(0));
    encryptionKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: ALGORITHM, length: KEY_LENGTH },
      true,
      ['encrypt', 'decrypt']
    );
    return encryptionKey;
  } catch {
    // If key loading fails, clear corrupted data
    sessionStorage.removeItem('_ek');
    return null;
  }
}

/**
 * Encrypt a token string
 * @param token - The token to encrypt
 * @param key - The encryption key
 * @returns Base64-encoded encrypted token with IV prepended
 */
export async function encryptToken(token: string, key: CryptoKey): Promise<string> {
  // Generate random initialization vector
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(token);

  // Encrypt the token
  const encrypted = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv },
    key,
    encoded
  );

  // Combine IV + encrypted data for storage
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encrypted), iv.length);

  // Convert to base64 for storage
  return btoa(String.fromCharCode(...combined));
}

/**
 * Decrypt an encrypted token
 * @param encryptedToken - Base64-encoded encrypted token
 * @param key - The encryption key
 * @returns Decrypted token string
 */
export async function decryptToken(encryptedToken: string, key: CryptoKey): Promise<string> {
  // Decode from base64
  const combined = Uint8Array.from(atob(encryptedToken), c => c.charCodeAt(0));

  // Extract IV and encrypted data
  const iv = combined.slice(0, 12);
  const data = combined.slice(12);

  // Decrypt
  const decrypted = await crypto.subtle.decrypt(
    { name: ALGORITHM, iv },
    key,
    data
  );

  return new TextDecoder().decode(decrypted);
}

/**
 * Clear encryption key from memory and sessionStorage
 */
export function clearEncryptionKey(): void {
  encryptionKey = null;
  sessionStorage.removeItem('_ek');
}
