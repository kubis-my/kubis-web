'use client';

import { useProjectDetail } from './project-detail-container';
import { Separator } from '@repo/shadcn-ui/components/separator';

function RichTextView({ html }: { html: string }) {
    if (!html) return <p className="text-sm italic text-muted-foreground">Not provided.</p>;

    return <div className="prose-editor text-sm" dangerouslySetInnerHTML={{ __html: html }} />;
}

function TextField({ value }: { value: string }) {
    if (!value) return <p className="text-sm italic text-muted-foreground">Not provided.</p>;

    return <p className="text-sm">{value}</p>;
}

function BriefField({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-1.5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {label}
            </p>
            {children}
        </div>
    );
}

export default function ProjectBrief() {
    const { project } = useProjectDetail();
    const { brief } = project;

    return (
        <div className="flex w-full max-w-2xl flex-col gap-8 py-6">
            <section className="flex flex-col gap-6">
                <div>
                    <h2 className="text-base font-semibold">Project Details</h2>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                        Basic information about the project.
                    </p>
                </div>

                <BriefField label="Client">
                    <p className="text-sm">{project.clientName}</p>
                </BriefField>

                <BriefField label="Start Date">
                    <p className="text-sm">
                        {new Intl.DateTimeFormat('en-MY', { dateStyle: 'medium' }).format(
                            new Date(project.startDate),
                        )}
                    </p>
                </BriefField>

                <BriefField label="Business Background">
                    <TextField value={brief.background} />
                </BriefField>
            </section>

            <Separator />

            <section className="flex flex-col gap-6">
                <div>
                    <h2 className="text-base font-semibold">Project Brief</h2>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                        What the client wants built.
                    </p>
                </div>

                <BriefField label="Current Problem / Pain Point">
                    <RichTextView html={brief.problem} />
                </BriefField>

                <BriefField label="What the System Needs to Do">
                    <RichTextView html={brief.systemNeeds} />
                </BriefField>

                <BriefField label="Reference Systems">
                    <TextField value={brief.references} />
                </BriefField>

                <BriefField label="Expected Users">
                    <TextField value={brief.expectedUsers} />
                </BriefField>

                {brief.notes && (
                    <BriefField label="Additional Notes">
                        <RichTextView html={brief.notes} />
                    </BriefField>
                )}
            </section>
        </div>
    );
}
