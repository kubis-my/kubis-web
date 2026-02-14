'use client';

import { IconShieldCheck } from '@tabler/icons-react';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shadcn/components/card';
import { Badge } from '@/shadcn/components/badge';
import { useYourDevice } from './your-device-container';
import { Skeleton } from '@/shadcn/components/skeleton';

export function SecurityStatusCard() {
    const { paginatedCredentialDevice, isFetchingCredentialDevice } = useYourDevice();

    const is2FAEnabled = paginatedCredentialDevice?.overview?.isEnable2FA ?? false;

    if (isFetchingCredentialDevice) return <Skeleton className="aspect-video rounded-xl" />;

    return (
        <Card className="@container/card">
            <CardHeader>
                <CardDescription>Security Status</CardDescription>

                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    <Badge
                        variant="outline"
                        className={
                            is2FAEnabled
                                ? 'border-green-600 text-green-600'
                                : 'border-red-600 text-red-600'
                        }
                    >
                        2FA {is2FAEnabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                </CardTitle>
            </CardHeader>

            <CardFooter className="flex flex-col items-start gap-1.5 text-sm">
                <div className="flex items-center gap-2 font-medium">
                    <IconShieldCheck className="size-4" />
                    Two-factor authentication {is2FAEnabled ? 'active' : 'inactive'}
                </div>

                <div className="text-muted-foreground">
                    {is2FAEnabled
                        ? 'All sessions are protected by 2FA.'
                        : 'Your sessions are not fully protected.'}
                </div>
            </CardFooter>
        </Card>
    );
}
