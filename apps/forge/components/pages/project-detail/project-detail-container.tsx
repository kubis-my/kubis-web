'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { useDashboard01 } from '@/shadcn/dashboards/dashboard-01';
import { useParams } from 'next/navigation';
import { ROUTE } from '@/root/libs/constants';
import { ProjectStatus, StatusBadge } from '../projects/projects-container';

const MOCK_PROJECT = {
    id: '1',
    name: 'Internal PO System',
    clientName: 'Syarikat Maju Sdn Bhd',
    status: 'MVP Build' as ProjectStatus,
    startDate: '2026-03-01',
    plan: 'Growth',
};

type ProjectDetailContextType = {
    project: typeof MOCK_PROJECT;
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

    useEffect(() => {
        updateBreadcrumbList([
            { name: 'Projects', url: ROUTE.FORGE.PROJECTS(companyIndex) },
            { name: MOCK_PROJECT.name },
        ]);
        updateHeaderAction(
            <div className="flex items-center gap-2">
                <StatusBadge status={MOCK_PROJECT.status} />
            </div>,
        );

        return () => {
            updateBreadcrumbList([]);
            updateHeaderAction(undefined);
        };
    }, [companyIndex, updateBreadcrumbList, updateHeaderAction]);

    return (
        <ProjectDetailContext.Provider value={{ project: MOCK_PROJECT }}>
            {children}
        </ProjectDetailContext.Provider>
    );
}
