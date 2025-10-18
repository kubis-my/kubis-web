"use server";

import { DateTime } from "luxon"
import { JWT_COOKIE_KEY, REFRESH_JWT_COOKIE_KEY } from "../constant/glob"
import { authClient } from "../lib/auth-client"
import { useBaseAction } from "../utils/base-action"

export const refreshCredentialTokenAction = async () => {
    const { axios, getCookie, deleteCookie, setCookie } = await useBaseAction()

    const refreshToken = getCookie(REFRESH_JWT_COOKIE_KEY)

    if (refreshToken) {
        const { code, raw } = await authClient.refresh({
            refreshToken,
            driver: axios
        })

        if (code === 200) {
            setCookie(JWT_COOKIE_KEY, raw.token, {
                maxAge: DateTime.fromISO(raw.expiredAt).diff(DateTime.now(), 'seconds').seconds
            })

            return true;
        }
    }

    deleteCookie(REFRESH_JWT_COOKIE_KEY)
    deleteCookie(JWT_COOKIE_KEY)

    return false;
}