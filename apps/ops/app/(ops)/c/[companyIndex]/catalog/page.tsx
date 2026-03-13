import CatalogContainer from '@/root/components/pages/catalog/catalog-container';
import CatalogList from '@/root/components/pages/catalog/catalog-list';

export default function page() {
    return (
        <CatalogContainer>
            <CatalogList />
        </CatalogContainer>
    );
}
