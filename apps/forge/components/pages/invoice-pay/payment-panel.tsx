import { Elements } from '@stripe/react-stripe-js';
import { InvoiceStatus } from '@repo/commons/types/forge-service-schema.type';
import type { Invoice } from '@repo/commons/types/forge-service-schema.type';
import { getStripe } from '@/root/libs/stripe-client';
import PaymentForm from './payment-form';
import PaymentPanelSkeleton from './payment-panel-skeleton';
import InvoicePaidState from './invoice-paid-state';
import InvoiceCancelledState from './invoice-cancelled-state';

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
                <PaymentPanelSkeleton />
            ) : invoice.status === InvoiceStatus.PAID ? (
                <InvoicePaidState invoice={invoice} />
            ) : invoice.status === InvoiceStatus.CANCELLED ? (
                <InvoiceCancelledState />
            ) : secretLoading || !clientSecret ? (
                <PaymentPanelSkeleton />
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
