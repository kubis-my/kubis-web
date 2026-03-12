import type { Product } from './catalog-container';

export const DUMMY_CATEGORIES: string[] = [
    'Apparel',
    'Services',
    'Digital Assets',
    'Bundles',
    'Merchandise',
    'Fabrication',
];

export const DUMMY_PRODUCTS: Product[] = [
    {
        publicId: '1',
        name: 'Classic T-Shirt',
        category: 'Apparel',
        type: 'variant',
        sku: undefined,
        price: undefined,
        status: 'active',
    },
    {
        publicId: '2',
        name: 'Design Consultation',
        category: 'Services',
        type: 'service',
        sku: 'SVC-001',
        price: 150000,
        status: 'active',
    },
    {
        publicId: '3',
        name: 'Logo Pack',
        category: 'Digital Assets',
        type: 'digital',
        sku: 'DIG-001',
        price: 75000,
        status: 'draft',
    },
    {
        publicId: '4',
        name: 'Starter Bundle',
        category: 'Bundles',
        type: 'bundle',
        sku: 'BDL-001',
        price: 200000,
        status: 'inactive',
    },
    {
        publicId: '5',
        name: 'Plain Mug',
        category: 'Merchandise',
        type: 'simple',
        sku: 'MUG-001',
        price: 45000,
        status: 'archived',
        archivedAt: '2026-02-20T00:00:00.000Z',
    },
    {
        publicId: '6',
        name: 'House Gate (Custom)',
        category: 'Fabrication',
        type: 'custom',
        price: 350000,
        status: 'active',
    },
];
