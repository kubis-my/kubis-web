import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useCatalog, type ProductStatus } from '../../catalog/catalog-container';
import { CategorySelect } from '../category-select';
import { Button } from '@repo/shadcn-ui/components/button';
import { Input } from '@repo/shadcn-ui/components/input';
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
import { Badge } from '@repo/shadcn-ui/components/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@repo/shadcn-ui/components/table';
import { IconPlus, IconTable, IconX } from '@tabler/icons-react';

type FormState = {
    name: string;
    category: string;
    description: string;
    status: ProductStatus;
};

type VariantAttribute = {
    id: string;
    name: string;
    values: string[];
    valueInput: string;
};

const DEFAULT_FORM: FormState = {
    name: '',
    category: '',
    description: '',
    status: 'draft',
};

const DEFAULT_ATTRIBUTES: VariantAttribute[] = [
    { id: 'attr-1', name: 'Size', values: ['S', 'M', 'L'], valueInput: '' },
    { id: 'attr-2', name: 'Color', values: ['Black', 'White'], valueInput: '' },
];

export function VariantProductForm({ onClose }: { onClose: () => void }) {
    const [form, setForm] = useState<FormState>(DEFAULT_FORM);
    const { categories, addCategory } = useCatalog();
    const [attributes, setAttributes] = useState<VariantAttribute[]>(DEFAULT_ATTRIBUTES);

    function patch(values: Partial<FormState>) {
        setForm((prev) => ({ ...prev, ...values }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        toast.success('Product created');
        onClose();
    }

    function addAttribute() {
        const nextIndex = attributes.length + 1;

        setAttributes((prev) => [
            ...prev,
            { id: `attr-${Date.now()}`, name: `Attribute ${nextIndex}`, values: [], valueInput: '' },
        ]);
    }

    function patchAttribute(attributeId: string, values: Partial<VariantAttribute>) {
        setAttributes((prev) =>
            prev.map((attribute) =>
                attribute.id === attributeId ? { ...attribute, ...values } : attribute,
            ),
        );
    }

    function removeAttribute(attributeId: string) {
        setAttributes((prev) => prev.filter((attribute) => attribute.id !== attributeId));
    }

    function addAttributeValue(attributeId: string) {
        const target = attributes.find((attribute) => attribute.id === attributeId);

        if (!target) {
            return;
        }

        const value = target.valueInput.trim();

        if (!value || target.values.includes(value)) {
            patchAttribute(attributeId, { valueInput: '' });
            return;
        }

        patchAttribute(attributeId, { values: [...target.values, value], valueInput: '' });
    }

    function removeAttributeValue(attributeId: string, value: string) {
        const target = attributes.find((attribute) => attribute.id === attributeId);

        if (!target) {
            return;
        }

        patchAttribute(attributeId, {
            values: target.values.filter((existing) => existing !== value),
        });
    }

    const variantRows = useMemo(() => {
        const readyAttributes = attributes
            .map((attribute) => ({
                ...attribute,
                cleanName: attribute.name.trim(),
                cleanValues: attribute.values.filter(Boolean),
            }))
            .filter((attribute) => attribute.cleanName && attribute.cleanValues.length > 0);

        if (readyAttributes.length === 0) {
            return [];
        }

        const combinations = readyAttributes.reduce<string[][]>(
            (acc, attribute) => {
                return acc.flatMap((combination) =>
                    attribute.cleanValues.map((value) => [
                        ...combination,
                        `${attribute.cleanName}: ${value}`,
                    ]),
                );
            },
            [[]],
        );

        return combinations.map((combination, index) => {
            const suffix = String(index + 1).padStart(3, '0');

            return { id: `variant-${index + 1}`, label: combination.join(' / '), sku: `VAR-${suffix}` };
        });
    }, [attributes]);

    return (
        <form id="variant-product-form" onSubmit={handleSubmit} className="flex w-full flex-col">
            <section className="flex flex-col gap-4 py-4">
                <div>
                    <p className="text-sm font-medium">Basic Information</p>
                    <p className="text-muted-foreground text-xs">
                        Define product-level details before generating SKU variants.
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

            </section>

            <Separator />

            <section className="flex flex-col gap-4 py-4">
                <div>
                    <p className="text-sm font-medium">Variant Setup</p>
                    <p className="text-muted-foreground text-xs">
                        Configure attributes first, then generate and review combinations.
                    </p>
                </div>

                <div className="bg-muted/20 rounded-lg border p-3">
                    <div className="mb-3 flex items-center justify-between">
                        <span className="text-sm font-medium">Attributes</span>
                        <Button type="button" variant="outline" size="sm" onClick={addAttribute}>
                            <IconPlus className="size-4" />
                            Add Attribute
                        </Button>
                    </div>

                    <div className="space-y-3">
                        {attributes.length === 0 ? (
                            <p className="text-muted-foreground rounded-md border border-dashed px-3 py-4 text-center text-xs">
                                No attribute yet. Add one to generate variant combinations.
                            </p>
                        ) : (
                            attributes.map((attribute) => (
                                <div
                                    key={attribute.id}
                                    className="bg-background rounded-md border p-3"
                                >
                                    <div className="mb-2 flex items-center gap-2">
                                        <Input
                                            value={attribute.name}
                                            onChange={(e) =>
                                                patchAttribute(attribute.id, { name: e.target.value })
                                            }
                                            placeholder="Attribute name"
                                            className="h-8"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            className="size-8"
                                            onClick={() => removeAttribute(attribute.id)}
                                        >
                                            <IconX className="size-4" />
                                        </Button>
                                    </div>

                                    <div className="flex flex-wrap gap-1.5">
                                        {attribute.values.map((value) => (
                                            <Badge
                                                key={`${attribute.id}-${value}`}
                                                variant="secondary"
                                                className="gap-1 pr-1"
                                            >
                                                {value}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeAttributeValue(attribute.id, value)
                                                    }
                                                    className="hover:text-foreground/70"
                                                >
                                                    <IconX className="size-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>

                                    <div className="mt-2 flex gap-2">
                                        <Input
                                            value={attribute.valueInput}
                                            onChange={(e) =>
                                                patchAttribute(attribute.id, {
                                                    valueInput: e.target.value,
                                                })
                                            }
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    addAttributeValue(attribute.id);
                                                }
                                            }}
                                            placeholder="Add value (e.g. XL)"
                                            className="h-8"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => addAttributeValue(attribute.id)}
                                        >
                                            Add
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="rounded-lg border border-dashed p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                        <IconTable className="text-muted-foreground size-4" />
                        Variant Table Preview
                    </div>

                    {variantRows.length === 0 ? (
                        <p className="text-muted-foreground text-xs">
                            Add at least one attribute with values to generate variant rows.
                        </p>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Variant</TableHead>
                                        <TableHead>SKU</TableHead>
                                        <TableHead className="text-right">Price</TableHead>
                                        <TableHead className="text-center">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {variantRows.map((variant) => (
                                        <TableRow key={variant.id}>
                                            <TableCell>{variant.label}</TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {variant.sku}
                                            </TableCell>
                                            <TableCell className="text-right">MYR 0</TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant="outline">Draft</Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
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
