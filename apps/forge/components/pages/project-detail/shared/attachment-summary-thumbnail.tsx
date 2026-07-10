'use client';

import { IconFile } from '@tabler/icons-react';
import { cn } from '@/shadcn/lib/utils';
import type { PendingAttachment } from '@/root/libs/attachments/types';

export function AttachmentSummaryThumbnail({
    attachment,
    className,
}: {
    attachment: PendingAttachment;
    className?: string;
}) {
    if (attachment.previewUrl && attachment.mimeType.startsWith('image/')) {
        return (
            <img
                src={attachment.previewUrl}
                alt={attachment.filename}
                className={cn('ring-background rounded object-cover ring-2', className)}
            />
        );
    }

    if (attachment.previewUrl && attachment.mimeType.startsWith('video/')) {
        return (
            <video
                src={attachment.previewUrl}
                className={cn('ring-background rounded object-cover ring-2', className)}
                muted
            />
        );
    }

    return (
        <div
            className={cn(
                'bg-muted text-muted-foreground ring-background flex items-center justify-center rounded ring-2',
                className,
            )}
        >
            <IconFile size={12} />
        </div>
    );
}
