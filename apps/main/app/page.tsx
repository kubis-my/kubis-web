import type { Metadata } from 'next';
import Navbar from '@/component/pages/landing-page/navbar';
import Hero from '@/component/pages/landing-page/hero';
import Problem from '@/component/pages/landing-page/problem';
import EcosystemModel from '@/component/pages/landing-page/ecosystem-model';
import ProductEcosystem from '@/component/pages/landing-page/product-ecosystem';
import WhyKubis from '@/component/pages/landing-page/why-kubis';
import Founder from '@/component/pages/landing-page/founder';
import HowItWorks from '@/component/pages/landing-page/how-it-works';
import FutureVision from '@/component/pages/landing-page/future-vision';
import FinalCta from '@/component/pages/landing-page/final-cta';
import Footer from '@/component/pages/landing-page/footer';
import { OrganizationSchema, WebSiteSchema } from '@/component/seo/structured-data';

export const metadata: Metadata = {
    title: {
        absolute: 'KUBIS: A Modular Business Software Ecosystem',
    },
    description:
        'KUBIS is one ecosystem of purpose-built applications that replace the spreadsheets, manual workflows, and disconnected tools your operations run on. Start with one app. Add more as you grow.',
    alternates: {
        canonical: '/',
    },
    openGraph: {
        title: 'KUBIS: A Modular Business Software Ecosystem',
        description:
            'One ecosystem. Multiple purpose-built applications. Built to replace spreadsheets and disconnected tools for growing businesses.',
        url: '/',
    },
};

export default function Home() {
    return (
        <>
            <OrganizationSchema />
            <WebSiteSchema />
            <Navbar />
            <main>
                <Hero />
                <Problem />
                <EcosystemModel />
                <ProductEcosystem />
                <WhyKubis />
                <Founder />
                <HowItWorks />
                <FutureVision />
                <FinalCta />
            </main>
            <Footer />
        </>
    );
}
