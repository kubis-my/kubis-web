'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { checkCurrentCredential } from "@repo/commons/actions/check-current-credential"

type AuthUser = {
    username: string
    email: string
}
interface AuthContextType {
    isAuthenticated: boolean;
    authUser: AuthUser | undefined
    isLoading: boolean;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [authUser, setAuthUser] = useState<AuthUser | undefined>(undefined);

    const router = useRouter();

    const logout = () => {
        // Clear cookies (backend should provide logout endpoint)
        fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include',
        }).finally(() => {
            setIsAuthenticated(false);
            router.push('/');
        });
    };

    useEffect(() => {
        let mounted = true;
        let timeoutId: NodeJS.Timeout;

        const initAuth = async () => {
            // If we just completed token exchange, wait a moment for cookies to be set
            const justExchanged = sessionStorage.getItem('token_exchange_complete');
            if (justExchanged) {
                await new Promise(resolve => setTimeout(resolve, 500));
                sessionStorage.removeItem('token_exchange_complete');
            }

            // Set a timeout to prevent infinite loading
            timeoutId = setTimeout(() => {
                if (mounted) {
                    setIsLoading(false);
                    setIsAuthenticated(false);
                }
            }, 10000);

            try {
                const res = await checkCurrentCredential();
                const isAuth = res !== undefined;

                if (mounted) {
                    clearTimeout(timeoutId);
                    setIsAuthenticated(isAuth);
                    if (res) {
                        setAuthUser(res);
                    }
                    setIsLoading(false);
                }
            } catch (error) {
                if (mounted) {
                    clearTimeout(timeoutId);
                    setIsAuthenticated(false);
                    setIsLoading(false);
                }
            }
        };

        initAuth();

        return () => {
            mounted = false;
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [])

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, logout, authUser }}>
            {!isLoading && children}
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