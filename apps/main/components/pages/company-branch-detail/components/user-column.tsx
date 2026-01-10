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
                    #{row.original.companyEmployee.internalId.toString().padStart(5, "0")}
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
            const fullName = `${row.original.companyEmployee.user.firstName} ${row.original.companyEmployee.user.lastName}`;
            return (
                <div className="flex flex-col">
                    <span className="font-medium">{fullName}</span>
                    {row.original.companyEmployee.user.nickname && (
                        <span className="text-sm text-muted-foreground">
                            &quot;{row.original.companyEmployee.user.nickname}&quot;
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
                    {row.original.companyEmployee.position}
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
                    {(row.original.companyEmployee.phoneCode && row.original.companyEmployee.phoneNumber) ? `${row.original.companyEmployee.phoneCode} ${row.original.companyEmployee.phoneNumber}` : "-"}
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