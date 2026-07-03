import { unstable_cache } from 'next/cache';
import { getForgeApolloClient } from '@repo/commons/lib/apollo-client';
import { GET_PACKAGE_PLAN } from './graphql';

export const PACKAGE_PLAN_CACHE_TAG = 'forge-package-plan';

/**
 * Cached fetch of the package plan.
 *
 * `unstable_cache` persists whatever this function *returns* — including `null`
 * or an empty result — for the whole revalidate window. To avoid pinning an
 * empty pricing table when the backend is briefly unavailable, this inner
 * function THROWS on any failure (network error, GraphQL error, or missing/
 * empty plans). Thrown errors are not cached, so the next request retries.
 */
const getCachedPackagePlan = unstable_cache(
    async (locale: string) => {
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
    },
    [PACKAGE_PLAN_CACHE_TAG],
    { revalidate: 3600, tags: [PACKAGE_PLAN_CACHE_TAG] },
);

/**
 * Page-facing fetch. Returns `null` on failure so the page can render its empty
 * state gracefully — without the failure being cached (see above). Call
 * `revalidateTag(PACKAGE_PLAN_CACHE_TAG)` after editing plans to refresh early.
 */
export async function fetchPackagePlan(locale: string) {
    try {
        return await getCachedPackagePlan(locale);
    } catch (error) {
        console.error('[pricing] failed to load package plan:', error);
        return null;
    }
}
