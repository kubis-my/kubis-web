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

export type MilestoneStatus = 'Upcoming' | 'In Progress' | 'Done';

export type MilestoneNote = {
    date: string;
    content: string;
};

export type Milestone = {
    id: string;
    name: string;
    status: MilestoneStatus;
    estimatedDate: string;
    notes?: MilestoneNote[];
};

export type ProjectDetail = {
    id: string;
    name: string;
    clientName: string;
    status: ProjectStatus;
    startDate: string;
    plan?: SubscriptionPlan;
    brief: ProjectBriefData;
    milestones: Milestone[];
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
    milestones: [
        {
            id: '1',
            name: 'Discovery',
            status: 'Done',
            estimatedDate: '2026-03-15',
            notes: [
                {
                    date: '2026-03-05',
                    content: '<p>Kickoff call with client. Key takeaways:</p><ul><li>Current flow is entirely via WhatsApp + Excel</li><li>3 approval tiers: staff → HOD → finance</li><li>No existing audit trail</li></ul>',
                },
                {
                    date: '2026-03-10',
                    content: '<p>Follow-up to clarify routing rules:</p><ul><li>Requests above RM 5,000 require finance sign-off</li><li>HOD can delegate to a deputy</li></ul>',
                },
                {
                    date: '2026-03-14',
                    content: '<p>Scope locked. Requirements doc signed off. <strong>Moving to MVP Build.</strong></p>',
                },
            ],
        },
        {
            id: '2',
            name: 'MVP Build',
            status: 'In Progress',
            estimatedDate: '2026-05-30',
            notes: [
                {
                    date: '2026-04-02',
                    content: '<p>Staging deployed. Covered in this session:</p><ul><li>PO submission form live</li><li>Approval flow wired up for all 3 tiers</li><li>Client given staging credentials</li></ul>',
                },
                {
                    date: '2026-04-28',
                    content: '<p>Client walkthrough on staging. Feedback:</p><ul><li>Notification email needs company letterhead</li><li>Approver wants to add comments when rejecting</li></ul><p>Both items added to backlog.</p>',
                },
            ],
        },
        {
            id: '3',
            name: 'Validation',
            status: 'Upcoming',
            estimatedDate: '2026-06-20',
        },
        {
            id: '4',
            name: 'Production',
            status: 'Upcoming',
            estimatedDate: '2026-07-01',
        },
    ],
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
