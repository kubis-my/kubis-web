'use client';

import { Button } from '@repo/shadcn-ui/components/button';
import { Input } from '@repo/shadcn-ui/components/input';
import { Label } from '@repo/shadcn-ui/components/label';
import ShowErrorText from '@repo/shadcn-ui/custom-components/show-error-text';
import { Loader2Icon } from 'lucide-react';
import Link from 'next/link';

type Props = {
    email: string;
    password: string;
    formValidation: Record<string, string[]>;
    isSubmitting: boolean;
    onEmailChange: (value: string) => void;
    onPasswordChange: (value: string) => void;
    onSubmit: () => void;
};

export default function ForgotPasswordForm({
    email,
    password,
    formValidation,
    isSubmitting,
    onEmailChange,
    onPasswordChange,
    onSubmit,
}: Props) {
    return (
        <>
            <div className="grid gap-3">
                <Label>Email</Label>
                <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => onEmailChange(e.target.value)}
                />
                <ShowErrorText className='-mt-2!' error={formValidation} field="email" />
            </div>

            <div className="grid gap-3">
                <Label>New Password</Label>
                <Input
                    type="password"
                    placeholder="Enter your new password"
                    value={password}
                    onChange={(e) => onPasswordChange(e.target.value)}
                />
                <ShowErrorText className='-mt-2!' error={formValidation} field="newPassword" />
            </div>

            <Button type="button" className="w-full" onClick={onSubmit} disabled={isSubmitting}>
                {!isSubmitting ? (
                    <>Reset Password</>
                ) : (
                    <>
                        <Loader2Icon className="animate-spin" />
                        Please wait
                    </>
                )}
            </Button>

            <div className="text-center text-xs">
                Remember your password?{' '}
                <Link href={'/sign-in'} className="underline underline-offset-4">
                    Sign in
                </Link>
            </div>
        </>
    );
}
