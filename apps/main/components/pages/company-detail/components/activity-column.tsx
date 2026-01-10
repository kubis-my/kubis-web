import { activityTypeConfig } from "@/root/libs/constants";
import { Badge } from "@/shadcn/components/badge";
import { Branch, CompanyEmployee, User } from "@repo/commons/types/account-service-schema.type";
import { AuditLog, AuditLogAuthor } from "@repo/commons/types/audit-service-schema.type";
import { formatDateTime } from "@repo/commons/utils/date";
import { ColumnDef } from "@tanstack/react-table";

export const ActivityColumn: ColumnDef<AuditLog>[] = [
    {
        accessorKey: "emittedAt",
        header: "Time",
        cell: ({ row }) => {
            return (
                <div className="text-sm">
                    <div className="font-medium">
                        {formatDateTime(row.original.emittedAt, { format: "dd MMM yyyy" })}
                    </div>
                    <div className="text-xs text-muted-foreground">
                        {formatDateTime(row.original.emittedAt, { format: "hh:mm a" })}
                    </div>
                </div>
            );
        },
        size: 100,
        enableHiding: false,
    },
    {
        accessorKey: "auditLogAuthor-branch",
        header: "Branch",
        cell: ({ row }) => {
            const author = row.original.auditLogAuthor as AuditLogAuthor & {
                branch: Branch
            }

            if (!author) {
                return <span className="text-xs text-muted-foreground">Unknown</span>;
            }

            return (
                <div className="flex flex-col">
                    <span className="font-medium">{author.branch.name}</span>
                    <span className="font-mono text-xs text-muted-foreground">
                        {author.branch.code}
                    </span>
                </div>
            );
        },
        size: 130,
        enableHiding: false,
    },
    {
        accessorKey: "auditLogAuthor-user",
        header: "User",
        cell: ({ row }) => {
            const author = row.original.auditLogAuthor as AuditLogAuthor & {
                user: User & {
                    companyEmployee?: CompanyEmployee
                }
            }

            if (!author) {
                return <span className="text-xs text-muted-foreground">Unknown</span>;
            }

            return (
                <div className="flex flex-col">
                    <span className="font-medium">{author.user.firstName} {author.user.lastName}</span>
                    <span className="font-mono text-xs text-muted-foreground">
                        #{(author.user.companyEmployee?.internalId ?? 0).toString().padStart(5, "0")}
                    </span>
                </div>
            );
        },
        size: 130,
        enableHiding: false,
    },
    {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => {
            const type = row.original.type.toLowerCase();
            const config = activityTypeConfig[type as keyof typeof activityTypeConfig] || {
                variant: "default" as const,
                className: "",
                label: "Unknown"
            };

            return (
                <Badge
                    variant={config.variant}
                    className={config.className}
                >
                    {config.label}
                </Badge>
            );
        },
        size: 80,
    },
    {
        accessorKey: "auditLogResource",
        header: "Resource",
        cell: ({ row }) => {
            const resource = row.original.auditLogResource;

            if (!resource) {
                return <span className="text-xs text-muted-foreground">Unknown</span>;
            }

            return (
                <div className="flex flex-col">
                    <span className="font-medium">{resource.type}</span>
                    <span className="font-mono text-xs text-muted-foreground">
                        #{resource.publicId.slice(0, 8)}
                    </span>
                </div>
            );
        },
        size: 110,
    },
    {
        accessorKey: "description",
        header: "Details",
        cell: ({ row }) => {
            return (
                <div className="max-w-md text-sm text-muted-foreground">
                    {row.original.description}
                </div>
            );
        },
        enableHiding: false,
    },
];