import { Skeleton } from '@/shadcn/components/skeleton';
import PaymentPanelSkeleton from './payment-panel-skeleton';

export default function InvoicePaySkeleton() {
    return (
        <div className="w-full flex-1 p-4 md:p-8">
            <div className="mb-6">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="mt-1.5 h-4 w-72" />
            </div>

            <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(360px,480px)]">
                <div className="flex w-full min-w-0 flex-col gap-6">
                    <Skeleton className="h-5 w-32" />
                    <div className="flex flex-col gap-3">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                </div>

                <div className="border-border/50 min-w-0 xl:border-l xl:pl-8">
                    <div className="mb-4">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="mt-1.5 h-4 w-44" />
                    </div>
                    <PaymentPanelSkeleton />
                </div>
            </div>
        </div>
    );
}
