'use client';

import { memo } from 'react';
import { Attachment } from '@repo/commons/types/forge-service-schema.type';
import { Skeleton } from '@/shadcn/components/skeleton';
import { useAttachmentFile } from '@/root/libs/attachments/use-attachment-file';

export default memo(function AttachmentImageItem({ attachment }: { attachment: Attachment }) {
    const { blobUrl, loading, error } = useAttachmentFile(attachment, { auto: true });

    if (error) return null;

    if (!blobUrl) {
        return <Skeleton className="size-32 rounded-lg" />;
    }

    return (
        <a href={blobUrl} target="_blank" rel="noopener noreferrer">
            <img
                src={blobUrl}
                alt={attachment.filename}
                className="size-32 rounded-lg border object-cover transition-opacity hover:opacity-90"
                aria-busy={loading}
            />
        </a>
    );
});
