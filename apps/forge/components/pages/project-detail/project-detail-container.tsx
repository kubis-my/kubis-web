'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { useDashboard01 } from '@/shadcn/dashboards/dashboard-01';
import { ProjectStatus, SubscriptionPlan } from '../project-root/projects-container';
import { ROUTE } from '@/root/libs/constants';

export type ProjectBriefData = {
    background: string;
    problem: string;
    systemNeeds: string;
    references: string;
    expectedUsers: string;
    notes: string;
};

export type ProjectDetail = {
    id: string;
    name: string;
    clientName: string;
    status: ProjectStatus;
    startDate: string;
    plan?: SubscriptionPlan;
    brief: ProjectBriefData;
};

const MOCK_PROJECT: ProjectDetail = {
    id: '1',
    name: 'Internal PO System',
    clientName: 'Syarikat Maju Sdn Bhd',
    status: 'MVP Build',
    startDate: '2026-03-01',
    plan: 'Growth',
    brief: {
        background:
            'We are a manufacturing company with 50+ staff. Our procurement process is currently managed via WhatsApp and Excel spreadsheets.',
        problem:
            '<p>Our purchase approval workflow is entirely manual — requests are sent via WhatsApp to managers who approve verbally or via message. This creates:</p><ul><li>No audit trail for approvals</li><li>Lost or forgotten purchase requests</li><li>No visibility into pending or approved orders</li></ul>',
        systemNeeds:
            '<p>We need a system that allows staff to:</p><ul><li>Submit purchase requests with item details and estimated cost</li><li>Route requests to the correct approver based on department</li><li>Track approval status in real-time</li><li>Generate a simple purchase order PDF on approval</li></ul>',
        references: 'Similar to SAP Ariba but much simpler. We currently use an Excel tracker.',
        expectedUsers: '15–20 internal staff across operations, finance, and management.',
        notes: '',
    },
};

type ProjectDetailContextType = {
    project: ProjectDetail;
};

const ProjectDetailContext = createContext<ProjectDetailContextType | undefined>(undefined);

export function useProjectDetail() {
    const context = useContext(ProjectDetailContext);

    if (context === undefined) {
        throw new Error('useProjectDetail must be used within a ProjectDetailContainer');
    }

    return context;
}

export default function ProjectDetailContainer({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const { updateBreadcrumbList } = useDashboard01();

    useEffect(() => {
        updateBreadcrumbList([
            { name: 'Projects', url: ROUTE.FORGE.HOME },
            { name: MOCK_PROJECT.name },
        ]);

        return () => updateBreadcrumbList([]);
    }, [updateBreadcrumbList]);

    return (
        <ProjectDetailContext.Provider value={{ project: MOCK_PROJECT }}>
            {children}
        </ProjectDetailContext.Provider>
    );
}
