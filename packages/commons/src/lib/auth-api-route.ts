import { Elysia, t } from 'elysia'
import { authClient } from './auth-client';
import { clearAuthCookies, getAccessTokenCookie, getRefreshTokenCookie, setAccessTokenCookie, setAuthCookies } from '../utils/cookie-helpers';

const auth = new Elysia({ prefix: '/api/auth' })
    .post(
        '/exchange',
        async ({ body, set }) => {
            try {
                const { code, raw } = await authClient.exchangeCodeForTokens(body);

                if (code === 200 && raw.accessToken && raw.refreshToken) {
                    await setAuthCookies(raw.accessToken, raw.refreshToken);

                    return {
                        success: true,
                        message: 'Tokens exchanged and stored successfully',
                    }
                }

                set.status = code === 400 ? 400 : 500

                return {
                    error: 'Token exchange failed',
                    details: raw,
                }
            } catch (e) {
                set.status = 500

                return {
                    error: 'Internal server error',
                    details: (e as Error).message
                }
            }
        },
        {
            body: t.Object({
                code: t.String(),
                clientId: t.String(),
                redirectUri: t.String(),
                codeVerifier: t.String(),
            }),
        }
    )
    .post(
        "/logout",
        async ({ set }) => {
            try {
                await clearAuthCookies();

                return {
                    success: true,
                    message: 'Logged out successfully',
                }
            } catch (e) {
                set.status = 500

                return {
                    error: 'Internal server error',
                    details: (e as Error).message
                }
            }
        }
    )
    .post(
        "refresh",
        async ({ set }) => {
            try {
                const refreshToken = await getRefreshTokenCookie() ?? "invalid-token";
                const { code, raw } = await authClient.refresh({ refreshToken });

                if (code === 200 && raw.token) {
                    if (raw.refreshToken) {
                        await setAuthCookies(raw.token, raw.refreshToken);
                    } else {
                        await setAccessTokenCookie(raw.token);
                    }

                    return {
                        success: true,
                        message: 'Tokens refreshed successfully',
                    }
                }

                await clearAuthCookies();

                set.status = code === 400 ? 400 : 500

                return {
                    error: 'Token refresh failed',
                    details: raw,
                }
            } catch (e) {
                set.status = 500

                return {
                    error: 'Internal server error',
                    details: (e as Error).message
                }
            }
        }
    )
    .get(
        "session",
        async ({ set }) => {
            try {
                const accessToken = await getAccessTokenCookie() ?? "invalid-token";
                const { code, raw } = await authClient.validate({ token: accessToken });

                if (code === 200 && raw.valid) {
                    return {
                        authenticated: true,
                        message: 'Session valid',
                    }
                }

                return {
                    authenticated: false,
                    message: 'Invalid or expired token',
                }
            } catch (e) {
                set.status = 500

                return {
                    error: 'Internal server error',
                    details: (e as Error).message
                }
            }
        }
    )

export const GET = auth.fetch
export const POST = auth.fetch