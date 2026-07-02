'use client';

import { useState } from 'react';
import { Badge } from '@repo/shadcn-ui/components/badge';
import { Button } from '@repo/shadcn-ui/components/button';
import { DataTable } from '@repo/shadcn-ui/components/data-table';
import { ColumnDef, Row } from '@tanstack/react-table';
import { IconChevronDown, IconChevronRight, IconPencil } from '@tabler/icons-react';
import { cn } from '@repo/shadcn-ui/lib/utils';
import { formatDateTime } from '@repo/commons/utils/date';
import {
    Product,
    ProductBundleItem,
    ProductVariant,
    useCatalog,
    type ProductStatus,
    type ProductType,
} from './catalog-container';

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

function VariantSubRows({ variants }: { variants: ProductVariant[] }) {
    return (
        <div className="border-border/50 border-t px-5 py-2 pl-10">
            <table className="w-full text-sm">
                <thead>
                    <tr className="text-muted-foreground border-border/40 border-b text-xs">
                        <th className="py-1.5 text-left font-medium">SKU</th>
                        <th className="py-1.5 text-left font-medium">Price</th>
                        <th className="py-1.5 text-left font-medium">Attributes</th>
                        <th className="py-1.5 text-left font-medium">Deleted At</th>
                    </tr>
                </thead>
                <tbody>
                    {variants.map((v, i) => (
                        <tr key={i} className="border-border/40 border-b last:border-0">
                            <td
                                className={cn(
                                    'py-2 font-mono text-xs',
                                    v.deletedAt && 'text-red-500 line-through',
                                )}
                            >
                                {v.sku}
                            </td>
                            <td className={cn('py-2', v.deletedAt && 'text-red-500 line-through')}>
                                {formatPrice(v.price)}
                            </td>
                            <td
                                className={cn(
                                    'text-muted-foreground py-2',
                                    v.deletedAt && 'text-red-500 line-through',
                                )}
                            >
                                {v.attributeValues.join(' / ')}
                            </td>
                            <td className="text-muted-foreground py-2">
                                {formatDateTime(v.deletedAt, { format: 'dd MMM yyyy' })}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function BundleSubRows({ items }: { items: ProductBundleItem[] }) {
    return (
        <div className="border-border/50 border-t px-5 py-2 pl-10">
            <table className="w-full text-sm">
                <thead>
                    <tr className="text-muted-foreground border-border/40 border-b text-xs">
                        <th className="py-1.5 text-left font-medium">Product</th>
                        <th className="py-1.5 text-left font-medium">Qty</th>
                        <th className="py-1.5 text-left font-medium">Deleted At</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, i) => (
                        <tr key={i} className="border-border/40 border-b last:border-0">
                            <td
                                className={cn(
                                    'py-2',
                                    item.deletedAt && 'text-red-500 line-through',
                                )}
                            >
                                {item.product.name}
                            </td>
                            <td
                                className={cn(
                                    'py-2',
                                    item.deletedAt && 'text-red-500 line-through',
                                )}
                            >
                                {item.qty}
                            </td>
                            <td className="text-muted-foreground py-2">
                                {formatDateTime(item.deletedAt, { format: 'dd MMM yyyy' })}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

const EDITABLE_TYPES: ProductType[] = [
    'simple',
    'digital',
    'service',
    'custom',
    'variant',
    'bundle',
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
        onEditProduct,
    } = useCatalog();

    const [expandedId, setExpandedId] = useState<string | null>(null);

    function toggleRow(publicId: string) {
        setExpandedId((prev) => (prev === publicId ? null : publicId));
    }

    function hasChildren(product: Product) {
        return (
            !!product.description ||
            (product.type === 'variant' && (product.variants?.length ?? 0) > 0) ||
            (product.type === 'bundle' && (product.bundleItems?.length ?? 0) > 0)
        );
    }

    function isExpanded(product: Product) {
        return expandedId === product.publicId;
    }

    const ProductColumns: ColumnDef<Product>[] = [
        {
            accessorKey: 'name',
            header: 'Name',
            cell: ({ row }: { row: Row<Product> }) => (
                <div className="flex items-center gap-2">
                    {hasChildren(row.original) ? (
                        <button
                            className="text-muted-foreground hover:text-foreground shrink-0 transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleRow(row.original.publicId);
                            }}
                        >
                            {isExpanded(row.original) ? (
                                <IconChevronDown className="size-4" />
                            ) : (
                                <IconChevronRight className="size-4" />
                            )}
                        </button>
                    ) : (
                        <span className="size-4 shrink-0" />
                    )}
                    <span className="font-medium">{row.original.name}</span>
                </div>
            ),
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
            cell: ({ row }) => (
                <div className="text-muted-foreground">{row.original.sku ?? '-'}</div>
            ),
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
                <div className="text-muted-foreground">
                    {formatDateTime(row.original.archivedAt, { format: 'dd MMM yyyy' })}
                </div>
            ),
            size: 150,
        },
        {
            id: 'actions',
            cell: ({ row }) => {
                if (!EDITABLE_TYPES.includes(row.original.type)) return null;

                return (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        onClick={(e) => {
                            e.stopPropagation();
                            onEditProduct(row.original);
                        }}
                    >
                        <IconPencil className="size-4" />
                    </Button>
                );
            },
            size: 48,
        },
    ];

    function renderSubRow(row: Row<Product>) {
        const product = row.original;

        if (!isExpanded(product)) return null;

        return (
            <>
                {product.description && (
                    <div className="border-border/50 border-t px-5 py-3 pl-10">
                        <p className="text-muted-foreground text-sm">{product.description}</p>
                    </div>
                )}

                {product.type === 'variant' && product.variants?.length ? (
                    <VariantSubRows variants={product.variants} />
                ) : null}

                {product.type === 'bundle' && product.bundleItems?.length ? (
                    <BundleSubRows items={product.bundleItems} />
                ) : null}
            </>
        );
    }

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
                renderSubRow={renderSubRow}
            />
        </div>
    );
}
