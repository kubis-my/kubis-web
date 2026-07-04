'use client';

import { Separator } from '@repo/shadcn-ui/components/separator';
import { OverviewSection } from './overview-section';
import { ProjectDetailsSection } from './project-details-section';
import { StatsSection } from './stats-section';
import { useDashboard02 } from '@/shadcn/dashboards/dashboard-02';
import { useEffect } from 'react';

export default function ProjectOverview() {
    const { updateBreadcrumbList } = useDashboard02();

    useEffect(() => {
        updateBreadcrumbList([
            {
                name: "Project"
            },
            {
                name: "Overview"
            }
        ])

        return () => {
            updateBreadcrumbList([])
        }
    }, [updateBreadcrumbList])

    return (
        <div className="flex w-full flex-col gap-8 py-2">
            <StatsSection />
            <ProjectDetailsSection />
            <Separator />
            <OverviewSection />
        </div>
    );
}
