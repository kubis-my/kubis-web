import { getForgeApolloClient } from '@repo/commons/lib/apollo-client';
import { GET_PACKAGE_PLAN } from './graphql';

/**
 * Page-facing fetch. Returns `null` on failure so the page can render its empty
 * state gracefully. Always hits the network — not cached.
 */
export async function fetchPackagePlan(locale: string) {
    try {
        const result = await getForgeApolloClient().query({
            query: GET_PACKAGE_PLAN,
            variables: { locale },
            errorPolicy: 'all',
        });

        // errorPolicy: 'all' returns partial data alongside errors without
        // throwing, so validate the payload explicitly.
        const packagePlan = result.data?.getPackagePlan ?? null;

        if (result.error || !packagePlan || (packagePlan.plans?.length ?? 0) === 0) {
            throw new Error(result.error?.message ?? 'Empty package plan response');
        }

        return packagePlan;
    } catch (error) {
        console.error('[pricing] failed to load package plan:', error);
        return null;
    }
}
