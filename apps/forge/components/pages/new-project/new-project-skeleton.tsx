import { Skeleton } from '@/shadcn/components/skeleton';
import { Separator } from '@/shadcn/components/separator';

function RichTextFieldSkeleton() {
    return (
        <div className="overflow-hidden rounded-md border">
            <div className="bg-muted/30 flex items-center gap-1 border-b px-2 py-1.5">
                <Skeleton className="h-6 w-6 rounded" />
                <Skeleton className="h-6 w-6 rounded" />
                <Skeleton className="h-6 w-6 rounded" />
                <Skeleton className="h-6 w-6 rounded" />
            </div>
            <div className="flex flex-col gap-2 p-3">
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3.5 w-4/5" />
                <Skeleton className="h-3.5 w-3/5" />
            </div>
        </div>
    );
}

export default function NewProjectSkeleton() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="mx-auto w-full max-w-2xl">
                <div className="mb-8">
                    <Skeleton className="h-7 w-40" />
                    <Skeleton className="mt-1.5 h-4 w-72" />
                </div>

                <div className="flex flex-col gap-10">
                    <section className="flex flex-col gap-6">
                        <div>
                            <Skeleton className="h-5 w-36" />
                            <Skeleton className="mt-1.5 h-4 w-56" />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Skeleton className="h-3.5 w-24" />
                            <Skeleton className="h-9 w-full rounded-md" />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Skeleton className="h-3.5 w-32" />
                            <Skeleton className="h-20 w-full rounded-md" />
                        </div>
                    </section>

                    <Separator />

                    <section className="flex flex-col gap-6">
                        <div>
                            <Skeleton className="h-5 w-28" />
                            <Skeleton className="mt-1.5 h-4 w-52" />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Skeleton className="h-3.5 w-48" />
                            <RichTextFieldSkeleton />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Skeleton className="h-3.5 w-52" />
                            <RichTextFieldSkeleton />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Skeleton className="h-3.5 w-40" />
                            <Skeleton className="h-9 w-full rounded-md" />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Skeleton className="h-3.5 w-32" />
                            <Skeleton className="h-9 w-full rounded-md" />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Skeleton className="h-3.5 w-36" />
                            <RichTextFieldSkeleton />
                        </div>

                        <Skeleton className="h-14 w-full rounded-lg" />
                    </section>

                    <div className="flex items-center justify-end gap-3 pb-8">
                        <Skeleton className="h-9 w-20 rounded-md" />
                        <Skeleton className="h-9 w-32 rounded-md" />
                    </div>
                </div>
            </div>
        </div>
    );
}
