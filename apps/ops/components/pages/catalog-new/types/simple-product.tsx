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
import { type ProductStatus } from '../../catalog/catalog-container';
import { CategorySelect } from '../category-select';
import { useCompany } from '@/root/components/container/company-provider';
import {
    Product as OpsProduct,
    ProductStatus as OpsProductStatus,
    SimpleProductInput,
} from '@repo/commons/types/ops-service-schema.type';
import { hasGraphQLError } from '@repo/commons/utils/graphql';
import { convertErrorMessageListToObject } from '@repo/commons/utils/error-message';
import ShowErrorText from '@/shadcn/custom-components/show-error-text';

const VALIDATION_FIELDS = ['name', 'categoryName', 'sku', 'price'];

interface CreateSimpleProductResponse {
    createSimpleProductForOps: OpsProduct;
}

interface CreateSimpleProductVariables {
    companyPublicId: string;
    input: SimpleProductInput;
}

const CREATE_SIMPLE_PRODUCT: TypedDocumentNode<
    CreateSimpleProductResponse,
    CreateSimpleProductVariables
> = gql`
    mutation CreateSimpleProduct($companyPublicId: String!, $input: SimpleProductInput!) {
        createSimpleProductForOps(companyPublicId: $companyPublicId, input: $input) {
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

export function SimpleProductForm({
    onClose,
    onDirtyChange,
}: {
    onClose: () => void;
    onDirtyChange?: (dirty: boolean) => void;
}) {
    const [form, setForm] = useState<FormState>(DEFAULT_FORM);
    const [formValidation, setFormValidation] = useState<Record<string, string[]>>({});
    const { activeCompany } = useCompany();
    const client = useApolloClient();
    const [createSimpleProduct, { loading }] = useMutation(CREATE_SIMPLE_PRODUCT);

    function patch(values: Partial<FormState>) {
        setForm((prev) => ({ ...prev, ...values }));
        onDirtyChange?.(true);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (loading || !activeCompany) return;

        setFormValidation({});

        try {
            const { data, error } = await createSimpleProduct({
                variables: {
                    companyPublicId: activeCompany.publicId,
                    input: {
                        name: form.name,
                        description: form.description,
                        categoryName: form.category,
                        status: STATUS_MAP[form.status],
                        sku: form.sku,
                        price: Number(form.price),
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
                        setFormValidation({
                            sku: ['This SKU is already in use'],
                        });
                        return;
                    }
                }
            }

            if (data) {
                client.refetchQueries({
                    include: ['GetCatalog', 'GetCompanyCategories', 'GetProductsForBundle'],
                });
                toast.success('Product created');
                onClose();
                return;
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

                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                        id="sku"
                        placeholder="e.g. MUG-001"
                        value={form.sku}
                        onChange={(e) => patch({ sku: e.target.value })}
                        autoComplete="off"
                    />
                    <ShowErrorText error={formValidation} field="sku" />
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
                    <ShowErrorText error={formValidation} field="price" />
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
