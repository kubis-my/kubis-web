'use client';

import { SSO_APP_BASE_URL } from '@repo/commons/constant/base';
import { getCsrfHeaders } from '@repo/commons/utils/csrf-client';
import React, { useEffect } from 'react';

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
                const response = await fetch('/api/auth/authorize', {
                    method: 'POST',
                    headers: getCsrfHeaders({
                        'Content-Type': 'application/json',
                    }),
                    credentials: 'include',
                    body: JSON.stringify({
                        clientId: input.clientId,
                        redirectUri: input.redirectUri,
                        codeChallenge: input.codeChallenge,
                        scope: input.scope,
                        state: input.state,
                    }),
                });

                const data = await response.json();

                // Successful authorization - redirect to client app
                if (response.ok && data.success) {
                    window.location.replace(data.data.redirectUrl);
                    return;
                }

                // Authorization failed - redirect to sign-in
                throw new Error('Authorization failed');
            } catch (error) {
                // On any error: logout first, then redirect to sign-in
                console.error('OAuth authorization error:', error);

                try {
                    await fetch('/api/auth/logout', {
                        method: 'POST',
                        headers: getCsrfHeaders(),
                        credentials: 'include',
                    });
                } catch (logoutError) {
                    console.error('Logout error:', logoutError);
                }

                window.location.replace(`${SSO_APP_BASE_URL}/sign-in`);
            }
        };

        authorize();
    }, [input]);

    return children;
}
