import type { Metadata } from 'next';
import Footer from '@/component/footer';
import AddOns from '@/component/pages/forge/add-ons';
import Pricing from '@/component/pages/forge/pricing';
import { fetchPackagePlan } from '@/root/components/pages/forge/pricing/fetch';
import { FORGE_CONTENT, resolveForgeLocale } from '@/root/libs/i18n/forge-content';
import { bySortOrder } from '@repo/commons/utils/pagination-helpers';

export const metadata: Metadata = {
    title: 'Pricing',
    description:
        'Simple, transparent pricing for Kubis Forge. Start with a free MVP build, then move to a monthly subscription when your system is production ready.',
    alternates: {
        canonical: '/pricing',
    },
    openGraph: {
        title: 'Pricing | Kubis Forge',
        description:
            'Start with a free MVP build, then move to a monthly subscription when your system is production-ready.',
        url: '/pricing',
    },
};

const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FORGE_CONTENT.en.faq.items.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
        },
    })),
};

export default async function ForgePricingPage(props: {
    searchParams: Promise<{ lang?: string }>;
}) {
    const searchParams = await props.searchParams;
    const locale = resolveForgeLocale(searchParams.lang);
    const content = FORGE_CONTENT[locale];

    const packagePlan = await fetchPackagePlan(locale);
    const plans = [...(packagePlan?.plans ?? [])].sort(bySortOrder);

    return (
        <main className="flex min-h-screen flex-col justify-between">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
            <Pricing content={content.pricing} plans={plans} />
            <AddOns content={content.addOns} addons={packagePlan?.addons ?? []} />
            <Footer />
        </main>
    );
}
