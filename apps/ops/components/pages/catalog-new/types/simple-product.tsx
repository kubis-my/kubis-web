import { useState } from 'react';
import { toast } from 'sonner';
import { Input } from '@repo/shadcn-ui/components/input';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
    InputGroupText,
} from '@repo/shadcn-ui/components/input-group';
import { Label } from '@repo/shadcn-ui/components/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@repo/shadcn-ui/components/select';
import { Separator } from '@repo/shadcn-ui/components/separator';
import { Textarea } from '@repo/shadcn-ui/components/textarea';
import { useCatalog, type ProductStatus } from '../../catalog/catalog-container';
import { CategorySelect } from '../category-select';

type FormState = {
    name: string;
    category: string;
    description: string;
    sku: string;
    price: string;
    status: ProductStatus;
};

const DEFAULT_FORM: FormState = {
    name: '',
    category: '',
    description: '',
    sku: '',
    price: '',
    status: 'draft',
};

export function SimpleProductForm({ onClose }: { onClose: () => void }) {
    const [form, setForm] = useState<FormState>(DEFAULT_FORM);
    const { categories, addCategory } = useCatalog();

    function patch(values: Partial<FormState>) {
        setForm((prev) => ({ ...prev, ...values }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        toast.success('Product created');
        onClose();
    }

    return (
        <form id="simple-product-form" onSubmit={handleSubmit} className="flex w-full flex-col">
            <section className="flex flex-col gap-4 py-4">
                <div>
                    <p className="text-sm font-medium">Basic Information</p>
                    <p className="text-muted-foreground text-xs">
                        Define the product identity shown across your catalog and order screens.
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
                        rows={4}
                        value={form.description}
                        onChange={(e) => patch({ description: e.target.value })}
                    />
                    <p className="text-muted-foreground text-xs">
                        Keep this concise so operators can scan products quickly.
                    </p>
                </div>

                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                        id="sku"
                        placeholder="e.g. MUG-001"
                        value={form.sku}
                        onChange={(e) => patch({ sku: e.target.value })}
                    />
                </div>
            </section>

            <Separator />

            <section className="flex flex-col gap-4 py-4">
                <div>
                    <p className="text-sm font-medium">Pricing</p>
                    <p className="text-muted-foreground text-xs">
                        Set base selling price for this product.
                    </p>
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
