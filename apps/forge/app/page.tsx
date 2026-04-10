import Hero from '@/component/pages/forge/hero';
import HowItWorks from '@/component/pages/forge/how-it-works';
import MvpScope from '@/component/pages/forge/mvp-scope';
import Pricing from '@/component/pages/forge/pricing';
import AddOns from '@/component/pages/forge/add-ons';
import WhyItWorks from '@/component/pages/forge/why-it-works';
import IdealClients from '@/component/pages/forge/ideal-clients';
import Faq from '@/component/pages/forge/faq';
import FinalCta from '@/component/pages/forge/final-cta';

export default function ForgePage() {
    return (
        <main className="flex flex-col">
            <Hero />
            <HowItWorks />
            <MvpScope />
            <Pricing />
            <AddOns />
            <WhyItWorks />
            <IdealClients />
            <Faq />
            <FinalCta />
        </main>
    );
}
