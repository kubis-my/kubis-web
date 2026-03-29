'use client';

import { useState, useEffect } from 'react';
import { Button } from '@repo/shadcn-ui/components/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@repo/shadcn-ui/components/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@repo/shadcn-ui/components/alert-dialog';
import { IconArrowsMaximize, IconArrowsMinimize } from '@tabler/icons-react';
import { cn } from '@repo/shadcn-ui/lib/utils';
import type { Product } from '../catalog/catalog-container';
import { EditVariantProductForm } from './types/variant-product';

type Props = {
    product: Product | null;
    onClose: () => void;
};

export function CatalogEditVariantDialog({ product, onClose }: Props) {
    const open = product !== null && product.type === 'variant';
    const [maximized, setMaximized] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        if (!open) {
            setMaximized(false);
            setIsDirty(false);
            setConfirmOpen(false);
        }
    }, [open]);

    function handleOpenChange(next: boolean) {
        if (!next) {
            if (isDirty) {
                setConfirmOpen(true);
            } else {
                onClose();
            }
        }
    }

    function handleConfirmDiscard() {
        onClose();
    }

    return (
        <>
            <Dialog open={open} onOpenChange={handleOpenChange}>
                <DialogContent
                    showCloseButton={false}
                    onEscapeKeyDown={(e) => { if (!confirmOpen) e.preventDefault(); }}
                    onInteractOutside={(e) => { if (!confirmOpen) e.preventDefault(); }}
                    className={cn(
                        'flex flex-col gap-0 p-0',
                        'inset-0! m-auto translate-x-0! translate-y-0!',
                        'transition-[max-width,max-height,border-radius] duration-300 ease-in-out',
                        maximized
                            ? 'max-h-screen! max-w-screen! rounded-none!'
                            : 'max-h-[90vh] max-w-2xl rounded-lg',
                    )}
                >
                    <DialogHeader className="flex-row items-start justify-between border-b px-6 py-4">
                        <div className="flex flex-col gap-1">
                            <DialogTitle>Edit Variant Product</DialogTitle>
                            <DialogDescription>
                                Update product details and variant SKUs and prices.
                            </DialogDescription>
                        </div>

                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-7 shrink-0"
                            onClick={() => setMaximized((prev) => !prev)}
                        >
                            {maximized ? (
                                <IconArrowsMinimize className="size-4" />
                            ) : (
                                <IconArrowsMaximize className="size-4" />
                            )}
                        </Button>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto px-6">
                        {product && (
                            <EditVariantProductForm
                                product={product}
                                onClose={onClose}
                                onDirtyChange={setIsDirty}
                            />
                        )}
                    </div>

                    <DialogFooter className="border-t px-6 py-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" form="edit-variant-product-form">
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Discard changes?</AlertDialogTitle>
                        <AlertDialogDescription>
                            You have unsaved changes. Closing will discard them permanently.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Keep editing</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmDiscard}>
                            Discard
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
