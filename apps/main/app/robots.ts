import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_MAIN_APP_BASE_URL ?? 'https://kubis.my';

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/my-account/',
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
