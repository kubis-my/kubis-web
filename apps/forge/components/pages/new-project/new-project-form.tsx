'use client';

import { useNewProject } from './new-project-container';
import { Button } from '@repo/shadcn-ui/components/button';
import { Input } from '@repo/shadcn-ui/components/input';
import { Textarea } from '@repo/shadcn-ui/components/textarea';
import { Label } from '@repo/shadcn-ui/components/label';
import { Separator } from '@repo/shadcn-ui/components/separator';
import { Checkbox } from '@repo/shadcn-ui/components/checkbox';
import RichTextEditor from '@repo/shadcn-ui/components/rich-text-editor';
import Link from 'next/link';
import { ROUTE } from '@/root/libs/constants';

export default function NewProjectForm() {
    const { form, availableCompanies, onChange, onToggleCompany, onSubmit } = useNewProject();

    const isValid = form.name.trim().length > 0 && form.problem.trim().length > 0 && form.systemNeeds.trim().length > 0;

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (isValid) onSubmit();
    }

    return (
        <div className="mx-auto w-full max-w-2xl">
            <div className="mb-8">
                <h1 className="text-2xl font-semibold">New Project</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Tell us about your project so we can get started.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-10">
                <section className="flex flex-col gap-6">
                    <div>
                        <h2 className="text-base font-semibold">Project Details</h2>
                        <p className="mt-0.5 text-sm text-muted-foreground">Basic information about your project.</p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="name">Project Name *</Label>
                        <Input
                            id="name"
                            placeholder="e.g. Internal Purchase Order System"
                            value={form.name}
                            onChange={(e) => onChange('name', e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="background">Business Background</Label>
                        <Textarea
                            id="background"
                            placeholder="Briefly describe your business and what it does."
                            rows={3}
                            value={form.background}
                            onChange={(e) => onChange('background', e.target.value)}
                        />
                    </div>

                    {availableCompanies.length > 0 && (
                        <div className="flex flex-col gap-2">
                            <Label>Company</Label>
                            <p className="text-muted-foreground text-xs">
                                Select which of your companies this project is for. You can select more than one.
                            </p>
                            <div className="flex flex-col gap-2">
                                {availableCompanies.map((company) => {
                                    const checked = form.companyIds.includes(company.publicId);

                                    return (
                                        <div
                                            key={company.publicId}
                                            onClick={() => onToggleCompany(company.publicId)}
                                            className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors ${
                                                checked
                                                    ? 'border-primary bg-primary/5'
                                                    : 'hover:bg-muted/50'
                                            }`}
                                        >
                                            <Checkbox
                                                checked={checked}
                                                onCheckedChange={() => onToggleCompany(company.publicId)}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                            <span className="text-sm font-medium">{company.name}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                </section>

                <Separator />

                <section className="flex flex-col gap-6">
                    <div>
                        <h2 className="text-base font-semibold">Project Brief</h2>
                        <p className="mt-0.5 text-sm text-muted-foreground">Help us understand what you need built.</p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label>Current Problem / Pain Point *</Label>
                        <RichTextEditor
                            value={form.problem}
                            onChange={(html) => onChange('problem', html)}
                            placeholder="What is the main challenge or workflow issue you're facing right now?"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label>What the System Needs to Do *</Label>
                        <RichTextEditor
                            value={form.systemNeeds}
                            onChange={(html) => onChange('systemNeeds', html)}
                            placeholder="Describe the core workflow or features the system should handle."
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="references">Reference Systems (optional)</Label>
                        <Input
                            id="references"
                            placeholder="e.g. similar to Xero, SAP, or an existing spreadsheet setup"
                            value={form.references}
                            onChange={(e) => onChange('references', e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="expectedUsers">Expected Users (optional)</Label>
                        <Input
                            id="expectedUsers"
                            placeholder="e.g. 5–10 internal staff across operations and finance"
                            value={form.expectedUsers}
                            onChange={(e) => onChange('expectedUsers', e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label>Additional Notes (optional)</Label>
                        <RichTextEditor
                            value={form.notes}
                            onChange={(html) => onChange('notes', html)}
                            placeholder="Anything else we should know before the discovery session."
                        />
                    </div>
                </section>

                <div className="flex items-center justify-end gap-3 pb-8">
                    <Button variant="outline" asChild>
                        <Link href={ROUTE.FORGE.HOME}>Back</Link>
                    </Button>
                    <Button type="submit" disabled={!isValid}>
                        Submit Project
                    </Button>
                </div>
            </form>
        </div>
    );
}
