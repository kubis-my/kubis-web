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

const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
        {
            '@type': 'Organization',
            '@id': 'https://kubis.my/#organization',
            name: 'KUBIS',
            url: 'https://kubis.my',
            logo: 'https://kubis.my/logo.png',
            description:
                'A modular business software ecosystem of purpose-built applications for growing businesses.',
        },
        {
            '@type': 'WebSite',
            '@id': 'https://kubis.my/#website',
            url: 'https://kubis.my',
            name: 'KUBIS',
            publisher: { '@id': 'https://kubis.my/#organization' },
        },
    ],
};

export default function Home() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
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
