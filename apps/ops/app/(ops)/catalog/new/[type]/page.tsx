import { notFound } from 'next/navigation';
import ProductFormContainer from '@/root/components/pages/catalog/new/product-form-container';
import type { ProductType } from '@/root/components/pages/catalog/catalog-container';

const VALID_TYPES: ProductType[] = ['simple', 'variant', 'digital', 'service', 'bundle'];

export default async function page({ params }: { params: Promise<{ type: string }> }) {
    const { type } = await params;

    if (!VALID_TYPES.includes(type as ProductType)) {
        notFound();
    }

    return <ProductFormContainer type={type as ProductType} />;
}
