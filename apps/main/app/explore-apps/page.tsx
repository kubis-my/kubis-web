import type { Metadata } from 'next';
import ExploreAppsClient from '@/component/pages/explore-apps/explore-apps-client';
import Footer from '@/component/pages/landing-page/footer';
import { env } from '@repo/commons/constant/env';

export const metadata: Metadata = {
    title: 'Explore Apps',
    description:
        'Discover Kubis apps - Forge for custom business systems built around your workflow, and Ops for end-to-end order and production management.',
    alternates: {
        canonical: '/explore-apps',
    },
    openGraph: {
        title: 'Explore Apps | KUBIS',
        description:
            'Discover Kubis apps - Forge for custom business systems and Ops for end-to-end production management.',
        url: '/explore-apps',
    },
};

export default function ExploreAppsPage() {
    const apps = [
        {
            name: 'Forge',
            badge: 'Build',
            title: 'Custom systems built around your workflow',
            description:
                'We scope your core MVP first. Once it is production ready, you move into a monthly subscription (no upfront lock-in)',
            bullets: [
                'Scoped MVP delivery before any subscription',
                'Flexible monthly plan once you go live',
                'Built specifically for your business processes',
                'Scales with your team as you grow',
            ],
            href: env.NEXT_PUBLIC_FORGE_APP_BASE_URL ?? null,
            comingSoon: false,
            gradient: 'from-green-600 via-emerald-600 to-teal-500',
            accentColor: '#4CAF50',
        },
        {
            name: 'Ops',
            badge: 'Process Management',
            title: 'Collect orders. Trigger production. Ship.',
            description:
                'Collect orders into campaign buckets, trigger production when the threshold is met, and track every order through a configurable production workflow (all in one place)',
            bullets: [
                'Campaign based order batching with threshold and deadline tracking',
                'Configurable workflow builder, define stages, roles, and checklists per product',
                'Production board sorted by shipping date so deadlines are never missed',
                'Full order lifecycle from pre-order intake to fulfillment and refunds',
            ],
            href: env.NEXT_PUBLIC_OPS_APP_BASE_URL ?? null,
            comingSoon: true,
            gradient: 'from-blue-900 via-indigo-800 to-violet-700',
            accentColor: '#6366f1',
        },
    ];

    return (
        <>
            <ExploreAppsClient apps={apps} />
            <Footer />
        </>
    );
}
