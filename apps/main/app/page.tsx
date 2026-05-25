import type { Metadata } from 'next';
import Hero from '@/component/pages/landing-page/hero';
import Footer from '@/component/pages/landing-page/footer';

export const metadata: Metadata = {
    title: {
        absolute: 'KUBIS - Your Unified Workspace',
    },
    description:
        'KUBIS brings your essential tools into one connected workspace. Tailored to your workflow, built for growing businesses.',
    alternates: {
        canonical: '/',
    },
    openGraph: {
        title: 'KUBIS - Your Unified Workspace',
        description: 'KUBIS brings your essential tools into one connected workspace.',
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
            <Hero />
            <Footer />
        </>
    );
}
