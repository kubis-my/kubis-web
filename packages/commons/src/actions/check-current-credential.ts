"use server";

import { JWT_COOKIE_KEY } from "../constant/glob"
import { authClient } from "../lib/auth-client"
import { useBaseAction } from "../utils/base-action"

export const checkCurrentCredential = async () => {
    const { axios, getCookie } = await useBaseAction()

    const token = getCookie(JWT_COOKIE_KEY)

    if (token) {
        const { code, raw } = await authClient.validate({
            token,
            driver: axios
        })

        if (code === 200) {
            return {
                username: raw.payload.username,
                email: raw.payload.email,
            }
        }
    }

    return undefined;
}