'use client';

import { useEffect, useState } from 'react';
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
import { TriangleAlert } from 'lucide-react';
import { useDashboard02 } from '@/shadcn/dashboards/dashboard-02';

export default function NewProjectForm() {
    const { updateBreadcrumbList } = useDashboard02();
    const { form, availableCompanies, isSubmitting, onChange, onToggleCompany, onSubmit } =
        useNewProject();

    const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

    const isValid =
        form.name.trim().length > 0 &&
        form.problem !== null &&
        form.systemNeeds !== null;

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setHasAttemptedSubmit(true);
        if (isValid) onSubmit();
    }

    useEffect(() => {
        updateBreadcrumbList([
            {
                name: "Projects",
                url: ROUTE.FORGE.HOME
            },
            {
                name: "New"
            }
        ]);

        return () => {
            updateBreadcrumbList([]);
        }
    }, [updateBreadcrumbList])

    return (
        <div className="mx-auto w-full max-w-2xl">
            <div className="mb-8">
                <h1 className="text-2xl font-semibold">New Project</h1>
                <p className="text-muted-foreground mt-1 text-sm">
                    Tell us about your project so we can get started.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-10">
                <section className="flex flex-col gap-6">
                    <div>
                        <h2 className="text-base font-semibold">
                            <span className="text-muted-foreground mr-2 font-normal">1.</span>
                            Project Details
                        </h2>
                        <p className="text-muted-foreground mt-0.5 text-sm">
                            Basic information about your project.
                        </p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="name"><span>Project Name<span className='text-red-500 ml-0.5'>*</span></span></Label>
                        <Input
                            id="name"
                            placeholder="e.g. Internal Purchase Order System"
                            value={form.name}
                            autoComplete="off"
                            onChange={(e) => onChange('name', e.target.value)}
                            className={
                                hasAttemptedSubmit && !form.name.trim()
                                    ? 'border-destructive focus-visible:ring-destructive'
                                    : ''
                            }
                        />
                        {hasAttemptedSubmit && !form.name.trim() && (
                            <p className="text-destructive text-xs">Project name is required.</p>
                        )}
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
                                Select which of your companies this project is for. You can select
                                more than one.
                            </p>
                            <div className="flex flex-col gap-2">
                                {availableCompanies.map((company) => {
                                    const checked = form.companyIds.includes(company.publicId);

                                    return (
                                        <div
                                            key={company.publicId}
                                            onClick={(e) => {
                                                if ((e.target as HTMLElement).tagName === 'INPUT')
                                                    return;
                                                onToggleCompany(company.publicId);
                                            }}
                                            className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors ${checked
                                                ? 'border-primary bg-primary/5'
                                                : 'hover:bg-muted/50'
                                                }`}
                                        >
                                            <Checkbox
                                                checked={checked}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onToggleCompany(company.publicId);
                                                }}
                                            />
                                            <span className="text-sm font-medium">
                                                {company.name}
                                            </span>
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
                        <h2 className="text-base font-semibold">
                            <span className="text-muted-foreground mr-2 font-normal">2.</span>
                            Project Brief
                        </h2>
                        <p className="text-muted-foreground mt-0.5 text-sm">
                            Help us understand what you need built.
                        </p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label><span>Current Problem / Pain Point<span className='text-red-500 ml-0.5'>*</span></span></Label>
                        <RichTextEditor
                            value={form.problem}
                            onChange={(value) => onChange('problem', value)}
                            placeholder="What is the main challenge or workflow issue you're facing right now?"
                        />
                        {hasAttemptedSubmit && !form.problem && (
                            <p className="text-destructive text-xs">This field is required.</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label><span>What the System Needs to Do<span className='text-red-500 ml-0.5'>*</span></span></Label>
                        <RichTextEditor
                            value={form.systemNeeds}
                            onChange={(value) => onChange('systemNeeds', value)}
                            placeholder="Describe the core workflow or features the system should handle."
                        />
                        {hasAttemptedSubmit && !form.systemNeeds && (
                            <p className="text-destructive text-xs">This field is required.</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="references">Reference Systems (optional)</Label>
                        <Input
                            id="references"
                            placeholder="e.g. similar to Xero, SAP, or an existing spreadsheet setup"
                            value={form.references}
                            onChange={(e) => onChange('references', e.target.value)}
                            autoComplete="off"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="expectedUsers">Expected Users (optional)</Label>
                        <Input
                            id="expectedUsers"
                            placeholder="e.g. 5–10 internal staff across operations and finance"
                            value={form.expectedUsers}
                            onChange={(e) => onChange('expectedUsers', e.target.value)}
                            autoComplete="off"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label>Additional Notes (optional)</Label>
                        <RichTextEditor
                            value={form.notes}
                            onChange={(value) => onChange('notes', value)}
                            placeholder="Anything else we should know before the discovery session."
                        />
                    </div>
                    <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm dark:border-amber-800 dark:bg-amber-950/40">
                        <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                        <p>
                            <span className="font-semibold text-amber-900 dark:text-amber-200">
                                Please review carefully before submitting.
                            </span>{' '}
                            <span className="text-amber-800 dark:text-amber-300">
                                Your requirements and brief cannot be edited once the project is
                                submitted.
                            </span>
                        </p>
                    </div>
                </section>

                <div className="flex items-center justify-end gap-3 pb-8">
                    <Button variant="outline" asChild>
                        <Link href={ROUTE.FORGE.HOME}>Back</Link>
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit Project'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
