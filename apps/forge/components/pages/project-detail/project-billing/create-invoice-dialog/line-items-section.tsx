import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/shadcn/components/button';
import { Input } from '@/shadcn/components/input';
import { Label } from '@/shadcn/components/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shadcn/components/select';
import { cn } from '@repo/shadcn-ui/lib/utils';
import { InvoiceItemType } from '@repo/commons/types/forge-service-schema.type';
import ShowErrorText from '@/shadcn/custom-components/show-error-text';
import { GRID_COLS } from './types';
import { formatAmount, sanitizeAmount } from './utils';
import { useInvoiceForm } from './use-invoice-form';

interface InvoiceLineItemsSectionProps {
    form: ReturnType<typeof useInvoiceForm>;
}

export default function InvoiceLineItemsSection({ form }: InvoiceLineItemsSectionProps) {
    const {
        items,
        plans,
        activePlanId,
        isOneTimePayOff,
        descRefs,
        amountRefs,
        formValidation,
        updateItem,
        addItem,
        removeItem,
        handleDescKeyDown,
        handleAmountKeyDown,
    } = form;

    return (
        <section className="space-y-3">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <Label className="text-sm font-semibold">Line items</Label>
                    <p className="text-muted-foreground mt-0.5 text-xs">
                        Describe each charge and enter its MYR amount.
                    </p>
                </div>
                <span className="bg-background text-muted-foreground rounded-full border px-2.5 py-1 text-xs font-medium tabular-nums">
                    {items.length} {items.length === 1 ? 'item' : 'items'}
                </span>
            </div>

            <div className="border-border/70 bg-card overflow-hidden rounded-xl border shadow-xs">
                <div
                    className={cn(
                        'bg-muted/30 text-muted-foreground grid gap-2 border-b px-3 py-2 text-xs font-medium',
                        GRID_COLS,
                    )}
                >
                    <span className="text-center">#</span>
                    <span>Type</span>
                    <span>Description</span>
                    <span className="text-right">Amount (RM)</span>
                    <span />
                </div>

                <div className="divide-y">
                    {items.map((item, index) => {
                        const selectedPlan =
                            item.type === InvoiceItemType.Plan
                                ? plans.find((plan) => plan.name === item.description)
                                : undefined;
                        const isAmountReadOnly = Boolean(
                            selectedPlan && !selectedPlan.isCustomPricing,
                        );

                        return (
                            <div key={item.id} className={cn('px-3 py-2 transition-colors')}>
                                <div className={cn('grid items-center gap-2', GRID_COLS)}>
                                    <span className="bg-muted text-muted-foreground mx-auto flex size-6 items-center justify-center rounded-full text-xs font-semibold tabular-nums">
                                        {index + 1}
                                    </span>

                                    <Select
                                        value={item.type}
                                        onValueChange={(val) =>
                                            updateItem(item.id, {
                                                type: val as InvoiceItemType,
                                                description: '',
                                                amount: '',
                                            })
                                        }
                                    >
                                        <SelectTrigger className="bg-background h-9 w-full data-[size=default]:h-9">
                                            <SelectValue placeholder="Package" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem
                                                value={InvoiceItemType.Plan}
                                                disabled={isOneTimePayOff}
                                            >
                                                Plan
                                            </SelectItem>
                                            <SelectItem value={InvoiceItemType.Addon}>
                                                Add-on
                                            </SelectItem>
                                            <SelectItem value={InvoiceItemType.Service}>
                                                Service
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>

                                    {item.type === InvoiceItemType.Plan ? (
                                        <Select
                                            value={item.description}
                                            onValueChange={(val) => {
                                                const plan = plans.find((p) => p.name === val);

                                                updateItem(item.id, {
                                                    description: val,
                                                    amount:
                                                        plan && !plan.isCustomPricing
                                                            ? formatAmount(
                                                                String(plan.priceAmount / 100),
                                                            )
                                                            : '',
                                                });
                                            }}
                                        >
                                            <SelectTrigger className="bg-background h-9 w-full data-[size=default]:h-9">
                                                <SelectValue placeholder="Select a plan" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {plans.map((plan) => (
                                                    <SelectItem
                                                        key={plan.publicId}
                                                        value={plan.name}
                                                        disabled={plan.publicId !== activePlanId}
                                                    >
                                                        {plan.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <Input
                                            ref={(el) => {
                                                descRefs.current[item.id] = el;
                                            }}
                                            value={item.description}
                                            onChange={(e) =>
                                                updateItem(item.id, {
                                                    description: e.target.value,
                                                })
                                            }
                                            onKeyDown={(e) => handleDescKeyDown(e, item)}
                                            placeholder="e.g. Monthly retainer - Growth plan"
                                            className="bg-background h-9 w-full text-sm"
                                            autoComplete="off"
                                        />
                                    )}

                                    <div className="relative">
                                        <span className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-xs font-semibold select-none">
                                            RM
                                        </span>
                                        <Input
                                            ref={(el) => {
                                                amountRefs.current[item.id] = el;
                                            }}
                                            value={item.amount}
                                            onChange={(e) =>
                                                updateItem(item.id, {
                                                    amount: sanitizeAmount(e.target.value),
                                                })
                                            }
                                            onFocus={(e) => {
                                                if (isAmountReadOnly) return;
                                                updateItem(item.id, {
                                                    amount: e.target.value.replace(/,/g, ''),
                                                });
                                            }}
                                            onBlur={(e) => {
                                                if (isAmountReadOnly) return;
                                                updateItem(item.id, {
                                                    amount: formatAmount(e.target.value),
                                                });
                                            }}
                                            onKeyDown={(e) => handleAmountKeyDown(e, index)}
                                            placeholder="0.00"
                                            readOnly={isAmountReadOnly}
                                            className={cn(
                                                'bg-background h-9 w-full pl-10 text-right text-sm tabular-nums',
                                                isAmountReadOnly && 'bg-muted/40 cursor-default',
                                            )}
                                            inputMode="decimal"
                                            autoComplete="off"
                                        />
                                    </div>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive size-8 shrink-0 disabled:opacity-30"
                                        onClick={() => removeItem(item.id)}
                                        disabled={items.length === 1}
                                        aria-label={`Remove line item ${index + 1}`}
                                    >
                                        <Trash2 className="size-4" />
                                    </Button>
                                </div>

                                <ShowErrorText
                                    field={`line.${index}`}
                                    error={formValidation}
                                    className="mt-1.5 block pl-9 text-xs font-medium"
                                />
                            </div>
                        );
                    })}
                </div>
            </div>

            <button
                type="button"
                className="border-border/70 bg-muted/20 text-muted-foreground hover:border-border hover:bg-muted/40 hover:text-foreground focus-visible:ring-ring flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-dashed text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                onClick={addItem}
            >
                <Plus className="size-4" />
                Add line item
            </button>
        </section>
    );
}
