'use client';

import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { gql, TypedDocumentNode } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { useAuth } from '@/shadcn/providers/auth-provider';
import { useDashboard01 } from '@/shadcn/dashboards/dashboard-01';
import { toast } from 'sonner';
import {
    MilestoneStatus as GqlMilestoneStatus,
    Project as GqlProject,
    ProjectStatus as GqlProjectStatus,
    type ThreadMessage,
    type ThreadPageInfo,
    type ThreadPaginationInput,
} from '@repo/commons/types/forge-service-schema.type';
import { type MilestoneStatus, type ProjectStatus } from '../project-root/types';
import { ROUTE, THREAD_PAGINATION_SIZE } from '@/root/libs/constants';

export type ProjectBriefData = {
    background: string;
    problem: object | null;
    systemNeeds: object | null;
    references: string;
    expectedUsers: string;
    notes: object | null;
};

export type MilestoneNote = {
    id: string;
    date: string;
    content: object | null;
};

export type Milestone = {
    id: string;
    name: string;
    status: MilestoneStatus;
    estimatedDate: string | null;
    notes?: MilestoneNote[];
};

export type ProjectDetail = {
    id: string;
    name: string;
    companyNames: string[];
    status: ProjectStatus;
    startDate: string;
    stagingUrl?: string;
    brief: ProjectBriefData;
    milestones: Milestone[];
};

const PROJECT_STATUS_MAP: Record<GqlProjectStatus, ProjectStatus> = {
    PENDING_REVIEW: 'Pending Review',
    DISCOVERY: 'Discovery',
    MVP_BUILD: 'MVP Build',
    VALIDATION: 'Validation',
    PRODUCTION: 'Production',
    ON_HOLD: 'On Hold',
    CANCELLED: 'Cancelled',
};

const MILESTONE_STATUS_MAP: Record<GqlMilestoneStatus, MilestoneStatus> = {
    UPCOMING: 'Upcoming',
    IN_PROGRESS: 'In Progress',
    DONE: 'Done',
    CANCELLED: 'Cancelled',
};

interface GetProjectResponse {
    getProjectForForge: GqlProject;
}

interface GetProjectVariables {
    publicId: string;
    threadPagination: ThreadPaginationInput;
}

const GET_PROJECT: TypedDocumentNode<GetProjectResponse, GetProjectVariables> = gql`
    query GetProjectForForge($publicId: String!, $threadPagination: ThreadPaginationInput!) {
        getProjectForForge(publicId: $publicId) {
            publicId
            name
            status
            stagingUrl
            companyIds
            createdAt
            brief {
                background
                problem
                systemNeeds
                references
                expectedUsers
                notes
            }
            milestones {
                publicId
                name
                status
                estimatedAt
                order
                notes {
                    publicId
                    content
                    date
                }
            }
            threads(pagination: $threadPagination) {
                data {
                    publicId
                    content
                    senderId
                    senderName
                    senderInitials
                    replyToId
                    deletedAt
                    createdAt
                }
                pageInfo {
                    endCursor
                    hasMore
                    total
                }
            }
        }
    }
`;

type ProjectDetailContextType = {
    project: ProjectDetail;
    initialThreads: ThreadMessage[];
    initialThreadsPageInfo: ThreadPageInfo;
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
    const { projectId } = useParams<{ projectId: string }>();
    const { authUser } = useAuth();
    const { updateBreadcrumbList } = useDashboard01();
    const router = useRouter();

    const { data, loading, error } = useQuery(GET_PROJECT, {
        variables: { publicId: projectId, threadPagination: { take: THREAD_PAGINATION_SIZE } },
        skip: !projectId,
    });

    const companyNameMap = useMemo(() => {
        const map = new Map<string, string>();
        (authUser?.companies ?? []).forEach((c) => map.set(c.publicId, c.name));
        return map;
    }, [authUser]);

    const project = useMemo((): ProjectDetail | null => {
        const raw = data?.getProjectForForge;
        if (!raw) return null;

        const companyNames = raw.companyIds.map((id) => companyNameMap.get(id) ?? id);

        return {
            id: raw.publicId,
            name: raw.name,
            status: PROJECT_STATUS_MAP[raw.status],
            companyNames,
            startDate: raw.createdAt,
            stagingUrl: raw.stagingUrl ?? undefined,
            brief: {
                background: raw.brief?.background ?? '',
                problem: raw.brief?.problem ?? null,
                systemNeeds: raw.brief?.systemNeeds ?? null,
                references: raw.brief?.references ?? '',
                expectedUsers: raw.brief?.expectedUsers ?? '',
                notes: raw.brief?.notes ?? null,
            },
            milestones: [...raw.milestones]
                .sort((a, b) => a.order - b.order)
                .map((m) => ({
                    id: m.publicId,
                    name: m.name,
                    status: MILESTONE_STATUS_MAP[m.status],
                    estimatedDate: m.estimatedAt,
                    notes: m.notes.map((n) => ({ id: n.publicId, date: n.date, content: n.content })),
                })),
        };
    }, [data, companyNameMap]);

    const initialThreads = useMemo(
        () => (data?.getProjectForForge?.threads?.data as ThreadMessage[]) ?? [],
        [data],
    );

    const initialThreadsPageInfo = useMemo(
        (): ThreadPageInfo =>
            data?.getProjectForForge?.threads?.pageInfo ?? { hasMore: false, total: 0 },
        [data],
    );

    useEffect(() => {
        if (loading) return;
        if (!project || error) {
            toast.error('Project not found', { position: 'top-center' });
            router.replace(ROUTE.FORGE.HOME);
        }
    }, [loading, project, error, router]);

    useEffect(() => {
        if (!project) return;

        updateBreadcrumbList([{ name: 'Projects', url: ROUTE.FORGE.HOME }, { name: project.name }]);

        return () => updateBreadcrumbList([]);
    }, [project, updateBreadcrumbList]);

    if (!project) return null;

    return (
        <ProjectDetailContext.Provider value={{ project, initialThreads, initialThreadsPageInfo }}>
            {children}
        </ProjectDetailContext.Provider>
    );
}
