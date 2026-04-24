import { type NextRequest, NextResponse } from 'next/server';
import {
    CSRF_COOKIE_NAME,
    CSRF_COOKIE_CONFIG,
    generateCsrfTokenEdge,
} from '@repo/commons/utils/csrf-edge';

export function proxy(request: NextRequest) {
    const response = NextResponse.next();

    const existingToken = request.cookies.get(CSRF_COOKIE_NAME);

    if (!existingToken) {
        const csrfToken = generateCsrfTokenEdge();
        response.cookies.set(CSRF_COOKIE_NAME, csrfToken, CSRF_COOKIE_CONFIG);
    }

    return response;
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
