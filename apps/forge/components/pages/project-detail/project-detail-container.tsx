'use client';

import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { gql, TypedDocumentNode } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { toast } from 'sonner';
import {
    MilestoneStatus as GqlMilestoneStatus,
    Project as GqlProject,
    ProjectStatus as GqlProjectStatus,
    type ProjectSetting as GqlProjectSetting,
    type ProjectSubscription as GqlProjectSubscription,
    type ThreadMessage,
    type ThreadPageInfo,
    type ThreadPaginationInput,
    type PaginatedInvoice,
    type InvoicePaginationInput,
} from '@repo/commons/types/forge-service-schema.type';
import { type MilestoneStatus, type ProjectStatus } from '../project-root/types';
import { ROUTE, THREAD_PAGINATION_SIZE, INVOICE_PAGINATION_SIZE } from '@/root/libs/constants';
import ProjectDetailSkeleton from './project-detail-skeleton';

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
    createdAt: string;
    startAt?: string;
    expectedGoLiveAt?: string;
    stagingUrl?: string;
    productionUrl?: string;
    brief: ProjectBriefData;
    milestones: Milestone[];
    projectSettings?: GqlProjectSetting | null;
    subscription?: Pick<GqlProjectSubscription, 'publicId' | 'status' | 'plan' | 'addOns'> | null;
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
    invoicePagination: InvoicePaginationInput;
}

export const GET_PROJECT: TypedDocumentNode<GetProjectResponse, GetProjectVariables> = gql`
    query GetProjectForForge($publicId: String!, $threadPagination: ThreadPaginationInput!, $invoicePagination: InvoicePaginationInput!) {
        getProjectForForge(publicId: $publicId) {
            publicId
            name
            status
            companies {
                publicId
                name
                logo
            }
            createdAt
            startAt
            expectedGoLiveAt
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
            userOverview {
                unreadCount
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
            projectSettings {
                publicId
                stagingUrl
                productionUrl
                isOneTimePayOff
                visibility {
                    brief
                    milestones
                    threads
                    devNotes
                }
                environment {
                    id
                    key
                    type
                    value
                    isAdminOwned
                    createdAt
                    updatedAt
                }
                userPreference {
                    clientMilestoneCompleted
                    clientNewMessage
                    devClientReplied
                    emailEnabled
                }
            }
            subscription {
                publicId
                status
                plan {
                    publicId
                    name
                    priceAmount
                    priceLabel
                    description
                    badge
                    isCustomPricing
                    sortOrder
                    features {
                        id
                        label
                        sortOrder
                    }
                }
                addOns {
                    publicId
                    name
                    slug
                    category
                    sortOrder
                }
            }
            projectInvoice(pagination: $invoicePagination) {
                data {
                    publicId
                    status
                    amount
                    dueAt
                    paidAt
                    paymentUrl
                    items {
                        publicId
                        type
                        description
                        amount
                        sortOrder
                    }
                    createdAt
                }
                pageInfo {
                    endCursor
                    hasNextPage
                    total
                    currentPage
                    totalPages
                }
            }
        }
    }
`;

type ProjectDetailContextType = {
    project: ProjectDetail;
    initialThreads: ThreadMessage[];
    initialThreadsPageInfo: ThreadPageInfo;
    initialInvoices: PaginatedInvoice;
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
    const router = useRouter();

    const { data, loading, error } = useQuery(GET_PROJECT, {
        variables: {
            publicId: projectId,
            threadPagination: { take: THREAD_PAGINATION_SIZE },
            invoicePagination: { take: INVOICE_PAGINATION_SIZE, projectPublicId: projectId },
        },
        skip: !projectId,
        fetchPolicy: 'cache-first',
    });

    const project = useMemo((): ProjectDetail | null => {
        const raw = data?.getProjectForForge;
        if (!raw) return null;

        const companyNames = raw.companies.map((c) => c.name);

        return {
            id: raw.publicId,
            name: raw.name,
            status: PROJECT_STATUS_MAP[raw.status],
            companyNames,
            createdAt: raw.createdAt,
            startAt: raw.startAt,
            expectedGoLiveAt: raw.expectedGoLiveAt,
            stagingUrl: raw.projectSettings?.stagingUrl ?? undefined,
            productionUrl: raw.projectSettings?.productionUrl ?? undefined,
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
            projectSettings: raw.projectSettings,
            subscription: raw.subscription
                ? {
                    publicId: raw.subscription.publicId,
                    status: raw.subscription.status,
                    plan: raw.subscription.plan,
                    addOns: raw.subscription.addOns,
                }
                : null,
        };
    }, [data]);

    const initialThreads = useMemo(
        () => (data?.getProjectForForge?.threads?.data as ThreadMessage[]) ?? [],
        [data],
    );

    const initialThreadsPageInfo = useMemo(
        (): ThreadPageInfo =>
            data?.getProjectForForge?.threads?.pageInfo ?? { hasMore: false, total: 0 },
        [data],
    );

    const initialInvoices = useMemo(
        (): PaginatedInvoice =>
            data?.getProjectForForge?.projectInvoice ?? {
                data: [],
                pageInfo: { endCursor: null, hasNextPage: false, total: 0, currentPage: 1, totalPages: 1 },
            },
        [data],
    );

    useEffect(() => {
        if (loading) return;
        if (!project || error) {
            toast.error('Project not found', { position: 'top-center' });
            router.replace(ROUTE.FORGE.HOME);
        }
    }, [loading, project, error, router]);

    if (!project) return <ProjectDetailSkeleton />;

    return (
        <ProjectDetailContext.Provider value={{ project, initialThreads, initialThreadsPageInfo, initialInvoices }}>
            {children}
        </ProjectDetailContext.Provider>
    );
}
