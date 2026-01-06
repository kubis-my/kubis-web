'use client';

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Loader from '../custom-components/loader';
import { hasGraphQLError } from "@repo/commons/utils/graphql"
import { gql, TypedDocumentNode } from '@apollo/client';
import { User } from '@repo/commons/types/account-service-schema.type';
import { useQuery } from '@apollo/client/react';
import { getCsrfHeaders } from "@repo/commons/utils/csrf-client";

const GET_AUTH_USER: TypedDocumentNode<{ getAuthUser: User }> = gql`
    query GetAuthUser {
        getAuthUser {
            publicId
            firstName
            lastName
            nickname
            displayName
            profilePicture
            bod
            gender
            createdAt
            updatedAt
            companies {
                publicId
                name
                registrationNo
                isUnclassified
                logo
            }
            credential{
                publicId
                email
                username
            }
        }
    }
`;

interface AuthContextType {
    isAuthenticated: boolean;
    authUser: User | undefined
    isLoading: boolean;
    hasIncompleteProfile: boolean
    logout: () => Promise<void>;
    authorize: () => Promise<void>
    updateAuthUser: (user: User | undefined) => void
    profileSetupCompleted: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [authUser, setAuthUser] = useState<User | undefined>(undefined);
    const [hasIncompleteProfile, setHasIncompleteProfile] = useState(false);

    const router = useRouter();

    // Fetch user data from GraphQL only when authenticated
    const { data: userData, error: userError } = useQuery(GET_AUTH_USER, { skip: !isAuthenticated });

    // Track ongoing authorization to prevent race conditions
    const authorizationPromiseRef = useRef<Promise<void> | null>(null);

    const logout = useCallback(async () => {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                headers: getCsrfHeaders(),
                credentials: 'include',
            });
        } finally {
            setIsAuthenticated(false);
            setAuthUser(undefined);
            router.push('/');
        }
    }, [router]);

    const authorize = useCallback(async () => {
        // If authorization is already in progress, wait for it to complete
        if (authorizationPromiseRef.current) {
            return authorizationPromiseRef.current;
        }

        // Create new authorization promise
        const authPromise = (async () => {
            try {
                // Attempt to refresh tokens via API endpoint
                const refreshResponse = await fetch('/api/auth/refresh', {
                    method: 'POST',
                    headers: getCsrfHeaders(),
                    credentials: 'include',
                });

                if (refreshResponse.ok) {
                    // Small delay to ensure cookies are set
                    await new Promise(resolve => setTimeout(resolve, 500));

                    // Validate session via API endpoint
                    const sessionResponse = await fetch('/api/auth/session', {
                        method: 'GET',
                        credentials: 'include',
                    });

                    if (sessionResponse.ok) {
                        const sessionData = await sessionResponse.json();

                        if (sessionData.authenticated) {
                            setIsAuthenticated(true);
                            // User data will be fetched via GraphQL query
                            return;
                        }
                    }
                }

                // Refresh or validation failed
                setIsAuthenticated(false);
                setAuthUser(undefined);
            } catch (error) {
                console.error('Authorization error:', error);
                setIsAuthenticated(false);
                setAuthUser(undefined);
            } finally {
                // Clear the promise reference when done
                authorizationPromiseRef.current = null;
            }
        })();

        authorizationPromiseRef.current = authPromise;
        return authPromise;
    }, []);

    const updateAuthUser = (user: User | undefined) => {
        setAuthUser(user)
    }

    const profileSetupCompleted = () => {
        setHasIncompleteProfile(false)
    }

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

    // Periodic token refresh - refresh every 25 minutes (before 30-minute expiration)
    useEffect(() => {
        if (!isAuthenticated) return;

        const REFRESH_INTERVAL = 25 * 60 * 1000; // 25 minutes in milliseconds
        const refreshInterval = setInterval(async () => {
            await authorize();
        }, REFRESH_INTERVAL);

        return () => {
            clearInterval(refreshInterval);
        };
    }, [isAuthenticated, authorize]);

    // Validate session when user returns to tab/window
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleVisibilityChange = async () => {
            if (document.visibilityState === 'visible' && isAuthenticated) {
                // Re-validate session when tab becomes visible
                await authorize();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [isAuthenticated, authorize]);

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
        <AuthContext.Provider value={
            {
                isAuthenticated,
                isLoading,
                authUser,
                hasIncompleteProfile,
                logout,
                authorize,
                updateAuthUser,
                profileSetupCompleted
            }
        }>
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