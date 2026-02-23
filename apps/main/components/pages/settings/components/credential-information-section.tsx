'use client';

import { useRef, useState } from 'react';
import { getCsrfHeaders } from '@repo/commons/utils/csrf-client';
import { useFormDirty } from '@repo/commons/hooks/use-form-dirty';
import { Button } from '@/shadcn/components/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/shadcn/components/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/shadcn/components/dialog';
import { Input } from '@/shadcn/components/input';
import { Label } from '@/shadcn/components/label';
import { Separator } from '@/shadcn/components/separator';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/shadcn/components/sheet';
import { Skeleton } from '@/shadcn/components/skeleton';
import { TabsContent } from '@/shadcn/components/tabs';
import { useCountdown } from '@/shadcn/hooks/use-countdown';
import { useIsMobile } from '@/shadcn/hooks/use-mobile';
import ShowErrorText from '@/shadcn/custom-components/show-error-text';
import { IconLock, IconMail, IconUser } from '@tabler/icons-react';
import { useApolloClient } from '@apollo/client/react';
import { toast } from 'sonner';
import { useProfile } from '../profile-container';
import { errorDict } from '@/root/libs/dict/error-dict';

type CredentialFormData = {
    email: string;
    username: string;
    password: string;
};

const initialFormData: CredentialFormData = {
    email: '',
    username: '',
    password: '',
};

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

