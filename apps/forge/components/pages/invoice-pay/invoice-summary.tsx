import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/components/card';
import { Skeleton } from '@/shadcn/components/skeleton';
import type { Invoice, InvoiceItem } from '@repo/commons/types/forge-service-schema.type';
import { ITEM_TYPE_LABEL, formatAmount, formatDate } from './utils';

interface InvoiceSummaryProps {
    invoice: Invoice | undefined;
    invoiceLoading: boolean;
    projectName: string | undefined;
    sortedItems: InvoiceItem[];
    subtotal: number;
}

export default function InvoiceSummary({
    invoice,
    invoiceLoading,
    projectName,
    sortedItems,
    subtotal,
}: InvoiceSummaryProps) {
    return (
        <Card className="h-fit w-full min-w-0 gap-6 border-0 bg-transparent p-0 shadow-none">
            <CardHeader className="px-0 pb-0">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <CardTitle className="text-base">Invoice summary</CardTitle>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-6 px-0">
                {invoiceLoading || !invoice ? (
                    <div className="flex flex-col gap-3">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                ) : (
                    <>
                        {/* Invoice metadata */}
                        <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
                            <div className="min-w-0">
                                <p className="text-muted-foreground text-xs">Due date</p>
                                <p className="mt-0.5 font-medium wrap-break-word">{formatDate(invoice.dueAt)}</p>
                            </div>
                            {projectName && (
                                <div className="min-w-0">
                                    <p className="text-muted-foreground text-xs">Project</p>
                                    <p className="mt-0.5 font-medium wrap-break-word">{projectName}</p>
                                </div>
                            )}
                            {invoice?.externalBillId && (
                                <div className="min-w-0 ml-auto">
                                    <p className="text-muted-foreground text-xs">ID</p>
                                    <p className="mt-0.5 font-medium break-all">{invoice.externalBillId}</p>
                                </div>
                            )}
                        </div>

                        {/* Billable items */}
                        <div className='border-t border-border/40'>
                            <p className="text-muted-foreground mb-4 text-xs font-medium uppercase tracking-wide pt-6">
                                Billable items
                            </p>
                            <div className="flex flex-col gap-4">
                                {sortedItems.map((item) => (
                                    <div
                                        key={item.publicId}
                                        className="flex items-center justify-between gap-4"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium wrap-break-word">{item.description}</p>
                                            {item.type && (
                                                <p className="text-muted-foreground mt-0.5 text-xs">
                                                    {ITEM_TYPE_LABEL[item.type] ?? item.type}
                                                </p>
                                            )}
                                        </div>
                                        <span className="shrink-0 text-right text-sm font-semibold tabular-nums">
                                            {formatAmount(item.amount)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Payment summary */}
                        <div className="border-border/40 flex flex-col gap-2 border-t pt-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span className="tabular-nums">{formatAmount(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm font-semibold">
                                <span>Total due</span>
                                <span className="tabular-nums">{formatAmount(invoice.amount)}</span>
                            </div>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
