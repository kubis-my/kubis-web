import { Skeleton } from '@/shadcn/components/skeleton';

function MilestoneStepperSkeleton() {
    const steps = 4;

    return (
        <div className="flex items-start">
            {Array.from({ length: steps }).map((_, i) => (
                <div key={i} className="flex flex-1 flex-col items-center">
                    <div className="flex w-full items-center">
                        <div className={`h-px flex-1 ${i === 0 ? 'invisible' : 'bg-border'}`} />
                        <Skeleton className="size-9 shrink-0 rounded-full" />
                        <div className={`h-px flex-1 ${i === steps - 1 ? 'invisible' : 'bg-border'}`} />
                    </div>
                    <div className="mt-3 flex flex-col items-center gap-1.5 px-1">
                        <Skeleton className="h-3.5 w-16" />
                        <Skeleton className="h-4 w-12 rounded-md" />
                    </div>
                </div>
            ))}
        </div>
    );
}

function MilestoneCardSkeleton() {
    return (
        <div className="bg-card overflow-hidden rounded-xl border shadow-sm">
            <div className="bg-muted/30 flex items-center justify-between border-b px-4 py-3 sm:px-5">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-5 w-20 rounded-md" />
                </div>
                <Skeleton className="size-8 shrink-0 rounded-md" />
            </div>

            <div className="divide-y">
                {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="grid gap-3 px-4 py-4 sm:grid-cols-[108px_1fr] sm:gap-4 sm:px-5">
                        <Skeleton className="h-3.5 w-20" />
                        <div className="flex flex-col gap-1.5">
                            <Skeleton className="h-3.5 w-full" />
                            <Skeleton className="h-3.5 w-2/3" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function ProjectMilestonesSkeleton() {
    return (
        <div className="flex flex-1 flex-col px-4 pt-2 pb-4 md:px-8 md:pt-4 md:pb-8">
            <div className="flex w-full flex-col gap-8 py-2">
                <div>
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="mt-1.5 h-4 w-60" />
                </div>

                <MilestoneStepperSkeleton />

                <div className="space-y-5">
                    <MilestoneCardSkeleton />
                    <MilestoneCardSkeleton />
                    <MilestoneCardSkeleton />
                </div>
            </div>
        </div>
    );
}
