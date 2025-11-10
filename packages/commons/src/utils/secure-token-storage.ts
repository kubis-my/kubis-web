/**
 * Secure token storage using encrypted localStorage
 * Tokens are encrypted with AES-GCM before storage
 * Encryption key is stored in sessionStorage (cleared when tab closes)
 */

import {
  initEncryption,
  loadEncryptionKey,
  encryptToken,
  decryptToken,
  clearEncryptionKey,
} from './token-encryption';

const SESSION_TOKEN_KEY = 'kubis_session_token';
const ACCESS_TOKEN_KEY = 'kubis_access_token';
const REFRESH_TOKEN_KEY = 'kubis_refresh_token';

export const secureTokenStorage = {
  /**
   * Store session token (from SSO login)
   */
  async setSessionToken(sessionToken: string): Promise<void> {
    const key = await initEncryption();
    const encrypted = await encryptToken(sessionToken, key);
    localStorage.setItem(SESSION_TOKEN_KEY, encrypted);
  },

  /**
   * Retrieve session token
   */
  async getSessionToken(): Promise<string | null> {
    const key = await loadEncryptionKey();
    if (!key) return null;

    const encrypted = localStorage.getItem(SESSION_TOKEN_KEY);
    if (!encrypted) return null;

    try {
      return await decryptToken(encrypted, key);
    } catch (error) {
      // Decryption failed - corrupt or wrong key
      console.error('Failed to decrypt session token:', error);
      localStorage.removeItem(SESSION_TOKEN_KEY);
      return null;
    }
  },

  /**
   * Store access and refresh tokens (from OAuth flow)
   * Access token stored in sessionStorage, refresh token in localStorage
   */
  async setTokens(accessToken: string, refreshToken: string): Promise<void> {
    const key = await initEncryption();

    const encryptedAccess = await encryptToken(accessToken, key);
    const encryptedRefresh = await encryptToken(refreshToken, key);

    sessionStorage.setItem(ACCESS_TOKEN_KEY, encryptedAccess);
    localStorage.setItem(REFRESH_TOKEN_KEY, encryptedRefresh);
  },

  /**
   * Update only the access token (for token refresh without rotation)
   * Stored in sessionStorage for shorter exposure window
   */
  async setAccessToken(accessToken: string): Promise<void> {
    const key = await initEncryption();
    const encrypted = await encryptToken(accessToken, key);
    sessionStorage.setItem(ACCESS_TOKEN_KEY, encrypted);
  },

  /**
   * Update only the refresh token (if needed separately)
   */
  async setRefreshToken(refreshToken: string): Promise<void> {
    const key = await initEncryption();
    const encrypted = await encryptToken(refreshToken, key);
    localStorage.setItem(REFRESH_TOKEN_KEY, encrypted);
  },

  /**
   * Update tokens after refresh (handles both token rotation and single token refresh)
   * Access token stored in sessionStorage, refresh token in localStorage
   * @param accessToken - New access token (required)
   * @param refreshToken - New refresh token (optional, for token rotation)
   */
  async updateTokensAfterRefresh(
    accessToken: string,
    refreshToken?: string
  ): Promise<void> {
    const key = await initEncryption();

    // Always update access token in sessionStorage
    const encryptedAccess = await encryptToken(accessToken, key);
    sessionStorage.setItem(ACCESS_TOKEN_KEY, encryptedAccess);

    // Update refresh token if provided (token rotation scenario)
    if (refreshToken) {
      const encryptedRefresh = await encryptToken(refreshToken, key);
      localStorage.setItem(REFRESH_TOKEN_KEY, encryptedRefresh);
    }
  },

  /**
   * Retrieve access token from sessionStorage
   */
  async getAccessToken(): Promise<string | null> {
    const key = await loadEncryptionKey();
    if (!key) return null;

    const encrypted = sessionStorage.getItem(ACCESS_TOKEN_KEY);
    if (!encrypted) return null;

    try {
      return await decryptToken(encrypted, key);
    } catch (error) {
      console.error('Failed to decrypt access token:', error);
      sessionStorage.removeItem(ACCESS_TOKEN_KEY);
      return null;
    }
  },

  /**
   * Retrieve refresh token
   */
  async getRefreshToken(): Promise<string | null> {
    const key = await loadEncryptionKey();
    if (!key) return null;

    const encrypted = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!encrypted) return null;

    try {
      return await decryptToken(encrypted, key);
    } catch (error) {
      console.error('Failed to decrypt refresh token:', error);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      return null;
    }
  },

  /**
   * Clear all stored tokens and encryption key
   */
  clearTokens(): void {
    localStorage.removeItem(SESSION_TOKEN_KEY);
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    clearEncryptionKey();
  },

  /**
   * Check if session token exists (without decrypting)
   */
  hasSessionToken(): boolean {
    return !!localStorage.getItem(SESSION_TOKEN_KEY);
  },

  /**
   * Check if access token exists in sessionStorage (without decrypting)
   */
  hasAccessToken(): boolean {
    return !!sessionStorage.getItem(ACCESS_TOKEN_KEY);
  },
};
