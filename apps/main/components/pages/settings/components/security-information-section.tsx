'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useApolloClient } from '@apollo/client/react';
import { authClient } from '@repo/commons/lib/auth-client';
import { NotificationEvent } from '@repo/commons/constant/web-socket';
import { createAuthDriver } from '@repo/commons/utils/auth';
import { Badge } from '@/shadcn/components/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/shadcn/components/card';
import { Label } from '@/shadcn/components/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shadcn/components/select';
import { Skeleton } from '@/shadcn/components/skeleton';
import { Switch } from '@/shadcn/components/switch';
import { TabsContent } from '@/shadcn/components/tabs';
import { useCountdown } from '@/shadcn/hooks/use-countdown';
import { useSocket } from '@/shadcn/providers/socket-provider';
import { errorDict } from '@/root/libs/dict/error-dict';
import { useProfile } from '../profile-container';
import TelegramTwoFactorDialog from './telegram-2fa-dialog';
import { FALLBACK_SETUP_TELEGRAM_EXPIRE_MS } from '@/root/libs/constants';

export default function SecurityInformationSection() {
    const client = useApolloClient();
    const { credential, isFetchingCredential } = useProfile();
    const { on, off, isConnected } = useSocket();
    const [openSetupDialog, setOpenSetupDialog] = useState(false);
    const [setupLink, setSetupLink] = useState('');
    const [setupExpiresAt, setSetupExpiresAt] = useState<number>(Date.now());
    const [isRequestingSetup, setIsRequestingSetup] = useState(false);
    const [isDisabling, setIsDisabling] = useState(false);

    const telegram = credential?.twoFactor?.telegram;

    const { expired: isSetupExpired, formatted: countdownFormatted } = useCountdown(setupExpiresAt);

    useEffect(() => {
        if (!isConnected) return;

        const onTelegram2FAUpdated = (data: unknown) => {
            const isLinked = !!(data as { telegram?: unknown })?.telegram;

            setOpenSetupDialog(false);
            setSetupLink('');

            void client.refetchQueries({ include: ['GetCredential'] });

            toast.success(
                isLinked ? 'Telegram 2FA has been enabled.' : 'Telegram 2FA has been disabled.',
                { position: 'top-center' },
            );
        };

        on(NotificationEvent.TELEGRAM_2FA_UPDATED, onTelegram2FAUpdated);

        return () => {
            off(NotificationEvent.TELEGRAM_2FA_UPDATED, onTelegram2FAUpdated);
        };
    }, [isConnected, on, off, client]);

    const requestTelegramSetup = async () => {
        setIsRequestingSetup(true);

        try {
            const { code, raw } = await authClient.setupTelegram2FA({
                driver: createAuthDriver(),
            });

            if (code === 200 && 'link' in raw) {
                setSetupLink(raw.link);
                setSetupExpiresAt(
                    raw.expiredAt
                        ? Date.parse(raw.expiredAt)
                        : Date.now() + FALLBACK_SETUP_TELEGRAM_EXPIRE_MS,
                );
                setOpenSetupDialog(true);
                return;
            }

            const errorId = (raw as { id?: string }).id;
            if (errorId && errorId in errorDict) {
                toast.error(errorDict[errorId as keyof typeof errorDict], {
                    position: 'top-center',
                });
                return;
            }

            toast.error('Failed to start Telegram 2FA setup. Please try again.', {
                position: 'top-center',
            });
        } catch (error) {
            console.error('Telegram 2FA setup error:', error);
            toast.error('Failed to start Telegram 2FA setup. Please try again.', {
                position: 'top-center',
            });
        } finally {
            setIsRequestingSetup(false);
        }
    };

    const disableTelegram2FA = async () => {
        setIsDisabling(true);

        try {
            const { code, raw } = await authClient.disableTelegram2FA({
                driver: createAuthDriver(),
            });

            if (code === 200) {
                return;
            }

            const errorId = (raw as { id?: string }).id;
            if (errorId && errorId in errorDict) {
                toast.error(errorDict[errorId as keyof typeof errorDict], {
                    position: 'top-center',
                });
                return;
            }

            toast.error('Failed to disable Telegram 2FA. Please try again.', {
                position: 'top-center',
            });
        } catch (error) {
            console.error('Telegram 2FA disable error:', error);
            toast.error('Failed to disable Telegram 2FA. Please try again.', {
                position: 'top-center',
            });
        } finally {
            setIsDisabling(false);
        }
    };

    if (isFetchingCredential)
        return (
            <TabsContent value="security" className="flex-1">
                <Skeleton className="h-full rounded-xl" />
            </TabsContent>
        );

    return (
        <TabsContent value="security" className="space-y-4">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="font-semibold">Trusted Channels</CardTitle>
                            <CardDescription className="text-xs mt-1">
                                Choose where Kubis can send verification codes, security alerts and
                                important updates
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-muted-foreground cursor-not-allowed">
                                    Email
                                </Label>
                                <p className="text-muted-foreground text-xs">
                                    Primary channel for sign-in verification and account recovery
                                </p>
                            </div>
                            <Switch checked disabled />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="telegram-2fa-switch">
                                    Telegram
                                </Label>
                                <p className="text-muted-foreground text-xs">
                                    {telegram
                                        ? 'Optional channel for sign-in verification, security alerts and Kubis notifications'
                                        : 'Connect Telegram to receive verification codes, security alerts and Kubis notifications'}
                                </p>
                            </div>
                            <Switch
                                id="telegram-2fa-switch"
                                checked={!!telegram}
                                disabled={isRequestingSetup || isDisabling}
                                onCheckedChange={(checked) => {
                                    if (checked) {
                                        void requestTelegramSetup();
                                        return;
                                    }
                                    void disableTelegram2FA();
                                }}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="font-semibold">Session Preferences</CardTitle>
                            <CardDescription className="text-xs">
                                Configure your session timeout settings
                            </CardDescription>
                        </div>
                        <Badge variant="secondary">Coming Soon</Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-muted-foreground cursor-not-allowed">
                                Session Timeout
                            </Label>
                            <p className="text-muted-foreground text-xs">
                                How long before your session expires
                            </p>
                        </div>
                        <Select defaultValue="30" disabled>
                            <SelectTrigger className="w-40">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="15">15 minutes</SelectItem>
                                <SelectItem value="30">30 minutes</SelectItem>
                                <SelectItem value="60">60 minutes</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <TelegramTwoFactorDialog
                open={openSetupDialog}
                onOpenChange={(isOpen) => {
                    setOpenSetupDialog(isOpen);

                    if (!isOpen) {
                        setSetupLink('');
                    }
                }}
                setupLink={setupLink}
                isSetupExpired={isSetupExpired}
                countdownFormatted={countdownFormatted}
                onCancel={() => {
                    setOpenSetupDialog(false);
                    setSetupLink('');
                }}
                onRegenerate={() => {
                    void requestTelegramSetup();
                }}
            />
        </TabsContent>
    );
}
