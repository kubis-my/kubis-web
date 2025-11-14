'use client';

import { ApolloProvider as BaseApolloProvider } from '@apollo/client/react';
import { getApolloClient } from '@repo/commons/lib/apollo-client';
import { ReactNode, useMemo } from 'react';

interface ApolloProviderProps {
  children: ReactNode;
  /**
   * GraphQL endpoint URI
   * If not provided, uses NEXT_PUBLIC_ACCOUNT_GRAPHQL_URL from environment
   *
   * @example
   * <ApolloProvider uri="https://api.example.com/graphql">
   *   {children}
   * </ApolloProvider>
   */
  uri: string;
}

/**
 * Apollo Provider wrapper component
 * Provides Apollo Client to the entire application
 *
 * @example
 * // Use default URI from environment
 * <ApolloProvider>
 *   {children}
 * </ApolloProvider>
 *
 * @example
 * // Use custom URI for a specific service
 * <ApolloProvider uri="https://api.myservice.com/graphql">
 *   {children}
 * </ApolloProvider>
 */
export function ApolloProvider({ children, uri }: ApolloProviderProps) {
  const client = useMemo(() => getApolloClient(uri), [uri]);

  return <BaseApolloProvider client={client}>{children}</BaseApolloProvider>;
}
