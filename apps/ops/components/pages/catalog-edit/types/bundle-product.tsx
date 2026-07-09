import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { gql, TypedDocumentNode } from '@apollo/client';
import { useMutation, useQuery, useApolloClient } from '@apollo/client/react';
import { PRODUCT_PAGINATION_SIZE } from '@/root/libs/constants';
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
import {
    IconArrowBackUp,
    IconChevronDown,
    IconLoader2,
    IconPackage,
    IconPlus,
    IconX,
} from '@tabler/icons-react';
import { type Product, type ProductStatus } from '../../catalog/catalog-container';
import { useCompany } from '@/root/components/container/company-provider';
import {
    BundleProductionMode,
    Product as OpsProduct,
    ProductStatus as OpsProductStatus,
    ProductPaginationInput,
    UpdateBundleProductInput,
} from '@repo/commons/types/ops-service-schema.type';
import { hasGraphQLError } from '@repo/commons/utils/graphql';
import { convertErrorMessageListToObject } from '@repo/commons/utils/error-message';
import ShowErrorText from '@/shadcn/custom-components/show-error-text';

const VALIDATION_FIELDS = ['name', 'categoryName', 'sku', 'price', 'bundleItems'];

interface UpdateBundleProductResponse {
    updateBundleProductForOps: OpsProduct;
}

interface UpdateBundleProductVariables {
    companyPublicId: string;
    input: UpdateBundleProductInput;
}

const UPDATE_BUNDLE_PRODUCT: TypedDocumentNode<
    UpdateBundleProductResponse,
    UpdateBundleProductVariables
> = gql`
    mutation UpdateBundleProduct($companyPublicId: String!, $input: UpdateBundleProductInput!) {
        updateBundleProductForOps(companyPublicId: $companyPublicId, input: $input) {
            publicId
            name
        }
    }
`;

interface BundleProductItem {
    publicId: string;
    name: string;
}

interface GetProductsForBundleResponse {
    getCompanyProducts: {
        data: BundleProductItem[];
        pageInfo: { endCursor: number | null; hasNextPage: boolean };
    };
}

interface GetProductsForBundleVariables {
    companyPublicId: string;
    pagination: ProductPaginationInput;
}

const GET_PRODUCTS_FOR_BUNDLE: TypedDocumentNode<
    GetProductsForBundleResponse,
    GetProductsForBundleVariables
