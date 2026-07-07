import DashboardContainer from '@/root/components/container/dashboard-container';
import { APP_NAME, navigationUserItemList } from '@/root/libs/dashboard-data';
import { DashboardProvider } from '@/shadcn/dashboards/dashboard-01';
import { MAIN_APP_BASE_URL, OPS_APP_BASE_URL } from '@repo/commons/constant/base';
import { OPS_CLIENT_ID } from '@repo/commons/constant/client-id';
import LogoutConfirmDialog from '@repo/shadcn-ui/custom-components/logout-confirm-dialog';
import AuthGuard from '@repo/shadcn-ui/guards/auth-guard';
import { OpsApolloProvider } from '@/root/components/providers/ops-apollo-provider';
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
            <OpsApolloProvider>
                <DashboardProvider
                    navigations={[]}
                    userCardItems={navigationUserItemList}
                    appName={APP_NAME}
                >
                    <DashboardContainer>{children}</DashboardContainer>
                    <LogoutConfirmDialog redirectTo={MAIN_APP_BASE_URL} />
                </DashboardProvider>
            </OpsApolloProvider>
        </AuthGuard>
    );
}
