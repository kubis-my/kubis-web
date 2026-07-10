'use client';

import { Separator } from '@repo/shadcn-ui/components/separator';
import OverviewSection from './overview-section';
import { ProjectDetailsSection } from './project-details-section';
import { StatsSection } from './stats-section';

export default function ProjectOverview() {
    return (
        <div className="flex w-full flex-col gap-8 py-2">
            <StatsSection />
            <ProjectDetailsSection />
            <Separator />
            <OverviewSection />
        </div>
    );
}
