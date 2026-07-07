'use client';

import { useEffect, useState } from 'react';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '../components/alert-dialog';
import { Button } from '../components/button';
import { Checkbox } from '../components/checkbox';
import { Label } from '../components/label';
import { authClient } from '@repo/commons/lib/auth-client';
import { getToken, clearAllTokens, REFRESH_TOKEN_KEY } from '@repo/commons/utils/storage-helpers';

export const OPEN_LOGOUT_CONFIRM_EVENT = 'open-logout-confirm-dialog';

export function openLogoutConfirmDialog() {
    window.dispatchEvent(new CustomEvent(OPEN_LOGOUT_CONFIRM_EVENT));
}

export default function LogoutConfirmDialog({ redirectTo }: { redirectTo: string }) {
    const [open, setOpen] = useState(false);
    const [untrustThisDevice, setUntrustThisDevice] = useState(false);
    const [isSigningOut, setIsSigningOut] = useState(false);

    useEffect(() => {
        const handler = () => setOpen(true);
        window.addEventListener(OPEN_LOGOUT_CONFIRM_EVENT, handler);
        return () => window.removeEventListener(OPEN_LOGOUT_CONFIRM_EVENT, handler);
    }, []);

    const handleConfirm = async () => {
        setIsSigningOut(true);

        try {
            const refreshToken = getToken(REFRESH_TOKEN_KEY);
            if (refreshToken) {
                await authClient.signOut({ refreshToken, untrustThisDevice });
            }
        } finally {
            clearAllTokens();
            window.location.href = redirectTo;
        }
    };

    return (
        <AlertDialog
            open={open}
            onOpenChange={(value) => {
                if (isSigningOut) return;

                setOpen(value);

                if (!value) {
                    setUntrustThisDevice(false);
                }
            }}
        >
            <AlertDialogContent className="max-w-md">
                <AlertDialogHeader>
                    <AlertDialogTitle>Log out?</AlertDialogTitle>
                    <AlertDialogDescription>
                        You&apos;ll be signed out of Kubis on this browser.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex items-start gap-3 rounded-xl border bg-muted/30 p-4">
                    <Checkbox
                        id="untrust-this-device"
                        checked={untrustThisDevice}
                        onCheckedChange={(value) => setUntrustThisDevice(value === true)}
                        disabled={isSigningOut}
                        className="mt-0.5"
                    />
                    <Label
                        htmlFor="untrust-this-device"
                        className="flex flex-col items-start gap-1 font-normal"
                    >
                        <span className="text-sm font-medium text-foreground">Remove trusted device</span>
                        <span className="text-sm text-muted-foreground">
                            Require a verification code the next time you sign in here.
                        </span>
                    </Label>
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isSigningOut}>Cancel</AlertDialogCancel>
                    <Button variant="destructive" onClick={handleConfirm} disabled={isSigningOut}>
                        {isSigningOut ? 'Logging out...' : 'Log out'}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
