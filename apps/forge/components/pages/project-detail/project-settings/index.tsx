'use client';

import ProjectDetailsSection from './project-details-section';
import VisibilityControlsSection from './visibility-controls-section';
import NotificationsSection from './notifications-section';
import SubscriptionPlanSection from './subscription-plan-section';

export default function ProjectSettings() {
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
