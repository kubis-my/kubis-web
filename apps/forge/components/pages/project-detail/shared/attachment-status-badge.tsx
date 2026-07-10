'use client';

import { IconAlertCircle } from '@tabler/icons-react';
import type { PendingAttachment } from '@/root/libs/attachments/types';

export function AttachmentStatusBadge({ attachment }: { attachment: PendingAttachment }) {
    if (attachment.phase === 'FAILED') {
        return (
            <div className="bg-background/80 text-destructive flex size-6 items-center justify-center rounded-full backdrop-blur-sm">
                <IconAlertCircle size={14} />
            </div>
        );
    }

    return null;
}
