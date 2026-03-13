import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { gql, TypedDocumentNode } from '@apollo/client';
import { useMutation, useApolloClient } from '@apollo/client/react';
import { type ProductStatus } from '../../catalog/catalog-container';
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
import { useCompany } from '@/root/components/container/company-provider';
import {
    Product as OpsProduct,
    ProductStatus as OpsProductStatus,
    VariantProductInput,
} from '@repo/commons/types/ops-service-schema.type';
import { hasGraphQLError } from '@repo/commons/utils/graphql';
import { convertErrorMessageListToObject } from '@repo/commons/utils/error-message';
import ShowErrorText from '@/shadcn/custom-components/show-error-text';

const VALIDATION_FIELDS = ['name', 'categoryName', 'variantAttributes', 'productVariants'];

interface CreateVariantProductResponse {
    createVariantProductForOps: OpsProduct;
}

interface CreateVariantProductVariables {
    companyPublicId: string;
    input: VariantProductInput;
}

const CREATE_VARIANT_PRODUCT: TypedDocumentNode<
    CreateVariantProductResponse,
    CreateVariantProductVariables
> = gql`
    mutation CreateVariantProduct($companyPublicId: String!, $input: VariantProductInput!) {
        createVariantProductForOps(companyPublicId: $companyPublicId, input: $input) {
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

const DEFAULT_ATTRIBUTES: VariantAttribute[] = [];

export function VariantProductForm({ onClose, onDirtyChange }: { onClose: () => void; onDirtyChange?: (dirty: boolean) => void }) {
    const [form, setForm] = useState<FormState>(DEFAULT_FORM);
    const [formValidation, setFormValidation] = useState<Record<string, string[]>>({});
    const [attributes, setAttributes] = useState<VariantAttribute[]>(DEFAULT_ATTRIBUTES);
    const [variantData, setVariantData] = useState<Record<string, { sku: string; price: string }>>(
        {},
    );
    const { activeCompany } = useCompany();
    const client = useApolloClient();
    const [createVariantProduct, { loading }] = useMutation(CREATE_VARIANT_PRODUCT);

    function patch(values: Partial<FormState>) {
        setForm((prev) => ({ ...prev, ...values }));
        onDirtyChange?.(true);
    }

    function patchVariantData(variantId: string, values: Partial<{ sku: string; price: string }>) {
        setVariantData((prev) => {
            const existing = prev[variantId] ?? { sku: '', price: '' };
            return { ...prev, [variantId]: { ...existing, ...values } };
        });
        onDirtyChange?.(true);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (loading || !activeCompany) return;

        setFormValidation({});

        const readyAttributes = attributes
            .map((attr) => ({
                name: attr.name.trim(),
                values: attr.values.filter(Boolean),
            }))
            .filter((attr) => attr.name && attr.values.length > 0);

        try {

            const { data, error } = await createVariantProduct({
                variables: {
                    companyPublicId: activeCompany.publicId,
                    input: {
                        name: form.name,
                        description: form.description,
                        categoryName: form.category,
                        status: STATUS_MAP[form.status],
                        variantAttributes: readyAttributes,
                        productVariants: variantRows.map((row) => {
                            const overrides = variantData[row.id];


                            return {
                                sku: overrides?.sku ?? "",
                                price: Number(overrides?.price) || 0,
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

                    if (err?.statusCode === 400 && Array.isArray(err?.message)) {
                        setFormValidation(
                            convertErrorMessageListToObject(VALIDATION_FIELDS, err.message),
                        );
                        return;
                    }

                    const id = err?.id;

                    if (
                        err?.statusCode === 409 &&
                        id === "PRODUCT_SKU_ALREADY_EXISTS"
                    ) {
                        setFormValidation({
                            productVariants: [
                                'This SKU is already in use',
                            ],
                        });
                        return;
                    }

                    if (
                        err?.statusCode === 422 &&
                        id === "PRODUCT_SKU_EMPTY"
                    ) {
                        setFormValidation({
                            productVariants: [
                                'SKU is required for each product variant.',
                            ],
                        });
                        return;
                    }

                    if (
                        err?.statusCode === 422 &&
                        id === "DUPLICATE_VARIANT_SKU"
                    ) {
                        setFormValidation({
                            productVariants: [
                                "Duplicate variant SKU in input"
                            ],
                        });
                        return;
                    }
                }
            }

            if (data) {
                client.refetchQueries({ include: ['GetCatalog', 'GetProductsForBundle'] });
                toast.success('Product created');
                onClose();
                return
            }

            toast.error('An unexpected error occurred. Please try again.', {
                position: 'top-center',
            });
        } catch (error) {
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
                name: "",
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

        return combinations.map((combination, index) => {
            return {
                id: `variant-${index + 1}`,
                label: combination.map((c) => c.label).join(' / '),
                attributeValues: combination.map((c) => c.value),
                sku: "",
            };
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
                        autoComplete='off'
                    />
                    <ShowErrorText error={formValidation} field="name" />
                </div>

                <div className="flex flex-col gap-1.5">
                    <Label>Category</Label>
                    <CategorySelect
                        value={form.category}
                        onChange={(value) => patch({ category: value })}
                    />
                    <ShowErrorText error={formValidation} field="categoryName" />
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
                                            autoComplete='off'
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
                                            autoComplete='off'
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
                    <ShowErrorText error={formValidation} field="variantAttributes" />
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
                                        const data = variantData[variant.id];

                                        return (
                                            <TableRow key={variant.id}>
                                                <TableCell className="text-sm">
                                                    {variant.label}
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        value={data?.sku ?? variant.sku}
                                                        onChange={(e) =>
                                                            patchVariantData(variant.id, {
                                                                sku: e.target.value,
                                                            })
                                                        }
                                                        placeholder={variant.sku}
                                                        className="h-7 w-28 text-xs"
                                                        autoComplete='off'
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
                                                            value={data?.price ?? ''}
                                                            onChange={(e) =>
                                                                patchVariantData(variant.id, {
                                                                    price: e.target.value,
                                                                })
                                                            }
                                                            placeholder="0"
                                                            className="h-7 w-24 text-xs"
                                                            autoComplete='off'
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
                        </SelectContent>
                    </Select>
                </div>
            </section>
        </form>
    );
}
