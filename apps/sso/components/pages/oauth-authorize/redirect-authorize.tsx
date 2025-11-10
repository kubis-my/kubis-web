"use client";

import { SSO_APP_BASE_URL } from "@repo/commons/constant/base";
import { authClient } from "@repo/commons/lib/auth-client";
import { secureTokenStorage } from "@repo/commons/utils/secure-token-storage";
import { initEncryption } from "@repo/commons/utils/token-encryption";
import React, { useEffect } from "react";

export default function RedirectAuthorize({ children, ...input }: {
    clientId: string
    redirectUri: string
    codeChallenge: string
    scope?: string
    state?: string,
    children: React.ReactNode
}) {

    useEffect(() => {
        const authorize = async () => {
            // Early exit if no session token exists
            if (!secureTokenStorage.hasSessionToken()) {
                secureTokenStorage.clearTokens();
                window.location.replace(`${SSO_APP_BASE_URL}/sign-in`);
                return;
            }

            try {
                // Initialize encryption and retrieve session token
                await initEncryption();
                const token = await secureTokenStorage.getSessionToken();

                // If token retrieval fails (decryption error, corrupted data, etc.)
                if (!token) {
                    throw new Error('Failed to retrieve session token');
                }

                // Attempt OAuth authorization
                const { code, raw } = await authClient.redirectAuthorize({
                    ...input,
                    sessionToken: token
                });

                // Successful authorization - redirect to client app
                if (code === 200) {
                    window.location.replace(raw.redirectUrl);
                    return;
                }

                // Authorization failed - fall through to error handling
                throw new Error('Authorization failed');
            } catch (error) {
                // On any error: clear tokens and redirect to sign-in
                console.error('OAuth authorization error:', error);
                secureTokenStorage.clearTokens();
                window.location.replace(`${SSO_APP_BASE_URL}/sign-in`);
            }
        };

        authorize();
    }, [])

    return children
}
