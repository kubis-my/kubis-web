import { Fragment } from 'react';

const SITE = process.env.NEXT_PUBLIC_MAIN_APP_BASE_URL ?? 'https://kubis.my';

type JsonLdData = Record<string, unknown>;

function JsonLd({ data }: { data: JsonLdData }) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}

/* ---------- Person (recruiter / GEO entity) ---------- */
export function PersonSchema() {
    const data: JsonLdData = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        '@id': `${SITE}/author#person`,
        name: 'Muhammad Zarkashi Zuakafli',
        alternateName: 'Zarkashi',
        url: `${SITE}/author`,
        jobTitle: 'Senior Backend Engineer & Full-Stack Developer',
        description:
            'Full-stack engineer with 5+ years building multi-tenant SaaS platforms, NestJS/PostgreSQL backends, and real-time business automation tools.',
        address: {
            '@type': 'PostalAddress',
            addressRegion: 'Kelantan',
            addressCountry: 'MY',
        },
        knowsAbout: [
            'NestJS',
            'PostgreSQL',
            'GraphQL',
            'REST APIs',
            'Multi-tenant SaaS',
            'Next.js',
            'TypeScript',
            'Docker',
            'CI/CD',
        ],
        sameAs: ['https://github.com/kashi93', 'https://linkedin.com/in/zarkashi'],
        worksFor: { '@id': `${SITE}/#organization` },
    };

    return <JsonLd data={data} />;
}

/* ---------- Organization (homepage) ---------- */
export function OrganizationSchema() {
    const data: JsonLdData = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': `${SITE}/#organization`,
        name: 'KUBIS',
        url: SITE,
        logo: `${SITE}/logo.png`,
        description:
            'A modular business software ecosystem of purpose-built applications for growing businesses.',
        founder: { '@id': `${SITE}/author#person` },
        sameAs: ['https://github.com/kashi93'],
    };

    return <JsonLd data={data} />;
}

/* ---------- WebSite (homepage) ---------- */
export function WebSiteSchema() {
    const data: JsonLdData = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${SITE}/#website`,
        url: SITE,
        name: 'KUBIS',
        publisher: { '@id': `${SITE}/#organization` },
    };

    return <JsonLd data={data} />;
}

/* ---------- SoftwareApplication (per app/module) ---------- */
export function SoftwareApplicationSchema(props: {
    name: string;
    description: string;
    url: string;
    category?: string;
}) {
    const data: JsonLdData = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: props.name,
        description: props.description,
        url: props.url,
        applicationCategory: props.category ?? 'BusinessApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'MYR' },
        publisher: { '@id': `${SITE}/#organization` },
    };

    return <JsonLd data={data} />;
}

/* ---------- Breadcrumb ---------- */
export function BreadcrumbSchema({ items }: { items: { name: string; path: string }[] }) {
    const data: JsonLdData = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: item.name,
            item: `${SITE}${item.path}`,
        })),
    };

    return <JsonLd data={data} />;
}

/* ---------- FAQ (GEO) ---------- */
export function FaqSchema({ qa }: { qa: { question: string; answer: string }[] }) {
    const data: JsonLdData = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: qa.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
    };

    return <JsonLd data={data} />;
}

/* ---------- Convenience: render multiple schemas ---------- */
export function SchemaGraph({ children }: { children: React.ReactNode }) {
    return <Fragment>{children}</Fragment>;
}
