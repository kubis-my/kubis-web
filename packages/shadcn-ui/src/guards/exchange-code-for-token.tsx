"use client";

import { MAIN_CLIENT_ID } from '@repo/commons/constant/client-id';
import { authClient } from '@repo/commons/lib/auth-client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react'
import Loader from '../custom-components/loader';
import { secureTokenStorage } from "@repo/commons/utils/secure-token-storage";

export default function ExchangeCodeForToken({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const params = useSearchParams();

    const [isChecking, setIsChecking] = useState(true);
    const [isInitial, setInitial] = useState(true);
    const hasRun = React.useRef(false);

    const getCodeVerifier = (hashParams: URLSearchParams) => {
        const pkce_verifier = sessionStorage.getItem('pkce_verifier');

        return hashParams.get('verifier') ?? pkce_verifier ?? undefined;
    }

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const exchangeHandler = async () => {
            const hashParams = new URLSearchParams(window.location.hash.slice(1));
            const codeVerifier = getCodeVerifier(hashParams);
            const code = params.get("code");
            const clientId = params.get("clientId")
            const redirectUri = params.get("redirectUri")

            if (!codeVerifier || !code || !clientId || !redirectUri) {
                setInitial(false);
                setIsChecking(false);
                return;
            }

            const res = await authClient.exchangeCodeForTokens({
                code,
                clientId,
                redirectUri,
                codeVerifier
            })

            if (res.code === 200) {
                const { accessToken, refreshToken } = res.raw

                secureTokenStorage.setTokens(accessToken, refreshToken)

                sessionStorage.removeItem('pkce_verifier');
                sessionStorage.removeItem('oauth_state');

                // Mark exchange as complete before rendering children
                sessionStorage.setItem('token_exchange_complete', 'true');

                // Clean URL first without causing navigation
                window.history.replaceState({}, document.title, window.location.pathname);
            }

            // Set flags to render children, avoid router navigation
            setInitial(false);
            setIsChecking(false);
        };

        exchangeHandler()
    }, [params, pathname, router])


    if (isInitial || isChecking) return <Loader />

    return children
}
