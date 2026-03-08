'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDashboard01 } from '@/shadcn/dashboards/dashboard-01';
import CatalogHeaderAction from './catalog-header-action';

export type ProductType = 'simple' | 'variant' | 'digital' | 'service' | 'bundle';

export type Product = {
    publicId: string;
    name: string;
    type: ProductType;
    sku?: string;
    price?: number;
    defaultMinQty?: number;
    defaultMaxQty?: number;
    isActive: boolean;
};

const DUMMY_PRODUCTS: Product[] = [
    {
        publicId: '1',
        name: 'Classic T-Shirt',
        type: 'variant',
        sku: undefined,
        price: undefined,
        defaultMinQty: 10,
        defaultMaxQty: 100,
        isActive: true,
    },
    {
        publicId: '2',
        name: 'Design Consultation',
        type: 'service',
        sku: 'SVC-001',
        price: 150000,
        isActive: true,
    },
    {
        publicId: '3',
        name: 'Logo Pack',
        type: 'digital',
        sku: 'DIG-001',
        price: 75000,
        isActive: true,
    },
    {
        publicId: '4',
        name: 'Starter Bundle',
        type: 'bundle',
        sku: 'BDL-001',
        price: 200000,
        isActive: false,
    },
    {
        publicId: '5',
        name: 'Plain Mug',
        type: 'simple',
        sku: 'MUG-001',
        price: 45000,
        defaultMinQty: 5,
        isActive: true,
    },
];

type CatalogContextType = {
    products: Product[];
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
    const { updateBreadcrumbList, updateHeaderAction } = useDashboard01();

    useEffect(() => {
        updateBreadcrumbList([{ name: 'Product Catalog' }]);
        updateHeaderAction(<CatalogHeaderAction />);

        return () => {
            updateBreadcrumbList([]);
            updateHeaderAction(undefined);
        };
    }, [updateBreadcrumbList, updateHeaderAction]);

    return (
        <CatalogContext.Provider value={{ products, isLoading: false }}>
            {children}
        </CatalogContext.Provider>
    );
}
