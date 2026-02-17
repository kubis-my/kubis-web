'use client';

import { Button } from '@repo/shadcn-ui/components/button';
import { Input } from '@repo/shadcn-ui/components/input';
import { Label } from '@repo/shadcn-ui/components/label';
import ShowErrorText from '@repo/shadcn-ui/custom-components/show-error-text';
import { Loader2Icon } from 'lucide-react';
import Link from 'next/link';

type Props = {
    username: string;
    email: string;
    password: string;
    formValidation: Record<string, string[]>;
    isSubmitting: boolean;
    onUsernameChange: (value: string) => void;
    onEmailChange: (value: string) => void;
    onPasswordChange: (value: string) => void;
    onSubmit: () => void;
};

export default function SignUpForm({
    username,
    email,
    password,
    formValidation,
    isSubmitting,
    onUsernameChange,
    onEmailChange,
    onPasswordChange,
    onSubmit,
}: Props) {
    return (
        <>
            <div className="grid gap-3">
                <Label>
                    Username <span className="text-muted-foreground text-xs">(Optional)</span>
                </Label>
                <Input
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => onUsernameChange(e.target.value)}
                />
                <ShowErrorText error={formValidation} field="username" />
            </div>

            <div className="grid gap-3">
                <Label>Email</Label>
                <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => onEmailChange(e.target.value)}
                />
                <ShowErrorText error={formValidation} field="email" />
            </div>

            <div className="grid gap-3">
                <Label>Password</Label>
                <Input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => onPasswordChange(e.target.value)}
                />
                <ShowErrorText error={formValidation} field="password" />
            </div>

            <Button type="button" className="w-full" onClick={onSubmit} disabled={isSubmitting}>
                {!isSubmitting ? (
                    <>Sign Up</>
                ) : (
                    <>
                        <Loader2Icon className="animate-spin" />
                        Please wait
                    </>
                )}
            </Button>

            <div className="text-center text-sm">
                Already have an account?{' '}
                <Link href={'/sign-in'} className="underline underline-offset-4">
                    Sign in
                </Link>
            </div>
        </>
    );
}
