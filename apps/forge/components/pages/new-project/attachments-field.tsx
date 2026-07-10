'use client';

import { useRef, useState } from 'react';
import { IconPaperclip } from '@tabler/icons-react';
import { cn } from '@/shadcn/lib/utils';
import type { PendingAttachment } from '@/root/libs/attachments/types';
import AttachmentFileInput from '@/root/components/pages/project-detail/shared/attachment-file-input';
import AttachmentRow from './attachment-row';

type Props = {
    attachments: PendingAttachment[];
    onAddFiles: (files: FileList | File[]) => void;
    onRemove: (publicId: string) => void;
    disabled?: boolean;
};

export default function AttachmentsField({ attachments, onAddFiles, onRemove, disabled }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragOver, setIsDragOver] = useState(false);

    function openFilePicker() {
        if (disabled) return;
        fileInputRef.current?.click();
    }

    return (
        <div className="flex flex-col gap-2">
            <p className="text-muted-foreground text-xs">
                Attach reference documents, screenshots, or recordings to support your brief.
            </p>
            <p className="text-muted-foreground text-xs">PDF, DOCX, PNG, JPG, MP4 and more</p>

            <AttachmentFileInput ref={fileInputRef} onFilesSelected={onAddFiles} />

            <button
                type="button"
                onClick={openFilePicker}
                disabled={disabled}
                onDragOver={(e) => {
                    e.preventDefault();
                    if (!disabled) setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setIsDragOver(false);
                    if (disabled) return;
                    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                        onAddFiles(e.dataTransfer.files);
                    }
                }}
                className={cn(
                    'focus-visible:ring-ring flex w-full flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed px-4 py-6 text-center transition-colors focus-visible:ring-2 focus-visible:outline-none',
                    isDragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:bg-muted/40',
                    disabled && 'cursor-not-allowed opacity-60',
                )}
                aria-label="Upload attachments. Drag and drop files here, or browse files"
            >
                <IconPaperclip size={20} className="text-muted-foreground" />
                <span className="text-sm">
                    Drag and drop files here, or <span className="text-primary font-medium">browse files</span>
                </span>
            </button>

            {attachments.length > 0 && (
                <div className="mt-1 flex flex-col gap-2">
                    {attachments.map((attachment) => (
                        <AttachmentRow
                            key={attachment.publicId}
                            attachment={attachment}
                            onRemove={onRemove}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
