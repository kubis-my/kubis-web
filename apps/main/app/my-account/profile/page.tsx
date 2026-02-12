import { AccountCard } from "@/root/components/pages/profile/account-card";
import { SecurityCard } from "@/root/components/pages/profile/security-card";
import { SessionCard } from "@/root/components/pages/profile/session-card";
import ProfileTabContainer from "@/root/components/pages/profile/tab-container";
import ProfileContainer from "@/root/components/pages/profile/profile-container";

export default function page() {
    return (
        <ProfileContainer>
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <AccountCard />
                    <SecurityCard />
                    <SessionCard />
                </div>
                <ProfileTabContainer />
            </div>
        </ProfileContainer>
    );
}
