'use client';

import { useCallback, useMemo, useState } from 'react';
import { useFormDirty } from '@repo/commons/hooks/use-form-dirty';
import { format } from 'date-fns';
import { CalendarIcon, Loader2Icon } from 'lucide-react';
import { toast } from 'sonner';
import { gql, TypedDocumentNode } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { Button } from '@/shadcn/components/button';
import { Input } from '@/shadcn/components/input';
import { Label } from '@/shadcn/components/label';
import { Calendar } from '@/shadcn/components/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/shadcn/components/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shadcn/components/select';
import { useAuth } from '@/shadcn/providers/auth-provider';
import { hasSuperAdminAccess } from '@repo/commons/utils/auth';
import { hasGraphQLError } from '@repo/commons/utils/graphql';
import { useProjectDetail } from '../project-detail-container';
import { type ProjectStatus } from '../../project-root/types';
import {
    ProjectStatus as GqlProjectStatus,
    type UpdateProjectStatusInput,
    type Project as GqlProject,
} from '@repo/commons/types/forge-service-schema.type';

const PROJECT_STATUS_OPTIONS: ProjectStatus[] = [
    'Pending Review',
    'Discovery',
    'MVP Build',
    'Validation',
    'Production',
    'On Hold',
    'Cancelled',
];

const STATUS_TO_GQL: Record<ProjectStatus, GqlProjectStatus> = {
    'Pending Review': GqlProjectStatus.PENDING_REVIEW,
    'Discovery': GqlProjectStatus.DISCOVERY,
    'MVP Build': GqlProjectStatus.MVP_BUILD,
    'Validation': GqlProjectStatus.VALIDATION,
    'Production': GqlProjectStatus.PRODUCTION,
    'On Hold': GqlProjectStatus.ON_HOLD,
    'Cancelled': GqlProjectStatus.CANCELLED,
};

interface UpdateProjectStatusResponse {
    updateProjectStatusForForge: Pick<GqlProject, 'publicId' | 'name' | 'status' | 'projectSettings'>;
}

interface UpdateProjectStatusVariables {
    input: UpdateProjectStatusInput;
}

const UPDATE_PROJECT_STATUS: TypedDocumentNode<
    UpdateProjectStatusResponse,
    UpdateProjectStatusVariables
> = gql`
    mutation UpdateProjectStatusForForge($input: UpdateProjectStatusInput!) {
        updateProjectStatusForForge(input: $input) {
            publicId
            name
            status
            projectSettings {
                publicId
                stagingUrl
                productionUrl
            }
        }
    }
`;

