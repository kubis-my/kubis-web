import Footer from '@/component/footer';
import AddOns from '@/component/pages/forge/add-ons';
import Pricing from '@/component/pages/forge/pricing';
import { FORGE_CONTENT, resolveForgeLocale } from '@/root/libs/i18n/forge-content';

export default async function ForgePricingPage(props: {
    searchParams: Promise<{ lang?: string }>;
}) {
    const searchParams = await props.searchParams;
    const locale = resolveForgeLocale(searchParams.lang);
    const content = FORGE_CONTENT[locale];

    return (
        <main className="flex min-h-screen flex-col justify-between">
            <Pricing content={content.pricing} />
            <AddOns content={content.addOns} />
            <Footer />
        </main>
    );
}
