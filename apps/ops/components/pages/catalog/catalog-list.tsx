'use client';

import { Badge } from '@repo/shadcn-ui/components/badge';
import { DataTable } from '@repo/shadcn-ui/components/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Product, useCatalog, type ProductStatus, type ProductType } from './catalog-container';

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
    if (price === undefined) return '-';
    return new Intl.NumberFormat('en-MY', {
        style: 'currency',
        currency: 'MYR',
        maximumFractionDigits: 2,
    }).format(price);
}

function formatDate(value?: string) {
    if (!value) return '-';

    return new Intl.DateTimeFormat('en-MY', { dateStyle: 'medium' }).format(new Date(value));
}

const ProductColumns: ColumnDef<Product>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
        enableHiding: false,
    },
    {
        accessorKey: 'category',
        header: 'Category',
        cell: ({ row }) => <div className="text-muted-foreground">{row.original.category}</div>,
        size: 170,
    },
    {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ row }) => (
            <Badge variant={TYPE_BADGE_VARIANT[row.original.type]}>
                {TYPE_LABELS[row.original.type]}
            </Badge>
        ),
        size: 120,
    },
    {
        accessorKey: 'sku',
        header: 'SKU',
        cell: ({ row }) => <div className="text-muted-foreground">{row.original.sku ?? '-'}</div>,
        size: 140,
    },
    {
        accessorKey: 'price',
        header: 'Price',
        cell: ({ row }) => <div>{formatPrice(row.original.price)}</div>,
        size: 130,
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
            <Badge variant={STATUS_BADGE_VARIANT[row.original.status]}>
                {STATUS_LABELS[row.original.status]}
            </Badge>
        ),
        size: 120,
    },
    {
        accessorKey: 'archivedAt',
        header: 'Archived At',
        cell: ({ row }) => (
            <div className="text-muted-foreground">{formatDate(row.original.archivedAt)}</div>
        ),
        size: 150,
    },
];

export default function CatalogList() {
    const {
        products,
        isLoading,
        pageInfo,
        pageSize,
        onPageSizeChange,
        cursorHistory,
        onNextPage,
        onPreviousPage,
    } = useCatalog();

    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <DataTable
                columns={ProductColumns}
                data={products}
                pageInfo={pageInfo}
                isLoading={isLoading}
                pageSize={pageSize}
                onPageSizeChange={onPageSizeChange}
                cursorHistory={cursorHistory}
                onNextPage={onNextPage}
                onPreviousPage={onPreviousPage}
                emptyMessage='No products yet. Click "Add Product" to get started.'
                getRowId={(row) => row.publicId}
                flexColumnId="name"
            />
        </div>
    );
}
