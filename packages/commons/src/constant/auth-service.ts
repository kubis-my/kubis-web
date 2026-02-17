import { AUTH_SVC_URL } from './base';

export const AUTH_SERVICE_ROUTE = {
    AUTH: {
        SIGN_IN: `${AUTH_SVC_URL}/sign-in/with-identifier`,
        REFRESH: `${AUTH_SVC_URL}/auth/refresh`,
        VALIDATE: `${AUTH_SVC_URL}/auth/validate`,
        SIGN_OUT: `${AUTH_SVC_URL}/auth/sign-out`,
        SIGN_IN_VERIFY_OTP: `${AUTH_SVC_URL}/sign-in/verify-otp`,
        SIGN_IN_RESEND_OTP: `${AUTH_SVC_URL}/sign-in/resend-otp`,
        FORGOT_PASSWORD: `${AUTH_SVC_URL}/sign-in/forgot-password`,
        FORGOT_PASSWORD_VERIFY_OTP: `${AUTH_SVC_URL}/sign-in/forgot-password/verify-otp`,
    },
    OAUTH: {
        EXCHANGE_TOKEN: `${AUTH_SVC_URL}/oauth/token`,
        AUTHORIZE: `${AUTH_SVC_URL}/oauth/authorize`,
    },
};
