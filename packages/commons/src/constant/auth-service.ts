import { AUTH_SVC_URL } from './base';

export const AUTH_SERVICE_ROUTE = {
    AUTH: {
        SIGN_IN: `${AUTH_SVC_URL}/sign-in/with-identifier`,
        REFRESH: `${AUTH_SVC_URL}/auth/refresh`,
        VALIDATE: `${AUTH_SVC_URL}/auth/validate`,
        SIGN_OUT: `${AUTH_SVC_URL}/auth/sign-out`,
    },
    OAUTH: {
        EXCHANGE_TOKEN: `${AUTH_SVC_URL}/oauth/token`,
        AUTHORIZE: `${AUTH_SVC_URL}/oauth/authorize`,
    },
};
