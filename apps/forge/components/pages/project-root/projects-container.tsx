'use client';

import React, { createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@repo/shadcn-ui/components/badge';
import { ROUTE } from '@/root/libs/constants';
import { cn } from '@repo/shadcn-ui/lib/utils';

export type ProjectStatus =
    | 'Pending Review'
    | 'Discovery'
    | 'MVP Build'
    | 'Validation'
    | 'Production'
    | 'On Hold'
    | 'Cancelled';

export type SubscriptionPlan = 'Maintenance' | 'Starter' | 'Growth' | 'Scale';

export type Project = {
    id: string;
    name: string;
    clientName: string;
    status: ProjectStatus;
    startDate: string;
    plan?: SubscriptionPlan;
};

const MOCK_PROJECTS: Project[] = [
    {
        id: '1',
        name: 'Internal PO System',
        clientName: 'Syarikat Maju Sdn Bhd',
        status: 'MVP Build',
        startDate: '2026-03-01',
        plan: 'Growth',
    },
    {
        id: '2',
        name: 'Inventory Tracker',
        clientName: 'TechFlow Solutions',
        status: 'Discovery',
        startDate: '2026-04-10',
        plan: 'Starter',
    },
    {
        id: '3',
        name: 'HR Leave Portal',
        clientName: 'Brickhouse Holdings',
        status: 'Pending Review',
        startDate: '2026-04-22',
    },
];

const STATUS_STYLES: Record<ProjectStatus, string> = {
    'Pending Review': 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
    Discovery: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
    'MVP Build': 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800',
    Validation: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800',
    Production: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
    'On Hold': 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700',
    Cancelled: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
};

type ProjectsContextType = {
    projects: Project[];
    onOpenProject: (id: string) => void;
    onNewProject: () => void;
};

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export function useProjects() {
    const context = useContext(ProjectsContext);

    if (context === undefined) {
        throw new Error('useProjects must be used within a ProjectsContainer');
    }

    return context;
}

export default function ProjectsContainer({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const router = useRouter();

    function onOpenProject(id: string) {
        router.push(ROUTE.FORGE.PROJECT_DETAIL(id));
    }

    function onNewProject() {
        router.push(ROUTE.FORGE.PROJECT_NEW);
    }

    return (
        <ProjectsContext.Provider value={{ projects: MOCK_PROJECTS, onOpenProject, onNewProject }}>
            {children}
        </ProjectsContext.Provider>
    );
}

export function StatusBadge({ status }: { status: ProjectStatus }) {
    return (
        <Badge
            variant="outline"
            className={cn(STATUS_STYLES[status])}
        >
            {status}
        </Badge>
    );
}
