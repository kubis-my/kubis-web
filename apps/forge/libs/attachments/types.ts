export type PendingAttachmentPhase = 'UPLOADING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export type PendingAttachment = {
    publicId: string;
    filename: string;
    mimeType: string;
    size: number;
    phase: PendingAttachmentPhase;
    previewUrl?: string;
    error?: string;
};
