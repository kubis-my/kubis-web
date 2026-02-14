import CompanyBranchBillingAddressCard from '@/root/components/pages/company-branch-detail/company-branch-billing-address-card';
import CompanyBranchDetailCard from '@/root/components/pages/company-branch-detail/company-branch-detail-card';
import CompanyBranchDetailContainer from '@/root/components/pages/company-branch-detail/company-branch-detail-container';
import CompanyBranchPhysicalAddressCard from '@/root/components/pages/company-branch-detail/company-branch-physical-address-card';
import TabContainer from '@/root/components/pages/company-branch-detail/tab-container';

export default async function BranchPage({
    params,
}: {
    params: Promise<{ companyId: string; branchId: string }>;
}) {
    const { companyId, branchId } = await params;

    return (
        <CompanyBranchDetailContainer companyId={companyId} branchId={branchId}>
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <CompanyBranchDetailCard />
                    <CompanyBranchPhysicalAddressCard />
                    <CompanyBranchBillingAddressCard />
                </div>
                <TabContainer />
            </div>
        </CompanyBranchDetailContainer>
    );
}
