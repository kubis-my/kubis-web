'use client';

import { useEffect, useRef, useState } from 'react';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { Button } from '@repo/shadcn-ui/components/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shadcn/components/tooltip';
import { cn } from '@/shadcn/lib/utils';
import type { PendingAttachment } from '@/root/libs/attachments/types';
import { AttachmentSummaryThumbnail } from '@/root/components/pages/project-detail/shared/attachment-summary-thumbnail';
import PendingAttachmentCard from '@/root/components/pages/project-detail/shared/pending-attachment-card';

type Props = {
    attachments: PendingAttachment[];
    onRemove: (publicId: string) => void;
};

const MAX_SUMMARY_THUMBNAILS_DESKTOP = 4;
const MAX_SUMMARY_THUMBNAILS_MOBILE = 2;

export default function AttachmentPreviewList({ attachments, onRemove }: Props) {
    const [expanded, setExpanded] = useState(true);
    const previousCountRef = useRef(0);

    useEffect(() => {
        if (previousCountRef.current === 0 && attachments.length > 0) {
            setExpanded(true);
        }
        previousCountRef.current = attachments.length;
    }, [attachments.length]);

    if (attachments.length === 0) return null;

    const summaryAttachments = attachments.slice(0, MAX_SUMMARY_THUMBNAILS_DESKTOP);
    const remainingDesktop = Math.max(0, attachments.length - MAX_SUMMARY_THUMBNAILS_DESKTOP);
    const remainingMobile = Math.max(0, attachments.length - MAX_SUMMARY_THUMBNAILS_MOBILE);

    return (
        <div className="bg-muted/20 border-border/70 mb-2 rounded-lg border-t">
            <div
                onClick={() => setExpanded((prev) => !prev)}
                className="flex cursor-pointer items-center justify-between gap-2 px-2 pt-1.5 pb-1"
            >
                <div className="flex min-w-0 items-center gap-2">
                    <span className="text-muted-foreground shrink-0 text-xs font-medium">
                        Attachments ({attachments.length})
                    </span>

                    {!expanded ? (
                        <div className="flex min-w-0 items-center gap-1.5 overflow-hidden">
                            <div className="flex items-center -space-x-1.5">
                                {summaryAttachments.map((attachment, index) => (
                                    <AttachmentSummaryThumbnail
                                        key={attachment.publicId}
                                        attachment={attachment}
                                        className={cn(
                                            'size-5 shrink-0',
                                            index >= MAX_SUMMARY_THUMBNAILS_MOBILE && 'hidden sm:flex',
                                        )}
                                    />
                                ))}
                            </div>

                            {remainingDesktop > 0 ? (
                                <span className="text-muted-foreground hidden shrink-0 text-[11px] sm:inline">
                                    +{remainingDesktop} more
                                </span>
                            ) : null}
                            {remainingMobile > 0 ? (
                                <span className="text-muted-foreground shrink-0 text-[11px] sm:hidden">
                                    +{remainingMobile} more
                                </span>
                            ) : null}
                        </div>
                    ) : null}
                </div>

                <div className="flex shrink-0 items-center gap-3">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                aria-expanded={expanded}
                                aria-label={expanded ? 'Collapse attachments' : 'Expand attachments'}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setExpanded((prev) => !prev);
                                }}
                                className="text-muted-foreground hover:bg-muted hover:text-foreground"
                            >
                                {expanded ? (
                                    <IconChevronUp className="size-3.5" />
                                ) : (
                                    <IconChevronDown className="size-3.5" />
                                )}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>{expanded ? 'Collapse attachments' : 'Expand attachments'}</TooltipContent>
                    </Tooltip>
                </div>
            </div>

            <div
                className={cn(
                    'grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none',
                    expanded ? 'grid-rows-[1fr] mt-2' : 'grid-rows-[0fr]',
                )}
            >
                <div
                    className={cn(
                        'overflow-hidden transition-opacity duration-150 motion-reduce:transition-none',
                        expanded ? 'opacity-100' : 'opacity-0',
                    )}
                >
                    <div className="scrollbar-hide grid max-h-80 grid-cols-[repeat(auto-fill,minmax(220px,1fr))] justify-items-start gap-2 overflow-y-auto px-2 pb-2">
                        {attachments.map((attachment) => (
                            <PendingAttachmentCard
                                key={attachment.publicId}
                                attachment={attachment}
                                onRemove={onRemove}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
