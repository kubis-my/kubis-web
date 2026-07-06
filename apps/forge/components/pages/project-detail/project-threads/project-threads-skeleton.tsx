import { Skeleton } from '@/shadcn/components/skeleton';

function ThreadMessageGroupSkeleton({ bubbleWidths }: { bubbleWidths: string[] }) {
    return (
        <div className="flex gap-3 px-4 py-2 md:px-6">
            <Skeleton className="mt-0.5 size-9 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-24 rounded" />
                <div className="flex flex-col gap-1.5">
                    {bubbleWidths.map((width, i) => (
                        <Skeleton key={i} className={`h-12 rounded-lg ${width}`} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function ProjectThreadsSkeleton() {
    return (
        <div className="from-background via-background to-muted/20 relative flex h-[calc(100svh-var(--header-height))] min-h-0 shrink-0 flex-col overflow-hidden bg-linear-to-b md:h-[calc(100svh-var(--header-height)-1rem)]">
            <div className="min-h-0 flex-1 overflow-hidden py-3">
                <div className="flex items-center gap-4 px-4 py-5 md:px-6">
                    <div className="via-border to-border/30 h-px flex-1 bg-linear-to-r from-transparent" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                    <div className="via-border to-border/30 h-px flex-1 bg-linear-to-l from-transparent" />
                </div>

                <div className="space-y-3">
                    <ThreadMessageGroupSkeleton bubbleWidths={['w-2/3']} />
                    <ThreadMessageGroupSkeleton bubbleWidths={['w-1/2', 'w-1/3']} />
                    <ThreadMessageGroupSkeleton bubbleWidths={['w-3/5']} />
                </div>
            </div>

            <div className="bg-background/95 sticky bottom-0 z-20 border-t px-4 pt-4 pb-4 shadow-[0_-14px_30px_-26px_rgba(0,0,0,0.55)] backdrop-blur md:px-6">
                <Skeleton className="h-[46px] w-full rounded-xl" />
            </div>
        </div>
    );
}
