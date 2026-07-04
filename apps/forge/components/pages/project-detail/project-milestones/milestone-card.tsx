import { IconDots, IconNote, IconNotes, IconPencil } from '@tabler/icons-react';
import { cn } from '@repo/shadcn-ui/lib/utils';
import { richTextToHtml } from '@repo/shadcn-ui/components/rich-text-editor';
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/shadcn/components/empty';
import { formatDateTime } from '@repo/commons/utils/date';
import type { Milestone } from '../project-detail-container';
import { STATUS_CONFIG } from './milestone-status';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shadcn/components/dropdown-menu';
import { Button } from '@/shadcn/components/button';
import { useAuth } from '@/shadcn/providers/auth-provider';
import { hasSuperAdminAccess } from '@repo/commons/utils/auth';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { AddNoteDialog } from './add-note-dialog';
import { EditMilestoneDialog } from './edit-milestone-dialog';

type Props = {
    milestone: Milestone;
    highlightedMilestoneId?: string;
    highlightedNoteId?: string;
};

const MilestoneNoteContent = memo(function MilestoneNoteContent({
    content,
}: {
    content: object | null;
}) {
    const html = useMemo(() => richTextToHtml(content), [content]);

    return (
        <div className="prose-editor text-sm leading-6" dangerouslySetInnerHTML={{ __html: html }} />
    );
});

export default function MilestoneCard({ milestone, highlightedMilestoneId, highlightedNoteId }: Props) {
    const config = STATUS_CONFIG[milestone.status];
    const notes = milestone.notes ?? [];
    const auth = useAuth();
    const [editOpen, setEditOpen] = useState(false);
    const [addNoteOpen, setAddNoteOpen] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);
    const noteRefs = useRef<Map<string, HTMLElement>>(new Map());

    const isMilestoneHighlighted = highlightedMilestoneId === milestone.id;

    useEffect(() => {
        if (isMilestoneHighlighted && sectionRef.current) {
            sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [isMilestoneHighlighted]);

    useEffect(() => {
        if (highlightedNoteId) {
            const el = noteRefs.current.get(highlightedNoteId);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [highlightedNoteId]);

    return (
        <section
            ref={sectionRef}
            className={cn(
                "bg-card overflow-hidden rounded-xl border shadow-sm transition-shadow",
                isMilestoneHighlighted && "ring-2 ring-blue-400/50 ",
            )}
        >
            <div className="bg-muted/30 flex items-center justify-between border-b px-4 py-3 sm:px-5">
                <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold tracking-tight">{milestone.name}</h3>
                    <span
                        className={cn(
                            'flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium',
                            config.badgeClass,
                        )}
                    >
                        <config.Icon className="size-3" />
                        {config.label}
                    </span>
                    {milestone.estimatedDate && (
                        <span className="text-muted-foreground text-xs">
                            Due {formatDateTime(milestone.estimatedDate, { format: 'dd MMM yyyy' })}
                        </span>
                    )}
                </div>
                {hasSuperAdminAccess(auth.authUser?.companies ?? []) && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-8 shrink-0">
                                <IconDots className="size-4" />
                                <span className="sr-only">Actions</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onSelect={() => setEditOpen(true)}>
                                <IconPencil className="size-4" />
                                Edit Milestone
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => setAddNoteOpen(true)}>
                                <IconNote className="size-4" />
                                Add Note
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
                <EditMilestoneDialog open={editOpen} onOpenChange={setEditOpen} milestone={milestone} />
                <AddNoteDialog open={addNoteOpen} onOpenChange={setAddNoteOpen} milestonePublicId={milestone.id} />
            </div>

            <div className="divide-y">
                {notes.length === 0 ? (
                    <Empty className="col-span-full">
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <IconNotes />
                            </EmptyMedia>
                            <EmptyTitle>No Updates Yet</EmptyTitle>
                            <EmptyDescription>
                                There are no updates for this milestone yet.
                            </EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                ) : (
                    notes.map((note, i) => (
                        <article
                            key={`${note.date}-${i}`}
                            ref={(el) => {
                                if (el) noteRefs.current.set(note.id, el);
                                else noteRefs.current.delete(note.id);
                            }}
                            className={cn(
                                "grid gap-3 px-4 py-4 sm:grid-cols-[108px_1fr] sm:gap-4 sm:px-5",
                                highlightedNoteId === note.id && "bg-blue-50/60 dark:bg-blue-950/20 ",
                            )}
                        >
                            <div className="sm:pt-1">
                                <p className="text-muted-foreground text-xs font-medium">
                                    {formatDateTime(note.date, { format: 'dd MMM yyyy' })}
                                </p>
                            </div>

                            <MilestoneNoteContent content={note.content} />
                        </article>
                    ))
                )}
            </div>
        </section>
    );
}
