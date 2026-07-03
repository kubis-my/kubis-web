'use client';

import { useCallback, useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client/react';
import { DataTable } from '@repo/shadcn-ui/components/data-table';
import { PaginatedProject } from '@repo/commons/types/forge-service-schema.type';
import { createInitialPaginatedData } from '@repo/commons/utils/pagination-helpers';
import { PROJECT_PAGINATION_SIZE } from '@/root/libs/constants';
import { GET_PROJECTS, useProjects } from './projects-container';
import { ProjectColumn } from './components/project-column';
import ProjectSkeletonRow from './components/project-skeleton-row';

export function ProjectDataTable() {
    const ctx = useProjects();
    const [getProjects, { data, loading }] = useLazyQuery(GET_PROJECTS);

    const [pageSize, setPageSize] = useState(PROJECT_PAGINATION_SIZE);
    const [paginatedProjects, setPaginatedProjects] = useState<PaginatedProject>(
        createInitialPaginatedData(),
    );
    const [cursorHistory, setCursorHistory] = useState<(number | null | undefined)[]>([null]);

    const goToNextPage = useCallback(() => {
        if (
            paginatedProjects.pageInfo.hasNextPage &&
            paginatedProjects.pageInfo.endCursor !== null
        ) {
            setCursorHistory((prev) => [...prev, paginatedProjects.pageInfo.endCursor]);
            getProjects({
                variables: {
                    pagination: {
                        cursor: paginatedProjects.pageInfo.endCursor,
                        take: pageSize,
                    },
                },
            });
        }
    }, [paginatedProjects, pageSize, getProjects]);

    const goToPreviousPage = useCallback(() => {
        if (cursorHistory.length > 1) {
            const newHistory = [...cursorHistory];
            newHistory.pop();
            const previousCursor = newHistory[newHistory.length - 1];
            setCursorHistory(newHistory);
            getProjects({
                variables: {
                    pagination: {
                        cursor: previousCursor,
                        take: pageSize,
                    },
                },
            });
        }
    }, [cursorHistory, pageSize, getProjects]);

    useEffect(() => {
        setPaginatedProjects(
            data?.getProjectsForForge ?? ctx.paginatedProjects ?? createInitialPaginatedData(),
        );
    }, [ctx.paginatedProjects, data?.getProjectsForForge]);

    return (
        <DataTable
            columns={ProjectColumn}
            data={paginatedProjects.data}
            pageInfo={paginatedProjects.pageInfo}
            isLoading={loading || ctx.isFetchingProjects}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
            cursorHistory={cursorHistory}
            onNextPage={goToNextPage}
            onPreviousPage={goToPreviousPage}
            emptyMessage="No projects found."
            getRowId={(row) => row.publicId.toString()}
            onRowClick={(row) => ctx.onOpenProject(row.publicId)}
            renderSkeletonRow={() => <ProjectSkeletonRow />}
            flexColumnId="name"
        />
    );
}
