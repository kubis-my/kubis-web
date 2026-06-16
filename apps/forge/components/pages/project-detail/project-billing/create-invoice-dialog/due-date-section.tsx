import { CalendarIcon } from 'lucide-react';
import { format, startOfDay } from 'date-fns';
import { Button } from '@/shadcn/components/button';
import { Calendar } from '@/shadcn/components/calendar';
import { Label } from '@/shadcn/components/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/shadcn/components/popover';
import { cn } from '@repo/shadcn-ui/lib/utils';
import ShowErrorText from '@/shadcn/custom-components/show-error-text';
import { DUE_PRESETS } from './types';
import { useInvoiceForm } from './use-invoice-form';

interface InvoiceDueDateSectionProps {
    form: ReturnType<typeof useInvoiceForm>;
}

export default function InvoiceDueDateSection({ form }: InvoiceDueDateSectionProps) {
    const {
        dueAt,
        setDueAt,
        calendarOpen,
        setCalendarOpen,
        activePresetDays,
        formValidation,
        applyDuePreset,
        clearSummaryError,
        hasError,
    } = form;

    return (
        <section className="space-y-3">
            <div>
                <Label className="text-sm font-semibold">
                    Due date <span className="text-destructive">*</span>
                </Label>
                <p className="text-muted-foreground mt-0.5 text-xs">
                    Invoices cannot be due before today.
                </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                {DUE_PRESETS.map((preset) => (
                    <Button
                        key={preset.label}
                        type="button"
                        size="sm"
                        variant={activePresetDays === preset.days ? 'default' : 'outline'}
                        className="h-8 px-3 text-xs font-medium"
                        onClick={() => applyDuePreset(preset.days)}
                    >
                        {preset.label}
                    </Button>
                ))}

                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            type="button"
                            variant={activePresetDays === undefined ? 'default' : 'outline'}
                            size="sm"
                            className={cn(
                                'h-8 gap-2 px-3 text-xs font-medium',
                                hasError('summary', 'Due date') &&
                                    'border border-destructive/50! bg-background/10! text-accent-foreground',
                            )}
                        >
                            <CalendarIcon className="size-3.5 shrink-0" />
                            {dueAt ? format(dueAt, 'd MMM yyyy') : 'Custom'}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={dueAt}
                            onSelect={(date) => {
                                setDueAt(date);
                                setCalendarOpen(false);
                                clearSummaryError();
                            }}
                            disabled={(date) => date < startOfDay(new Date())}
                        />
                    </PopoverContent>
                </Popover>
            </div>

            <ShowErrorText
                field="summary"
                error={formValidation}
                className="ml-0 block max-w-xs text-xs font-medium"
            />
        </section>
    );
}
