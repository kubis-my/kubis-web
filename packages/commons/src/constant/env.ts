import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
    clientPrefix: 'NEXT_PUBLIC_',
    shared: {
        APP_ENV: z.enum(['development', 'staging', 'production']).optional(),
    },
    client: {
        NEXT_PUBLIC_AUTH_URL: z.url(),
        NEXT_PUBLIC_MAIN_APP_BASE_URL: z.url(),
        NEXT_PUBLIC_SSO_APP_BASE_URL: z.url(),
        NEXT_PUBLIC_MAIN_CLIENT_ID: z.string().min(1),
        NEXT_PUBLIC_OPS_CLIENT_ID: z.string().min(1),
        NEXT_PUBLIC_OPS_APP_BASE_URL: z.url(),
        NEXT_PUBLIC_FORGE_APP_BASE_URL: z.url(),
        NEXT_PUBLIC_KUBIS_GATEWAY_GRAPHQL_URL: z.url(),
    },
    emptyStringAsUndefined: true,
    runtimeEnvStrict: {
        APP_ENV: process.env.APP_ENV,
        NEXT_PUBLIC_AUTH_URL: process.env.NEXT_PUBLIC_AUTH_URL,
        NEXT_PUBLIC_MAIN_APP_BASE_URL: process.env.NEXT_PUBLIC_MAIN_APP_BASE_URL,
        NEXT_PUBLIC_SSO_APP_BASE_URL: process.env.NEXT_PUBLIC_SSO_APP_BASE_URL,
        NEXT_PUBLIC_MAIN_CLIENT_ID: process.env.NEXT_PUBLIC_MAIN_CLIENT_ID,
        NEXT_PUBLIC_OPS_CLIENT_ID: process.env.NEXT_PUBLIC_OPS_CLIENT_ID,
        NEXT_PUBLIC_OPS_APP_BASE_URL: process.env.NEXT_PUBLIC_OPS_APP_BASE_URL,
        NEXT_PUBLIC_FORGE_APP_BASE_URL: process.env.NEXT_PUBLIC_FORGE_APP_BASE_URL,
        NEXT_PUBLIC_KUBIS_GATEWAY_GRAPHQL_URL: process.env.NEXT_PUBLIC_KUBIS_GATEWAY_GRAPHQL_URL,
    },
});
