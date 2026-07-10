'use client';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/shadcn/components/tooltip';

export function AttachmentFilename({ filename }: { filename: string }) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <span className="truncate font-medium">{filename}</span>
            </TooltipTrigger>
            <TooltipContent>{filename}</TooltipContent>
        </Tooltip>
    );
}
