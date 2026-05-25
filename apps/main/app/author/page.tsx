import type { Metadata } from 'next';
import AuthorClient from '@/component/pages/author/author-client';
import Footer from '@/component/pages/landing-page/footer';

export const metadata: Metadata = {
    title: 'Zarkashi Zuakafli - Author',
    description:
        'Meet Zarkashi Zuakafli, the author of KUBIS. Full-stack developer from Kelantan, Malaysia with 5+ years of experience building custom business systems.',
    alternates: {
        canonical: '/author',
    },
    openGraph: {
        title: 'Zarkashi Zuakafli - Author | KUBIS',
        description:
            'Full-stack developer with 5+ years of experience building custom business systems.',
        url: '/author',
    },
};

export default function AuthorPage() {
    return (
        <>
            <AuthorClient />
            <Footer />
        </>
    );
}
