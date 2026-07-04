import { Skeleton } from '@/shadcn/components/skeleton';

export default function ProjectDetailSkeleton() {
    return (
        <div className="flex flex-1 flex-col px-4 pt-2 pb-4 md:px-8 md:pt-4 md:pb-8">
            <div className="flex w-full flex-col gap-8 py-2">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    <Skeleton className="h-24 rounded-xl" />
                    <Skeleton className="h-24 rounded-xl" />
                    <Skeleton className="h-24 rounded-xl" />
                    <Skeleton className="h-24 rounded-xl" />
                </div>

                <div className="flex flex-col gap-4">
                    <Skeleton className="h-6 w-48" />
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Skeleton className="h-32 rounded-xl" />
                        <Skeleton className="h-32 rounded-xl" />
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-2/3" />
                </div>
            </div>
        </div>
    );
}
