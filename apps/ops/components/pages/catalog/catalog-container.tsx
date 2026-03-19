'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDashboard01 } from '@/shadcn/dashboards/dashboard-01';
import { useCompany } from '@/root/components/container/company-provider';
import { PRODUCT_PAGINATION_SIZE } from '@/root/libs/constants';
import { CatalogNewSheet } from '../catalog-new/catalog-new-sheet';
import { CatalogNewVariantDialog } from '../catalog-new/catalog-new-variant-dialog';
import CatalogHeaderAction from './catalog-header-action';
import {
    PaginatedProduct,
    PageInfo,
    Product as OpsProduct,
    ProductPaginationInput,
    ProductStatus as OpsProductStatus,
    ProductType as OpsProductType,
} from '@repo/commons/types/ops-service-schema.type';

export type ProductVariant = {
    sku: string;
    price?: number;
    attributeValues: string[];
};

export type ProductBundleItem = {
    product: { name: string };
    qty: number;
};
import { gql, TypedDocumentNode } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

export type ProductType = 'simple' | 'variant' | 'digital' | 'service' | 'bundle' | 'custom';
export type ProductStatus = 'draft' | 'active' | 'inactive' | 'archived';

export type Product = {
    publicId: string;
    name: string;
    category: string;
    type: ProductType;
    sku?: string;
    price?: number;
    status: ProductStatus;
    archivedAt?: string;
    variants?: ProductVariant[];
    bundleItems?: ProductBundleItem[];
};

interface GetCatalogResponse {
    getCompanyProducts: PaginatedProduct;
}

interface GetCatalogVariables {
    companyPublicId: string;
    pagination: ProductPaginationInput;
}

interface GetCategoriesResponse {
    getCompanyCategories: { publicId: string; name: string }[];
}

interface GetCategoriesVariables {
    companyPublicId: string;
}

const GET_COMPANY_CATEGORIES: TypedDocumentNode<GetCategoriesResponse, GetCategoriesVariables> = gql`
    query GetCompanyCategories($companyPublicId: String!) {
        getCompanyCategories(companyPublicId: $companyPublicId) {
            publicId
            name
        }
    }
`;

const GET_CATALOG: TypedDocumentNode<GetCatalogResponse, GetCatalogVariables> = gql`
    query GetCatalog($companyPublicId: String!, $pagination: ProductPaginationInput!) {
        getCompanyProducts(companyPublicId: $companyPublicId, pagination: $pagination) {
            data {
                publicId
                name
                type
                sku
                price
                estimatedPrice
                status
                archivedAt
                category {
                    name
                }
                variants {
                    sku
                    price
                    attributeValues {
                        value
                    }
                }
                bundleItems {
                    qty
                    product {
                        name
                    }
                }
            }
            pageInfo {
                endCursor
                hasNextPage
                total
                currentPage
                totalPages
            }
        }
    }
`;

function toProductType(value: OpsProductType): ProductType {
    switch (value) {
        case OpsProductType.SIMPLE:
            return 'simple';
        case OpsProductType.VARIANT:
            return 'variant';
        case OpsProductType.DIGITAL:
            return 'digital';
        case OpsProductType.SERVICE:
            return 'service';
        case OpsProductType.BUNDLE:
            return 'bundle';
        case OpsProductType.CUSTOM:
            return 'custom';
    }
}

function toProductStatus(value: OpsProductStatus): ProductStatus {
    switch (value) {
        case OpsProductStatus.DRAFT:
            return 'draft';
        case OpsProductStatus.ACTIVE:
            return 'active';
        case OpsProductStatus.INACTIVE:
            return 'inactive';
        case OpsProductStatus.ARCHIVED:
            return 'archived';
    }
}

function mapProduct(product: OpsProduct): Product {
    return {
        publicId: product.publicId,
        name: product.name,
        category: product.category.name,
        type: toProductType(product.type),
        sku: product.sku ?? undefined,
        price: product.price ?? product.estimatedPrice ?? undefined,
        status: toProductStatus(product.status),
        archivedAt: product.archivedAt ? String(product.archivedAt) : undefined,
        variants: product.variants?.map((v) => ({
            sku: v.sku,
            price: v.price ?? undefined,
            attributeValues: v.attributeValues.map((av) => av.value),
        })),
        bundleItems: product.bundleItems?.map((b) => ({
            product: { name: b.product.name },
            qty: b.qty,
        })),
    };
}

