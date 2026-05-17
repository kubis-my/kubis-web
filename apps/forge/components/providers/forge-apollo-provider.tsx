'use client';

import { ApolloProvider } from '@apollo/client/react';
import { getForgeApolloClient } from '@repo/commons/lib/apollo-client';
import { useMemo } from 'react';

export function ForgeApolloProvider({ children }: { children: React.ReactNode }) {
    const client = useMemo(() => getForgeApolloClient(), []);

    return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
