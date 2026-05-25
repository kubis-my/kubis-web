import { FORGE_APP_BASE_URL } from '@repo/commons/constant/base';
import { FORGE_CLIENT_ID } from '@repo/commons/constant/client-id';
import AuthGuard from '@repo/shadcn-ui/guards/auth-guard';
import { ForgeApolloProvider } from '@/root/components/providers/forge-apollo-provider';

export default function layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <AuthGuard baseUrl={FORGE_APP_BASE_URL} clientId={FORGE_CLIENT_ID}>
            <ForgeApolloProvider>{children}</ForgeApolloProvider>
        </AuthGuard>
    );
}
