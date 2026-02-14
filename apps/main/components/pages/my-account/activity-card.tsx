'use client';

import { IconClock } from '@tabler/icons-react';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shadcn/components/card';
import { useMyAccount } from './my-account-container';
import { Skeleton } from '@/shadcn/components/skeleton';

export function ActivityCard() {
    const ctx = useMyAccount();

    if (ctx.isLoading) return <Skeleton className="aspect-video rounded-xl" />;

    return (
        <Card className="@container/card">
            <CardHeader>
                <CardDescription>Recent Activity</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    {ctx.auditLog?.overview?.totalAction ?? 0}{' '}
                    {(ctx.auditLog?.overview?.totalAction ?? 0) > 1 ? 'actions' : 'action'}
                </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                    {ctx.auditLog?.overview?.totalWeekAction ?? 0}{' '}
                    {(ctx.auditLog?.overview?.totalWeekAction ?? 0) > 1 ? 'actions' : 'action'} this
                    week
                </div>
                <div className="text-muted-foreground flex items-center gap-1.5">
                    <IconClock className="size-4" />
                    {ctx.auditLog?.overview?.lastActivity
                        ? `Last activity ${ctx.auditLog?.overview?.lastActivity}`
                        : 'No activity yet'}
                </div>
            </CardFooter>
        </Card>
    );
}
