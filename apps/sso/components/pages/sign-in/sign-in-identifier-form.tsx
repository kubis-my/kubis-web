'use client';

import { CardContent } from '@repo/shadcn-ui/components/card';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { errorDict } from '@/root/libs/dict/error-dict';
import { toast } from 'sonner';
import { MAIN_CLIENT_ID } from '@repo/commons/constant/client-id';
import { APP_NAME, MAIN_APP_BASE_URL } from '@repo/commons/constant/base';
import { authClient } from '@repo/commons/lib/auth-client';
import {
    getOrCreateDeviceId,
    setToken,
    SESSION_TOKEN_KEY,
} from '@repo/commons/utils/storage-helpers';
import { useSearchParams } from 'next/navigation';
import KubisSvg from '@repo/shadcn-ui/custom-components/kubis-svg';
import { useCountdown } from '@repo/shadcn-ui/hooks/use-countdown';
import SignInCredentialsStage from './sign-in-credentials-stage';
import SignInOtpStage from './sign-in-otp-stage';

type SignInStage = 'CREDENTIAL' | 'OTP';

const FALLBACK_OTP_EXPIRE_MS = 5 * 60 * 1_000;

export default function SignInWithIdentifierForm() {
    const [stage, setStage] = useState<SignInStage>('CREDENTIAL');
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [otpEmail, setOtpEmail] = useState('');
    const [otpToken, setOtpToken] = useState('');
    const [codeVerifier, setCodeVerifier] = useState('');
    const [clientId, setClientId] = useState('');
    const [redirectUri, setRedirectUri] = useState('');
    const [otpExpiresAt, setOtpExpiresAt] = useState<number>(Date.now());
    const [formValidation, setFormValidation] = useState<Record<string, string[]>>({});
    const [isSignIn, setIsSignIn] = useState(false);
    const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
    const [isResendingOtp, setIsResendingOtp] = useState(false);
    const { expired: isOtpExpired, formatted: countdownFormatted } = useCountdown(otpExpiresAt);

    const param = useSearchParams();

    const parseOtpExpiredAt = (expiredAt: unknown) => {
        if (typeof expiredAt === 'number') {
            return expiredAt;
        }
        if (typeof expiredAt === 'string') {
            const parsed = Date.parse(expiredAt);
            if (!Number.isNaN(parsed)) {
                return parsed;
            }
        }
        return Date.now() + FALLBACK_OTP_EXPIRE_MS;
    };

    const redirectToClient = (redirectUrl: string, verifier?: string) => {
        const finalRedirectUrl = new URL(redirectUrl);

        if (verifier) {
            finalRedirectUrl.hash = `verifier=${verifier}`;
        }

        window.location.href = finalRedirectUrl.toString();
    };

    const signInHandler = useCallback(async () => {
        setFormValidation({});
        setIsSignIn(true);

        try {
            const { code, raw } = await authClient.signIn({
                identifier,
                password,
                clientId,
                redirectUri,
                deviceId: getOrCreateDeviceId() ?? undefined,
            });

            if (code === 200) {
                if (raw.twoFactorEnabled === true) {
                    setOtpToken(raw.token ?? '');
                    setCodeVerifier(raw.verifier ?? '');
                    setStage('OTP');
                    setOtp('');
                    setOtpEmail(raw.email || '');
                    setOtpExpiresAt(parseOtpExpiredAt(raw.expiredAt));
                } else if (raw.sessionToken) {
                    setToken(SESSION_TOKEN_KEY, raw.sessionToken);
                    redirectToClient(raw.redirectUrl, raw.verifier);
                }
            } else if (code === 400 && raw && typeof raw === 'object') {
                setFormValidation(raw as Record<string, string[]>);
            } else if (raw && 'id' in raw) {
                const statusKey = (raw as { id: string }).id;

                if (statusKey in errorDict) {
                    toast.error(errorDict[statusKey as keyof typeof errorDict], {
                        position: 'top-center',
                    });
                } else {
                    toast.error(
                        'An unexpected error occurred. Please contact our support team for assistance.',
                        { position: 'top-center' },
                    );
                }
            } else {
                toast.error(
                    'An unexpected error occurred. Please contact our support team for assistance.',
                    { position: 'top-center' },
                );
            }
        } catch (error) {
            console.error('Sign in error:', error);
            toast.error(
                'An unexpected error occurred. Please contact our support team for assistance.',
                { position: 'top-center' },
            );
        }

        setIsSignIn(false);
    }, [identifier, password, clientId, redirectUri]);

    const verifyOtpHandler = async () => {
        setFormValidation({});
        setIsVerifyingOtp(true);

        try {
            const { code, raw } = await authClient.verifyOTP({ token: otpToken, otpCode: otp });

            if (code === 200 && raw.sessionToken) {
                setToken(SESSION_TOKEN_KEY, raw.sessionToken);
                redirectToClient(raw.redirectUrl, codeVerifier);
                return;
            }

            if ((code === 400 || code === 403) && raw && 'id' in raw) {
                const statusKey = (raw as { id: string }).id;
                if (statusKey in errorDict) {
                    toast.error(errorDict[statusKey as keyof typeof errorDict], {
                        position: 'top-center',
                    });
                    return;
                }
            }

            toast.error(
                'An unexpected error occurred. Please contact our support team for assistance.',
                { position: 'top-center' },
            );
        } catch (error) {
            console.error('OTP verify error:', error);
            toast.error(
                'An unexpected error occurred. Please contact our support team for assistance.',
                { position: 'top-center' },
            );
        } finally {
            setIsVerifyingOtp(false);
        }
    };

    const resendOtpHandler = async () => {
        setIsResendingOtp(true);

        try {
            const { code, raw } = await authClient.resendOTP({ existingToken: otpToken });

            if (code === 200 && raw.token) {
                setOtpToken(raw.token);
                setOtp('');
                setOtpEmail(raw.email || otpEmail);
                setOtpExpiresAt(parseOtpExpiredAt(raw.expiredAt));
                toast.success('Verification code resent successfully', { position: 'top-center' });
                return;
            }

            if (raw && 'id' in raw) {
                const statusKey = (raw as { id: string }).id;
                if (statusKey in errorDict) {
                    toast.error(errorDict[statusKey as keyof typeof errorDict], {
                        position: 'top-center',
                    });
                    return;
                }
            }

            toast.error(
                'An unexpected error occurred. Please contact our support team for assistance.',
                { position: 'top-center' },
            );
        } catch (error) {
            console.error('Resend OTP error:', error);
            toast.error(
                'An unexpected error occurred. Please contact our support team for assistance.',
                { position: 'top-center' },
            );
        } finally {
            setIsResendingOtp(false);
        }
    };

    useEffect(() => {
        setClientId(param.get('client_id') || MAIN_CLIENT_ID);
        setRedirectUri(param.get('redirect_uri') || `${MAIN_APP_BASE_URL}/my-account`);
    }, [param]);

    return (
        <CardContent className="grid h-[500px] p-0 md:grid-cols-2">
            <div className="relative hidden items-center justify-center border-r md:flex">
                <div className="relative aspect-square w-full max-w-sm">
                    <Image
                        priority
                        src="/sign-in.svg"
                        alt="Sign in illustration"
                        fill
                        className="object-contain dark:brightness-[0.2] dark:grayscale"
                    />
                </div>
            </div>
            <div className="p-6 md:p-8">
                <div className="flex flex-col gap-6">
                    <a href="#" className="flex items-center gap-2 self-center font-medium">
                        <div className="text-primary-foreground flex items-center justify-center rounded-md">
                            <KubisSvg className="size-15" />
                        </div>
                    </a>
                    <div className="flex flex-col items-center text-center">
                        {stage === 'CREDENTIAL' ? (
                            <>
                                <h1 className="text-xl font-bold">Welcome back</h1>
                                <p className="text-muted-foreground text-balance">
                                    Login to your {APP_NAME} account
                                </p>
                            </>
                        ) : (
                            <>
                                <h1 className="text-xl font-bold">Verify your login</h1>
                                <p className="text-muted-foreground text-sm">
                                    Enter the verification code we sent to your email address:{' '}
                                    <span className="font-medium">{otpEmail}</span>.
                                </p>
                            </>
                        )}
                    </div>
                    {stage === 'CREDENTIAL' ? (
                        <>
                            <SignInCredentialsStage
                                identifier={identifier}
                                password={password}
                                formValidation={formValidation}
                                isSubmitting={isSignIn}
                                onIdentifierChange={setIdentifier}
                                onPasswordChange={setPassword}
                                onSubmit={signInHandler}
                            />
                        </>
                    ) : (
                        <SignInOtpStage
                            otp={otp}
                            formValidation={formValidation}
                            isVerifying={isVerifyingOtp}
                            isResending={isResendingOtp}
                            isOtpExpired={isOtpExpired}
                            countdownFormatted={countdownFormatted}
                            onOtpChange={setOtp}
                            onVerify={verifyOtpHandler}
                            onResend={resendOtpHandler}
                            onBack={() => {
                                setStage('CREDENTIAL');
                                setOtp('');
                                setFormValidation({});
                            }}
                        />
                    )}
                </div>
            </div>
        </CardContent>
    );
}
