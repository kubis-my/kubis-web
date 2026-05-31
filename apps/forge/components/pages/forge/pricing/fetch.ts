import { unstable_cache } from 'next/cache';
import { getForgeApolloClient } from '@repo/commons/lib/apollo-client';
import { GET_PACKAGE_PLAN } from './graphql';

export const fetchPackagePlan = unstable_cache(
    async (locale: string) => {
        try {
            const result = await getForgeApolloClient().query({
                query: GET_PACKAGE_PLAN,
                variables: { locale },
                errorPolicy: 'all',
            });

            if (result.error) {
                console.error('[pricing] GraphQL error:', result.error);
            }

            return result.data?.getPackagePlan ?? null;
        } catch (error) {
            console.error('[pricing] Apollo network error:', error);
            return null;
        }
    },
    ['forge-package-plan'],
    { revalidate: 3600 },
);
