'use client';

import { Button } from '@repo/shadcn-ui/components/button';
import { Input } from '@repo/shadcn-ui/components/input';
import { Label } from '@repo/shadcn-ui/components/label';
import ShowErrorText from '@repo/shadcn-ui/custom-components/show-error-text';
import { Loader2Icon } from 'lucide-react';
import Link from 'next/link';

type Props = {
    identifier: string;
    password: string;
    formValidation: Record<string, string[]>;
    isSubmitting: boolean;
    onIdentifierChange: (value: string) => void;
    onPasswordChange: (value: string) => void;
    onSubmit: () => void;
};

export default function SignInCredentialsStage({
    identifier,
    password,
    formValidation,
    isSubmitting,
    onIdentifierChange,
    onPasswordChange,
    onSubmit,
}: Props) {
    return (
        <>
            <div className="grid gap-3">
                <Label>Identifier</Label>
                <Input
                    placeholder="Enter your username or email"
                    value={identifier}
                    onChange={(e) => onIdentifierChange(e.target.value)}
                />
                <ShowErrorText className='-mt-2!' error={formValidation} field="identifier" />
            </div>
            <div className="grid gap-3">
                <div className="flex items-center">
                    <Label>Password</Label>
                    <Link
                        href="/forgot-password"
                        className="ml-auto text-xs underline-offset-2 hover:underline"
                    >
                        Forgot your password?
                    </Link>
                </div>
                <Input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => onPasswordChange(e.target.value)}
                />
                <ShowErrorText className='-mt-2!' error={formValidation} field="password" />
            </div>
            <Button type="button" className="w-full" onClick={onSubmit} disabled={isSubmitting}>
                {!isSubmitting ? (
                    <>Login</>
                ) : (
                    <>
                        <Loader2Icon className="animate-spin" />
                        Please wait
                    </>
                )}
            </Button>
            <div className="text-center text-xs">
                Don&apos;t have an account?{' '}
                <Link href={'/sign-up'} className="underline underline-offset-4">
                    Register
                </Link>
            </div>
        </>
    );
}
