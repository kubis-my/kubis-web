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
    isOtpExpired: boolean;
    countdownFormatted: string;
    onOtpChange: (value: string) => void;
    onVerify: () => void;
    onBack: () => void;
};

export default function SignUpOtpStage({
    otp,
    formValidation,
    isVerifying,
    isOtpExpired,
    countdownFormatted,
    onOtpChange,
    onVerify,
    onBack,
}: Props) {
    return (
        <>
            <Field>
                <div className="flex items-center justify-between">
                    <FieldLabel htmlFor="otp-verification">Verification code</FieldLabel>
                    {!isOtpExpired && (
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
                {isOtpExpired ? (
                    <Button className="w-full" onClick={onBack}>
                        Start Over
                    </Button>
                ) : (
                    <>
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
                            Back to Sign Up
                        </Button>
                    </>
                )}
            </Field>
        </>
    );
}
