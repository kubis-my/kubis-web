import { Skeleton } from '@/shadcn/components/skeleton';
import { TableCell, TableRow } from '@/shadcn/components/table';

export function EventSkeletonRow() {
    return (
        <TableRow>
            {/* Date column */}
            <TableCell className="px-5 py-3" style={{ width: '150px' }}>
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-24" />
                </div>
            </TableCell>
            {/* Event Name column */}
            <TableCell className="px-5 py-3">
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-32" />
                </div>
            </TableCell>
            {/* Type */}
            <TableCell className="px-5 py-3" style={{ width: '150px' }}>
                <Skeleton className="h-6 w-20 rounded-full" />
            </TableCell>
            {/* Duration */}
            <TableCell className="px-5 py-3" style={{ width: '120px' }}>
                <Skeleton className="h-4 w-16" />
            </TableCell>
        </TableRow>
    );
}
