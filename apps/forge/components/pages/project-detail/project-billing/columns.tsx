'use client';

import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { Badge } from '@/shadcn/components/badge';
import { Button } from '@/shadcn/components/button';
import { cn } from '@repo/shadcn-ui/lib/utils';
import { Invoice, InvoiceStatus } from '@repo/commons/types/forge-service-schema.type';

const STATUS_STYLES: Record<InvoiceStatus, string> = {
    PAID: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
    PENDING:
        'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
    CANCELLED:
        'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
};

const STATUS_LABEL: Record<InvoiceStatus, string> = {
    PAID: 'Paid',
    PENDING: 'Pending',
    CANCELLED: 'Cancelled',
};

const ACTION_LABEL: Record<InvoiceStatus, string> = {
    PENDING: 'Pay now',
    PAID: 'Receipt',
    CANCELLED: 'Details',
};

function formatAmount(cents: number) {
    return new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR' }).format(
        cents,
    );
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-MY', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

export function createInvoiceColumns(projectId: string): ColumnDef<Invoice>[] {
    return [
        {
            accessorKey: 'createdAt',
            header: 'Date',
            cell: ({ row }) => (
                <div className="text-muted-foreground text-sm">{formatDate(row.original.createdAt)}</div>
            ),
            size: 130,
        },
        {
            accessorKey: 'items',
            header: 'Description',
            cell: ({ row }) => {
                const items = [...(row.original.items ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);
                if (items.length === 0) {
                    return <span className="text-muted-foreground text-sm">—</span>;
                }

                const [title, ...rest] = items.map((item) => item.description);

                return (
                    <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-semibold">{title}</span>
                        {rest.length > 0 && (
                            <span className="text-muted-foreground text-xs">{rest.join(', ')}</span>
                        )}
                    </div>
                );
            },
            enableHiding: false,
        },
        {
            accessorKey: 'dueAt',
            header: 'Due',
            cell: ({ row }) => (
                <div className="text-muted-foreground text-sm">{formatDate(row.original.dueAt)}</div>
            ),
            size: 130,
        },
        {
            accessorKey: 'amount',
            header: 'Amount',
            cell: ({ row }) => (
                <div className="text-sm font-medium tabular-nums">{formatAmount(row.original.amount)}</div>
            ),
            size: 120,
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const status = row.original.status as InvoiceStatus;
                return (
                    <Badge variant="outline" className={cn('text-xs', STATUS_STYLES[status])}>
                        {STATUS_LABEL[status] ?? status}
                    </Badge>
                );
            },
            size: 100,
        },
        {
            accessorKey: 'action',
            header: "",
            cell: ({ row }) => {
                const status = row.original.status as InvoiceStatus;
                const { publicId } = row.original;
                const href = `/projects/${projectId}/billing/${publicId}`;
                const label = ACTION_LABEL[status] ?? ACTION_LABEL.PENDING;

                return (
                    <div className="flex justify-end">
                        <Button
                            size="sm"
                            variant="outline"
                            className={cn(
                                'min-w-[88px] text-xs font-medium',
                            )}
                            asChild
                        >
                            <Link href={href}>{label}</Link>
                        </Button>
                    </div>
                );
            },
            size: 120,
        },
    ];
}
