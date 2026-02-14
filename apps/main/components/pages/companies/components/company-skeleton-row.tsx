import { Skeleton } from '@/shadcn/components/skeleton';
import { TableCell, TableRow } from '@/shadcn/components/table';

export default function CompanySkeletonRow() {
    return (
        <TableRow>
            {/* Company name column with avatar */}
            <TableCell className="px-5 py-3">
                <div className="flex items-center gap-3">
                    <Skeleton className="size-10 rounded-lg" />
                    <div className="flex flex-col gap-2">
                        <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="ml-2 size-2 rounded-full" />
                </div>
            </TableCell>
            {/* Registration Number */}
            <TableCell className="px-5 py-3" style={{ width: '170px' }}>
                <Skeleton className="h-4 w-24" />
            </TableCell>
            {/* Registered Date */}
            <TableCell className="px-5 py-3" style={{ width: '140px' }}>
                <Skeleton className="h-4 w-28" />
            </TableCell>
            {/* Employees */}
            <TableCell className="px-5 py-3" style={{ width: '110px' }}>
                <div className="flex justify-end">
                    <Skeleton className="h-4 w-12" />
                </div>
            </TableCell>
            {/* Branches */}
            <TableCell className="px-5 py-3" style={{ width: '100px' }}>
                <div className="flex justify-end">
                    <Skeleton className="h-4 w-10" />
                </div>
            </TableCell>
            {/* Token Usage */}
            <TableCell className="px-5 py-3" style={{ width: '130px' }}>
                <div className="flex justify-end">
                    <Skeleton className="h-4 w-16" />
                </div>
            </TableCell>
        </TableRow>
    );
}
