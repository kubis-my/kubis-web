import { useProjectDetail } from '../project-detail-container';

export function StatsSection() {
    const { project } = useProjectDetail();
    const dateFormatter = new Intl.DateTimeFormat('en-MY', { dateStyle: 'medium' });
    const activeMilestone =
        project.milestones.find((milestone) => milestone.status === 'In Progress') ??
        project.milestones.find((milestone) => milestone.status === 'Done') ??
        project.milestones[0];

    return (
        <section className="rounded-xl border bg-card shadow-sm">
            <div className="grid gap-0.5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="border-b px-4 py-3 sm:border-r sm:border-b-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Current Phase
                    </p>
                    <p className="mt-1 text-sm font-semibold">{activeMilestone?.name ?? 'N/A'}</p>
                </div>

                <div className="border-b px-4 py-3 lg:border-r lg:border-b-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Start Date
                    </p>
                    <p className="mt-1 text-sm font-semibold">
                        {dateFormatter.format(new Date(project.startDate))}
                    </p>
                </div>

                <div className="border-b px-4 py-3 sm:border-b-0 sm:border-r lg:border-b-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Staging URL
                    </p>
                    {project.stagingUrl ? (
                        <a
                            href={project.stagingUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-1 block truncate text-sm font-semibold text-primary hover:underline"
                        >
                            {project.stagingUrl}
                        </a>
                    ) : (
                        <p className="mt-1 text-sm font-semibold text-muted-foreground">
                            Not available
                        </p>
                    )}
                </div>

                <div className="px-4 py-3 lg:border-r-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Milestones
                    </p>
                    <p className="mt-1 text-sm font-semibold">{project.milestones.length} total</p>
                </div>
            </div>
        </section>
    );
}
