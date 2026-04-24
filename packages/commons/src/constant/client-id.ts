import { env } from './env';

export const MAIN_CLIENT_ID = env.NEXT_PUBLIC_MAIN_CLIENT_ID;
export const OPS_CLIENT_ID = env.NEXT_PUBLIC_OPS_CLIENT_ID ?? '';
export const FORGE_CLIENT_ID = env.NEXT_PUBLIC_FORGE_CLIENT_ID ?? '';
