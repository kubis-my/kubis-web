import axios, { AxiosError, AxiosInstance } from "axios"
import { AUTH_SERVICE_ROUTE } from "../constant/auth-service"
import { convertErrorMessageListToObject } from "../utils/error-message"
import { generateCodeChallenge, generateCodeVerifier } from "../utils/pkce"

export const authClient = {
    async signIn(props: {
        identifier: string,
        password: string,
        clientId: string,
        redirectUri: string,
        scope?: string,
        state?: string,
        driver?: AxiosInstance
    }) {
        const driver = props.driver || axios
        const codeVerifier = generateCodeVerifier();
        const codeChallenge = await generateCodeChallenge(codeVerifier);
        const input = {
            identifier: props.identifier,
            password: props.password,
            clientId: props.clientId,
            redirectUri: props.redirectUri,
            scope: props.scope,
            state: props.state,
            codeChallenge
        }

        try {
            const { data } = await driver.post(AUTH_SERVICE_ROUTE.AUTH.SIGN_IN, input, {
                withCredentials: true
            })

            return {
                code: 200,
                raw: {
                    ...data,
                    verifier: codeVerifier
                }
            }
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                const response = error.response
                const data = response.data;

                if (response.status === 400) {
                    return {
                        code: 400,
                        raw: convertErrorMessageListToObject(Object.keys(input), data.message)
                    }
                }

                if (data.id) {
                    return {
                        code: response.status,
                        raw: data
                    }
                }
            }

            return {
                code: 500,
                raw: {}
            }
        }
    },
    async refresh(props: {
        refreshToken: string,
        driver?: AxiosInstance
    }) {
        const driver = props.driver || axios
        const input = { refreshToken: props.refreshToken }

        try {
            const { data } = await driver.post(AUTH_SERVICE_ROUTE.AUTH.REFRESH, input)

            return {
                code: 200,
                raw: data
            }
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                const response = error.response
                const data = response.data;

                if (response.status === 400) {
                    return {
                        code: 400,
                        raw: convertErrorMessageListToObject(Object.keys(input), data.message)
                    }
                }

                if (data.id) {
                    return {
                        code: response.status,
                        raw: data
                    }
                }
            }

            return {
                code: 500,
                raw: {}
            }
        }
    },
    async validate(props: {
        token: string,
        driver?: AxiosInstance
    }) {
        const driver = props.driver || axios
        const input = { token: props.token }

        try {
            const { data } = await driver.post(AUTH_SERVICE_ROUTE.AUTH.VALIDATE, input)

            return {
                code: 200,
                raw: data
            }
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                const response = error.response
                const data = response.data;

                if (response.status === 400) {
                    return {
                        code: 400,
                        raw: convertErrorMessageListToObject(Object.keys(input), data.message)
                    }
                }

                if (data.id) {
                    return {
                        code: response.status,
                        raw: data
                    }
                }
            }

            return {
                code: 500,
                raw: {}
            }
        }
    },
    async exchangeCodeForTokens(props: {
        code: string
        clientId: string
        redirectUri: string
        codeVerifier: string
        driver?: AxiosInstance
    }) {
        const driver = props.driver || axios
        const input = {
            code: props.code,
            clientId: props.clientId,
            redirectUri: props.redirectUri,
            codeVerifier: props.codeVerifier,
            grantType: 'authorization_code'
        }

        try {
            const { data } = await driver.post(AUTH_SERVICE_ROUTE.OAUTH.EXCHANGE_TOKEN, input, {
                withCredentials: true
            });

            return {
                code: 200,
                raw: data
            }
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                const response = error.response
                const data = response.data;

                if (response.status === 400) {
                    return {
                        code: 400,
                        raw: convertErrorMessageListToObject(Object.keys(input), data.message)
                    }
                }

                if (data.id) {
                    return {
                        code: response.status,
                        raw: data
                    }
                }
            }

            return {
                code: 500,
                raw: {}
            }
        }
    }
}