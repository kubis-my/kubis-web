import type { Metadata } from 'next';
import Navbar from '@/component/pages/landing-page/navbar';
import Footer from '@/component/pages/landing-page/footer';
import AuthorHero from '@/component/pages/author/author-hero';
import AuthorStory from '@/component/pages/author/author-story';
import AuthorWork from '@/component/pages/author/author-work';
import AuthorContact from '@/component/pages/author/author-contact';
import {
    PersonSchema,
    FaqSchema,
    BreadcrumbSchema,
} from '@/component/seo/structured-data';

export const metadata: Metadata = {
    title: 'Senior Backend Engineer & Full-Stack Developer',
    description:
        'Muhammad Zarkashi Zuakafli — senior backend & full-stack developer from Kelantan, Malaysia. 5+ years with NestJS, PostgreSQL & GraphQL building multi-tenant SaaS. Available for remote work.',
    keywords: [
        'Senior Backend Engineer',
        'Full-stack Developer',
        'NestJS Developer',
        'PostgreSQL Developer',
        'SaaS Developer',
        'Remote Developer',
        'Malaysia Developer',
        'Zarkashi',
    ],
    alternates: {
        canonical: '/author',
    },
    openGraph: {
        title: 'Zarkashi — Senior Backend Engineer & Full-Stack Developer',
        description:
            'Senior backend & full-stack developer from Malaysia. 5+ years building multi-tenant SaaS with NestJS, PostgreSQL and GraphQL. Available for remote work.',
        url: '/author',
    },
};

const AUTHOR_FAQ = [
    {
        question: 'Who is Muhammad Zarkashi Zuakafli?',
        answer: 'A senior backend and full-stack engineer from Kelantan, Malaysia with 5+ years building multi-tenant SaaS platforms using NestJS, PostgreSQL, and GraphQL.',
    },
    {
        question: 'What technologies does Zarkashi specialize in?',
        answer: 'NestJS, PostgreSQL, GraphQL, REST APIs, Next.js, TypeScript, Docker, and CI/CD for production multi-tenant systems.',
    },
    {
        question: 'Is Zarkashi available for remote work?',
        answer: 'Yes. He works remotely with startups and teams worldwide on backend and full-stack SaaS development.',
    },
    {
        question: 'What is KUBIS?',
        answer: 'KUBIS is a modular business software ecosystem of purpose-built applications that replace spreadsheets and disconnected tools, designed and built by Zarkashi.',
    },
];

export default function AuthorPage() {
    return (
        <>
            <PersonSchema />
            <FaqSchema qa={AUTHOR_FAQ} />
            <BreadcrumbSchema
                items={[
                    { name: 'Home', path: '/' },
                    { name: 'Author', path: '/author' },
                ]}
            />
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
