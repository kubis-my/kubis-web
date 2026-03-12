'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDashboard01 } from '@/shadcn/dashboards/dashboard-01';
import { CatalogNewSheet } from '../catalog-new/catalog-new-sheet';
import { CatalogNewVariantDialog } from '../catalog-new/catalog-new-variant-dialog';
import CatalogHeaderAction from './catalog-header-action';
import { DUMMY_CATEGORIES, DUMMY_PRODUCTS } from './catalog-dummy-data';

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
};

export { DUMMY_PRODUCTS };

type CatalogContextType = {
    products: Product[];
    categories: string[];
    addCategory: (category: string) => void;
    isLoading: boolean;
};

const CatalogContext = createContext<CatalogContextType | undefined>(undefined);

export function useCatalog() {
    const context = useContext(CatalogContext);

    if (context === undefined) {
        throw new Error('useCatalog must be used within a CatalogContainer');
    }

    return context;
}

export default function CatalogContainer({ children }: Readonly<{ children: React.ReactNode }>) {
    const [products] = useState<Product[]>(DUMMY_PRODUCTS);
    const [categories, setCategories] = useState<string[]>(DUMMY_CATEGORIES);

    function addCategory(category: string) {
        setCategories((prev) => [...prev, category]);
    }
    const [openType, setOpenType] = useState<ProductType | null>(null);
    const { updateBreadcrumbList, updateHeaderAction } = useDashboard01();

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
        <CatalogContext.Provider value={{ products, categories, addCategory, isLoading: false }}>
            {children}

            <CatalogNewSheet
                type={drawerType}
                isDirty={false}
                onClose={() => setOpenType(null)}
            />

            <CatalogNewVariantDialog
                open={openType === 'variant'}
                isDirty={false}
                onClose={() => setOpenType(null)}
            />
        </CatalogContext.Provider>
    );
}
