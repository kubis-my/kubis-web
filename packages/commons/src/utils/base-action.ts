'use server';

import axios from 'axios';
import { cookies, headers } from 'next/headers';
import { env } from '../constant/env';

export const useBaseAction = async (props: { form?: FormData } = {}) => {
    const cookie = await cookies();
    const hdrs = await headers();

    const setCookie = (
        id: string,
        value: string,
        options: {
            sameSite?: true | false | 'lax' | 'strict' | 'none' | undefined;
            secure?: boolean | undefined;
            httpOnly?: boolean | undefined;
            expires?: Date | undefined;
            maxAge?: number | undefined;
        } = {},
    ) => {
        cookie.set(id, value, {
            secure: true,
            sameSite: env.APP_ENV === 'production' ? 'none' : 'lax',
            httpOnly: env.APP_ENV === 'production',
            ...options,
        });
    };

    const getCookie = (id: string) => cookie.get(id)?.value;
    const deleteCookie = (id: string) => cookie.delete(id);

    const getFormValue = (field: string) => props?.form?.get(field)?.toString();

    const defaultAxios = axios.create({
        headers: {
            'Content-Type': 'application/json',
            Authorization: undefined,
            'User-Agent': hdrs.get('user-agent'),
            'x-forwarded-user-agent': hdrs.get('user-agent'),
        },
    });

    return {
        cookie,
        setCookie,
        getCookie,
        deleteCookie,
        getFormValue,
        get axios() {
            return defaultAxios;
        },
    };
};
