'use client';

import { Attachment } from '@repo/commons/types/forge-service-schema.type';
import AttachmentCard from './attachment-card';

export default function AttachmentGrid({ attachments }: { attachments: Attachment[] }) {
    if (attachments.length === 0) return null;

    return (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3">
            {attachments.map((attachment) => (
                <AttachmentCard key={attachment.publicId} attachment={attachment} />
            ))}
        </div>
    );
}
