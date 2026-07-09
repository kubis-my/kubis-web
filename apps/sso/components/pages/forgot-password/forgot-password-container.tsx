'use client';

import { CardContent } from '@repo/shadcn-ui/components/card';
import KubisSvg from '@repo/shadcn-ui/custom-components/kubis-svg';
import { useCountdown } from '@repo/shadcn-ui/hooks/use-countdown';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { errorDict } from '@/root/libs/dict/error-dict';
import ForgotPasswordForm from './forgot-password-form';
import ForgotPasswordOtpStage from './forgot-password-otp-stage';
import { authClient } from '@repo/commons/lib/auth-client';

type ForgotPasswordStage = 'FORM' | 'OTP';

const FALLBACK_OTP_EXPIRE_MS = 5 * 60 * 1_000;

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

export default function ForgotPasswordContainer() {
    const [stage, setStage] = useState<ForgotPasswordStage>('FORM');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [otpEmail, setOtpEmail] = useState('');
    const [otpChannel, setOtpChannel] = useState<'EMAIL' | 'TELEGRAM'>('EMAIL');
    const [otpExpiresAt, setOtpExpiresAt] = useState<number>(Date.now() + FALLBACK_OTP_EXPIRE_MS);
    const [formValidation, setFormValidation] = useState<Record<string, string[]>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
    const [otpToken, setOtpToken] = useState('');
    const { expired: isOtpExpired, formatted: countdownFormatted } = useCountdown(
        otpExpiresAt,
        (isExpired) => {
            if (isExpired && stage === 'OTP') {
                toast.error('Your verification code has expired. Please start over.', {
                    position: 'top-center',
                });
            }
        },
    );

    const submitHandler = useCallback(async () => {
        setFormValidation({});
        setIsSubmitting(true);

        try {
            const { code, raw } = await authClient.forgotPassword({ email, newPassword: password });

            if (code === 200 && raw.token) {
                setOtpToken(raw.token);
                setStage('OTP');
                setOtp('');
                setOtpChannel(raw.channel === 'TELEGRAM' ? 'TELEGRAM' : 'EMAIL');
                setOtpEmail(raw.email || email);
                setOtpExpiresAt(parseOtpExpiredAt(raw.expiredAt));
                return;
            }

            if ((code === 400 || code === 404) && raw) {
                const errorId = (raw as { id?: string }).id;

                if (errorId === 'CREDENTIAL_NOT_FOUND') {
                    setFormValidation({ email: ['No account found with this email address'] });
                    return;
                }

                if (errorId && errorId in errorDict) {
                    toast.error(errorDict[errorId as keyof typeof errorDict], {
                        position: 'top-center',
                    });
                    return;
                }

                if (typeof raw === 'object' && !errorId) {
                    setFormValidation(raw as Record<string, string[]>);
                    return;
                }
            }

            toast.error(
                'An unexpected error occurred. Please contact our support team for assistance.',
                { position: 'top-center' },
            );
        } catch (error) {
            console.error('Forgot password error:', error);
            toast.error(
                'An unexpected error occurred. Please contact our support team for assistance.',
                { position: 'top-center' },
            );
        } finally {
            setIsSubmitting(false);
        }
    }, [email, password]);

    const verifyOtpHandler = async () => {
        setFormValidation({});
        setIsVerifyingOtp(true);

        try {
            const { code, raw } = await authClient.forgotPasswordVerifyOTP({
                token: otpToken,
                otpCode: otp,
            });

            if (code === 200) {
                toast.success('Your password has been reset successfully.', {
                    position: 'top-center',
                });
                window.location.href = '/sign-in';
                return;
            }

            if ((code === 400 || code === 403) && raw) {
                const errorId = (raw as { id?: string }).id;
                if (errorId && errorId in errorDict) {
                    toast.error(errorDict[errorId as keyof typeof errorDict], {
                        position: 'top-center',
                    });
                    return;
                }
                setFormValidation(raw as Record<string, string[]>);
                return;
            }

            toast.error(
                'An unexpected error occurred. Please contact our support team for assistance.',
                { position: 'top-center' },
            );
        } catch (error) {
            console.error('Forgot password OTP verify error:', error);
            toast.error(
                'An unexpected error occurred. Please contact our support team for assistance.',
                { position: 'top-center' },
            );
        } finally {
            setIsVerifyingOtp(false);
        }
    };

    return (
        <CardContent className="grid min-h-[500px] p-0 md:grid-cols-2">
            <div className="relative hidden items-center justify-center border-r md:flex">
                <div className="relative aspect-square w-full max-w-sm">
                    <Image
                        priority
                        src="/verify-otp.svg"
                        alt="Forgot password illustration"
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
                        {stage === 'FORM' ? (
                            <>
                                <h1 className="text-xl font-bold">Reset your password</h1>
                                <p className="text-muted-foreground text-balance">
                                    Enter your email and set a new password
                                </p>
                            </>
                        ) : (
                            <>
                                <h1 className="text-xl font-bold">
                                    {otpChannel === 'TELEGRAM'
                                        ? 'Verify your identity'
                                        : 'Verify your email'}
                                </h1>
                                {otpChannel === 'TELEGRAM' ? (
                                    <p className="text-muted-foreground text-sm">
                                        Enter the verification code we sent to your{' '}
                                        <span className="font-medium">Telegram</span> account.
                                    </p>
                                ) : (
                                    <p className="text-muted-foreground text-sm">
                                        Enter the verification code we sent to your email address:{' '}
                                        <span className="font-medium">{otpEmail}</span>.
                                    </p>
                                )}
                            </>
                        )}
                    </div>
                    {stage === 'FORM' ? (
                        <ForgotPasswordForm
                            email={email}
                            password={password}
                            formValidation={formValidation}
                            isSubmitting={isSubmitting}
                            onEmailChange={setEmail}
                            onPasswordChange={setPassword}
                            onSubmit={submitHandler}
                        />
                    ) : (
                        <ForgotPasswordOtpStage
                            otp={otp}
                            formValidation={formValidation}
                            isVerifying={isVerifyingOtp}
                            isOtpExpired={isOtpExpired}
                            countdownFormatted={countdownFormatted}
                            onOtpChange={setOtp}
                            onVerify={verifyOtpHandler}
                            onBack={() => {
                                setStage('FORM');
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
