'use client';

import { Attachment, AttachmentCategory } from '@repo/commons/types/forge-service-schema.type';
import AttachmentImageItem from '@/root/components/pages/project-detail/shared/attachment-image-item';
import AttachmentVideoItem from '@/root/components/pages/project-detail/shared/attachment-video-item';
import AttachmentDocumentItem from '@/root/components/pages/project-detail/shared/attachment-document-item';

export function AttachmentGallery({ attachments }: { attachments: Attachment[] }) {
    if (attachments.length === 0) return null;

    return (
        <div className="mt-2 flex flex-wrap gap-2">
            {attachments.map((attachment) => {
                if (attachment.category === AttachmentCategory.IMAGE) {
                    return <AttachmentImageItem key={attachment.publicId} attachment={attachment} />;
                }
                if (attachment.category === AttachmentCategory.VIDEO) {
                    return <AttachmentVideoItem key={attachment.publicId} attachment={attachment} />;
                }
                return <AttachmentDocumentItem key={attachment.publicId} attachment={attachment} />;
            })}
        </div>
    );
}
