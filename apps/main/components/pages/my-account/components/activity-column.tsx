import AuditLogMetaViewer from '@/root/components/container/audit-log-meta-viewer';
import { activityTypeConfig } from '@/root/libs/constants';
import { Badge } from '@/shadcn/components/badge';
import { Branch, Company } from '@repo/commons/types/account-service-schema.type';
import { AuditLog, AuditLogAuthor } from '@repo/commons/types/audit-service-schema.type';
import { formatDateTime } from '@repo/commons/utils/date';
import { ColumnDef } from '@tanstack/react-table';

export const ActivityColumn: ColumnDef<AuditLog>[] = [
    {
        accessorKey: 'emittedAt',
        header: 'Time',
        cell: ({ row }) => {
            return (
                <div className="text-sm">
                    <div className="font-medium">
                        {formatDateTime(row.original.emittedAt, { format: 'dd MMM yyyy' })}
                    </div>
                    <div className="text-muted-foreground text-xs">
                        {formatDateTime(row.original.emittedAt, { format: 'hh:mm a' })}
                    </div>
                </div>
            );
        },
        size: 100,
        enableHiding: false,
    },
    {
        accessorKey: 'auditLogAuthor-company',
        header: 'Company',
        cell: ({ row }) => {
            const author = row.original.auditLogAuthor as AuditLogAuthor & {
                company: Company;
            };

            if (!author.company) {
                return <span className="text-muted-foreground text-xs">-</span>;
            }

            return (
                <div className="flex flex-col">
                    <span className="font-medium">{author.company.name}</span>
                    <span className="text-muted-foreground font-mono text-xs">
                        #{author.company.publicId.slice(0, 8)}
                    </span>
                </div>
            );
        },
        size: 130,
        enableHiding: false,
    },
    {
        accessorKey: 'auditLogAuthor-branch',
        header: 'Branch',
        cell: ({ row }) => {
            const author = row.original.auditLogAuthor as AuditLogAuthor & {
                branch: Branch;
            };

            if (!author.branch) {
                return <span className="text-muted-foreground text-xs">-</span>;
            }

            return (
                <div className="flex flex-col">
                    <span className="font-medium">{author.branch.name}</span>
                    <span className="text-muted-foreground font-mono text-xs">
                        {author.branch.code.slice(0, 8)}
                    </span>
                </div>
            );
        },
        size: 130,
        enableHiding: false,
    },
    {
        accessorKey: 'auditLogResource',
        header: 'Resource',
        cell: ({ row }) => {
            const resource = row.original.auditLogResource;

            if (!resource) {
                return <span className="text-muted-foreground text-xs">Unknown</span>;
            }

            return (
                <div className="flex flex-col">
                    <span className="font-medium">{resource.type}</span>
                    <span className="text-muted-foreground font-mono text-xs">
                        #{resource.publicId.slice(0, 8)}
                    </span>
                </div>
            );
        },
        size: 110,
    },
    {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ row }) => {
            const type = row.original.type.toLowerCase();
            const config = activityTypeConfig[type as keyof typeof activityTypeConfig] || {
                variant: 'default' as const,
                className: '',
                label: 'Unknown',
            };

            return (
                <Badge variant={config.variant} className={config.className}>
                    {config.label}
                </Badge>
            );
        },
        size: 80,
    },
    {
        accessorKey: 'description',
        header: 'Details',
        cell: ({ row }) => {
            return <AuditLogMetaViewer audit={row.original} />;
        },
        enableHiding: false,
    },
];
