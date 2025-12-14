import { Elysia } from 'elysia'
import { getAccessTokenCookie } from '../utils/cookie-helpers';
import { csrfProtection } from './csrf-plugin';

export const graphql = (GRAPHQL_URL: string) => {
    return new Elysia({ prefix: '/api/graphql' })
        .use(csrfProtection())
        .post(
            '/',
            async ({ body, set }) => {
                const accessToken = await getAccessTokenCookie() ?? "invalid-token";

                try {
                    const response = await fetch(GRAPHQL_URL, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`,
                        },
                        body: JSON.stringify(body),
                        credentials: 'include',
                    });

                    set.status = response.status

                    return await response.json()
                } catch (e) {
                    set.status = 500

                    return {
                        error: 'Internal server error',
                        details: (e as Error).message
                    }
                }
            }
        )
        .get(
            '/',
            async ({ query, set }) => {
                const accessToken = await getAccessTokenCookie() ?? "invalid-token";

                try {
                    // Apollo Client may send GET requests with query params
                    const url = new URL(GRAPHQL_URL);
                    Object.entries(query).forEach(([key, value]) => {
                        url.searchParams.append(key, String(value));
                    });

                    const response = await fetch(url.toString(), {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                        },
                        credentials: 'include',
                    });

                    set.status = response.status

                    return await response.json()
                } catch (e) {
                    set.status = 500

                    return {
                        error: 'Internal server error',
                        details: (e as Error).message
                    }
                }
            }
        )
}
