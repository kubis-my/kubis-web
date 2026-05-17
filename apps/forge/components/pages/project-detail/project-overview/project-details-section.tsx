import { useProjectDetail } from '../project-detail-container';
import { BriefField } from './brief-field';
import { TextField } from './text-field';

export function ProjectDetailsSection() {
    const { project } = useProjectDetail();
    const { brief } = project;

    return (
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
    );
}
