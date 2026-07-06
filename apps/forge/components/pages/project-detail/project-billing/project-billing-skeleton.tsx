import { Skeleton } from '@/shadcn/components/skeleton';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/shadcn/components/table';
import { InvoiceSkeletonRow } from './invoice-skeleton-row';

const COLUMNS: { label: string; width?: number }[] = [
    { label: 'Date', width: 130 },
    { label: 'Description' },
    { label: 'Due', width: 130 },
    { label: 'Paid', width: 130 },
    { label: 'Amount', width: 120 },
    { label: 'Status', width: 100 },
    { label: '', width: 120 },
];

export default function ProjectBillingSkeleton() {
    return (
        <div className="flex flex-1 flex-col px-4 pt-2 pb-4 md:px-8 md:pt-4 md:pb-8">
            <div className="flex w-full flex-col gap-6 py-2">
                <div>
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="mt-1.5 h-4 w-56" />
                </div>

                <div className="flex w-full flex-col gap-4">
                    <div className="overflow-hidden rounded-lg border shadow-sm">
                        <Table>
                            <TableHeader className="bg-muted">
                                <TableRow>
                                    {COLUMNS.map((col, i) => (
                                        <TableHead
                                            key={i}
                                            className="px-5 py-2"
                                            style={{ width: col.width ? `${col.width}px` : 'auto' }}
                                        >
                                            {col.label}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <InvoiceSkeletonRow key={i} />
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 px-4">
                        <Skeleton className="h-4 w-40" />
                        <div className="flex items-center gap-2">
                            <Skeleton className="size-8 rounded-md" />
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="size-8 rounded-md" />
                        </div>
                        <Skeleton className="h-8 w-28 rounded-md" />
                    </div>
                </div>
            </div>
        </div>
    );
}
