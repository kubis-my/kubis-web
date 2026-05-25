'use client';

import { MAIN_APP_BASE_URL } from '@repo/commons/constant/base';
import Loader from '@repo/shadcn-ui/custom-components/loader';
import { useEffect, useState } from 'react';
import { authClient } from '@repo/commons/lib/auth-client';
import { getToken, SESSION_TOKEN_KEY } from '@repo/commons/utils/storage-helpers';

export default function SessionGuard({ children }: { children: React.ReactNode }) {
    const [isAuthenticating, setIsAuthenticating] = useState(true);

    useEffect(() => {
        const guard = async () => {
            try {
                const sessionToken = getToken(SESSION_TOKEN_KEY);

                if (!sessionToken) {
                    setIsAuthenticating(false);
                    return;
                }

                const { code, raw } = await authClient.validate({ token: sessionToken });

                if (code === 200 && raw.valid === false) {
                    window.location.replace(MAIN_APP_BASE_URL);
                    return;
                }
            } catch (error) {
                console.error('Session check error:', error);
            }

            setIsAuthenticating(false);
        };

        guard();
    }, []);

    if (isAuthenticating) return <Loader />;

    return children;
}
