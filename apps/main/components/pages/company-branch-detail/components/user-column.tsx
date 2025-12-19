import { Badge } from "@/shadcn/components/badge";
import { UserAccount, UserAccountStatus } from "@repo/commons/types/account-service-schema.type";
import { ColumnDef } from "@tanstack/react-table";

export const UserColumn: ColumnDef<UserAccount>[] = [
    {
        accessorKey: "code",
        header: "ID",
        cell: ({ row }) => {
            return (
                <div className="font-mono text-sm font-medium">
                    {row.original.code}
                </div>
            );
        },
        size: 100,
        enableHiding: false,
    },
    {
        accessorKey: "fullName",
        header: "Full Name",
        cell: ({ row }) => {
            const fullName = `${row.original.user.firstName} ${row.original.user.lastName}`;
            return (
                <div className="flex flex-col">
                    <span className="font-medium">{fullName}</span>
                    {row.original.user.nickname && (
                        <span className="text-sm text-muted-foreground">
                            &quot;{row.original.user.nickname}&quot;
                        </span>
                    )}
                </div>
            );
        },
        enableHiding: false,
    },
    {
        accessorKey: "position",
        header: "Position",
        cell: ({ row }) => {
            return (
                <div className="text-sm">
                    {row.original.position}
                </div>
            );
        },
        size: 150,
    },
    {
        accessorKey: "phone",
        header: "Phone",
        cell: ({ row }) => {
            return (
                <div className="font-mono text-sm">
                    {(row.original.phoneCode && row.original.phoneNumber) ? `${row.original.phoneCode} ${row.original.phoneNumber}` : "-"}
                </div>
            );
        },
        size: 140,
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status;
            const statusConfig = {
                [UserAccountStatus.ACTIVE]: { variant: "default" as const, className: "bg-green-500 hover:bg-green-600", label: "Active" },
                [UserAccountStatus.INACTIVE]: { variant: "secondary" as const, className: "", label: "Inactive" },
                [UserAccountStatus.PENDING_INVITATION]: { variant: "default" as const, className: "bg-amber-500 hover:bg-amber-600", label: "Pending Invitation" },
                [UserAccountStatus.EXPIRED_INVITATION]: { variant: "destructive" as const, className: "", label: "Expired Invitation" },
            };

            const config = statusConfig[status];

            return (
                <Badge
                    variant={config.variant}
                    className={config.className}
                >
                    {config.label}
                </Badge>
            );
        },
        size: 90,
    },
];