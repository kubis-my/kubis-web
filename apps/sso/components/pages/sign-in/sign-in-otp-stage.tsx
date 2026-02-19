'use client';

import { Button } from '@repo/shadcn-ui/components/button';
import { Field, FieldLabel } from '@repo/shadcn-ui/components/field';
import { Input } from '@repo/shadcn-ui/components/input';
import ShowErrorText from '@repo/shadcn-ui/custom-components/show-error-text';
import { Loader2Icon } from 'lucide-react';

type Props = {
    otp: string;
    formValidation: Record<string, string[]>;
    isVerifying: boolean;
    isResending: boolean;
    isOtpExpired: boolean;
    countdownFormatted: string;
    onOtpChange: (value: string) => void;
    onVerify: () => void;
    onResend: () => void;
    onBack: () => void;
};

export default function SignInOtpStage({
    otp,
    formValidation,
    isVerifying,
    isResending,
    isOtpExpired,
    countdownFormatted,
    onOtpChange,
    onVerify,
    onResend,
    onBack,
}: Props) {
    return (
        <>
            <Field>
                <div className="flex items-center justify-between">
                    <FieldLabel htmlFor="otp-verification">Verification code</FieldLabel>
                    {isOtpExpired ? (
                        <button
                            type="button"
                            className="ml-auto text-xs underline-offset-2 hover:underline disabled:no-underline disabled:opacity-50"
                            onClick={onResend}
                            disabled={isResending}
                        >
                            {isResending ? 'Sending...' : 'Resend Code'}
                        </button>
                    ) : (
                        <span className="text-muted-foreground text-xs">{countdownFormatted}</span>
                    )}
                </div>
                <Input
                    id="otp-verification"
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => onOtpChange(e.target.value)}
                    autoComplete="off"
                    type="password"
                    disabled={isOtpExpired}
                />
                <ShowErrorText error={formValidation} field="code" />
            </Field>
            <Field>
                <Button
                    className="w-full"
                    onClick={onVerify}
                    disabled={isVerifying || otp.length < 6}
                >
                    {isVerifying ? (
                        <>
                            <Loader2Icon className="animate-spin" />
                            Verifying
                        </>
                    ) : (
                        'Verify'
                    )}
                </Button>
                <Button variant="outline" className="w-full" onClick={onBack}>
                    Back to Sign In
                </Button>
            </Field>
        </>
    );
}
