'use client';

import { IconAlertCircle, IconLoader2, IconX } from '@tabler/icons-react';
import { cn } from '@/shadcn/lib/utils';
import type { PendingAttachment } from '@/root/libs/attachments/types';
import {
    formatFileSize,
    getPendingAttachmentTypeLabel,
    TYPE_ICON_MAP,
} from '@/root/libs/attachments/utils';

function getStatusLabel(attachment: PendingAttachment): string {
    switch (attachment.phase) {
        case 'UPLOADING':
            return 'Uploading…';
        case 'PROCESSING':
            return 'Processing…';
        case 'FAILED':
            return attachment.error ?? 'Upload failed';
        case 'COMPLETED':
            return 'Uploaded';
    }
}

export default function AttachmentRow({
    attachment,
    onRemove,
}: {
    attachment: PendingAttachment;
    onRemove: (publicId: string) => void;
}) {
    const showImagePreview = attachment.mimeType.startsWith('image/') && attachment.previewUrl;
    const label = getPendingAttachmentTypeLabel(attachment);
    const FileIcon = TYPE_ICON_MAP[label];
    const isBusy = attachment.phase === 'UPLOADING' || attachment.phase === 'PROCESSING';
    const isFailed = attachment.phase === 'FAILED';

    return (
        <div
            className={cn(
                'bg-muted/30 flex items-center gap-3 rounded-lg border px-3 py-2.5',
                isFailed && 'border-destructive/50 bg-destructive/5',
            )}
        >
            {showImagePreview ? (
                <img
                    src={attachment.previewUrl}
                    alt=""
                    className="size-10 shrink-0 rounded-md object-cover"
                />
            ) : (
                <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-md">
                    <FileIcon size={20} className="text-muted-foreground" />
                </div>
            )}

            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="truncate text-sm font-medium" title={attachment.filename}>
                    {attachment.filename}
                </span>
                <span className="text-muted-foreground flex items-center gap-1 text-xs">
                    <span>{label}</span>
                    <span aria-hidden="true">·</span>
                    <span>{formatFileSize(attachment.size)}</span>
                    <span aria-hidden="true">·</span>
                    <span className={cn(isFailed && 'text-destructive')}>
                        {getStatusLabel(attachment)}
                    </span>
                    {isBusy && (
                        <IconLoader2 size={12} className="text-muted-foreground animate-spin" />
                    )}
                    {isFailed && <IconAlertCircle size={12} className="text-destructive" />}
                </span>
            </div>

            <button
                type="button"
                onClick={() => onRemove(attachment.publicId)}
                className="text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:ring-ring flex size-7 shrink-0 items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:outline-none"
                aria-label={`Remove ${attachment.filename}`}
            >
                <IconX size={16} />
            </button>
        </div>
    );
}
