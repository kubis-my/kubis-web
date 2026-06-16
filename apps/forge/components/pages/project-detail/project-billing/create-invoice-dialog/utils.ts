import { addDays, startOfDay } from 'date-fns';
import { DEFAULT_DUE_DAYS, LineItem } from './types';

export function newItem(): LineItem {
    return {
        id: crypto.randomUUID(),
        type: '',
        description: '',
        amount: '',
    };
}

export function defaultDueAt(): Date {
    return startOfDay(addDays(new Date(), DEFAULT_DUE_DAYS));
}

export function parseMYR(value: string): number {
    const n = parseFloat(value.replace(/,/g, ''));
    return isNaN(n) ? 0 : Math.round(n * 100);
}

export function parseAmount(value: string): number {
    const n = parseFloat(value.replace(/,/g, ''));
    return isNaN(n) ? 0 : Math.round(n * 100) / 100;
}

export function formatMYR(cents: number) {
    return new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR' }).format(
        cents / 100,
    );
}

export function formatAmount(value: string): string {
    const n = parseFloat(value.replace(/,/g, ''));
    if (isNaN(n) || value === '') return '';
    return new Intl.NumberFormat('en-MY', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(n);
}

export function sanitizeAmount(value: string): string {
    const cleaned = value.replace(/[^\d.]/g, '');
    const dotIndex = cleaned.indexOf('.');
    if (dotIndex === -1) return cleaned;
    return cleaned.slice(0, dotIndex + 1) + cleaned.slice(dotIndex + 1).replace(/\./g, '');
}
