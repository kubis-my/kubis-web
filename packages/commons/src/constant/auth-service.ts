import { AUTH_SVC_URL } from './base';

export const AUTH_SERVICE_ROUTE = {
    AUTH: {
        REFRESH: `${AUTH_SVC_URL}/auth/refresh`,
        VALIDATE: `${AUTH_SVC_URL}/auth/validate`,
        SIGN_OUT: `${AUTH_SVC_URL}/auth/sign-out`,
    },
    SIGN_IN: {
        WITH_IDENTIFIER: `${AUTH_SVC_URL}/sign-in/with-identifier`,
        VERIFY_OTP: `${AUTH_SVC_URL}/sign-in/verify-otp`,
        RESEND_OTP: `${AUTH_SVC_URL}/sign-in/resend-otp`,
        FORGOT_PASSWORD: `${AUTH_SVC_URL}/sign-in/forgot-password`,
        FORGOT_PASSWORD_VERIFY_OTP: `${AUTH_SVC_URL}/sign-in/forgot-password/verify-otp`,
    },
    SIGN_UP: {
        WITH_IDENTIFIER: `${AUTH_SVC_URL}/sign-up/with-identifier`,
        VERIFY_OTP: `${AUTH_SVC_URL}/sign-up/verify-otp`,
    },
    OAUTH: {
        EXCHANGE_TOKEN: `${AUTH_SVC_URL}/oauth/token`,
        AUTHORIZE: `${AUTH_SVC_URL}/oauth/authorize`,
    },
    CREDENTIAL: {
        UPDATE: `${AUTH_SVC_URL}/credential/update`,
        UPDATE_VERIFY_OTP: `${AUTH_SVC_URL}/credential/update/verify-otp`,
        UPDATE_SESSION_TTL: `${AUTH_SVC_URL}/credential/update-session-ttl`,
    },
    TELEGRAM: {
        CREDENTIAL_SETUP: `${AUTH_SVC_URL}/telegram/credential-setup`,
        CREDENTIAL_DISABLE: `${AUTH_SVC_URL}/telegram/credential-disable`,
    },
};
