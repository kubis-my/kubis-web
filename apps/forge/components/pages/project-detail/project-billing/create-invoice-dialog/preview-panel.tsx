import { format } from 'date-fns';
import { Separator } from '@/shadcn/components/separator';
import { cn } from '@repo/shadcn-ui/lib/utils';
import { TYPE_LABEL } from './types';
import { formatMYR, parseMYR } from './utils';
import { useInvoiceForm } from './use-invoice-form';

interface InvoicePreviewPanelProps {
    form: ReturnType<typeof useInvoiceForm>;
}

export default function InvoicePreviewPanel({ form }: InvoicePreviewPanelProps) {
    const { items, dueAt, totalCents, formattedTotal, hasError } = form;

    return (
        <aside className="bg-muted/20 flex shrink-0 flex-col gap-4 border-t px-6 py-5 sm:px-7 md:w-[18rem] md:border-t-0 md:border-l md:overflow-y-auto scrollbar-hide">
            <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                Invoice preview
            </p>

            <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Due</span>
                <span className="font-medium">{dueAt ? format(dueAt, 'd MMM yyyy') : '—'}</span>
            </div>

            <Separator />

            <div className="flex flex-col gap-2.5">
                {items.map((item, index) => (
                    <div key={item.id} className="flex items-start justify-between gap-3 text-sm">
                        <div className="min-w-0">
                            <p className="truncate">
                                {item.description.trim() || `Item ${index + 1}`}
                            </p>
                            {item.type && (
                                <p className="text-muted-foreground text-xs">
                                    {TYPE_LABEL[item.type]}
                                </p>
                            )}
                        </div>
                        <span className="shrink-0 tabular-nums">
                            {formatMYR(parseMYR(item.amount))}
                        </span>
                    </div>
                ))}
            </div>

            <Separator className="mt-auto" />

            <div className="flex items-baseline justify-between gap-2">
                <span className="text-sm font-semibold">Total</span>
                <span
                    className={cn(
                        'truncate text-2xl font-semibold tracking-tight tabular-nums',
                        totalCents === 0 ? 'text-muted-foreground/45' : 'text-foreground',
                        hasError('summary', 'Amount') && 'text-destructive/50',
                    )}
                >
                    {formattedTotal}
                </span>
            </div>
        </aside>
    );
}
