import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
    clientPrefix: "NEXT_PUBLIC_",
    shared: {},
    client: {
        NEXT_PUBLIC_AUTH_URL: z.string().url(),
        NEXT_PUBLIC_MAIN_APP_BASE_URL: z.string().url(),
        NEXT_PUBLIC_SSO_APP_BASE_URL: z.string().url(),
        NEXT_PUBLIC_MAIN_CLIENT_ID: z.string().min(1),
    },
    emptyStringAsUndefined: true,
    runtimeEnvStrict: {
        NEXT_PUBLIC_AUTH_URL: process.env.NEXT_PUBLIC_AUTH_URL,
        NEXT_PUBLIC_MAIN_APP_BASE_URL: process.env.NEXT_PUBLIC_MAIN_APP_BASE_URL,
        NEXT_PUBLIC_SSO_APP_BASE_URL: process.env.NEXT_PUBLIC_SSO_APP_BASE_URL,
        NEXT_PUBLIC_MAIN_CLIENT_ID: process.env.NEXT_PUBLIC_MAIN_CLIENT_ID,
    },
});