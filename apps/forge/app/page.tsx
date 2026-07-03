import type { Metadata } from 'next';
import Footer from '@/component/footer';
import Hero from '@/component/pages/forge/hero';
import PainPoints from '@/component/pages/forge/pain-points';
import IdealClients from '@/component/pages/forge/ideal-clients';
import HowItWorks from '@/component/pages/forge/how-it-works';
import MvpScope from '@/component/pages/forge/mvp-scope';
import WhyItWorks from '@/component/pages/forge/why-it-works';
import Faq from '@/component/pages/forge/faq';
import FinalCta from '@/component/pages/forge/final-cta';
import { FORGE_CONTENT, resolveForgeLocale } from '@/root/libs/i18n/forge-content';

export const metadata: Metadata = {
    title: {
        absolute: 'Kubis Forge - Build First, Subscribe When Ready',
    },
    description:
        'Custom business systems built around your workflow. We build your core MVP first, then you move into a monthly subscription when your system is production ready.',
    alternates: {
        canonical: '/',
    },
    openGraph: {
        title: 'Kubis Forge - Build First, Subscribe When Ready',
        description:
            'Custom business systems built around your workflow. We build your core MVP first.',
        url: '/',
    },
};

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Kubis Forge',
    url: 'https://forge.kubis.my',
    description:
        'Custom business systems built around your workflow. Build First, Subscribe When Ready.',
    provider: {
        '@type': 'Organization',
        name: 'KUBIS',
        url: 'https://kubis.my',
    },
    serviceType: 'Custom Software Development',
    areaServed: 'MY',
    hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Subscription Plans',
        itemListElement: [
            { '@type': 'Offer', name: 'Maintenance', price: '200', priceCurrency: 'MYR' },
            { '@type': 'Offer', name: 'Starter', price: '500', priceCurrency: 'MYR' },
            { '@type': 'Offer', name: 'Growth', price: '1000', priceCurrency: 'MYR' },
            { '@type': 'Offer', name: 'Scale', price: '2000', priceCurrency: 'MYR' },
        ],
    },
};

export default async function ForgePage(props: { searchParams: Promise<{ lang?: string }> }) {
    const searchParams = await props.searchParams;
    const locale = resolveForgeLocale(searchParams.lang);
    const content = FORGE_CONTENT[locale];

    return (
        <main className="flex flex-col">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Hero content={content.hero} />
            <PainPoints content={content.painPoints} />
            <IdealClients content={content.idealClients} primaryCta={content.hero.primaryCta} />
            <HowItWorks content={content.howItWorks} />
            <MvpScope content={content.mvpScope} />
            <WhyItWorks content={content.whyItWorks} />
            <Faq content={content.faq} />
            <FinalCta content={content.finalCta} />
            <Footer />
        </main>
    );
}
