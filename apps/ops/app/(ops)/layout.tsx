import DashboardContainer from '@/root/components/container/dashboard-container';
import { APP_NAME, navigationUserItemList } from '@/root/libs/dashboard-data';
import { DashboardProvider } from '@/shadcn/dashboards/dashboard-01';
import { OPS_APP_BASE_URL } from '@repo/commons/constant/base';
import { OPS_CLIENT_ID } from '@repo/commons/constant/client-id';
import AuthGuard from '@repo/shadcn-ui/guards/auth-guard';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Kubis Ops',
};

export default function layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <AuthGuard baseUrl={OPS_APP_BASE_URL} clientId={OPS_CLIENT_ID}>
            <DashboardProvider
                navigations={[]}
                userCardItems={navigationUserItemList}
                appName={APP_NAME}
            >
                <DashboardContainer>{children}</DashboardContainer>
            </DashboardProvider>
        </AuthGuard>
    );
}
