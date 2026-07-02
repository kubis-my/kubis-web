import { Company } from '@repo/commons/types/account-service-schema.type';
import { ColumnDef } from '@tanstack/react-table';
import { formatDateTime } from '@repo/commons/utils/date';
import TableCellViewer from './table-cell-viewer';

export const CompanyColumn: ColumnDef<Company>[] = [
    {
        accessorKey: 'companyName',
        header: 'Company',
        cell: ({ row }) => {
            return <TableCellViewer item={row.original} />;
        },
        enableHiding: false,
    },
    {
        accessorKey: 'registrationNumber',
        header: 'Registration Number',
        cell: ({ row }) => (
            <div className="text-muted-foreground font-mono text-sm">
                {row.original.registrationNo.slice(0, 8)}
            </div>
        ),
        size: 170,
    },
    {
        accessorKey: 'registeredAt',
        header: 'Registered Date',
        cell: ({ row }) => (
            <div className="text-muted-foreground">
                {formatDateTime(row.original.createdAt, { format: 'dd MMM yyyy' })}
            </div>
        ),
        size: 140,
    },
    {
        accessorKey: 'employees',
        header: () => <div className="text-right">Employees</div>,
        cell: ({ row }) => (
            <div className="text-left font-medium tabular-nums">
                {row.original.totalActiveEmployee}
            </div>
        ),
        size: 110,
    },
    {
        accessorKey: 'branches',
        header: () => <div className="text-right">Branches</div>,
        cell: ({ row }) => (
            <div className="text-left font-medium tabular-nums">
                {row.original.totalActiveBranch}
            </div>
        ),
        size: 100,
    },
    // TODO: IMPLEMENT THIS
    // {
    //     accessorKey: "tokenUsage",
    //     header: () => <div className="text-right">Token Usage</div>,
    //     cell: () => (
    //         <div className="text-right tabular-nums">

    //             <div className="font-medium">0.00</div>
    //         </div>
    //     ),
    //     size: 130,
    // }
];
