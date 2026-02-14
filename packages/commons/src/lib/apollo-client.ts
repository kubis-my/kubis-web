import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';
import { Observable } from '@apollo/client/utilities';
import { getCsrfToken } from '../utils/csrf-client';

// Store multiple Apollo Client instances by URI
const apolloClients: Map<string, ApolloClient> = new Map();

/**
 * Create a new Apollo Client instance
 * Uses Next.js API proxy for authenticated requests (tokens in httpOnly cookies)
 *
 * @param useProxy - If true, uses /api/graphql proxy (for authenticated requests)
 *                   If false, connects directly to external service (for public queries)
 */
function createApolloClient(useProxy: boolean = true) {
    // Use proxy endpoint for authenticated requests (handles tokens server-side)
    // Or direct connection for public/unauthenticated queries
    const uri = useProxy ? '/api/graphql' : '';

    const httpLink = new HttpLink({
        uri,
        credentials: 'include', // Send cookies with requests
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

    // CSRF token injection link
    const csrfLink = new ApolloLink((operation, forward) => {
        const csrfToken = getCsrfToken();

        if (csrfToken) {
            operation.setContext(({ headers = {} }) => ({
                headers: {
                    ...headers,
                    'X-CSRF-Token': csrfToken,
                },
            }));
        }

        return forward(operation);
    });

    return new ApolloClient({
        link: ApolloLink.from([errorLink, csrfLink, httpLink]),
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
 * Get or create an Apollo Client instance
 * Uses httpOnly cookie-based authentication via Next.js API proxy
 *
 * @returns Apollo Client instance
 */
export function getApolloClient() {
    const isServer = typeof window === 'undefined';
    const clientKey = 'default';

    if (isServer) {
        // Always create a new client for SSR
        return createApolloClient(true);
    }

    // Reuse client on the client-side
    if (!apolloClients.has(clientKey)) {
        apolloClients.set(clientKey, createApolloClient(true));
    }

    return apolloClients.get(clientKey)!;
}

/**
 * Reset the Apollo Client cache
 * Useful after logout or when authentication state changes
 */
export function resetApolloClient() {
    apolloClients.forEach((client) => {
        client.clearStore();
    });
}

/**
 * Completely reset Apollo Client instance
 * Creates a new client on next access and clears the cache
 */
export function reinitializeApolloClient() {
    apolloClients.clear();
    return getApolloClient();
}
