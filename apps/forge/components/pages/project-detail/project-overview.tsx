'use client';

import { useProjectDetail } from './project-detail-container';
import { Separator } from '@repo/shadcn-ui/components/separator';

function RichTextView({ html, emptyMessage }: { html: string; emptyMessage: string }) {
    if (!html) return <p className="text-sm italic text-muted-foreground">{emptyMessage}</p>;

    return (
        <div
            className="prose-editor text-sm leading-6 text-foreground/90"
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}

function TextField({ value, emptyMessage }: { value: string; emptyMessage: string }) {
    if (!value) return <p className="text-sm italic text-muted-foreground">{emptyMessage}</p>;

    return <p className="text-sm leading-6 text-foreground/90">{value}</p>;
}

function BriefField({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {label}
            </p>
            {children}
        </div>
    );
}

export default function ProjectOverview() {
    const { project } = useProjectDetail();
    const { brief } = project;
    const dateFormatter = new Intl.DateTimeFormat('en-MY', { dateStyle: 'medium' });
    const activeMilestone =
        project.milestones.find((milestone) => milestone.status === 'In Progress') ??
        project.milestones.find((milestone) => milestone.status === 'Done') ??
        project.milestones[0];

    return (
        <div className="flex w-full flex-col gap-8 py-2">
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

            <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
                <div className="border-b bg-muted/30 px-4 py-3 sm:px-5">
                    <h2 className="text-base font-semibold">Project Details</h2>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                        Basic information about the project.
                    </p>
                </div>

                <div className="grid px-4 py-4 sm:px-5">
                    <BriefField label="Companies">
                        {project.companyNames.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {project.companyNames.map((company) => (
                                    <span
                                        key={company}
                                        className="rounded-md border bg-muted/30 px-2 py-1 text-xs font-medium text-foreground/90"
                                    >
                                        {company}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm italic text-muted-foreground">
                                No company associations documented yet.
                            </p>
                        )}
                    </BriefField>
                </div>

                <div className="border-t px-4 py-4 sm:px-5">
                    <BriefField label="Business Background">
                        <TextField
                            value={brief.background}
                            emptyMessage="No business background documented yet."
                        />
                    </BriefField>
                </div>
            </section>

            <Separator />

            <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
                <div className="border-b bg-muted/30 px-4 py-3 sm:px-5">
                    <h2 className="text-base font-semibold">Overview</h2>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                        What the client wants built.
                    </p>
                </div>

                <div className="divide-y">
                    <div className="px-4 py-4 sm:px-5">
                        <BriefField label="Current Problem / Pain Point">
                            <RichTextView
                                html={brief.problem}
                                emptyMessage="No problem statement documented yet."
                            />
                        </BriefField>
                    </div>

                    <div className="px-4 py-4 sm:px-5">
                        <BriefField label="What the System Needs to Do">
                            <RichTextView
                                html={brief.systemNeeds}
                                emptyMessage="No system requirements documented yet."
                            />
                        </BriefField>
                    </div>

                    <div className="grid gap-4 px-4 py-4 sm:grid-cols-2 sm:gap-5 sm:px-5">
                        <div className="rounded-md border p-3">
                            <BriefField label="Reference Systems">
                                <TextField
                                    value={brief.references}
                                    emptyMessage="No reference systems documented yet."
                                />
                            </BriefField>
                        </div>

                        <div className="rounded-md border p-3">
                            <BriefField label="Expected Users">
                                <TextField
                                    value={brief.expectedUsers}
                                    emptyMessage="No expected user profile documented yet."
                                />
                            </BriefField>
                        </div>
                    </div>

                    <div className="mx-4 my-4 rounded-md border p-3 sm:mx-5">
                        <BriefField label="Additional Notes">
                            <RichTextView
                                html={brief.notes}
                                emptyMessage="No additional notes documented yet."
                            />
                        </BriefField>
                    </div>
                </div>
            </section>
        </div>
    );
}
