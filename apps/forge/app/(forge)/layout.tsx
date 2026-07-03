import { FORGE_APP_BASE_URL } from '@repo/commons/constant/base';
import { FORGE_CLIENT_ID } from '@repo/commons/constant/client-id';
import AuthGuard from '@repo/shadcn-ui/guards/auth-guard';
import { ForgeApolloProvider } from '@/root/components/providers/forge-apollo-provider';
import DashboardContainer from '@/root/components/container/dashboard-container';
import { navigationUserItemList, showAllProjectsCta } from '@/root/libs/dashboard-data';
import { DashboardProvider } from '@/shadcn/dashboards/dashboard-02';

export default function layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <AuthGuard baseUrl={FORGE_APP_BASE_URL} clientId={FORGE_CLIENT_ID}>
            <ForgeApolloProvider>
                <DashboardProvider
                    workspaces={[]}
                    navMain={[]}
                    userCardItems={navigationUserItemList}
                    appName="Forge Console"
                    switcherCta={showAllProjectsCta}
                    switcherLabel="Projects"
                >
                    <DashboardContainer>{children}</DashboardContainer>
                </DashboardProvider>
            </ForgeApolloProvider>
        </AuthGuard>
    );
}
