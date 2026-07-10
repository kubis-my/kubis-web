import {
    IconFile,
    IconFileTypeCsv,
    IconFileTypeDoc,
    IconFileTypeDocx,
    IconFileTypePdf,
    IconFileTypePpt,
    IconFileTypeXls,
    IconFileTypeZip,
    IconVideo,
} from '@tabler/icons-react';
import { AttachmentCategory } from '@repo/commons/types/forge-service-schema.type';

export function isPreviewable(category: AttachmentCategory): boolean {
    return category === AttachmentCategory.IMAGE || category === AttachmentCategory.VIDEO;
}

export function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export type AttachmentTypeLabel =
    'IMAGE' | 'VIDEO' | 'PDF' | 'DOC' | 'DOCX' | 'XLS' | 'XLSX' | 'PPT' | 'PPTX' | 'CSV' | 'ZIP' | 'FILE';

const MIME_TYPE_LABEL_MAP: Record<string, AttachmentTypeLabel> = {
    'application/pdf': 'PDF',
    'application/msword': 'DOC',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
    'application/vnd.ms-excel': 'XLS',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
    'application/vnd.ms-powerpoint': 'PPT',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PPTX',
    'text/csv': 'CSV',
    'application/zip': 'ZIP',
    'application/x-zip-compressed': 'ZIP',
};

const EXTENSION_LABEL_MAP: Record<string, AttachmentTypeLabel> = {
    pdf: 'PDF',
    doc: 'DOC',
    docx: 'DOCX',
    xls: 'XLS',
    xlsx: 'XLSX',
    ppt: 'PPT',
    pptx: 'PPTX',
    csv: 'CSV',
    zip: 'ZIP',
};

export const TYPE_ICON_MAP: Record<AttachmentTypeLabel, typeof IconFile> = {
    IMAGE: IconFile,
    VIDEO: IconVideo,
    PDF: IconFileTypePdf,
    DOC: IconFileTypeDoc,
    DOCX: IconFileTypeDocx,
    XLS: IconFileTypeXls,
    XLSX: IconFileTypeXls,
    PPT: IconFileTypePpt,
    PPTX: IconFileTypePpt,
    CSV: IconFileTypeCsv,
    ZIP: IconFileTypeZip,
    FILE: IconFile,
};

export function getAttachmentTypeLabel(attachment: {
    category: string;
    mimeType: string;
    filename: string;
}): AttachmentTypeLabel {
    if (attachment.category === 'IMAGE') return 'IMAGE';
    if (attachment.category === 'VIDEO') return 'VIDEO';

    const mimeLabel = MIME_TYPE_LABEL_MAP[attachment.mimeType];
    if (mimeLabel) return mimeLabel;

    const extension = attachment.filename.split('.').pop()?.toLowerCase();
    const extensionLabel = extension ? EXTENSION_LABEL_MAP[extension] : undefined;
    if (extensionLabel) return extensionLabel;

    return 'FILE';
}

export function getPendingAttachmentTypeLabel(attachment: {
    mimeType: string;
    filename: string;
}): AttachmentTypeLabel {
    const category = attachment.mimeType.startsWith('image/')
        ? 'IMAGE'
        : attachment.mimeType.startsWith('video/')
          ? 'VIDEO'
          : 'DOCUMENT';

    return getAttachmentTypeLabel({ ...attachment, category });
}

export function triggerAnchorDownload(url: string, filename: string) {
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
}