> = gql`
    query GetProductsForBundle($companyPublicId: String!, $pagination: ProductPaginationInput!) {
        getCompanyProducts(companyPublicId: $companyPublicId, pagination: $pagination) {
            data {
                publicId
                name
            }
            pageInfo {
                endCursor
                hasNextPage
            }
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
    sku: string;
    price: string;
    bundleProductionMode: BundleProductionMode;
    status: ProductStatus;
};

type BundleItem = {
    id: string;
    publicId?: string;
    productPublicId: string;
    qty: string;
    deletedAt?: string;
};

function toFormState(product: Product): FormState {
    return {
        name: product.name,
        category: product.category,
        description: product.description ?? '',
        sku: product.sku ?? '',
        price: product.price !== undefined ? String(product.price) : '',
        bundleProductionMode: product.bundleProductionMode ?? BundleProductionMode.WHOLE,
        status: product.status,
    };
}

function toItems(product: Product): BundleItem[] {
    return (product.bundleItems ?? []).map((item, i) => ({
        id: `item-${i}`,
        publicId: item.publicId,
        productPublicId: item.productPublicId,
        qty: String(item.qty),
        deletedAt: item.deletedAt,
    }));
}

export function EditBundleProductForm({
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
    const [items, setItems] = useState<BundleItem[]>(() => toItems(product));
    const { activeCompany } = useCompany();

    const {
        data: productsData,
        loading: productsLoading,
        fetchMore,
    } = useQuery(GET_PRODUCTS_FOR_BUNDLE, {
        skip: !activeCompany,
        variables: {
            companyPublicId: activeCompany?.publicId ?? '',
            pagination: { cursor: null, take: PRODUCT_PAGINATION_SIZE },
        },
    });

    const products = productsData?.getCompanyProducts.data ?? [];
    const productsPageInfo = productsData?.getCompanyProducts.pageInfo;

    function loadMoreProducts() {
        if (!productsPageInfo?.hasNextPage || productsPageInfo.endCursor == null) return;

        fetchMore({
            variables: {
                pagination: { cursor: productsPageInfo.endCursor, take: PRODUCT_PAGINATION_SIZE },
            },
            updateQuery: (prev, { fetchMoreResult }) => {
                if (!fetchMoreResult) return prev;

                return {
                    getCompanyProducts: {
                        ...fetchMoreResult.getCompanyProducts,
                        data: [
                            ...prev.getCompanyProducts.data,
                            ...fetchMoreResult.getCompanyProducts.data,
                        ],
                    },
                };
            },
        });
    }

    const client = useApolloClient();
    const [updateBundleProduct, { loading }] = useMutation(UPDATE_BUNDLE_PRODUCT);

    function patch(values: Partial<FormState>) {
        setForm((prev) => ({ ...prev, ...values }));
        onDirtyChange?.(true);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (loading || !activeCompany) return;

        setFormValidation({});

        try {
            const { data, error } = await updateBundleProduct({
                variables: {
                    companyPublicId: activeCompany.publicId,
                    input: {
                        publicId: product.publicId,
                        name: form.name,
                        description: form.description || undefined,
                        categoryName: form.category,
                        status: STATUS_MAP[form.status],
                        sku: form.sku,
                        price: Number(form.price),
                        bundleProductionMode: form.bundleProductionMode,
                        bundleItems: items
                            .filter((item) => !item.deletedAt)
                            .map((item) => ({
                                publicId: item.publicId || undefined,
                                productPublicId: item.productPublicId,
                                qty: Number(item.qty),
                            })),
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

                    if (err?.statusCode === 409 && id === 'PRODUCT_SKU_ALREADY_EXISTS') {
                        setFormValidation({ sku: ['This SKU is already in use'] });
                        return;
                    }
                }

                toast.error('Something went wrong. Please try again.', {
                    position: 'top-center',
                });
                return;
            }

            if (data) {
                client.refetchQueries({
                    include: ['GetCatalog', 'GetCompanyCategories', 'GetProductsForBundle'],
                });
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

    function addItem() {
        setItems((prev) => [
            ...prev,
            {
                id: `item-${Date.now()}`,
                productPublicId: products[0]?.publicId ?? '',
                qty: '1',
            },
        ]);
        onDirtyChange?.(true);
    }

    function patchItem(itemId: string, values: Partial<BundleItem>) {
        setItems((prev) =>
            prev.map((item) => (item.id === itemId ? { ...item, ...values } : item)),
        );
        onDirtyChange?.(true);
    }

    function removeItem(itemId: string) {
        setItems((prev) => prev.filter((item) => item.id !== itemId));
        onDirtyChange?.(true);
    }

    function restoreItem(itemId: string) {
        setItems((prev) =>
            prev.map((item) => (item.id === itemId ? { ...item, deletedAt: undefined } : item)),
        );
        onDirtyChange?.(true);
    }

    const activeItems = items.filter((item) => !item.deletedAt);
    const deletedItems = items.filter((item) => !!item.deletedAt);

    const summary = useMemo(() => {
        const productsMap = new Map(products.map((p) => [p.publicId, p]));

        const normalized = activeItems.map((item) => ({
            ...item,
            productName: productsMap.get(item.productPublicId)?.name ?? '',
            qtyNumber: Number(item.qty) || 0,
        }));

        const validItems = normalized.filter((item) => item.productName.length > 0);
        const totalQty = normalized.reduce((acc, item) => acc + Math.max(item.qtyNumber, 0), 0);

        return { itemCount: validItems.length, totalQty };
    }, [activeItems, products]);

    return (
        <form
            id="edit-bundle-product-form"
            onSubmit={handleSubmit}
            className="flex w-full flex-col"
        >
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
                        autoComplete="off"
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
                    <Label htmlFor="description">
                        Description{' '}
                        <span className="text-muted-foreground text-xs">(Optional)</span>
                    </Label>
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
                            autoComplete="off"
                        />
                        <ShowErrorText error={formValidation} field="sku" />
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
                        <ShowErrorText error={formValidation} field="price" />
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
                        {activeItems.length === 0 && deletedItems.length === 0 ? (
                            <p className="text-muted-foreground rounded-md border border-dashed px-3 py-4 text-center text-xs">
                                No bundle item yet. Add at least one item to build this package.
                            </p>
                        ) : (
                            <>
                                {activeItems.map((item) => (
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
                                                {products.map((p) => (
                                                    <SelectItem key={p.publicId} value={p.publicId}>
                                                        {p.name}
                                                    </SelectItem>
                                                ))}
                                                {productsPageInfo?.hasNextPage && (
                                                    <div className="border-t pt-1">
                                                        <p className="text-muted-foreground px-2 py-1 text-xs">
                                                            Showing {products.length} products
                                                        </p>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            className="w-full"
                                                            disabled={productsLoading}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                loadMoreProducts();
                                                            }}
                                                        >
                                                            {productsLoading ? (
                                                                <IconLoader2 className="size-3.5 animate-spin" />
                                                            ) : (
                                                                <IconChevronDown className="size-3.5" />
                                                            )}
                                                            {productsLoading
                                                                ? 'Loading...'
                                                                : 'Load more'}
                                                        </Button>
                                                    </div>
                                                )}
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
                                ))}

                                {deletedItems.length > 0 && (
                                    <div className="space-y-2">
                                        <p className="text-muted-foreground px-1 text-xs">
                                            Removed items - click restore to re-include
                                        </p>
                                        {deletedItems.map((item) => {
                                            const productName =
                                                products.find(
                                                    (p) => p.publicId === item.productPublicId,
                                                )?.name ??
                                                product.bundleItems?.find(
                                                    (b) => b.publicId === item.publicId,
                                                )?.product.name ??
                                                item.productPublicId;

                                            return (
                                                <div
                                                    key={item.id}
                                                    className="grid grid-cols-[1fr_32px] gap-2 rounded-md border border-dashed px-3 py-2"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm text-red-500 line-through">
                                                            {productName}
                                                        </span>
                                                        <Badge
                                                            variant="secondary"
                                                            className="text-xs"
                                                        >
                                                            qty: {item.qty}
                                                        </Badge>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="icon"
                                                        className="size-8"
                                                        onClick={() => restoreItem(item.id)}
                                                    >
                                                        <IconArrowBackUp className="size-4" />
                                                    </Button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                        <Badge variant="secondary">Items: {summary.itemCount}</Badge>
                        <Badge variant="secondary">Total Qty: {summary.totalQty}</Badge>
                    </div>
                    <ShowErrorText error={formValidation} field="bundleItems" />
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
                        {(
                            [BundleProductionMode.WHOLE, BundleProductionMode.INDEPENDENT] as const
                        ).map((mode) => (
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
                                {mode === BundleProductionMode.WHOLE
                                    ? 'As a whole'
                                    : 'Independently per item'}
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
                        </SelectContent>
                    </Select>
                </div>
            </section>
        </form>
    );
}
