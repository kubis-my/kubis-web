import { IconArrowRight } from '@tabler/icons-react';
import { Badge } from '@repo/shadcn-ui/components/badge';
import { cn } from '@repo/shadcn-ui/lib/utils';
import { type Project } from './types';
import { StatusBadge } from './status-badge';

function formatDate(value: string) {
    return new Intl.DateTimeFormat('en-MY', { dateStyle: 'medium' }).format(new Date(value));
}

function ProjectAvatar({ name }: { name: string }) {
    const initials = name
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() ?? '')
        .join('');

    return (
        <div className="from-primary/15 to-primary/5 text-primary ring-primary/10 flex size-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br text-xs font-bold tracking-wide ring-1 ring-inset">
            {initials}
        </div>
    );
}

function NotificationBadge({ count }: { count: number }) {
    const label = count > 99 ? '99+' : String(count);
    return (
        <span className="absolute -right-2 -top-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-semibold leading-none text-white shadow-sm">
            {label}
        </span>
    );
}

export function ProjectCard({
    project,
    onOpen,
}: {
    project: Project;
    onOpen: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onOpen}
            className={cn(
                'group w-full rounded-2xl border border-zinc-100 bg-white p-4 text-left shadow-sm',
                'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md',
                'dark:border-zinc-800 dark:bg-zinc-900',
            )}
        >
            <div className="flex items-center gap-3">
                <ProjectAvatar name={project.name} />
                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        {project.name}
                    </p>
                    <p className="text-muted-foreground mt-0.5 truncate text-xs">
                        {project.clientName}
                    </p>
                </div>
                <div className="relative shrink-0">
                    <StatusBadge status={project.status} />
                    {project.unreadCount > 0 && <NotificationBadge count={project.unreadCount} />}
                </div>
            </div>
            <div className="mt-4 border-t border-zinc-100 pt-3 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-xs">
                            {formatDate(project.startDate)}
                        </span>
                        {project.plan && (
                            <Badge
                                variant="outline"
                                className="h-auto rounded-full px-1.5 py-0 text-[10px]"
                            >
                                {project.plan}
                            </Badge>
                        )}
                    </div>
                    <span className="text-muted-foreground group-hover:text-foreground inline-flex items-center gap-1 text-xs transition-colors">
                        Open
                        <IconArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                </div>
            </div>
        </button>
    );
}
