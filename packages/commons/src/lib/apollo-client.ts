import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';
import { Observable } from '@apollo/client/utilities';
import { secureTokenStorage } from '../utils/secure-token-storage';
import { initEncryption } from '../utils/token-encryption';

// Store multiple Apollo Client instances by URI
const apolloClients: Map<string, ApolloClient> = new Map();

/**
 * Create a new Apollo Client instance for a specific GraphQL endpoint
 */
function createApolloClient(uri: string) {
  const httpLink = new HttpLink({
    uri,
    credentials: 'include',
  });

  // Auth link that adds the access token to every request
  const authLink = new ApolloLink((operation, forward) => {
    return new Observable((observer) => {
      (async () => {
        try {
          await initEncryption();
          const token = await secureTokenStorage.getAccessToken();

          if (token) {
            operation.setContext(({ headers = {} }) => ({
              headers: {
                ...headers,
                authorization: `Bearer ${token}`,
              },
            }));
          }
        } catch (error) {
          console.error('Failed to get access token for GraphQL request:', error);
        }

        const subscription = forward(operation).subscribe({
          next: observer.next.bind(observer),
          error: observer.error.bind(observer),
          complete: observer.complete.bind(observer),
        });

        return () => subscription.unsubscribe();
      })();
    });
  });

  // Error handling link
  const errorLink = new ApolloLink((operation, forward) => {
    return new Observable((observer) => {
      const subscription = forward(operation).subscribe({
        next: (result) => {
          observer.next(result);
        },
        error: (networkError) => {
          console.error('[Network error]:', networkError);
          observer.error(networkError);
        },
        complete: observer.complete.bind(observer),
      });

      return () => subscription.unsubscribe();
    });
  });

  return new ApolloClient({
    link: ApolloLink.from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'all',
      },
      query: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
      },
      mutate: {
        errorPolicy: 'all',
      },
    },
  });
}

/**
 * Get or create an Apollo Client instance for a specific GraphQL endpoint
 *
 * @param uri - The GraphQL endpoint URL. If not provided, uses NEXT_PUBLIC_ACCOUNT_GRAPHQL_URL from env
 * @returns Apollo Client instance for the specified URI
 *
 * @example
 * // Use default URI from environment
 * const client = getApolloClient();
 *
 * @example
 * // Use custom URI for a different service
 * const client = getApolloClient('https://api.example.com/graphql');
 */
export function getApolloClient(uri: string) {
  const isServer = typeof window === 'undefined';

  if (isServer) {
    // Always create a new client for SSR
    return createApolloClient(uri);
  }

  // Reuse client on the client-side for the same URI
  if (!apolloClients.has(uri)) {
    apolloClients.set(uri, createApolloClient(uri));
  }

  return apolloClients.get(uri)!;
}

/**
 * Reset the Apollo Client cache for a specific URI
 * Useful after logout or when authentication state changes
 *
 * @param uri - Optional GraphQL endpoint URL. If not provided, clears all clients
 */
export function resetApolloClient(uri?: string) {
  if (uri) {
    const client = apolloClients.get(uri);
    if (client) {
      client.clearStore();
    }
  } else {
    // Clear all clients if no URI specified
    apolloClients.forEach((client) => {
      client.clearStore();
    });
  }
}

/**
 * Completely reset Apollo Client instance(s)
 * Creates a new client on next access and clears the cache
 *
 * @param uri - Optional GraphQL endpoint URL. If not provided, resets all clients
 */
export function reinitializeApolloClient(uri: string) {
  if (uri) {
    apolloClients.delete(uri);
    return getApolloClient(uri);
  } else {
    // Reset all clients if no URI specified
    apolloClients.clear();
    return getApolloClient(uri);
  }
}
