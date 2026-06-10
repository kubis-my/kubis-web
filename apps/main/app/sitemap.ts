import { MetadataRoute } from 'next';

type Route = {
    path: string;
    priority: number;
    changeFrequency: NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>;
    lastModified: string;
};

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_MAIN_APP_BASE_URL ?? 'https://kubis.my';

    const routes: Route[] = [
        { path: '/', priority: 1.0, changeFrequency: 'weekly', lastModified: '2026-06-10' },
        { path: '/author', priority: 0.9, changeFrequency: 'monthly', lastModified: '2026-06-10' },
        {
            path: '/explore-apps',
            priority: 0.8,
            changeFrequency: 'monthly',
            lastModified: '2026-06-10',
        },
    ];

    return routes.map((r) => ({
        url: `${baseUrl}${r.path === '/' ? '' : r.path}`,
        lastModified: r.lastModified,
        changeFrequency: r.changeFrequency,
        priority: r.priority,
    }));
}
