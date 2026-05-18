'use client';

import { useProjectDetail } from '../project-detail-container';
import MilestoneStepper from './milestone-stepper';
import MilestoneCard from './milestone-card';

export default function ProjectMilestones() {
    const { project } = useProjectDetail();
    const { milestones } = project;

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
