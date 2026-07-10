'use client';

import { memo } from 'react';
import { IconDownload, IconFile, IconLoader2 } from '@tabler/icons-react';
import { Attachment } from '@repo/commons/types/forge-service-schema.type';
import { useAttachmentFile } from '@/root/libs/attachments/use-attachment-file';
import { formatFileSize, triggerAnchorDownload } from '@/root/libs/attachments/utils';

export default memo(function AttachmentDocumentItem({ attachment }: { attachment: Attachment }) {
    const { loading, fetchFile } = useAttachmentFile(attachment);

    const handleDownload = async () => {
        const url = await fetchFile();
        if (url) triggerAnchorDownload(url, attachment.filename);
    };

    return (
        <button
            type="button"
            onClick={() => void handleDownload()}
            className="bg-muted/40 hover:bg-muted flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-xs transition-colors"
        >
            {loading ? (
                <IconLoader2 size={16} className="text-muted-foreground shrink-0 animate-spin" />
            ) : (
                <IconFile size={16} className="text-muted-foreground shrink-0" />
            )}
            <span className="flex min-w-0 flex-col">
                <span className="max-w-[200px] truncate font-medium">{attachment.filename}</span>
                <span className="text-muted-foreground">{formatFileSize(attachment.size)}</span>
            </span>
            <IconDownload size={14} className="text-muted-foreground shrink-0" />
        </button>
    );
});
