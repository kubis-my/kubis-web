'use client';

import { forwardRef } from 'react';
import { ATTACHMENT_ACCEPT } from '@/root/libs/attachments/constants';

type Props = {
    onFilesSelected: (files: FileList) => void;
};

export default forwardRef<HTMLInputElement, Props>(
    function AttachmentFileInput({ onFilesSelected }, ref) {
        return (
            <input
                ref={ref}
                type="file"
                multiple
                accept={ATTACHMENT_ACCEPT}
                className="hidden"
                onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                        onFilesSelected(e.target.files);
                    }
                    e.target.value = '';
                }}
            />
        );
    },
);
