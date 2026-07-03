import { ApolloClient, InMemoryCache, HttpLink, ApolloLink, TypePolicies } from '@apollo/client';
import { Observable } from '@apollo/client/utilities';
import { env } from '../constant/env';
import { getToken, ACCESS_TOKEN_KEY } from '../utils/storage-helpers';

declare module '@apollo/client' {
    namespace ApolloClient {
        namespace DeclareDefaultOptions {
            interface WatchQuery {
                errorPolicy: 'all';
            }
            interface Query {
                errorPolicy: 'all';
            }
            interface Mutate {
                errorPolicy: 'all';
            }
        }
    }
}

const apolloClients: Map<string, ApolloClient> = new Map();

function createApolloClient(uri: string, typePolicies: TypePolicies = {}) {
    const httpLink = new HttpLink({
        uri,
        credentials: 'include',
    });

    const authLink = new ApolloLink((operation, forward) => {
        const token = getToken(ACCESS_TOKEN_KEY);
        if (token) {
            operation.setContext({ headers: { Authorization: `Bearer ${token}` } });
        }
        return forward(operation);
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
        link: ApolloLink.from([authLink, errorLink, httpLink]),
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
    return getOrCreateClient('account', env.NEXT_PUBLIC_ACCOUNT_SERVICE_GRAPHQL_URL);
}

export function getOpsApolloClient() {
    return getOrCreateClient('ops', env.NEXT_PUBLIC_OPS_SERVICE_GRAPHQL_URL);
}

export function getForgeApolloClient() {
    return getOrCreateClient('forge', env.NEXT_PUBLIC_FORGE_SERVICE_GRAPHQL_URL, {
        Project: { keyFields: ['publicId'] },
        ProjectSetting: { keyFields: ['publicId'] },
        ProjectSubscription: { keyFields: ['publicId'] },
        Plan: { keyFields: ['publicId'] },
        AddOn: { keyFields: ['publicId'] },
        Query: {
            fields: {
                getProjectsForForge: {
                    merge: false,
                },
            },
        },
    });
}

export function resetApolloClient() {
    apolloClients.forEach((client) => {
        client.clearStore();
    });
}

export function reinitializeApolloClient() {
    apolloClients.clear();
    return getApolloClient();
}
