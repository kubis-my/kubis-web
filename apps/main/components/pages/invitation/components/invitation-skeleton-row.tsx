import { Skeleton } from '@/shadcn/components/skeleton';
import { TableCell, TableRow } from '@/shadcn/components/table';

export function InvitationSkeletonRow() {
    return (
        <TableRow>
            {/* Company / Branch column */}
            <TableCell className="px-5 py-3" style={{ width: '200px' }}>
                <div className="flex items-center gap-3">
                    <Skeleton className="size-5 rounded" />
                    <div className="flex flex-col gap-2">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-3 w-24" />
                    </div>
                </div>
            </TableCell>
            {/* Position column */}
            <TableCell className="px-5 py-3" style={{ width: '150px' }}>
                <Skeleton className="h-4 w-24" />
            </TableCell>
            {/* Invited By column */}
            <TableCell className="px-5 py-3" style={{ width: '180px' }}>
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                </div>
            </TableCell>
            {/* Date column */}
            <TableCell className="px-5 py-3" style={{ width: '120px' }}>
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                </div>
            </TableCell>
            {/* Status column */}
            <TableCell className="px-5 py-3" style={{ width: '100px' }}>
                <Skeleton className="h-6 w-16 rounded-full" />
            </TableCell>
            {/* Actions column */}
            <TableCell className="px-5 py-3" style={{ width: '50px' }}>
                <Skeleton className="size-8 rounded" />
            </TableCell>
        </TableRow>
    );
}
