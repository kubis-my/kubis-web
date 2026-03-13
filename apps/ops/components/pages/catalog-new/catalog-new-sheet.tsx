'use client';

import { useEffect, useState } from 'react';
import { Button } from '@repo/shadcn-ui/components/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
} from '@repo/shadcn-ui/components/sheet';
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
import type { ProductType } from '../catalog/catalog-container';
import { SimpleProductForm } from './types/simple-product';
import { DigitalProductForm } from './types/digital-product';
import { ServiceProductForm } from './types/service-product';
import { BundleProductForm } from './types/bundle-product';
import { CustomProductForm } from './types/custom-product';

type DrawerProductType = Exclude<ProductType, 'variant'>;

const TYPE_LABELS: Record<DrawerProductType, string> = {
    simple: 'Simple',
    digital: 'Digital',
    service: 'Service',
    bundle: 'Bundle',
    custom: 'Custom',
};

const TYPE_SUBTITLES: Record<DrawerProductType, string> = {
    simple: 'Best for single-item products with one SKU and straightforward pricing.',
    digital: 'For downloadable or license-based products.',
    service: 'For labor, consulting, or appointment-based offerings.',
    bundle: 'Combine multiple products into one sellable package with controlled production mode.',
    custom: 'For made-to-order work where specs and pricing are defined per job.',
};

const FORM_IDS: Record<DrawerProductType, string> = {
    simple: 'simple-product-form',
    digital: 'digital-product-form',
    service: 'service-product-form',
    bundle: 'bundle-product-form',
    custom: 'custom-product-form',
};

type Props = {
    type: DrawerProductType | null;
    onClose: () => void;
};

export function CatalogNewSheet({ type, onClose }: Props) {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        setIsDirty(false);
    }, [type]);

    function handleOpenChange(open: boolean) {
        if (!open) {
            if (isDirty) {
                setConfirmOpen(true);
            } else {
                onClose();
            }
        }
    }

    function handleConfirmDiscard() {
        setConfirmOpen(false);
        setIsDirty(false);
        onClose();
    }

    const isOpen = type !== null;

    return (
        <>
            <Sheet open={isOpen} onOpenChange={handleOpenChange}>
                <SheetContent
                    className="flex w-full flex-col gap-0 sm:max-w-[520px] [&>button:last-of-type]:hidden"
                    onEscapeKeyDown={(e) => { if (!confirmOpen) e.preventDefault(); }}
                    onInteractOutside={(e) => { if (!confirmOpen) e.preventDefault(); }}
                >
                    {type && (
                        <>
                            <SheetHeader className="border-b pb-4">
                                <SheetTitle>New {TYPE_LABELS[type]} Product</SheetTitle>
                                <SheetDescription>{TYPE_SUBTITLES[type]}</SheetDescription>
                            </SheetHeader>

                            <div className="flex-1 overflow-y-auto px-4">
                                {type === 'simple' && <SimpleProductForm onClose={onClose} onDirtyChange={setIsDirty} />}
                                {type === 'digital' && <DigitalProductForm onClose={onClose} onDirtyChange={setIsDirty} />}
                                {type === 'service' && <ServiceProductForm onClose={onClose} onDirtyChange={setIsDirty} />}
                                {type === 'bundle' && <BundleProductForm onClose={onClose} onDirtyChange={setIsDirty} />}
                                {type === 'custom' && <CustomProductForm onClose={onClose} onDirtyChange={setIsDirty} />}
                            </div>

                            <SheetFooter className="border-t pt-4">
                                <Button type="submit" form={FORM_IDS[type]}>
                                    Create Product
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => handleOpenChange(false)}
                                >
                                    Cancel
                                </Button>
                            </SheetFooter>
                        </>
                    )}
                </SheetContent>
            </Sheet>

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
