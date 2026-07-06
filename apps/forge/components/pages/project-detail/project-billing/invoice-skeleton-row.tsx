import { Skeleton } from '@/shadcn/components/skeleton';
import { TableCell, TableRow } from '@/shadcn/components/table';

export function InvoiceSkeletonRow() {
    return (
        <TableRow>
            <TableCell className="px-5 py-3" style={{ width: '130px' }}>
                <Skeleton className="h-4 w-24" />
            </TableCell>
            <TableCell className="px-5 py-3">
                <Skeleton className="h-4 w-48" />
            </TableCell>
            <TableCell className="px-5 py-3" style={{ width: '130px' }}>
                <Skeleton className="h-4 w-24" />
            </TableCell>
            <TableCell className="px-5 py-3" style={{ width: '130px' }}>
                <Skeleton className="h-4 w-24" />
            </TableCell>
            <TableCell className="px-5 py-3" style={{ width: '120px' }}>
                <Skeleton className="h-4 w-16" />
            </TableCell>
            <TableCell className="px-5 py-3" style={{ width: '100px' }}>
                <Skeleton className="h-6 w-16 rounded-full" />
            </TableCell>
            <TableCell className="px-5 py-3" style={{ width: '120px' }}>
                <div className="flex justify-end">
                    <Skeleton className="h-8 w-20" />
                </div>
            </TableCell>
        </TableRow>
    );
}
