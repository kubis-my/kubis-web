export const hasGraphQLError = (error: unknown): error is {
    errors?: Array<{ message: string; extensions?: Record<string, unknown> }>;
    graphQLErrors?: Array<{ message: string; extensions?: Record<string, unknown> }>;
} => {
    if (typeof error !== 'object' || error === null) return false;
    const err = error as { errors?: unknown; graphQLErrors?: unknown };
    return (
        (Array.isArray(err.errors) && err.errors.length > 0) ||
        (Array.isArray(err.graphQLErrors) && err.graphQLErrors.length > 0)
    );
};