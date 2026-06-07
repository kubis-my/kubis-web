'use client';

import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { gql, TypedDocumentNode } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { Switch } from '@/shadcn/components/switch';
import { Label } from '@/shadcn/components/label';
import { useAuth } from '@/shadcn/providers/auth-provider';
import { hasSuperAdminAccess } from '@repo/commons/utils/auth';
import { useProjectDetail } from '../project-detail-container';
import type {
    UpdateProjectSettingVisibilityInput,
    ProjectSetting,
} from '@repo/commons/types/forge-service-schema.type';

interface UpdateVisibilityResponse {
    updateProjectSettingVisibilityForForge: Pick<ProjectSetting, 'publicId' | 'visibility'>;
}

interface UpdateVisibilityVariables {
    input: UpdateProjectSettingVisibilityInput;
}

const UPDATE_VISIBILITY: TypedDocumentNode<
    UpdateVisibilityResponse,
    UpdateVisibilityVariables
> = gql`
    mutation UpdateProjectSettingVisibilityForForge($input: UpdateProjectSettingVisibilityInput!) {
        updateProjectSettingVisibilityForForge(input: $input) {
            publicId
            visibility {
                brief
                milestones
                threads
                devNotes
            }
        }
    }
`;

type VisibilityState = {
    brief: boolean;
    milestones: boolean;
    threads: boolean;
    devNotes: boolean;
};

export default function VisibilityControlsSection() {
    const { project } = useProjectDetail();
    const { authUser } = useAuth();
    const isKubisTeam = useMemo(() => hasSuperAdminAccess(authUser?.companies ?? []), [authUser]);
    const [updateVisibility] = useMutation(UPDATE_VISIBILITY);

    const [visibility, setVisibility] = useState<VisibilityState>({
        brief: project.projectSettings?.visibility?.brief ?? true,
        milestones: project.projectSettings?.visibility?.milestones ?? true,
        threads: project.projectSettings?.visibility?.threads ?? true,
        devNotes: project.projectSettings?.visibility?.devNotes ?? false,
    });

    const toggle = async (key: keyof VisibilityState) => {
        const newState = { ...visibility, [key]: !visibility[key] };
        setVisibility(newState);

        try {
            await updateVisibility({
                variables: {
                    input: {
                        projectPublicId: project.id,
                        visibility: newState,
                    },
                },
            });
        } catch {
            setVisibility(visibility);
            toast.error('Failed to update visibility settings.', { position: 'top-center' });
        }
    };

    return (
        <section className="bg-card overflow-hidden rounded-xl border shadow-sm">
            <div className="bg-muted/30 border-b px-4 py-3 sm:px-5">
                <h2 className="text-base font-semibold">Visibility Controls</h2>
                <p className="text-muted-foreground mt-0.5 text-sm">
                    Control what the client can see in this project.
                </p>
            </div>

            <div className="divide-y px-4 sm:px-5">
                <VisibilityRow
                    id="vis-brief"
                    label="Project Brief"
                    description="Background, problem statement, and project notes."
                    checked={visibility.brief}
                    onCheckedChange={() => toggle('brief')}
                    disabled={!isKubisTeam}
                />
                <VisibilityRow
                    id="vis-milestones"
                    label="Milestones"
                    description="Delivery phases and progress tracker."
                    checked={visibility.milestones}
                    onCheckedChange={() => toggle('milestones')}
                    disabled={!isKubisTeam}
                />
                <VisibilityRow
                    id="vis-threads"
                    label="Threads"
                    description="Discussion and communication channel."
                    checked={visibility.threads}
                    onCheckedChange={() => toggle('threads')}
                    disabled={!isKubisTeam}
                />
            </div>
        </section>
    );
}

function VisibilityRow({
    id,
    label,
    description,
    checked,
    onCheckedChange,
    disabled,
}: {
    id: string;
    label: string;
    description: string;
    checked: boolean;
    onCheckedChange: () => void;
    disabled?: boolean;
}) {
    return (
        <div className="flex items-center justify-between gap-4 py-4">
            <div className="grid gap-0.5">
                <Label htmlFor={id} className="cursor-pointer text-sm font-medium">
                    {label}
                </Label>
                <p className="text-muted-foreground text-xs">{description}</p>
            </div>
            <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} />
        </div>
    );
}
