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
import { useCatalog, type ProductType } from './catalog-container';

const TYPE_LABELS: Record<ProductType, string> = {
    simple: 'Simple',
    variant: 'Variant',
    digital: 'Digital',
    service: 'Service',
    bundle: 'Bundle',
};

const TYPE_BADGE_VARIANT: Record<ProductType, 'default' | 'secondary' | 'outline'> = {
    simple: 'secondary',
    variant: 'default',
    digital: 'outline',
    service: 'outline',
    bundle: 'secondary',
};

function formatPrice(price?: number) {
    if (price === undefined) return '—';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
}

export default function ProductList() {
    const { products } = useCatalog();

    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>SKU</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead className="text-center">Min Qty</TableHead>
                            <TableHead className="text-center">Max Qty</TableHead>
                            <TableHead>Status</TableHead>
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
                                    <TableCell>
                                        <Badge variant={TYPE_BADGE_VARIANT[product.type]}>
                                            {TYPE_LABELS[product.type]}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {product.sku ?? '—'}
                                    </TableCell>
                                    <TableCell>{formatPrice(product.price)}</TableCell>
                                    <TableCell className="text-center">
                                        {product.defaultMinQty ?? '—'}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {product.defaultMaxQty ?? '—'}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={product.isActive ? 'default' : 'secondary'}>
                                            {product.isActive ? 'Active' : 'Inactive'}
                                        </Badge>
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
