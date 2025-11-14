"use client";

import { useEffect, useState } from "react";
import Loader from "../custom-components/loader";
import { useAuth } from "../providers/auth-provider";
import { generateCodeChallenge, generateCodeVerifier, generateState } from "@repo/commons/utils/pkce";
import { SSO_APP_BASE_URL } from "@repo/commons/constant/base";
import ProfileSetup from "../custom-components/profile-setup";

export default function AuthGuard({ children, baseUrl, clientId }: { children: React.ReactNode, baseUrl: string, clientId: string }) {
    const ctx = useAuth()

    const [isAuthenticating, setIsAuthenticating] = useState(true);

    const handleSSO = async () => {
        if (ctx.isAuthenticated) return;

        const codeVerifier = generateCodeVerifier();
        const codeChallenge = await generateCodeChallenge(codeVerifier);
        const state = generateState();

        sessionStorage.setItem('pkce_verifier', codeVerifier);
        sessionStorage.setItem('oauth_state', state);

        const params = new URLSearchParams({
            clientId: clientId,
            redirectUri: baseUrl + window.location.pathname,
            codeChallenge: codeChallenge,
            state,
        });

        window.location.href = `${SSO_APP_BASE_URL}/oauth/authorize?${params}`
    }

    useEffect(() => {
        handleSSO().finally(() => {
            setIsAuthenticating(false)
        })
    }, [])

    if (isAuthenticating) return <Loader />
    if (ctx.hasIncompleteProfile) return <ProfileSetup onSuccess={(user) => {
        ctx.updateAuthUser(user)
        ctx.profileSetupCompleted()
    }} />

    return children;
}
