import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@repo/shadcn-ui/components/badge';
import { formatDateTime } from '@repo/commons/utils/date';
import { Project } from '@repo/commons/types/forge-service-schema.type';
import ProjectCellViewer from './project-cell-viewer';
import { StatusBadge } from '../status-badge';

export const ProjectColumn: ColumnDef<Project>[] = [
    {
        accessorKey: 'name',
        header: 'Project',
        cell: ({ row }) => <ProjectCellViewer item={row.original} />,
        enableHiding: false,
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
        size: 140,
    },
    {
        accessorKey: 'plan',
        header: 'Plan',
        cell: ({ row }) => {
            if (row.original.projectSettings?.isOneTimePayOff) {
                return <Badge variant="secondary">One-time</Badge>;
            }

            const plan = row.original.subscription?.plan?.name;
            return plan ? (
                <Badge variant="outline">{plan}</Badge>
            ) : (
                <span className="text-muted-foreground text-xs">-</span>
            );
        },
        size: 110,
    },
    {
        accessorKey: 'createdAt',
        header: 'Started',
        cell: ({ row }) => (
            <div className="text-muted-foreground text-sm">
                {formatDateTime(row.original.createdAt, { format: 'dd MMM yyyy' })}
            </div>
        ),
        size: 130,
    },
    {
        accessorKey: 'unreadCount',
        header: () => <div className="text-right">Unread</div>,
        cell: ({ row }) => {
            const unreadCount = row.original.userOverview?.unreadCount ?? 0;
            return (
                <div className="text-right font-medium tabular-nums">
                    {unreadCount > 0 ? unreadCount : '-'}
                </div>
            );
        },
        size: 90,
    },
];
