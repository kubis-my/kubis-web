"use client";

import { IconTrendingUp, IconClock } from "@tabler/icons-react"
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/shadcn/components/card"
import { Badge } from "@/shadcn/components/badge"
import { useMyAccount } from "./my-account-container";

export function ActivityCard() {
    const ctx = useMyAccount()

    return (
        <Card className="@container/card">
            <CardHeader>
                <CardDescription>Recent Activity</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    {ctx.activityOverviewCard.activityThisWeek} actions
                </CardTitle>
                <CardAction>
                    <Badge variant="outline">
                        <IconTrendingUp />
                        {ctx.activityOverviewCard.trendPercentage.toFixed(1)}%
                    </Badge>
                </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                    {ctx.activityOverviewCard.recentActivityCount} actions this week <IconTrendingUp className="size-4" />
                </div>
                <div className="text-muted-foreground flex items-center gap-1.5">
                    <IconClock className="size-4" />
                    Last activity {ctx.activityOverviewCard.lastActivityTime}
                </div>
            </CardFooter>
        </Card>
    )
}
