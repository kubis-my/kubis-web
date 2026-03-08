import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useCatalog } from '../../catalog/catalog-container';
import { CategorySelect } from '../category-select';
import { Button } from '@repo/shadcn-ui/components/button';
import { Input } from '@repo/shadcn-ui/components/input';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
    InputGroupText,
} from '@repo/shadcn-ui/components/input-group';
import { Label } from '@repo/shadcn-ui/components/label';
import { Separator } from '@repo/shadcn-ui/components/separator';
import { Textarea } from '@repo/shadcn-ui/components/textarea';
import { Badge } from '@repo/shadcn-ui/components/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@repo/shadcn-ui/components/select';
import { cn } from '@repo/shadcn-ui/lib/utils';
import { IconPackage, IconPlus, IconX } from '@tabler/icons-react';
import { DUMMY_PRODUCTS } from '../../catalog/catalog-dummy-data';
import type { ProductStatus } from '../../catalog/catalog-container';

type FormState = {
    name: string;
    category: string;
    description: string;
    sku: string;
    price: string;
    bundleProductionMode: 'whole' | 'independent';
    status: ProductStatus;
};

type BundleItem = {
    id: string;
    productPublicId: string;
    qty: string;
};

const DEFAULT_FORM: FormState = {
    name: '',
    category: '',
    description: '',
    sku: '',
    price: '',
    bundleProductionMode: 'whole',
    status: 'draft',
};

const DEFAULT_ITEMS: BundleItem[] = [
    { id: 'item-1', productPublicId: DUMMY_PRODUCTS[0]?.publicId ?? '', qty: '1' },
    { id: 'item-2', productPublicId: DUMMY_PRODUCTS[1]?.publicId ?? '', qty: '2' },
];

