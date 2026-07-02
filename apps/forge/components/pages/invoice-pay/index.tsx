'use client';

import { useParams } from 'next/navigation';
import { useProjectDetail } from '../project-detail/project-detail-container';
import { useInvoicePayment } from './use-invoice-payment';
import InvoiceSummary from './invoice-summary';
import PaymentPanel from './payment-panel';

export default function InvoicePay() {
    const { publicId, projectId } = useParams<{ publicId: string; projectId: string }>();
    const { project } = useProjectDetail();
    const projectName = project.name;

    const {
        invoice,
        invoiceLoading,
        sortedItems,
        subtotal,
        clientSecret,
        secretLoading,
        isPostPayment,
        timedOut,
    } = useInvoicePayment(publicId);

    return (
        <div className="w-full flex-1 p-4 md:p-8">
            <div className="mb-6">
                <h1 className="text-xl font-semibold tracking-tight">Pay invoice</h1>
                <p className="text-muted-foreground mt-1 text-sm">
                    Review the invoice details and complete payment securely.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(360px,480px)]">
                <InvoiceSummary
                    invoice={invoice}
                    invoiceLoading={invoiceLoading}
                    projectName={projectName}
                    sortedItems={sortedItems}
                    subtotal={subtotal}
                />

                <PaymentPanel
                    invoice={invoice}
                    invoiceLoading={invoiceLoading}
                    clientSecret={clientSecret}
                    secretLoading={secretLoading}
                    timedOut={timedOut}
                    publicId={publicId}
                    projectId={projectId}
                    isPostPayment={isPostPayment}
                />
            </div>
        </div>
    );
}
