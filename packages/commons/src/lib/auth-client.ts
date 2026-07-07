import axios, { AxiosError, AxiosInstance } from 'axios';
import { AUTH_SERVICE_ROUTE } from '../constant/auth-service';
import { convertErrorMessageListToObject } from '../utils/error-message';
import { generateCodeChallenge, generateCodeVerifier } from '../utils/pkce';

export const authClient = {
    async signIn(props: {
        identifier: string;
        password: string;
        clientId: string;
        redirectUri: string;
        scope?: string;
        state?: string;
        deviceId?: string;
        driver?: AxiosInstance;
    }) {
        const driver = props.driver || axios;
        const codeVerifier = generateCodeVerifier();
        const codeChallenge = await generateCodeChallenge(codeVerifier);
        const input = {
            identifier: props.identifier,
            password: props.password,
            clientId: props.clientId,
            redirectUri: props.redirectUri,
            scope: props.scope,
            state: props.state,
            deviceId: props.deviceId,
            codeChallenge,
        };

        try {
            const { data } = await driver.post(AUTH_SERVICE_ROUTE.SIGN_IN.WITH_IDENTIFIER, input);

            return {
                code: 200,
                raw: {
                    ...data,
                    verifier: codeVerifier,
                },
            };
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                const response = error.response;
                const data = response.data;

                if (response.status === 400) {
                    return {
                        code: 400,
                        raw: convertErrorMessageListToObject(Object.keys(input), data.message),
                    };
                }

                if (data.id) {
                    return {
                        code: response.status,
                        raw: data,
                    };
                }
            }

            return {
                code: 500,
                raw: {},
            };
        }
    },
    async refresh(props: { refreshToken: string; driver?: AxiosInstance }) {
        const driver = props.driver || axios;

        try {
            const { data } = await driver.get(AUTH_SERVICE_ROUTE.AUTH.REFRESH, {
                headers: {
                    Authorization: `Bearer ${props.refreshToken}`,
                },
            });

            return {
                code: 200,
                raw: data,
            };
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                const response = error.response;
                const data = response.data;

                if (data.id) {
                    return {
                        code: response.status,
                        raw: data,
                    };
                }
            }

            return {
                code: 500,
                raw: {},
            };
        }
    },
    async validate(props: { token: string; driver?: AxiosInstance }) {
        const driver = props.driver || axios;

        try {
            const { data } = await driver.get(AUTH_SERVICE_ROUTE.AUTH.VALIDATE, {
                headers: {
                    Authorization: `Bearer ${props.token}`,
                },
            });

            return {
                code: 200,
                raw: data,
            };
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                const response = error.response;
                const data = response.data;

                if (data.id) {
                    return {
                        code: response.status,
                        raw: data,
                    };
                }
            }

            return {
                code: 500,
                raw: {},
            };
        }
    },
    async exchangeCodeForTokens(props: {
        code: string;
        clientId: string;
        redirectUri: string;
        codeVerifier: string;
        driver?: AxiosInstance;
    }) {
        const driver = props.driver || axios;
        const input = {
            code: props.code,
            clientId: props.clientId,
            redirectUri: props.redirectUri,
            codeVerifier: props.codeVerifier,
            grantType: 'authorization_code',
        };

        try {
            const { data } = await driver.post(AUTH_SERVICE_ROUTE.OAUTH.EXCHANGE_TOKEN, input);

            return {
                code: 200,
                raw: data,
            };
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                const response = error.response;
                const data = response.data;

                if (response.status === 400) {
                    return {
                        code: 400,
                        raw: convertErrorMessageListToObject(Object.keys(input), data.message),
                    };
                }

                if (data.id) {
                    return {
                        code: response.status,
                        raw: data,
                    };
                }

                return {
                    code: 500,
                    raw: data,
                };
            }

            return {
                code: 500,
                raw: {},
            };
        }
    },
    async redirectAuthorize(props: {
        sessionToken: string;
        clientId: string;
        redirectUri: string;
        codeChallenge: string;
        scope?: string;
        state?: string;
        driver?: AxiosInstance;
    }) {
        const driver = props.driver || axios;
        const input = {
            clientId: props.clientId,
            redirectUri: props.redirectUri,
            codeChallenge: props.codeChallenge,
            scope: props.scope,
            state: props.state,
        };

        try {
            const { data } = await driver.get(AUTH_SERVICE_ROUTE.OAUTH.AUTHORIZE, {
                headers: {
                    Authorization: `Bearer ${props.sessionToken}`,
                },
                params: input,
            });

            return {
                code: 200,
                raw: data,
            };
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                const response = error.response;
                const data = response.data;

                if (response.status === 400) {
                    return {
                        code: 400,
                        raw: convertErrorMessageListToObject(Object.keys(input), data.message),
                    };
                }

                if (data.id) {
                    return {
                        code: response.status,
                        raw: data,
                    };
                }
            }

            return {
                code: 500,
                raw: {},
            };
        }
    },
    async signOut(props: {
        refreshToken: string;
        untrustThisDevice?: boolean;
        driver?: AxiosInstance;
    }) {
        const driver = props.driver || axios;

        try {
            const { data } = await driver.delete(AUTH_SERVICE_ROUTE.AUTH.SIGN_OUT, {
                headers: {
                    Authorization: `Bearer ${props.refreshToken}`,
                },
                ...(props.untrustThisDevice && {
                    data: { untrustThisDevice: true },
                }),
            });

            return {
                code: 200,
                raw: data,
            };
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                const response = error.response;
                const data = response.data;

                if (data.id) {
                    return {
                        code: response.status,
                        raw: data,
                    };
                }
            }

            return {
                code: 500,
                raw: {},
            };
        }
    },
    async verifyOTP(props: { token: string; otpCode: string; driver?: AxiosInstance }) {
        const driver = props.driver || axios;

        try {
            const input = {
                token: props.token,
                otpCode: props.otpCode,
            };
            const { data } = await driver.post(AUTH_SERVICE_ROUTE.SIGN_IN.VERIFY_OTP, input);

            return {
                code: 200,
                raw: data,
            };
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                const response = error.response;
                const data = response.data;

                if (data.id) {
                    return {
                        code: response.status,
                        raw: data,
                    };
                }
            }

            return {
                code: 500,
                raw: {},
            };
        }
    },
    async resendOTP(props: { existingToken: string; driver?: AxiosInstance }) {
        const driver = props.driver || axios;

        try {
            const input = {
                token: props.existingToken,
            };
            const { data } = await driver.post(AUTH_SERVICE_ROUTE.SIGN_IN.RESEND_OTP, input);

            return {
                code: 200,
                raw: data,
            };
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                const response = error.response;
                const data = response.data;

                if (data.id) {
                    return {
                        code: response.status,
                        raw: data,
                    };
                }
            }

            return {
                code: 500,
                raw: {},
            };
        }
    },
    async forgotPassword(props: { email: string; newPassword: string; driver?: AxiosInstance }) {
        const driver = props.driver || axios;
        const input = {
            email: props.email,
            newPassword: props.newPassword,
        };

        try {
            const { data } = await driver.post(AUTH_SERVICE_ROUTE.SIGN_IN.FORGOT_PASSWORD, input);

            return {
                code: 200,
                raw: data,
            };
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                const response = error.response;
                const data = response.data;

                if (response.status === 400) {
                    return {
                        code: 400,
                        raw: convertErrorMessageListToObject(Object.keys(input), data.message),
                    };
                }

                if (data.id) {
                    return {
                        code: response.status,
                        raw: data,
                    };
                }
            }

            return {
                code: 500,
                raw: {},
            };
        }
    },
    async forgotPasswordVerifyOTP(props: {
        token: string;
        otpCode: string;
        driver?: AxiosInstance;
    }) {
        const driver = props.driver || axios;

        try {
            const input = {
                token: props.token,
                otpCode: props.otpCode,
            };

            const { data } = await driver.post(
                AUTH_SERVICE_ROUTE.SIGN_IN.FORGOT_PASSWORD_VERIFY_OTP,
                input,
            );

            return {
                code: 200,
                raw: data,
            };
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                const response = error.response;
                const data = response.data;

                if (data.id) {
                    return {
                        code: response.status,
                        raw: data,
                    };
                }
            }

            return {
                code: 500,
                raw: {},
            };
        }
    },
    async signUpWithIdentifier(props: {
        driver?: AxiosInstance;
        email: string;
        username?: string;
        password: string;
    }) {
        const driver = props.driver || axios;
        const input = {
            email: props.email,
            username: props.username ?? '',
            password: props.password,
        };

        try {
            const { data } = await driver.post(AUTH_SERVICE_ROUTE.SIGN_UP.WITH_IDENTIFIER, input);

            return {
                code: 200,
                raw: data,
            };
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                const response = error.response;
                const data = response.data;

                if (response.status === 400) {
                    return {
                        code: 400,
                        raw: convertErrorMessageListToObject(Object.keys(input), data.message),
                    };
                }

                if (data.id) {
                    return {
                        code: response.status,
                        raw: data,
                    };
                }
            }

            return {
                code: 500,
                raw: {},
            };
        }
    },
    async signUpVerifyOTP(props: { token: string; otpCode: string; driver?: AxiosInstance }) {
        const driver = props.driver || axios;

        try {
            const input = {
                token: props.token,
                otpCode: props.otpCode,
            };

            const { data } = await driver.post(AUTH_SERVICE_ROUTE.SIGN_UP.VERIFY_OTP, input);

            return {
                code: 200,
                raw: data,
            };
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                const response = error.response;
                const data = response.data;

                if (data.id) {
                    return {
                        code: response.status,
                        raw: data,
                    };
                }
            }

            return {
                code: 500,
                raw: {},
            };
        }
    },
    async updateCredential(props: {
        driver?: AxiosInstance;
        email?: string;
        username?: string;
        password?: string;
    }) {
        const driver = props.driver || axios;
        const input = {
            email: props.email ?? undefined,
            username: props.username ?? undefined,
            password: props.password ?? undefined,
        };

        try {
            const { data } = await driver.post(AUTH_SERVICE_ROUTE.CREDENTIAL.UPDATE, input);

            return {
                code: 200,
                raw: data,
            };
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                const response = error.response;
                const data = response.data;

                if (response.status === 400) {
                    return {
                        code: 400,
                        raw: convertErrorMessageListToObject(Object.keys(input), data.message),
                    };
                }

                if (data.id) {
                    return {
                        code: response.status,
                        raw: data,
                    };
                }
            }

            return {
                code: 500,
                raw: {},
            };
        }
    },
    async updateCredentialVerifyOTP(props: {
        token: string;
        otpCode: string;
        driver?: AxiosInstance;
    }) {
        const driver = props.driver || axios;
        const input = {
            token: props.token,
            otpCode: props.otpCode,
        };

        try {
            const { data } = await driver.post(
                AUTH_SERVICE_ROUTE.CREDENTIAL.UPDATE_VERIFY_OTP,
                input,
            );

            return {
                code: 200,
                raw: data,
            };
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                const response = error.response;
                const data = response.data;

                if (response.status === 400) {
                    return {
                        code: 400,
                        raw: convertErrorMessageListToObject(Object.keys(input), data.message),
                    };
                }

                if (data.id) {
                    return {
                        code: response.status,
                        raw: data,
                    };
                }
            }

            return {
                code: 500,
                raw: {},
            };
        }
    },
};
