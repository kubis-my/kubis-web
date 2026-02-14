import { OverviewCard } from '@/root/components/pages/companies/overview-card';
import { CompanyDataTable } from '@/root/components/pages/companies/data-table';
import CompanyContainer from '@/root/components/pages/companies/company-container';

export default function page() {
    return (
        <CompanyContainer>
            <div className="flex flex-1 flex-col gap-4 p-4">
                {/* Overview card */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <OverviewCard />
                </div>
                {/* Table list of company */}
                <div className="min-h-screen flex-1 rounded-xl md:min-h-min">
                    <CompanyDataTable />
                </div>
            </div>
        </CompanyContainer>
    );
}
