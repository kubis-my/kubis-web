'use client';

import { Button } from '@repo/shadcn-ui/components/button';
import { SSO_APP_BASE_URL } from '@repo/commons/constant/base';
import { useAuth } from '@repo/shadcn-ui/providers/auth-provider';
import Link from 'next/link';

export default function HeroCta() {
    const { isAuthenticated } = useAuth();

    return (
        <div className="flex gap-4">
            <Button size="lg" asChild className="bg-[#4CAF50] hover:bg-[#43A047]">
                <Link href={isAuthenticated ? '/my-account' : `${SSO_APP_BASE_URL}/sign-in`}>
                    {isAuthenticated ? 'Go to Account' : 'Sign In Now'}
                </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
                <Link href="/explore-apps">Explore Apps</Link>
            </Button>
        </div>
    );
}
