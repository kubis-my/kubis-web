import { Skeleton } from '@/shadcn/components/skeleton';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/shadcn/components/table';
import ProjectSkeletonRow from './components/project-skeleton-row';

export default function ProjectsListSkeleton() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="grid auto-rows-min grid-cols-2 gap-4 xl:grid-cols-3">
                <Skeleton className="aspect-video rounded-xl" />
                <Skeleton className="aspect-video rounded-xl" />
                <Skeleton className="aspect-video rounded-xl" />
            </div>

            <div className="min-h-screen flex-1 rounded-xl md:min-h-min">
                <div className="flex w-full flex-col gap-4">
                    <div className="overflow-hidden rounded-lg border shadow-sm">
                        <Table>
                            <TableHeader className="bg-muted">
                                <TableRow>
                                    <TableHead className="px-5 py-2">Project</TableHead>
                                    <TableHead className="px-5 py-2" style={{ width: '140px' }}>
                                        Status
                                    </TableHead>
                                    <TableHead className="px-5 py-2" style={{ width: '110px' }}>
                                        Plan
                                    </TableHead>
                                    <TableHead className="px-5 py-2" style={{ width: '130px' }}>
                                        Started
                                    </TableHead>
                                    <TableHead className="px-5 py-2 text-center" style={{ width: '90px' }}>
                                        Unread
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <ProjectSkeletonRow key={i} />
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
