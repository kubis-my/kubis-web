import { useState } from 'react';
import { toast } from 'sonner';
import { gql, TypedDocumentNode } from '@apollo/client';
import { useMutation, useApolloClient } from '@apollo/client/react';
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
import { type Product, type ProductStatus } from '../../catalog/catalog-container';
import { CategorySelect } from '../../catalog-new/category-select';
import { useCompany } from '@/root/components/container/company-provider';
import {
    Product as OpsProduct,
    ProductStatus as OpsProductStatus,
    UpdateCustomProductInput,
} from '@repo/commons/types/ops-service-schema.type';
import { hasGraphQLError } from '@repo/commons/utils/graphql';
import { convertErrorMessageListToObject } from '@repo/commons/utils/error-message';
import ShowErrorText from '@/shadcn/custom-components/show-error-text';

const VALIDATION_FIELDS = ['name', 'categoryName', 'estimatedPrice'];

interface UpdateCustomProductResponse {
    updateCustomProductForOps: OpsProduct;
}

interface UpdateCustomProductVariables {
    companyPublicId: string;
    input: UpdateCustomProductInput;
}

const UPDATE_CUSTOM_PRODUCT: TypedDocumentNode<
    UpdateCustomProductResponse,
    UpdateCustomProductVariables
> = gql`
    mutation UpdateCustomProduct($companyPublicId: String!, $input: UpdateCustomProductInput!) {
        updateCustomProductForOps(companyPublicId: $companyPublicId, input: $input) {
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
    estimatedPrice: string;
    status: ProductStatus;
};

function toFormState(product: Product): FormState {
    return {
        name: product.name,
        category: product.category,
        description: product.description ?? '',
        estimatedPrice: product.price !== undefined ? String(product.price) : '',
        status: product.status,
    };
}

export function EditCustomProductForm({
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
    const { activeCompany } = useCompany();
    const client = useApolloClient();
    const [updateCustomProduct, { loading }] = useMutation(UPDATE_CUSTOM_PRODUCT);

    function patch(values: Partial<FormState>) {
        setForm((prev) => ({ ...prev, ...values }));
        onDirtyChange?.(true);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (loading || !activeCompany) return;

        setFormValidation({});

        try {
            const { data, error } = await updateCustomProduct({
                variables: {
                    companyPublicId: activeCompany.publicId,
                    input: {
                        productPublicId: product.publicId,
                        name: form.name || undefined,
                        description: form.description || null,
                        categoryName: form.category || undefined,
                        status: STATUS_MAP[form.status],
                        estimatedPrice:
                            form.estimatedPrice !== '' ? Number(form.estimatedPrice) : undefined,
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

    return (
        <form
            id="edit-custom-product-form"
            onSubmit={handleSubmit}
            className="flex w-full flex-col"
        >
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
                        Description<span className="text-muted-foreground text-xs">(Optional)</span>
                    </Label>
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
            </section>

            <Separator />

            <section className="flex flex-col gap-4 py-4">
                <div>
                    <p className="text-sm font-medium">Pricing</p>
                    <p className="text-muted-foreground text-xs">
                        Estimated price shown as a reference for custom orders.
                    </p>
                </div>

                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="estimatedPrice">Estimated Price</Label>
                    <InputGroup>
                        <InputGroupAddon>
                            <InputGroupText>MYR</InputGroupText>
                        </InputGroupAddon>
                        <InputGroupInput
                            id="estimatedPrice"
                            type="number"
                            placeholder="0"
                            value={form.estimatedPrice}
                            onChange={(e) => patch({ estimatedPrice: e.target.value })}
                        />
                    </InputGroup>
                    <ShowErrorText error={formValidation} field="estimatedPrice" />
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
