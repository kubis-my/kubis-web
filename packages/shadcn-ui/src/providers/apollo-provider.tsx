'use client';

import { ApolloProvider as BaseApolloProvider } from '@apollo/client/react';
import { getApolloClient } from '@repo/commons/lib/apollo-client';
import { ReactNode, useMemo } from 'react';

interface ApolloProviderProps {
    children: ReactNode;
}

/**
 * Apollo Provider wrapper component
 * Provides Apollo Client to the entire application
 * Uses httpOnly cookie-based authentication via Next.js API proxy
 *
 * @example
 * <ApolloProvider>
 *   {children}
 * </ApolloProvider>
 */
export function ApolloProvider({ children }: ApolloProviderProps) {
    const client = useMemo(() => getApolloClient(), []);

    return <BaseApolloProvider client={client}>{children}</BaseApolloProvider>;
}
