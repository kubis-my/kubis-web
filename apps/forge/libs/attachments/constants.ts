import { AttachmentCategory } from '@repo/commons/types/forge-service-schema.type';

export const ATTACHMENT_MAX_SIZE_BYTES: Record<AttachmentCategory, number> = {
    [AttachmentCategory.IMAGE]: 25 * 1024 * 1024,
    [AttachmentCategory.VIDEO]: 512 * 1024 * 1024,
    [AttachmentCategory.DOCUMENT]: 50 * 1024 * 1024,
};

const MIME_CATEGORY_MAP: Record<string, AttachmentCategory> = {
    'image/png': AttachmentCategory.IMAGE,
    'image/jpeg': AttachmentCategory.IMAGE,
    'image/webp': AttachmentCategory.IMAGE,
    'image/gif': AttachmentCategory.IMAGE,
    'video/mp4': AttachmentCategory.VIDEO,
    'video/webm': AttachmentCategory.VIDEO,
    'video/quicktime': AttachmentCategory.VIDEO,
    'application/pdf': AttachmentCategory.DOCUMENT,
    'application/msword': AttachmentCategory.DOCUMENT,
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        AttachmentCategory.DOCUMENT,
    'application/vnd.ms-excel': AttachmentCategory.DOCUMENT,
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        AttachmentCategory.DOCUMENT,
    'application/vnd.ms-powerpoint': AttachmentCategory.DOCUMENT,
    'application/vnd.openxmlformats-officedocument.presentationml.presentation':
        AttachmentCategory.DOCUMENT,
    'application/vnd.oasis.opendocument.text': AttachmentCategory.DOCUMENT,
    'application/vnd.oasis.opendocument.spreadsheet': AttachmentCategory.DOCUMENT,
    'application/vnd.oasis.opendocument.presentation': AttachmentCategory.DOCUMENT,
    'application/rtf': AttachmentCategory.DOCUMENT,
    'text/plain': AttachmentCategory.DOCUMENT,
    'text/csv': AttachmentCategory.DOCUMENT,
    'application/zip': AttachmentCategory.DOCUMENT,
    'application/x-zip-compressed': AttachmentCategory.DOCUMENT,
};

export const ATTACHMENT_ACCEPT = Object.keys(MIME_CATEGORY_MAP).join(',');

export function resolveAttachmentCategory(mimeType: string): AttachmentCategory | null {
    return MIME_CATEGORY_MAP[mimeType] ?? null;
}
