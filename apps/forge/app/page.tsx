import Footer from '@/component/footer';
import Hero from '@/component/pages/forge/hero';
import HowItWorks from '@/component/pages/forge/how-it-works';
import MvpScope from '@/component/pages/forge/mvp-scope';
import WhyItWorks from '@/component/pages/forge/why-it-works';
import IdealClients from '@/component/pages/forge/ideal-clients';
import Faq from '@/component/pages/forge/faq';
import FinalCta from '@/component/pages/forge/final-cta';
import { FORGE_CONTENT, resolveForgeLocale } from '@/root/libs/i18n/forge-content';

export default async function ForgePage(props: { searchParams: Promise<{ lang?: string }> }) {
    const searchParams = await props.searchParams;
    const locale = resolveForgeLocale(searchParams.lang);
    const content = FORGE_CONTENT[locale];

    return (
        <main className="flex flex-col">
            <Hero content={content.hero} />
            <HowItWorks content={content.howItWorks} />
            <MvpScope content={content.mvpScope} />
            <WhyItWorks content={content.whyItWorks} />
            <IdealClients content={content.idealClients} />
            <Faq content={content.faq} />
            <FinalCta content={content.finalCta} />
            <Footer />
        </main>
    );
}
