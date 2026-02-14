import { Skeleton } from '@/shadcn/components/skeleton';
import { TableCell, TableRow } from '@/shadcn/components/table';

export function ActivitySkeletonRow() {
    return (
        <TableRow>
            {/* Time column */}
            <TableCell className="px-5 py-3" style={{ width: '100px' }}>
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                </div>
            </TableCell>
            {/* User column */}
            <TableCell className="px-5 py-3" style={{ width: '130px' }}>
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-16" />
                </div>
            </TableCell>
            {/* Resource column */}
            <TableCell className="px-5 py-3" style={{ width: '110px' }}>
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                </div>
            </TableCell>
            {/* Type column */}
            <TableCell className="px-5 py-3" style={{ width: '80px' }}>
                <Skeleton className="h-6 w-20 rounded-full" />
            </TableCell>
            {/* Details column */}
            <TableCell className="px-5 py-3">
                <Skeleton className="h-4 w-64" />
            </TableCell>
        </TableRow>
    );
}
