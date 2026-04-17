import { env } from './env';

export const APP_NAME = 'Kubis';

export const MAIN_APP_BASE_URL = env.NEXT_PUBLIC_MAIN_APP_BASE_URL;
export const SSO_APP_BASE_URL = env.NEXT_PUBLIC_SSO_APP_BASE_URL;
export const OPS_APP_BASE_URL = env.NEXT_PUBLIC_OPS_APP_BASE_URL ?? '';
export const AUTH_SVC_URL = env.NEXT_PUBLIC_AUTH_URL;
export const ACCOUNT_SERVICE_GRAPHQL_URL = env.NEXT_PUBLIC_ACCOUNT_SERVICE_GRAPHQL_URL;
