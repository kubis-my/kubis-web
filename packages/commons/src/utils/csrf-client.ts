/**
 * Client-side CSRF token utilities
 * Reads CSRF token from cookie to include in request headers
 */

import { CSRF_TOKEN_KEY } from '../constant/cookies-key';

/**
 * Get CSRF token from document cookies
 * Returns undefined if not found or in SSR context
 */
export function getCsrfToken(): string | undefined {
    if (typeof document === 'undefined') {
        return undefined;
    }

    const cookies = document.cookie.split(';');

    for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === CSRF_TOKEN_KEY) {
            return decodeURIComponent(value!);
        }
    }

    return undefined;
}

/**
 * Get headers object with CSRF token
 * Merges with existing headers
 */
export function getCsrfHeaders(existingHeaders: HeadersInit = {}): HeadersInit {
    const csrfToken = getCsrfToken();

    if (!csrfToken) {
        return existingHeaders;
    }

    return {
        ...existingHeaders,
        'X-CSRF-Token': csrfToken,
    };
}

/**
 * Check if error is CSRF-related
 */
export function isCsrfError(error: any): boolean {
    return (
        error?.code === 'CSRF_VALIDATION_FAILED' ||
        error?.message?.includes('CSRF token validation failed') ||
        (error?.status === 403 && error?.message?.includes('CSRF'))
    );
}

/**
 * Handle CSRF error by redirecting to login
 */
export function handleCsrfError(redirectUrl: string = '/'): void {
    if (typeof window !== 'undefined') {
        window.location.href = redirectUrl;
    }
}
