import { Skeleton } from '@/shadcn/components/skeleton';

export default function Loading() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Skeleton className="aspect-video rounded-xl" />
                <Skeleton className="aspect-video rounded-xl" />
                <Skeleton className="aspect-video rounded-xl" />
            </div>
            <Skeleton className="h-64 w-full rounded-xl" />
        </div>
    );
}
