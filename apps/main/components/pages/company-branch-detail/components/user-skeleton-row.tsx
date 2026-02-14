import { Skeleton } from '@/shadcn/components/skeleton';
import { TableCell, TableRow } from '@/shadcn/components/table';

export function UserSkeletonRow() {
    return (
        <TableRow>
            {/* User Code column */}
            <TableCell className="px-5 py-3" style={{ width: '100px' }}>
                <Skeleton className="h-4 w-16" />
            </TableCell>
            {/* Full Name column */}
            <TableCell className="px-5 py-3">
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                </div>
            </TableCell>
            {/* Position */}
            <TableCell className="px-5 py-3" style={{ width: '220px' }}>
                <Skeleton className="h-4 w-28" />
            </TableCell>
            {/* Phone */}
            <TableCell className="px-5 py-3" style={{ width: '180px' }}>
                <Skeleton className="h-4 w-32" />
            </TableCell>
            {/* Status */}
            <TableCell className="px-5 py-3" style={{ width: '180px' }}>
                <Skeleton className="h-6 w-24 rounded-full" />
            </TableCell>
        </TableRow>
    );
}
