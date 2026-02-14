/**
 * Elysia CSRF validation plugin
 * Validates CSRF tokens using the Double Submit Cookie pattern
 */

import { Elysia } from 'elysia';
import { getCsrfTokenCookie } from '../utils/cookie-helpers';
import { compareTokens } from '../utils/csrf';

/**
 * CSRF validation plugin for Elysia
 * Validates CSRF token from cookie matches token in X-CSRF-Token header
 * Automatically skips validation for GET requests
 *
 * Usage: .use(csrfProtection())
 */
export function csrfProtection() {
    return new Elysia().onRequest(async ({ request, set }) => {
        // Only validate POST requests (GET is read-only and safe)
        if (request.method !== 'POST') {
            return;
        }

        // Extract CSRF token from header (support both cases)
        const headerToken =
            (request.headers.get('X-CSRF-Token') || request.headers.get('x-csrf-token')) ??
            undefined;

        // Extract CSRF token from cookie
        const cookieToken = await getCsrfTokenCookie();

        // Validate tokens exist and match using constant-time comparison
        if (!compareTokens(cookieToken, headerToken)) {
            set.status = 403;
            return new Response(
                JSON.stringify({
                    error: 'CSRF token validation failed',
                    code: 'CSRF_VALIDATION_FAILED',
                }),
                {
                    status: 403,
                    headers: { 'Content-Type': 'application/json' },
                },
            );
        }
    });
}
