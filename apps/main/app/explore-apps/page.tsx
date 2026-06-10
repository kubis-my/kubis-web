import type { Metadata } from 'next';
import Navbar from '@/component/pages/landing-page/navbar';
import Footer from '@/component/pages/landing-page/footer';
import FinalCta from '@/component/pages/landing-page/final-cta';
import ExploreHero from '@/component/pages/explore-apps/explore-hero';
import AppShowcase from '@/component/pages/explore-apps/app-showcase';
import ExploreRoadmap from '@/component/pages/explore-apps/explore-roadmap';
import {
    SoftwareApplicationSchema,
    BreadcrumbSchema,
} from '@/component/seo/structured-data';

const SITE_URL = process.env.NEXT_PUBLIC_MAIN_APP_BASE_URL ?? 'https://kubis.my';

export const metadata: Metadata = {
    title: 'Explore the Ecosystem',
    description:
        'Explore the KUBIS ecosystem: Forge for custom business systems built around your workflow, Ops for order-to-production management, and more purpose-built applications on the way.',
    alternates: {
        canonical: '/explore-apps',
    },
    openGraph: {
        title: 'Explore the Ecosystem | KUBIS',
        description:
            'One ecosystem of purpose-built applications. Forge for custom business systems, Ops for order-to-production management, and more on the way.',
        url: '/explore-apps',
    },
};

export default function ExploreAppsPage() {
    return (
        <>
            <SoftwareApplicationSchema
                name="KUBIS Forge"
                description="Custom business systems built around your workflow, part of the KUBIS ecosystem."
                url={`${SITE_URL}/explore-apps`}
            />
            <SoftwareApplicationSchema
                name="KUBIS Ops"
                description="Order-to-production management for growing operations, part of the KUBIS ecosystem."
                url={`${SITE_URL}/explore-apps`}
            />
            <BreadcrumbSchema
                items={[
                    { name: 'Home', path: '/' },
                    { name: 'Explore the Ecosystem', path: '/explore-apps' },
                ]}
            />
            <Navbar />
            <main>
                <ExploreHero />
                <AppShowcase />
                <ExploreRoadmap />
                <FinalCta />
            </main>
            <Footer />
        </>
    );
}
