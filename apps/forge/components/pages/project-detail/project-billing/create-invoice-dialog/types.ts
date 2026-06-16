import { InvoiceItemType } from '@repo/commons/types/forge-service-schema.type';

export interface LineItem {
    id: string;
    type: InvoiceItemType | '';
    description: string;
    amount: string;
}

export interface ValidationErrorPayload {
    statusCode?: number;
    message?: unknown;
}

export const TYPE_LABEL: Record<InvoiceItemType, string> = {
    [InvoiceItemType.Plan]: 'Plan',
    [InvoiceItemType.Addon]: 'Add-on',
};

export const DUE_PRESETS = [
    { label: 'Today', days: 0 },
    { label: 'Net 7', days: 7 },
    { label: 'Net 14', days: 14 },
    { label: 'Net 30', days: 30 },
];

export const DEFAULT_DUE_DAYS = 14;

export const GRID_COLS = 'grid-cols-[1.75rem_minmax(7rem,8rem)_minmax(0,1fr)_8.5rem_1.75rem]';
