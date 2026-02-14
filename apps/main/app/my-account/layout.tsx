import DashboardContainer from '@/root/components/container/dashboard-container';
import SettingDialog from '@/root/components/pages/settings/setting-dialog';
import { APP_NAME, navigationList, navigationUserItemList } from '@/root/libs/dashboard-data';
import { DashboardProvider } from '@/shadcn/dashboards/dashboard-01';
import { MAIN_APP_BASE_URL } from '@repo/commons/constant/base'
import { MAIN_CLIENT_ID } from '@repo/commons/constant/client-id'
import AuthGuard from '@repo/shadcn-ui/guards/auth-guard'
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "My Account"
};

export default function layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <AuthGuard baseUrl={MAIN_APP_BASE_URL} clientId={MAIN_CLIENT_ID}>
            <DashboardProvider navigations={navigationList} userCardItems={navigationUserItemList} appName={APP_NAME}>
                <DashboardContainer>
                    {children}
                </DashboardContainer>
                <SettingDialog />
            </DashboardProvider>
        </AuthGuard>
    )
}
