'use client';

import { useState } from 'react';
import { IconLoader2, IconPlayerPlayFilled, } from '@tabler/icons-react';
import { Attachment, AttachmentCategory } from '@repo/commons/types/forge-service-schema.type';
import { Skeleton } from '@/shadcn/components/skeleton';
import { useAttachmentFile } from '@/root/libs/attachments/use-attachment-file';
import { getAttachmentTypeLabel, triggerAnchorDownload, TYPE_ICON_MAP } from '@/root/libs/attachments/utils';
import AttachmentPreviewModal from './attachment-preview-modal';

export default function AttachmentCard({ attachment }: { attachment: Attachment }) {
    const isImage = attachment.category === AttachmentCategory.IMAGE;
    const isVideo = attachment.category === AttachmentCategory.VIDEO;
    const label = getAttachmentTypeLabel(attachment);
    const TypeIcon = TYPE_ICON_MAP[label];

    const { blobUrl, loading, fetchFile } = useAttachmentFile(attachment, { auto: isImage || isVideo });
    const [previewOpen, setPreviewOpen] = useState(false);

    const runOpenOrDownload = async () => {
        const url = await fetchFile();
        if (!url) return;

        if (label === 'PDF') {
            window.open(url, '_blank', 'noopener,noreferrer');
        } else {
            triggerAnchorDownload(url, attachment.filename);
        }
    };

    const handleCardClick = () => {
        if (isImage || isVideo) {
            if (blobUrl) setPreviewOpen(true);
            return;
        }
        void runOpenOrDownload();
    };

    const isDocLoading = loading && !isImage && !isVideo;
    const isMediaLoading = (isImage || isVideo) && !blobUrl;

    if (isMediaLoading) {
        return (
            <div className="bg-card flex h-full flex-col overflow-hidden rounded-lg border">
                <Skeleton className="h-36 w-full shrink-0 rounded-none border-b sm:h-40" />

                <div className="flex flex-1 flex-col gap-1.5 p-3">
                    <Skeleton className="h-4 w-14 rounded" />
                    <Skeleton className="h-4 w-3/4 rounded" />
                </div>
            </div>
        );
    }

    return (
        <>
            <div
                role="button"
                tabIndex={0}
                onClick={handleCardClick}
                onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        handleCardClick();
                    }
                }}
                className="group bg-card focus-visible:ring-ring flex h-full cursor-pointer flex-col overflow-hidden rounded-lg border transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
                <div className="bg-muted/30 relative h-36 w-full shrink-0 overflow-hidden border-b sm:h-40">
                    {isImage ? (
                        <img
                            src={blobUrl ?? undefined}
                            alt={attachment.filename}
                            className="h-full w-full object-cover"
                        />
                    ) : isVideo ? (
                        <>
                            <video
                                src={`${blobUrl}#t=0.1`}
                                muted
                                playsInline
                                preload="metadata"
                                className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors group-hover:bg-black/20">
                                <span className="flex size-10 items-center justify-center rounded-full bg-white/90 shadow-sm">
                                    <IconPlayerPlayFilled size={18} className="text-foreground ml-0.5" />
                                </span>
                            </div>
                        </>
                    ) : (
                        <div className="flex h-full w-full items-center justify-center">
                            {isDocLoading ? (
                                <IconLoader2 size={24} className="text-muted-foreground animate-spin" />
                            ) : (
                                <TypeIcon size={36} className="text-muted-foreground" stroke={1.5} />
                            )}
                        </div>
                    )}
                </div>

                <div className="flex flex-1 flex-col gap-1.5 p-3">
                    <span className="text-muted-foreground bg-muted w-fit rounded px-1.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase">
                        {label}
                    </span>

                    <p title={attachment.filename} className="line-clamp-1 text-sm leading-snug font-medium wrap-break-word">
                        {attachment.filename}
                    </p>
                </div>
            </div>

            {(isImage || isVideo) && blobUrl && (
                <AttachmentPreviewModal
                    attachment={attachment}
                    blobUrl={blobUrl}
                    kind={isImage ? 'image' : 'video'}
                    open={previewOpen}
                    onOpenChange={setPreviewOpen}
                />
            )}
        </>
    );
}
