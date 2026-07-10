'use client';

import { useRef } from 'react';
import { IconPaperclip } from '@tabler/icons-react';
import ToolbarButton from '@repo/shadcn-ui/components/rich-text-editor-toolbar-button';
import AttachmentFileInput from '@/root/components/pages/project-detail/shared/attachment-file-input';

type Props = {
    onFilesSelected: (files: FileList) => void;
    disabled?: boolean;
};

export default function AttachmentPickerButton({ onFilesSelected, disabled }: Props) {
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <>
            <AttachmentFileInput ref={inputRef} onFilesSelected={onFilesSelected} />

            <ToolbarButton
                title="Attach file"
                disabled={disabled}
                onClick={() => inputRef.current?.click()}
            >
                <IconPaperclip size={14} />
            </ToolbarButton>
        </>
    );
}
