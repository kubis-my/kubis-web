'use client';

import { useProjectDetail } from '../project-detail-container';
import MilestoneStepper from './milestone-stepper';
import MilestoneCard from './milestone-card';
import { useAuth } from '@/shadcn/providers/auth-provider';
import { useEffect } from 'react';
import { hasSuperAdminAccess } from '@repo/commons/utils/auth';
import { useDashboard01 } from '@/shadcn/dashboards/dashboard-01';
import { Button } from '@/shadcn/components/button';
import { IconPlus } from '@tabler/icons-react';

export default function ProjectMilestones() {
    const { project } = useProjectDetail();
    const { milestones } = project;
    const { updateHeaderAction } = useDashboard01();
    const auth = useAuth();

    useEffect(() => {
        const isSuperAdmin = hasSuperAdminAccess(auth.authUser?.companies ?? [])

        if (isSuperAdmin) {
            updateHeaderAction(
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="size-7">
                        <IconPlus />
                    </Button>
                </div>,
            );
        }

        return () => {
            updateHeaderAction(undefined);
        };
    }, [])

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
                        <MilestoneCard key={milestone.id} milestone={milestone} />
                    ))}
                </div>
            )}
        </div>
    );
}
