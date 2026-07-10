'use client';

import { Dialog, DialogContent, DialogTitle } from '@/shadcn/components/dialog';
import { Attachment } from '@repo/commons/types/forge-service-schema.type';

type Props = {
    attachment: Attachment;
    blobUrl: string;
    kind: 'image' | 'video';
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export default function AttachmentPreviewModal({ attachment, blobUrl, kind, open, onOpenChange }: Props) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl p-2 sm:max-w-3xl">
                <DialogTitle className="sr-only">{attachment.filename}</DialogTitle>
                {kind === 'image' ? (
                    <img
                        src={blobUrl}
                        alt={attachment.filename}
                        className="max-h-[80vh] w-full rounded-md object-contain"
                    />
                ) : (
                    <video
                        src={blobUrl}
                        controls
                        autoPlay
                        className="max-h-[80vh] w-full rounded-md"
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}
