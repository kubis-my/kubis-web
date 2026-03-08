'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useDashboard01 } from '@/shadcn/dashboards/dashboard-01';
import { Button } from '@repo/shadcn-ui/components/button';
import { Input } from '@repo/shadcn-ui/components/input';
import { Label } from '@repo/shadcn-ui/components/label';
import { Textarea } from '@repo/shadcn-ui/components/textarea';
import { Switch } from '@repo/shadcn-ui/components/switch';
import { Badge } from '@repo/shadcn-ui/components/badge';
import { cn } from '@repo/shadcn-ui/lib/utils';
import { IconPlus } from '@tabler/icons-react';
import { ROUTE } from '@/root/libs/constants';
import type { ProductType } from '../catalog-container';

const TYPE_LABELS: Record<ProductType, string> = {
    simple: 'Simple',
    variant: 'Variant',
    digital: 'Digital',
    service: 'Service',
    bundle: 'Bundle',
};

type FormState = {
    name: string;
    description: string;
    sku: string;
    price: string;
    defaultMinQty: string;
    defaultMaxQty: string;
    isActive: boolean;
    bundleProductionMode: 'whole' | 'independent';
};

const DEFAULT_FORM: FormState = {
    name: '',
    description: '',
    sku: '',
    price: '',
    defaultMinQty: '',
    defaultMaxQty: '',
    isActive: true,
    bundleProductionMode: 'whole',
};

function VariantPlaceholder() {
    return (
        <div className="flex flex-col gap-3 rounded-lg border p-4">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Attributes</span>
                <Button variant="outline" size="sm">
                    <IconPlus className="size-4" />
                    Add Attribute
                </Button>
            </div>
            <div className="text-muted-foreground rounded-md bg-muted/50 px-3 py-2 text-xs">
                <span className="font-medium text-foreground">Size</span>
                {' → '}
                <Badge variant="secondary" className="text-xs">S</Badge>
                {' '}
                <Badge variant="secondary" className="text-xs">M</Badge>
                {' '}
                <Badge variant="secondary" className="text-xs">L</Badge>
            </div>
            <p className="text-muted-foreground text-xs italic">
                Variant table will appear here once attributes are configured.
            </p>
        </div>
    );
}

function BundlePlaceholder({
    productionMode,
    onModeChange,
}: {
    productionMode: 'whole' | 'independent';
    onModeChange: (mode: 'whole' | 'independent') => void;
}) {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 rounded-lg border p-4">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Bundle Items</span>
                    <Button variant="outline" size="sm">
                        <IconPlus className="size-4" />
                        Add Item
                    </Button>
                </div>
                <div className="text-muted-foreground rounded-md bg-muted/50 px-3 py-2 text-xs">
                    Product A <span className="font-medium">× 1</span>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium">Production Mode</Label>
                <div className="grid grid-cols-2 gap-2">
                    {(['whole', 'independent'] as const).map((mode) => (
                        <button
                            key={mode}
                            type="button"
                            onClick={() => onModeChange(mode)}
                            className={cn(
                                'rounded-lg border px-3 py-2 text-left text-sm transition-colors',
                                'hover:bg-accent',
                                productionMode === mode && 'bg-primary/5 border-primary font-medium',
                            )}
                        >
                            {mode === 'whole' ? 'As a whole' : 'Independently per item'}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function ProductFormContainer({ type }: { type: ProductType }) {
    const router = useRouter();
    const { updateBreadcrumbList } = useDashboard01();
    const [form, setForm] = useState<FormState>(DEFAULT_FORM);

    const typeLabel = TYPE_LABELS[type];

    useEffect(() => {
        updateBreadcrumbList([
            { name: 'Product Catalog', url: ROUTE.OPS.CATALOG },
            { name: `New ${typeLabel} Product` },
        ]);

        return () => updateBreadcrumbList([]);
    }, [typeLabel, updateBreadcrumbList]);

    function patch(values: Partial<FormState>) {
        setForm((prev) => ({ ...prev, ...values }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        toast.success('Product created');
        router.push(ROUTE.OPS.CATALOG);
    }

    const showSku = type !== 'variant';
    const showPrice = type !== 'variant';
    const showMinMaxQty = type === 'simple' || type === 'variant' || type === 'bundle';

    return (
        <div className="flex flex-1 justify-center p-6">
            <form onSubmit={handleSubmit} className="flex w-full max-w-xl flex-col gap-6">
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        placeholder="Product name"
                        value={form.name}
                        onChange={(e) => patch({ name: e.target.value })}
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        placeholder="Short description"
                        rows={3}
                        value={form.description}
                        onChange={(e) => patch({ description: e.target.value })}
                    />
                </div>

                {showSku && (
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="sku">SKU</Label>
                        <Input
                            id="sku"
                            placeholder="e.g. MUG-001"
                            value={form.sku}
                            onChange={(e) => patch({ sku: e.target.value })}
                        />
                    </div>
                )}

                {showPrice && (
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="price">Price</Label>
                        <Input
                            id="price"
                            type="number"
                            placeholder="0"
                            value={form.price}
                            onChange={(e) => patch({ price: e.target.value })}
                        />
                    </div>
                )}

                {showMinMaxQty && (
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="minQty">Default Min Qty</Label>
                            <Input
                                id="minQty"
                                type="number"
                                placeholder="0"
                                value={form.defaultMinQty}
                                onChange={(e) => patch({ defaultMinQty: e.target.value })}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="maxQty">Default Max Qty</Label>
                            <Input
                                id="maxQty"
                                type="number"
                                placeholder="0"
                                value={form.defaultMaxQty}
                                onChange={(e) => patch({ defaultMaxQty: e.target.value })}
                            />
                        </div>
                    </div>
                )}

                {type === 'variant' && <VariantPlaceholder />}

                {type === 'bundle' && (
                    <BundlePlaceholder
                        productionMode={form.bundleProductionMode}
                        onModeChange={(mode) => patch({ bundleProductionMode: mode })}
                    />
                )}

                <div className="flex items-center gap-3">
                    <Switch
                        id="isActive"
                        checked={form.isActive}
                        onCheckedChange={(checked) => patch({ isActive: checked })}
                    />
                    <Label htmlFor="isActive">Active</Label>
                </div>

                <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={() => router.push(ROUTE.OPS.CATALOG)}>
                        Cancel
                    </Button>
                    <Button type="submit">Create Product</Button>
                </div>
            </form>
        </div>
    );
}
