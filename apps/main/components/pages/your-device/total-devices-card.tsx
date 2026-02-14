'use client';

import { IconDevices } from '@tabler/icons-react';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shadcn/components/card';
import { useYourDevice } from './your-device-container';
import { Skeleton } from '@/shadcn/components/skeleton';

export function TotalDevicesCard() {
    const { paginatedCredentialDevice, isFetchingCredentialDevice } = useYourDevice();

    const overview = paginatedCredentialDevice?.overview;

    const totalDevices = overview?.totalDevices ?? 0;
    const activeLast24h = overview?.activeInLast24h ?? 0;
    const deviceTypeCount = overview?.deviceTypeCount ?? 0;

    if (isFetchingCredentialDevice) return <Skeleton className="aspect-video rounded-xl" />;

    return (
        <Card className="@container/card">
            <CardHeader>
                <CardDescription>Total Devices</CardDescription>

                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    {totalDevices} {totalDevices === 1 ? 'device' : 'devices'}
                </CardTitle>
            </CardHeader>

            <CardFooter className="flex flex-col items-start gap-1.5 text-sm">
                <div className="flex items-center gap-2 font-medium">
                    <IconDevices className="size-4" />
                    {activeLast24h} active in the last 24 hours
                </div>

                <div className="text-muted-foreground">
                    Across {deviceTypeCount} device {deviceTypeCount === 1 ? 'type' : 'types'}
                </div>
            </CardFooter>
        </Card>
    );
}
