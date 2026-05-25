'use client';

import { useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';
import Loader from '../custom-components/loader';
import { useAuth } from '../providers/auth-provider';
import { useSocket } from '../providers/socket-provider';
import {
    generateCodeChallenge,
    generateCodeVerifier,
    generateState,
} from '@repo/commons/utils/pkce';
import { SSO_APP_BASE_URL } from '@repo/commons/constant/base';
import ProfileSetup from '../custom-components/profile-setup';

export default function AuthGuard({
    children,
    baseUrl,
    clientId,
}: {
    children: React.ReactNode;
    baseUrl: string;
    clientId: string;
}) {
    const ctx = useAuth();
    const { connect } = useSocket();
    const connectRef = useRef(connect);
    connectRef.current = connect;

    const [isAuthenticating, setIsAuthenticating] = useState(true);

    const handleSSO = async () => {
        if (ctx.isAuthenticated) {
            // User is authenticated, wait for profile status to be determined
            // Only stop authenticating when we know if profile is complete or not
            if (ctx.authUser || ctx.hasIncompleteProfile) {
                setIsAuthenticating(false);
            }
            return;
        }

        // Don't redirect if we already returned from SSO (exchange in-flight or failed)
        // Show a toast after 5s so the user knows something went wrong
        if (new URLSearchParams(window.location.search).has('code')) {
            const timeout = setTimeout(() => {
                toast.error('Authentication failed. Please refresh the page or try again.', {
                    position: 'top-center',
                });
            }, 5000);

            return () => clearTimeout(timeout);
        }

        // User is not authenticated, prepare SSO redirect
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

        // Redirect to SSO - keep showing loader during redirect
        window.location.href = `${SSO_APP_BASE_URL}/oauth/authorize?${params}`;
        // Don't set isAuthenticating to false - we're redirecting away
    };

    useEffect(() => {
        // Only run SSO check after AuthProvider has finished loading
        if (!ctx.isLoading) {
            handleSSO();
        }
    }, [ctx.isLoading, ctx.isAuthenticated, ctx.authUser, ctx.hasIncompleteProfile]);

    // Connect to socket when authenticated — pass token directly to avoid localStorage race
    useEffect(() => {
        if (ctx.isAuthenticated && ctx.accessToken) {
            connectRef.current(ctx.accessToken);
        }
    }, [ctx.isAuthenticated, ctx.accessToken]);

    // Show loader while AuthProvider is loading OR while redirecting to SSO
    if (ctx.isLoading || isAuthenticating) return <Loader />;
    if (ctx.hasIncompleteProfile)
        return (
            <ProfileSetup
                onSuccess={(user) => {
                    ctx.updateAuthUser(user);
                    ctx.profileSetupCompleted();
                }}
            />
        );

    return children;
}
