import CatalogContainer from '@/root/components/pages/catalog/catalog-container';
import ProductList from '@/root/components/pages/catalog/product-list';

export default function page() {
    return (
        <CatalogContainer>
            <ProductList />
        </CatalogContainer>
    );
}