export default function ProjectDetailsSection() {
    const { project } = useProjectDetail();
    const { authUser } = useAuth();
    const isKubisTeam = useMemo(() => hasSuperAdminAccess(authUser?.companies ?? []), [authUser]);
    const [updateProjectStatus] = useMutation(UPDATE_PROJECT_STATUS);

    const [name, setName] = useState(project.name);
    const [status, setStatus] = useState<ProjectStatus>(project.status);
    const [startDate, setStartDate] = useState<Date | undefined>(
        project.startAt ? new Date(project.startAt) : undefined,
    );
    const [goLiveDate, setGoLiveDate] = useState<Date | undefined>(
        project.expectedGoLiveAt ? new Date(project.expectedGoLiveAt) : undefined,
    );
    const [stagingUrl, setStagingUrl] = useState(project.projectSettings?.stagingUrl ?? '');
    const [productionUrl, setProductionUrl] = useState(project.projectSettings?.productionUrl ?? '');
    const [startCalendarOpen, setStartCalendarOpen] = useState(false);
    const [goLiveCalendarOpen, setGoLiveCalendarOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    const formData = {
        name,
        status,
        startDate: startDate?.toISOString() ?? null,
        goLiveDate: goLiveDate?.toISOString() ?? null,
        stagingUrl,
        productionUrl,
    };
    const { isDirty, setOriginal } = useFormDirty(formData);

    const handleSave = useCallback(async () => {
        if (!name.trim()) {
            toast.error('Project name is required.', { position: 'top-center' });
            return;
        }

        setSaving(true);

        try {
            const { data, error } = await updateProjectStatus({
                variables: {
                    input: {
                        publicId: project.id,
                        name: name.trim(),
                        status: STATUS_TO_GQL[status],
                        stagingUrl: stagingUrl.trim() || null,
                        productionUrl: productionUrl.trim() || null,
                        startAt: startDate ?? null,
                        expectedGoLiveAt: goLiveDate ?? null,
                    },
                },
                errorPolicy: 'all',
            });

            if (hasGraphQLError(error)) {
                toast.error('Failed to update project details.', { position: 'top-center' });
                return;
            }

            if (data) {
                setOriginal(formData);
                toast.success('Project details updated.', { position: 'top-center' });
            }
        } catch {
            toast.error('Network error occurred. Please check your connection.', {
                position: 'top-center',
            });
        } finally {
            setSaving(false);
        }
    }, [name, status, stagingUrl, productionUrl, startDate, goLiveDate, project.id, updateProjectStatus]);

    return (
        <section className="bg-card overflow-hidden rounded-xl border shadow-sm">
            <div className="bg-muted/30 border-b px-4 py-3 sm:px-5">
                <h2 className="text-base font-semibold">Project Details</h2>
                <p className="text-muted-foreground mt-0.5 text-sm">
                    Basic project information and timeline.
                </p>
            </div>

            <div className="grid gap-5 px-4 py-5 sm:px-5">
                <div className="grid gap-2">
                    <Label htmlFor="project-name">Project Name</Label>
                    <Input
                        id="project-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Project name"
                        disabled={saving || !isKubisTeam}
                        autoComplete="off"
                    />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                    <div className="grid gap-2">
                        <Label htmlFor="staging-url">Staging URL</Label>
                        <Input
                            id="staging-url"
                            type="url"
                            value={stagingUrl}
                            onChange={(e) => setStagingUrl(e.target.value)}
                            placeholder="https://staging.example.com"
                            disabled={saving || !isKubisTeam}
                            autoComplete="off"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="production-url">Production URL</Label>
                        <Input
                            id="production-url"
                            type="url"
                            value={productionUrl}
                            onChange={(e) => setProductionUrl(e.target.value)}
                            placeholder="https://example.com"
                            disabled={saving || !isKubisTeam}
                            autoComplete="off"
                        />
                    </div>
                </div>
                <div className="grid gap-2 sm:grid-cols-3">
                    <div className="grid gap-2">
                        <Label htmlFor="project-status">Status</Label>
                        <Select
                            value={status}
                            onValueChange={(v) => setStatus(v as ProjectStatus)}
                            disabled={saving || !isKubisTeam}
                        >
                            <SelectTrigger id="project-status" className='w-full'>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {PROJECT_STATUS_OPTIONS.map((s) => (
                                    <SelectItem key={s} value={s}>
                                        {s}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label>Start Date</Label>
                        <Popover open={startCalendarOpen} onOpenChange={setStartCalendarOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full justify-start font-normal"
                                    disabled={saving || !isKubisTeam}
                                >
                                    <CalendarIcon className="mr-2 size-4" />
                                    {startDate ? (
                                        format(startDate, 'PPP')
                                    ) : (
                                        <span className="text-muted-foreground">Pick a date</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={startDate}
                                    onSelect={(date) => {
                                        setStartDate(date);
                                        setStartCalendarOpen(false);
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="grid gap-2">
                        <Label>Expected Go Live</Label>
                        <Popover open={goLiveCalendarOpen} onOpenChange={setGoLiveCalendarOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full justify-start font-normal"
                                    disabled={saving || !isKubisTeam}
                                >
                                    <CalendarIcon className="mr-2 size-4" />
                                    {goLiveDate ? (
                                        format(goLiveDate, 'PPP')
                                    ) : (
                                        <span className="text-muted-foreground">Pick a date</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={goLiveDate}
                                    onSelect={(date) => {
                                        setGoLiveDate(date);
                                        setGoLiveCalendarOpen(false);
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
            </div>

            {isKubisTeam && (
                <div className="flex justify-end p-3 sm:px-5">
                    <Button onClick={handleSave} disabled={saving || !isDirty} size="sm">
                        {saving ? (
                            <>
                                <Loader2Icon className="animate-spin" />
                                Saving...
                            </>
                        ) : (
                            'Save changes'
                        )}
                    </Button>
                </div>
            )}
        </section>
    );
}
