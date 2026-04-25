'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDashboard01 } from '@/shadcn/dashboards/dashboard-01';
import { useParams } from 'next/navigation';
import { ROUTE } from '@/root/libs/constants';
import { ProjectStatus, SubscriptionPlan, StatusBadge } from '../projects/projects-container';
import { Badge } from '@repo/shadcn-ui/components/badge';
import { cn } from '@repo/shadcn-ui/lib/utils';

export type ProjectTab = 'brief' | 'milestones' | 'discussion' | 'todos' | 'billing';

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

const PLAN_STYLES: Record<SubscriptionPlan, string> = {
    Maintenance:
        'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700',
    Starter: 'bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-900/30 dark:text-sky-400 dark:border-sky-800',
    Growth: 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800',
    Scale: 'bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-400 dark:border-violet-800',
};

type ProjectDetailContextType = {
    project: ProjectDetail;
    activeTab: ProjectTab;
    setActiveTab: (tab: ProjectTab) => void;
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
    const params = useParams();
    const companyIndex = Number(params?.companyIndex ?? 0);

    const { updateBreadcrumbList, updateHeaderAction } = useDashboard01();
    const [activeTab, setActiveTab] = useState<ProjectTab>('brief');

    useEffect(() => {
        updateBreadcrumbList([
            { name: 'Projects', url: ROUTE.FORGE.PROJECTS(companyIndex) },
            { name: MOCK_PROJECT.name },
        ]);
        updateHeaderAction(
            <div className="flex items-center gap-2">
                <StatusBadge status={MOCK_PROJECT.status} />
                {MOCK_PROJECT.plan && (
                    <Badge variant="outline" className={cn(PLAN_STYLES[MOCK_PROJECT.plan])}>
                        {MOCK_PROJECT.plan}
                    </Badge>
                )}
            </div>,
        );

        return () => {
            updateBreadcrumbList([]);
            updateHeaderAction(undefined);
        };
    }, [companyIndex, updateBreadcrumbList, updateHeaderAction]);

    return (
        <ProjectDetailContext.Provider value={{ project: MOCK_PROJECT, activeTab, setActiveTab }}>
            {children}
        </ProjectDetailContext.Provider>
    );
}
