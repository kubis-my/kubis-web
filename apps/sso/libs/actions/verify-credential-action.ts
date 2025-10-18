"use server";

import { SSO_SESSION_COOKIE_KEY } from "@repo/commons/constant/glob";
import { authClient } from "@repo/commons/lib/auth-client";
import { useBaseAction } from "@repo/commons/utils/base-action";

export const verifyCredentialAction = async () => {
    const { axios, getCookie, deleteCookie } = await useBaseAction()

    const sessionToken = getCookie(SSO_SESSION_COOKIE_KEY)

    if (!sessionToken) return false;

    const { code, raw } = await authClient.validate({ token: sessionToken!, driver: axios })

    if (code === 200 && raw.valid === false) {
        return true;
    }

    deleteCookie(SSO_SESSION_COOKIE_KEY)

    return false;
}