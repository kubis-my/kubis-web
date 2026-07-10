import { getDefaultHeaders } from '@repo/commons/utils/request';
import type { NextConfig } from 'next';
import path from 'node:path';

const nextConfig: NextConfig = {
    outputFileTracingRoot: path.join(__dirname, '../../'),
    turbopack: {
        root: path.join(__dirname, '../../'),
    },
    experimental: {
        staleTimes: { dynamic: 30 },
    },
    async headers() {
        const defaultHeaders = getDefaultHeaders(
            [
                process.env.NEXT_PUBLIC_ACCOUNT_SERVICE_GRAPHQL_URL!,
                process.env.NEXT_PUBLIC_FORGE_SERVICE_GRAPHQL_URL!,
                process.env.NEXT_PUBLIC_AUTH_URL!,
                'https://api.stripe.com',
                'https://*.r2.cloudflarestorage.com',
            ],
            {
                scriptSrc: ['https://js.stripe.com'],
                frameSrc: ['https://js.stripe.com', 'https://hooks.stripe.com'],
                frameAncestors: [process.env.NEXT_PUBLIC_MAIN_APP_BASE_URL!],
            },
        );

        return [
            ...defaultHeaders,
            {
                // Public marketing page (also used as the framed preview on the main site) — safe to cache
                source: '/',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=300, stale-while-revalidate=3600',
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
