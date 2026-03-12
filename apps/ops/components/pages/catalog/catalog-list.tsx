'use client';

import { Badge } from '@repo/shadcn-ui/components/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@repo/shadcn-ui/components/table';
import { useCatalog, type ProductStatus, type ProductType } from './catalog-container';

const TYPE_LABELS: Record<ProductType, string> = {
    simple: 'Simple',
    variant: 'Variant',
    digital: 'Digital',
    service: 'Service',
    bundle: 'Bundle',
    custom: 'Custom',
};

const TYPE_BADGE_VARIANT: Record<ProductType, 'default' | 'secondary' | 'outline'> = {
    simple: 'secondary',
    variant: 'default',
    digital: 'outline',
    service: 'outline',
    bundle: 'secondary',
    custom: 'default',
};

const STATUS_LABELS: Record<ProductStatus, string> = {
    draft: 'Draft',
    active: 'Active',
    inactive: 'Inactive',
    archived: 'Archived',
};

const STATUS_BADGE_VARIANT: Record<ProductStatus, 'default' | 'secondary' | 'outline'> = {
    draft: 'outline',
    active: 'default',
    inactive: 'secondary',
    archived: 'secondary',
};

function formatPrice(price?: number) {
    if (price === undefined) return '—';
    return new Intl.NumberFormat('en-MY', {
        style: 'currency',
        currency: 'MYR',
        maximumFractionDigits: 0,
    }).format(price);
}

function formatDate(value?: string) {
    if (!value) return '—';

    return new Intl.DateTimeFormat('en-MY', { dateStyle: 'medium' }).format(new Date(value));
}

export default function CatalogList() {
    const { products } = useCatalog();

    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>SKU</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Archived At</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-muted-foreground py-12 text-center text-sm">
                                    No products yet. Click "Add Product" to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            products.map((product) => (
                                <TableRow key={product.publicId}>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell className="text-muted-foreground">{product.category}</TableCell>
                                    <TableCell>
                                        <Badge variant={TYPE_BADGE_VARIANT[product.type]}>
                                            {TYPE_LABELS[product.type]}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {product.sku ?? '—'}
                                    </TableCell>
                                    <TableCell>{formatPrice(product.price)}</TableCell>
                                    <TableCell>
                                        <Badge variant={STATUS_BADGE_VARIANT[product.status]}>
                                            {STATUS_LABELS[product.status]}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {formatDate(product.archivedAt)}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
