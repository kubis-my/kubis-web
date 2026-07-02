import { InvoiceItemType } from '@repo/commons/types/forge-service-schema.type';

export const ITEM_TYPE_LABEL: Record<InvoiceItemType, string> = {
    Plan: 'Plan',
    Addon: 'Add-on',
};

export const MAX_POLL_DURATION_MS = 60_000;

export function formatAmount(amount: number) {
    return new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR' }).format(amount);
}
