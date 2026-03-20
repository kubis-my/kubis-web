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
import type { Product, ProductType } from '../catalog/catalog-container';
import { EditSimpleProductForm } from './types/simple-product';
import { EditDigitalProductForm } from './types/digital-product';
import { EditServiceProductForm } from './types/service-product';
import { EditCustomProductForm } from './types/custom-product';

type EditableProductType = Extract<ProductType, 'simple' | 'digital' | 'service' | 'custom'>;

const TYPE_LABELS: Record<EditableProductType, string> = {
    simple: 'Simple',
    digital: 'Digital',
    service: 'Service',
    custom: 'Custom',
};

const TYPE_SUBTITLES: Record<EditableProductType, string> = {
    simple: 'Best for single-item products with one SKU and straightforward pricing.',
    digital: 'For downloadable or license-based products.',
    service: 'For labor, consulting, or appointment-based offerings.',
    custom: 'For made-to-order work where specs and pricing are defined per job.',
};

const FORM_IDS: Record<EditableProductType, string> = {
    simple: 'edit-simple-product-form',
    digital: 'edit-digital-product-form',
    service: 'edit-service-product-form',
    custom: 'edit-custom-product-form',
};

type Props = {
    product: Product | null;
    onClose: () => void;
};

function isEditableType(type: ProductType): type is EditableProductType {
    return type === 'simple' || type === 'digital' || type === 'service' || type === 'custom';
}

export function CatalogEditSheet({ product, onClose }: Props) {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        setIsDirty(false);
    }, [product]);

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

    const editableProduct = product && isEditableType(product.type) ? product : null;
    const type: EditableProductType | null = editableProduct
        ? (editableProduct.type as EditableProductType)
        : null;

    return (
        <>
            <Sheet open={editableProduct !== null} onOpenChange={handleOpenChange}>
                <SheetContent
                    className="flex w-full flex-col gap-0 sm:max-w-[520px] [&>button:last-of-type]:hidden"
                    onOpenAutoFocus={(e) => e.preventDefault()}
                    onEscapeKeyDown={(e) => { if (!confirmOpen) e.preventDefault(); }}
                    onInteractOutside={(e) => { if (!confirmOpen) e.preventDefault(); }}
                >
                    {editableProduct && type && (
                        <>
                            <SheetHeader className="border-b pb-4">
                                <SheetTitle>Edit {TYPE_LABELS[type]} Product</SheetTitle>
                                <SheetDescription>{TYPE_SUBTITLES[type]}</SheetDescription>
                            </SheetHeader>

                            <div className="flex-1 overflow-y-auto px-4">

                                {type === 'simple' && (
                                    <EditSimpleProductForm
                                        product={editableProduct}
                                        onClose={onClose}
                                        onDirtyChange={setIsDirty}
                                    />
                                )}
                                {type === 'digital' && (
                                    <EditDigitalProductForm
                                        product={editableProduct}
                                        onClose={onClose}
                                        onDirtyChange={setIsDirty}
                                    />
                                )}
                                {type === 'service' && (
                                    <EditServiceProductForm
                                        product={editableProduct}
                                        onClose={onClose}
                                        onDirtyChange={setIsDirty}
                                    />
                                )}
                                {type === 'custom' && (
                                    <EditCustomProductForm
                                        product={editableProduct}
                                        onClose={onClose}
                                        onDirtyChange={setIsDirty}
                                    />
                                )}
                            </div>
                            <div className="bg-muted/50 text-muted-foreground mt-4 px-3 py-2 text-xs">
                                Required fields cannot be cleared and will keep their current values. Optional fields can be cleared.
                            </div>
                            <SheetFooter className="border-t pt-4">
                                <Button type="submit" form={FORM_IDS[type]}>
                                    Save Changes
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
