'use client';

import { useState } from 'react';
import { Loader2, ReceiptText } from 'lucide-react';
import { Button } from '@/shadcn/components/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/shadcn/components/dialog';
import { Separator } from '@/shadcn/components/separator';
import { IconPlus } from '@tabler/icons-react';
import { useInvoiceForm } from './use-invoice-form';
import InvoiceLineItemsSection from './line-items-section';
import InvoiceDueDateSection from './due-date-section';
import InvoicePreviewPanel from './preview-panel';

interface CreateInvoiceDialogProps {
    activePlanId?: string;
}

export default function CreateInvoiceDialog({ activePlanId }: CreateInvoiceDialogProps) {
    const [open, setOpen] = useState(false);
    const form = useInvoiceForm(() => setOpen(false), activePlanId);
    const { loading, resetForm, handleSubmit, handleFormKeyDown } = form;

    return (
        <Dialog
            open={open}
            onOpenChange={(value) => {
                setOpen(value);
                if (!value) resetForm();
            }}
        >
            <Button variant="ghost" size="icon" className="size-7" onClick={() => setOpen(true)}>
                <IconPlus className="size-4" />
            </Button>

            <DialogContent className="border-border/70 flex max-h-[92vh] max-w-5xl flex-col gap-0 overflow-hidden p-0 shadow-2xl sm:max-w-5xl sm:rounded-2xl">
                <DialogHeader className="bg-muted/20 border-b px-6 py-5 sm:px-7">
                    <div className="flex items-start gap-3 pr-8">
                        <div className="bg-background flex size-10 shrink-0 items-center justify-center rounded-xl border shadow-xs">
                            <ReceiptText className="text-muted-foreground size-5" />
                        </div>
                        <div className="min-w-0">
                            <DialogTitle className="text-xl font-semibold tracking-tight">
                                New Invoice
                            </DialogTitle>
                            <DialogDescription className="mt-1 text-sm leading-6">
                                Add billable items, choose a due date, and review the calculated
                                total before sending.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form
                    id="create-invoice-form"
                    onSubmit={handleSubmit}
                    onKeyDown={handleFormKeyDown}
                    className="flex flex-1 flex-col overflow-hidden"
                >
                    <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
                        <div className="scrollbar-hide flex-1 overflow-y-auto px-6 py-5 sm:px-7">
                            <InvoiceLineItemsSection form={form} />
                            <Separator className="my-5" />
                            <InvoiceDueDateSection form={form} />
                        </div>

                        <InvoicePreviewPanel form={form} />
                    </div>

                    <DialogFooter className="bg-background/95 border-t px-6 py-4 sm:px-7">
                        <Button
                            type="button"
                            variant="outline"
                            disabled={loading}
                            onClick={() => {
                                setOpen(false);
                                resetForm();
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            form="create-invoice-form"
                            disabled={loading}
                            className="min-w-36 gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                'Create invoice'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
