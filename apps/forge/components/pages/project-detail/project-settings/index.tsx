'use client';

import ProjectDetailsSection from './project-details-section';
import VisibilityControlsSection from './visibility-controls-section';
import NotificationsSection from './notifications-section';
import SubscriptionPlanSection from './subscription-plan-section';
import { useDashboard02 } from '@/shadcn/dashboards/dashboard-02';
import { useEffect } from 'react';

export default function ProjectSettings() {
    const { updateBreadcrumbList } = useDashboard02();
    useEffect(() => {
        updateBreadcrumbList([
            {
                name: "Manage"
            },
            {
                name: "Settings"
            }
        ])

        return () => {
            updateBreadcrumbList([])
        }
    }, [updateBreadcrumbList])

    return (
        <div className="flex w-full flex-col gap-6 py-2">
            <div>
                <h2 className="text-base font-semibold">Settings</h2>
                <p className="text-muted-foreground mt-0.5 text-sm">
                    Manage project configuration and access.
                </p>
            </div>
            <ProjectDetailsSection />
            <VisibilityControlsSection />
            <NotificationsSection />
            <SubscriptionPlanSection />
        </div>
    );
}
