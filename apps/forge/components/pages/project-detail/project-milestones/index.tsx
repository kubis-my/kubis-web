'use client';

import { useProjectDetail } from '../project-detail-container';
import MilestoneStepper from './milestone-stepper';
import MilestoneCard from './milestone-card';
import { useAuth } from '@/shadcn/providers/auth-provider';
import { useEffect } from 'react';
import { hasSuperAdminAccess } from '@repo/commons/utils/auth';
import { useDashboard02 } from '@/shadcn/dashboards/dashboard-02';
import { CreateMilestoneDialog } from './create-milestone-dialog';
import { useSearchParams } from 'next/navigation';

export default function ProjectMilestones() {
    const { project } = useProjectDetail();
    const { milestones } = project;
    const { updateHeaderAction, updateBreadcrumbList } = useDashboard02();
    const auth = useAuth();
    const searchParams = useSearchParams();
    const highlightedMilestoneId = searchParams.get('id') ?? undefined;
    const highlightedNoteId = searchParams.get('note_id') ?? undefined;

    useEffect(() => {
        const isSuperAdmin = hasSuperAdminAccess(auth.authUser?.companies ?? [])

        if (isSuperAdmin) {
            updateHeaderAction(
                <div className="flex items-center gap-2">
                    <CreateMilestoneDialog projectPublicId={project.id} order={milestones.length + 1} />
                </div>
            );
        }

        return () => {
            updateHeaderAction(undefined);
        };
    }, [])

    useEffect(() => {
        updateBreadcrumbList([
            {
                name: "Project"
            },
            {
                name: "Milestones"
            }
        ])

        return () => {
            updateBreadcrumbList([])
        }
    }, [updateBreadcrumbList])

    return (
        <div className="flex w-full flex-col gap-8 py-2">
            <div>
                <h2 className="text-base font-semibold">Milestone Tracker</h2>
                <p className="text-muted-foreground mt-0.5 text-sm">
                    High-level delivery phases for this project.
                </p>
            </div>

            <MilestoneStepper milestones={milestones} />

            {milestones.length > 0 && (
                <div className="space-y-5">
                    {milestones.map((milestone) => (
                        <MilestoneCard
                            key={milestone.id}
                            milestone={milestone}
                            highlightedMilestoneId={highlightedMilestoneId}
                            highlightedNoteId={highlightedNoteId}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
