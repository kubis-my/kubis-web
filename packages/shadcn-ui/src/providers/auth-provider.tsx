'use client';

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Loader from '../custom-components/loader';
import { hasGraphQLError } from '@repo/commons/utils/graphql';
import { gql, TypedDocumentNode } from '@apollo/client';
import { User } from '@repo/commons/types/account-service-schema.type';
import { useQuery } from '@apollo/client/react';
import { authClient } from '@repo/commons/lib/auth-client';
import {
    getToken,
    setToken,
    clearAllTokens,
    ACCESS_TOKEN_KEY,
    REFRESH_TOKEN_KEY,
} from '@repo/commons/utils/storage-helpers';

const GET_AUTH_USER: TypedDocumentNode<{ getAuthUser: User }> = gql`
    query GetAuthUser {
        getAuthUser {
            publicId
            firstName
            lastName
            nickname
            displayName
            profilePicture
            companies {
                publicId
                name
                isSuperAdmin
            }
            userAccounts {
                publicId
                branch {
                    publicId
                    name
                    code
                    isActive
                }
                companyEmployee {
                    company {
                        publicId
                    }
                }
            }
            credential {
                publicId
                email
                username
            }
        }
    }
`;

interface AuthContextType {
    isAuthenticated: boolean;
    accessToken: string | null;
    authUser: User | undefined;
    isLoading: boolean;
    hasIncompleteProfile: boolean;
    logout: () => Promise<void>;
    authorize: () => Promise<void>;
    updateAuthUser: (user: User | undefined) => void;
    profileSetupCompleted: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [authUser, setAuthUser] = useState<User | undefined>(undefined);
    const [hasIncompleteProfile, setHasIncompleteProfile] = useState(false);

    const router = useRouter();

    const { data: userData, error: userError } = useQuery(GET_AUTH_USER, {
        skip: !isAuthenticated,
    });

    const authorizationPromiseRef = useRef<Promise<void> | null>(null);

    const logout = useCallback(async () => {
        try {
            const refreshToken = getToken(REFRESH_TOKEN_KEY);
            if (refreshToken) {
                await authClient.signOut({ refreshToken });
            }
        } finally {
            clearAllTokens();
            setAccessToken(null);
            setIsAuthenticated(false);
            setAuthUser(undefined);
            router.push('/');
        }
    }, [router]);

    const authorize = useCallback(async () => {
        if (authorizationPromiseRef.current) {
            return authorizationPromiseRef.current;
        }

        const authPromise = (async () => {
            try {
                const refreshToken = getToken(REFRESH_TOKEN_KEY);

                if (!refreshToken) {
                    setAccessToken(null);
                    setIsAuthenticated(false);
                    setAuthUser(undefined);
                    return;
                }

                const { code, raw } = await authClient.refresh({ refreshToken });

                if (code === 200 && raw.token) {
                    setToken(ACCESS_TOKEN_KEY, raw.token);
                    if (raw.refreshToken) {
                        setToken(REFRESH_TOKEN_KEY, raw.refreshToken);
                    }

                    const token = raw.token;
                    const { code: validateCode, raw: validateRaw } = await authClient.validate({
                        token,
                    });

                    if (validateCode === 200 && validateRaw.valid) {
                        setAccessToken(token);
                        setIsAuthenticated(true);
                        return;
                    }
                }

                clearAllTokens();
                setAccessToken(null);
                setIsAuthenticated(false);
                setAuthUser(undefined);
            } catch (error) {
                console.error('Authorization error:', error);
                setAccessToken(null);
                setIsAuthenticated(false);
                setAuthUser(undefined);
            } finally {
                authorizationPromiseRef.current = null;
            }
        })();

        authorizationPromiseRef.current = authPromise;
        return authPromise;
    }, []);

    const updateAuthUser = (user: User | undefined) => {
        setAuthUser(user);
    };

    const profileSetupCompleted = () => {
        setHasIncompleteProfile(false);
    };

    useEffect(() => {
        if (userData?.getAuthUser) {
            setAuthUser(userData.getAuthUser);
        }
    }, [userData]);

    useEffect(() => {
        if (!userError) return;

        if (hasGraphQLError(userError)) {
            const gqlError = userError.errors?.[0] || userError.graphQLErrors?.[0];

            if (gqlError) {
                const errorCode = gqlError.extensions?.code as string | undefined;

                if (errorCode === 'AUTH_USER_NOT_FOUND') {
                    setHasIncompleteProfile(true);
                }
            }
        }
    }, [userError]);

    useEffect(() => {
        if (!isAuthenticated) return;

        const REFRESH_INTERVAL = 25 * 60 * 1000;
        const refreshInterval = setInterval(async () => {
            await authorize();
        }, REFRESH_INTERVAL);

        return () => {
            clearInterval(refreshInterval);
        };
    }, [isAuthenticated, authorize]);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleVisibilityChange = async () => {
            if (document.visibilityState === 'visible' && isAuthenticated) {
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
            const justExchanged =
                typeof window !== 'undefined'
                    ? sessionStorage.getItem('token_exchange_complete')
                    : null;

            if (justExchanged) {
                await new Promise((resolve) => setTimeout(resolve, 500));
                if (typeof window !== 'undefined') {
                    sessionStorage.removeItem('token_exchange_complete');
                }
            }

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
    }, [authorize]);

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                accessToken,
                isLoading,
                authUser,
                hasIncompleteProfile,
                logout,
                authorize,
                updateAuthUser,
                profileSetupCompleted,
            }}
        >
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
