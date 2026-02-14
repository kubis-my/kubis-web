import { Skeleton } from '@/shadcn/components/skeleton';
import { TableCell, TableRow } from '@/shadcn/components/table';

export function BranchSkeletonRow() {
    return (
        <TableRow>
            {/* Branch name column */}
            <TableCell className="px-5 py-3">
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                </div>
            </TableCell>
            {/* Contact */}
            <TableCell className="px-5 py-3" style={{ width: '200px' }}>
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-36" />
                </div>
            </TableCell>
            {/* Location */}
            <TableCell className="px-5 py-3" style={{ width: '180px' }}>
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-20" />
                </div>
            </TableCell>
            {/* Operating Hours */}
            <TableCell className="px-5 py-3" style={{ width: '180px' }}>
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-24" />
                </div>
            </TableCell>
            {/* Employees */}
            <TableCell className="px-5 py-3" style={{ width: '130px' }}>
                <div className="flex justify-end">
                    <Skeleton className="h-4 w-12" />
                </div>
            </TableCell>
            {/* Status */}
            <TableCell className="px-5 py-3" style={{ width: '100px' }}>
                <Skeleton className="h-6 w-16 rounded-full" />
            </TableCell>
        </TableRow>
    );
}
