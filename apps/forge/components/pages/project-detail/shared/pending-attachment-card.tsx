'use client';

import { IconPlayerPlayFilled, IconX } from '@tabler/icons-react';
import { cn } from '@/shadcn/lib/utils';
import { Skeleton } from '@/shadcn/components/skeleton';
import type { PendingAttachment } from '@/root/libs/attachments/types';
import {
    formatFileSize,
    getPendingAttachmentTypeLabel,
    TYPE_ICON_MAP,
} from '@/root/libs/attachments/utils';
import { AttachmentStatusBadge } from '@/root/components/pages/project-detail/shared/attachment-status-badge';
import { AttachmentFilename } from '@/root/components/pages/project-detail/shared/attachment-filename';

export default function PendingAttachmentCard({
    attachment,
    onRemove,
}: {
    attachment: PendingAttachment;
    onRemove: (publicId: string) => void;
}) {
    const isImage = attachment.mimeType.startsWith('image/');
    const isVideo = attachment.mimeType.startsWith('video/');
    const label = getPendingAttachmentTypeLabel(attachment);
    const TypeIcon = TYPE_ICON_MAP[label];
    const isLoading = attachment.phase === 'UPLOADING' || attachment.phase === 'PROCESSING';

    if (isLoading) {
        return (
            <div className="bg-muted/40 flex w-full max-w-[280px] flex-col overflow-hidden rounded-lg border">
                <Skeleton className="h-[140px] w-full shrink-0 rounded-none" />

                <div className="flex min-w-0 flex-col gap-1.5 p-2">
                    <Skeleton className="h-4 w-12 rounded" />
                    <Skeleton className="h-3.5 w-3/4 rounded" />
                    <Skeleton className="h-3 w-1/3 rounded" />
                </div>
            </div>
        );
    }

    return (
        <div
            className={cn(
                'bg-muted/40 group flex w-full max-w-[280px] flex-col overflow-hidden rounded-lg border',
                attachment.phase === 'FAILED' && 'border-destructive/50 bg-destructive/5',
            )}
        >
            <div className="bg-muted relative h-[140px] w-full shrink-0 overflow-hidden">
                {isImage && attachment.previewUrl ? (
                    <img
                        src={attachment.previewUrl}
                        alt={attachment.filename}
                        className="h-full w-full object-cover"
                    />
                ) : isVideo && attachment.previewUrl ? (
                    <video src={attachment.previewUrl} className="h-full w-full object-cover" muted />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <TypeIcon size={36} className="text-muted-foreground" stroke={1.5} />
                    </div>
                )}

                {isVideo && attachment.previewUrl ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex size-9 items-center justify-center rounded-full bg-black/50 text-white">
                            <IconPlayerPlayFilled size={18} />
                        </div>
                    </div>
                ) : null}

                <div className="absolute top-1.5 left-1.5">
                    <AttachmentStatusBadge attachment={attachment} />
                </div>

                <button
                    type="button"
                    onClick={() => onRemove(attachment.publicId)}
                    className="bg-background/80 text-muted-foreground hover:text-foreground hover:bg-background absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-full backdrop-blur-sm transition-colors"
                    aria-label={`Remove ${attachment.filename}`}
                >
                    <IconX size={14} />
                </button>
            </div>

            <div className="flex min-w-0 flex-col gap-1 p-2 text-xs">
                <span className="text-muted-foreground bg-muted w-fit shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase">
                    {label}
                </span>

                <AttachmentFilename filename={attachment.filename} />

                <span className="text-muted-foreground truncate">
                    {attachment.phase === 'FAILED'
                        ? (attachment.error ?? 'Upload failed')
                        : formatFileSize(attachment.size)}
                </span>
            </div>
        </div>
    );
}
