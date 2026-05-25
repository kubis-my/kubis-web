import { getDefaultHeaders } from '@repo/commons/utils/request';
import type { NextConfig } from 'next';
import path from 'node:path';

const nextConfig: NextConfig = {
    outputFileTracingRoot: path.join(__dirname, '../../'),
    turbopack: {
        root: path.join(__dirname, '../../'),
    },
    async redirects() {
        return [
            {
                source: '/',
                destination: '/sign-in',
                permanent: true,
            },
        ];
    },
    async headers() {
        return getDefaultHeaders([process.env.NEXT_PUBLIC_AUTH_URL!]);
    },
};

export default nextConfig;
