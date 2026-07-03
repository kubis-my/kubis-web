import { Skeleton } from '@/shadcn/components/skeleton';
import { TableCell, TableRow } from '@/shadcn/components/table';

export default function ProjectSkeletonRow() {
    return (
        <TableRow>
            {/* Project column with avatar */}
            <TableCell className="px-5 py-3">
                <div className="flex items-center gap-3">
                    <Skeleton className="size-10 rounded-lg" />
                    <div className="flex flex-col gap-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-20" />
                    </div>
                </div>
            </TableCell>
            {/* Status */}
            <TableCell className="px-5 py-3" style={{ width: '140px' }}>
                <Skeleton className="h-6 w-24 rounded-full" />
            </TableCell>
            {/* Plan */}
            <TableCell className="px-5 py-3" style={{ width: '110px' }}>
                <Skeleton className="h-6 w-16 rounded-full" />
            </TableCell>
            {/* Started */}
            <TableCell className="px-5 py-3" style={{ width: '130px' }}>
                <Skeleton className="h-4 w-24" />
            </TableCell>
            {/* Unread */}
            <TableCell className="px-5 py-3" style={{ width: '90px' }}>
                <div className="flex justify-end">
                    <Skeleton className="h-4 w-8" />
                </div>
            </TableCell>
        </TableRow>
    );
}
