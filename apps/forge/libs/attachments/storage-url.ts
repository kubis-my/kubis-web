import { env } from '@repo/commons/constant/env';

const STORAGE_BASE_URL = env.NEXT_PUBLIC_FORGE_SERVICE_GRAPHQL_URL.replace(/\/graphql\/?$/, '');

export function getAttachmentUrl(publicId: string): string {
    return `${STORAGE_BASE_URL}/storage/${publicId}`;
}
