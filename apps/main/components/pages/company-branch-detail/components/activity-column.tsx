import { Badge } from "@/shadcn/components/badge";
import { AuditLog } from "@repo/commons/types/audit-service-schema.type";
import { formatDateTime } from "@repo/commons/utils/date";
import { ColumnDef } from "@tanstack/react-table";

const activityTypeConfig = {
    create: { variant: "default" as const, className: "bg-green-500 hover:bg-green-600", label: "Create" },
    update: { variant: "default" as const, className: "bg-blue-500 hover:bg-blue-600", label: "Update" },
    delete: { variant: "destructive" as const, className: "", label: "Delete" },
    login: { variant: "default" as const, className: "bg-purple-500 hover:bg-purple-600", label: "Login" },
    logout: { variant: "secondary" as const, className: "", label: "Logout" },
    settings: { variant: "default" as const, className: "bg-amber-500 hover:bg-amber-600", label: "Settings" },
};

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
        size: 150,
        enableHiding: false,
    },
    {
        accessorKey: "auditLogAuthor",
        header: "User",
        cell: ({ row }) => {
            const author = row.original.auditLogAuthor;
            if (!author) {
                return <span className="text-xs text-muted-foreground">System</span>;
            }
            return (
                <div className="flex flex-col">
                    <span className="font-medium">{author.userId || 'Unknown'}</span>
                    <span className="font-mono text-xs text-muted-foreground">
                        {author.credentialId}
                    </span>
                </div>
            );
        },
        size: 180,
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
                label: type
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
        size: 120,
    },
    {
        accessorKey: "auditLogResource",
        header: "Resource",
        cell: ({ row }) => {
            const resource = row.original.auditLogResource;
            if (!resource) {
                return <span className="text-xs text-muted-foreground">-</span>;
            }
            return (
                <div className="text-sm">
                    <span className="font-medium">{resource.type}</span>
                    <span className="ml-1 font-mono text-xs text-muted-foreground">
                        #{resource.publicId.slice(0, 8)}
                    </span>
                </div>
            );
        },
        size: 150,
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