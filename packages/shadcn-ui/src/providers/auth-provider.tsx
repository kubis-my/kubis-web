'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { secureTokenStorage } from "@repo/commons/utils/secure-token-storage";
import { authClient } from '@repo/commons/lib/auth-client';
import Loader from '../custom-components/loader';
import { initEncryption } from '@repo/commons/utils/token-encryption';
import { useAuthUser, User } from '@repo/commons/hooks/use-graphql-user';
import { hasGraphQLError } from "@repo/commons/utils/graphql"

interface AuthContextType {
    isAuthenticated: boolean;
    authUser: User | undefined
    isLoading: boolean;
    logout: () => Promise<void>;
    authorize: () => Promise<void>
    hasIncompleteProfile: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [authUser, setAuthUser] = useState<User | undefined>(undefined);
    const [hasIncompleteProfile, setHasIncompleteProfile] = useState(false);

    const router = useRouter();

    // Fetch user data from GraphQL only when authenticated
    const { data: userData, error: userError } = useAuthUser({ skip: !isAuthenticated });

    const logout = useCallback(async () => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include',
            });
        } catch {
            // Silently handle logout errors - we'll clear local state anyway
        } finally {
            // Clear local tokens and state regardless of backend response
            secureTokenStorage.clearTokens();
            setIsAuthenticated(false);
            setAuthUser(undefined);
            router.push('/');
        }
    }, [router]);

    const authorize = useCallback(async () => {
        try {
            await initEncryption();

            const refreshToken = await secureTokenStorage.getRefreshToken();
            let isRefreshed = false;

            if (refreshToken) {
                const { code, raw } = await authClient.refresh({ refreshToken });

                if (code === 200) {
                    const { refreshToken: newRefreshToken, token } = raw;

                    await secureTokenStorage.updateTokensAfterRefresh(token, newRefreshToken);
                    isRefreshed = true;
                } else {
                    // Token refresh failed, clear tokens
                    secureTokenStorage.clearTokens();
                    setIsAuthenticated(false);
                    setAuthUser(undefined);
                }
            }

            if (isRefreshed) {
                // Small delay to ensure token storage is fully updated
                await new Promise(resolve => setTimeout(resolve, 500));
                const currentAccessToken = await secureTokenStorage.getAccessToken();

                if (currentAccessToken) {
                    const { code, raw } = await authClient.validate({ token: currentAccessToken });

                    if (raw.valid && code === 200) {
                        setIsAuthenticated(true);
                        // User data will be fetched via GraphQL query
                    } else {
                        // Token validation failed
                        secureTokenStorage.clearTokens();
                        setAuthUser(undefined);
                        setIsAuthenticated(false);
                    }
                }
            } else {
                setAuthUser(undefined);
                setIsAuthenticated(false);
            }
        } catch (error) {
            secureTokenStorage.clearTokens();
            setAuthUser(undefined);
            setIsAuthenticated(false);
        }
    }, []);

    // Set user data from GraphQL when available
    useEffect(() => {
        if (userData?.getAuthUser) {
            setAuthUser(userData.getAuthUser);
        }
    }, [userData]);

    // Handle GraphQL errors and auth failures
    useEffect(() => {
        if (!userError) return;

        if (hasGraphQLError(userError)) {
            // Check both 'errors' and 'graphQLErrors' properties
            const gqlError = (userError.errors?.[0] || userError.graphQLErrors?.[0]);

            if (gqlError) {
                const errorCode = gqlError.extensions?.code as string | undefined;

                if (errorCode === 'AUTH_USER_NOT_FOUND') {
                    setHasIncompleteProfile(true)
                }
            }
        }
    }, [userError]);

    useEffect(() => {
        let mounted = true;
        let timeoutId: NodeJS.Timeout;

        const initAuth = async () => {
            // Check if we just completed token exchange (SSR-safe)
            const justExchanged = typeof window !== 'undefined'
                ? sessionStorage.getItem('token_exchange_complete')
                : null;

            if (justExchanged) {
                // Wait for token storage to complete after OAuth exchange
                await new Promise(resolve => setTimeout(resolve, 500));
                if (typeof window !== 'undefined') {
                    sessionStorage.removeItem('token_exchange_complete');
                }
            }

            // Set a timeout to prevent infinite loading
            timeoutId = setTimeout(() => {
                if (mounted) {
                    setIsLoading(false);
                    setIsAuthenticated(false);
                }
            }, 10000);

            await authorize();
        };

        initAuth().finally(() => {
            if (mounted) {
                clearTimeout(timeoutId);
                setIsLoading(false);
            }
        });

        return () => {
            mounted = false;
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [authorize])

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, logout, authUser, authorize, hasIncompleteProfile }}>
            {isLoading ? <Loader /> : children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}