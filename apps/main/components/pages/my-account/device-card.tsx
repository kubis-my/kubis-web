"use client";

import { IconDeviceDesktop, IconClock } from "@tabler/icons-react"
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/shadcn/components/card"
import { useMyAccount } from "./my-account-container";

export function DeviceCard() {
    const ctx = useMyAccount();

    return (
        <Card className="@container/card">
            <CardHeader>
                <CardDescription>Your Devices</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    {ctx.deviceOverviewCard.totalDevices} devices
                </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                    <IconDeviceDesktop className="size-4" />
                    {ctx.deviceOverviewCard.lastActiveDevice}
                </div>
                <div className="text-muted-foreground flex items-center gap-1.5">
                    <IconClock className="size-4" />
                    {ctx.deviceOverviewCard.lastActiveTime}
                </div>
            </CardFooter>
        </Card>
    )
}
