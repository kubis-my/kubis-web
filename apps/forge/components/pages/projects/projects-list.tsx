'use client';

import { DataTable } from '@repo/shadcn-ui/components/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { useProjects, StatusBadge, type Project } from './projects-container';

function formatDate(value: string) {
    return new Intl.DateTimeFormat('en-MY', { dateStyle: 'medium' }).format(new Date(value));
}

const COLUMNS: ColumnDef<Project>[] = [
    {
        accessorKey: 'name',
        header: 'Project',
        cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    {
        accessorKey: 'clientName',
        header: 'Client',
        cell: ({ row }) => (
            <span className="text-muted-foreground">{row.original.clientName}</span>
        ),
        size: 220,
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
        size: 160,
    },
    {
        accessorKey: 'startDate',
        header: 'Start Date',
        cell: ({ row }) => (
            <span className="text-muted-foreground">{formatDate(row.original.startDate)}</span>
        ),
        size: 150,
    },
];

const MOCK_PAGE_INFO = {
    endCursor: null,
    hasNextPage: false,
    total: 3,
    currentPage: 1,
    totalPages: 1,
};

export default function ProjectsList() {
    const { projects, onOpenProject } = useProjects();

    return (
        <DataTable
            columns={COLUMNS}
            data={projects}
            pageInfo={MOCK_PAGE_INFO}
            isLoading={false}
            pageSize={10}
            onPageSizeChange={() => {}}
            cursorHistory={[null]}
            onNextPage={() => {}}
            onPreviousPage={() => {}}
            emptyMessage="No projects yet."
            getRowId={(row) => row.id}
            flexColumnId="name"
            onRowClick={(row) => onOpenProject(row.id)}
        />
    );
}
