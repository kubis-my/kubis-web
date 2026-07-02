import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { useApolloClient, useMutation, useQuery } from '@apollo/client/react';
import { addDays, isSameDay, startOfDay } from 'date-fns';
import { toast } from 'sonner';
import { InvoiceItemType } from '@repo/commons/types/forge-service-schema.type';
import { hasGraphQLError } from '@repo/commons/utils/graphql';
import { bySortOrder } from '@repo/commons/utils/pagination-helpers';
import { GET_PACKAGE_PLAN } from '@/root/components/pages/forge/pricing/graphql';
import { CREATE_INVOICE_FOR_FORGE } from '../graphql';
import { DUE_PRESETS, LineItem, ValidationErrorPayload } from './types';
import { defaultDueAt, newItem, parseMYR, parseAmount, formatMYR } from './utils';

export function useInvoiceForm(onSuccess: () => void, activePlanId?: string) {
    const client = useApolloClient();
    const { projectId } = useParams<{ projectId: string }>();
    const [items, setItems] = useState<LineItem[]>([newItem()]);
    const [dueAt, setDueAt] = useState<Date | undefined>(defaultDueAt());
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [formValidation, setFormValidation] = useState<Record<string, string[]>>({});
    const [pendingFocusId, setPendingFocusId] = useState<string | null>(null);

    const descRefs = useRef<Record<string, HTMLInputElement | null>>({});
    const amountRefs = useRef<Record<string, HTMLInputElement | null>>({});

    const [createInvoice, { loading }] = useMutation(CREATE_INVOICE_FOR_FORGE, {
        errorPolicy: 'all',
    });

    const { data: planData } = useQuery(GET_PACKAGE_PLAN);
    const plans = [...(planData?.getPackagePlan?.plans ?? [])].sort(bySortOrder);

    const totalCents = items.reduce((sum, item) => sum + parseMYR(item.amount), 0);
    const formattedTotal = formatMYR(totalCents);

    useEffect(() => {
        if (pendingFocusId) {
            descRefs.current[pendingFocusId]?.focus();
            setPendingFocusId(null);
        }
    }, [pendingFocusId, items]);

    function resetForm() {
        setItems([newItem()]);
        setDueAt(defaultDueAt());
        setFormValidation({});
    }

    function updateItem(id: string, patch: Partial<LineItem>) {
        setItems((prev) => {
            const itemIndex = prev.findIndex((item) => item.id === id);

            if (itemIndex >= 0) {
                setFormValidation((row) => ({
                    ...row,
                    [`line.${itemIndex}`]: [],
                }));
            }

            return prev.map((item) => (item.id === id ? { ...item, ...patch } : item));
        });
    }

    function addItem() {
        const item = newItem();
        setItems((prev) => [...prev, item]);
        setPendingFocusId(item.id);
    }

    function removeItem(id: string) {
        setItems((prev) => prev.filter((item) => item.id !== id));
        setFormValidation({});
    }

    function clearSummaryError() {
        setFormValidation((row) => ({ ...row, summary: [] }));
    }

    function applyDuePreset(days: number) {
        setDueAt(startOfDay(addDays(new Date(), days)));
        clearSummaryError();
    }

    const activePresetDays = dueAt
        ? DUE_PRESETS.find((preset) =>
              isSameDay(dueAt, addDays(startOfDay(new Date()), preset.days)),
          )?.days
        : undefined;

    function handleDescKeyDown(e: React.KeyboardEvent<HTMLInputElement>, item: LineItem) {
        if (e.key === 'Enter' && !e.metaKey && !e.ctrlKey) {
            e.preventDefault();
            amountRefs.current[item.id]?.focus();
        }
    }

    function handleAmountKeyDown(e: React.KeyboardEvent<HTMLInputElement>, index: number) {
        if (e.key === 'Enter' && !e.metaKey && !e.ctrlKey) {
            e.preventDefault();
            const next = items[index + 1];
            if (next) {
                descRefs.current[next.id]?.focus();
            } else {
                addItem();
            }
        }
    }

    function handleFormKeyDown(e: React.KeyboardEvent<HTMLFormElement>) {
        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
            e.preventDefault();
            e.currentTarget.requestSubmit();
        }
    }

    function lineValidation(errors: string[] = []): boolean {
        let errorCount = 0;
        const packages = Object.keys(InvoiceItemType);

        for (const [i, item] of items.entries()) {
            const keys = [`items.${i}.description`, `items.${i}.amount`];

            const itemErrors = errors
                .filter((v) => keys.some((k) => v.includes(k)))
                .map((v) => v.replace(/^items\.\d+\./, 'Item '));

            if (!packages.includes(item.type)) {
                setFormValidation((row) => ({
                    ...row,
                    [`line.${i}`]: ['Please select a package type: Plan or Addon'],
                }));
                errorCount++;
            } else if (itemErrors.length > 0) {
                setFormValidation((row) => ({
                    ...row,
                    [`line.${i}`]: itemErrors,
                }));
                errorCount++;
            } else {
                setFormValidation((row) => ({
                    ...row,
                    [`line.${i}`]: [],
                }));
            }
        }

        return errorCount === 0;
    }

    function summaryValidation(errors: string[] = []) {
        const keys = [/^amount/, /^dueAt/];

        const itemErrors = errors
            .filter((v) => keys.some((k) => k.test(v)))
            .map((v) => v.replace(/^amount/, 'Amount').replace(/^dueAt/, 'Due date'));

        setFormValidation((row) => ({
            ...row,
            summary: itemErrors,
        }));
    }

    function hasError(field: string, prefix?: string) {
        const err = formValidation[field];

        if (Array.isArray(err) && prefix) {
            return new RegExp(`^${prefix}`).test(err.at(-1) ?? '');
        }

        return Boolean(err?.length);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!lineValidation()) return;

        summaryValidation([]);

        try {
            const { data, error } = await createInvoice({
                variables: {
                    input: {
                        projectPublicId: projectId,
                        amount: totalCents / 100,
                        dueAt: dueAt?.toISOString() ?? '',
                        items: items.map((item, i) => ({
                            type: item.type as InvoiceItemType,
                            description: item.description.trim(),
                            amount: parseAmount(item.amount),
                            sortOrder: i + 1,
                        })),
                    },
                },
            });

            if (hasGraphQLError(error)) {
                const gqlError = error.errors?.[0] || error.graphQLErrors?.[0];

                if (gqlError) {
                    const err = gqlError.extensions?.originalError as
                        | ValidationErrorPayload
                        | undefined;

                    if (
                        err?.statusCode === 400 &&
                        Array.isArray(err?.message) &&
                        err.message.every(
                            (message): message is string => typeof message === 'string',
                        )
                    ) {
                        lineValidation(err?.message);
                        summaryValidation(err?.message);
                        return;
                    }
                }
            }

            if (data) {
                client.refetchQueries({ include: ['GetProjectForForge'] });
                toast.success('Invoice created.', { position: 'top-center' });
                resetForm();
                onSuccess();
            }
        } catch {
            toast.error('Failed to create invoice.', { position: 'top-center' });
        }
    }

    return {
        items,
        plans,
        activePlanId,
        dueAt,
        calendarOpen,
        setCalendarOpen,
        setDueAt,
        loading,
        totalCents,
        formattedTotal,
        activePresetDays,
        descRefs,
        amountRefs,
        resetForm,
        updateItem,
        addItem,
        removeItem,
        clearSummaryError,
        applyDuePreset,
        formValidation,
        handleDescKeyDown,
        handleAmountKeyDown,
        handleFormKeyDown,
        handleSubmit,
        hasError,
    };
}
