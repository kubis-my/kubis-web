import type { Metadata } from 'next';
import Navbar from '@/component/pages/landing-page/navbar';
import Footer from '@/component/pages/landing-page/footer';
import AuthorHero from '@/component/pages/author/author-hero';
import AuthorStory from '@/component/pages/author/author-story';
import AuthorWork from '@/component/pages/author/author-work';
import AuthorContact from '@/component/pages/author/author-contact';

export const metadata: Metadata = {
    title: 'The Founder',
    description:
        'Meet Zarkashi Zuakafli, the engineer behind KUBIS. A full-stack developer from Kelantan, Malaysia with 5+ years building multi-tenant SaaS platforms and custom business systems.',
    alternates: {
        canonical: '/author',
    },
    openGraph: {
        title: 'The Founder | KUBIS',
        description:
            'The engineer behind KUBIS, with 5+ years building multi-tenant SaaS platforms, custom business systems, and production software with real users.',
        url: '/author',
    },
};

export default function AuthorPage() {
    return (
        <>
            <Navbar />
            <main>
                <AuthorHero />
                <AuthorStory />
                <AuthorWork />
                <AuthorContact />
            </main>
            <Footer />
        </>
    );
}
