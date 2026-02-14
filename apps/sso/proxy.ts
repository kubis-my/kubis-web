import { type NextRequest, NextResponse } from 'next/server';
import {
    CSRF_COOKIE_NAME,
    CSRF_COOKIE_CONFIG,
    generateCsrfTokenEdge,
} from '@repo/commons/utils/csrf-edge';

export function proxy(request: NextRequest) {
    const response = NextResponse.next();

    // Check if CSRF token already exists
    const existingToken = request.cookies.get(CSRF_COOKIE_NAME);

    if (!existingToken) {
        // Generate and set new CSRF token
        const csrfToken = generateCsrfTokenEdge();
        response.cookies.set(CSRF_COOKIE_NAME, csrfToken, CSRF_COOKIE_CONFIG);
    }

    return response;
}

// Run proxy on all routes
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
