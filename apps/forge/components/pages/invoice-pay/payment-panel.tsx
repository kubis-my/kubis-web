import { Ban, CheckCircle2 } from 'lucide-react';
import { Elements } from '@stripe/react-stripe-js';
import { Skeleton } from '@/shadcn/components/skeleton';
import { InvoiceStatus } from '@repo/commons/types/forge-service-schema.type';
import type { Invoice } from '@repo/commons/types/forge-service-schema.type';
import { getStripe } from '@/root/libs/stripe-client';
import PaymentForm from './payment-form';
import { formatDate } from './utils';

interface PaymentPanelProps {
    invoice: Invoice | undefined;
    invoiceLoading: boolean;
    clientSecret: string | undefined;
    secretLoading: boolean;
    timedOut: boolean;
    publicId: string;
    projectId: string;
    isPostPayment: boolean;
}

export default function PaymentPanel({
    invoice,
    invoiceLoading,
    clientSecret,
    secretLoading,
    timedOut,
    publicId,
    projectId,
    isPostPayment,
}: PaymentPanelProps) {
    return (
        <div className="border-border/50 min-w-0 xl:sticky xl:top-6 xl:self-start xl:border-l xl:pl-8">
            <div className="mb-4">
                <h2 className="text-base font-semibold">Payment details</h2>
                <p className="text-muted-foreground mt-1 text-xs">
                    Secure payment powered by Stripe.
                </p>
            </div>
            {invoiceLoading || !invoice ? (
                <div className="flex flex-col gap-3">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-9 w-full" />
                </div>
            ) : invoice.status === InvoiceStatus.PAID ? (
                <div className="bg-muted/30 flex flex-col items-center gap-4 rounded-lg border p-6 text-center">
                    <div className="flex size-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                        <CheckCircle2 className="size-5" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="text-sm font-medium">Payment complete</p>
                        <p className="text-muted-foreground text-sm">
                            {invoice.paidAt
                                ? `This invoice was paid on ${formatDate(invoice.paidAt)}.`
                                : 'This invoice has been paid.'}
                            {invoice.invoicePdf && (
                                <>
                                    {' '}
                                    Here is the link to{' '}
                                    <a
                                        href={invoice.invoicePdf}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-foreground underline underline-offset-2"
                                    >
                                        download the invoice PDF
                                    </a>
                                    .
                                </>
                            )}
                        </p>
                    </div>
                </div>
            ) : invoice.status === InvoiceStatus.CANCELLED ? (
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
            ) : secretLoading || !clientSecret ? (
                <div className="flex flex-col gap-3">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-9 w-full" />
                </div>
            ) : (
                <Elements stripe={getStripe()} options={{ clientSecret }}>
                    <PaymentForm
                        publicId={publicId}
                        projectId={projectId}
                        totalAmount={invoice.amount}
                        error={timedOut ? "This is taking longer than expected. Refresh this page in a moment, or check back later - we'll update the invoice once payment is confirmed." : ""}
                        isPostPayment={isPostPayment}
                    />
                </Elements>
            )}
        </div>
    );
}
