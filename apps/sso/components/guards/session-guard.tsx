"use client";

import { MAIN_APP_BASE_URL } from "@repo/commons/constant/base";
import Loader from "@repo/shadcn-ui/custom-components/loader";
import { useEffect, useState } from "react";


export default function SessionGuard({ children }: { children: React.ReactNode }) {
    const [isAuthenticating, setIsAuthenticating] = useState(true);

    useEffect(() => {
        const guard = async () => {
            try {
                const response = await fetch('/api/auth/session', {
                    method: 'GET',
                    credentials: 'include',
                });

                const data = await response.json();

                if (response.ok && data.authenticated === false) {
                    window.location.replace(MAIN_APP_BASE_URL)
                    return;
                }
            } catch (error) {
                console.error('Session check error:', error);
            }

            setIsAuthenticating(false);
        }

        guard()
    }, [])

    if (isAuthenticating) return <Loader />

    return children
}
