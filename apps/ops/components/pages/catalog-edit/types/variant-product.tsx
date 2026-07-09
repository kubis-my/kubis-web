import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { gql, TypedDocumentNode } from '@apollo/client';
import { useMutation, useApolloClient } from '@apollo/client/react';
import { type Product, type ProductStatus } from '../../catalog/catalog-container';
import { CategorySelect } from '../../catalog-new/category-select';
import { Button } from '@repo/shadcn-ui/components/button';
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
import { Badge } from '@repo/shadcn-ui/components/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@repo/shadcn-ui/components/table';
import { IconArrowBackUp, IconPlus, IconTable, IconX } from '@tabler/icons-react';
import { useCompany } from '@/root/components/container/company-provider';
import {
    Product as OpsProduct,
    ProductStatus as OpsProductStatus,
    UpdateVariantProductInput,
} from '@repo/commons/types/ops-service-schema.type';
import { hasGraphQLError } from '@repo/commons/utils/graphql';
import ShowErrorText from '@/shadcn/custom-components/show-error-text';

interface UpdateVariantProductResponse {
    updateVariantProductForOps: OpsProduct;
}

interface UpdateVariantProductVariables {
    companyPublicId: string;
    input: UpdateVariantProductInput;
}

const UPDATE_VARIANT_PRODUCT: TypedDocumentNode<
    UpdateVariantProductResponse,
    UpdateVariantProductVariables
> = gql`
    mutation UpdateVariantProduct($companyPublicId: String!, $input: UpdateVariantProductInput!) {
        updateVariantProductForOps(companyPublicId: $companyPublicId, input: $input) {
            publicId
            name
        }
    }
`;

const STATUS_MAP: Record<ProductStatus, OpsProductStatus> = {
    draft: OpsProductStatus.DRAFT,
    active: OpsProductStatus.ACTIVE,
    inactive: OpsProductStatus.INACTIVE,
    archived: OpsProductStatus.ARCHIVED,
};

type FormState = {
    name: string;
    category: string;
    description: string;
    status: ProductStatus;
};

type VariantAttribute = {
    id: string;
    attributePublicId: string;
    name: string;
    values: string[];
    valueInput: string;
};

function toFormState(product: Product): FormState {
    return {
        name: product.name,
        category: product.category,
        description: product.description ?? '',
        status: product.status,
    };
}

function toAttributes(product: Product): VariantAttribute[] {
    return (product.attributes ?? []).map((a, i) => ({
        id: `attr-${i}`,
        attributePublicId: a.publicId,
        name: a.name,
        values: a.values,
        valueInput: '',
    }));
}

// Key existing variants by their sorted attributeValues for pre-population
function buildVariantLookup(
    product: Product,
): Map<string, { sku: string; price: string; publicId: string; isDeleted: boolean }> {
    const map = new Map<
        string,
        { sku: string; price: string; publicId: string; isDeleted: boolean }
    >();

    for (const v of product.variants ?? []) {
        map.set(v.attributeValues.join('|'), {
            publicId: v.publicId,
            sku: v.sku,
            price: v.price !== undefined ? String(v.price) : '',
            isDeleted: v.deletedAt ? true : false,
        });
    }

    return map;
}

