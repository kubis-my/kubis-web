/**
 * CSRF token utilities for Edge Runtime
 * Uses Web Crypto API instead of Node.js crypto
 */

import { COOKIE_NAMES } from './cookie-helpers';

/**
 * CSRF cookie name (re-exported for convenience)
 */
export const CSRF_COOKIE_NAME = COOKIE_NAMES.CSRF_TOKEN;

/**
 * CSRF cookie configuration for Edge Runtime (proxy/middleware)
 * Must match the configuration in cookie-helpers.ts setCsrfTokenCookie
 */
export const CSRF_COOKIE_CONFIG = {
    httpOnly: false, // MUST be readable by client JavaScript
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const, // Stricter than 'lax' for CSRF protection
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days
};

/**
 * Generate cryptographically secure CSRF token for Edge Runtime
 * Returns 64-character hex string (32 bytes)
 */
export function generateCsrfTokenEdge(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}
