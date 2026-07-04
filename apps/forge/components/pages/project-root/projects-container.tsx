'use client';

import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { gql, TypedDocumentNode } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { Button } from '@repo/shadcn-ui/components/button';
import { IconPlus } from '@tabler/icons-react';
import { PaginatedProject, ProjectPaginationInput } from '@repo/commons/types/forge-service-schema.type';
import { PROJECT_PAGINATION_SIZE, ROUTE } from '@/root/libs/constants';
import { useDashboard02 } from '@/shadcn/dashboards/dashboard-02';

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
    const { updateBreadcrumbList, updateHeaderAction } = useDashboard02();

    const { data, loading: isFetchingProjects } = useQuery(GET_PROJECTS, {
        variables: { pagination: { take: PROJECT_PAGINATION_SIZE } },
    });

    function onOpenProject(id: string) {
        router.push(ROUTE.FORGE.PROJECT_DETAIL(id));
    }

    function onNewProject() {
        router.push(ROUTE.FORGE.PROJECT_NEW);
    }

    useEffect(() => {
        updateBreadcrumbList([{ name: 'Projects' }]);
        updateHeaderAction(
            <Button variant="ghost" size="icon" className="size-7" onClick={onNewProject}>
                <IconPlus />
            </Button>,
        );

        return () => {
            updateBreadcrumbList([]);
            updateHeaderAction(undefined);
        };
    }, [updateBreadcrumbList, updateHeaderAction]);

    const contextValue = useMemo(() => {
        return {
            paginatedProjects: data?.getProjectsForForge,
            isFetchingProjects,
            onOpenProject,
            onNewProject,
        }
    }, [data, isFetchingProjects]);

    return <ProjectsContext.Provider value={contextValue}>{children}</ProjectsContext.Provider>;
}
