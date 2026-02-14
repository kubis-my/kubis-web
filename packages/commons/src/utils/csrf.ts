/**
 * CSRF token utilities for server-side token generation and validation
 * Implements cryptographically secure token generation and constant-time comparison
 */

import { randomBytes } from 'crypto';

/**
 * Generate cryptographically secure CSRF token
 * Returns 64-character hex string (32 bytes)
 */
export function generateCsrfToken(): string {
    return randomBytes(32).toString('hex');
}

/**
 * Constant-time comparison to prevent timing attacks
 * Compares two strings of equal length
 * @param a First token to compare
 * @param b Second token to compare
 * @returns true if tokens match, false otherwise
 */
export function compareTokens(a: string | undefined, b: string | undefined): boolean {
    if (!a || !b || a.length !== b.length) {
        return false;
    }

    let result = 0;
    for (let i = 0; i < a.length; i++) {
        result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }

    return result === 0;
}
