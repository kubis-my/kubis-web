import { Elysia, t } from 'elysia';
import axios from 'axios';
import { authClient } from '@repo/commons/lib/auth-client';
import {
    clearCodeVerifierCookie,
    clearCsrfTokenCookie,
    clearOtpTokenCookie,
    clearSessionCookies,
    getCodeVerifierCookie,
    getOtpTokenCookie,
    getSessionTokenCookie,
    setCsrfTokenCookie,
    setCodeVerifierCookie,
    setOtpTokenCookie,
    setSessionTokenCookie,
} from '@repo/commons/utils/cookie-helpers';
import { generateCsrfToken } from '@repo/commons/utils/csrf';
import { csrfProtection } from '@repo/commons/lib/csrf-plugin';
import { createForwardedHeaders } from '@repo/commons/utils/client-ip';

const auth = new Elysia({ prefix: '/api/auth' })
    .use(csrfProtection())
    .post(
        '/sign-in',
        async ({ body, set, request }) => {
            try {
                const forwardedHeaders = createForwardedHeaders(request);
                const driver = axios.create({
                    headers: forwardedHeaders,
                });

                const { code, raw } = await authClient.signIn({
                    ...body,
                    driver,
                });

                if (code === 200) {
                    if (raw.twoFactorEnabled && raw.token) {
                        // Store OTP token and PKCE code verifier in httpOnly cookies
                        await setOtpTokenCookie(raw.token);
                        await setCodeVerifierCookie(raw.verifier);

                        return {
                            success: true,
                            message: 'Sign in with otp successful',
                            data: {
                                twoFactorEnabled: true,
                                expiredAt: raw.expiredAt,
                                email: raw.email,
                            },
                        };
                    } else if (!raw.twoFactorEnabled && raw.sessionToken) {
                        await setSessionTokenCookie(raw.sessionToken);

                        // Generate CSRF token for new session
                        const csrfToken = generateCsrfToken();
                        await setCsrfTokenCookie(csrfToken);

                        await new Promise((resolve) => setTimeout(resolve, 500));

                        return {
                            success: true,
                            message: 'Sign in successful',
                            data: {
                                twoFactorEnabled: false,
                                redirectUrl: raw.redirectUrl,
                                verifier: raw.verifier,
                            },
                        };
                    }
                }

                set.status = code === 400 ? 400 : 500;

                return {
                    error: 'Sign in failed',
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
                identifier: t.String(),
                password: t.String(),
                clientId: t.String(),
                redirectUri: t.String(),
            }),
        },
    )
    .post(
        '/authorize',
        async ({ body, set, request }) => {
            try {
                const sessionToken = (await getSessionTokenCookie()) ?? 'invalid-token';
                const forwardedHeaders = createForwardedHeaders(request);
                const driver = axios.create({
                    headers: forwardedHeaders,
                });

                const { code, raw } = await authClient.redirectAuthorize({
                    ...body,
                    sessionToken,
                    driver,
                });

                if (code === 200 && raw.redirectUrl) {
                    return {
                        success: true,
                        message: 'Authorization successful',
                        data: {
                            redirectUrl: raw.redirectUrl,
                        },
                    };
                }

                set.status = code === 400 ? 400 : 500;

                return {
                    error: 'Authorization failed',
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
                clientId: t.String(),
                redirectUri: t.String(),
                codeChallenge: t.String(),
                scope: t.Optional(t.String()),
                state: t.Optional(t.String()),
            }),
        },
    )
    .post(
        '/verify-otp',
        async ({ body, set, request }) => {
            try {
                const otpToken = await getOtpTokenCookie();
                const codeVerifier = await getCodeVerifierCookie();

                if (!otpToken || !codeVerifier) {
                    set.status = 400;
                    return {
                        error: 'OTP session expired',
                        details: { id: 'otp_session_expired' },
                    };
                }

                const forwardedHeaders = createForwardedHeaders(request);
                const driver = axios.create({
                    headers: forwardedHeaders,
                });

                const { code, raw } = await authClient.verifyOTP({
                    token: otpToken,
                    otpCode: body.code,
                    driver,
                });

                if (code === 200 && raw.sessionToken) {
                    await setSessionTokenCookie(raw.sessionToken);

                    const csrfToken = generateCsrfToken();
                    await setCsrfTokenCookie(csrfToken);

                    // Clean up OTP-related cookies
                    await clearOtpTokenCookie();
                    await clearCodeVerifierCookie();

                    await new Promise((resolve) => setTimeout(resolve, 500));

                    return {
                        success: true,
                        message: 'OTP verification successful',
                        data: {
                            redirectUrl: raw.redirectUrl,
                            verifier: codeVerifier,
                        },
                    };
                }

                set.status = code === 400 ? 400 : 500;

                return {
                    error: 'OTP verification failed',
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
            }),
        },
    )
    .post('/resend-otp', async ({ set, request }) => {
        try {
            const otpToken = await getOtpTokenCookie();

            if (!otpToken) {
                set.status = 400;
                return {
                    error: 'OTP session expired',
                    details: { id: 'otp_session_expired' },
                };
            }

            const forwardedHeaders = createForwardedHeaders(request);
            const driver = axios.create({
                headers: forwardedHeaders,
            });

            const { code, raw } = await authClient.resendOTP({
                existingToken: otpToken,
                driver,
            });

            if (code === 200 && raw.token) {
                // Update OTP token cookie with the new token
                await setOtpTokenCookie(raw.token);

                return {
                    success: true,
                    message: 'OTP resent successfully',
                    data: {
                        expiredAt: raw.expiredAt,
                        email: raw.email,
                    },
                };
            }

            set.status = code === 400 ? 400 : 500;

            return {
                error: 'Resend OTP failed',
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
    .get('/session', async ({ set, request }) => {
        try {
            const sessionToken = (await getSessionTokenCookie()) ?? 'invalid-token';
            const forwardedHeaders = createForwardedHeaders(request);
            const driver = axios.create({
                headers: forwardedHeaders,
            });

            const { code, raw } = await authClient.validate({
                token: sessionToken,
                driver,
            });

            if (code === 200) {
                return {
                    authenticated: raw.valid,
                    message: raw.valid === false ? 'Session valid' : 'Invalid or expired session',
                };
            }

            set.status = 403;
            return {
                authenticated: false,
                message: 'Invalid or expired session',
            };
        } catch (e) {
            set.status = 500;

            return {
                error: 'Internal server error',
                details: (e as Error).message,
            };
        }
    })
    .post(
        '/sign-up',
        async ({ body, set, request }) => {
            try {
                const forwardedHeaders = createForwardedHeaders(request);
                const driver = axios.create({
                    headers: forwardedHeaders,
                });

                const { code, raw } = await authClient.signUpWithIdentifier({
                    email: body.email,
                    username: body.username,
                    password: body.password,
                    driver,
                });

                if (code === 200 && raw.token) {
                    await setOtpTokenCookie(raw.token);

                    return {
                        success: true,
                        message: 'Sign up request submitted',
                        data: {
                            expiredAt: raw.expiredAt,
                            email: raw.email,
                        },
                    };
                }

                set.status = code ?? 500;

                return {
                    error: 'Sign up failed',
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
                email: t.String(),
                username: t.Optional(t.String()),
                password: t.String(),
            }),
        },
    )
    .post(
        '/sign-up/verify-otp',
        async ({ body, set, request }) => {
            try {
                const otpToken = await getOtpTokenCookie();

                if (!otpToken) {
                    set.status = 400;
                    return {
                        error: 'OTP session expired',
                        details: { id: 'otp_session_expired' },
                    };
                }

                const forwardedHeaders = createForwardedHeaders(request);
                const driver = axios.create({
                    headers: forwardedHeaders,
                });

                const { code, raw } = await authClient.signUpVerifyOTP({
                    token: otpToken,
                    otpCode: body.code,
                    driver,
                });

                if (code === 200) {
                    await clearOtpTokenCookie();

                    return {
                        success: true,
                        message: 'Sign up successful',
                    };
                }

                set.status = code === 400 ? 400 : 500;

                return {
                    error: 'OTP verification failed',
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
            }),
        },
    )
    .post(
        '/forgot-password',
        async ({ body, set, request }) => {
            try {
                const forwardedHeaders = createForwardedHeaders(request);
                const driver = axios.create({
                    headers: forwardedHeaders,
                });

                const { code, raw } = await authClient.forgotPassword({
                    email: body.email,
                    newPassword: body.newPassword,
                    driver,
                });

                if (code === 200 && raw.token) {
                    await setOtpTokenCookie(raw.token);

                    return {
                        success: true,
                        message: 'Forgot password request submitted',
                        data: {
                            expiredAt: raw.expiredAt,
                            email: raw.email,
                        },
                    };
                }

                set.status = code ?? 500;

                return {
                    error: 'Forgot password failed',
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
                email: t.String(),
                newPassword: t.String(),
            }),
        },
    )
    .post(
        '/forgot-password/verify-otp',
        async ({ body, set, request }) => {
            try {
                const otpToken = await getOtpTokenCookie();

                if (!otpToken) {
                    set.status = 400;
                    return {
                        error: 'OTP session expired',
                        details: { id: 'otp_session_expired' },
                    };
                }

                const forwardedHeaders = createForwardedHeaders(request);
                const driver = axios.create({
                    headers: forwardedHeaders,
                });

                const { code, raw } = await authClient.forgotPasswordVerifyOTP({
                    token: otpToken,
                    otpCode: body.code,
                    driver,
                });

                if (code === 200) {
                    await clearOtpTokenCookie();

                    return {
                        success: true,
                        message: 'Password reset successful',
                    };
                }

                set.status = code === 400 ? 400 : 500;

                return {
                    error: 'OTP verification failed',
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
            }),
        },
    )
    .post('/logout', async ({ set }) => {
        try {
            await clearSessionCookies();
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
    });

export const GET = auth.fetch;
export const POST = auth.fetch;
