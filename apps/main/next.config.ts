import { getDefaultHeaders } from '@repo/commons/utils/request';
import type { NextConfig } from 'next';
import path from 'node:path';

const nextConfig: NextConfig = {
    outputFileTracingRoot: path.join(__dirname, '../../'),
    turbopack: {
        root: path.join(__dirname, '../../'),
    },
    async headers() {
        return getDefaultHeaders(
            [process.env.NEXT_PUBLIC_ACCOUNT_SERVICE_GRAPHQL_URL!, process.env.NEXT_PUBLIC_AUTH_URL!],
            { frameSrc: [process.env.NEXT_PUBLIC_FORGE_APP_BASE_URL!] },
        );
    },
};

export default nextConfig;
