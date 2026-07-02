'use client';

import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Button } from '@/shadcn/components/button';
import { env } from '@repo/commons/constant/env';

function formatAmount(amount: number) {
    return new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR' }).format(amount);
}

interface PaymentFormProps {
    publicId: string;
    projectId: string;
    totalAmount: number;
    error?: string | null
    isPostPayment: boolean
}

export default function PaymentForm({ publicId, projectId, totalAmount, error = null, isPostPayment }: PaymentFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(error);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!stripe || !elements) return;

        setIsSubmitting(true);
        setErrorMessage(null);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${env.NEXT_PUBLIC_FORGE_APP_BASE_URL}/projects/${projectId}/billing/${publicId}`,
            },
        });

        if (error) {
            setErrorMessage(error.message ?? 'Payment failed. Please try again.');
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <PaymentElement />
            {errorMessage && (
                <p className="text-destructive text-sm">{errorMessage}</p>
            )}
            <Button type="submit" disabled={!stripe || isSubmitting} className="w-full">
                {(isSubmitting || isPostPayment) ? 'Processing...' : `Pay ${formatAmount(totalAmount)}`}
            </Button>
        </form>
    );
}
