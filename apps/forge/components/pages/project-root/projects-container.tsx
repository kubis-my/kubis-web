'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { gql, TypedDocumentNode } from '@apollo/client';
import { useApolloClient, useQuery } from '@apollo/client/react';
import { Button } from '@repo/shadcn-ui/components/button';
import { IconPlus } from '@tabler/icons-react';
import { PaginatedProject, ProjectPaginationInput } from '@repo/commons/types/forge-service-schema.type';
import {
    INVOICE_PAGINATION_SIZE,
    PROJECT_PAGINATION_SIZE,
    ROUTE,
    THREAD_PAGINATION_SIZE,
} from '@/root/libs/constants';
import { useDashboard02 } from '@/shadcn/dashboards/dashboard-02';
import { GET_PROJECT } from '@/root/components/pages/project-detail/project-detail-container';

interface GetProjectsResponse {
    getProjectsForForge: PaginatedProject;
}

interface GetProjectsVariables {
    pagination: ProjectPaginationInput;
}

export const GET_PROJECTS: TypedDocumentNode<GetProjectsResponse, GetProjectsVariables> = gql`
    query GetProjectsForForge($pagination: ProjectPaginationInput!) {
        getProjectsForForge(pagination: $pagination) {
            data {
                publicId
                name
                status
                companies {
                    publicId
                    name
                    logo
                }
                createdAt
                userOverview {
                    unreadCount
                }
                subscription {
                    publicId
                    plan {
                        publicId
                        name
                    }
                }
                projectSettings {
                    publicId
                    isOneTimePayOff
                }
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
`;

type ProjectsContextType = {
    paginatedProjects?: PaginatedProject;
    isFetchingProjects: boolean;
    onOpenProject: (id: string) => void;
    onPrefetchProject: (id: string) => void;
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
    const client = useApolloClient();
    const { updateHeaderAction } = useDashboard02();

    const prefetchedRef = useRef<Set<string>>(new Set());

    const { data, loading: isFetchingProjects } = useQuery(GET_PROJECTS, {
        variables: { pagination: { take: PROJECT_PAGINATION_SIZE } },
    });

    function onOpenProject(id: string) {
        router.push(ROUTE.FORGE.PROJECT_DETAIL(id));
    }

    // Warm the route shell and the Apollo cache on hover/focus so the detail
    // page's `cache-first` GET_PROJECT query resolves instantly on click.
    const onPrefetchProject = useCallback(
        (id: string) => {
            if (prefetchedRef.current.has(id)) return;
            prefetchedRef.current.add(id);

            router.prefetch(ROUTE.FORGE.PROJECT_DETAIL(id));

            client
                .query({
                    query: GET_PROJECT,
                    variables: {
                        publicId: id,
                        threadPagination: { take: THREAD_PAGINATION_SIZE },
                        invoicePagination: { take: INVOICE_PAGINATION_SIZE, projectPublicId: id },
                    },
                    fetchPolicy: 'cache-first',
                })
                .catch(() => {
                    // Allow a retry on the next hover if the prefetch failed.
                    prefetchedRef.current.delete(id);
                });
        },
        [client, router],
    );

    function onNewProject() {
        router.push(ROUTE.FORGE.PROJECT_NEW);
    }

    useEffect(() => {
        updateHeaderAction(
            <Button variant="ghost" size="icon" className="size-7" onClick={onNewProject}>
                <IconPlus />
            </Button>,
        );

        return () => {
            updateHeaderAction(undefined);
        };
    }, [updateHeaderAction]);

    const contextValue = useMemo(() => {
        return {
            paginatedProjects: data?.getProjectsForForge,
            isFetchingProjects,
            onOpenProject,
            onPrefetchProject,
            onNewProject,
        }
    }, [data, isFetchingProjects, onPrefetchProject]);

    return <ProjectsContext.Provider value={contextValue}>{children}</ProjectsContext.Provider>;
}
