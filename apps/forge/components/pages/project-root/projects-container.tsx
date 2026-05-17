'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { gql, TypedDocumentNode } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { Badge } from '@repo/shadcn-ui/components/badge';
import { useAuth } from '@/shadcn/providers/auth-provider';
import { ProjectStatus as GqlProjectStatus } from '@repo/commons/types/forge-service-schema.type';
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

const STATUS_MAP: Record<GqlProjectStatus, ProjectStatus> = {
    PENDING_REVIEW: 'Pending Review',
    DISCOVERY: 'Discovery',
    MVP_BUILD: 'MVP Build',
    VALIDATION: 'Validation',
    PRODUCTION: 'Production',
    ON_HOLD: 'On Hold',
    CANCELLED: 'Cancelled',
};

const STATUS_STYLES: Record<ProjectStatus, string> = {
    'Pending Review':
        'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
    Discovery:
        'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
    'MVP Build':
        'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800',
    Validation:
        'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800',
    Production:
        'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
    'On Hold':
        'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700',
    Cancelled:
        'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
};

type GqlProject = {
    publicId: string;
    name: string;
    status: GqlProjectStatus;
    companyIds: string[];
    createdAt: string;
};

const GET_PROJECTS: TypedDocumentNode<{ getProjectsForForge: { data: GqlProject[] } }> = gql`
    query GetProjectsForForge {
        getProjectsForForge(pagination: { take: 50 }) {
            data {
                publicId
                name
                status
                companyIds
                createdAt
            }
        }
    }
`;

type ProjectsContextType = {
    projects: Project[];
    loading: boolean;
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
    const { authUser } = useAuth();

    const { data, loading } = useQuery(GET_PROJECTS);

    const companyNameMap = useMemo(() => {
        const map = new Map<string, string>();
        (authUser?.companies ?? []).forEach((c) => map.set(c.publicId, c.name));
        return map;
    }, [authUser]);

    const projects = useMemo((): Project[] => {
        return (data?.getProjectsForForge.data ?? []).map((p) => ({
            id: p.publicId,
            name: p.name,
            status: STATUS_MAP[p.status],
            clientName: companyNameMap.get(p.companyIds[0] ?? '') ?? p.companyIds[0] ?? '',
            startDate: p.createdAt,
        }));
    }, [data, companyNameMap]);

    function onOpenProject(id: string) {
        router.push(ROUTE.FORGE.PROJECT_DETAIL(id));
    }

    function onNewProject() {
        router.push(ROUTE.FORGE.PROJECT_NEW);
    }

    return (
        <ProjectsContext.Provider value={{ projects, loading, onOpenProject, onNewProject }}>
            {children}
        </ProjectsContext.Provider>
    );
}

export function StatusBadge({ status }: { status: ProjectStatus }) {
    return (
        <Badge variant="outline" className={cn(STATUS_STYLES[status])}>
            {status}
        </Badge>
    );
}
