import RedirectAuthorize from '@/root/components/pages/oauth-authorize/redirect-authorize';
import Loader from '@repo/shadcn-ui/custom-components/loader';
import { notFound } from 'next/navigation';

export default async function page({
    searchParams,
}: {
    searchParams: Promise<Record<string, string>>;
}) {
    const { clientId, redirectUri, codeChallenge, state } = await searchParams;

    if (!clientId || !redirectUri || !codeChallenge || !state) notFound();

    return (
        <RedirectAuthorize
            clientId={clientId}
            redirectUri={redirectUri}
            codeChallenge={codeChallenge}
            state={state}
        >
            <Loader />
        </RedirectAuthorize>
    );
}
