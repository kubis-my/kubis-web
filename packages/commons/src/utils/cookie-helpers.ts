/**
 * Secure cookie management utilities for httpOnly token storage
 * Provides functions to set, get, and clear authentication cookies
 */

import { cookies } from 'next/headers';
import {
    ACCESS_TOKEN_KEY,
    CODE_VERIFIER_KEY,
    CSRF_TOKEN_KEY,
    OTP_TOKEN_KEY,
    REFRESH_TOKEN_KEY,
    SESSION_TOKEN_KEY,
} from '../constant/cookies-key';

// Cookie names
export const COOKIE_NAMES = {
    ACCESS_TOKEN: ACCESS_TOKEN_KEY,
    REFRESH_TOKEN: REFRESH_TOKEN_KEY,
    SESSION_TOKEN: SESSION_TOKEN_KEY,
    CSRF_TOKEN: CSRF_TOKEN_KEY,
    OTP_TOKEN: OTP_TOKEN_KEY,
    CODE_VERIFIER: CODE_VERIFIER_KEY,
} as const;

// Cookie configuration
const COOKIE_CONFIG = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    // Access token: 30 minutes (matches token expiration)
    accessTokenMaxAge: 30 * 60,
    // Refresh token: 7 days
    refreshTokenMaxAge: 7 * 24 * 60 * 60,
    // Session token: 7 days
    sessionTokenMaxAge: 7 * 24 * 60 * 60,
    // CSRF token: 7 days (matches session)
    csrfTokenMaxAge: 7 * 24 * 60 * 60,
    // OTP token: 10 minutes (short-lived for OTP verification)
    otpTokenMaxAge: 10 * 60,
    // Code verifier: 10 minutes (short-lived, paired with OTP flow)
    codeVerifierMaxAge: 10 * 60,
};

/**
 * Set access token in httpOnly cookie
 */
export async function setAccessTokenCookie(token: string): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAMES.ACCESS_TOKEN, token, {
        httpOnly: COOKIE_CONFIG.httpOnly,
        secure: COOKIE_CONFIG.secure,
        sameSite: COOKIE_CONFIG.sameSite,
        path: COOKIE_CONFIG.path,
        maxAge: COOKIE_CONFIG.accessTokenMaxAge,
    });
}

/**
 * Set refresh token in httpOnly cookie
 */
export async function setRefreshTokenCookie(token: string): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAMES.REFRESH_TOKEN, token, {
        httpOnly: COOKIE_CONFIG.httpOnly,
        secure: COOKIE_CONFIG.secure,
        sameSite: COOKIE_CONFIG.sameSite,
        path: COOKIE_CONFIG.path,
        maxAge: COOKIE_CONFIG.refreshTokenMaxAge,
    });
}

/**
 * Set session token in httpOnly cookie
 */
export async function setSessionTokenCookie(token: string): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAMES.SESSION_TOKEN, token, {
        httpOnly: COOKIE_CONFIG.httpOnly,
        secure: COOKIE_CONFIG.secure,
        sameSite: COOKIE_CONFIG.sameSite,
        path: COOKIE_CONFIG.path,
        maxAge: COOKIE_CONFIG.sessionTokenMaxAge,
    });
}

/**
 * Set both access and refresh tokens
 */
export async function setAuthCookies(accessToken: string, refreshToken: string): Promise<void> {
    await setAccessTokenCookie(accessToken);
    await setRefreshTokenCookie(refreshToken);
}

/**
 * Get access token from cookies
 */
export async function getAccessTokenCookie(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get(COOKIE_NAMES.ACCESS_TOKEN)?.value;
}

/**
 * Get refresh token from cookies
 */
export async function getRefreshTokenCookie(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get(COOKIE_NAMES.REFRESH_TOKEN)?.value;
}

/**
 * Get session token from cookies
 */
export async function getSessionTokenCookie(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get(COOKIE_NAMES.SESSION_TOKEN)?.value;
}

/**
 * Clear all authentication cookies
 */
export async function clearAuthCookies(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAMES.ACCESS_TOKEN);
    cookieStore.delete(COOKIE_NAMES.REFRESH_TOKEN);
}

/**
 * Clear all session token cookies
 */
export async function clearSessionCookies(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAMES.SESSION_TOKEN);
}

/**
 * Clear only access token (for token refresh)
 */
export async function clearAccessTokenCookie(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAMES.ACCESS_TOKEN);
}

/**
 * Set CSRF token in readable cookie (NOT httpOnly)
 * Client needs to read this to send in X-CSRF-Token header
 */
export async function setCsrfTokenCookie(token: string): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAMES.CSRF_TOKEN, token, {
        httpOnly: false, // MUST be readable by client JavaScript
        secure: COOKIE_CONFIG.secure,
        sameSite: 'strict', // Stricter than 'lax' for CSRF protection
        path: COOKIE_CONFIG.path,
        maxAge: COOKIE_CONFIG.csrfTokenMaxAge,
    });
}

/**
 * Get CSRF token from cookies (server-side)
 */
export async function getCsrfTokenCookie(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get(COOKIE_NAMES.CSRF_TOKEN)?.value;
}

/**
 * Clear CSRF token cookie
 */
export async function clearCsrfTokenCookie(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAMES.CSRF_TOKEN);
}

/**
 * Set OTP token in httpOnly cookie (short-lived for OTP verification flow)
 */
export async function setOtpTokenCookie(token: string): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAMES.OTP_TOKEN, token, {
        httpOnly: COOKIE_CONFIG.httpOnly,
        secure: COOKIE_CONFIG.secure,
        sameSite: COOKIE_CONFIG.sameSite,
        path: COOKIE_CONFIG.path,
        maxAge: COOKIE_CONFIG.otpTokenMaxAge,
    });
}

/**
 * Get OTP token from cookies
 */
export async function getOtpTokenCookie(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get(COOKIE_NAMES.OTP_TOKEN)?.value;
}

/**
 * Clear OTP token cookie
 */
export async function clearOtpTokenCookie(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAMES.OTP_TOKEN);
}

/**
 * Set code verifier in httpOnly cookie (short-lived for PKCE flow with OTP)
 */
export async function setCodeVerifierCookie(verifier: string): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAMES.CODE_VERIFIER, verifier, {
        httpOnly: COOKIE_CONFIG.httpOnly,
        secure: COOKIE_CONFIG.secure,
        sameSite: COOKIE_CONFIG.sameSite,
        path: COOKIE_CONFIG.path,
        maxAge: COOKIE_CONFIG.codeVerifierMaxAge,
    });
}

/**
 * Get code verifier from cookies
 */
export async function getCodeVerifierCookie(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get(COOKIE_NAMES.CODE_VERIFIER)?.value;
}

/**
 * Clear code verifier cookie
 */
export async function clearCodeVerifierCookie(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAMES.CODE_VERIFIER);
}
