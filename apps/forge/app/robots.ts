import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_FORGE_APP_BASE_URL ?? 'https://forge.kubis.my';

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/projects/',
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
