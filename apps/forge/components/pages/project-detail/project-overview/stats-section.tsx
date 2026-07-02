import { formatDateTime } from '@repo/commons/utils/date';
import { useProjectDetail } from '../project-detail-container';

export function StatsSection() {
    const { project } = useProjectDetail();
    const activeMilestone =
        project.milestones.find((milestone) => milestone.status === 'In Progress') ??
        project.milestones.find((milestone) => milestone.status === 'Done') ??
        project.milestones[0];

    return (
        <section className="bg-card rounded-xl border shadow-sm">
            <div className="grid gap-0.5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="border-b px-4 py-3 sm:border-r sm:border-b-0">
                    <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                        Current Phase
                    </p>
                    <p className="mt-1 text-sm font-semibold">{activeMilestone?.name ?? 'N/A'}</p>
                </div>

                <div className="border-b px-4 py-3 lg:border-r lg:border-b-0">
                    <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                        Start Date
                    </p>
                    <p className="mt-1 text-sm font-semibold">
                        {formatDateTime(project.startAt ?? project.createdAt, { format: 'dd MMM yyyy' })}
                    </p>
                </div>

                <div className="border-b px-4 py-3 sm:border-r sm:border-b-0 lg:border-b-0">
                    <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                        Staging URL
                    </p>
                    {project.stagingUrl ? (
                        <a
                            href={project.stagingUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary mt-1 block truncate text-sm font-semibold hover:underline"
                        >
                            {project.stagingUrl}
                        </a>
                    ) : (
                        <p className="text-muted-foreground mt-1 text-sm font-semibold">
                            Not available
                        </p>
                    )}
                </div>

                <div className="px-4 py-3 lg:border-r-0">
                    <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                        Milestones
                    </p>
                    <p className="mt-1 text-sm font-semibold">{project.milestones.length} total</p>
                </div>
            </div>
        </section>
    );
}
