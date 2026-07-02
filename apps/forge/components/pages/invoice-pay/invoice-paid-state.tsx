import { CheckCircle2 } from 'lucide-react';
import type { Invoice } from '@repo/commons/types/forge-service-schema.type';
import { Button } from '@/shadcn/components/button';

interface InvoicePaidStateProps {
    invoice: Invoice;
}

export default function InvoicePaidState({ invoice }: InvoicePaidStateProps) {
    return (
        <div className="bg-muted/30 flex flex-col items-center gap-4 rounded-lg border p-6 text-center">
            <div className="flex size-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                <CheckCircle2 className="size-5" />
            </div>
            <div className="flex w-full flex-col items-center gap-1">
                <p className="text-sm font-medium">Payment complete</p>
                <p className="text-muted-foreground text-sm">
                    Your payment has been received successfully.
                </p>

                <Button asChild size="sm" className="mt-4 max-w-sm">
                    <a href={invoice.invoicePdf ?? ""} target="_blank" rel="noreferrer">
                        Download invoice
                    </a>
                </Button>
            </div>
        </div>
    );
}
