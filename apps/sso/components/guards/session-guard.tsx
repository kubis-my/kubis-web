"use client";

import { MAIN_APP_BASE_URL } from "@repo/commons/constant/base";
import { authClient } from "@repo/commons/lib/auth-client";
import { secureTokenStorage } from "@repo/commons/utils/secure-token-storage";
import Loader from "@repo/shadcn-ui/custom-components/loader";
import { useEffect, useState } from "react";


export default function SessionGuard({ children }: { children: React.ReactNode }) {
    const [isAuthenticating, setIsAuthenticating] = useState(true);

    useEffect(() => {
        const guard = async () => {
            const token = await secureTokenStorage.getSessionToken();

            if (!token) {
                setIsAuthenticating(false);
                return;
            }

            const { code, raw } = await authClient.validate({ token })

            if (code === 200 && raw.valid === false) {
                window.location.replace(MAIN_APP_BASE_URL)
                return;
            }

            setIsAuthenticating(false);
        }

        guard()
    }, [])

    if (isAuthenticating) return <Loader />

    return children
}
