'use client';

import { IconCheck, IconCircle, IconCircleDashed } from '@tabler/icons-react';
import { useProjectDetail } from './project-detail-container';
import type { MilestoneNote, MilestoneStatus } from './project-detail-container';
import { cn } from '@repo/shadcn-ui/lib/utils';

const STATUS_CONFIG: Record<
    MilestoneStatus,
    { label: string; iconClass: string; badgeClass: string; Icon: React.ElementType }
> = {
    Done: {
        label: 'Done',
        Icon: IconCheck,
        iconClass: 'bg-green-500 text-white',
        badgeClass: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
    },
    'In Progress': {
        label: 'In Progress',
        Icon: IconCircle,
        iconClass: 'bg-purple-500 text-white',
        badgeClass: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800',
    },
    Upcoming: {
        label: 'Upcoming',
        Icon: IconCircleDashed,
        iconClass: 'bg-muted text-muted-foreground',
        badgeClass: 'bg-muted text-muted-foreground border-border',
    },
};

const dateFormatter = new Intl.DateTimeFormat('en-MY', { dateStyle: 'medium' });

export default function ProjectMilestones() {
    const { project } = useProjectDetail();
    const { milestones } = project;
    const milestoneWithNotes = milestones.filter((m) => m.notes?.length);

    return (
        <div className="flex w-full flex-col gap-8 py-6">
            <div>
                <h2 className="text-base font-semibold">Milestone Tracker</h2>
                <p className="mt-0.5 text-sm text-muted-foreground">
                    High-level delivery phases for this project.
                </p>
            </div>

            <div className="flex items-start">
                {milestones.map((milestone, index) => {
                    const config = STATUS_CONFIG[milestone.status];
                    const isFirst = index === 0;
                    const isLast = index === milestones.length - 1;
                    const prevDone = index > 0 && milestones[index - 1].status === 'Done';
                    const isDone = milestone.status === 'Done';

                    return (
                        <div key={milestone.id} className="flex flex-1 flex-col items-center">
                            <div className="flex w-full items-center">
                                <div
                                    className={cn(
                                        'h-px flex-1',
                                        isFirst ? 'invisible' : prevDone || isDone ? 'bg-green-400' : 'bg-border',
                                    )}
                                />
                                <div
                                    className={cn(
                                        'flex size-9 shrink-0 items-center justify-center rounded-full',
                                        config.iconClass,
                                    )}
                                >
                                    <config.Icon size={16} stroke={2.5} />
                                </div>
                                <div
                                    className={cn(
                                        'h-px flex-1',
                                        isLast ? 'invisible' : isDone ? 'bg-green-400' : 'bg-border',
                                    )}
                                />
                            </div>

                            <div className="mt-3 flex flex-col items-center gap-1.5 px-1 text-center">
                                <p className="text-sm font-medium leading-tight">{milestone.name}</p>
                                <span
                                    className={cn(
                                        'rounded-md border px-1.5 py-0.5 text-xs font-medium',
                                        config.badgeClass,
                                    )}
                                >
                                    {config.label}
                                </span>
                                <p className="text-xs text-muted-foreground">
                                    Est. {dateFormatter.format(new Date(milestone.estimatedDate))}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {milestoneWithNotes.length > 0 && (
                <div className="space-y-5">
                    {milestoneWithNotes.map((milestone) => {
                        const config = STATUS_CONFIG[milestone.status];
                        const notes = milestone.notes as MilestoneNote[];

                        return (
                            <section
                                key={milestone.id}
                                className="overflow-hidden rounded-xl border bg-card shadow-sm"
                            >
                                <div className="flex items-center justify-between border-b bg-muted/30 px-4 py-3 sm:px-5">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-sm font-semibold tracking-tight">
                                            {milestone.name}
                                        </h3>
                                        <span
                                            className={cn(
                                                'rounded-md border px-2 py-0.5 text-xs font-medium',
                                                config.badgeClass,
                                            )}
                                        >
                                            {config.label}
                                        </span>
                                    </div>
                                </div>

                                <div className="divide-y">
                                    {notes.map((note, i) => (
                                        <article
                                            key={i}
                                            className="grid gap-3 px-4 py-4 sm:grid-cols-[108px_1fr] sm:gap-4 sm:px-5"
                                        >
                                            <div className="sm:pt-1">
                                                <p className="text-xs font-medium text-muted-foreground">
                                                    {dateFormatter.format(new Date(note.date))}
                                                </p>
                                            </div>

                                            <div
                                                className="prose-editor text-sm leading-6"
                                                dangerouslySetInnerHTML={{ __html: note.content }}
                                            />
                                        </article>
                                    ))}
                                </div>
                            </section>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
