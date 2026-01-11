import { ActivityCard } from "@/root/components/pages/my-account/activity-card";
import { CompaniesCard } from "@/root/components/pages/my-account/companies-card";
import CredentialActivityTable from "@/root/components/pages/my-account/credential-activity-table";
import { DeviceCard } from "@/root/components/pages/my-account/device-card";
import MyAccountContainer from "@/root/components/pages/my-account/my-account-container";

export default function page() {
    return (
        <MyAccountContainer>
            <div className="flex flex-1 flex-col gap-4 p-4">
                {/* TODO: IMPLEMENT ACTUAL DATA FOR THIS 3 CARDS */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <ActivityCard />
                    <CompaniesCard />
                    <DeviceCard />
                </div>
                <CredentialActivityTable />
            </div>
        </MyAccountContainer>
    )
}
