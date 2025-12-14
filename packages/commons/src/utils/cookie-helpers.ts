/**
 * Secure cookie management utilities for httpOnly token storage
 * Provides functions to set, get, and clear authentication cookies
 */

import { cookies } from 'next/headers';

// Cookie names
export const COOKIE_NAMES = {
  ACCESS_TOKEN: 'C76A85C95AT3185',
  REFRESH_TOKEN: '7818RT76CAC658E',
  SESSION_TOKEN: '3B5F3DE1ST42A5A',
} as const;

// Cookie configuration
const COOKIE_CONFIG = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
  // Access token: 30 minutes (matches token expiration)
  accessTokenMaxAge: 30 * 60,
  // Refresh token: 7 days
  refreshTokenMaxAge: 7 * 24 * 60 * 60,
  // Session token: 7 days
  sessionTokenMaxAge: 7 * 24 * 60 * 60,
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
