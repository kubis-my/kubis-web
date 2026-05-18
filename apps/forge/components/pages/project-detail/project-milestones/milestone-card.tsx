import { IconDots, IconNote, IconNotes, IconPencil } from '@tabler/icons-react';
import { cn } from '@repo/shadcn-ui/lib/utils';
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/shadcn/components/empty';
import type { Milestone } from '../project-detail-container';
import { STATUS_CONFIG, dateFormatter } from './milestone-status';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shadcn/components/dropdown-menu';
import { Button } from '@/shadcn/components/button';
import { useAuth } from '@/shadcn/providers/auth-provider';
import { hasSuperAdminAccess } from '@repo/commons/utils/auth';
import { useState } from 'react';
import { AddNoteDialog } from './add-note-dialog';
import { EditMilestoneDialog } from './edit-milestone-dialog';

type Props = {
    milestone: Milestone;
};

export default function MilestoneCard({ milestone }: Props) {
    const config = STATUS_CONFIG[milestone.status];
    const notes = milestone.notes ?? [];
    const auth = useAuth();
    const [editOpen, setEditOpen] = useState(false);
    const [addNoteOpen, setAddNoteOpen] = useState(false);

    return (
        <section className={cn("bg-card overflow-hidden rounded-xl border shadow-sm", config.borderClass)}>
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
                            Due {dateFormatter.format(new Date(milestone.estimatedDate))}
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
                            className="grid gap-3 px-4 py-4 sm:grid-cols-[108px_1fr] sm:gap-4 sm:px-5"
                        >
                            <div className="sm:pt-1">
                                <p className="text-muted-foreground text-xs font-medium">
                                    {dateFormatter.format(new Date(note.date))}
                                </p>
                            </div>

                            <div
                                className="prose-editor text-sm leading-6"
                                dangerouslySetInnerHTML={{ __html: note.content }}
                            />
                        </article>
                    ))
                )}
            </div>
        </section>
    );
}
