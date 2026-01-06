import { Elysia, t } from 'elysia'
import axios from 'axios';
import { authClient } from '@repo/commons/lib/auth-client';
import { clearCsrfTokenCookie, clearSessionCookies, getSessionTokenCookie, setCsrfTokenCookie, setSessionTokenCookie } from '@repo/commons/utils/cookie-helpers';
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

                if (code === 200 && raw.sessionToken) {
                    await setSessionTokenCookie(raw.sessionToken);

                    // Generate CSRF token for new session
                    const csrfToken = generateCsrfToken();
                    await setCsrfTokenCookie(csrfToken);

                    await new Promise(resolve => setTimeout(resolve, 500));

                    return {
                        success: true,
                        message: 'Sign in successful',
                        data: {
                            redirectUrl: raw.redirectUrl,
                            verifier: raw.verifier,
                        }
                    }
                }

                set.status = code === 400 ? 400 : 500

                return {
                    error: 'Sign in failed',
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
                identifier: t.String(),
                password: t.String(),
                clientId: t.String(),
                redirectUri: t.String(),
            }),
        }
    )
    .post(
        '/authorize',
        async ({ body, set, request }) => {
            try {
                const sessionToken = await getSessionTokenCookie() ?? "invalid-token";
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
                        }
                    }
                }

                set.status = code === 400 ? 400 : 500

                return {
                    error: 'Authorization failed',
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
                clientId: t.String(),
                redirectUri: t.String(),
                codeChallenge: t.String(),
                scope: t.Optional(t.String()),
                state: t.Optional(t.String()),
            }),
        }
    )
    .get(
        '/session',
        async ({ set, request }) => {
            try {
                const sessionToken = await getSessionTokenCookie() ?? "invalid-token";
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
                    }
                }

                set.status = 403;
                return {
                    authenticated: false,
                    message: 'Invalid or expired session',
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
        "/logout",
        async ({ set }) => {
            try {
                await clearSessionCookies();
                await clearCsrfTokenCookie();

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

export const GET = auth.fetch
export const POST = auth.fetch
