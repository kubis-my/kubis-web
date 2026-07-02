import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@apollo/client/react';
import { InvoiceStatus } from '@repo/commons/types/forge-service-schema.type';
import { GET_INVOICE_FOR_FORGE, GET_INVOICE_CLIENT_SECRET_FOR_FORGE } from './graphql';
import { MAX_POLL_DURATION_MS } from './utils';

export function useInvoicePayment(publicId: string) {
    const searchParams = useSearchParams();
    const isPostPayment = searchParams.get('redirect_status') === 'succeeded';
    const [timedOut, setTimedOut] = useState(false);

    const { data: invoiceData, loading: invoiceLoading, startPolling, stopPolling } = useQuery(GET_INVOICE_FOR_FORGE, {
        variables: { publicId },
    });

    const invoice = invoiceData?.getInvoiceForForge;
    const isPaid = invoice?.status === InvoiceStatus.PAID;
    const isPayable = invoice?.status === InvoiceStatus.PENDING;

    useEffect(() => {
        if (!isPostPayment) return;
        if (isPaid) {
            stopPolling();
            return;
        }
        startPolling(2000);
        const timer = setTimeout(() => {
            stopPolling();
            setTimedOut(true);
        }, MAX_POLL_DURATION_MS);
        return () => {
            stopPolling();
            clearTimeout(timer);
        };
    }, [isPostPayment, isPaid, startPolling, stopPolling]);

    const { data: secretData, loading: secretLoading } = useQuery(
        GET_INVOICE_CLIENT_SECRET_FOR_FORGE,
        {
            variables: { publicId },
            skip: !invoice || !isPayable,
        },
    );

    const clientSecret = secretData?.getInvoiceClientSecretForForge;
    const sortedItems = invoice ? [...invoice.items].sort((a, b) => a.sortOrder - b.sortOrder) : [];
    const subtotal = sortedItems.reduce((sum, item) => sum + item.amount, 0);

    return {
        invoice,
        invoiceLoading,
        sortedItems,
        subtotal,
        clientSecret,
        secretLoading,
        isPostPayment,
        timedOut,
    };
}
