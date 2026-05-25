'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Loader from '../custom-components/loader';
import { authClient } from '@repo/commons/lib/auth-client';
import { setToken, ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@repo/commons/utils/storage-helpers';

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
    };

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const exchangeHandler = async () => {
            const hashParams = new URLSearchParams(window.location.hash.slice(1));
            const codeVerifier = getCodeVerifier(hashParams);
            const code = params.get('code');
            const clientId = params.get('clientId');
            const redirectUri = params.get('redirectUri');

            if (!codeVerifier || !code || !clientId || !redirectUri) {
                setInitial(false);
                setIsChecking(false);
                return;
            }

            try {
                const { code: responseCode, raw } = await authClient.exchangeCodeForTokens({
                    code,
                    clientId,
                    redirectUri,
                    codeVerifier,
                });

                if (responseCode === 200 && raw.accessToken && raw.refreshToken) {
                    setToken(ACCESS_TOKEN_KEY, raw.accessToken);
                    setToken(REFRESH_TOKEN_KEY, raw.refreshToken);

                    sessionStorage.removeItem('pkce_verifier');
                    sessionStorage.removeItem('oauth_state');
                    sessionStorage.setItem('token_exchange_complete', 'true');

                    window.history.replaceState({}, document.title, window.location.pathname);
                }
            } catch (error) {
                console.error('Token exchange failed:', error);
            }

            // Set flags to render children, avoid router navigation
            setInitial(false);
            setIsChecking(false);
        };

        exchangeHandler();
    }, [params, pathname, router]);

    if (isInitial || isChecking) return <Loader />;

    return children;
}
