import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_MAIN_APP_BASE_URL ?? 'https://kubis.my';

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/my-account/', '/api/'],
            },
            {
                userAgent: [
                    'GPTBot',
                    'OAI-SearchBot',
                    'PerplexityBot',
                    'ClaudeBot',
                    'Google-Extended',
                ],
                allow: '/',
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
        host: baseUrl,
    };
}
