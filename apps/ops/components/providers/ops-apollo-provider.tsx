'use client';

import { ApolloProvider } from '@apollo/client/react';
import { getOpsApolloClient } from '@repo/commons/lib/apollo-client';
import { useMemo } from 'react';

export function OpsApolloProvider({ children }: { children: React.ReactNode }) {
    const client = useMemo(() => getOpsApolloClient(), []);

    return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
