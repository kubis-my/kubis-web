import { IconArrowRight } from '@tabler/icons-react';
import { Badge } from '@repo/shadcn-ui/components/badge';
import { cn } from '@repo/shadcn-ui/lib/utils';
import { type Project, type ProjectStatus } from './types';
import { StatusBadge } from './status-badge';

const STATUS_ACCENT: Record<ProjectStatus, string> = {
    'Pending Review': 'border-l-amber-400',
    Discovery: 'border-l-blue-400',
    'MVP Build': 'border-l-violet-500',
    Validation: 'border-l-orange-400',
    Production: 'border-l-emerald-400',
    'On Hold': 'border-l-zinc-400',
    Cancelled: 'border-l-red-400',
};

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
        <div className="from-primary/20 to-primary/5 text-primary ring-primary/20 flex size-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br text-xs font-bold tracking-wide ring-1 ring-inset">
            {initials}
        </div>
    );
}

export function ProjectCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
    return (
        <button
            type="button"
            onClick={onOpen}
            className={cn(
                'group rounded-2xl border border-l-4 p-4 text-left transition-all duration-200',
                'hover:bg-muted/40 hover:-translate-y-0.5 hover:shadow-md',
                STATUS_ACCENT[project.status],
            )}
        >
            <div className="flex items-start gap-3">
                <ProjectAvatar name={project.name} />
                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{project.name}</p>
                    <p className="text-muted-foreground mt-0.5 truncate text-xs">
                        {project.clientName}
                    </p>
                </div>
                <StatusBadge status={project.status} />
            </div>
            <div className="border-border mt-3 flex items-center justify-between border-t pt-3">
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
        </button>
    );
}
