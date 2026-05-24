import { ApolloClient, InMemoryCache, HttpLink, ApolloLink, TypePolicies } from '@apollo/client';
import { Observable } from '@apollo/client/utilities';

// Store multiple Apollo Client instances by URI
const apolloClients: Map<string, ApolloClient> = new Map();

function createApolloClient(uri: string, typePolicies: TypePolicies = {}) {
    const httpLink = new HttpLink({
        uri,
        credentials: 'include',
    });

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
        link: ApolloLink.from([errorLink, httpLink]),
        cache: new InMemoryCache({ typePolicies }),
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

function getOrCreateClient(key: string, uri: string, typePolicies: TypePolicies = {}): ApolloClient {
    if (typeof window === 'undefined') return createApolloClient(uri, typePolicies);

    if (!apolloClients.has(key)) {
        apolloClients.set(key, createApolloClient(uri, typePolicies));
    }

    return apolloClients.get(key)!;
}

export function getApolloClient() {
    return getOrCreateClient('account', '/api/graphql');
}

export function getForgeApolloClient() {
    return getOrCreateClient('forge', '/api/app/graphql', {
        Project: { keyFields: ['publicId'] },
    });
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
