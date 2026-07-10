'use client';

import { memo } from 'react';
import { Attachment } from '@repo/commons/types/forge-service-schema.type';
import { Skeleton } from '@/shadcn/components/skeleton';
import { useAttachmentFile } from '@/root/libs/attachments/use-attachment-file';

export default memo(function AttachmentVideoItem({ attachment }: { attachment: Attachment }) {
    const { blobUrl, error } = useAttachmentFile(attachment, { auto: true });

    if (error) return null;

    if (!blobUrl) {
        return <Skeleton className="h-40 w-64 rounded-lg" />;
    }

    return <video src={blobUrl} controls className="h-40 max-w-full rounded-lg border" preload="metadata" />;
});
