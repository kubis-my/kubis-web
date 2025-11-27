import CompanyDetailCard from '@/root/components/pages/company-detail/company-detail-card';
import CompanyPhysicalAddressCard from '@/root/components/pages/company-detail/company-physical-address-card';
import CompanyBillingAddressCard from '@/root/components/pages/company-detail/company-billing-address-card';
import CompanyDetailContainer from '@/root/components/pages/company-detail/company-detail-container';
import React from 'react'
import TabContainer from '@/root/components/pages/company-detail/tab-container';

export default async function page({ params }: { params: Promise<{ companyId: string }> }) {
    const { companyId } = await params;

    return (
        <CompanyDetailContainer id={Number(companyId)}>
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <CompanyDetailCard />
                    <CompanyPhysicalAddressCard />
                    <CompanyBillingAddressCard />
                </div>
                <TabContainer />
            </div>
        </CompanyDetailContainer>
    )
}
