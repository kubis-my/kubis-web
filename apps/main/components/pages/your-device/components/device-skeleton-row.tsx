import { Skeleton } from '@/shadcn/components/skeleton';
import { TableCell, TableRow } from '@/shadcn/components/table';

export function DeviceSkeletonRow() {
    return (
        <TableRow>
            {/* Device column */}
            <TableCell className="px-5 py-3" style={{ width: '180px' }}>
                <div className="flex items-center gap-3">
                    <Skeleton className="size-5 rounded" />
                    <div className="flex flex-col gap-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-20" />
                    </div>
                </div>
            </TableCell>
            {/* Browser column */}
            <TableCell className="px-5 py-3" style={{ width: '120px' }}>
                <Skeleton className="h-4 w-20" />
            </TableCell>
            {/* IP Address column */}
            <TableCell className="px-5 py-3" style={{ width: '130px' }}>
                <Skeleton className="h-4 w-24" />
            </TableCell>
            {/* Location column */}
            <TableCell className="px-5 py-3" style={{ width: '160px' }}>
                <Skeleton className="h-4 w-32" />
            </TableCell>
            {/* Last Active column */}
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
