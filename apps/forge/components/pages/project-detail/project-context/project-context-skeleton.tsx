import { Skeleton } from '@/shadcn/components/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shadcn/components/table';

function ContextTableSkeleton() {
    return (
        <Table>
            <TableHeader>
                <TableRow className="hover:bg-transparent">
                    <TableHead className="px-4 sm:px-5 w-[25%]">Key</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead className="w-20">Owner</TableHead>
                    <TableHead className="w-20">Secured</TableHead>
                    <TableHead className="w-[130px]">Created</TableHead>
                    <TableHead className="w-[130px]">Updated</TableHead>
                    <TableHead className="w-20 text-center px-4 sm:px-5">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {Array.from({ length: 4 }).map((_, i) => (
                    <TableRow className="hover:bg-transparent" key={i}>
                        <TableCell className="px-4 sm:px-5">
                            <Skeleton className="h-4 w-20" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-3.5 w-40" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-5 w-12 rounded-full" />
                        </TableCell>
                        <TableCell className="text-center">
                            <Skeleton className="mx-auto size-4 rounded-full" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-3.5 w-16" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-3.5 w-16" />
                        </TableCell>
                        <TableCell className="px-4 sm:px-5">
                            <div className="flex justify-end">
                                <Skeleton className="size-8 rounded-md" />
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

export default function ProjectContextSkeleton() {
    return (
        <div className="flex flex-1 flex-col px-4 pt-2 pb-4 md:px-8 md:pt-4 md:pb-8">
            <div className="flex w-full flex-col gap-6 py-2">
                <div>
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="mt-1.5 h-4 w-64" />
                </div>

                <section className="bg-card overflow-hidden rounded-xl border shadow-sm">
                    <div className="bg-muted/30 border-b px-4 py-3 sm:px-5">
                        <Skeleton className="h-5 w-44" />
                        <Skeleton className="mt-1.5 h-4 w-56" />
                    </div>
                    <ContextTableSkeleton />
                </section>
            </div>
        </div>
    );
}
