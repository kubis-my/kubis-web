import type { Metadata } from 'next';
import Navbar from '@/component/pages/landing-page/navbar';
import Footer from '@/component/pages/landing-page/footer';
import FinalCta from '@/component/pages/landing-page/final-cta';
import ExploreHero from '@/component/pages/explore-apps/explore-hero';
import AppShowcase from '@/component/pages/explore-apps/app-showcase';
import ExploreRoadmap from '@/component/pages/explore-apps/explore-roadmap';

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
