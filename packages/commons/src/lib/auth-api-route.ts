import { Elysia, t } from 'elysia';
import axios from 'axios';
import { authClient } from './auth-client';
import {
    clearAuthCookies,
    clearCsrfTokenCookie,
    getAccessTokenCookie,
    getRefreshTokenCookie,
    setAccessTokenCookie,
    setAuthCookies,
    setCsrfTokenCookie,
} from '../utils/cookie-helpers';
import { generateCsrfToken } from '../utils/csrf';
import { csrfProtection } from './csrf-plugin';
import { createForwardedHeaders } from '../utils/client-ip';

const auth = new Elysia({ prefix: '/api/auth' })
    .use(csrfProtection())
    .post(
        '/exchange',
        async ({ body, set, request }) => {
            try {
                const forwardedHeaders = createForwardedHeaders(request);
                const driver = axios.create({
                    headers: forwardedHeaders,
                });

                const { code, raw } = await authClient.exchangeCodeForTokens({
                    ...body,
                    driver,
                });

                if (code === 200 && raw.accessToken && raw.refreshToken) {
                    await setAuthCookies(raw.accessToken, raw.refreshToken);

                    // Generate and set CSRF token for new session
                    const csrfToken = generateCsrfToken();
                    await setCsrfTokenCookie(csrfToken);

                    return {
                        success: true,
                        message: 'Tokens exchanged and stored successfully',
                    };
                }

                set.status = code === 400 ? 400 : 500;

                return {
                    error: 'Token exchange failed',
                    details: raw,
                };
            } catch (e) {
                set.status = 500;

                return {
                    error: 'Internal server error',
                    details: (e as Error).message,
                };
            }
        },
        {
            body: t.Object({
                code: t.String(),
                clientId: t.String(),
                redirectUri: t.String(),
                codeVerifier: t.String(),
            }),
        },
    )
    .post('/logout', async ({ set, request }) => {
        try {
            const refreshToken = await getRefreshTokenCookie();

            if (refreshToken) {
                const forwardedHeaders = createForwardedHeaders(request);
                const driver = axios.create({
                    headers: forwardedHeaders,
                });

                const { code, raw } = await authClient.signOut({
                    refreshToken,
                    driver,
                });

                if (code !== 200) {
                    set.status = code === 400 ? 400 : 500;

                    return {
                        error: 'Sign out failed',
                        details: raw,
                    };
                }
            }

            await clearAuthCookies();
            await clearCsrfTokenCookie();

            return {
                success: true,
                message: 'Logged out successfully',
            };
        } catch (e) {
            set.status = 500;

            return {
                error: 'Internal server error',
                details: (e as Error).message,
            };
        }
    })
    .post('refresh', async ({ set, request }) => {
        try {
            const refreshToken = (await getRefreshTokenCookie()) ?? 'invalid-token';
            const forwardedHeaders = createForwardedHeaders(request);
            const driver = axios.create({
                headers: forwardedHeaders,
            });

            const { code, raw } = await authClient.refresh({
                refreshToken,
                driver,
            });

            if (code === 200 && raw.token) {
                if (raw.refreshToken) {
                    await setAuthCookies(raw.token, raw.refreshToken);
                } else {
                    await setAccessTokenCookie(raw.token);
                }

                // Rotate CSRF token on refresh
                const csrfToken = generateCsrfToken();
                await setCsrfTokenCookie(csrfToken);

                return {
                    success: true,
                    message: 'Tokens refreshed successfully',
                };
            }

            await clearAuthCookies();

            set.status = code === 400 ? 400 : 500;

            return {
                error: 'Token refresh failed',
                details: raw,
            };
        } catch (e) {
            set.status = 500;

            return {
                error: 'Internal server error',
                details: (e as Error).message,
            };
        }
    })
    .get('session', async ({ set, request }) => {
        try {
            const accessToken = (await getAccessTokenCookie()) ?? 'invalid-token';
            const forwardedHeaders = createForwardedHeaders(request);
            const driver = axios.create({
                headers: forwardedHeaders,
            });

            const { code, raw } = await authClient.validate({
                token: accessToken,
                driver,
            });

            if (code === 200 && raw.valid) {
                return {
                    authenticated: true,
                    message: 'Session valid',
                };
            }

            return {
                authenticated: false,
                message: 'Invalid or expired token',
            };
        } catch (e) {
            set.status = 500;

            return {
                error: 'Internal server error',
                details: (e as Error).message,
            };
        }
    })
    .get('socket-token', async ({ set, request }) => {
        try {
            const accessToken = await getAccessTokenCookie();

            if (!accessToken) {
                set.status = 401;
                return {
                    error: 'Not authenticated',
                    token: null,
                };
            }

            const forwardedHeaders = createForwardedHeaders(request);
            const driver = axios.create({
                headers: forwardedHeaders,
            });

            // Validate the token before returning it
            const { code, raw } = await authClient.validate({
                token: accessToken,
                driver,
            });

            if (code === 200 && raw.valid) {
                return {
                    token: accessToken,
                };
            }

            set.status = 401;
            return {
                error: 'Invalid or expired token',
                token: null,
            };
        } catch (e) {
            set.status = 500;

            return {
                error: 'Internal server error',
                details: (e as Error).message,
                token: null,
            };
        }
    })
    .post(
        '/credential/update',
        async ({ body, set, request }) => {
            try {
                const accessToken = await getAccessTokenCookie();

                if (!accessToken) {
                    set.status = 401;
                    return {
                        error: 'Not authenticated',
                        details: { id: 'NOT_AUTHENTICATED' },
                    };
                }

                const forwardedHeaders = createForwardedHeaders(request);
                const driver = axios.create({
                    headers: {
                        ...forwardedHeaders,
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                const { code, raw } = await authClient.updateCredential({
                    email: body.email ?? undefined,
                    username: body.username ?? undefined,
                    password: body.password ?? undefined,
                    driver,
                });

                if (code === 200) {
                    return {
                        success: true,
                        message: 'Credential update request submitted',
                        data: raw,
                    };
                }

                set.status = code ?? 500;

                return {
                    error: 'Credential update failed',
                    details: raw,
                };
            } catch (e) {
                set.status = 500;

                return {
                    error: 'Internal server error',
                    details: (e as Error).message,
                };
            }
        },
        {
            body: t.Object({
                email: t.Optional(t.Union([t.String(), t.Null()])),
                username: t.Optional(t.Union([t.String(), t.Null()])),
                password: t.Optional(t.Union([t.String(), t.Null()])),
            }),
        },
    )
    .post(
        '/credential/update/verify-otp',
        async ({ body, set, request }) => {
            try {
                const accessToken = await getAccessTokenCookie();

                if (!accessToken) {
                    set.status = 401;
                    return {
                        error: 'Not authenticated',
                        details: { id: 'NOT_AUTHENTICATED' },
                    };
                }

                const forwardedHeaders = createForwardedHeaders(request);
                const driver = axios.create({
                    headers: {
                        ...forwardedHeaders,
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                const { code, raw } = await authClient.updateCredentialVerifyOTP({
                    token: body.token,
                    otpCode: body.otpCode,
                    driver,
                });

                if (code === 200) {
                    return {
                        success: true,
                        message: 'Credential updated successfully',
                        data: raw,
                    };
                }

                set.status = code ?? 500;

                return {
                    error: 'Credential OTP verification failed',
                    details: raw,
                };
            } catch (e) {
                set.status = 500;

                return {
                    error: 'Internal server error',
                    details: (e as Error).message,
                };
            }
        },
        {
            body: t.Object({
                token: t.String(),
                otpCode: t.String(),
            }),
        },
    );

export const GET = auth.fetch;
export const POST = auth.fetch;
