'use client';

import { SSO_APP_BASE_URL } from '@repo/commons/constant/base';
import React, { useEffect } from 'react';
import { authClient } from '@repo/commons/lib/auth-client';
import { getToken, clearToken, SESSION_TOKEN_KEY } from '@repo/commons/utils/storage-helpers';

export default function RedirectAuthorize({
    children,
    ...input
}: {
    clientId: string;
    redirectUri: string;
    codeChallenge: string;
    scope?: string;
    state?: string;
    children: React.ReactNode;
}) {
    useEffect(() => {
        const authorize = async () => {
            try {
                const sessionToken = getToken(SESSION_TOKEN_KEY);

                if (!sessionToken) {
                    throw new Error('No session token');
                }

                const { code, raw } = await authClient.redirectAuthorize({
                    sessionToken,
                    clientId: input.clientId,
                    redirectUri: input.redirectUri,
                    codeChallenge: input.codeChallenge,
                    scope: input.scope,
                    state: input.state,
                });

                if (code === 200 && raw.redirectUrl) {
                    window.location.replace(raw.redirectUrl);
                    return;
                }

                throw new Error('Authorization failed');
            } catch (error) {
                console.error('OAuth authorization error:', error);

                clearToken(SESSION_TOKEN_KEY);

                const signInUrl = new URL(`${SSO_APP_BASE_URL}/sign-in`);
                signInUrl.searchParams.set('client_id', input.clientId);
                signInUrl.searchParams.set('redirect_uri', input.redirectUri);
                window.location.replace(signInUrl.toString());
            }
        };

        authorize();
    }, [input]);

    return children;
}
