import { IconNotes } from '@tabler/icons-react';
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

type Props = {
    milestone: Milestone;
};

export default function MilestoneCard({ milestone }: Props) {
    const config = STATUS_CONFIG[milestone.status];
    const notes = milestone.notes ?? [];

    return (
        <section className="bg-card overflow-hidden rounded-xl border shadow-sm">
            <div className="bg-muted/30 flex items-center justify-between border-b px-4 py-3 sm:px-5">
                <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold tracking-tight">{milestone.name}</h3>
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
