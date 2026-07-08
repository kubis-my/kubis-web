'use client';

import QRCode from 'react-qr-code';
import { Button } from '@/shadcn/components/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/shadcn/components/dialog';

interface TelegramTwoFactorDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    setupLink: string;
    isSetupExpired: boolean;
    countdownFormatted: string;
    onCancel: () => void;
    onRegenerate: () => void;
}

export default function TelegramTwoFactorDialog({
    open,
    onOpenChange,
    setupLink,
    isSetupExpired,
    countdownFormatted,
    onCancel,
    onRegenerate,
}: TelegramTwoFactorDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="sm:max-w-md"
                showCloseButton={false}
                onInteractOutside={(event) => event.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle className="text-base">Enable Telegram 2FA</DialogTitle>
                    <DialogDescription>
                        To link your account, open our Telegram bot and tap Start. Scan the QR
                        code with your phone or open Telegram on this device.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col items-center gap-3 py-2">
                    {setupLink && (
                        <div className="rounded-lg border bg-white p-4">
                            <QRCode value={setupLink} size={180} />
                        </div>
                    )}

                    {isSetupExpired ? (
                        <div className="space-y-1 text-center">
                            <p className="text-sm font-medium">This link has expired.</p>
                            <p className="text-muted-foreground text-xs">
                                For your security, Telegram linking links are only valid for 10
                                minutes.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-1 text-center">
                            <p className="text-muted-foreground text-xs">
                                Waiting for Telegram confirmation...
                            </p>
                            <p className="text-muted-foreground/70 text-xs">
                                Link expires in {countdownFormatted}
                            </p>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                    {isSetupExpired ? (
                        <Button type="button" onClick={onRegenerate}>
                            Generate new link
                        </Button>
                    ) : (
                        <Button type="button" asChild>
                            <a href={setupLink} target="_blank" rel="noopener noreferrer">
                                Open Telegram
                            </a>
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