export function BundleProductForm({ onClose }: { onClose: () => void }) {
    const [form, setForm] = useState<FormState>(DEFAULT_FORM);
    const { categories, addCategory } = useCatalog();
    const [items, setItems] = useState<BundleItem[]>(DEFAULT_ITEMS);

    function patch(values: Partial<FormState>) {
        setForm((prev) => ({ ...prev, ...values }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        toast.success('Product created');
        onClose();
    }

    function addItem() {
        setItems((prev) => [
            ...prev,
            {
                id: `item-${Date.now()}`,
                productPublicId: DUMMY_PRODUCTS[0]?.publicId ?? '',
                qty: '1',
            },
        ]);
    }

    function patchItem(itemId: string, values: Partial<BundleItem>) {
        setItems((prev) =>
            prev.map((item) => (item.id === itemId ? { ...item, ...values } : item)),
        );
    }

    function removeItem(itemId: string) {
        setItems((prev) => prev.filter((item) => item.id !== itemId));
    }

    const summary = useMemo(() => {
        const productsMap = new Map(DUMMY_PRODUCTS.map((product) => [product.publicId, product]));

        const normalized = items.map((item) => ({
            ...item,
            productName: productsMap.get(item.productPublicId)?.name ?? '',
            qtyNumber: Number(item.qty) || 0,
        }));

        const validItems = normalized.filter((item) => item.productName.length > 0);
        const totalQty = normalized.reduce((acc, item) => acc + Math.max(item.qtyNumber, 0), 0);

        return { itemCount: validItems.length, totalQty };
    }, [items]);

    return (
        <form id="bundle-product-form" onSubmit={handleSubmit} className="flex w-full flex-col">
            <section className="flex flex-col gap-4 py-4">
                <div>
                    <p className="text-sm font-medium">Basic Information</p>
                    <p className="text-muted-foreground text-xs">
                        Define the primary identity and defaults for this bundle product.
                    </p>
                </div>

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
                    <Label>Category</Label>
                    <CategorySelect
                        categories={categories}
                        value={form.category}
                        onChange={(value) => patch({ category: value })}
                        onAddCategory={addCategory}
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

                <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="sku">SKU</Label>
                        <Input
                            id="sku"
                            placeholder="e.g. BND-001"
                            value={form.sku}
                            onChange={(e) => patch({ sku: e.target.value })}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="price">Price</Label>
                        <InputGroup>
                            <InputGroupAddon>
                                <InputGroupText>MYR</InputGroupText>
                            </InputGroupAddon>
                            <InputGroupInput
                                id="price"
                                type="number"
                                placeholder="0"
                                value={form.price}
                                onChange={(e) => patch({ price: e.target.value })}
                            />
                        </InputGroup>
                    </div>
                </div>

            </section>

            <Separator />

            <section className="flex flex-col gap-4 py-4">
                <div>
                    <p className="text-sm font-medium">Bundle Configuration</p>
                    <p className="text-muted-foreground text-xs">
                        Define included items and choose how production should be handled.
                    </p>
                </div>

                <div className="bg-muted/20 rounded-lg border p-3">
                    <div className="mb-3 flex items-center justify-between">
                        <span className="text-sm font-medium">Bundle Items</span>
                        <Button type="button" variant="outline" size="sm" onClick={addItem}>
                            <IconPlus className="size-4" />
                            Add Item
                        </Button>
                    </div>

                    <div className="space-y-2">
                        {items.length === 0 ? (
                            <p className="text-muted-foreground rounded-md border border-dashed px-3 py-4 text-center text-xs">
                                No bundle item yet. Add at least one item to build this package.
                            </p>
                        ) : (
                            items.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-background grid grid-cols-[1fr_80px_32px] gap-2 rounded-md border p-2"
                                >
                                    <Select
                                        value={item.productPublicId}
                                        onValueChange={(value) =>
                                            patchItem(item.id, { productPublicId: value })
                                        }
                                    >
                                        <SelectTrigger className="h-8 w-full">
                                            <SelectValue placeholder="Select product" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {DUMMY_PRODUCTS.map((product) => (
                                                <SelectItem
                                                    key={product.publicId}
                                                    value={product.publicId}
                                                >
                                                    {product.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <Input
                                        type="number"
                                        min={0}
                                        value={item.qty}
                                        onChange={(e) =>
                                            patchItem(item.id, { qty: e.target.value })
                                        }
                                        placeholder="Qty"
                                        className="h-8"
                                    />

                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        className="size-8"
                                        onClick={() => removeItem(item.id)}
                                    >
                                        <IconX className="size-4" />
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                        <Badge variant="secondary">Items: {summary.itemCount}</Badge>
                        <Badge variant="secondary">Total Qty: {summary.totalQty}</Badge>
                    </div>
                </div>

                <div className="rounded-lg border border-dashed p-3">
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                        <IconPackage className="text-muted-foreground size-4" />
                        Production Mode
                    </div>
                    <p className="text-muted-foreground mb-3 text-xs">
                        Choose whether this bundle is produced as one unit or tracked per item.
                    </p>

                    <div className="grid grid-cols-2 gap-2">
                        {(['whole', 'independent'] as const).map((mode) => (
                            <button
                                key={mode}
                                type="button"
                                onClick={() => patch({ bundleProductionMode: mode })}
                                className={cn(
                                    'rounded-lg border px-3 py-2 text-left text-sm transition-colors',
                                    'hover:bg-accent',
                                    form.bundleProductionMode === mode &&
                                        'border-primary bg-primary/5 font-medium',
                                )}
                            >
                                {mode === 'whole' ? 'As a whole' : 'Independently per item'}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <Separator />

            <section className="flex flex-col gap-4 py-4">
                <div>
                    <p className="text-sm font-medium">Status</p>
                    <p className="text-muted-foreground text-xs">
                        Set product availability stage for operations.
                    </p>
                </div>

                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="status">Status</Label>
                    <Select
                        value={form.status}
                        onValueChange={(value: ProductStatus) => patch({ status: value })}
                    >
                        <SelectTrigger id="status" className="w-full">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </section>
        </form>
    );
}
