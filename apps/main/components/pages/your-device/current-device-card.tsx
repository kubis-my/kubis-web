'use client';

import { IconDeviceDesktop } from '@tabler/icons-react';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shadcn/components/card';
import { useYourDevice } from './your-device-container';
import { Skeleton } from '@/shadcn/components/skeleton';

export function CurrentDeviceCard() {
    const ctx = useYourDevice();
    const current = ctx.paginatedCredentialDevice?.overview?.currentDevice;

    if (ctx.isFetchingCredentialDevice) return <Skeleton className="aspect-video rounded-xl" />;

    return (
        <Card className="@container/card">
            <CardHeader>
                <CardDescription>Current Device</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    {current?.os ?? 'Unknown'}
                </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                    <IconDeviceDesktop className="size-4" />
                    {current?.os ?? '-'}
                </div>
                <div className="text-muted-foreground flex items-center gap-1.5">
                    {current?.browser ?? '-'}
                </div>
            </CardFooter>
        </Card>
    );
}
