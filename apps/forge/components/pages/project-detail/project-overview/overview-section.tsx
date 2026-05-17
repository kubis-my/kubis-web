import { useProjectDetail } from '../project-detail-container';
import { BriefField } from './brief-field';
import { RichTextView } from './rich-text-view';
import { TextField } from './text-field';

export function OverviewSection() {
    const { project } = useProjectDetail();
    const { brief } = project;

    return (
        <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
            <div className="border-b bg-muted/30 px-4 py-3 sm:px-5">
                <h2 className="text-base font-semibold">Overview</h2>
                <p className="mt-0.5 text-sm text-muted-foreground">What the client wants built.</p>
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
    );
}
