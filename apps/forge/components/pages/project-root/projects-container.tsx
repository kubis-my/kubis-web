'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { gql, TypedDocumentNode } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { useAuth } from '@/shadcn/providers/auth-provider';
import {
    Project as GqlProject,
    ProjectPaginationInput,
    ProjectStatus as GqlProjectStatus,
} from '@repo/commons/types/forge-service-schema.type';
import { PROJECT_PAGINATION_SIZE, ROUTE } from '@/root/libs/constants';
import { type Project, type ProjectStatus } from './types';

interface GetProjectsResponse {
    getProjectsForForge: { data: GqlProject[] };
}

interface GetProjectsVariables {
    pagination: ProjectPaginationInput;
}

const GET_PROJECTS: TypedDocumentNode<GetProjectsResponse, GetProjectsVariables> = gql`
    query GetProjectsForForge($pagination: ProjectPaginationInput!) {
        getProjectsForForge(pagination: $pagination) {
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

const STATUS_MAP: Record<GqlProjectStatus, ProjectStatus> = {
    PENDING_REVIEW: 'Pending Review',
    DISCOVERY: 'Discovery',
    MVP_BUILD: 'MVP Build',
    VALIDATION: 'Validation',
    PRODUCTION: 'Production',
    ON_HOLD: 'On Hold',
    CANCELLED: 'Cancelled',
};

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

export default function ProjectsContainer({ children }: Readonly<{ children: React.ReactNode }>) {
    const router = useRouter();
    const { authUser } = useAuth();

    const { data, loading } = useQuery(GET_PROJECTS, {
        variables: { pagination: { take: PROJECT_PAGINATION_SIZE } },
    });

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