type CatalogContextType = {
    products: Product[];
    isLoading: boolean;
    pageInfo: PageInfo;
    pageSize: number;
    onPageSizeChange: (size: number) => void;
    cursorHistory: (number | null | undefined)[];
    onNextPage: () => void;
    onPreviousPage: () => void;
    categories: string[];
    categoriesLoading: boolean;
};

const CatalogContext = createContext<CatalogContextType | undefined>(undefined);
const EMPTY_PAGE_INFO: PageInfo = {
    endCursor: null,
    hasNextPage: false,
    total: 0,
    currentPage: 1,
    totalPages: 1,
};

export function useCatalog() {
    const context = useContext(CatalogContext);

    if (context === undefined) {
        throw new Error('useCatalog must be used within a CatalogContainer');
    }

    return context;
}

export default function CatalogContainer({ children }: Readonly<{ children: React.ReactNode }>) {
    const { activeCompany } = useCompany();
    const companyPublicId = activeCompany?.publicId;
    const [pageSize, setPageSize] = useState(PRODUCT_PAGINATION_SIZE);
    const [cursorHistory, setCursorHistory] = useState<(number | null | undefined)[]>([null]);
    const currentCursor = cursorHistory[cursorHistory.length - 1];
    const { data, loading: isLoading } = useQuery(GET_CATALOG, {
        skip: !companyPublicId,
        variables: {
            companyPublicId: companyPublicId ?? '',
            pagination: {
                cursor: currentCursor,
                take: pageSize,
            },
        },
    });

    const { data: categoriesData, loading: categoriesLoading } = useQuery(GET_COMPANY_CATEGORIES, {
        skip: !companyPublicId,
        variables: { companyPublicId: companyPublicId ?? '' },
    });

    const categories = categoriesData?.getCompanyCategories.map((c) => c.name) ?? [];

    const products = (data?.getCompanyProducts.data ?? []).map(mapProduct);
    const pageInfo = data?.getCompanyProducts.pageInfo ?? EMPTY_PAGE_INFO;

    function onPageSizeChange(size: number) {
        setPageSize(size);
        setCursorHistory([null]);
    }

    function onNextPage() {
        if (
            !pageInfo.hasNextPage ||
            pageInfo.endCursor === null ||
            pageInfo.endCursor === undefined
        ) {
            return;
        }

        setCursorHistory((prev) => [...prev, pageInfo.endCursor]);
    }

    function onPreviousPage() {
        if (cursorHistory.length <= 1) return;

        setCursorHistory((prev) => prev.slice(0, prev.length - 1));
    }

    const [openType, setOpenType] = useState<ProductType | null>(null);
    const { updateBreadcrumbList, updateHeaderAction } = useDashboard01();

    useEffect(() => {
        setCursorHistory([null]);
    }, [companyPublicId]);

    useEffect(() => {
        updateBreadcrumbList([{ name: 'Product Catalog' }]);
        updateHeaderAction(<CatalogHeaderAction onSelect={setOpenType} />);

        return () => {
            updateBreadcrumbList([]);
            updateHeaderAction(undefined);
        };
    }, [updateBreadcrumbList, updateHeaderAction]);

    const drawerType =
        openType !== null && openType !== 'variant'
            ? (openType as Exclude<ProductType, 'variant'>)
            : null;

    return (
        <CatalogContext.Provider
            value={{
                products,
                isLoading,
                pageInfo,
                pageSize,
                onPageSizeChange,
                cursorHistory,
                onNextPage,
                onPreviousPage,
                categories,
                categoriesLoading,
            }}
        >
            {children}

            <CatalogNewSheet type={drawerType} onClose={() => setOpenType(null)} />

            <CatalogNewVariantDialog
                open={openType === 'variant'}
                onClose={() => setOpenType(null)}
            />
        </CatalogContext.Provider>
    );
}
