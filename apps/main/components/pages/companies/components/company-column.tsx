import { Company } from "@repo/commons/types/account-service-schema.type"
import { ColumnDef } from "@tanstack/react-table"
import TableCellViewer from "./table-cell-viewer"

export const CompanyColumn: ColumnDef<Company>[] = [
    {
        accessorKey: "companyName",
        header: "Company",
        cell: ({ row }) => {
            return <TableCellViewer item={row.original} />
        },
        enableHiding: false,
    },
    {
        accessorKey: "registrationNumber",
        header: "Registration Number",
        cell: ({ row }) => (
            <div className="font-mono text-sm text-muted-foreground">
                {row.original.registrationNo}
            </div>
        ),
        size: 170,
    },
    {
        accessorKey: "registeredAt",
        header: "Registered Date",
        cell: ({ row }) => {
            const date = new Date(row.original.createdAt)
            return (
                <div className="text-muted-foreground">
                    {date.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                    })}
                </div>
            )
        },
        size: 140,
    },
    {
        accessorKey: "employees",
        header: () => <div className="text-right">Employees</div>,
        cell: ({ row }) => (
            <div className="text-right font-medium tabular-nums">
                {row.original.totalActiveEmployee}
            </div>
        ),
        size: 110,
    },
    {
        accessorKey: "branches",
        header: () => <div className="text-right">Branches</div>,
        cell: ({ row }) => (
            <div className="text-right font-medium tabular-nums">
                {row.original.totalActiveBranch}
            </div>
        ),
        size: 100,
    },
    {
        accessorKey: "tokenUsage",
        header: () => <div className="text-right">Token Usage</div>,
        cell: () => (
            <div className="text-right tabular-nums">
                {/* TODO:FIX THIS */}
                <div className="font-medium">0.00</div>
            </div>
        ),
        size: 130,
    }
]