export function EditVariantProductForm({
    product,
    onClose,
    onDirtyChange,
}: {
    product: Product;
    onClose: () => void;
    onDirtyChange?: (dirty: boolean) => void;
}) {
    const [form, setForm] = useState<FormState>(() => toFormState(product));
    const [formValidation, setFormValidation] = useState<Record<string, string[]>>({});
    const [attributes, setAttributes] = useState<VariantAttribute[]>(() => toAttributes(product));
    const [variantData, setVariantData] = useState<Record<string, { sku: string; price: string }>>(
        {},
    );
    const variantLookup = useMemo(() => buildVariantLookup(product), [product]);
    const [restoredValues, setRestoredValues] = useState<Set<string>>(new Set());
    const deletedValues = useMemo(() => {
        const inDeleted = new Set<string>();
        const inAlive = new Set<string>();

        for (const [key, entry] of variantLookup) {
            const values = key.split('|');
            if (entry.isDeleted) {
                values.forEach((v) => inDeleted.add(v));
            } else {
                values.forEach((v) => inAlive.add(v));
            }
        }

        inAlive.forEach((v) => inDeleted.delete(v));
        return inDeleted;
    }, [variantLookup]);
    const { activeCompany } = useCompany();
    const client = useApolloClient();
    const [updateVariantProduct, { loading }] = useMutation(UPDATE_VARIANT_PRODUCT);

    function patch(values: Partial<FormState>) {
        setForm((prev) => ({ ...prev, ...values }));
        onDirtyChange?.(true);
    }

    function patchVariantData(variantId: string, values: Partial<{ sku: string; price: string }>) {
        setVariantData((prev) => {
            if (!prev[variantId]) {
                const row = variantRows.find((r) => r.id === variantId);
                const fromLookup = row
                    ? variantLookup.get(row.attributeValues.join('|'))
                    : undefined;
                const seed = { sku: fromLookup?.sku ?? '', price: fromLookup?.price ?? '' };
                return { ...prev, [variantId]: { ...seed, ...values } };
            }
            return { ...prev, [variantId]: { ...prev[variantId], ...values } };
        });
        onDirtyChange?.(true);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (loading || !activeCompany) return;

        setFormValidation({});

        try {
            const { data, error } = await updateVariantProduct({
                variables: {
                    companyPublicId: activeCompany.publicId,
                    input: {
                        publicId: product.publicId,
                        name: form.name,
                        description: form.description || undefined,
                        categoryName: form.category,
                        status: STATUS_MAP[form.status],
                        variantAttributes: attributes.map((a) => ({
                            publicId: a.attributePublicId || undefined,
                            name: a.name,
                            values: a.values,
                        })),
                        productVariants: variantRows.map((row) => {
                            const existing = variantLookup.get(row.attributeValues.join('|'));
                            const overrides = variantData[row.id];
                            const sku = overrides?.sku ?? existing?.sku ?? '';
                            const price = overrides?.price ?? existing?.price ?? '';

                            return {
                                publicId: existing?.publicId || undefined,
                                sku,
                                price: Number(price) || 0,
                                attributeValues: row.attributeValues,
                            };
                        }),
                    },
                },
                errorPolicy: 'all',
            });

            if (hasGraphQLError(error)) {
                const gqlError = error.errors?.[0] || error.graphQLErrors?.[0];

                if (gqlError) {
                    const err = gqlError.extensions?.originalError as
                        | Record<string, any>
                        | undefined;

                    const id = err?.id;

                    if (err?.statusCode === 409 && id === 'PRODUCT_SKU_ALREADY_EXISTS') {
                        setFormValidation({ productVariants: ['This SKU is already in use'] });
                        return;
                    }

                    if (err?.statusCode === 422 && id === 'PRODUCT_SKU_EMPTY') {
                        setFormValidation({
                            productVariants: ['SKU is required for each product variant.'],
                        });
                        return;
                    }

                    if (err?.statusCode === 422 && id === 'DUPLICATE_VARIANT_SKU') {
                        setFormValidation({
                            productVariants: ['Duplicate variant SKU in input'],
                        });
                        return;
                    }
                }

                toast.error('Something went wrong. Please try again.', {
                    position: 'top-center',
                });
                return;
            }

            if (data) {
                client.refetchQueries({ include: ['GetCatalog', 'GetProductsForBundle'] });
                toast.success('Product updated');
                onClose();
                return;
            }
        } catch {
            toast.error('Network error occurred. Please check your connection.', {
                position: 'top-center',
            });
        }
    }

    function addAttribute() {
        setAttributes((prev) => [
            ...prev,
            {
                id: `attr-${Date.now()}`,
                attributePublicId: '',
                name: '',
                values: [],
                valueInput: '',
            },
        ]);
    }

    function patchAttribute(attributeId: string, values: Partial<VariantAttribute>) {
        setAttributes((prev) =>
            prev.map((attribute) =>
                attribute.id === attributeId ? { ...attribute, ...values } : attribute,
            ),
        );
        onDirtyChange?.(true);
    }

    function removeAttribute(attributeId: string) {
        setAttributes((prev) => prev.filter((attribute) => attribute.id !== attributeId));
    }

    function addAttributeValue(attributeId: string) {
        const target = attributes.find((attribute) => attribute.id === attributeId);

        if (!target) return;

        const value = target.valueInput.trim();

        if (!value || target.values.some((v) => v.toLowerCase() === value.toLowerCase())) {
            patchAttribute(attributeId, { valueInput: '' });
            return;
        }

        patchAttribute(attributeId, { values: [...target.values, value], valueInput: '' });
    }

    function removeAttributeValue(attributeId: string, value: string) {
        const target = attributes.find((attribute) => attribute.id === attributeId);

        if (!target) return;

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

        if (readyAttributes.length === 0) return [];

        const combinations = readyAttributes.reduce<{ label: string; value: string }[][]>(
            (acc, attribute) => {
                return acc.flatMap((combination) =>
                    attribute.cleanValues.map((value) => [
                        ...combination,
                        { label: `${attribute.cleanName}: ${value}`, value },
                    ]),
                );
            },
            [[]],
        );

        return combinations
            .filter((combination) => {
                const key = combination.map((c) => c.value).join('|');
                const existing = variantLookup.get(key);
                if (!existing?.isDeleted) return true;
                return combination.some((c) => restoredValues.has(c.value));
            })
            .map((combination, index) => ({
                id: `variant-${index + 1}`,
                label: combination.map((c) => c.label).join(' / '),
                attributeValues: combination.map((c) => c.value),
                sku: '',
            }));
    }, [attributes, variantLookup, restoredValues]);

    return (
        <form
            id="edit-variant-product-form"
            onSubmit={handleSubmit}
            className="flex w-full flex-col"
        >
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
                        autoComplete="off"
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <Label>Category</Label>
                    <CategorySelect
                        value={form.category}
                        onChange={(value) => patch({ category: value })}
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
                                                patchAttribute(attribute.id, {
                                                    name: e.target.value,
                                                })
                                            }
                                            placeholder="Attribute name"
                                            className="h-8"
                                            autoComplete="off"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            className="size-8"
                                            disabled={attribute.values.some(
                                                (v) =>
                                                    deletedValues.has(v) && !restoredValues.has(v),
                                            )}
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
                                                className={`gap-1 pr-1 ${deletedValues.has(value) && !restoredValues.has(value) ? 'bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400' : ''}`}
                                            >
                                                {value}
                                                {deletedValues.has(value) &&
                                                !restoredValues.has(value) ? (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setRestoredValues(
                                                                (prev) => new Set([...prev, value]),
                                                            )
                                                        }
                                                        className="text-red-400 hover:text-red-600"
                                                    >
                                                        <IconArrowBackUp className="size-3" />
                                                    </button>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeAttributeValue(
                                                                attribute.id,
                                                                value,
                                                            )
                                                        }
                                                        className="hover:text-foreground/70"
                                                    >
                                                        <IconX className="size-3" />
                                                    </button>
                                                )}
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
                                            autoComplete="off"
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
                                        <TableHead>Price</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {variantRows.map((variant) => {
                                        const existing = variantLookup.get(
                                            variant.attributeValues.join('|'),
                                        );
                                        const overrides = variantData[variant.id];
                                        const sku = overrides?.sku ?? existing?.sku ?? variant.sku;
                                        const price = overrides?.price ?? existing?.price ?? '';

                                        return (
                                            <TableRow key={variant.id}>
                                                <TableCell className="text-sm">
                                                    {variant.label}
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        value={sku}
                                                        onChange={(e) =>
                                                            patchVariantData(variant.id, {
                                                                sku: e.target.value,
                                                            })
                                                        }
                                                        className="h-7 w-28 text-xs"
                                                        autoComplete="off"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <InputGroup>
                                                        <InputGroupAddon>
                                                            <InputGroupText className="h-7 px-2 text-xs">
                                                                MYR
                                                            </InputGroupText>
                                                        </InputGroupAddon>
                                                        <InputGroupInput
                                                            type="number"
                                                            value={price}
                                                            onChange={(e) =>
                                                                patchVariantData(variant.id, {
                                                                    price: e.target.value,
                                                                })
                                                            }
                                                            placeholder="0"
                                                            className="h-7 w-24 text-xs"
                                                            autoComplete="off"
                                                        />
                                                    </InputGroup>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                    <ShowErrorText error={formValidation} field="productVariants" />
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
                        </SelectContent>
                    </Select>
                </div>
            </section>
        </form>
    );
}
