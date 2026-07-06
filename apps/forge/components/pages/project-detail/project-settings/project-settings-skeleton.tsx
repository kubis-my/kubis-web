import { Skeleton } from '@/shadcn/components/skeleton';

function SectionHeaderSkeleton({ titleWidth, descWidth }: { titleWidth: string; descWidth: string }) {
    return (
        <div className="bg-muted/30 border-b px-4 py-3 sm:px-5">
            <Skeleton className={`h-5 ${titleWidth}`} />
            <Skeleton className={`mt-1.5 h-4 ${descWidth}`} />
        </div>
    );
}

function SwitchRowSkeleton({ className }: { className?: string }) {
    return (
        <div className={`flex items-center justify-between gap-4 ${className ?? ''}`}>
            <div className="flex flex-col gap-1.5">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-3.5 w-52" />
            </div>
            <Skeleton className="h-5 w-9 shrink-0 rounded-full" />
        </div>
    );
}

export default function ProjectSettingsSkeleton() {
    return (
        <div className="flex flex-1 flex-col px-4 pt-2 pb-4 md:px-8 md:pt-4 md:pb-8">
            <div className="flex w-full flex-col gap-6 py-2">
                <div>
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="mt-1.5 h-4 w-56" />
                </div>

                <div className="bg-card overflow-hidden rounded-xl border shadow-sm">
                    <SectionHeaderSkeleton titleWidth="w-32" descWidth="w-52" />
                    <div className="grid gap-5 px-4 py-5 sm:px-5">
                        <div className="grid gap-2">
                            <Skeleton className="h-3.5 w-24" />
                            <Skeleton className="h-9 w-full rounded-md" />
                        </div>
                        <div className="grid gap-5 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Skeleton className="h-3.5 w-20" />
                                <Skeleton className="h-9 w-full rounded-md" />
                            </div>
                            <div className="grid gap-2">
                                <Skeleton className="h-3.5 w-28" />
                                <Skeleton className="h-9 w-full rounded-md" />
                            </div>
                        </div>
                        <div className="grid gap-2 sm:grid-cols-3">
                            <Skeleton className="h-9 w-full rounded-md" />
                            <Skeleton className="h-9 w-full rounded-md" />
                            <Skeleton className="h-9 w-full rounded-md" />
                        </div>
                    </div>
                </div>

                <div className="bg-card overflow-hidden rounded-xl border shadow-sm">
                    <SectionHeaderSkeleton titleWidth="w-36" descWidth="w-64" />
                    <div className="divide-y px-4 sm:px-5">
                        <SwitchRowSkeleton className="py-4" />
                        <SwitchRowSkeleton className="py-4" />
                        <SwitchRowSkeleton className="py-4" />
                    </div>
                </div>

                <div className="bg-card overflow-hidden rounded-xl border shadow-sm">
                    <SectionHeaderSkeleton titleWidth="w-28" descWidth="w-60" />
                    <div className="flex flex-col gap-5 px-4 py-5 sm:px-5">
                        <SwitchRowSkeleton />
                        <SwitchRowSkeleton />
                        <SwitchRowSkeleton />
                        <SwitchRowSkeleton />
                    </div>
                </div>

                <div className="bg-card overflow-hidden rounded-xl border shadow-sm">
                    <SectionHeaderSkeleton titleWidth="w-40" descWidth="w-72" />
                    <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-4">
                        <Skeleton className="h-48 rounded-lg" />
                        <Skeleton className="h-48 rounded-lg" />
                        <Skeleton className="h-48 rounded-lg" />
                        <Skeleton className="h-48 rounded-lg" />
                    </div>
                </div>
            </div>
        </div>
    );
}