export default function CredentialInformationSection() {
    const isMobile = useIsMobile();
    const client = useApolloClient();
    const { credential, isFetchingCredential } = useProfile();
    const [open, setOpen] = useState(false);
    const [openOtpDialog, setOpenOtpDialog] = useState(false);
    const [formData, setFormData] = useState<CredentialFormData>(initialFormData);
    const [formValidation, setFormValidation] = useState<Record<string, string[]>>({});
    const [otpValidation, setOtpValidation] = useState<Record<string, string[]>>({});
    const [verificationToken, setVerificationToken] = useState('');
    const [maskedOtpEmail, setMaskedOtpEmail] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [otpExpiresAt, setOtpExpiresAt] = useState<number>(Date.now() + FALLBACK_OTP_EXPIRE_MS);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
    const { isDirty, setOriginal } = useFormDirty(formData);
    const sheetTitleRef = useRef<HTMLHeadingElement>(null);
    const { expired: isOtpExpired, formatted: countdownFormatted } = useCountdown(
        otpExpiresAt,
        (isExpired) => {
            if (isExpired && openOtpDialog) {
                toast.error('Your verification code has expired. Please try again.', {
                    position: 'top-center',
                });
                setOpenOtpDialog(false);
                setOtpValidation({});
                setVerificationToken('');
                setMaskedOtpEmail('');
                setOtpCode('');
            }
        },
    );

    const resetForm = () => {
        const data = {
            email: credential?.email ?? '',
            username: credential?.username ?? '',
            password: '',
        };

        setFormValidation({});
        setOtpValidation({});
        setVerificationToken('');
        setMaskedOtpEmail('');
        setOtpCode('');
        setOtpExpiresAt(Date.now() + FALLBACK_OTP_EXPIRE_MS);
        setFormData(data);
        setOriginal(data);
    };

    const refreshProfileData = async () => {
        await client.refetchQueries({
            include: ['GetCredential', 'GetAuthUser'],
        });
    };

    const submitCredentialUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsSubmitting(true);
        setFormValidation({});

        try {
            const payload: Record<string, string | null> = {};
            const currentEmail = credential?.email ?? '';
            const currentUsername = credential?.username ?? '';

            if (formData.email !== currentEmail) {
                payload.email = formData.email || null;
            }

            if (formData.username !== currentUsername) {
                payload.username = formData.username || null;
            }

            if (formData.password) {
                payload.password = formData.password;
            }

            if (Object.keys(payload).length === 0) {
                toast.info('No changes to update.', {
                    position: 'top-center',
                });
                return;
            }

            const response = await fetch('/api/auth/credential/update', {
                method: 'POST',
                headers: getCsrfHeaders({
                    'Content-Type': 'application/json',
                }),
                credentials: 'include',
                body: JSON.stringify(payload),
            });

            const raw = await response.json();

            if (response.ok && raw.success) {
                const token = raw.data?.token as string | undefined;

                if (token) {
                    setVerificationToken(token);
                    setMaskedOtpEmail(raw.data?.email ?? '');
                    setOtpValidation({});
                    setOtpCode('');
                    setOtpExpiresAt(parseOtpExpiredAt(raw.data?.expiredAt));
                    setOpen(false);
                    setOpenOtpDialog(true);

                    toast.success('Verification code sent to your email.', {
                        position: 'top-center',
                    });
                    return;
                }

                await refreshProfileData();
                setOpen(false);
                toast.success('Credential updated successfully.', {
                    position: 'top-center',
                });
                return;
            }

            if (response.status === 400 && raw.details && typeof raw.details === 'object') {
                setFormValidation(raw.details);
                return;
            }

            toast.error('Failed to update credential. Please try again.', {
                position: 'top-center',
            });
        } catch (error) {
            console.error('Credential update error:', error);
            toast.error('Failed to update credential. Please try again.', {
                position: 'top-center',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const submitOtpVerification = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!verificationToken) {
            toast.error('Verification session expired. Please try again.', {
                position: 'top-center',
            });
            setOpenOtpDialog(false);
            return;
        }

        setIsVerifyingOtp(true);
        setOtpValidation({});

        try {
            const response = await fetch('/api/auth/credential/update/verify-otp', {
                method: 'POST',
                headers: getCsrfHeaders({
                    'Content-Type': 'application/json',
                }),
                credentials: 'include',
                body: JSON.stringify({
                    token: verificationToken,
                    otpCode,
                }),
            });

            const raw = await response.json();

            if (response.ok && raw.success) {
                setOpenOtpDialog(false);
                setVerificationToken('');
                setMaskedOtpEmail('');
                setOtpCode('');

                await refreshProfileData();

                toast.success('Credential updated successfully.', {
                    position: 'top-center',
                });
                return;
            }

            if (response.status === 400 && raw.details) {
                setFormValidation(raw.details);
                return;
            }

            if (raw?.details?.id) {
                const statusKey = raw.details.id;
                if (statusKey in errorDict) {
                    toast.error(errorDict[statusKey as keyof typeof errorDict], {
                        position: 'top-center',
                    });
                    return;
                }
            }

            toast.error('Failed to verify code. Please try again.', {
                position: 'top-center',
            });
        } catch (error) {
            console.error('Credential OTP verify error:', error);
            toast.error('Failed to verify code. Please try again.', {
                position: 'top-center',
            });
        } finally {
            setIsVerifyingOtp(false);
        }
    };

    if (isFetchingCredential)
        return (
            <TabsContent value="credential" className="flex-1">
                <Skeleton className="h-full rounded-xl" />
            </TabsContent>
        );

    return (
        <TabsContent value="credential" className="space-y-4">
            <Sheet
                open={open}
                onOpenChange={(isOpen) => {
                    setOpen(isOpen);

                    if (isOpen) {
                        resetForm();
                    }
                }}
            >
                <SheetTrigger asChild>
                    <Card className="@container/card cursor-pointer">
                        <CardHeader>
                            <CardTitle className="font-semibold">Email & Password</CardTitle>
                            <CardDescription className="text-xs">
                                Click to update your credentials
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-col items-start gap-1.5 text-sm">
                            <div className="flex items-center justify-between border-b px-1 py-2">
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <IconMail className="text-primary size-3.5 shrink-0" /> Email
                                </div>
                                <div className="text-muted-foreground text-xs">
                                    {credential?.email ?? '-'}
                                </div>
                            </div>
                            <div className="flex items-center justify-between border-b px-1 py-2">
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <IconUser className="size-3.5 shrink-0" /> Username
                                </div>
                                <div className="text-muted-foreground text-xs">
                                    {credential?.username ?? '-'}
                                </div>
                            </div>
                            <div className="flex items-center justify-between px-1 py-2">
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <IconLock className="size-3.5 shrink-0" /> Password
                                </div>
                                <div className="text-muted-foreground text-xs">••••••••</div>
                            </div>
                        </CardContent>
                    </Card>
                </SheetTrigger>

                <SheetContent
                    side={isMobile ? 'bottom' : 'right'}
                    className={isMobile ? 'max-h-[85vh]' : 'max-w-md'}
                    onOpenAutoFocus={(e) => {
                        e.preventDefault();
                        sheetTitleRef.current?.focus();
                    }}
                >
                    <form onSubmit={submitCredentialUpdate} className="flex h-full flex-col">
                        <SheetHeader className="gap-1">
                            <SheetTitle ref={sheetTitleRef} tabIndex={-1} className="outline-none">
                                Update Credential
                            </SheetTitle>
                            <SheetDescription>
                                Update your email, username, or password.
                            </SheetDescription>
                            <Separator />
                        </SheetHeader>

                        <div className="flex-1 overflow-y-auto px-4 py-4">
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                email: e.target.value,
                                            }))
                                        }
                                        autoComplete="off"
                                        placeholder="Enter email"
                                    />
                                    <ShowErrorText error={formValidation} field="email" />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input
                                        id="username"
                                        value={formData.username}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                username: e.target.value,
                                            }))
                                        }
                                        autoComplete="off"
                                        placeholder="Enter username"
                                    />
                                    <ShowErrorText error={formValidation} field="username" />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="password">New Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                password: e.target.value,
                                            }))
                                        }
                                        autoComplete="new-password"
                                        placeholder="Enter new password"
                                    />
                                    <ShowErrorText error={formValidation} field="password" />
                                </div>
                            </div>
                        </div>

                        <SheetFooter className="mt-auto">
                            <Button type="submit" disabled={!isDirty || isSubmitting}>
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </Button>
                            <SheetClose asChild>
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </SheetClose>
                        </SheetFooter>
                    </form>
                </SheetContent>
            </Sheet>

            <Dialog
                open={openOtpDialog}
                onOpenChange={(isOpen) => {
                    setOpenOtpDialog(isOpen);

                    if (!isOpen) {
                        setOtpValidation({});
                        setVerificationToken('');
                        setMaskedOtpEmail('');
                        setOtpCode('');
                    }
                }}
            >
                <DialogContent
                    className="sm:max-w-md"
                    showCloseButton={false}
                    onEscapeKeyDown={(e) => e.preventDefault()}
                    onPointerDownOutside={(e) => e.preventDefault()}
                    onInteractOutside={(e) => e.preventDefault()}
                >
                    <form onSubmit={submitOtpVerification}>
                        <DialogHeader>
                            <DialogTitle>Verify OTP</DialogTitle>
                            <DialogDescription>
                                Enter the OTP code sent to your email{' '}
                                {maskedOtpEmail ? (
                                    <span className="font-medium">{maskedOtpEmail}</span>
                                ) : (
                                    'address'
                                )}{' '}
                                to confirm credential changes.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="py-4">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="otpCode">OTP Code</Label>
                                    {!isOtpExpired && (
                                        <span className="text-muted-foreground text-xs">
                                            {countdownFormatted}
                                        </span>
                                    )}
                                </div>
                                <Input
                                    id="otpCode"
                                    value={otpCode}
                                    onChange={(e) => setOtpCode(e.target.value)}
                                    placeholder="Enter OTP code"
                                    autoComplete="one-time-code"
                                    disabled={isOtpExpired}
                                />
                                <ShowErrorText error={otpValidation} field="otpCode" />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setOpenOtpDialog(false);
                                    setOtpValidation({});
                                    setVerificationToken('');
                                    setMaskedOtpEmail('');
                                    setOtpCode('');
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={otpCode.length < 6 || isVerifyingOtp || isOtpExpired}
                            >
                                {isVerifyingOtp ? 'Verifying...' : 'Verify'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </TabsContent>
    );
}
