import { Ban } from 'lucide-react';

export default function InvoiceCancelledState() {
    return (
        <div className="bg-muted/30 flex flex-col items-center gap-3 rounded-lg border p-6 text-center">
            <div className="bg-muted flex size-10 items-center justify-center rounded-full">
                <Ban className="text-muted-foreground size-5" />
            </div>
            <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">Invoice cancelled</p>
                <p className="text-muted-foreground text-sm">
                    This invoice was cancelled and can no longer be paid.
                </p>
            </div>
            <p className="text-muted-foreground text-xs">
                Please contact the project owner if you believe this is a mistake.
            </p>
        </div>
    );
}
